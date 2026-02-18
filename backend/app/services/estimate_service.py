"""Service layer for estimate generation with LLM integration."""

import json
import logging

from app.config import settings
from app.core.llm.factory import create_llm_adapter
from app.core.sanitizer import sanitize_for_llm
from app.db import get_session
from app.models.generated import GeneratedEstimate
from app.services.session_service import save_session_answers, update_session_status

logger = logging.getLogger(__name__)

_llm = create_llm_adapter(settings)

# Financial validation limits
_MIN_HYBRID_TOTAL = 300_000  # 30万円
_MAX_FEATURE_PRICE = 100_000_000  # 1億円
_MAX_TOTAL_PRICE = 500_000_000  # 5億円


def _validate_estimate_financials(data: dict) -> bool:
    """Validate that LLM-generated prices are within reasonable bounds."""
    features = data.get("features", [])
    for feature in features:
        sp = feature.get("standard_price", 0)
        hp = feature.get("hybrid_price", 0)
        if not isinstance(sp, (int, float)) or not isinstance(hp, (int, float)):
            return False
        if sp < 0 or hp < 0:
            return False
        if sp > _MAX_FEATURE_PRICE or hp > _MAX_FEATURE_PRICE:
            return False
        if hp > sp:
            return False

    total = data.get("total_cost", {})
    for key in ("standard", "hybrid"):
        val = total.get(key, 0)
        if not isinstance(val, (int, float)) or val < 0 or val > _MAX_TOTAL_PRICE:
            return False

    # Minimum hybrid total: 30万円
    hybrid_total = total.get("hybrid", 0)
    if isinstance(hybrid_total, (int, float)) and hybrid_total < _MIN_HYBRID_TOTAL:
        return False

    return True


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


async def generate_dynamic_questions(answers: dict) -> dict | None:
    """Generate AI-powered dynamic questions for Steps 8-10.

    Retries up to LLM_MAX_RETRIES times with JSON schema validation.
    Falls back to template on failure.
    """
    normalized = _normalize_answers(answers)
    sanitized = sanitize_for_llm(normalized)

    # Build context from all static steps (1-7)
    context = {
        "business_type": sanitized.get("step_1", ""),
        "industry": sanitized.get("step_2", ""),
        "employee_size": sanitized.get("step_3", ""),
        "challenges": sanitized.get("step_4", ""),
        "deployment_target": sanitized.get("step_5", ""),
        "system_type": sanitized.get("step_6", ""),
        "development_type": sanitized.get("step_7", ""),
    }

    from app.schemas.llm_output import validate_dynamic_questions

    for attempt in range(settings.llm_max_retries):
        try:
            result = await _llm.generate_dynamic_questions(
                user_overview=str(context.get("challenges", "")),
                system_type=str(context.get("system_type", "")),
                context=context,
            )
            if validate_dynamic_questions(result):
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
    return await fallback.generate_dynamic_questions(
        user_overview=str(context.get("challenges", "")),
        system_type=str(context.get("system_type", "")),
        context=context,
    )


async def generate_estimate(session_id: str, answers: dict) -> dict | None:
    """Generate a full estimate for a session.

    Stores the result in the database and updates session status.
    Retries up to LLM_MAX_RETRIES times with JSON schema + financial validation.
    """
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

    from app.schemas.llm_output import validate_estimate_output

    result = None
    for attempt in range(settings.llm_max_retries):
        try:
            result = await _llm.generate_estimate(user_input_history=sanitized)
            if validate_estimate_output(result) and _validate_estimate_financials(result):
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
        result = await fallback.generate_estimate(user_input_history=sanitized)

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
