"""Service layer for session management."""

import json
import logging
from datetime import datetime, timedelta, timezone
from time import time

from sqlmodel import select

from app.config import settings
from app.db import get_session
from app.models.generated import GeneratedEstimate
from app.models.session import EstimateSession
from app.models.step_answer import StepAnswer
from app.schemas.response import SessionResponse

logger = logging.getLogger(__name__)

# In-memory cache for session existence checks
_session_cache: dict[str, float] = {}
_CACHE_TTL = 300  # 5 minutes


def get_session_cached(session_id: str) -> EstimateSession | None:
    """Get session with in-memory TTL cache to reduce DB lookups."""
    now = time()
    if session_id in _session_cache and now - _session_cache[session_id] < _CACHE_TTL:
        return EstimateSession(id=session_id, status="in_progress")
    session = get_estimate_session(session_id)
    if session:
        _session_cache[session_id] = now
    return session


def create_session() -> SessionResponse:
    """Create a new estimate session."""
    session = EstimateSession()
    with get_session() as db:
        db.add(session)
        db.commit()
        db.refresh(session)
    _session_cache[session.id] = time()
    return SessionResponse(session_id=session.id, status=session.status)


def get_estimate_session(session_id: str) -> EstimateSession | None:
    """Retrieve a session by ID."""
    with get_session() as db:
        return db.get(EstimateSession, session_id)


def save_step_answer(session_id: str, step_number: int, value: str | list[str]) -> None:
    """Save or update a step answer for a session."""
    answer_value = json.dumps(value, ensure_ascii=False) if isinstance(value, list) else value

    with get_session() as db:
        # Check for existing answer at this step
        statement = select(StepAnswer).where(
            StepAnswer.session_id == session_id,
            StepAnswer.step_number == step_number,
        )
        existing = db.exec(statement).first()

        if existing:
            existing.answer_value = answer_value
        else:
            answer = StepAnswer(
                session_id=session_id,
                step_number=step_number,
                answer_value=answer_value,
            )
            db.add(answer)

        # Update session timestamp
        session = db.get(EstimateSession, session_id)
        if session:
            session.updated_at = datetime.now(timezone.utc)

        db.commit()


def get_all_answers(session_id: str) -> list[StepAnswer]:
    """Get all step answers for a session, ordered by step number."""
    with get_session() as db:
        statement = (
            select(StepAnswer)
            .where(StepAnswer.session_id == session_id)
            .order_by(StepAnswer.step_number)
        )
        return list(db.exec(statement).all())


def get_answers_as_dict(session_id: str) -> dict:
    """Get all step answers as a dictionary keyed by step number."""
    answers = get_all_answers(session_id)
    result = {}
    for answer in answers:
        try:
            result[f"step_{answer.step_number}"] = json.loads(answer.answer_value)
        except (json.JSONDecodeError, TypeError):
            result[f"step_{answer.step_number}"] = answer.answer_value
    return result


def update_session_status(session_id: str, status: str) -> None:
    """Update the status of a session."""
    with get_session() as db:
        session = db.get(EstimateSession, session_id)
        if session:
            session.status = status
            session.updated_at = datetime.now(timezone.utc)
            db.commit()


def check_ttl() -> int:
    """Delete expired sessions and return count of deleted sessions."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=settings.data_ttl_days)
    deleted_count = 0

    with get_session() as db:
        statement = select(EstimateSession).where(
            EstimateSession.created_at < cutoff
        )
        expired_sessions = db.exec(statement).all()

        for session in expired_sessions:
            # Delete related step answers
            answers_stmt = select(StepAnswer).where(
                StepAnswer.session_id == session.id
            )
            for answer in db.exec(answers_stmt).all():
                db.delete(answer)

            # Delete related estimates
            estimates_stmt = select(GeneratedEstimate).where(
                GeneratedEstimate.session_id == session.id
            )
            for estimate in db.exec(estimates_stmt).all():
                db.delete(estimate)

            db.delete(session)
            deleted_count += 1

        db.commit()

    logger.info("TTL cleanup: deleted %d expired sessions", deleted_count)
    return deleted_count
