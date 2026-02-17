"""Step option constants matching the frontend's content definitions."""

BUSINESS_TYPES: list[dict[str, str]] = [
    {"value": "corporation", "label": "法人"},
    {"value": "sole_proprietor", "label": "個人事業主"},
    {"value": "startup", "label": "スタートアップ"},
    {"value": "npo", "label": "NPO・団体"},
]

INDUSTRIES: list[dict[str, str]] = [
    {"value": "manufacturing", "label": "製造業"},
    {"value": "retail", "label": "小売・EC"},
    {"value": "finance", "label": "金融・保険"},
    {"value": "healthcare", "label": "医療・ヘルスケア"},
    {"value": "education", "label": "教育"},
    {"value": "real_estate", "label": "不動産"},
    {"value": "logistics", "label": "物流・運輸"},
    {"value": "it_services", "label": "IT・情報サービス"},
    {"value": "other", "label": "その他"},
]

EMPLOYEE_SIZES: list[dict[str, str]] = [
    {"value": "1-10", "label": "1〜10名"},
    {"value": "11-50", "label": "11〜50名"},
    {"value": "51-200", "label": "51〜200名"},
    {"value": "201-1000", "label": "201〜1,000名"},
    {"value": "1001+", "label": "1,001名以上"},
]

DEPLOYMENT_TARGETS: list[dict[str, str]] = [
    {"value": "cloud", "label": "クラウド"},
    {"value": "on_premise", "label": "オンプレミス"},
    {"value": "hybrid", "label": "ハイブリッド"},
    {"value": "undecided", "label": "未定"},
]

SYSTEM_TYPES: list[dict[str, str]] = [
    {"value": "web_app", "label": "Webアプリケーション"},
    {"value": "mobile_app", "label": "モバイルアプリ"},
    {"value": "erp", "label": "基幹システム（ERP）"},
    {"value": "crm", "label": "CRM・顧客管理"},
    {"value": "ec", "label": "ECサイト"},
    {"value": "cms", "label": "CMS・Webサイト"},
    {"value": "data_analytics", "label": "データ分析・BI"},
    {"value": "ai_ml", "label": "AI・機械学習"},
    {"value": "iot", "label": "IoTシステム"},
    {"value": "other", "label": "その他"},
]

TIMELINES: list[dict[str, str]] = [
    {"value": "1-3months", "label": "1〜3ヶ月"},
    {"value": "3-6months", "label": "3〜6ヶ月"},
    {"value": "6-12months", "label": "6〜12ヶ月"},
    {"value": "12months+", "label": "12ヶ月以上"},
    {"value": "undecided", "label": "未定"},
]

DEVICES: list[dict[str, str]] = [
    {"value": "pc", "label": "PC"},
    {"value": "smartphone", "label": "スマートフォン"},
    {"value": "tablet", "label": "タブレット"},
    {"value": "all", "label": "すべて"},
]

BUDGET_RANGES: list[dict[str, str]] = [
    {"value": "under_500k", "label": "50万円未満"},
    {"value": "500k-1m", "label": "50万〜100万円"},
    {"value": "1m-3m", "label": "100万〜300万円"},
    {"value": "3m-5m", "label": "300万〜500万円"},
    {"value": "5m-10m", "label": "500万〜1,000万円"},
    {"value": "10m-30m", "label": "1,000万〜3,000万円"},
    {"value": "30m-50m", "label": "3,000万〜5,000万円"},
    {"value": "50m+", "label": "5,000万円以上"},
    {"value": "unknown", "label": "わからない"},
    {"value": "undecided", "label": "未定"},
]
