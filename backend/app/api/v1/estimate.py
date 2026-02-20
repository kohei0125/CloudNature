"""Estimate API endpoints."""

import json
import logging

from fastapi import APIRouter, BackgroundTasks, HTTPException

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


def _parse_contact(answers: dict) -> dict:
    """Extract contact info from step 13 answer.

    Returns dict with name, company, email keys (empty strings as defaults).
    """
    raw = answers.get("13", answers.get("step_13", ""))
    if not raw:
        return {"name": "", "company": "", "email": ""}
    try:
        parsed = json.loads(raw) if isinstance(raw, str) else raw
        return {
            "name": parsed.get("name", ""),
            "company": parsed.get("company", ""),
            "email": parsed.get("email", ""),
        }
    except (json.JSONDecodeError, AttributeError):
        return {"name": "", "company": "", "email": ""}


async def _send_emails(estimate_data: dict, answers: dict) -> None:
    """Background task: generate PDF and send emails to customer and operator."""
    from app.services.email_service import (
        send_estimate_email,
        send_estimate_notification,
    )
    from app.services.pdf_service import fetch_pdf_from_frontend

    contact = _parse_contact(answers)
    customer_email = contact["email"]
    if not customer_email:
        logger.warning("No customer email found in answers, skipping email send")
        return

    # Generate PDF (failure is non-fatal — emails are sent without attachment)
    pdf_data = await fetch_pdf_from_frontend(
        estimate_data, client_name=contact["name"]
    )
    if not pdf_data:
        logger.warning("PDF generation failed, sending emails without attachment")

    # Send customer email
    await send_estimate_email(customer_email, pdf_data=pdf_data)

    # Send operator notification
    await send_estimate_notification(
        client_name=contact["name"],
        client_company=contact["company"],
        client_email=customer_email,
        pdf_data=pdf_data,
    )


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
    background_tasks: BackgroundTasks,
) -> EstimateResultResponse:
    """Trigger estimate generation for a session."""
    session = session_service.get_estimate_session(request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    result = await estimate_service.generate_estimate(
        request.session_id, request.answers
    )
    if result:
        background_tasks.add_task(_send_emails, result, request.answers)
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
