"""Estimate API endpoints."""

import logging

from fastapi import APIRouter, HTTPException

from app.schemas.request import (
    CreateSessionRequest,
    GenerateEstimateRequest,
    SubmitStepRequest,
)
from app.schemas.response import (
    EstimateResultResponse,
    SessionResponse,
    StepResponse,
)
from app.services import estimate_service, session_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/estimate", tags=["estimate"])


@router.post("/session", response_model=SessionResponse)
async def create_session(
    _body: CreateSessionRequest | None = None,
) -> SessionResponse:
    """Create a new estimate session."""
    return session_service.create_session()


@router.get("/session/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str) -> SessionResponse:
    """Get an existing estimate session."""
    session = session_service.get_estimate_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return SessionResponse(session_id=session.id, status=session.status)


@router.post("/step", response_model=StepResponse)
async def submit_step(
    request: SubmitStepRequest,
) -> StepResponse:
    """Submit a step answer.

    If step 7 is completed, triggers AI dynamic question generation
    using the answers provided in the request body.
    """
    session = session_service.get_session_cached(request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    next_step = request.step_number + 1
    ai_options = None

    # Step 7: generate AI dynamic questions from answers in request body
    if request.step_number == 7 and request.answers:
        try:
            ai_options = await estimate_service.generate_dynamic_questions(
                request.answers
            )
        except Exception:
            logger.exception("Failed to generate dynamic questions")

    return StepResponse(
        success=True,
        next_step=next_step,
        ai_options=ai_options,
    )


@router.post("/generate", response_model=EstimateResultResponse)
async def generate_estimate(
    request: GenerateEstimateRequest,
) -> EstimateResultResponse:
    """Trigger estimate generation for a session."""
    session = session_service.get_estimate_session(request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    result = await estimate_service.generate_estimate(
        request.session_id, request.answers
    )
    if result:
        return EstimateResultResponse(status="completed", estimate=result)

    return EstimateResultResponse(status="processing")


@router.get("/result/{session_id}", response_model=EstimateResultResponse)
async def get_estimate_result(session_id: str) -> EstimateResultResponse:
    """Poll for estimate generation result."""
    session = session_service.get_estimate_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    status, estimate = estimate_service.get_estimate_result(session_id)
    return EstimateResultResponse(status=status, estimate=estimate)
