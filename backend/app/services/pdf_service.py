"""PDF generation service that calls the Next.js frontend API."""

import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


async def fetch_pdf_from_frontend(
    estimate_data: dict,
    pdf_type: str = "estimate",
) -> bytes | None:
    """Fetch a generated PDF from the Next.js frontend API.

    Args:
        estimate_data: The estimate data to render as PDF.
        pdf_type: Either "estimate" or "requirements".

    Returns:
        PDF bytes or None on failure.
    """
    url = f"{settings.frontend_url}/api/pdf/{pdf_type}"

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(url, json=estimate_data)
            response.raise_for_status()
            return response.content
    except httpx.HTTPError:
        logger.exception("Failed to fetch PDF from frontend: %s", url)
        return None
