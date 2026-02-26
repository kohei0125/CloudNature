"""Deterministic pricing engine for AI estimate system.

Extracts the pricing logic from estimate_generation.txt into pure Python
so that LLM output can be validated and pre-seeded with accurate numbers.
"""

from __future__ import annotations

import math

# ---------------------------------------------------------------------------
# 1. ベース価格テーブル（17カテゴリ, min/max 万円 → 円）
# ---------------------------------------------------------------------------
_BASE_PRICES: dict[str, tuple[int, int]] = {
    "基本データ管理":   (350_000, 650_000),
    "ダッシュボード・分析":     (350_000, 750_000),
    "カレンダー・スケジュール": (350_000, 650_000),
    "帳票・レポート出力":       (250_000, 550_000),
    "検索・フィルタリング":     (200_000, 450_000),
    "承認ワークフロー":         (450_000, 900_000),
    "在庫・受発注管理":         (550_000, 1_100_000),
    "請求・売上管理":           (450_000, 1_000_000),
    "顧客管理(CRM)":           (450_000, 900_000),
    "通知・アラート":           (200_000, 450_000),
    "外部API連携(単純)":       (250_000, 550_000),
    "外部API連携(複雑)":       (550_000, 1_100_000),
    "決済連携":                 (550_000, 1_300_000),
    "CSV/データインポート":     (200_000, 450_000),
    "AIチャットボット":         (650_000, 1_650_000),
    "マルチテナント対応":       (650_000, 1_300_000),
    "データ移行ツール":         (350_000, 900_000),
}

# デフォルトカテゴリ（マッピング不一致時のフォールバック）
_DEFAULT_CATEGORY = "基本データ管理"

# ---------------------------------------------------------------------------
# 2. 機能 value → ベース価格カテゴリ マッピング
#    dynamic_questions で生成される value をカテゴリに対応付ける
# ---------------------------------------------------------------------------
_FEATURE_TO_CATEGORY: dict[str, str] = {
    # 製造業
    "order_management":     "在庫・受発注管理",
    "inventory_display":    "在庫・受発注管理",
    "production_schedule":  "カレンダー・スケジュール",
    "quality_record":       "基本データ管理",
    "cost_analysis":        "ダッシュボード・分析",
    "supplier_master":      "基本データ管理",
    "order_entry":          "在庫・受発注管理",
    "inventory_dashboard":  "ダッシュボード・分析",
    "auto_report":          "帳票・レポート出力",
    "stock_alert":          "通知・アラート",
    "barcode_scan":         "外部API連携(単純)",
    "barcode_qr":           "外部API連携(単純)",
    "monthly_report":       "帳票・レポート出力",
    "equipment_maintenance":"基本データ管理",
    "shipping_delivery":    "在庫・受発注管理",
    # 小売
    "product_master":       "基本データ管理",
    "inventory_auto":       "在庫・受発注管理",
    "sales_dashboard":      "ダッシュボード・分析",
    "customer_history":     "顧客管理(CRM)",
    "pos_integration":      "外部API連携(複雑)",
    "invoice_output":       "帳票・レポート出力",
    "campaign_management":  "基本データ管理",
    "ec_integration":       "外部API連携(複雑)",
    "stocktaking":          "在庫・受発注管理",
    "coupon_point":         "基本データ管理",
    "review_management":    "基本データ管理",
    # 建設
    "project_management":   "基本データ管理",
    "estimate_invoice":     "請求・売上管理",
    "schedule_management":  "カレンダー・スケジュール",
    "cost_tracking":        "ダッシュボード・分析",
    "site_photo_report":    "基本データ管理",
    "document_sharing":     "基本データ管理",
    "safety_checklist":     "基本データ管理",
    "property_management":  "基本データ管理",
    "tenant_contract":      "基本データ管理",
    # 飲食
    "reservation_calendar": "カレンダー・スケジュール",
    "reservation_mgmt":     "カレンダー・スケジュール",
    "menu_editor":          "基本データ管理",
    "sales_analytics":      "ダッシュボード・分析",
    "shift_scheduler":      "カレンダー・スケジュール",
    "customer_crm":         "顧客管理(CRM)",
    "order_tablet":         "基本データ管理",
    "food_inventory":       "在庫・受発注管理",
    "table_management":     "カレンダー・スケジュール",
    # 医療
    "patient_management":   "顧客管理(CRM)",
    "appointment_schedule": "カレンダー・スケジュール",
    "billing_receipt":      "請求・売上管理",
    "staff_shift":          "カレンダー・スケジュール",
    "care_record":          "基本データ管理",
    "audit_compliance":     "承認ワークフロー",
    "medical_record":       "外部API連携(複雑)",
    "prescription_record":  "基本データ管理",
    "lab_results":          "ダッシュボード・分析",
    "family_portal":        "基本データ管理",
    # IT
    "task_ticket":          "基本データ管理",
    "time_tracking":        "基本データ管理",
    "client_crm":           "顧客管理(CRM)",
    "billing_revenue":      "請求・売上管理",
    "knowledge_base":       "基本データ管理",
    "sla_dashboard":        "ダッシュボード・分析",
    "contract_management":  "基本データ管理",
    "resource_allocation":  "カレンダー・スケジュール",
    "api_hub":              "外部API連携(複雑)",
    # 物流
    "dispatch_route":       "カレンダー・スケジュール",
    "delivery_tracking":    "基本データ管理",
    "warehouse_inventory":  "在庫・受発注管理",
    "driver_attendance":    "基本データ管理",
    "delivery_dashboard":   "ダッシュボード・分析",
    "freight_billing":      "請求・売上管理",
    "route_optimizer":      "外部API連携(複雑)",
    "driver_schedule":      "カレンダー・スケジュール",
    "push_notification":    "通知・アラート",
    "delivery_report":      "帳票・レポート出力",
    "vehicle_maintenance":  "基本データ管理",
    "picking_support":      "在庫・受発注管理",
    "warehouse_io":         "在庫・受発注管理",
    "gps_tracking":         "外部API連携(複雑)",
    # 汎用
    "dashboard":            "ダッシュボード・分析",
    "data_management":      "基本データ管理",
    "data_export":          "帳票・レポート出力",
    "notification":         "通知・アラート",
    "search":               "検索・フィルタリング",
    "workflow":             "承認ワークフロー",
    "data_migration":       "データ移行ツール",
    "camera_upload":        "基本データ管理",
    "offline_support":      "外部API連携(複雑)",
    "other":                "基本データ管理",
}

# ---------------------------------------------------------------------------
# 3. 複合乗数テーブル
# ---------------------------------------------------------------------------
_USER_SCALE: dict[str, float] = {
    "1-5": 1.0,
    "6-20": 1.2,
    "21-50": 1.5,
    "51-100": 2.0,
    "101+": 2.5,
}

_SYSTEM_TYPE: dict[str, float] = {
    "web_app": 1.0,
    "mobile_app": 1.5,
    "undecided_other": 1.1,
}

_DEVICE: dict[str, float] = {
    "pc": 1.0,
    "mobile": 1.0,
    "both": 1.3,
    "tablet": 1.4,
}

_TARGET: dict[str, float] = {
    "internal": 1.0,
    "client": 1.3,
    "client_b2b": 1.3,
    "client_b2c": 1.5,
    "undecided": 1.1,
}

_DEV_TYPE: dict[str, float] = {
    "new": 1.0,
    "migration": 1.2,
    "enhancement": 0.7,
    "undecided": 1.0,
}

_TIMELINE: dict[str, float] = {
    "asap": 1.15,
    "3months": 1.05,
    "6months": 1.0,
    "1year": 0.95,
    "undecided": 1.0,
}

_ENTITY_TYPE: dict[str, float] = {
    "corporation": 1.0,
    "sole_proprietor": 0.85,
    "other": 1.0,
}

_MAX_MULTIPLIER = 4.0

# ---------------------------------------------------------------------------
# 業種別乗数テーブル
# ---------------------------------------------------------------------------
_INDUSTRY_MULTIPLIER: dict[str, float] = {
    "healthcare": 1.15,   # 法規制・セキュリティ
    "logistics": 1.05,    # 位置情報・リアルタイム
}

# ---------------------------------------------------------------------------
# 工程別配分（開発費に対する比率）
# ---------------------------------------------------------------------------
_PHASE_ALLOCATION: list[dict] = [
    {"phase": "requirements",    "label": "要件定義",     "ratio": 0.10},
    {"phase": "design",          "label": "設計",         "ratio": 0.10},
    {"phase": "implementation",  "label": "開発・実装",   "ratio": 0.65},
    {"phase": "testing",         "label": "テスト・検証", "ratio": 0.10},
    {"phase": "deployment",      "label": "導入・移行",   "ratio": 0.05},
]

# ---------------------------------------------------------------------------
# 4. 予算レンジ上限（円）
# ---------------------------------------------------------------------------
_BUDGET_UPPER: dict[str, int | None] = {
    "under_500k": 500_000,
    "500k_1m":    1_000_000,
    "1m_3m":      3_000_000,
    "3m_5m":      5_000_000,
    "5m_10m":     10_000_000,
    "10m_plus":   None,
    "unknown":    None,
}




def _calculate_phase_breakdown(implementation_cost: int) -> dict:
    """開発費を基準に工程別の概算コストを計算する。

    _PHASE_ALLOCATION の ratio は開発(implementation)を含む全工程合計=1.0。
    implementation の ratio(0.65) を元に、プロジェクト総額を逆算する。

    Returns:
        {"phases": [{"phase", "label", "ratio", "cost"}], "project_total": int}
    """
    impl_ratio = next(
        p["ratio"] for p in _PHASE_ALLOCATION if p["phase"] == "implementation"
    )
    project_total_raw = implementation_cost / impl_ratio

    phases = []
    for p in _PHASE_ALLOCATION:
        if p["phase"] == "implementation":
            cost = implementation_cost
        else:
            cost = _round_to_1000(project_total_raw * p["ratio"])
        phases.append({
            "phase": p["phase"],
            "label": p["label"],
            "ratio": p["ratio"],
            "cost": cost,
        })

    project_total = sum(ph["cost"] for ph in phases)

    return {"phases": phases, "project_total": project_total}


def _calculate_confidence(user_input: dict) -> dict:
    """未定項目数から見積もり精度レンジを判定する。"""
    undecided_keys = ("step_5", "step_6", "step_7", "step_9")
    undecided_count = sum(
        1 for k in undecided_keys
        if user_input.get(k) in ("undecided", "undecided_other")
    )

    # step_4（自由記述）の長さも考慮
    step_4 = user_input.get("step_4", "")
    if isinstance(step_4, str) and len(step_4) < 30:
        undecided_count += 1

    if undecided_count == 0:
        return {"range_label": "±20%", "level": "high"}
    elif undecided_count <= 2:
        return {"range_label": "±30%", "level": "medium"}
    else:
        return {"range_label": "±50%", "level": "low"}


def _detect_nfr_keywords(user_input: dict) -> list[str]:
    """自由記述テキストから非機能要件キーワードを検出し、discussion_hintsに追加する。"""
    hints: list[str] = []
    text = str(user_input.get("step_4", "")) + " " + str(user_input.get("step_12", ""))

    security_words = {"セキュリティ", "個人情報", "暗号化", "認証", "SSL", "ISMS", "Pマーク"}
    ha_words = {"可用性", "冗長", "SLA", "99.9", "稼働率", "バックアップ", "DR", "災害"}
    i18n_words = {"多言語", "英語対応", "中国語", "グローバル", "i18n"}

    if any(w in text for w in security_words):
        hints.append("セキュリティ要件が検出されました。詳細ヒアリングで対応範囲を確認します")
    if any(w in text for w in ha_words):
        hints.append("高可用性・SLA要件が検出されました。インフラ設計の検討が必要です")
    if any(w in text for w in i18n_words):
        hints.append("多言語対応の要件が検出されました。対応言語と範囲の確認が必要です")

    return hints


# ---------------------------------------------------------------------------
# helper: 1000円単位で丸める
# ---------------------------------------------------------------------------
def _round_to_1000(value: float) -> int:
    """Round to nearest 1000 yen."""
    return int(round(value / 1000) * 1000)


# ---------------------------------------------------------------------------
# public API
# ---------------------------------------------------------------------------

def _get_base_price(category: str) -> int:
    """カテゴリ別ベース価格（min/max中央値）を返す。"""
    min_p, max_p = _BASE_PRICES.get(category, _BASE_PRICES[_DEFAULT_CATEGORY])
    return (min_p + max_p) // 2


def _calculate_multiplier(user_input: dict) -> tuple[float, str]:
    """複合乗数を計算し、(capped_multiplier, summary_text) を返す。"""
    parts: list[tuple[str, float]] = []

    step_3 = user_input.get("step_3", "1-5")
    m = _USER_SCALE.get(step_3, 1.0)
    parts.append(("ユーザー規模", m))

    step_6 = user_input.get("step_6", "web_app")
    m = _SYSTEM_TYPE.get(step_6, 1.0)
    parts.append(("システム種別", m))

    step_10 = user_input.get("step_10", "pc")
    m = _DEVICE.get(step_10, 1.0)
    parts.append(("デバイス", m))

    step_5 = user_input.get("step_5", "internal")
    m = _TARGET.get(step_5, 1.0)
    parts.append(("導入先", m))

    step_7 = user_input.get("step_7", "new")
    m = _DEV_TYPE.get(step_7, 1.0)
    parts.append(("開発種別", m))

    step_9 = user_input.get("step_9", "6months")
    m = _TIMELINE.get(step_9, 1.0)
    parts.append(("納期", m))

    step_1 = user_input.get("step_1", "corporation")
    m = _ENTITY_TYPE.get(step_1, 1.0)
    parts.append(("事業形態", m))

    raw = math.prod(v for _, v in parts)
    capped = min(raw, _MAX_MULTIPLIER)

    # サマリー文字列: 1.0でないもののみ表示
    non_default = [(label, v) for label, v in parts if v != 1.0]
    if non_default:
        summary = " × ".join(f"{label}{v}" for label, v in non_default)
        summary += f" = 複合{round(raw, 2)}"
        if capped < raw:
            summary += f"（4.0倍上限適用）"
    else:
        summary = "補正なし（全項目デフォルト）"

    return capped, summary


def _check_budget(hybrid_total: int, budget: str) -> dict:
    """予算チェック。budget_status と budget_message を返す。"""
    upper = _BUDGET_UPPER.get(budget)

    if budget == "unknown" or upper is None:
        return {"budget_status": "unknown", "budget_message": ""}

    if hybrid_total <= upper:
        return {"budget_status": "within_budget", "budget_message": ""}

    ratio = hybrid_total / upper
    if ratio <= 1.3:
        return {
            "budget_status": "slightly_over",
            "budget_message": (
                f"ハイブリッド見積もり({hybrid_total:,}円)が予算上限({upper:,}円)を"
                f"約{round((ratio - 1) * 100)}%超過しています。優先度付けによるスコープ調整を推奨します。"
            ),
        }

    return {
        "budget_status": "significantly_over",
        "budget_message": (
            f"ハイブリッド見積もり({hybrid_total:,}円)が予算上限({upper:,}円)を"
            f"大幅に超過しています。フェーズ分け開発を推奨します。"
        ),
    }


def _detect_edge_cases(user_input: dict) -> list[str]:
    """エッジケースを検出し、discussion_hints のリストを返す。"""
    hints: list[str] = []

    step_4 = user_input.get("step_4", "")
    vague_words = {"効率化", "改善", "見える化", "DX", "自動化"}
    if len(step_4) < 30 or (step_4 and all(w in step_4 for w in [step_4]
                                            if any(v in step_4 for v in vague_words))):
        is_vague = len(step_4) < 30 or (
            set(step_4.replace(" ", "").replace("　", "")) <= set("".join(vague_words) + "をしたいのです。、")
        )
        if is_vague:
            hints.append("step_4が曖昧なため、詳細ヒアリングで精度向上が見込めます")

    if user_input.get("step_5") == "undecided":
        hints.append("導入先が未定のため、利用者要望の整理が必要です")

    if user_input.get("step_6") == "undecided_other":
        hints.append("システム種別が未定のため、Web/モバイルの使い勝手相談を推奨します")

    if user_input.get("step_7") == "migration":
        hints.append("migration選択のため、移行元システムの調査と移行方針の策定が必要です")

    if user_input.get("step_9") == "asap":
        hints.append("納期が急ぎのため、MVP範囲の策定を推奨します")

    if user_input.get("step_2") == "healthcare":
        hints.append("healthcare業種のため、法規制・セキュリティ対応の確認が必要です")

    # 未定項目が多い
    undecided_count = sum(
        1 for k in ("step_5", "step_6", "step_7", "step_9")
        if user_input.get(k) in ("undecided", "undecided_other")
    )
    if undecided_count >= 3:
        hints.append("未確定事項が多いため、詳細ヒアリングで精度向上が見込めます")

    return hints


def _resolve_features(user_input: dict) -> list[dict]:
    """step_8からfeature valueリストを取得し、カテゴリを解決する。

    優先順: 静的マッピング → LLMカテゴリ → デフォルト
    """
    step_8 = user_input.get("step_8", [])
    if isinstance(step_8, str):
        step_8 = [f.strip() for f in step_8.split(",") if f.strip()]

    step_8_categories = user_input.get("step_8_categories", {})
    step_8_labels = user_input.get("step_8_labels", {})

    resolved = []
    for value in step_8:
        category = (
            _FEATURE_TO_CATEGORY.get(value)
            or step_8_categories.get(value)
            or _DEFAULT_CATEGORY
        )
        entry: dict = {"value": value, "category": category}
        label = step_8_labels.get(value)
        if label:
            entry["label"] = label
        resolved.append(entry)
    return resolved


def calculate_estimate(user_input: dict) -> dict:
    """メイン見積もり関数。

    Args:
        user_input: step_1〜step_12 のユーザー入力dict

    Returns:
        見積もり結果dict
    """
    # 機能リスト取得（カテゴリ解決済み）
    resolved = _resolve_features(user_input)
    if not resolved:
        resolved = [
            {"value": "data_management", "category": "基本データ管理"},
            {"value": "dashboard", "category": "ダッシュボード・分析"},
            {"value": "data_export", "category": "帳票・レポート出力"},
        ]

    # 複合乗数
    multiplier, multiplier_summary = _calculate_multiplier(user_input)

    # 業種補正（テーブルベース）
    industry = user_input.get("step_2", "")
    industry_mult = _INDUSTRY_MULTIPLIER.get(industry, 1.0)

    # 各機能の開発費算出 → プロジェクト全体費用に拡大
    # _PHASE_ALLOCATION の implementation ratio を使い、開発費→プロジェクト総額に変換
    impl_ratio = next(
        p["ratio"] for p in _PHASE_ALLOCATION if p["phase"] == "implementation"
    )
    features: list[dict] = []
    for feat in resolved:
        category = feat["category"]
        base = _get_base_price(category)
        dev_cost = base * multiplier * industry_mult
        # プロジェクト全工程込みの金額
        standard = _round_to_1000(dev_cost / impl_ratio)
        hybrid = _round_to_1000(standard * 0.6)
        feature_entry: dict = {
            "category": category,
            "standard_price": standard,
            "hybrid_price": hybrid,
        }
        if feat.get("label"):
            feature_entry["label"] = feat["label"]
        features.append(feature_entry)

    total_standard = sum(f["standard_price"] for f in features)
    total_hybrid = sum(f["hybrid_price"] for f in features)

    # 予算チェック
    budget = user_input.get("step_11", "unknown")
    budget_result = _check_budget(total_hybrid, budget)

    # 精度レンジ
    confidence = _calculate_confidence(user_input)

    # エッジケース
    discussion_hints = _detect_edge_cases(user_input)

    # NFRキーワード検出
    discussion_hints.extend(_detect_nfr_keywords(user_input))

    # 予算超過もhintsに追加
    if budget_result["budget_status"] in ("slightly_over", "significantly_over"):
        discussion_hints.append("予算超過のため、スコープ調整を推奨します")

    return {
        "features": features,
        "total_standard": total_standard,
        "total_hybrid": total_hybrid,
        "budget_status": budget_result["budget_status"],
        "budget_message": budget_result["budget_message"],
        "multiplier_summary": multiplier_summary,
        "discussion_hints": discussion_hints,
        "confidence": confidence,
        "user_input": user_input,
    }
