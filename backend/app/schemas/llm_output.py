"""JSON Schema definitions and validation for LLM outputs."""

import re

import jsonschema

from app.core.pricing_engine import _BASE_PRICES

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
        "phase_summary",
        "confidence_note",
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
        "phase_summary": {"type": "string"},
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
    except jsonschema.ValidationError:
        return False

    # Basic sanity: features must have numeric prices
    for feature in data.get("features", []):
        sp = feature.get("standard_price", 0)
        hp = feature.get("hybrid_price", 0)
        if not isinstance(sp, (int, float)) or not isinstance(hp, (int, float)):
            return False

    return True
