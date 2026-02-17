"""Health check endpoint."""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter

from app.schemas.response import HealthResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Return the health status of the API with database connectivity check."""
    from app.db import get_session
    from app.models.session import EstimateSession
    from sqlmodel import select

    db_ok = True
    try:
        with get_session() as db:
            db.exec(select(EstimateSession).limit(1)).first()
    except Exception:
        logger.exception("Health check: database unavailable")
        db_ok = False

    return HealthResponse(
        status="ok" if db_ok else "degraded",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
