"""Fallback LLM adapter with industry-aware template responses."""

import logging

from app.core.llm.adapter import LLMAdapter

logger = logging.getLogger(__name__)

# Industry-specific fallback features for Step 8 (dynamic questions).
# Each list contains 5-7 features relevant to the industry, sourced from
# the industry recommendation lists in dynamic_questions.txt.
_INDUSTRY_FEATURES: dict[str, list[dict[str, str]]] = {
    "manufacturing": [
        {"value": "order_management", "label": "受発注管理・入力画面", "category": "在庫・受発注管理"},
        {"value": "inventory_display", "label": "在庫リアルタイム表示", "category": "在庫・受発注管理"},
        {"value": "production_schedule", "label": "生産スケジュール管理", "category": "カレンダー・スケジュール"},
        {"value": "quality_record", "label": "品質検査記録", "category": "シンプルなCRUD管理画面"},
        {"value": "cost_analysis", "label": "原価計算・コスト分析", "category": "ダッシュボード・分析"},
        {"value": "supplier_master", "label": "取引先マスタ管理", "category": "シンプルなCRUD管理画面"},
    ],
    "retail": [
        {"value": "product_master", "label": "商品マスタ管理", "category": "シンプルなCRUD管理画面"},
        {"value": "inventory_auto", "label": "在庫管理・自動発注", "category": "在庫・受発注管理"},
        {"value": "sales_dashboard", "label": "売上分析ダッシュボード", "category": "ダッシュボード・分析"},
        {"value": "customer_history", "label": "顧客管理・購買履歴", "category": "顧客管理(CRM)"},
        {"value": "pos_integration", "label": "POS連携・売上取込", "category": "外部API連携(複雑)"},
        {"value": "invoice_output", "label": "帳票・請求書出力", "category": "帳票・レポート出力"},
    ],
    "construction": [
        {"value": "project_management", "label": "工事案件管理", "category": "シンプルなCRUD管理画面"},
        {"value": "estimate_invoice", "label": "見積書・請求書作成", "category": "請求・売上管理"},
        {"value": "schedule_management", "label": "工程スケジュール管理", "category": "カレンダー・スケジュール"},
        {"value": "cost_tracking", "label": "原価管理・予実対比", "category": "ダッシュボード・分析"},
        {"value": "site_photo_report", "label": "現場写真・日報管理", "category": "シンプルなCRUD管理画面"},
        {"value": "document_sharing", "label": "図面・ドキュメント共有", "category": "シンプルなCRUD管理画面"},
    ],
    "food_service": [
        {"value": "reservation_calendar", "label": "予約カレンダー管理", "category": "カレンダー・スケジュール"},
        {"value": "menu_editor", "label": "メニュー編集・公開", "category": "シンプルなCRUD管理画面"},
        {"value": "sales_analytics", "label": "売上分析ダッシュボード", "category": "ダッシュボード・分析"},
        {"value": "shift_scheduler", "label": "シフト作成・共有", "category": "カレンダー・スケジュール"},
        {"value": "customer_crm", "label": "顧客情報・来店履歴", "category": "顧客管理(CRM)"},
        {"value": "order_tablet", "label": "タブレット注文受付", "category": "シンプルなCRUD管理画面"},
    ],
    "healthcare": [
        {"value": "patient_management", "label": "患者・利用者情報管理", "category": "顧客管理(CRM)"},
        {"value": "appointment_schedule", "label": "予約・スケジュール管理", "category": "カレンダー・スケジュール"},
        {"value": "billing_receipt", "label": "請求・レセプト管理", "category": "請求・売上管理"},
        {"value": "staff_shift", "label": "スタッフシフト管理", "category": "カレンダー・スケジュール"},
        {"value": "care_record", "label": "服薬・ケア記録", "category": "シンプルなCRUD管理画面"},
        {"value": "audit_compliance", "label": "監査ログ・法規制対応", "category": "承認ワークフロー"},
    ],
    "it_service": [
        {"value": "project_management", "label": "プロジェクト管理", "category": "シンプルなCRUD管理画面"},
        {"value": "task_ticket", "label": "タスク・チケット管理", "category": "シンプルなCRUD管理画面"},
        {"value": "time_tracking", "label": "工数管理・レポート", "category": "シンプルなCRUD管理画面"},
        {"value": "client_crm", "label": "顧客・案件管理(CRM)", "category": "顧客管理(CRM)"},
        {"value": "billing_revenue", "label": "請求・売上管理", "category": "請求・売上管理"},
        {"value": "knowledge_base", "label": "ナレッジベース", "category": "シンプルなCRUD管理画面"},
    ],
    "logistics": [
        {"value": "dispatch_route", "label": "配車・ルート管理", "category": "カレンダー・スケジュール"},
        {"value": "delivery_tracking", "label": "荷物追跡・ステータス管理", "category": "シンプルなCRUD管理画面"},
        {"value": "warehouse_inventory", "label": "倉庫在庫管理", "category": "在庫・受発注管理"},
        {"value": "driver_attendance", "label": "ドライバー勤怠管理", "category": "シンプルなCRUD管理画面"},
        {"value": "delivery_dashboard", "label": "配送実績ダッシュボード", "category": "ダッシュボード・分析"},
        {"value": "freight_billing", "label": "請求・運賃計算", "category": "請求・売上管理"},
    ],
}

# Default features for unknown / "other" industry
_DEFAULT_FEATURES: list[dict[str, str]] = [
    {"value": "dashboard", "label": "ダッシュボード・データ可視化", "category": "ダッシュボード・分析"},
    {"value": "data_management", "label": "データ登録・編集・一覧管理", "category": "シンプルなCRUD管理画面"},
    {"value": "data_export", "label": "CSV/PDFエクスポート", "category": "帳票・レポート出力"},
    {"value": "notification", "label": "通知機能（メール/プッシュ）", "category": "通知・アラート"},
    {"value": "search", "label": "検索・フィルタリング", "category": "検索・フィルタリング"},
    {"value": "workflow", "label": "承認ワークフロー・申請管理", "category": "承認ワークフロー"},
]

# Industry-specific fallback features for estimate generation.
_INDUSTRY_ESTIMATE_FEATURES: dict[str, list[dict]] = {
    "manufacturing": [
        {"name": "受発注管理", "detail": "受注・発注の一元管理と入力画面", "standard_price": 900000, "hybrid_price": 540000},
        {"name": "在庫管理", "detail": "在庫数のリアルタイム把握と入出庫管理", "standard_price": 750000, "hybrid_price": 450000},
        {"name": "生産スケジュール管理", "detail": "生産計画の作成・進捗管理", "standard_price": 650000, "hybrid_price": 390000},
        {"name": "原価計算", "detail": "製品ごとの原価計算とコスト分析", "standard_price": 550000, "hybrid_price": 330000},
        {"name": "月次レポート", "detail": "月次の売上・在庫レポート自動生成", "standard_price": 450000, "hybrid_price": 270000},
    ],
    "retail": [
        {"name": "商品管理", "detail": "商品マスタの登録・編集・一覧", "standard_price": 650000, "hybrid_price": 390000},
        {"name": "在庫管理・自動発注", "detail": "在庫数管理と発注点アラート", "standard_price": 750000, "hybrid_price": 450000},
        {"name": "売上分析", "detail": "売上データの集計とグラフ表示", "standard_price": 650000, "hybrid_price": 390000},
        {"name": "顧客管理", "detail": "顧客情報と購買履歴の管理", "standard_price": 550000, "hybrid_price": 330000},
        {"name": "帳票出力", "detail": "請求書・納品書のPDF出力", "standard_price": 450000, "hybrid_price": 270000},
    ],
    "construction": [
        {"name": "工事案件管理", "detail": "案件情報の一元管理と進捗追跡", "standard_price": 900000, "hybrid_price": 540000},
        {"name": "見積・請求管理", "detail": "見積書・請求書の作成と管理", "standard_price": 650000, "hybrid_price": 390000},
        {"name": "工程管理", "detail": "工程スケジュールの作成と共有", "standard_price": 650000, "hybrid_price": 390000},
        {"name": "原価管理", "detail": "工事ごとの原価・予実管理", "standard_price": 750000, "hybrid_price": 450000},
        {"name": "現場写真・日報", "detail": "現場写真のアップロードと日報管理", "standard_price": 450000, "hybrid_price": 270000},
    ],
    "food_service": [
        {"name": "予約管理", "detail": "予約カレンダーと空席管理", "standard_price": 650000, "hybrid_price": 390000},
        {"name": "メニュー管理", "detail": "メニューの編集・公開管理", "standard_price": 450000, "hybrid_price": 270000},
        {"name": "売上分析", "detail": "日次・月次の売上集計と分析", "standard_price": 550000, "hybrid_price": 330000},
        {"name": "シフト管理", "detail": "スタッフのシフト作成と共有", "standard_price": 450000, "hybrid_price": 270000},
        {"name": "顧客管理", "detail": "顧客情報と来店履歴の管理", "standard_price": 550000, "hybrid_price": 330000},
    ],
    "healthcare": [
        {"name": "患者情報管理", "detail": "患者・利用者の基本情報管理", "standard_price": 900000, "hybrid_price": 540000},
        {"name": "予約管理", "detail": "予約スケジュールの管理と通知", "standard_price": 650000, "hybrid_price": 390000},
        {"name": "請求管理", "detail": "請求・レセプトの作成と管理", "standard_price": 750000, "hybrid_price": 450000},
        {"name": "ケア記録", "detail": "服薬・ケア内容の記録と閲覧", "standard_price": 550000, "hybrid_price": 330000},
        {"name": "シフト管理", "detail": "スタッフのシフト作成と管理", "standard_price": 450000, "hybrid_price": 270000},
    ],
    "it_service": [
        {"name": "プロジェクト管理", "detail": "プロジェクトの進捗・タスク管理", "standard_price": 900000, "hybrid_price": 540000},
        {"name": "工数管理", "detail": "メンバーの工数入力とレポート", "standard_price": 650000, "hybrid_price": 390000},
        {"name": "顧客・案件管理", "detail": "顧客情報と案件の一元管理", "standard_price": 650000, "hybrid_price": 390000},
        {"name": "請求管理", "detail": "案件ごとの請求書作成と管理", "standard_price": 550000, "hybrid_price": 330000},
        {"name": "ナレッジベース", "detail": "社内ナレッジの蓄積・検索", "standard_price": 450000, "hybrid_price": 270000},
    ],
    "logistics": [
        {"name": "配車管理", "detail": "配車計画とルート最適化", "standard_price": 900000, "hybrid_price": 540000},
        {"name": "荷物追跡", "detail": "荷物のステータス管理と追跡", "standard_price": 750000, "hybrid_price": 450000},
        {"name": "倉庫在庫管理", "detail": "倉庫内の在庫数と入出庫管理", "standard_price": 650000, "hybrid_price": 390000},
        {"name": "ドライバー勤怠", "detail": "ドライバーの出退勤・稼働管理", "standard_price": 550000, "hybrid_price": 330000},
        {"name": "配送レポート", "detail": "配送実績の集計とダッシュボード", "standard_price": 450000, "hybrid_price": 270000},
    ],
}

_DEFAULT_ESTIMATE_FEATURES: list[dict] = [
    {"name": "データ管理画面", "detail": "データの登録・編集・削除・一覧表示", "standard_price": 900000, "hybrid_price": 540000},
    {"name": "ダッシュボード", "detail": "主要KPIの可視化とグラフ表示", "standard_price": 650000, "hybrid_price": 390000},
    {"name": "帳票出力", "detail": "PDF・Excel形式でのレポート出力", "standard_price": 450000, "hybrid_price": 270000},
    {"name": "検索・フィルタ", "detail": "データの高度な検索とフィルタリング", "standard_price": 350000, "hybrid_price": 210000},
    {"name": "通知機能", "detail": "メール・プッシュ通知による自動通知", "standard_price": 450000, "hybrid_price": 270000},
]

# Industry labels for project name generation
_INDUSTRY_LABELS: dict[str, str] = {
    "manufacturing": "製造業",
    "retail": "小売・卸売業",
    "construction": "建設業",
    "food_service": "飲食業",
    "healthcare": "医療・福祉",
    "it_service": "IT・情報サービス業",
    "logistics": "物流・運輸業",
}


class FallbackAdapter(LLMAdapter):
    """Returns industry-specific default data when OpenAI is unavailable."""

    async def generate_dynamic_questions(
        self,
        user_overview: str,
        system_type: str,
        context: dict | None = None,
    ) -> dict:
        """Return industry-aware Step 8 feature suggestions."""
        logger.warning("Using fallback adapter for dynamic questions")

        industry = (context or {}).get("industry", "other")
        features = _INDUSTRY_FEATURES.get(industry, _DEFAULT_FEATURES)

        return {"step8_features": features}

    async def audit_estimate(
        self, estimate_data: dict, calculated_data: dict
    ) -> dict:
        """フォールバック: 入力をそのまま返す。"""
        logger.warning("Using fallback adapter for audit — passthrough")
        return estimate_data

    async def generate_estimate(self, calculated_data: dict) -> dict:
        """Return a template-based estimate using pre-calculated pricing data."""
        logger.warning("Using fallback adapter for estimate generation")

        user_input = calculated_data.get("user_input", {})
        industry = user_input.get("step_2", "other")
        industry_label = _INDUSTRY_LABELS.get(industry, "")

        # Use pricing engine's calculated features
        calc_features = calculated_data.get("features", [])
        total_standard = calculated_data.get("total_standard", 0)
        total_hybrid = calculated_data.get("total_hybrid", 0)
        confidence = calculated_data.get("confidence", {})

        # Generate feature names/details from fallback templates or category
        features: list[dict] = []
        fallback_templates = _INDUSTRY_ESTIMATE_FEATURES.get(industry, _DEFAULT_ESTIMATE_FEATURES)
        for i, cf in enumerate(calc_features):
            if i < len(fallback_templates):
                name = fallback_templates[i]["name"]
                detail = fallback_templates[i]["detail"]
            else:
                name = cf.get("category", "機能")
                detail = "業務効率化を支援する機能"
            features.append({
                "name": name,
                "detail": detail,
                "standard_price": cf["standard_price"],
                "hybrid_price": cf["hybrid_price"],
            })

        project_name = f"{industry_label}向け業務管理システム" if industry_label else "業務管理システム開発プロジェクト"

        return {
            "project_name": project_name,
            "summary": (
                f"{industry_label}における一般的な業務課題の解決に向け、"
                "データ管理・分析・業務効率化を中心とした機能構成をご提案いたします。"
                "詳細ヒアリングにて、貴社の業務に最適な構成へ調整いたします。"
                if industry_label
                else "お客様のご要望に基づき、業務効率化を実現するシステムの概算見積もりを作成いたしました。"
                "詳細ヒアリングにて、最適な構成へ調整いたします。"
            ),
            "development_model_explanation": (
                "本質的な課題解決とスピードを両立するため、AIが実装の8割を自動生成し、"
                "残り2割のコア部分を専門エンジニアが磨き上げる"
                "『ハイブリッド開発』にて進行いたします。"
            ),
            "features": features,
            "discussion_agenda": [
                "現在の業務フローの詳細ヒアリング（手作業の頻度・関係者数）",
                "最も優先して解決したい課題のTop3",
                "セキュリティ要件の確認",
                "開発スケジュールとリリース計画の策定",
            ],
            "total_cost": {
                "standard": total_standard,
                "hybrid": total_hybrid,
                "message": (
                    f"従来型のスクラッチ開発では約{total_standard // 10000}万円の規模となりますが、"
                    f"AIハイブリッド開発を活用することで、品質を保ちながら"
                    f"約{total_hybrid // 10000}万円でのシステム構築が可能です。"
                ),
            },
            "confidence_note": (
                f"本概算の精度は{confidence.get('range_label', '±30%')}です。"
                "詳細ヒアリングにて精度を向上いたします。"
            ),
        }
