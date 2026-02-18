from pydantic import BaseModel, Field, field_validator


_MAX_ANSWER_KEYS = 13
_MAX_ANSWER_STR_LEN = 5000
_MAX_ANSWER_LIST_ITEMS = 50
_MAX_ANSWER_ITEM_LEN = 500


def _validate_answers_dict(v: dict[str, str | list[str]]) -> dict[str, str | list[str]]:
    if len(v) > _MAX_ANSWER_KEYS:
        raise ValueError(f"answers must have at most {_MAX_ANSWER_KEYS} keys")
    for key, val in v.items():
        if not key.isdigit() or not (1 <= int(key) <= _MAX_ANSWER_KEYS):
            raise ValueError(f"answers key must be a number 1-{_MAX_ANSWER_KEYS}, got '{key}'")
        if isinstance(val, str):
            if len(val) > _MAX_ANSWER_STR_LEN:
                raise ValueError(f"answers[{key}] must be at most {_MAX_ANSWER_STR_LEN} characters")
        elif isinstance(val, list):
            if len(val) > _MAX_ANSWER_LIST_ITEMS:
                raise ValueError(f"answers[{key}] list must have at most {_MAX_ANSWER_LIST_ITEMS} items")
            for item in val:
                if not isinstance(item, str) or len(item) > _MAX_ANSWER_ITEM_LEN:
                    raise ValueError(f"each item in answers[{key}] must be a string of at most {_MAX_ANSWER_ITEM_LEN} characters")
    return v


class CreateSessionRequest(BaseModel):
    """Request body for creating a new estimate session."""
    pass


class SubmitStepRequest(BaseModel):
    """Request body for submitting a step answer."""

    session_id: str = Field(min_length=1, max_length=50, pattern=r"^[a-f0-9-]+$")
    step_number: int = Field(ge=1, le=13)
    value: str | list[str]
    answers: dict[str, str | list[str]] | None = None

    @field_validator("value")
    @classmethod
    def validate_value(cls, v: str | list[str]) -> str | list[str]:
        if isinstance(v, str):
            if len(v) > _MAX_ANSWER_STR_LEN:
                raise ValueError(f"value must be at most {_MAX_ANSWER_STR_LEN} characters")
        elif isinstance(v, list):
            if len(v) > _MAX_ANSWER_LIST_ITEMS:
                raise ValueError(f"value list must have at most {_MAX_ANSWER_LIST_ITEMS} items")
            for item in v:
                if not isinstance(item, str) or len(item) > _MAX_ANSWER_ITEM_LEN:
                    raise ValueError(f"each value item must be a string of at most {_MAX_ANSWER_ITEM_LEN} characters")
        return v

    @field_validator("answers")
    @classmethod
    def validate_answers(cls, v: dict[str, str | list[str]] | None) -> dict[str, str | list[str]] | None:
        if v is not None:
            _validate_answers_dict(v)
        return v


class GenerateEstimateRequest(BaseModel):
    """Request body for triggering estimate generation."""

    session_id: str = Field(min_length=1, max_length=50, pattern=r"^[a-f0-9-]+$")
    answers: dict[str, str | list[str]]

    @field_validator("answers")
    @classmethod
    def validate_answers(cls, v: dict[str, str | list[str]]) -> dict[str, str | list[str]]:
        return _validate_answers_dict(v)
