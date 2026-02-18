import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column
from sqlalchemy.types import JSON
from sqlmodel import SQLModel, Field


class EstimateSession(SQLModel, table=True):
    """Represents an estimate wizard session."""

    __tablename__ = "estimate_sessions"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
    )
    status: str = Field(default="in_progress")
    # TODO: Remove email column when migrating to PostgreSQL (unused after step_answers refactor)
    email: Optional[str] = Field(default=None)
    answers: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
