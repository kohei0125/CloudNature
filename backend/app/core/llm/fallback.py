"""Fallback LLM adapter with fixed template responses."""

import logging

from app.core.llm.adapter import LLMAdapter

logger = logging.getLogger(__name__)


class FallbackAdapter(LLMAdapter):
    """Returns industry-specific default data when OpenAI is unavailable."""

    async def generate_dynamic_questions(
        self,
        user_overview: str,
        system_type: str,
        context: dict | None = None,
    ) -> dict:
        """Return default Step 8 feature suggestions."""
        logger.warning("Using fallback adapter for dynamic questions")
        return {
            "step8_features": [
                {"value": "dashboard", "label": "ダッシュボード・データ可視化"},
                {"value": "data_management", "label": "データ登録・編集・一覧管理"},
                {"value": "data_export", "label": "データエクスポート（CSV/PDF）"},
                {"value": "notification", "label": "通知機能（メール/プッシュ）"},
                {"value": "search", "label": "検索・フィルタリング"},
                {"value": "workflow", "label": "承認ワークフロー・申請管理"},
                {"value": "external_api", "label": "外部サービス連携（API）"},
            ],
        }

    async def generate_estimate(self, user_input_history: dict) -> dict:
        """Return a template-based estimate."""
        logger.warning("Using fallback adapter for estimate generation")
        features = [
            {
                "name": "ユーザー認証・権限管理",
                "detail": "ログイン、ロール管理、パスワードリセット",
                "standard_price": 800000,
                "hybrid_price": 480000,
            },
            {
                "name": "管理画面（CRUD）",
                "detail": "データの登録・編集・削除・一覧表示",
                "standard_price": 1200000,
                "hybrid_price": 720000,
            },
            {
                "name": "ダッシュボード",
                "detail": "主要KPIの可視化、グラフ表示",
                "standard_price": 600000,
                "hybrid_price": 360000,
            },
            {
                "name": "API連携",
                "detail": "外部サービスとのデータ連携",
                "standard_price": 500000,
                "hybrid_price": 300000,
            },
            {
                "name": "レスポンシブデザイン",
                "detail": "PC・タブレット・スマートフォン対応",
                "standard_price": 400000,
                "hybrid_price": 240000,
            },
        ]
        standard_total = sum(f["standard_price"] for f in features)
        hybrid_total = sum(f["hybrid_price"] for f in features)

        return {
            "project_name": "システム開発プロジェクト",
            "summary": "お客様のご要望に基づき、以下の機能を含むシステムの概算見積もりを作成いたしました。",
            "development_model_explanation": (
                "本プロジェクトは、AIが実装の8割を担当し、"
                "残り2割の重要箇所を専門エンジニアが担当する"
                "『ハイブリッド開発』で進行します。"
            ),
            "features": features,
            "discussion_agenda": [
                "詳細な業務フローの確認",
                "既存システムとのデータ移行方針",
                "セキュリティ要件の詳細確認",
                "運用・保守体制の確認",
            ],
            "total_cost": {
                "standard": standard_total,
                "hybrid": hybrid_total,
                "message": "AIハイブリッド開発により、通常相場より約40%のコストダウンが見込まれます。",
            },
        }
