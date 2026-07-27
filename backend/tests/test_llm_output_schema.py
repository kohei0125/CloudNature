"""validate_estimate_output の follow_up_message 検証ロジックのテスト。"""

from app.schemas.llm_output import validate_estimate_output


def _base_output(**overrides) -> dict:
    data = {
        "project_name": "テストプロジェクト",
        "summary": "テストサマリー",
        "development_model_explanation": "テンプレート文",
        "features": [
            {"name": "機能A", "detail": "詳細A", "standard_price": 100000, "hybrid_price": 60000},
        ],
        "discussion_agenda": ["確認事項1", "確認事項2", "確認事項3"],
        "total_cost": {"standard": 100000, "hybrid": 60000, "message": "金額比較文"},
        "confidence_note": "本概算の精度は±30%です。",
        "follow_up_message": "課題への言及メッセージ",
    }
    data.update(overrides)
    return data


class TestFollowUpMessageValidation:
    def test_valid_output_passes(self):
        assert validate_estimate_output(_base_output()) is True

    def test_empty_follow_up_message_fails(self):
        assert validate_estimate_output(_base_output(follow_up_message="")) is False

    def test_whitespace_only_follow_up_message_fails(self):
        assert validate_estimate_output(_base_output(follow_up_message="   \n  ")) is False

    def test_missing_follow_up_message_key_fails(self):
        data = _base_output()
        del data["follow_up_message"]
        assert validate_estimate_output(data) is False
