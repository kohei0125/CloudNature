"""Email service using Resend API."""

import html
import logging
import math
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
    client_name: str = "",
    project_name: str = "",
    standard_cost: int = 0,
    hybrid_cost: int = 0,
    cost_message: str = "",
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
            {"filename": "概算お見積書.pdf", "content": list(pdf_data)}
        )

    def _format_price(price: int) -> str:
        return f"{math.ceil(price / 10000):,}万円"

    template = _load_template("estimate_email.html")
    name_display = f"{html.escape(client_name)} 様" if client_name else "お客様"
    template = (
        template.replace("{{client_name}} 様", name_display)
        .replace("{{project_name}}", html.escape(project_name))
        .replace("{{standard_cost}}", _format_price(standard_cost))
        .replace("{{hybrid_cost}}", _format_price(hybrid_cost))
        .replace("{{cost_message}}", html.escape(cost_message))
    )

    try:
        params: resend.Emails.SendParams = {
            "from": settings.email_from,
            "to": [email],
            "subject": "【CloudNature】概算お見積もりが完成しました",
            "html": template,
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
            {"filename": "概算お見積書.pdf", "content": list(pdf_data)}
        )

    try:
        template = _load_template("estimate_notification.html")
        template = (
            template.replace("{{client_name}}", html.escape(client_name))
            .replace("{{client_company}}", html.escape(client_company) if client_company.strip() else "（未入力）")
            .replace("{{client_email}}", html.escape(client_email))
        )

        params: resend.Emails.SendParams = {
            "from": settings.email_from,
            "to": [settings.notify_email],
            "subject": "【CloudNature】新しいお見積もり依頼がありました",
            "html": template,
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
