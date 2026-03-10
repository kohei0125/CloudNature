"""Google Search Console APIクライアント。

全メソッドは同期（google-api-python-clientが同期I/O）。
呼び出し側で asyncio.to_thread() を使用すること。
"""

import logging
from datetime import date

from googleapiclient.discovery import build

from app.config import settings
from app.services.google_auth import get_credentials

logger = logging.getLogger(__name__)

SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
]

# cloudnature.jp の主要ページ（URL Inspection対象）
MAIN_PAGES = [
    "https://cloudnature.jp/",
    "https://cloudnature.jp/philosophy",
    "https://cloudnature.jp/services",
    "https://cloudnature.jp/cases",
    "https://cloudnature.jp/company",
    "https://cloudnature.jp/contact",
    "https://cloudnature.jp/privacy",
    "https://cloudnature.jp/security",
]


def _get_service():
    """Search Console APIサービスを構築する。"""
    credentials = get_credentials(SCOPES)
    return build("searchconsole", "v1", credentials=credentials)


def _get_webmasters_service():
    """Webmasters API（サイトマップ用）サービスを構築する。"""
    credentials = get_credentials(SCOPES)
    return build("webmasters", "v3", credentials=credentials)


def get_search_performance(
    start_date: date,
    end_date: date,
) -> dict:
    """検索パフォーマンスを取得する。

    Returns:
        {
            "summary": {"clicks", "impressions", "ctr", "position"},
            "top_queries": [...],
            "top_pages": [...],
        }
    """
    site_url = settings.gsc_site_url
    service = _get_service()

    # サマリー（次元なし）
    summary_response = (
        service.searchanalytics()
        .query(
            siteUrl=site_url,
            body={
                "startDate": start_date.isoformat(),
                "endDate": end_date.isoformat(),
                "type": "web",
            },
        )
        .execute()
    )

    summary = {"clicks": 0, "impressions": 0, "ctr": 0.0, "position": 0.0}
    if summary_response.get("rows"):
        row = summary_response["rows"][0]
        summary = {
            "clicks": row.get("clicks", 0),
            "impressions": row.get("impressions", 0),
            "ctr": row.get("ctr", 0.0),
            "position": row.get("position", 0.0),
        }

    # Top 10 クエリ（dimensions=query）
    queries_response = (
        service.searchanalytics()
        .query(
            siteUrl=site_url,
            body={
                "startDate": start_date.isoformat(),
                "endDate": end_date.isoformat(),
                "dimensions": ["query"],
                "rowLimit": 10,
                "type": "web",
            },
        )
        .execute()
    )
    top_queries = []
    for row in queries_response.get("rows", []):
        top_queries.append(
            {
                "query": row["keys"][0],
                "clicks": row.get("clicks", 0),
                "impressions": row.get("impressions", 0),
                "ctr": row.get("ctr", 0.0),
                "position": row.get("position", 0.0),
            }
        )

    # Top 10 ページ（dimensions=page）
    pages_response = (
        service.searchanalytics()
        .query(
            siteUrl=site_url,
            body={
                "startDate": start_date.isoformat(),
                "endDate": end_date.isoformat(),
                "dimensions": ["page"],
                "rowLimit": 10,
                "type": "web",
            },
        )
        .execute()
    )
    top_pages = []
    for row in pages_response.get("rows", []):
        top_pages.append(
            {
                "page": row["keys"][0],
                "clicks": row.get("clicks", 0),
                "impressions": row.get("impressions", 0),
                "ctr": row.get("ctr", 0.0),
                "position": row.get("position", 0.0),
            }
        )

    return {
        "summary": summary,
        "top_queries": top_queries,
        "top_pages": top_pages,
    }


def get_sitemaps_status() -> list[dict]:
    """サイトマップの状態を取得する。"""
    site_url = settings.gsc_site_url
    service = _get_webmasters_service()

    try:
        response = service.sitemaps().list(siteUrl=site_url).execute()
        sitemaps = []
        for sitemap in response.get("sitemap", []):
            sitemaps.append(
                {
                    "path": sitemap.get("path", ""),
                    "errors": sitemap.get("errors", 0),
                    "warnings": sitemap.get("warnings", 0),
                    "last_submitted": sitemap.get("lastSubmitted", ""),
                }
            )
        return sitemaps
    except Exception:
        logger.exception("Failed to fetch sitemaps status")
        return []


def inspect_urls(urls: list[str] | None = None) -> list[dict]:
    """URL Inspection APIで主要ページのインデックス状態を確認する。"""
    site_url = settings.gsc_site_url
    service = _get_service()
    target_urls = urls or MAIN_PAGES

    results = []
    for url in target_urls:
        try:
            response = (
                service.urlInspection()
                .index()
                .inspect(
                    body={
                        "inspectionUrl": url,
                        "siteUrl": site_url,
                    }
                )
                .execute()
            )
            result = response.get("inspectionResult", {})
            index_status = result.get("indexStatusResult", {})
            results.append(
                {
                    "url": url,
                    "verdict": index_status.get("verdict", "UNKNOWN"),
                    "coverage_state": index_status.get("coverageState", ""),
                    "indexing_state": index_status.get("indexingState", ""),
                    "last_crawl_time": index_status.get("lastCrawlTime", ""),
                }
            )
        except Exception:
            logger.exception("Failed to inspect URL: %s", url)
            results.append(
                {
                    "url": url,
                    "verdict": "ERROR",
                    "coverage_state": "Inspection failed",
                    "indexing_state": "",
                    "last_crawl_time": "",
                }
            )

    return results
