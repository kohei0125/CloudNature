"""週次SEO・アクセスレポート生成・送信タスク。"""

import asyncio
import html
import json
import logging
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

import resend
from sqlmodel import select

from app.config import settings
from app.db import get_session
from app.models.report_log import WeeklyMetrics, WeeklyReportLog

logger = logging.getLogger(__name__)

TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"

# Sparkline文字（8段階）
SPARKLINE_CHARS = "▁▂▃▄▅▆▇█"

JST = ZoneInfo("Asia/Tokyo")


def _get_year_week(d: date) -> str:
    """ISO year-week文字列を返す（例: '2026-W11'）。"""
    iso = d.isocalendar()
    return f"{iso.year}-W{iso.week:02d}"


def _calc_date_ranges() -> tuple[date, date, date, date, str]:
    """JST月曜起算で今週・前週の日付範囲を計算する（GSCデータ遅延考慮）。

    GSCデータは2-3日遅延するため、直近データが揃っている「前の完了週」を対象にする。
    例: 月曜に実行 → 前週月〜日が今週分、その前の週が前週分。

    Returns:
        (current_start, current_end, previous_start, previous_end, year_week)
    """
    today_jst = datetime.now(JST).date()

    # 直近の月曜を基準に、GSC遅延（3日）を考慮して完了週を算出
    # today_jst.weekday(): 月=0, 火=1, ..., 日=6
    days_since_monday = today_jst.weekday()
    this_monday = today_jst - timedelta(days=days_since_monday)

    # GSCデータは3日遅延 → 最後にデータが揃う日 = today - 3
    latest_available = today_jst - timedelta(days=3)

    # latest_availableが含まれる週の月曜を計算
    available_monday = latest_available - timedelta(days=latest_available.weekday())

    # その週の月〜日を「今週」とする
    current_start = available_monday
    current_end = available_monday + timedelta(days=6)

    # 前週
    previous_start = current_start - timedelta(days=7)
    previous_end = current_end - timedelta(days=7)

    # year_weekはデータ期間基準
    year_week = _get_year_week(current_start)

    logger.info(
        "Report period: %s (%s ~ %s), previous: %s ~ %s, executed: %s",
        year_week, current_start, current_end, previous_start, previous_end, today_jst,
    )

    return current_start, current_end, previous_start, previous_end, year_week


def _wow_change(current: float, previous: float) -> str:
    """前週比の変化率文字列を返す。"""
    if previous == 0:
        return "—"
    change = ((current - previous) / previous) * 100
    if change > 0:
        return f"↑ +{change:.1f}%"
    if change < 0:
        return f"↓ {change:.1f}%"
    return "→ 0%"


def _wow_color(current: float, previous: float, invert: bool = False) -> str:
    """前週比に応じた色を返す。invertがTrueの場合は下がることが良い（例: 直帰率）。"""
    if previous == 0:
        return "#666666"
    change = current - previous
    if invert:
        change = -change
    if change > 0:
        return "#2E7D32"  # 緑
    if change < 0:
        return "#C62828"  # 赤
    return "#666666"


def _make_sparkline(values: list[float]) -> str:
    """数値列からテキストsparklineを生成する。"""
    if not values:
        return ""
    min_val = min(values)
    max_val = max(values)
    val_range = max_val - min_val
    if val_range == 0:
        return SPARKLINE_CHARS[4] * len(values)
    chars = []
    for v in values:
        idx = int((v - min_val) / val_range * (len(SPARKLINE_CHARS) - 1))
        chars.append(SPARKLINE_CHARS[idx])
    return "".join(chars)


def _upsert_weekly_metrics(
    year_week: str,
    gsc_data: dict | None,
    ga4_data: dict | None,
) -> None:
    """週次メトリクスをDBにUpsertし、26週超の古いレコードを削除する。

    gsc_data/ga4_data が None の場合、そのソースのフィールドは更新しない（既存値を保持）。
    """
    has_gsc = gsc_data is not None
    has_ga4 = ga4_data is not None
    gsc_summary = (gsc_data or {}).get("summary", {})
    ga4_summary = (ga4_data or {}).get("summary", {})

    with get_session() as session:
        existing = session.exec(
            select(WeeklyMetrics).where(WeeklyMetrics.year_week == year_week)
        ).first()

        details = {}
        if has_gsc:
            details["gsc_top_queries"] = gsc_data.get("top_queries", [])  # type: ignore[union-attr]
            details["gsc_top_pages"] = gsc_data.get("top_pages", [])  # type: ignore[union-attr]
        if has_ga4:
            details["ga4_channels"] = ga4_data.get("channels", [])  # type: ignore[union-attr]
            details["ga4_top_pages"] = ga4_data.get("top_pages", [])  # type: ignore[union-attr]

        if existing:
            if has_gsc:
                existing.gsc_clicks = gsc_summary.get("clicks", 0)
                existing.gsc_impressions = gsc_summary.get("impressions", 0)
                existing.gsc_ctr = gsc_summary.get("ctr", 0.0)
                existing.gsc_position = gsc_summary.get("position", 0.0)
            if has_ga4:
                existing.ga4_sessions = ga4_summary.get("sessions", 0)
                existing.ga4_users = ga4_summary.get("users", 0)
                existing.ga4_pageviews = ga4_summary.get("pageviews", 0)
                existing.ga4_bounce_rate = ga4_summary.get("bounce_rate", 0.0)
                existing.ga4_avg_session_duration = ga4_summary.get("avg_session_duration", 0.0)
                existing.ga4_engagement_rate = ga4_summary.get("engagement_rate", 0.0)
            # 詳細JSONは既存データとマージ
            old_details = json.loads(existing.details_json) if existing.details_json else {}
            old_details.update(details)
            existing.details_json = json.dumps(old_details, ensure_ascii=False)
        else:
            metrics = WeeklyMetrics(
                year_week=year_week,
                gsc_clicks=gsc_summary.get("clicks", 0) if has_gsc else 0,
                gsc_impressions=gsc_summary.get("impressions", 0) if has_gsc else 0,
                gsc_ctr=gsc_summary.get("ctr", 0.0) if has_gsc else 0.0,
                gsc_position=gsc_summary.get("position", 0.0) if has_gsc else 0.0,
                ga4_sessions=ga4_summary.get("sessions", 0) if has_ga4 else 0,
                ga4_users=ga4_summary.get("users", 0) if has_ga4 else 0,
                ga4_pageviews=ga4_summary.get("pageviews", 0) if has_ga4 else 0,
                ga4_bounce_rate=ga4_summary.get("bounce_rate", 0.0) if has_ga4 else 0.0,
                ga4_avg_session_duration=ga4_summary.get("avg_session_duration", 0.0) if has_ga4 else 0.0,
                ga4_engagement_rate=ga4_summary.get("engagement_rate", 0.0) if has_ga4 else 0.0,
                details_json=json.dumps(details, ensure_ascii=False),
                created_at=datetime.now(timezone.utc),
            )
            session.add(metrics)

        session.commit()

        # 26週超の古いレコードを削除
        all_metrics = session.exec(
            select(WeeklyMetrics).order_by(WeeklyMetrics.year_week.desc())  # type: ignore[union-attr]
        ).all()
        if len(all_metrics) > 26:
            for old in all_metrics[26:]:
                session.delete(old)
            session.commit()


def _get_trend_data(weeks: int = 12) -> list[WeeklyMetrics]:
    """直近N週分のメトリクスを取得する（古い順）。"""
    with get_session() as session:
        results = session.exec(
            select(WeeklyMetrics)
            .order_by(WeeklyMetrics.year_week.desc())  # type: ignore[union-attr]
            .limit(weeks)
        ).all()
        return list(reversed(results))


def _build_report_html(
    current_start: date,
    current_end: date,
    gsc_current: dict,
    gsc_previous: dict,
    ga4_current: dict,
    ga4_previous: dict,
    index_results: list[dict],
    sitemaps: list[dict],
    action_html: str,
    trend_data: list,
    data_warnings: list[str] | None = None,
    hostname_current: list[dict] | None = None,
    hostname_previous: list[dict] | None = None,
) -> str:
    """レポートHTMLを構築する。"""
    template = (TEMPLATE_DIR / "weekly_report_email.html").read_text(encoding="utf-8")

    # 期間
    period = f"{current_start.isoformat()} 〜 {current_end.isoformat()}"
    template = template.replace("{{report_period}}", period)

    # データ取得警告
    warning_html = ""
    if data_warnings:
        warning_items = "".join(
            f'<p style="margin: 4px 0; color: #C62828; font-size: 13px;">{w}</p>'
            for w in data_warnings
        )
        warning_html = (
            f'<div style="margin-bottom: 16px; padding: 12px; background: #FFF3E0; '
            f'border-radius: 8px; border: 1px solid #FFB74D;">{warning_items}</div>'
        )
    template = template.replace("{{data_warnings}}", warning_html)

    # アクション提案
    template = template.replace("{{action_suggestions}}", action_html)

    # --- GA4サマリー ---
    ga4_curr = ga4_current.get("summary", {})
    ga4_prev = ga4_previous.get("summary", {})

    ga4_metrics = [
        ("セッション数", "sessions", False),
        ("ユーザー数", "users", False),
        ("ページビュー", "pageviews", False),
        ("直帰率", "bounce_rate", True),
        ("エンゲージメント率", "engagement_rate", False),
    ]

    # トレンドデータ
    trend_map = {}
    if trend_data:
        trend_map = {
            "sessions": [m.ga4_sessions for m in trend_data],
            "users": [m.ga4_users for m in trend_data],
            "pageviews": [m.ga4_pageviews for m in trend_data],
            "bounce_rate": [m.ga4_bounce_rate for m in trend_data],
            "engagement_rate": [m.ga4_engagement_rate for m in trend_data],
            "clicks": [m.gsc_clicks for m in trend_data],
            "impressions": [m.gsc_impressions for m in trend_data],
            "ctr": [m.gsc_ctr for m in trend_data],
            "position": [m.gsc_position for m in trend_data],
        }

    ga4_summary_rows = ""
    for label, key, invert in ga4_metrics:
        curr_val = ga4_curr.get(key, 0)
        prev_val = ga4_prev.get(key, 0)
        color = _wow_color(curr_val, prev_val, invert=invert)

        if key in ("bounce_rate", "engagement_rate"):
            display_val = f"{curr_val * 100:.1f}%"
        elif key == "avg_session_duration":
            display_val = f"{curr_val:.0f}秒"
        else:
            display_val = f"{int(curr_val):,}"

        sparkline = _make_sparkline(trend_map.get(key, []))

        ga4_summary_rows += (
            f'<tr>'
            f'<td style="padding: 10px 12px; border-bottom: 1px solid #EDE8E5;">{label}</td>'
            f'<td style="padding: 10px 12px; border-bottom: 1px solid #EDE8E5; font-weight: bold;">{display_val}</td>'
            f'<td style="padding: 10px 12px; border-bottom: 1px solid #EDE8E5; color: {color}; font-size: 13px;">'
            f'{_wow_change(curr_val, prev_val)}</td>'
            f'<td style="padding: 10px 12px; border-bottom: 1px solid #EDE8E5; font-family: monospace; font-size: 14px; letter-spacing: 1px;">'
            f'{sparkline}</td>'
            f'</tr>'
        )
    template = template.replace("{{ga4_summary_rows}}", ga4_summary_rows)

    # --- GA4サイト別アクセス ---
    hostname_rows_html = ""
    if hostname_current:
        prev_map = {h["host"]: h for h in (hostname_previous or [])}
        for h in hostname_current:
            host = html.escape(h.get("host", ""))
            sessions = h.get("sessions", 0)
            users = h.get("users", 0)
            pvs = h.get("pageviews", 0)
            prev_h = prev_map.get(h.get("host", ""), {})
            prev_sessions = prev_h.get("sessions", 0)
            prev_users = prev_h.get("users", 0)
            prev_pvs = prev_h.get("pageviews", 0)
            hostname_rows_html += (
                f'<tr>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 13px;">{host}</td>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{sessions:,}</td>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{users:,}</td>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{pvs:,}</td>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; color: {_wow_color(sessions, prev_sessions)}; font-size: 13px;">'
                f'{_wow_change(sessions, prev_sessions)}</td>'
                f'</tr>'
            )
    if not hostname_rows_html:
        hostname_rows_html = (
            '<tr><td colspan="5" style="padding: 8px 12px; color: #666;">サイト別データはありません</td></tr>'
        )
    template = template.replace("{{ga4_hostname_rows}}", hostname_rows_html)

    # --- GA4チャネル別 ---
    channels = ga4_current.get("channels", [])
    prev_channels = {c["channel"]: c for c in ga4_previous.get("channels", [])}
    channel_rows = ""
    for ch in channels:
        name = html.escape(ch.get("channel", ""))
        sessions = ch.get("sessions", 0)
        prev_sessions = prev_channels.get(name, {}).get("sessions", 0)
        color = _wow_color(sessions, prev_sessions)
        channel_rows += (
            f'<tr>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5;">{name}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-weight: bold;">{sessions:,}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; color: {color}; font-size: 13px;">'
            f'{_wow_change(sessions, prev_sessions)}</td>'
            f'</tr>'
        )
    template = template.replace("{{ga4_channel_rows}}", channel_rows)

    # --- GA4閲覧ページ別Top ---
    ga4_pages = ga4_current.get("top_pages", [])
    ga4_page_rows = ""
    for p in ga4_pages:
        host = html.escape(p.get("host", ""))
        page = html.escape(p.get("page", ""))
        pvs = p.get("pageviews", 0)
        ga4_page_rows += (
            f'<tr>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 13px;">{host}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 13px; '
            f'word-break: break-all;">{page}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{pvs:,}</td>'
            f'</tr>'
        )
    template = template.replace("{{ga4_page_rows}}", ga4_page_rows)

    # --- GA4キーイベント ---
    key_events = ga4_current.get("key_events", [])
    prev_key_events = {e["event"]: e for e in ga4_previous.get("key_events", [])}
    key_event_rows = ""
    if key_events:
        for e in key_events:
            name = html.escape(e.get("event", ""))
            count = e.get("count", 0)
            prev_count = prev_key_events.get(name, {}).get("count", 0)
            color = _wow_color(count, prev_count)
            key_event_rows += (
                f'<tr>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5;">{name}</td>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-weight: bold;">{count:,}</td>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; color: {color}; font-size: 13px;">'
                f'{_wow_change(count, prev_count)}</td>'
                f'</tr>'
            )
    else:
        key_event_rows = (
            '<tr><td colspan="3" style="padding: 8px 12px; color: #666;">キーイベントは未設定または発生なし</td></tr>'
        )
    template = template.replace("{{ga4_key_event_rows}}", key_event_rows)

    # --- GSCサマリー ---
    gsc_curr = gsc_current.get("summary", {})
    gsc_prev = gsc_previous.get("summary", {})

    gsc_metrics = [
        ("クリック数", "clicks", False),
        ("表示回数", "impressions", False),
        ("CTR", "ctr", False),
        ("平均掲載順位", "position", True),
    ]

    gsc_summary_rows = ""
    for label, key, invert in gsc_metrics:
        curr_val = gsc_curr.get(key, 0)
        prev_val = gsc_prev.get(key, 0)
        color = _wow_color(curr_val, prev_val, invert=invert)

        if key == "ctr":
            display_val = f"{curr_val * 100:.2f}%"
        elif key == "position":
            display_val = f"{curr_val:.1f}"
        else:
            display_val = f"{int(curr_val):,}"

        sparkline = _make_sparkline(trend_map.get(key, []))

        gsc_summary_rows += (
            f'<tr>'
            f'<td style="padding: 10px 12px; border-bottom: 1px solid #EDE8E5;">{label}</td>'
            f'<td style="padding: 10px 12px; border-bottom: 1px solid #EDE8E5; font-weight: bold;">{display_val}</td>'
            f'<td style="padding: 10px 12px; border-bottom: 1px solid #EDE8E5; color: {color}; font-size: 13px;">'
            f'{_wow_change(curr_val, prev_val)}</td>'
            f'<td style="padding: 10px 12px; border-bottom: 1px solid #EDE8E5; font-family: monospace; font-size: 14px; letter-spacing: 1px;">'
            f'{sparkline}</td>'
            f'</tr>'
        )
    template = template.replace("{{gsc_summary_rows}}", gsc_summary_rows)

    # --- GSC Top10 クエリ ---
    query_rows = ""
    for q in gsc_current.get("top_queries", []):
        query_rows += (
            f'<tr>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 13px;">{html.escape(q["query"])}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{q["clicks"]:,}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{q["impressions"]:,}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{q["ctr"]*100:.2f}%</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{q["position"]:.1f}</td>'
            f'</tr>'
        )
    template = template.replace("{{gsc_query_rows}}", query_rows)

    # --- GSC Top10 ページ ---
    gsc_page_rows = ""
    for p in gsc_current.get("top_pages", []):
        page_display = html.escape(p["page"].replace("https://cloudnature.jp", ""))
        gsc_page_rows += (
            f'<tr>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 13px;">{page_display}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{p["clicks"]:,}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{p["impressions"]:,}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{p["ctr"]*100:.2f}%</td>'
            f'</tr>'
        )
    template = template.replace("{{gsc_page_rows}}", gsc_page_rows)

    # --- 注目クエリ（高表示・低CTR、100imp以上）---
    notable_queries = [
        q for q in gsc_current.get("top_queries", [])
        if q.get("impressions", 0) >= 100 and q.get("ctr", 0) < 0.03 and q.get("position", 99) <= 10
    ]
    notable_query_rows = ""
    if notable_queries:
        for q in notable_queries[:5]:
            notable_query_rows += (
                f'<tr>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 13px;">{html.escape(q["query"])}</td>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{q["impressions"]:,}</td>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right; color: #C62828;">'
                f'{q["ctr"]*100:.2f}%</td>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{q["position"]:.1f}</td>'
                f'</tr>'
            )
    else:
        notable_query_rows = (
            '<tr><td colspan="4" style="padding: 8px 12px; color: #666;">'
            '該当するクエリはありません（条件: 100imp以上, CTR3%未満, 順位10位以内）</td></tr>'
        )
    template = template.replace("{{gsc_notable_query_rows}}", notable_query_rows)

    # --- 上昇/下落クエリ（前週比、100imp以上）---
    prev_query_map = {q["query"]: q for q in gsc_previous.get("top_queries", [])}
    rising_queries: list[tuple[dict, float]] = []
    declining_queries: list[tuple[dict, float]] = []
    for q in gsc_current.get("top_queries", []):
        if q.get("impressions", 0) < 100:
            continue
        prev = prev_query_map.get(q["query"])
        if not prev or prev.get("clicks", 0) == 0:
            continue
        change_pct = ((q["clicks"] - prev["clicks"]) / prev["clicks"]) * 100
        if change_pct >= 20:
            rising_queries.append((q, change_pct))
        elif change_pct <= -20:
            declining_queries.append((q, change_pct))

    rising_queries.sort(key=lambda x: x[1], reverse=True)
    declining_queries.sort(key=lambda x: x[1])

    movement_rows = ""
    for q, pct in rising_queries[:3]:
        movement_rows += (
            f'<tr>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 13px;">{html.escape(q["query"])}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{q["clicks"]:,}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right; color: #2E7D32; font-weight: bold;">'
            f'↑ +{pct:.1f}%</td>'
            f'</tr>'
        )
    for q, pct in declining_queries[:3]:
        movement_rows += (
            f'<tr>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 13px;">{html.escape(q["query"])}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right;">{q["clicks"]:,}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; text-align: right; color: #C62828; font-weight: bold;">'
            f'↓ {pct:.1f}%</td>'
            f'</tr>'
        )
    if not movement_rows:
        movement_rows = (
            '<tr><td colspan="3" style="padding: 8px 12px; color: #666;">'
            '前週比20%以上の変動クエリはありません（100imp以上対象）</td></tr>'
        )
    template = template.replace("{{gsc_movement_rows}}", movement_rows)

    # --- インデックス状況 ---
    index_rows = ""
    for r in index_results:
        url_display = html.escape(r["url"].replace("https://cloudnature.jp", ""))
        verdict = r.get("verdict", "UNKNOWN")
        if verdict == "PASS":
            verdict_display = '<span style="color: #2E7D32;">✓ PASS</span>'
        elif verdict == "ERROR":
            verdict_display = '<span style="color: #C62828;">✗ ERROR</span>'
        else:
            verdict_display = f'<span style="color: #F57F17;">{verdict}</span>'
        index_rows += (
            f'<tr>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 13px;">{url_display}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5;">{verdict_display}</td>'
            f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 12px; color: #666;">'
            f'{r.get("coverage_state", "")}</td>'
            f'</tr>'
        )
    template = template.replace("{{index_rows}}", index_rows)

    # --- サイトマップ ---
    sitemap_rows = ""
    if sitemaps:
        for s in sitemaps:
            errors = s.get("errors", 0)
            warnings = s.get("warnings", 0)
            status_color = "#2E7D32" if errors == 0 and warnings == 0 else "#C62828"
            sitemap_rows += (
                f'<tr>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; font-size: 13px;">{html.escape(s["path"])}</td>'
                f'<td style="padding: 8px 12px; border-bottom: 1px solid #EDE8E5; color: {status_color};">'
                f'エラー: {errors} / 警告: {warnings}</td>'
                f'</tr>'
            )
    else:
        sitemap_rows = (
            '<tr><td colspan="2" style="padding: 8px 12px; color: #666;">サイトマップ情報を取得できませんでした</td></tr>'
        )
    template = template.replace("{{sitemap_rows}}", sitemap_rows)

    # ファネルダッシュボード リンク
    funnel_url = settings.funnel_spreadsheet_url
    if funnel_url:
        funnel_link_html = (
            '<p style="margin: 0 0 12px 0; font-size: 13px;">'
            f'<a href="{html.escape(funnel_url)}" style="color: #8A9668; font-weight: bold;">'
            'ファネルダッシュボード（Google Spreadsheet）を開く</a></p>'
        )
    else:
        funnel_link_html = ""
    template = template.replace("{{funnel_dashboard_link}}", funnel_link_html)

    return template


async def run_weekly_report() -> str:
    """週次レポートを生成・送信する。"""
    current_start, current_end, previous_start, previous_end, year_week = _calc_date_ranges()

    # 冪等性チェック
    with get_session() as session:
        existing = session.exec(
            select(WeeklyReportLog).where(WeeklyReportLog.year_week == year_week)
        ).first()
        if existing and existing.status == "success":
            logger.info("Weekly report for %s already sent, skipping", year_week)
            return f"already_sent:{year_week}"

    # 設定チェック
    has_gsc = bool(settings.gsc_site_url)
    has_ga4 = bool(settings.ga4_property_id)

    if not has_gsc and not has_ga4:
        logger.warning("Neither GSC nor GA4 is configured, skipping report")
        return "skipped:no_data_source"

    if not settings.report_email:
        logger.warning("REPORT_EMAIL not configured, skipping report")
        return "skipped:no_email"

    # データ取得（同期APIをto_threadで並列実行）
    gsc_current: dict = {"summary": {}, "top_queries": [], "top_pages": []}
    gsc_previous: dict = {"summary": {}, "top_queries": [], "top_pages": []}
    ga4_current: dict = {"summary": {}, "channels": [], "top_pages": []}
    ga4_previous: dict = {"summary": {}, "channels": [], "top_pages": []}
    hostname_current: list[dict] = []
    hostname_previous: list[dict] = []
    index_results: list[dict] = []
    sitemaps: list[dict] = []
    failed_sources: list[str] = []

    try:
        tasks = []

        if has_gsc:
            from app.services.search_console_service import (
                get_search_performance,
                get_sitemaps_status,
                inspect_urls,
            )

            tasks.append(("gsc_current", asyncio.to_thread(get_search_performance, current_start, current_end)))
            tasks.append(("gsc_previous", asyncio.to_thread(get_search_performance, previous_start, previous_end)))
            tasks.append(("sitemaps", asyncio.to_thread(get_sitemaps_status)))
            tasks.append(("index", asyncio.to_thread(inspect_urls)))

        if has_ga4:
            from app.services.ga4_service import get_hostname_breakdown, get_site_metrics

            tasks.append(("ga4_current", asyncio.to_thread(get_site_metrics, current_start, current_end)))
            tasks.append(("ga4_previous", asyncio.to_thread(get_site_metrics, previous_start, previous_end)))
            tasks.append(("hostname_current", asyncio.to_thread(get_hostname_breakdown, current_start, current_end)))
            tasks.append(("hostname_previous", asyncio.to_thread(get_hostname_breakdown, previous_start, previous_end)))

        results = await asyncio.gather(*[t[1] for t in tasks], return_exceptions=True)

        for (name, _), result in zip(tasks, results):
            if isinstance(result, Exception):
                logger.error("Failed to fetch %s: %s", name, result, exc_info=result)
                failed_sources.append(name)
                continue
            if name == "gsc_current":
                gsc_current = result
            elif name == "gsc_previous":
                gsc_previous = result
            elif name == "ga4_current":
                ga4_current = result
            elif name == "ga4_previous":
                ga4_previous = result
            elif name == "hostname_current":
                hostname_current = result
            elif name == "hostname_previous":
                hostname_previous = result
            elif name == "index":
                index_results = result
            elif name == "sitemaps":
                sitemaps = result

    except Exception:
        logger.exception("Failed to fetch API data")
        _record_log(year_week, "error", "API data fetch failed")
        return f"error:{year_week}"

    # 主要データソースが全て失敗した場合は中断
    critical_failures = [s for s in failed_sources if s in ("gsc_current", "ga4_current")]
    if has_gsc and has_ga4 and len(critical_failures) == 2:
        logger.error("All critical data sources failed: %s", critical_failures)
        _record_log(year_week, "error", f"All critical data sources failed: {critical_failures}")
        return f"error:{year_week}:all_sources_failed"
    if has_gsc and not has_ga4 and "gsc_current" in failed_sources:
        logger.error("GSC (only configured source) failed")
        _record_log(year_week, "error", "GSC data fetch failed (only configured source)")
        return f"error:{year_week}:gsc_failed"
    if has_ga4 and not has_gsc and "ga4_current" in failed_sources:
        logger.error("GA4 (only configured source) failed")
        _record_log(year_week, "error", "GA4 data fetch failed (only configured source)")
        return f"error:{year_week}:ga4_failed"

    # 部分失敗の警告テキスト
    data_warnings: list[str] = []
    if failed_sources:
        logger.warning("Partial data fetch failures: %s", failed_sources)
        data_warnings.append(
            f"⚠ 一部のデータ取得に失敗しました（{', '.join(failed_sources)}）。該当セクションのデータは不完全です。"
        )

    # メトリクス履歴をUpsert（失敗ソースはNoneで渡し、既存値を保持）
    save_gsc = gsc_current if "gsc_current" not in failed_sources else None
    save_ga4 = ga4_current if "ga4_current" not in failed_sources else None
    if save_gsc is not None or save_ga4 is not None:
        _upsert_weekly_metrics(year_week, save_gsc, save_ga4)

    # トレンドデータ取得
    trend_data = _get_trend_data(12)

    # アクション提案生成
    from app.services.action_advisor import generate_action_suggestions

    try:
        action_html = await generate_action_suggestions(
            gsc_current, gsc_previous, ga4_current, ga4_previous, index_results
        )
    except Exception:
        logger.exception("Action suggestion generation failed")
        action_html = "<p>アクション提案の生成中にエラーが発生しました。</p>"

    # HTML構築
    report_html = _build_report_html(
        current_start,
        current_end,
        gsc_current,
        gsc_previous,
        ga4_current,
        ga4_previous,
        index_results,
        sitemaps,
        action_html,
        trend_data,
        data_warnings,
        hostname_current,
        hostname_previous,
    )

    # メール送信
    if not settings.resend_api_key:
        logger.warning("Resend API key not configured, skipping email send")
        _record_log(year_week, "error", "Resend API key not configured")
        return f"error:{year_week}:no_resend_key"

    resend.api_key = settings.resend_api_key
    try:
        params: resend.Emails.SendParams = {
            "from": settings.email_from,
            "to": [settings.report_email],
            "subject": f"【CloudNature】週次SEOレポート {year_week}",
            "html": report_html,
        }
        response = resend.Emails.send(params)
        if response and response.get("id"):
            logger.info("Weekly report sent (id=%s)", response["id"])
            _record_log(year_week, "success", f"email_id={response['id']}")
            return f"sent:{year_week}"
        logger.warning("Email send returned no ID: %s", response)
        _record_log(year_week, "error", "Email send returned no ID")
        return f"error:{year_week}"
    except Exception:
        logger.exception("Failed to send weekly report email")
        _record_log(year_week, "error", "Email send failed")
        return f"error:{year_week}"


def _record_log(year_week: str, status: str, summary: str | None = None) -> None:
    """レポート送信ログを記録する。"""
    with get_session() as session:
        existing = session.exec(
            select(WeeklyReportLog).where(WeeklyReportLog.year_week == year_week)
        ).first()
        if existing:
            existing.status = status
            existing.summary = summary
            existing.sent_at = datetime.now(timezone.utc)
        else:
            log = WeeklyReportLog(
                year_week=year_week,
                status=status,
                summary=summary,
                sent_at=datetime.now(timezone.utc),
            )
            session.add(log)
        session.commit()
