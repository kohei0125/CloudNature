import logging
from contextlib import contextmanager
from collections.abc import Generator

from sqlalchemy import inspect, text
from sqlmodel import SQLModel, Session, create_engine

from app.config import settings

logger = logging.getLogger(__name__)

connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.database_url,
    echo=False,
    pool_size=2,
    max_overflow=3,
    pool_pre_ping=True,
    connect_args=connect_args,
)


def _run_migrations() -> None:
    """Run lightweight schema migrations for existing databases."""
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()

    with engine.begin() as conn:
        # Add 'answers' column to estimate_sessions if missing
        if "estimate_sessions" in existing_tables:
            columns = {c["name"] for c in inspector.get_columns("estimate_sessions")}
            if "answers" not in columns:
                conn.execute(text("ALTER TABLE estimate_sessions ADD COLUMN answers JSON"))
                logger.info("Migration: added 'answers' column to estimate_sessions")

        # Drop step_answers table if it still exists
        if "step_answers" in existing_tables:
            conn.execute(text("DROP TABLE step_answers"))
            logger.info("Migration: dropped step_answers table")


def create_db_and_tables() -> None:
    """Create all database tables from SQLModel metadata and run migrations."""
    SQLModel.metadata.create_all(engine)
    _run_migrations()


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Get a database session as a context manager."""
    with Session(engine) as session:
        yield session
