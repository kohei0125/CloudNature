"""PDF generation service that calls the Next.js frontend API."""

import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


def _to_camel_case_estimate(data: dict) -> dict:
    """Convert snake_case estimate dict to camelCase for the frontend PDF API."""
    return {
        "projectName": data.get("project_name", ""),
        "summary": data.get("summary", ""),
        "developmentModelExplanation": data.get(
            "development_model_explanation", ""
        ),
        "features": [
            {
                "name": f.get("name", ""),
                "detail": f.get("detail", ""),
                "standardPrice": f.get("standard_price", 0),
                "hybridPrice": f.get("hybrid_price", 0),
            }
            for f in data.get("features", [])
        ],
        "discussionAgenda": data.get("discussion_agenda", []),
        "totalCost": {
            "standard": data.get("total_cost", {}).get("standard", 0),
            "hybrid": data.get("total_cost", {}).get("hybrid", 0),
            "message": data.get("total_cost", {}).get("message", ""),
        },
    }


async def fetch_pdf_from_frontend(
    estimate_data: dict,
    client_name: str = "",
    pdf_type: str = "estimate",
) -> bytes | None:
    """Fetch a generated PDF from the Next.js frontend API.

    Args:
        estimate_data: The estimate data (snake_case) to render as PDF.
        client_name: Client name for the PDF header.
        pdf_type: Either "estimate" or "requirements".

    Returns:
        PDF bytes or None on failure.
    """
    url = f"{settings.frontend_url}/api/pdf"
    if pdf_type != "estimate":
        url = f"{settings.frontend_url}/api/pdf/{pdf_type}"

    body = {
        "estimate": _to_camel_case_estimate(estimate_data),
        "clientName": client_name,
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(url, json=body)
            response.raise_for_status()
            return response.content
    except httpx.HTTPError:
        logger.exception("Failed to fetch PDF from frontend: %s", url)
        return None
