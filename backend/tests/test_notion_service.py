"""notion_service.save_estimate_to_notion の children ブロック構築テスト。"""

from unittest.mock import MagicMock, patch

from app.services.notion_service import save_estimate_to_notion


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

    def test_absent_when_follow_up_message_missing(self):
        children = _run_and_capture_children({})

        assert "送付メール文面" not in _heading_texts(children)

    def test_absent_when_follow_up_message_whitespace_only(self):
        children = _run_and_capture_children({"follow_up_message": "   \n  "})

        assert "送付メール文面" not in _heading_texts(children)
