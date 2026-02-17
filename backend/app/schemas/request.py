from pydantic import BaseModel, Field, field_validator


class CreateSessionRequest(BaseModel):
    """Request body for creating a new estimate session."""
    pass


class SubmitStepRequest(BaseModel):
    """Request body for submitting a step answer."""

    session_id: str = Field(min_length=1, max_length=50, pattern=r"^[a-f0-9-]+$")
    step_number: int = Field(ge=1, le=13)
    value: str | list[str]

    @field_validator("value")
    @classmethod
    def validate_value(cls, v: str | list[str]) -> str | list[str]:
        if isinstance(v, str):
            if len(v) > 5000:
                raise ValueError("value must be at most 5000 characters")
        elif isinstance(v, list):
            if len(v) > 50:
                raise ValueError("value list must have at most 50 items")
            for item in v:
                if not isinstance(item, str) or len(item) > 500:
                    raise ValueError("each value item must be a string of at most 500 characters")
        return v


class GenerateEstimateRequest(BaseModel):
    """Request body for triggering estimate generation."""

    session_id: str = Field(min_length=1, max_length=50, pattern=r"^[a-f0-9-]+$")
