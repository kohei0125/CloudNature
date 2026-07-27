"""email_service の follow_up_message 組み立てロジックのユニットテスト。

このテキストは自動送信メールには使用せず、Notion保存用に
build_follow_up_message_text() で組み立てて notion_service.py から参照する。
"""

from app.services.email_service import build_follow_up_message_text


class TestBuildFollowUpMessageText:
    def test_empty_input_returns_empty_string(self):
        assert build_follow_up_message_text("") == ""

    def test_appends_meeting_request_boilerplate(self):
        text = build_follow_up_message_text("課題への言及メッセージ")

        assert text.startswith("課題への言及メッセージ")
        assert "お打ち合わせの機会をいただくことは可能でしょうか" in text
        assert "情報収集の段階ということでしたら" in text
        assert "株式会社クラウドネイチャー" in text
        assert "渡邉" in text

    def test_strips_surrounding_whitespace_from_llm_output(self):
        text = build_follow_up_message_text("  課題への言及メッセージ  \n")

        assert text.startswith("課題への言及メッセージ\n\n")

    def test_whitespace_only_input_returns_empty_string(self):
        assert build_follow_up_message_text("   \n  ") == ""
