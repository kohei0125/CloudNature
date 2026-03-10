"""Google Analytics 4 Data APIクライアント。

BetaAnalyticsDataClient（同期）を使用。
呼び出し側で asyncio.to_thread() を使用すること。
"""

import logging
from datetime import date

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    BatchRunReportsRequest,
    DateRange,
    Dimension,
    Filter,
    FilterExpression,
    Metric,
    RunReportRequest,
)

from app.config import settings
from app.services.google_auth import get_credentials

logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]


def _get_client() -> BetaAnalyticsDataClient:
    """GA4 Data APIクライアントを構築する。"""
    credentials = get_credentials(SCOPES)
    return BetaAnalyticsDataClient(credentials=credentials)


def _extract_summary(response) -> dict:
    """サマリーレポートからメトリクスを抽出する。"""
    if not response.rows:
        return {
            "sessions": 0,
            "users": 0,
            "pageviews": 0,
            "bounce_rate": 0.0,
            "avg_session_duration": 0.0,
            "engagement_rate": 0.0,
        }
    row = response.rows[0]
    return {
        "sessions": int(row.metric_values[0].value or 0),
        "users": int(row.metric_values[1].value or 0),
        "pageviews": int(row.metric_values[2].value or 0),
        "bounce_rate": float(row.metric_values[3].value or 0),
        "avg_session_duration": float(row.metric_values[4].value or 0),
        "engagement_rate": float(row.metric_values[5].value or 0),
    }


def _extract_dimension_rows(response, dim_keys: str | list[str], metric_keys: list[str]) -> list[dict]:
    """次元付きレポートから行を抽出する。

    dim_keys: 単一キー文字列 or 複数キーのリスト。
    """
    if isinstance(dim_keys, str):
        dim_keys = [dim_keys]
    rows = []
    for row in response.rows or []:
        entry = {}
        for j, dk in enumerate(dim_keys):
            entry[dk] = row.dimension_values[j].value
        for i, key in enumerate(metric_keys):
            val = row.metric_values[i].value or "0"
            entry[key] = int(val) if "." not in val else float(val)
        rows.append(entry)
    return rows


def get_site_metrics(start_date: date, end_date: date) -> dict:
    """batchRunReportsでGA4メトリクスを一括取得する。

    Returns:
        {
            "summary": {...},
            "channels": [...],
            "top_pages": [...],
        }
    """
    property_id = settings.ga4_property_id
    client = _get_client()

    date_range = DateRange(
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat(),
    )

    # サマリーレポート
    summary_request = RunReportRequest(
        property=property_id,
        date_ranges=[date_range],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
            Metric(name="screenPageViews"),
            Metric(name="bounceRate"),
            Metric(name="averageSessionDuration"),
            Metric(name="engagementRate"),
        ],
    )

    # チャネル別レポート
    channel_request = RunReportRequest(
        property=property_id,
        date_ranges=[date_range],
        dimensions=[Dimension(name="sessionDefaultChannelGroup")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
        ],
        limit=10,
    )

    # 閲覧ページ別Top15レポート（hostName + pagePath の2次元、2サイト分を考慮）
    page_request = RunReportRequest(
        property=property_id,
        date_ranges=[date_range],
        dimensions=[Dimension(name="hostName"), Dimension(name="pagePath")],
        metrics=[
            Metric(name="screenPageViews"),
        ],
        limit=15,
    )

    # キーイベントレポート
    key_event_request = RunReportRequest(
        property=property_id,
        date_ranges=[date_range],
        dimensions=[Dimension(name="eventName")],
        metrics=[
            Metric(name="keyEvents"),
        ],
        limit=10,
    )

    # Organic Search のみのエンゲージメント指標（SEO判定用）
    organic_request = RunReportRequest(
        property=property_id,
        date_ranges=[date_range],
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="sessionDefaultChannelGroup",
                string_filter=Filter.StringFilter(
                    value="Organic Search",
                    match_type=Filter.StringFilter.MatchType.EXACT,
                ),
            )
        ),
        metrics=[
            Metric(name="sessions"),
            Metric(name="engagementRate"),
            Metric(name="bounceRate"),
        ],
    )

    # batchRunReports で一括実行（5リクエスト）
    batch_response = client.batch_run_reports(
        BatchRunReportsRequest(
            property=property_id,
            requests=[
                summary_request, channel_request, page_request,
                key_event_request, organic_request,
            ],
        )
    )

    reports = batch_response.reports

    summary = _extract_summary(reports[0])
    channels = _extract_dimension_rows(
        reports[1], "channel", ["sessions", "users"]
    )
    top_pages = [
        r for r in _extract_dimension_rows(
            reports[2], ["host", "page"], ["pageviews"]
        )
        if r.get("host") in PRODUCTION_HOSTS
    ]
    key_events = _extract_dimension_rows(
        reports[3], "event", ["count"]
    )

    # Organic Search のみのエンゲージメント
    organic_summary = {}
    organic_report = reports[4]
    if organic_report.rows:
        row = organic_report.rows[0]
        organic_summary = {
            "sessions": int(row.metric_values[0].value or 0),
            "engagement_rate": float(row.metric_values[1].value or 0),
            "bounce_rate": float(row.metric_values[2].value or 0),
        }

    # クォータ情報をログ
    if hasattr(reports[0], "property_quota") and reports[0].property_quota:
        quota = reports[0].property_quota
        logger.info(
            "GA4 quota: tokens_per_day=%s, tokens_per_hour=%s",
            getattr(quota.tokens_per_day, "remaining", "N/A"),
            getattr(quota.tokens_per_hour, "remaining", "N/A"),
        )

    return {
        "summary": summary,
        "channels": channels,
        "top_pages": top_pages,
        "key_events": key_events,
        "organic": organic_summary,
    }


# レポート対象の本番ホスト名（localhost, *.vercel.app 等を除外するため）
PRODUCTION_HOSTS = {"cloudnature.jp", "ai.cloudnature.jp"}


def get_hostname_breakdown(start_date: date, end_date: date) -> list[dict]:
    """hostName別のセッション・PV・ユーザー数を取得する。

    batchRunReportsは5リクエスト上限で既に埋まっているため別途単独呼び出し。
    本番ホスト（PRODUCTION_HOSTS）のみを返し、localhost等は除外する。

    Returns:
        [{"host": "cloudnature.jp", "sessions": N, "users": N, "pageviews": N}, ...]
    """
    property_id = settings.ga4_property_id
    client = _get_client()

    date_range = DateRange(
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat(),
    )

    request = RunReportRequest(
        property=property_id,
        date_ranges=[date_range],
        dimensions=[Dimension(name="hostName")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
            Metric(name="screenPageViews"),
        ],
    )

    response = client.run_report(request)
    rows = _extract_dimension_rows(response, "host", ["sessions", "users", "pageviews"])
    return [r for r in rows if r.get("host") in PRODUCTION_HOSTS]
