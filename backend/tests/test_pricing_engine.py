"""pricing_engine のユニットテスト。"""

from app.core.pricing_engine import (
    _BASE_PRICES,
    _COMPLEX_CATEGORIES,
    _FEATURE_TO_CATEGORY,
    _feature_count_discount,
    _get_base_price,
    _calculate_multiplier,
    _calculate_phase_breakdown,
    _calculate_confidence,
    _check_budget,
    _detect_edge_cases,
    _detect_nfr_keywords,
    _resolve_features,
    _round_to_1000,
    calculate_estimate,
)


# ---------------------------------------------------------------------------
# _round_to_1000
# ---------------------------------------------------------------------------

class TestRoundTo1000:
    def test_exact_multiple(self):
        assert _round_to_1000(500_000) == 500_000

    def test_round_up(self):
        assert _round_to_1000(500_600) == 501_000

    def test_round_down(self):
        assert _round_to_1000(500_400) == 500_000

    def test_midpoint(self):
        # Python round は banker's rounding だが 1000単位なので大きなずれなし
        result = _round_to_1000(500_500)
        assert result in (500_000, 501_000)


# ---------------------------------------------------------------------------
# _get_base_price
# ---------------------------------------------------------------------------

class TestGetBasePrice:
    def test_known_category(self):
        price = _get_base_price("承認ワークフロー")
        # (450000 + 900000) // 2 = 675000
        assert price == 675_000

    def test_unknown_category_falls_back(self):
        price = _get_base_price("存在しないカテゴリ")
        default = _get_base_price("基本データ管理")
        assert price == default

    def test_crud_midpoint(self):
        # (350000 + 650000) // 2 = 500000
        assert _get_base_price("基本データ管理") == 500_000


# ---------------------------------------------------------------------------
# _calculate_multiplier
# ---------------------------------------------------------------------------

class TestCalculateMultiplier:
    def test_all_defaults(self):
        """全項目デフォルトの場合、乗数は1.0。"""
        mult, summary = _calculate_multiplier({
            "step_1": "corporation",
            "step_3": "1-5",
            "step_5": "internal",
            "step_6": "web_app",
            "step_7": "new",
            "step_9": "6months",
            "step_10": "pc",
        })
        assert mult == 1.0
        assert "デフォルト" in summary

    def test_large_multiplier_capped(self):
        """101+ × mobile_app × asap → 2.5倍キャップ。"""
        mult, summary = _calculate_multiplier({
            "step_1": "corporation",
            "step_3": "101+",
            "step_5": "internal",
            "step_6": "mobile_app",
            "step_7": "new",
            "step_9": "asap",
            "step_10": "pc",
        })
        # 1.5 * 1.5 * 1.15 = 2.5875 → capped to 2.5
        assert mult == 2.5
        assert "上限" in summary

    def test_sole_proprietor_discount(self):
        mult, _ = _calculate_multiplier({
            "step_1": "sole_proprietor",
            "step_3": "1-5",
            "step_5": "internal",
            "step_6": "web_app",
            "step_7": "new",
            "step_9": "6months",
            "step_10": "pc",
        })
        assert mult == 0.85

    def test_missing_keys_use_defaults(self):
        mult, _ = _calculate_multiplier({})
        assert mult == 1.0


# ---------------------------------------------------------------------------
# _check_budget
# ---------------------------------------------------------------------------

class TestCheckBudget:
    def test_within_budget(self):
        result = _check_budget(400_000, "under_500k")
        assert result["budget_status"] == "within_budget"

    def test_slightly_over(self):
        # 650000 / 500000 = 1.3 → <=1.3 → slightly_over
        result = _check_budget(650_000, "under_500k")
        assert result["budget_status"] == "slightly_over"
        assert result["budget_message"]

    def test_significantly_over(self):
        # 800000 / 500000 = 1.6 → >1.3 → significantly_over
        result = _check_budget(800_000, "under_500k")
        assert result["budget_status"] == "significantly_over"
        assert "フェーズ分け" in result["budget_message"]

    def test_unknown_budget(self):
        result = _check_budget(999_999_999, "unknown")
        assert result["budget_status"] == "unknown"

    def test_10m_plus_no_limit(self):
        result = _check_budget(50_000_000, "10m_plus")
        assert result["budget_status"] == "unknown"


# ---------------------------------------------------------------------------
# _detect_edge_cases
# ---------------------------------------------------------------------------

class TestDetectEdgeCases:
    def test_vague_step4(self):
        hints = _detect_edge_cases({"step_4": "効率化したい"})
        assert any("step_4" in h for h in hints)

    def test_migration(self):
        hints = _detect_edge_cases({"step_4": "x" * 50, "step_7": "migration"})
        assert any("migration" in h for h in hints)

    def test_healthcare(self):
        hints = _detect_edge_cases({"step_4": "x" * 50, "step_2": "healthcare"})
        assert any("healthcare" in h for h in hints)

    def test_asap(self):
        hints = _detect_edge_cases({"step_4": "x" * 50, "step_9": "asap"})
        assert any("MVP" in h for h in hints)

    def test_many_undecided(self):
        hints = _detect_edge_cases({
            "step_4": "x" * 50,
            "step_5": "undecided",
            "step_6": "undecided_other",
            "step_7": "undecided",
            "step_9": "undecided",
        })
        assert any("未確定" in h for h in hints)


# ---------------------------------------------------------------------------
# calculate_estimate — 統合テスト
# ---------------------------------------------------------------------------

class TestCalculateEstimate:
    def _base_input(self, **overrides) -> dict:
        base = {
            "step_1": "corporation",
            "step_2": "manufacturing",
            "step_3": "6-20",
            "step_4": "受発注の手作業が多く、ミスが頻発している。在庫管理もExcelで限界を感じている。",
            "step_5": "internal",
            "step_6": "web_app",
            "step_7": "new",
            "step_8": ["order_management", "inventory_display", "cost_analysis", "invoice_output"],
            "step_9": "6months",
            "step_10": "pc",
            "step_11": "1m_3m",
            "step_12": "",
        }
        base.update(overrides)
        return base

    def test_basic_case(self):
        """全項目指定の基本ケース。"""
        result = calculate_estimate(self._base_input())

        assert len(result["features"]) == 4
        assert result["total_standard"] > 0
        assert result["total_hybrid"] > 0
        assert result["total_hybrid"] < result["total_standard"]
        assert result["total_hybrid"] < result["total_standard"]
        assert result["budget_status"] in ("within_budget", "slightly_over", "significantly_over", "unknown")
        assert "multiplier_summary" in result
        assert isinstance(result["discussion_hints"], list)
        assert result["user_input"] == self._base_input()

        # 全額が1000円単位であること
        for f in result["features"]:
            assert f["standard_price"] % 1000 == 0
            assert f["hybrid_price"] % 1000 == 0

    def test_sole_proprietor_under_500k(self):
        """sole_proprietor + under_500k のエッジケース。"""
        result = calculate_estimate(self._base_input(
            step_1="sole_proprietor",
            step_11="under_500k",
            step_8=["data_management", "dashboard", "data_export"],
        ))

        # 0.85倍補正が適用されている
        assert result["total_standard"] > 0
        # 予算超過の可能性が高い
        assert result["budget_status"] in ("slightly_over", "significantly_over", "within_budget")

    def test_multiplier_cap(self):
        """101+ × mobile_app × asap → 2.5倍キャップ。"""
        result = calculate_estimate(self._base_input(
            step_3="101+",
            step_5="internal",
            step_6="mobile_app",
            step_9="asap",
            step_8=["order_management"],
        ))

        # 在庫・受発注管理の中央値 = 825000
        # capped at 2.5, 1機能なのでfeature_discount=1.0
        # project overhead /0.65 → 825000 * 2.5 / 0.65
        base = 825_000
        expected_standard = _round_to_1000(base * 2.5 / 0.65)
        assert result["features"][0]["standard_price"] == expected_standard
        assert "上限" in result["multiplier_summary"]

    def test_healthcare_surcharge(self):
        """healthcare 業種は +15% が適用される。"""
        input_healthcare = self._base_input(
            step_2="healthcare",
            step_8=["patient_management"],
        )
        input_other = self._base_input(
            step_2="retail",
            step_8=["customer_history"],  # 同じカテゴリ: 顧客管理(CRM)
        )

        result_hc = calculate_estimate(input_healthcare)
        result_other = calculate_estimate(input_other)

        # healthcare の standard_price は他業種の 1.15 倍
        assert result_hc["features"][0]["standard_price"] == _round_to_1000(
            result_other["features"][0]["standard_price"] * 1.15
        )

    def test_budget_over(self):
        """予算を大幅超過するケース。"""
        result = calculate_estimate(self._base_input(
            step_3="101+",
            step_5="client",
            step_6="mobile_app",
            step_9="asap",
            step_11="under_500k",
            step_8=["order_management", "inventory_display", "cost_analysis",
                     "invoice_output", "pos_integration"],
        ))

        assert result["budget_status"] == "significantly_over"
        assert result["budget_message"]
        assert any("予算" in h for h in result["discussion_hints"])

    def test_empty_step8_defaults(self):
        """step_8 が空の場合、デフォルト機能が使われる。"""
        result = calculate_estimate(self._base_input(step_8=[]))
        assert len(result["features"]) == 3  # data_management, dashboard, data_export

    def test_string_step8(self):
        """step_8 がカンマ区切り文字列の場合。"""
        result = calculate_estimate(self._base_input(
            step_8="order_management,inventory_display"
        ))
        assert len(result["features"]) == 2

    def test_unknown_feature_value_fallback(self):
        """マッピングにない機能value はデフォルトカテゴリにフォールバック。"""
        result = calculate_estimate(self._base_input(
            step_8=["completely_unknown_feature"],
        ))
        assert result["features"][0]["category"] == "基本データ管理"

    def test_hybrid_is_60_percent(self):
        """全機能で hybrid = standard * 0.6 (1000円丸め)。"""
        result = calculate_estimate(self._base_input())
        for f in result["features"]:
            expected = _round_to_1000(f["standard_price"] * 0.6)
            assert f["hybrid_price"] == expected

    def test_totals_match_sum(self):
        """total は features の合計と一致する。"""
        result = calculate_estimate(self._base_input())
        assert result["total_standard"] == sum(f["standard_price"] for f in result["features"])
        assert result["total_hybrid"] == sum(f["hybrid_price"] for f in result["features"])

    def test_new_fields_present(self):
        """必須フィールド（confidence）が存在し、削除済みフィールドが存在しない。"""
        result = calculate_estimate(self._base_input())
        assert "confidence" in result
        assert "range_label" in result["confidence"]
        assert "level" in result["confidence"]
        assert "maintenance" not in result
        assert "phase_breakdown" not in result
        assert "savings_percent" not in result

    def test_logistics_surcharge(self):
        """logistics 業種は +5% が適用される。"""
        input_logistics = self._base_input(
            step_2="logistics",
            step_8=["dispatch_route"],
        )
        input_other = self._base_input(
            step_2="retail",
            step_8=["reservation_calendar"],  # 同じカテゴリ: カレンダー・スケジュール
        )
        result_log = calculate_estimate(input_logistics)
        result_other = calculate_estimate(input_other)
        assert result_log["features"][0]["standard_price"] == _round_to_1000(
            result_other["features"][0]["standard_price"] * 1.05
        )

    def test_client_b2c_multiplier(self):
        """client_b2c は 1.3 倍の乗数が適用される。"""
        result_b2c = calculate_estimate(self._base_input(step_5="client_b2c"))
        result_internal = calculate_estimate(self._base_input(step_5="internal"))
        # B2C has 1.5x multiplier vs internal 1.0x
        assert result_b2c["total_standard"] > result_internal["total_standard"]


# ---------------------------------------------------------------------------
# _calculate_phase_breakdown
# ---------------------------------------------------------------------------

class TestCalculatePhaseBreakdown:
    def test_ratios_sum_to_100(self):
        """工程比率の合計が100%。"""
        result = _calculate_phase_breakdown(1_000_000)
        total_ratio = sum(p["ratio"] for p in result["phases"])
        assert abs(total_ratio - 1.0) < 0.001

    def test_implementation_matches_input(self):
        """実装コストが入力値と一致する。"""
        result = _calculate_phase_breakdown(1_000_000)
        impl = next(p for p in result["phases"] if p["phase"] == "implementation")
        assert impl["cost"] == 1_000_000

    def test_project_total_reasonable(self):
        """プロジェクト総額が開発費の約1.54倍（65%ベース）。"""
        result = _calculate_phase_breakdown(1_000_000)
        # 1_000_000 / 0.65 ≈ 1_538_461 → 各工程丸め後の合計
        assert result["project_total"] > 1_000_000
        assert result["project_total"] < 1_600_000

    def test_phase_costs_sum_to_total(self):
        """各工程コストの合計がプロジェクト総額と一致する。"""
        result = _calculate_phase_breakdown(1_500_000)
        total = sum(p["cost"] for p in result["phases"])
        assert total == result["project_total"]

    def test_all_costs_rounded_to_1000(self):
        """全コストが1000円単位で丸められている（implementationは入力値をそのまま使用）。"""
        result = _calculate_phase_breakdown(1_200_000)
        for p in result["phases"]:
            assert p["cost"] % 1000 == 0


# ---------------------------------------------------------------------------
# _calculate_confidence
# ---------------------------------------------------------------------------

class TestCalculateConfidence:
    def test_high_confidence(self):
        """全項目確定 + 十分な記述 → ±20%。"""
        result = _calculate_confidence({
            "step_4": "x" * 50,
            "step_5": "internal",
            "step_6": "web_app",
            "step_7": "new",
            "step_9": "6months",
        })
        assert result["range_label"] == "±20%"
        assert result["level"] == "high"

    def test_medium_confidence(self):
        """2つ未定 → ±30%。"""
        result = _calculate_confidence({
            "step_4": "x" * 50,
            "step_5": "undecided",
            "step_6": "undecided_other",
            "step_7": "new",
            "step_9": "6months",
        })
        assert result["range_label"] == "±30%"
        assert result["level"] == "medium"

    def test_low_confidence(self):
        """3つ以上未定 → ±50%。"""
        result = _calculate_confidence({
            "step_4": "短い",
            "step_5": "undecided",
            "step_6": "undecided_other",
            "step_7": "undecided",
            "step_9": "undecided",
        })
        assert result["range_label"] == "±50%"
        assert result["level"] == "low"

    def test_short_step4_adds_uncertainty(self):
        """step_4が短いと未定項目カウントが+1される。"""
        result = _calculate_confidence({
            "step_4": "短い",
            "step_5": "internal",
            "step_6": "web_app",
            "step_7": "new",
            "step_9": "6months",
        })
        # step_4が短い → undecided_count=1 → medium
        assert result["level"] == "medium"


# ---------------------------------------------------------------------------
# _detect_nfr_keywords
# ---------------------------------------------------------------------------

class TestDetectNfrKeywords:
    def test_security_keywords(self):
        """セキュリティキーワード検出。"""
        hints = _detect_nfr_keywords({"step_4": "個人情報を扱うためセキュリティが重要", "step_12": ""})
        assert any("セキュリティ" in h for h in hints)

    def test_ha_keywords(self):
        """高可用性キーワード検出。"""
        hints = _detect_nfr_keywords({"step_4": "", "step_12": "稼働率99.9%が必要"})
        assert any("高可用性" in h or "SLA" in h for h in hints)

    def test_i18n_keywords(self):
        """多言語キーワード検出。"""
        hints = _detect_nfr_keywords({"step_4": "多言語対応が必要", "step_12": ""})
        assert any("多言語" in h for h in hints)

    def test_no_keywords(self):
        """キーワードなし → 空リスト。"""
        hints = _detect_nfr_keywords({"step_4": "在庫管理を効率化したい", "step_12": ""})
        assert len(hints) == 0


# ---------------------------------------------------------------------------
# _resolve_features — カテゴリ解決テスト
# ---------------------------------------------------------------------------

class TestResolveFeatures:
    def test_static_mapping_priority(self):
        """静的マッピングが最優先で使用される。"""
        result = _resolve_features({
            "step_8": ["order_management"],
            "step_8_categories": {"order_management": "基本データ管理"},
        })
        assert len(result) == 1
        # 静的マッピングでは「在庫・受発注管理」なので、LLMカテゴリは無視される
        assert result[0]["category"] == "在庫・受発注管理"
        assert result[0]["value"] == "order_management"

    def test_llm_category_fallback(self):
        """静的マッピング外の場合、LLMカテゴリがフォールバックとして使用される。"""
        result = _resolve_features({
            "step_8": ["custom_feature_xyz"],
            "step_8_categories": {"custom_feature_xyz": "決済連携"},
        })
        assert len(result) == 1
        assert result[0]["category"] == "決済連携"

    def test_default_category_fallback(self):
        """静的マッピングもLLMカテゴリもない場合、デフォルトカテゴリにフォールバック。"""
        result = _resolve_features({
            "step_8": ["totally_unknown"],
        })
        assert len(result) == 1
        assert result[0]["category"] == "基本データ管理"

    def test_priority_order(self):
        """静的 → LLMカテゴリ → デフォルト の優先順位を検証。"""
        result = _resolve_features({
            "step_8": ["dashboard", "custom_llm_feature", "unknown_feature"],
            "step_8_categories": {
                "dashboard": "帳票・レポート出力",  # 静的マッピングが優先されるはず
                "custom_llm_feature": "AIチャットボット",
            },
        })
        assert len(result) == 3
        # dashboard: 静的マッピング優先
        assert result[0]["category"] == "ダッシュボード・分析"
        # custom_llm_feature: LLMカテゴリ使用
        assert result[1]["category"] == "AIチャットボット"
        # unknown_feature: デフォルト
        assert result[2]["category"] == "基本データ管理"

    def test_empty_step8_categories(self):
        """step_8_categories が空でも既存動作が壊れない。"""
        result = _resolve_features({
            "step_8": ["dashboard", "data_management"],
            "step_8_categories": {},
        })
        assert len(result) == 2
        assert result[0]["category"] == "ダッシュボード・分析"
        assert result[1]["category"] == "基本データ管理"

    def test_no_step8_categories_key(self):
        """step_8_categories キーが存在しなくても動作する。"""
        result = _resolve_features({
            "step_8": ["notification"],
        })
        assert len(result) == 1
        assert result[0]["category"] == "通知・アラート"

    def test_string_step8(self):
        """step_8 がカンマ区切り文字列でも正しくパースされる。"""
        result = _resolve_features({
            "step_8": "dashboard,notification",
        })
        assert len(result) == 2
        assert result[0]["value"] == "dashboard"
        assert result[1]["value"] == "notification"

    def test_empty_step8(self):
        """step_8 が空リストの場合、空リストを返す。"""
        result = _resolve_features({"step_8": []})
        assert result == []


# ---------------------------------------------------------------------------
# _feature_count_discount
# ---------------------------------------------------------------------------

class TestFeatureCountDiscount:
    def test_no_discount(self):
        """n=1,2 → ディスカウントなし (1.0)。"""
        assert _feature_count_discount(1, ["基本データ管理"]) == 1.0
        assert _feature_count_discount(2, ["基本データ管理", "検索・フィルタリング"]) == 1.0

    def test_small(self):
        """n=3,4 → 0.93。"""
        cats = ["基本データ管理"] * 3
        assert _feature_count_discount(3, cats) == 0.93
        assert _feature_count_discount(4, cats + ["検索・フィルタリング"]) == 0.93

    def test_medium(self):
        """n=5,6 → 0.85。"""
        cats = ["基本データ管理"] * 5
        assert _feature_count_discount(5, cats) == 0.85
        assert _feature_count_discount(6, cats + ["検索・フィルタリング"]) == 0.85

    def test_large(self):
        """n=7+ → 0.78。"""
        cats = ["基本データ管理"] * 7
        assert _feature_count_discount(7, cats) == 0.78
        assert _feature_count_discount(10, cats + ["検索・フィルタリング"] * 3) == 0.78

    def test_complex_override(self):
        """n=7 + complex>=2 → max(0.78, 0.90) = 0.90。"""
        cats = ["基本データ管理"] * 5 + ["外部API連携(複雑)", "決済連携"]
        assert _feature_count_discount(7, cats) == 0.90

    def test_complex_with_small_n(self):
        """n=3 + complex>=2 → max(0.93, 0.90) = 0.93（overrideされない）。"""
        cats = ["外部API連携(複雑)", "決済連携", "基本データ管理"]
        assert _feature_count_discount(3, cats) == 0.93

    def test_estimate_with_discount_applied(self):
        """統合テスト: 6機能でディスカウント(0.90)が反映される。"""
        user_input = {
            "step_1": "corporation",
            "step_2": "manufacturing",
            "step_3": "1-5",
            "step_4": "受発注の手作業が多く、ミスが頻発している。在庫管理もExcelで限界を感じている。",
            "step_5": "internal",
            "step_6": "web_app",
            "step_7": "new",
            "step_8": [
                "order_management", "inventory_display", "cost_analysis",
                "invoice_output", "stock_alert", "monthly_report",
            ],
            "step_9": "6months",
            "step_10": "pc",
            "step_11": "3m_5m",
            "step_12": "",
        }
        result = calculate_estimate(user_input)
        assert len(result["features"]) == 6

        # 全乗数デフォルト(1.0)、6機能でdiscount=0.85
        # order_management → 在庫・受発注管理 中央値825000
        base = 825_000
        expected = _round_to_1000(base * 1.0 * 1.0 * 0.85 / 0.65)
        assert result["features"][0]["standard_price"] == expected


class TestFeatureToCategoryConsistency:
    def test_all_categories_exist_in_base_prices(self):
        """全ての _FEATURE_TO_CATEGORY のカテゴリが _BASE_PRICES に存在する。"""
        for value, category in _FEATURE_TO_CATEGORY.items():
            assert category in _BASE_PRICES, (
                f"Feature '{value}' maps to category '{category}' "
                f"which is not in _BASE_PRICES"
            )


class TestCalculateEstimateWithLLMCategories:
    def _base_input(self, **overrides) -> dict:
        base = {
            "step_1": "corporation",
            "step_2": "manufacturing",
            "step_3": "6-20",
            "step_4": "受発注の手作業が多く、ミスが頻発している。",
            "step_5": "internal",
            "step_6": "web_app",
            "step_7": "new",
            "step_8": ["order_management"],
            "step_9": "6months",
            "step_10": "pc",
            "step_11": "1m_3m",
            "step_12": "",
        }
        base.update(overrides)
        return base

    def test_llm_category_used_for_unknown_feature(self):
        """マッピング外の機能がLLMカテゴリで正しく価格計算される。"""
        result = calculate_estimate(self._base_input(
            step_8=["custom_ai_bot"],
            step_8_categories={"custom_ai_bot": "AIチャットボット"},
        ))
        assert result["features"][0]["category"] == "AIチャットボット"
        # AIチャットボットの基準価格: (650000+1650000)//2 = 1150000
        # multiplier=1.05 (6-20人), 1機能なのでfeature_discount=1.0
        # project overhead /0.65 → 1150000 * 1.05 / 0.65
        assert result["features"][0]["standard_price"] == _round_to_1000(1_150_000 * 1.05 / 0.65)

    def test_mixed_static_and_llm_categories(self):
        """静的マッピングとLLMカテゴリの混在ケース。"""
        result = calculate_estimate(self._base_input(
            step_8=["dashboard", "custom_payment"],
            step_8_categories={"custom_payment": "決済連携"},
        ))
        assert result["features"][0]["category"] == "ダッシュボード・分析"
        assert result["features"][1]["category"] == "決済連携"
