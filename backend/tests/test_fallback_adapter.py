"""fallback adapter のフォールバック改善テスト。

step_4 (challenges) のキーワード解析が動的質問・見積もり生成の両方で
正しく反映されることを検証する。
"""

import asyncio

import pytest

from app.core.llm.fallback import FallbackAdapter, _detect_challenge_intent


# ---------------------------------------------------------------------------
# _detect_challenge_intent
# ---------------------------------------------------------------------------


class TestDetectChallengeIntent:
    def test_hr_keyword(self):
        """「人材管理」キーワードで人材管理システムの意図が検出される。"""
        label, features = _detect_challenge_intent("人材管理システムを構築したい")
        assert label == "人材管理システム"
        assert features is not None
        assert len(features) >= 5
        values = [f["value"] for f in features]
        assert "employee_master" in values

    def test_attendance_keyword(self):
        """「勤怠管理」キーワードが検出される。"""
        label, features = _detect_challenge_intent("勤怠管理を導入したい")
        assert label == "勤怠管理システム"
        assert features is not None

    def test_project_mgmt_keyword(self):
        """「プロジェクト管理」キーワードが検出される。"""
        label, features = _detect_challenge_intent("プロジェクト管理をしたい")
        assert label == "プロジェクト管理システム"
        assert features is not None

    def test_no_keyword_match(self):
        """キーワードに合致しない場合は None を返す。"""
        label, features = _detect_challenge_intent("業務を効率化したい")
        assert label is None
        assert features is None

    def test_empty_string(self):
        """空文字列で None を返す。"""
        label, features = _detect_challenge_intent("")
        assert label is None
        assert features is None

    def test_hr_case_insensitive(self):
        """「HR」は大文字小文字を問わない。"""
        label, features = _detect_challenge_intent("hrシステムを導入したい")
        assert label == "人材管理システム"

    def test_inventory_keyword(self):
        """「在庫管理」キーワードが検出される。"""
        label, features = _detect_challenge_intent("在庫管理を効率化したい")
        assert label == "在庫管理システム"

    def test_ec_keyword(self):
        """「EC」キーワードが検出される。"""
        label, features = _detect_challenge_intent("ECサイトを立ち上げたい")
        assert label == "ECサイト"


# ---------------------------------------------------------------------------
# FallbackAdapter.generate_dynamic_questions
# ---------------------------------------------------------------------------


class TestFallbackDynamicQuestions:
    @pytest.mark.asyncio
    async def test_hr_challenge_overrides_industry(self):
        """step_4に「人材管理」があれば、業種(manufacturing)を無視してHR機能を返す。"""
        adapter = FallbackAdapter()
        result = await adapter.generate_dynamic_questions(
            user_overview="人材管理システムを構築したい",
            system_type="web_app",
            context={
                "industry": "manufacturing",
                "challenges": "人材管理システムを構築したい",
            },
        )

        features = result.get("step8_features", [])
        values = [f["value"] for f in features]
        # 製造業テンプレートの機能(order_management)ではなくHR機能が含まれる
        assert "employee_master" in values
        assert "order_management" not in values

    @pytest.mark.asyncio
    async def test_no_keyword_falls_back_to_industry(self):
        """キーワードに合致しない場合は業種テンプレートにフォールバック。"""
        adapter = FallbackAdapter()
        result = await adapter.generate_dynamic_questions(
            user_overview="業務改善したい",
            system_type="web_app",
            context={
                "industry": "manufacturing",
                "challenges": "業務改善したい",
            },
        )

        features = result.get("step8_features", [])
        values = [f["value"] for f in features]
        # 製造業テンプレートの機能が含まれる
        assert "order_management" in values


# ---------------------------------------------------------------------------
# FallbackAdapter.generate_estimate
# ---------------------------------------------------------------------------


class TestFallbackGenerateEstimate:
    @pytest.mark.asyncio
    async def test_hr_challenge_reflects_in_project_name(self):
        """step_4「人材管理」が project_name に反映される。"""
        adapter = FallbackAdapter()
        result = await adapter.generate_estimate({
            "user_input": {
                "step_2": "manufacturing",
                "step_4": "人材管理システムを構築したい",
                "step_8": ["employee_master", "attendance_mgmt"],
                "step_8_labels": {
                    "employee_master": "社員情報マスタ管理",
                    "attendance_mgmt": "出退勤・勤怠管理",
                },
            },
            "features": [
                {"category": "基本データ管理", "standard_price": 500000, "hybrid_price": 300000},
                {"category": "カレンダー・スケジュール", "standard_price": 400000, "hybrid_price": 240000},
            ],
            "total_standard": 900000,
            "total_hybrid": 540000,
            "confidence": {"range_label": "±20%", "level": "high"},
        })

        assert "人材管理" in result["project_name"]
        # 「受発注管理」が含まれていないこと
        assert "受発注管理" not in result["project_name"]

    @pytest.mark.asyncio
    async def test_step8_labels_used_for_feature_names(self):
        """step_8 ラベルが feature の name に反映される。"""
        adapter = FallbackAdapter()
        result = await adapter.generate_estimate({
            "user_input": {
                "step_2": "manufacturing",
                "step_4": "人材管理システムを構築したい",
                "step_8": ["employee_master", "attendance_mgmt"],
                "step_8_labels": {
                    "employee_master": "社員情報マスタ管理",
                    "attendance_mgmt": "出退勤・勤怠管理",
                },
            },
            "features": [
                {"category": "基本データ管理", "standard_price": 500000, "hybrid_price": 300000},
                {"category": "カレンダー・スケジュール", "standard_price": 400000, "hybrid_price": 240000},
            ],
            "total_standard": 900000,
            "total_hybrid": 540000,
            "confidence": {"range_label": "±20%", "level": "high"},
        })

        feature_names = [f["name"] for f in result["features"]]
        assert "社員情報マスタ管理" in feature_names
        assert "出退勤・勤怠管理" in feature_names
        # 製造業テンプレートの名前が使われていないこと
        assert "受発注管理" not in feature_names
        assert "在庫管理" not in feature_names

    @pytest.mark.asyncio
    async def test_no_keyword_uses_industry_template(self):
        """キーワードに合致しない場合は業種テンプレートにフォールバック。"""
        adapter = FallbackAdapter()
        result = await adapter.generate_estimate({
            "user_input": {
                "step_2": "manufacturing",
                "step_4": "業務改善したい",
                "step_8": [],
            },
            "features": [
                {"category": "基本データ管理", "standard_price": 500000, "hybrid_price": 300000},
            ],
            "total_standard": 500000,
            "total_hybrid": 300000,
            "confidence": {"range_label": "±30%", "level": "medium"},
        })

        # 業種テンプレートフォールバック
        assert "製造業" in result["project_name"]

    @pytest.mark.asyncio
    async def test_summary_reflects_challenge(self):
        """step_4の内容がsummaryに反映される。"""
        adapter = FallbackAdapter()
        result = await adapter.generate_estimate({
            "user_input": {
                "step_2": "manufacturing",
                "step_4": "人材管理システムを構築したい",
                "step_8": [],
            },
            "features": [],
            "total_standard": 0,
            "total_hybrid": 0,
            "confidence": {"range_label": "±30%", "level": "medium"},
        })

        assert "人材管理" in result["summary"]
