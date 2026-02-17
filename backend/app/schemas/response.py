from typing import Optional

from pydantic import BaseModel


class SessionResponse(BaseModel):
    """Response for session creation/retrieval."""

    session_id: str
    status: str


class StepResponse(BaseModel):
    """Response after submitting a step answer."""

    success: bool
    next_step: int
    ai_options: Optional[dict] = None


class EstimateResultResponse(BaseModel):
    """Response for estimate generation result polling."""

    status: str
    estimate: Optional[dict] = None


class HealthResponse(BaseModel):
    """Response for health check endpoint."""

    status: str
    timestamp: str
