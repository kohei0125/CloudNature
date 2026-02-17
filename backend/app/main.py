"""FastAPI application entry point."""

import logging
import time
from collections import defaultdict
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.db import create_db_and_tables
from app.api.v1.router import api_router

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Rate limiter (in-memory, per-IP)
# ---------------------------------------------------------------------------
class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple sliding-window rate limiter per client IP."""

    def __init__(self, app: FastAPI, max_requests: int = 60, window_seconds: int = 60) -> None:
        super().__init__(app)
        self.max_requests = max_requests
        self.window = window_seconds
        self._hits: dict[str, list[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):  # type: ignore[override]
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        # Prune old entries
        self._hits[client_ip] = [t for t in self._hits[client_ip] if now - t < self.window]
        if len(self._hits[client_ip]) >= self.max_requests:
            raise HTTPException(status_code=429, detail="Too many requests")
        self._hits[client_ip].append(now)
        return await call_next(request)


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Application lifespan: create DB tables on startup, cleanup on shutdown."""
    import asyncio
    from app.tasks.cleanup import run_cleanup

    create_db_and_tables()

    # Run initial cleanup on startup
    run_cleanup()

    # Background TTL cleanup task (every 6 hours)
    async def _periodic_cleanup() -> None:
        while True:
            await asyncio.sleep(6 * 3600)
            try:
                run_cleanup()
            except Exception:
                logger.exception("Periodic cleanup failed")

    cleanup_task = asyncio.create_task(_periodic_cleanup())

    yield

    # Graceful shutdown
    cleanup_task.cancel()
    _mark_stale_processing_records()


def _mark_stale_processing_records() -> None:
    """Mark any estimate records stuck in 'processing' as 'error'."""
    from sqlmodel import select
    from app.db import get_session
    from app.models.generated import GeneratedEstimate

    try:
        with get_session() as db:
            statement = select(GeneratedEstimate).where(
                GeneratedEstimate.status == "processing"
            )
            stale = db.exec(statement).all()
            for record in stale:
                record.status = "error"
            if stale:
                db.commit()
                logger.info("Marked %d stale processing records as error on shutdown", len(stale))
    except Exception:
        logger.exception("Failed to clean up stale records on shutdown")


class ApiKeyMiddleware(BaseHTTPMiddleware):
    """Verify X-API-Key header when API_KEY is configured."""

    async def dispatch(self, request: Request, call_next):  # type: ignore[override]
        if request.url.path == "/api/v1/health":
            return await call_next(request)
        if settings.api_key:
            provided = request.headers.get("X-API-Key", "")
            if provided != settings.api_key:
                from starlette.responses import JSONResponse

                return JSONResponse(
                    status_code=403,
                    content={"detail": "Invalid API key"},
                )
        return await call_next(request)


app = FastAPI(
    title="CloudNature Estimate API",
    version="0.1.0",
    lifespan=lifespan,
)

# Middleware order: CORS → ApiKey → RateLimit
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization", "X-API-Key"],
    max_age=3600,
)

app.add_middleware(ApiKeyMiddleware)

# Rate limit: 60 requests per minute per IP
app.add_middleware(RateLimitMiddleware, max_requests=60, window_seconds=60)

app.include_router(api_router, prefix="/api/v1")
