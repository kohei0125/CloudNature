"""Service layer for estimate generation with LLM integration."""

import json
import logging
import time

from app.config import settings
from app.core.llm.factory import create_llm_adapter
from app.core.pricing_engine import calculate_estimate as calculate_pricing
from app.core.sanitizer import sanitize_for_llm
from app.db import get_session
from app.models.generated import GeneratedEstimate
from app.schemas.llm_output import validate_dynamic_questions, validate_estimate_output
from app.services.session_service import (
    get_estimate_session,
    save_session_answers,
    save_step8_categories,
    save_step8_labels,
    update_session_status,
)

logger = logging.getLogger(__name__)

_llm = create_llm_adapter(settings)


def _enforce_calculated_prices(llm_output: dict, calculated_data: dict) -> dict:
    """LLM出力の金額をcalculated値で上書きし、正確性を保証する。

    LLMが返すfeature数がcalculated数と異なる場合も、
    内訳と合計が常に一致するよう再構成する。
    """
    calc_features = calculated_data.get("features", [])
    llm_features = llm_output.get("features", [])

    enforced_features: list[dict] = []
    for i, cf in enumerate(calc_features):
        if i < len(llm_features):
            # LLMが生成したname/detailを活かし、金額だけ上書き
            f = llm_features[i].copy()
        else:
            # LLMがfeatureを少なく返した場合、categoryから補完
            f = {
                "name": cf.get("category", "機能"),
                "detail": "業務効率化を支援する機能",
            }
        f["standard_price"] = cf["standard_price"]
        f["hybrid_price"] = cf["hybrid_price"]
        enforced_features.append(f)

    llm_output["features"] = enforced_features
    llm_output["total_cost"]["standard"] = calculated_data["total_standard"]
    llm_output["total_cost"]["hybrid"] = calculated_data["total_hybrid"]

    # 精度データを保証
    llm_output["confidence"] = calculated_data.get("confidence", {})

    # user_inputを保持（メール送信時の業種表示等に必要）
    llm_output["user_input"] = calculated_data.get("user_input", {})

    return llm_output


def _log_audit_diff(original: dict, audited: dict) -> None:
    """監査前後の差分をログに記録する。"""
    diffs: list[str] = []
    for key in ("project_name", "summary", "confidence_note"):
        if original.get(key) != audited.get(key):
            diffs.append(f"{key}: changed")

    orig_features = original.get("features", [])
    audit_features = audited.get("features", [])
    for i, (of, af) in enumerate(zip(orig_features, audit_features)):
        for field in ("name", "detail"):
            if of.get(field) != af.get(field):
                diffs.append(f"features[{i}].{field}: changed")

    orig_agenda = original.get("discussion_agenda", [])
    audit_agenda = audited.get("discussion_agenda", [])
    if orig_agenda != audit_agenda:
        diffs.append("discussion_agenda: changed")

    orig_msg = original.get("total_cost", {}).get("message")
    audit_msg = audited.get("total_cost", {}).get("message")
    if orig_msg != audit_msg:
        diffs.append("total_cost.message: changed")

    if diffs:
        logger.info("Audit diff: %s", ", ".join(diffs))
    else:
        logger.info("Audit: no text changes")


async def _audit_estimate(
    estimate_data: dict,
    calculated_data: dict,
    start_time: float,
) -> dict:
    """第3回AIチェック: 品質監査と修正。失敗時は元データをそのまま返す。"""
    if not settings.audit_enabled:
        return estimate_data

    # 経過80秒超で監査をスキップ（120秒タイムアウト内の安全策）
    elapsed = time.time() - start_time
    if elapsed > 80:
        logger.warning("Skipping audit: elapsed %.1fs > 80s", elapsed)
        return estimate_data

    try:
        audited = await _llm.audit_estimate(estimate_data, calculated_data)

        if not validate_estimate_output(audited):
            logger.warning("Audit output validation failed, using original")
            return estimate_data

        # 金額を再度上書きして安全性を二重保証
        audited = _enforce_calculated_prices(audited, calculated_data)

        # audit_warnings をログに記録（お客様には返さない）
        warnings = audited.pop("audit_warnings", [])
        if warnings:
            logger.info("Audit warnings: %s", warnings)

        _log_audit_diff(estimate_data, audited)
        return audited
    except Exception:
        logger.exception("Audit failed, using original")
        return estimate_data


def _normalize_answers(answers: dict) -> dict:
    """Normalize frontend answers dict to step_N keyed format for LLM."""
    normalized = {}
    for key, value in answers.items():
        # Accept both "1" and "step_1" style keys
        if key.startswith("step_"):
            normalized[key] = value
        else:
            normalized[f"step_{key}"] = value
    return normalized


async def generate_dynamic_questions(
    session_id: str, answers: dict
) -> dict | None:
    """Generate AI-powered dynamic questions for Steps 8-10.

    Retries up to LLM_MAX_RETRIES times with JSON schema validation.
    Falls back to template on failure.
    Saves feature → category mapping to session for later pricing use.
    """
    normalized = _normalize_answers(answers)
    sanitized = sanitize_for_llm(normalized)

    # Build context from all static steps (1-7)
    context = {
        "business_type": sanitized.get("step_1", ""),
        "industry": sanitized.get("step_2", ""),
        "user_count": sanitized.get("step_3", ""),
        "challenges": sanitized.get("step_4", ""),
        "deployment_target": sanitized.get("step_5", ""),
        "system_type": sanitized.get("step_6", ""),
        "development_type": sanitized.get("step_7", ""),
    }

    for attempt in range(settings.llm_max_retries):
        try:
            result = await _llm.generate_dynamic_questions(
                user_overview=str(context.get("challenges", "")),
                system_type=str(context.get("system_type", "")),
                context=context,
            )
            if validate_dynamic_questions(result):
                # value → category マッピングをセッションに保存
                categories = {
                    f["value"]: f["category"]
                    for f in result.get("step8_features", [])
                }
                save_step8_categories(session_id, categories)
                # value → label マッピングもセッションに保存（Notion表示用）
                labels = {
                    f["value"]: f["label"]
                    for f in result.get("step8_features", [])
                    if f.get("label")
                }
                save_step8_labels(session_id, labels)
                return result
            logger.warning(
                "Dynamic questions validation failed (attempt %d/%d)",
                attempt + 1,
                settings.llm_max_retries,
            )
        except Exception:
            logger.error(
                "LLM error generating dynamic questions (attempt %d/%d)",
                attempt + 1,
                settings.llm_max_retries,
            )

    # Fallback: use the fallback adapter directly
    from app.core.llm.fallback import FallbackAdapter

    fallback = FallbackAdapter()
    result = await fallback.generate_dynamic_questions(
        user_overview=str(context.get("challenges", "")),
        system_type=str(context.get("system_type", "")),
        context=context,
    )
    if result:
        categories = {
            f["value"]: f["category"]
            for f in result.get("step8_features", [])
        }
        save_step8_categories(session_id, categories)
        labels = {
            f["value"]: f["label"]
            for f in result.get("step8_features", [])
            if f.get("label")
        }
        save_step8_labels(session_id, labels)
    return result


async def generate_estimate(session_id: str, answers: dict) -> dict | None:
    """Generate a full estimate for a session.

    1. Calculate pricing deterministically via pricing_engine
    2. Pass calculated data to LLM for text generation only
    3. Enforce calculated prices on LLM output for accuracy
    """
    start_time = time.time()

    # Save answers to session
    save_session_answers(session_id, answers)

    # Create a processing record
    with get_session() as db:
        record = GeneratedEstimate(session_id=session_id, status="processing")
        db.add(record)
        db.commit()
        db.refresh(record)
        record_id = record.id

    normalized = _normalize_answers(answers)
    sanitized = sanitize_for_llm(normalized)

    # セッションから保存済みカテゴリ・ラベルを取得してマージ
    session = get_estimate_session(session_id)
    if session and session.answers:
        step8_cats = session.answers.get("_step8_categories", {})
        sanitized["step_8_categories"] = step8_cats
        step8_labels = session.answers.get("_step8_labels", {})
        sanitized["step_8_labels"] = step8_labels

    # Step 1: Deterministic pricing calculation
    calculated_data = calculate_pricing(sanitized)

    # Step 2: LLM generates text content only
    result = None
    for attempt in range(settings.llm_max_retries):
        try:
            result = await _llm.generate_estimate(calculated_data=calculated_data)
            if validate_estimate_output(result):
                # Step 3: Enforce calculated prices (overwrite any LLM deviations)
                result = _enforce_calculated_prices(result, calculated_data)
                break
            logger.warning(
                "Estimate validation failed (attempt %d/%d) for session %s",
                attempt + 1,
                settings.llm_max_retries,
                session_id,
            )
            result = None
        except Exception:
            logger.error(
                "LLM error generating estimate (attempt %d/%d) for session %s",
                attempt + 1,
                settings.llm_max_retries,
                session_id,
            )

    # Fallback if all retries failed
    if result is None:
        from app.core.llm.fallback import FallbackAdapter

        fallback = FallbackAdapter()
        result = await fallback.generate_estimate(calculated_data=calculated_data)

    # Step 4: 第3回AIチェック（品質監査）
    result = await _audit_estimate(result, calculated_data, start_time)

    # Save result
    with get_session() as db:
        record = db.get(GeneratedEstimate, record_id)
        if record:
            record.raw_json = json.dumps(result, ensure_ascii=False)
            record.status = "completed"
            db.commit()

    update_session_status(session_id, "completed")
    return result


def get_estimate_result(session_id: str) -> tuple[str, dict | None]:
    """Get the latest estimate result for a session.

    Returns (status, estimate_dict_or_none).
    """
    from sqlmodel import select

    with get_session() as db:
        statement = (
            select(GeneratedEstimate)
            .where(GeneratedEstimate.session_id == session_id)
            .order_by(GeneratedEstimate.created_at.desc())  # type: ignore[union-attr]
        )
        record = db.exec(statement).first()

    if record is None:
        return ("not_found", None)

    if record.status == "completed" and record.raw_json:
        try:
            return ("completed", json.loads(record.raw_json))
        except json.JSONDecodeError:
            return ("error", None)

    return (record.status, None)
