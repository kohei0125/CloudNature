"""Notion integration service for saving estimate results."""

import logging

logger = logging.getLogger(__name__)

_notion_client = None

INDUSTRY_LABELS = {
    "manufacturing": "製造業",
    "retail": "小売・卸売業",
    "construction": "建設・不動産業",
    "food_service": "飲食・宿泊業",
    "healthcare": "医療・福祉",
    "it_service": "IT・情報サービス業",
    "logistics": "物流・運輸業",
    "other": "その他",
}

BUDGET_LABELS = {
    "under_500k": "50万円未満",
    "500k_1m": "50万円〜100万円",
    "1m_3m": "100万円〜300万円",
    "3m_5m": "300万円〜500万円",
    "5m_10m": "500万円〜1,000万円",
    "10m_plus": "1,000万円以上",
    "unknown": "わからない・未定",
}

USER_COUNT_LABELS = {
    "1-5": "1〜5名",
    "6-20": "6〜20名",
    "21-50": "21〜50名",
    "51-100": "51〜100名",
    "101+": "101名以上",
}

BUSINESS_TYPE_LABELS = {
    "corporation": "法人",
    "sole_proprietor": "個人事業主",
    "other": "その他",
}

DEPLOYMENT_LABELS = {
    "internal": "自社利用（社員向け）",
    "client_b2b": "お客様提供用（B2B）",
    "client_b2c": "一般ユーザー向け（B2C）",
    "undecided": "未定",
}

SYSTEM_TYPE_LABELS = {
    "web_app": "WEBアプリ",
    "mobile_app": "スマホアプリ",
    "undecided_other": "決まっていない/その他",
}

DEV_TYPE_LABELS = {
    "new": "新規開発（ゼロから構築）",
    "migration": "既存システムからの移行・リプレイス",
    "enhancement": "既存システムの機能追加・改修",
    "undecided": "まだ決まっていない",
}

TIMELINE_LABELS = {
    "asap": "できるだけ早く（1〜2ヶ月）",
    "3months": "3ヶ月以内",
    "6months": "半年以内",
    "1year": "1年以内",
    "undecided": "時期は未定",
}

DEVICE_LABELS = {
    "pc": "PC（デスクトップ）中心",
    "mobile": "スマートフォン中心",
    "both": "PC・スマートフォン両方",
    "tablet": "タブレット含む全デバイス",
}


def _get_notion():
    """Lazy-initialize the Notion client."""
    global _notion_client
    from app.config import settings

    if not settings.notion_api_key:
        return None

    if _notion_client is None:
        from notion_client import Client

        _notion_client = Client(auth=settings.notion_api_key)

    return _notion_client


def _get_database_id() -> str:
    from app.config import settings

    return settings.notion_database_id


def _label(labels: dict[str, str], value: str) -> str:
    """Convert a key like 'manufacturing' to its label '製造業'."""
    return labels.get(value, value) if value else ""


def _truncate(text: str, max_len: int = 2000) -> str:
    return text[: max_len - 3] + "..." if len(text) > max_len else text


def _heading2(text: str) -> dict:
    return {
        "object": "block",
        "type": "heading_2",
        "heading_2": {"rich_text": [{"type": "text", "text": {"content": text}}]},
    }


def _paragraph(text: str) -> dict:
    return {
        "object": "block",
        "type": "paragraph",
        "paragraph": {
            "rich_text": [{"type": "text", "text": {"content": _truncate(text)}}]
        },
    }


def _divider() -> dict:
    return {"object": "block", "type": "divider", "divider": {}}


def _bulleted(text: str) -> dict:
    return {
        "object": "block",
        "type": "bulleted_list_item",
        "bulleted_list_item": {
            "rich_text": [{"type": "text", "text": {"content": text}}]
        },
    }


def _format_cost(value) -> str:
    """Format cost as 万円 string."""
    if not isinstance(value, (int, float)) or value == 0:
        return "—"
    man = value / 10000
    if man == int(man):
        return f"{int(man):,}万円"
    return f"{man:,.1f}万円"


def save_estimate_to_notion(
    answers: dict,
    estimate_data: dict,
    contact: dict,
) -> None:
    """Save estimate result to Notion database as page with body content."""
    notion = _get_notion()
    database_id = _get_database_id()
    if not notion or not database_id:
        logger.warning("Notion not configured, skipping estimate save")
        return

    def get_answer(step_num: int) -> str:
        raw = answers.get(str(step_num), answers.get(f"step_{step_num}", ""))
        if isinstance(raw, list):
            return ", ".join(str(v) for v in raw)
        return str(raw) if raw else ""

    # Extract costs
    total_cost = estimate_data.get("total_cost", estimate_data.get("totalCost", {}))
    standard_cost = total_cost.get("standard", 0)
    hybrid_cost = total_cost.get("hybrid", 0)
    project_name = estimate_data.get(
        "project_name", estimate_data.get("projectName", "")
    )
    summary = estimate_data.get("summary", "")

    # Extract features
    features = estimate_data.get("features", [])
    feature_names = [
        f.get("name", "") for f in features if isinstance(f, dict) and f.get("name")
    ]

    # Build page body
    children: list[dict] = []

    # 見積もり金額
    children.append(_heading2("見積もり金額"))
    children.append(_bulleted(f"標準プラン: {_format_cost(standard_cost)}"))
    children.append(_bulleted(f"ハイブリッドプラン: {_format_cost(hybrid_cost)}"))

    children.append(_divider())

    # プロジェクト概要
    if project_name or summary:
        children.append(_heading2("プロジェクト概要"))
        if project_name:
            children.append(_paragraph(f"プロジェクト名: {project_name}"))
        if summary:
            children.append(_paragraph(summary))
        children.append(_divider())

    # ヒアリング内容
    children.append(_heading2("ヒアリング内容"))

    step_items = [
        ("事業形態", get_answer(1), BUSINESS_TYPE_LABELS),
        ("業種", get_answer(2), INDUSTRY_LABELS),
        ("ユーザー数", get_answer(3), USER_COUNT_LABELS),
        ("導入先", get_answer(5), DEPLOYMENT_LABELS),
        ("システム種別", get_answer(6), SYSTEM_TYPE_LABELS),
        ("開発種別", get_answer(7), DEV_TYPE_LABELS),
        ("希望納期", get_answer(9), TIMELINE_LABELS),
        ("対応デバイス", get_answer(10), DEVICE_LABELS),
        ("予算", get_answer(11), BUDGET_LABELS),
    ]
    for label, raw_value, label_map in step_items:
        if raw_value:
            children.append(_bulleted(f"{label}: {_label(label_map, raw_value)}"))

    # 課題・要望（自由記述）
    challenges = get_answer(4)
    if challenges:
        children.append(_divider())
        children.append(_heading2("課題・要望"))
        children.append(_paragraph(challenges))

    # 提案機能（Step 8でユーザーに提示した全候補）
    step8_labels = answers.get("_step8_labels", {})
    if step8_labels:
        children.append(_divider())
        children.append(_heading2("提案機能"))
        for label in step8_labels.values():
            children.append(_bulleted(label))

    # 選択した機能（step 8）— value を日本語ラベルに変換
    selected_features = get_answer(8)
    if selected_features:
        children.append(_divider())
        children.append(_heading2("選択した機能"))
        for feat in selected_features.split(", "):
            feat = feat.strip()
            if feat:
                children.append(_bulleted(step8_labels.get(feat, feat)))

    # 補足事項
    additional = get_answer(12)
    if additional:
        children.append(_divider())
        children.append(_heading2("補足事項"))
        children.append(_paragraph(additional))

    # チャット会話ログ
    children.append(_divider())
    children.append(_heading2("チャット会話ログ"))

    step_questions = {
        1: "御社の事業形態を教えてください。",
        2: "御社の業種を教えてください。",
        3: "システムを利用するユーザー数はどのくらいですか？",
        4: "現在抱えている課題や、システムで解決したいことを教えてください。",
        5: "システムの導入先はどちらを想定されていますか？",
        6: "どのようなシステムをお考えですか？",
        7: "新しくシステムを作りますか？それとも既存のシステムからの移行ですか？",
        8: "機能候補から、必要と思われるものを選択してください。",
        9: "ご希望の導入時期はいつ頃ですか？",
        10: "主にどのデバイスでご利用予定ですか？",
        11: "ご予算の目安を教えてください。",
        12: "その他、気になっていることやご要望があればお聞かせください。",
    }

    step_label_maps: dict[int, dict[str, str]] = {
        1: BUSINESS_TYPE_LABELS,
        2: INDUSTRY_LABELS,
        3: USER_COUNT_LABELS,
        5: DEPLOYMENT_LABELS,
        6: SYSTEM_TYPE_LABELS,
        7: DEV_TYPE_LABELS,
        8: step8_labels, 
        9: TIMELINE_LABELS,
        10: DEVICE_LABELS,
        11: BUDGET_LABELS,
    }

    for step_num in range(1, 13):
        raw = get_answer(step_num)
        if not raw:
            continue
        question = step_questions.get(step_num, f"ステップ {step_num}")
        label_map = step_label_maps.get(step_num)
        if label_map:
            # 複数選択の場合はカンマ区切りの各値を変換
            display = ", ".join(
                _label(label_map, v.strip()) for v in raw.split(", ")
            )
        else:
            display = raw
        children.append(_paragraph(f"Q: {question}"))
        children.append(_paragraph(f"A: {display}"))

    properties: dict = {
        "名前": {"title": [{"text": {"content": contact.get("name", "")}}]},
        "会社名": {
            "rich_text": [{"text": {"content": contact.get("company", "")}}]
        },
        "メールアドレス": {"email": contact.get("email", "") or None},
        "種別": {"select": {"name": "お見積もり"}},
        "ステータス": {"select": {"name": "未対応"}},
    }

    notion.pages.create(
        parent={"database_id": database_id},
        properties=properties,
        children=children,
    )
    logger.info("Estimate saved to Notion for %s", contact.get("email", "unknown"))
