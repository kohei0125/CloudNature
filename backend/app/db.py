from contextlib import contextmanager
from collections.abc import Generator

from sqlmodel import SQLModel, Session, create_engine

from app.config import settings

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


def create_db_and_tables() -> None:
    """Create all database tables from SQLModel metadata."""
    SQLModel.metadata.create_all(engine)


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Get a database session as a context manager."""
    with Session(engine) as session:
        yield session
