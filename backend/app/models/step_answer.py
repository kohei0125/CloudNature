from datetime import datetime, timezone
from typing import Optional, ClassVar

from sqlalchemy import UniqueConstraint
from sqlmodel import SQLModel, Field


class StepAnswer(SQLModel, table=True):
    """Stores a single step answer within an estimate session."""

    __tablename__ = "step_answers"
    __table_args__: ClassVar = (
        UniqueConstraint("session_id", "step_number", name="uq_session_step"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(foreign_key="estimate_sessions.id", index=True)
    step_number: int = Field(index=True)
    answer_value: str  # JSON string for arrays
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
