"""JSON Schema definitions and validation for LLM outputs."""

import re

import jsonschema

# Value must be lowercase English + underscores, 3-30 chars
_VALUE_RE = re.compile(r"^[a-z][a-z0-9_]{2,29}$")

# Max label length (in characters, not bytes)
_MAX_LABEL_LENGTH = 20

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
                "required": ["value", "label"],
                "properties": {
                    "value": {"type": "string"},
                    "label": {"type": "string"},
                },
            },
            "minItems": 5,
            "maxItems": 7,
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
    ],
    "properties": {
        "project_name": {"type": "string"},
        "summary": {"type": "string"},
        "development_model_explanation": {"type": "string"},
        "features": {
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
            "minItems": 3,
            "maxItems": 8,
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

    return True


# Tolerance for hybrid_price ratio check (standard_price * 0.6 ± tolerance)
_HYBRID_RATIO_TOLERANCE = 0.12  # Allow 48%~72% of standard_price


def validate_estimate_output(data: dict) -> bool:
    """Validate LLM output for estimate generation.

    Checks:
    - JSON schema structure
    - hybrid_price is approximately 60% of standard_price per feature
    - total_cost matches sum of individual feature prices
    """
    try:
        jsonschema.validate(instance=data, schema=ESTIMATE_GENERATION_SCHEMA)
    except jsonschema.ValidationError:
        return False

    features = data.get("features", [])
    total_cost = data.get("total_cost", {})

    expected_standard = 0
    expected_hybrid = 0

    for feature in features:
        sp = feature.get("standard_price", 0)
        hp = feature.get("hybrid_price", 0)

        if not isinstance(sp, (int, float)) or not isinstance(hp, (int, float)):
            return False

        # Check hybrid_price is approximately 60% of standard_price
        if sp > 0:
            ratio = hp / sp
            if not (0.6 - _HYBRID_RATIO_TOLERANCE <= ratio <= 0.6 + _HYBRID_RATIO_TOLERANCE):
                return False

        expected_standard += sp
        expected_hybrid += hp

    # Check total_cost consistency (allow 1% tolerance for rounding)
    actual_standard = total_cost.get("standard", 0)
    actual_hybrid = total_cost.get("hybrid", 0)

    if expected_standard > 0:
        if abs(actual_standard - expected_standard) / expected_standard > 0.01:
            return False
    if expected_hybrid > 0:
        if abs(actual_hybrid - expected_hybrid) / expected_hybrid > 0.01:
            return False

    return True
