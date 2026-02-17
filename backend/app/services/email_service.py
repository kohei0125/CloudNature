"""Email service using Resend API."""

import logging
from pathlib import Path

import resend

from app.config import settings

logger = logging.getLogger(__name__)

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"


def _load_template(name: str) -> str:
    """Load an HTML email template by filename."""
    return (TEMPLATE_DIR / name).read_text(encoding="utf-8")


async def send_estimate_email(
    email: str,
    pdf_data_estimate: bytes,
    pdf_data_requirements: bytes,
) -> bool:
    """Send estimate and requirements PDFs to the user via email.

    Returns True if the email was sent successfully.
    """
    if not settings.resend_api_key:
        logger.warning("Resend API key not configured, skipping email send")
        return False

    resend.api_key = settings.resend_api_key

    try:
        params: resend.Emails.SendParams = {
            "from": settings.email_from,
            "to": [email],
            "subject": "【CloudNature】AI概算見積もり結果のお届け",
            "html": _load_template("estimate_email.html"),
            "attachments": [
                {
                    "filename": "概算見積書.pdf",
                    "content": list(pdf_data_estimate),
                },
                {
                    "filename": "要件定義書.pdf",
                    "content": list(pdf_data_requirements),
                },
            ],
        }
        response = resend.Emails.send(params)
        if response and response.get("id"):
            logger.info("Estimate email sent to %s (id=%s)", email, response["id"])
            return True
        logger.warning("Email send returned no ID for %s: %s", email, response)
        return False
    except Exception:
        logger.exception("Failed to send estimate email to %s", email)
        return False
