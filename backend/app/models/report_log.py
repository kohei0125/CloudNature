"""週次レポートのログ・メトリクス履歴モデル。"""

from datetime import datetime, timezone

from sqlmodel import SQLModel, Field


class WeeklyReportLog(SQLModel, table=True):
    """週次レポート送信ログ（冪等性チェック用）。"""

    __tablename__ = "weekly_report_log"

    id: int | None = Field(default=None, primary_key=True)
    year_week: str = Field(unique=True)  # e.g. "2026-W11"
    sent_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = Field(default="success")  # "success" | "error"
    summary: str | None = None


class WeeklyMetrics(SQLModel, table=True):
    """週次メトリクス履歴（トレンド表示用、最大26週保持）。"""

    __tablename__ = "weekly_metrics"

    id: int | None = Field(default=None, primary_key=True)
    year_week: str = Field(unique=True)  # e.g. "2026-W11"
    # GSC
    gsc_clicks: int = 0
    gsc_impressions: int = 0
    gsc_ctr: float = 0.0
    gsc_position: float = 0.0
    # GA4
    ga4_sessions: int = 0
    ga4_users: int = 0
    ga4_pageviews: int = 0
    ga4_bounce_rate: float = 0.0
    ga4_avg_session_duration: float = 0.0
    ga4_engagement_rate: float = 0.0
    # 詳細データ（JSON）
    details_json: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
