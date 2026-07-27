"""notion_service の見積もり保存ロジックのユニットテスト。"""

from unittest.mock import MagicMock, patch

import pytest

from app.services.notion_service import build_follow_up_message_text, save_estimate_to_notion


def _base_args(**overrides):
    answers = {"4": "人材管理システムを構築したい"}
    estimate_data = {
        "project_name": "テストプロジェクト",
        "summary": "テストサマリー",
        "total_cost": {"standard": 1000000, "hybrid": 600000},
        "features": [],
    }
    contact = {"name": "山田太郎", "company": "テスト株式会社", "email": "a@example.com", "phone": ""}
    estimate_data.update(overrides)
    return answers, estimate_data, contact


def _run_and_capture_children(estimate_data_overrides: dict) -> list[dict]:
    answers, estimate_data, contact = _base_args(**estimate_data_overrides)
    mock_client = MagicMock()

    with patch("app.services.notion_service._get_notion", return_value=mock_client), \
         patch("app.services.notion_service._get_database_id", return_value="db-id"):
        save_estimate_to_notion(answers, estimate_data, contact)

    assert mock_client.pages.create.called
    return mock_client.pages.create.call_args.kwargs["children"]


def _heading_texts(children: list[dict]) -> list[str]:
    return [
        b["heading_2"]["rich_text"][0]["text"]["content"]
        for b in children
        if b.get("type") == "heading_2"
    ]


class TestBuildFollowUpMessageText:
    """follow_up_message + 宛名 + お打ち合わせ依頼の定型文を組み立てるユニットテスト。"""

    def test_empty_input_returns_empty_string(self):
        assert build_follow_up_message_text("") == ""

    def test_whitespace_only_input_returns_empty_string(self):
        assert build_follow_up_message_text("   \n  ") == ""

    def test_includes_intro_and_meeting_request_without_trailing_signature(self):
        text = build_follow_up_message_text("課題への言及メッセージ")

        assert "課題への言及メッセージ" in text
        assert "お世話になります" in text
        assert "株式会社クラウドネイチャーの渡邉と申します" in text
        assert "お打ち合わせの機会をいただくことは可能でしょうか" in text
        assert "情報収集の段階ということでしたら" in text
        # 末尾に署名（会社名・氏名の繰り返し）が付かないこと
        assert text.endswith("何卒よろしくお願いいたします。")

    def test_strips_surrounding_whitespace_from_llm_output(self):
        text = build_follow_up_message_text("  課題への言及メッセージ  \n", name="山田太郎")

        assert "課題への言及メッセージ\n\n" in text
        assert "課題への言及メッセージ  " not in text

    @pytest.mark.parametrize(
        ("name", "company", "expected_greeting"),
        [
            ("山田太郎", "テスト株式会社", "テスト株式会社\n山田太郎 様"),
            ("山田太郎", "", "山田太郎 様"),
            ("", "", "ご担当者様"),
        ],
    )
    def test_greeting_prefix(self, name, company, expected_greeting):
        text = build_follow_up_message_text(
            "課題への言及メッセージ", name=name, company=company
        )

        expected_prefix = (
            f"{expected_greeting}\n\n"
            "お世話になります。\n"
            "株式会社クラウドネイチャーの渡邉と申します。\n\n"
            "このたびは弊社のミツモリAIをご利用いただき、ありがとうございました。\n\n"
            "課題への言及メッセージ"
        )
        assert text.startswith(expected_prefix)


class TestFollowUpMessageSection:
    def test_present_when_follow_up_message_set(self):
        children = _run_and_capture_children(
            {"follow_up_message": "課題への言及メッセージ"}
        )

        headings = _heading_texts(children)
        assert "送付メール文面" in headings
        assert headings[-1] == "送付メール文面"  # ページ最下部に配置されていること

        section_index = headings.index("送付メール文面")
        # 見出しの次のブロック（本文）に、生成メッセージと定型文の両方が含まれる
        body_block = children[
            [i for i, b in enumerate(children) if b.get("type") == "heading_2"][
                section_index
            ]
            + 1
        ]
        body_text = body_block["paragraph"]["rich_text"][0]["text"]["content"]
        assert "課題への言及メッセージ" in body_text
        assert "お打ち合わせの機会をいただくことは可能でしょうか" in body_text
        # 冒頭に会社名・お名前（contact由来）+ 定型の挨拶文が入り、末尾に署名は付かないこと
        assert body_text.startswith(
            "テスト株式会社\n山田太郎 様\n\n"
            "お世話になります。\n"
            "株式会社クラウドネイチャーの渡邉と申します。\n\n"
            "このたびは弊社のミツモリAIをご利用いただき、ありがとうございました。\n\n"
            "課題への言及メッセージ"
        )
        assert body_text.endswith("何卒よろしくお願いいたします。")

    def test_absent_when_follow_up_message_missing(self):
        children = _run_and_capture_children({})

        assert "送付メール文面" not in _heading_texts(children)

    def test_absent_when_follow_up_message_whitespace_only(self):
        children = _run_and_capture_children({"follow_up_message": "   \n  "})

        assert "送付メール文面" not in _heading_texts(children)
