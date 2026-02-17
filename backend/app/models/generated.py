from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field


class GeneratedEstimate(SQLModel, table=True):
    """Stores a generated estimate result."""

    __tablename__ = "generated_estimates"

    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(foreign_key="estimate_sessions.id", index=True)
    raw_json: str = Field(default="")  # Full JSON response from LLM
    status: str = Field(default="processing")  # processing / completed / error
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
