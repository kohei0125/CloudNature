"""TTL cleanup task for expired sessions."""

import logging

from app.services.session_service import check_ttl

logger = logging.getLogger(__name__)


def run_cleanup() -> int:
    """Delete sessions older than DATA_TTL_DAYS.

    Can be triggered manually or via cron.
    Returns the number of deleted sessions.
    """
    deleted = check_ttl()
    logger.info("Cleanup completed: %d sessions deleted", deleted)
    return deleted


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    count = run_cleanup()
    print(f"Deleted {count} expired sessions")
