"""ルールベース判定 + LLM文面生成によるアクション提案サービス。"""

import asyncio
import html
import json
import logging

from google import genai
from google.genai import types

from app.config import settings

logger = logging.getLogger(__name__)


def _rule_based_candidates(
    gsc_current: dict,
    gsc_previous: dict,
    ga4_current: dict,
    ga4_previous: dict,
    index_results: list[dict],
) -> list[dict]:
    """ルールベースでアクション候補を抽出する。"""
    candidates = []

    # Top クエリの分析
    for query in gsc_current.get("top_queries", []):
        imp = query.get("impressions", 0)
        ctr = query.get("ctr", 0.0)
        position = query.get("position", 0.0)

        if imp < 100:
            continue

        # CTR改善候補: imp>1000, CTR<3%, rank<=10
        if imp > 1000 and ctr < 0.03 and position <= 10:
            candidates.append(
                {
                    "rule": "low_ctr",
                    "priority": "P1",
                    "query": query["query"],
                    "impressions": imp,
                    "ctr": round(ctr * 100, 2),
                    "position": round(position, 1),
                    "action_type": "タイトル/ディスクリプション改善",
                }
            )

        # 2ページ目押し上げ: rank 11-20, imp多い
        if 11 <= position <= 20 and imp > 500:
            candidates.append(
                {
                    "rule": "page_two",
                    "priority": "P1",
                    "query": query["query"],
                    "impressions": imp,
                    "position": round(position, 1),
                    "action_type": "内部リンク強化・コンテンツ追記",
                }
            )

    # クリック減少ページの検出
    current_pages = {p["page"]: p for p in gsc_current.get("top_pages", [])}
    previous_pages = {p["page"]: p for p in gsc_previous.get("top_pages", [])}
    for page_url, current_data in current_pages.items():
        if page_url in previous_pages:
            prev_clicks = previous_pages[page_url].get("clicks", 0)
            curr_clicks = current_data.get("clicks", 0)
            if prev_clicks > 0 and curr_clicks < prev_clicks * 0.8:
                drop_pct = round((1 - curr_clicks / prev_clicks) * 100, 1)
                candidates.append(
                    {
                        "rule": "click_decline",
                        "priority": "P2",
                        "page": page_url,
                        "prev_clicks": prev_clicks,
                        "curr_clicks": curr_clicks,
                        "drop_percent": drop_pct,
                        "action_type": "コンテンツ更新・検索意図再確認",
                    }
                )

    # インデックス異常
    for result in index_results:
        if result.get("verdict") not in ("PASS", "NEUTRAL", "UNKNOWN"):
            candidates.append(
                {
                    "rule": "index_error",
                    "priority": "P1",
                    "url": result["url"],
                    "verdict": result.get("verdict", ""),
                    "coverage_state": result.get("coverage_state", ""),
                    "action_type": "技術SEO修正",
                }
            )

    # エンゲージメント低下（Organic Search流入増 + Organic Searchエンゲージメント率低下）
    # SEO改善提案なので、Organic Searchに絞ったデータのみで判定する
    curr_organic = ga4_current.get("organic", {})
    prev_organic = ga4_previous.get("organic", {})
    curr_organic_sessions = curr_organic.get("sessions", 0)
    prev_organic_sessions = prev_organic.get("sessions", 0)
    curr_organic_engagement = curr_organic.get("engagement_rate", 0)
    prev_organic_engagement = prev_organic.get("engagement_rate", 0)

    if (
        prev_organic_sessions > 0
        and curr_organic_sessions > prev_organic_sessions
        and prev_organic_engagement > 0
        and curr_organic_engagement < prev_organic_engagement * 0.9
    ):
        candidates.append(
            {
                "rule": "engagement_drop",
                "priority": "P2",
                "curr_organic_sessions": curr_organic_sessions,
                "prev_organic_sessions": prev_organic_sessions,
                "curr_organic_engagement": round(curr_organic_engagement * 100, 1),
                "prev_organic_engagement": round(prev_organic_engagement * 100, 1),
                "action_type": "コンテンツと検索意図のミスマッチ確認",
            }
        )

    # 優先度順にソート
    priority_order = {"P1": 0, "P2": 1, "P3": 2}
    candidates.sort(key=lambda c: priority_order.get(c.get("priority", "P3"), 2))

    return candidates


async def generate_action_suggestions(
    gsc_current: dict,
    gsc_previous: dict,
    ga4_current: dict,
    ga4_previous: dict,
    index_results: list[dict],
) -> str:
    """ルール判定 → LLM文面生成でアクション提案を生成する。

    Returns:
        HTML形式のアクション提案テキスト
    """
    candidates = _rule_based_candidates(
        gsc_current, gsc_previous, ga4_current, ga4_previous, index_results
    )

    if not candidates:
        return (
            "<p>今週は特に緊急のアクション候補はありません。"
            "引き続きコンテンツの充実とモニタリングを継続してください。</p>"
        )

    # LLMが利用可能ならGeminiで文面生成
    if not settings.gemini_api_key:
        return _format_candidates_as_html(candidates)

    try:
        client = genai.Client(api_key=settings.gemini_api_key)

        prompt = (
            "あなたはSEOコンサルタントです。以下のルールベース分析結果をもとに、"
            "「今週やることTop3」を日本語で生成してください。\n\n"
            "各提案には以下を含めてください:\n"
            "- 具体的な施策（何をどうするか）\n"
            "- 対象URL/クエリ\n"
            "- 根拠となる数値\n"
            "- 期待効果\n"
            "- 工数感（小/中/大）\n\n"
            "出力はJSON配列で、各要素は {title, description, target, evidence, effort} のオブジェクト。\n"
            "最大3件まで。\n\n"
            f"分析結果:\n{json.dumps(candidates[:10], ensure_ascii=False)}"
        )

        response = await asyncio.wait_for(
            client.aio.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.5,
                    response_mime_type="application/json",
                ),
            ),
            timeout=settings.llm_timeout,
        )

        content = response.text or "[]"
        suggestions = json.loads(content)
        return _format_suggestions_as_html(suggestions)

    except Exception:
        logger.exception("LLM action suggestion generation failed, using rule-based fallback")
        return _format_candidates_as_html(candidates)


def _format_suggestions_as_html(suggestions: list[dict]) -> str:
    """LLM生成のサジェスションをHTML化する。"""
    if not suggestions:
        return "<p>アクション提案の生成に失敗しました。</p>"

    html_parts = []
    for i, s in enumerate(suggestions[:3], 1):
        html_parts.append(
            f'<div style="margin-bottom: 16px; padding: 16px; background: #F0F4E8; border-radius: 8px; '
            f'border-left: 4px solid #8A9668;">'
            f'<h4 style="margin: 0 0 8px 0; color: #19231B;">#{i} {html.escape(s.get("title", ""))}</h4>'
            f'<p style="margin: 0 0 4px 0;">{html.escape(s.get("description", ""))}</p>'
            f'<p style="margin: 0; font-size: 13px; color: #666;">'
            f'対象: {html.escape(s.get("target", "-"))} ｜ '
            f'根拠: {html.escape(s.get("evidence", "-"))} ｜ '
            f'工数: {html.escape(s.get("effort", "-"))}'
            f"</p></div>"
        )

    return "\n".join(html_parts)


def _format_candidates_as_html(candidates: list[dict]) -> str:
    """ルールベース候補をHTML化する（LLMフォールバック用）。"""
    html_parts = []
    for i, c in enumerate(candidates[:3], 1):
        details = []
        if "query" in c:
            details.append(f"クエリ: {html.escape(c['query'])}")
        if "page" in c:
            details.append(f"ページ: {html.escape(c['page'])}")
        if "url" in c:
            details.append(f"URL: {html.escape(c['url'])}")

        html_parts.append(
            f'<div style="margin-bottom: 16px; padding: 16px; background: #F0F4E8; border-radius: 8px; '
            f'border-left: 4px solid #8A9668;">'
            f'<h4 style="margin: 0 0 8px 0; color: #19231B;">#{i} [{html.escape(c.get("priority", ""))}] '
            f'{html.escape(c.get("action_type", ""))}</h4>'
            f'<p style="margin: 0; font-size: 13px; color: #666;">'
            f'{" ｜ ".join(details)}'
            f"</p></div>"
        )

    return "\n".join(html_parts)
