"""Service layer for session management."""

import logging
from datetime import datetime, timedelta, timezone
from time import time

from sqlmodel import select

from app.config import settings
from app.db import get_session
from app.models.generated import GeneratedEstimate
from app.models.session import EstimateSession
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


def save_session_answers(session_id: str, answers: dict) -> None:
    """Save all answers to the session at final submission."""
    with get_session() as db:
        session = db.get(EstimateSession, session_id)
        if session:
            # Maintain _step8_categories which is dynamically stored before final submission
            existing_answers = session.answers or {}
            step8_cats = existing_answers.get("_step8_categories")
            if step8_cats is not None:
                answers["_step8_categories"] = step8_cats
                
            session.answers = answers
            session.updated_at = datetime.now(timezone.utc)
            db.commit()


def save_step8_categories(session_id: str, categories: dict[str, str]) -> None:
    """step8の feature value → category マッピングをセッションに保存する。"""
    with get_session() as db:
        session = db.get(EstimateSession, session_id)
        if session:
            answers = session.answers or {}
            answers["_step8_categories"] = categories
            session.answers = answers
            session.updated_at = datetime.now(timezone.utc)
            db.commit()


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
            # Delete related estimates
            estimates_stmt = select(GeneratedEstimate).where(
                GeneratedEstimate.session_id == session.id
            )
            for estimate in db.exec(estimates_stmt).all():
                db.delete(estimate)

            db.delete(session)
            _session_cache.pop(session.id, None)
            deleted_count += 1

        db.commit()

    logger.info("TTL cleanup: deleted %d expired sessions", deleted_count)
    return deleted_count
