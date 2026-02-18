"""JSON Schema definitions and validation for LLM outputs."""

import re

import jsonschema

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
            "minItems": 3,
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
            "minItems": 1,
        },
        "discussion_agenda": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
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
    r"不足|提供できません|判断できません|特定できません|情報が必要",
)


def validate_dynamic_questions(data: dict) -> bool:
    """Validate LLM output for dynamic questions (Steps 8-10).

    Rejects responses with placeholder-like labels.
    """
    try:
        jsonschema.validate(instance=data, schema=DYNAMIC_QUESTIONS_SCHEMA)
    except jsonschema.ValidationError:
        return False

    # Reject placeholder or refusal labels
    for feature in data.get("step8_features", []):
        label = feature.get("label", "")
        if _PLACEHOLDER_RE.search(label):
            return False
        if _REFUSAL_RE.search(label):
            return False

    return True


def validate_estimate_output(data: dict) -> bool:
    """Validate LLM output for estimate generation."""
    try:
        jsonschema.validate(instance=data, schema=ESTIMATE_GENERATION_SCHEMA)
        return True
    except jsonschema.ValidationError:
        return False
