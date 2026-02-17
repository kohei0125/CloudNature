"""JSON Schema definitions and validation for LLM outputs."""

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


def validate_dynamic_questions(data: dict) -> bool:
    """Validate LLM output for dynamic questions (Steps 8-10)."""
    try:
        jsonschema.validate(instance=data, schema=DYNAMIC_QUESTIONS_SCHEMA)
        return True
    except jsonschema.ValidationError:
        return False


def validate_estimate_output(data: dict) -> bool:
    """Validate LLM output for estimate generation."""
    try:
        jsonschema.validate(instance=data, schema=ESTIMATE_GENERATION_SCHEMA)
        return True
    except jsonschema.ValidationError:
        return False
