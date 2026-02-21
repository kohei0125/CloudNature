"""Step option constants matching the frontend estimate.ts definitions."""

BUSINESS_TYPES: list[dict[str, str]] = [
    {"value": "corporation", "label": "法人（株式会社・合同会社等）"},
    {"value": "sole_proprietor", "label": "個人事業主"},
    {"value": "other", "label": "その他"},
]

INDUSTRIES: list[dict[str, str]] = [
    {"value": "manufacturing", "label": "製造業"},
    {"value": "retail", "label": "小売・卸売業"},
    {"value": "construction", "label": "建設・不動産業"},
    {"value": "food_service", "label": "飲食・宿泊業"},
    {"value": "healthcare", "label": "医療・福祉"},
    {"value": "it_service", "label": "IT・情報サービス業"},
    {"value": "logistics", "label": "物流・運輸業"},
    {"value": "other", "label": "その他"},
]

USER_COUNTS: list[dict[str, str]] = [
    {"value": "1-5", "label": "1〜5名"},
    {"value": "6-20", "label": "6〜20名"},
    {"value": "21-50", "label": "21〜50名"},
    {"value": "51-100", "label": "51〜100名"},
    {"value": "101+", "label": "101名以上"},
]

DEPLOYMENT_TARGETS: list[dict[str, str]] = [
    {"value": "internal", "label": "自社利用"},
    {"value": "client", "label": "お客様提供用"},
    {"value": "undecided", "label": "未定"},
]

SYSTEM_TYPES: list[dict[str, str]] = [
    {"value": "web_app", "label": "WEBアプリ"},
    {"value": "mobile_app", "label": "スマホアプリ"},
    {"value": "undecided_other", "label": "決まっていない/その他"},
]

DEVELOPMENT_TYPES: list[dict[str, str]] = [
    {"value": "new", "label": "新規開発（ゼロから構築）"},
    {"value": "migration", "label": "既存システムからの移行・リプレイス"},
    {"value": "enhancement", "label": "既存システムの機能追加・改修"},
    {"value": "undecided", "label": "まだ決まっていない"},
]

TIMELINES: list[dict[str, str]] = [
    {"value": "asap", "label": "できるだけ早く（1〜2ヶ月）"},
    {"value": "3months", "label": "3ヶ月以内"},
    {"value": "6months", "label": "半年以内"},
    {"value": "1year", "label": "1年以内"},
    {"value": "undecided", "label": "時期は未定"},
]

DEVICES: list[dict[str, str]] = [
    {"value": "pc", "label": "PC（デスクトップ）中心"},
    {"value": "mobile", "label": "スマートフォン中心"},
    {"value": "both", "label": "PC・スマートフォン両方"},
    {"value": "tablet", "label": "タブレット含む全デバイス"},
]

BUDGET_RANGES: list[dict[str, str]] = [
    {"value": "under_500k", "label": "50万円未満"},
    {"value": "500k_1m", "label": "50万円〜100万円"},
    {"value": "1m_3m", "label": "100万円〜300万円"},
    {"value": "3m_5m", "label": "300万円〜500万円"},
    {"value": "5m_10m", "label": "500万円〜1,000万円"},
    {"value": "10m_plus", "label": "1,000万円以上"},
    {"value": "unknown", "label": "わからない・未定"},
]
