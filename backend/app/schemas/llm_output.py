"""JSON Schema definitions and validation for LLM outputs."""

import logging
import re

import jsonschema

from app.core.pricing_engine import _BASE_PRICES

logger = logging.getLogger(__name__)

# Value must be lowercase English + underscores, 3-30 chars
_VALUE_RE = re.compile(r"^[a-z][a-z0-9_]{2,29}$")

# Max label length (in characters, not bytes)
_MAX_LABEL_LENGTH = 20

# Valid category names (must match _BASE_PRICES keys in pricing_engine)
_VALID_CATEGORIES: set[str] = set(_BASE_PRICES.keys())

DYNAMIC_QUESTIONS_SCHEMA: dict = {
    "type": "object",
    "required": [
        "step8_features",
    ],
    "properties": {
        "step8_features": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["value", "label", "category"],
                "properties": {
                    "value": {"type": "string"},
                    "label": {"type": "string"},
                    "category": {"type": "string"},
                },
            },
            "minItems": 3,
            "maxItems": 6,
        },
    },
}

ESTIMATE_GENERATION_SCHEMA: dict = {
    "type": "object",
    "required": [
        "project_name",
        "summary",
        "development_model_explanation",
        "features",
        "discussion_agenda",
        "total_cost",
        "confidence_note",
    ],
    "properties": {
        "project_name": {"type": "string"},
        "summary": {"type": "string"},
        "development_model_explanation": {"type": "string"},
        "features": {
            # 件数の上下限は意図的に設けない:
            # _enforce_calculated_prices() が直後に Pricing Engine の calc_features を
            # 主体に features を再構築する(不足分は category 名で補完、過剰分は切り捨て)
            # ため、LLM 出力段で件数を強制すると、ユーザーが Step8 で1〜2個しか選んで
            # いない正当ケースで毎回 fallback に落ちる事故を引き起こす。
            "type": "array",
            "items": {
                "type": "object",
                "required": ["name", "detail", "standard_price", "hybrid_price"],
                "properties": {
                    "name": {"type": "string"},
                    "detail": {"type": "string"},
                    "standard_price": {"type": "number"},
                    "hybrid_price": {"type": "number"},
                },
            },
            "minItems": 1,
        },
        "discussion_agenda": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 3,
            "maxItems": 5,
        },
        "total_cost": {
            "type": "object",
            "required": ["standard", "hybrid", "message"],
            "properties": {
                "standard": {"type": "number"},
                "hybrid": {"type": "number"},
                "message": {"type": "string"},
            },
        },
        "confidence_note": {"type": "string"},
    },
}


# Patterns that indicate placeholder/generic labels (e.g. "機能1の提案", "Feature A")
_PLACEHOLDER_RE = re.compile(
    r"機能\d|提案\d|機能[A-Za-z]|Feature\s*\d|おすすめ機能\d|機能\d+の提案",
)

# Patterns that indicate error/refusal messages used as labels
_REFUSAL_RE = re.compile(
    r"情報が不足|提供できません|判断できません|特定できません|情報が必要",
)


def validate_dynamic_questions(data: dict) -> bool:
    """Validate LLM output for dynamic questions (Steps 8-10).

    Rejects responses with:
    - Invalid schema structure
    - Placeholder-like or refusal labels
    - Invalid value format (must be lowercase snake_case, 3-30 chars)
    - Overly long labels (max 20 chars)
    """
    try:
        jsonschema.validate(instance=data, schema=DYNAMIC_QUESTIONS_SCHEMA)
    except jsonschema.ValidationError:
        return False

    for feature in data.get("step8_features", []):
        label = feature.get("label", "")
        value = feature.get("value", "")
        category = feature.get("category", "")

        # Reject placeholder or refusal labels
        if _PLACEHOLDER_RE.search(label):
            return False
        if _REFUSAL_RE.search(label):
            return False

        # Reject invalid value format
        if not _VALUE_RE.match(value):
            return False

        # Reject overly long labels
        if len(label) > _MAX_LABEL_LENGTH:
            return False

        # Reject invalid category
        if category not in _VALID_CATEGORIES:
            return False

    return True


def validate_estimate_output(data: dict) -> bool:
    """Validate LLM output for estimate generation.

    Checks JSON schema structure only. Financial accuracy is guaranteed
    by pricing_engine + _enforce_calculated_prices in the service layer.
    """
    try:
        jsonschema.validate(instance=data, schema=ESTIMATE_GENERATION_SCHEMA)
    except jsonschema.ValidationError as e:
        logger.warning(
            "Estimate schema validation failed: %s (path=%s)",
            e.message,
            list(e.absolute_path),
        )
        return False

    features = data.get("features", [])

    # Basic sanity: features must have numeric prices
    for i, feature in enumerate(features):
        sp = feature.get("standard_price", 0)
        hp = feature.get("hybrid_price", 0)
        if not isinstance(sp, (int, float)) or not isinstance(hp, (int, float)):
            logger.warning(
                "Non-numeric price at features[%d] (sp=%r, hp=%r)",
                i, sp, hp,
            )
            return False

    # 重複feature名の検出（早期returnで重複した名前を直接ログに残す）
    seen_names: set[str] = set()
    for f in features:
        name = f.get("name", "")
        if name in seen_names:
            logger.warning("Duplicate feature name detected: %r", name)
            return False
        seen_names.add(name)

    # 合計と内訳の整合性チェックは行わない: 直後に _enforce_calculated_prices
    # で全金額が Pricing Engine の決定的計算値に上書きされるため、LLM の
    # 算術精度に依存して検証する意味がない（LLMは算術が苦手で頻繁に落ちる）。

    return True
