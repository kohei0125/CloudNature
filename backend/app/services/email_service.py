"""Email service using Resend API."""

import html
import logging
import math
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import resend

from app.config import settings

logger = logging.getLogger(__name__)

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"


def _load_template(name: str) -> str:
    """Load an HTML email template by filename."""
    return (TEMPLATE_DIR / name).read_text(encoding="utf-8")


def _format_price(price: int) -> str:
    """金額を万円単位にフォーマットする。"""
    return f"{math.ceil(price / 10000):,}万円"


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

    template = _load_template("estimate_email.html")
    name_display = f"{html.escape(client_name)} 様" if client_name else "お客様"

    template = (
        template.replace("{{client_name}} 様", name_display)
        .replace("{{project_name}}", html.escape(project_name))
        .replace("{{standard_cost}}", _format_price(standard_cost))
        .replace("{{hybrid_cost}}", _format_price(hybrid_cost))
        .replace("{{cost_message}}", html.escape(cost_message))
        .replace("{{extra_cost_rows}}", "")
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
    client_phone: str = "",
    pdf_data: bytes | None = None,
    project_name: str = "",
    hybrid_cost: int = 0,
    industry: str = "",
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

        # Build estimate summary section for operators
        summary_section = ""
        summary_rows = []
        if project_name:
            summary_rows.append(
                f'<tr><td style="padding: 12px; background: #F4F2F0; font-weight: bold; width: 30%; '
                f'border-bottom: 1px solid #EDE8E5; border-top: 1px solid #EDE8E5; vertical-align: top;">'
                f"プロジェクト名</td>"
                f'<td style="padding: 12px; border-bottom: 1px solid #EDE8E5; border-top: 1px solid #EDE8E5; '
                f'vertical-align: top;">{html.escape(project_name)}</td></tr>'
            )
        if hybrid_cost > 0:
            summary_rows.append(
                f'<tr><td style="padding: 12px; background: #F4F2F0; font-weight: bold; '
                f'border-bottom: 1px solid #EDE8E5; vertical-align: top;">'
                f"概算金額（ハイブリッド）</td>"
                f'<td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top; '
                f'color: #8A9668; font-weight: bold;">{_format_price(hybrid_cost)}</td></tr>'
            )
        if industry:
            summary_rows.append(
                f'<tr><td style="padding: 12px; background: #F4F2F0; font-weight: bold; '
                f'border-bottom: 1px solid #EDE8E5; vertical-align: top;">'
                f"業種</td>"
                f'<td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top;">'
                f"{html.escape(industry)}</td></tr>"
            )
        if summary_rows:
            summary_section = (
                '<h3 style="color: #19231B; font-size: 16px; margin-top: 24px; margin-bottom: 16px;">'
                "■ 見積もり概要</h3>"
                '<table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">'
                + "".join(summary_rows)
                + "</table>"
            )

        template = (
            template.replace("{{client_name}}", html.escape(client_name))
            .replace("{{client_company}}", html.escape(client_company) if client_company.strip() else "（未入力）")
            .replace("{{client_email}}", html.escape(client_email))
            .replace("{{client_phone}}", html.escape(client_phone) if client_phone.strip() else "（未入力）")
            .replace("{{estimate_summary_section}}", summary_section)
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


async def send_error_notification(
    session_id: str,
    source: str,
    error_type: str,
    message: str = "",
    context: dict | None = None,
) -> bool:
    """Send an operational error notification to the operator.

    Used to surface failures detected in the estimate flow so the operator
    can investigate quickly. PII（連絡先等）は呼び出し側が含めない前提で
    最小限のフィールドのみ送る。
    """
    if not settings.resend_api_key:
        logger.warning("Resend API key not configured, skipping error notification")
        return False
    if not settings.notify_email:
        logger.info("NOTIFY_EMAIL not configured, skipping error notification")
        return False

    resend.api_key = settings.resend_api_key

    occurred_at = datetime.now(ZoneInfo("Asia/Tokyo")).strftime("%Y-%m-%d %H:%M:%S JST")
    rows = [
        ("発生時刻", occurred_at),
        ("発生元", source),
        ("エラー種別", error_type),
        ("session_id", session_id or "(unknown)"),
    ]
    if message:
        rows.append(("メッセージ", message[:500]))
    for k, v in (context or {}).items():
        if v is None or v == "":
            continue
        rows.append((str(k), str(v)[:500]))

    table_rows = "".join(
        f'<tr><td style="padding:8px 12px;background:#F4F2F0;font-weight:bold;'
        f'width:30%;border-bottom:1px solid #EDE8E5;vertical-align:top;">{html.escape(k)}</td>'
        f'<td style="padding:8px 12px;border-bottom:1px solid #EDE8E5;vertical-align:top;'
        f'font-family:Menlo,Consolas,monospace;font-size:13px;">{html.escape(v)}</td></tr>'
        for k, v in rows
    )

    body_html = (
        '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#19231B;">'
        '<h2 style="color:#B00020;margin-bottom:16px;">【CloudNature】見積もりフローでエラーを検知しました</h2>'
        '<p style="margin-bottom:16px;">以下のエラーがバックエンド/フロントエンドで発生しました。Cloud Run / Vercel のログと併せて確認してください。</p>'
        '<table style="width:100%;border-collapse:collapse;border-top:1px solid #EDE8E5;">'
        + table_rows
        + "</table>"
        '<p style="margin-top:24px;color:#666;font-size:12px;">この通知は同一 session × エラー種別で短時間に複数回発生した場合、サーバー側で重複抑止されます。</p>'
        "</div>"
    )

    try:
        params: resend.Emails.SendParams = {
            "from": settings.email_from,
            "to": [settings.notify_email],
            "subject": f"【CloudNature】見積もりエラー検知 [{error_type}]",
            "html": body_html,
        }
        response = resend.Emails.send(params)
        if response and response.get("id"):
            logger.info(
                "Error notification sent (session=%s, type=%s, id=%s)",
                session_id,
                error_type,
                response["id"],
            )
            return True
        logger.warning(
            "Error notification send returned no ID (session=%s, type=%s): %s",
            session_id,
            error_type,
            response,
        )
        return False
    except Exception:
        logger.exception(
            "Failed to send error notification (session=%s, type=%s)",
            session_id,
            error_type,
        )
        return False
