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
    pdf_data: bytes | None = None,
) -> bool:
    """Send estimate PDF to the customer via email.

    Returns True if the email was sent successfully.
    PDF attachment is optional — the email is sent even without it.
    """
    if not settings.resend_api_key:
        logger.warning("Resend API key not configured, skipping email send")
        return False

    resend.api_key = settings.resend_api_key

    attachments = []
    if pdf_data:
        attachments.append(
            {"filename": "概算見積書.pdf", "content": list(pdf_data)}
        )

    try:
        params: resend.Emails.SendParams = {
            "from": settings.email_from,
            "to": [email],
            "subject": "【CloudNature】AI概算見積もり結果のお届け",
            "html": _load_template("estimate_email.html"),
            "attachments": attachments,
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


async def send_estimate_notification(
    client_name: str,
    client_company: str,
    client_email: str,
    pdf_data: bytes | None = None,
) -> bool:
    """Send estimate notification to the site operator.

    Returns True if the email was sent successfully.
    """
    if not settings.resend_api_key:
        logger.warning("Resend API key not configured, skipping notification")
        return False

    if not settings.notify_email:
        logger.info("NOTIFY_EMAIL not configured, skipping operator notification")
        return False

    resend.api_key = settings.resend_api_key

    attachments = []
    if pdf_data:
        attachments.append(
            {"filename": "概算見積書.pdf", "content": list(pdf_data)}
        )

    try:
        html = _load_template("estimate_notification.html")
        html = (
            html.replace("{{client_name}}", client_name)
            .replace("{{client_company}}", client_company)
            .replace("{{client_email}}", client_email)
        )

        params: resend.Emails.SendParams = {
            "from": settings.email_from,
            "to": [settings.notify_email],
            "subject": "【CloudNature】新しいお見積もり依頼がありました",
            "html": html,
            "attachments": attachments,
        }
        response = resend.Emails.send(params)
        if response and response.get("id"):
            logger.info(
                "Notification sent to %s (id=%s)",
                settings.notify_email,
                response["id"],
            )
            return True
        logger.warning(
            "Notification send returned no ID for %s: %s",
            settings.notify_email,
            response,
        )
        return False
    except Exception:
        logger.exception(
            "Failed to send notification to %s", settings.notify_email
        )
        return False
