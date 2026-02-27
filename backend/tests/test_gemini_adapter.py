"""GeminiAdapter のユニットテスト（モック使用）。"""

import asyncio
import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.config import Settings


def _make_settings(**overrides) -> Settings:
    defaults = {
        "gemini_api_key": "test-key",
        "gemini_model": "gemini-2.5-flash",
        "llm_timeout": 45,
    }
    defaults.update(overrides)
    return Settings(**defaults)


def _make_response(text: str, finish_reason: str = "STOP"):
    """Gemini API レスポンスのモックを生成する。"""
    candidate = MagicMock()
    candidate.finish_reason = finish_reason
    response = MagicMock()
    response.candidates = [candidate]
    response.text = text
    return response


# ---------------------------------------------------------------------------
# generate_dynamic_questions
# ---------------------------------------------------------------------------


class TestGenerateDynamicQuestions:
    @pytest.mark.asyncio
    async def test_success(self):
        expected = {"step8_features": [{"value": "test", "label": "テスト", "category": "テスト"}]}
        mock_response = _make_response(json.dumps(expected))

        with patch("app.core.llm.gemini_adapter.genai") as mock_genai:
            mock_client = MagicMock()
            mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
            mock_genai.Client.return_value = mock_client

            from app.core.llm.gemini_adapter import GeminiAdapter

            adapter = GeminiAdapter(_make_settings())
            result = await adapter.generate_dynamic_questions(
                user_overview="テスト", system_type="web_app"
            )

        assert result == expected

    @pytest.mark.asyncio
    async def test_with_context(self):
        expected = {"step8_features": []}
        mock_response = _make_response(json.dumps(expected))

        with patch("app.core.llm.gemini_adapter.genai") as mock_genai:
            mock_client = MagicMock()
            mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
            mock_genai.Client.return_value = mock_client

            from app.core.llm.gemini_adapter import GeminiAdapter

            adapter = GeminiAdapter(_make_settings())
            result = await adapter.generate_dynamic_questions(
                user_overview="テスト",
                system_type="web_app",
                context={"industry": "manufacturing"},
            )

        assert result == expected

    @pytest.mark.asyncio
    async def test_safety_filter_block(self):
        mock_response = _make_response("", finish_reason="SAFETY")

        with patch("app.core.llm.gemini_adapter.genai") as mock_genai:
            mock_client = MagicMock()
            mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
            mock_genai.Client.return_value = mock_client

            from app.core.llm.gemini_adapter import GeminiAdapter

            adapter = GeminiAdapter(_make_settings())
            with pytest.raises(ValueError, match="safety filter"):
                await adapter.generate_dynamic_questions(
                    user_overview="テスト", system_type="web_app"
                )

    @pytest.mark.asyncio
    async def test_json_parse_error(self):
        mock_response = _make_response("not valid json")

        with patch("app.core.llm.gemini_adapter.genai") as mock_genai:
            mock_client = MagicMock()
            mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
            mock_genai.Client.return_value = mock_client

            from app.core.llm.gemini_adapter import GeminiAdapter

            adapter = GeminiAdapter(_make_settings())
            with pytest.raises(json.JSONDecodeError):
                await adapter.generate_dynamic_questions(
                    user_overview="テスト", system_type="web_app"
                )

    @pytest.mark.asyncio
    async def test_timeout(self):
        async def slow_generate(*args, **kwargs):
            await asyncio.sleep(10)

        with patch("app.core.llm.gemini_adapter.genai") as mock_genai:
            mock_client = MagicMock()
            mock_client.aio.models.generate_content = slow_generate
            mock_genai.Client.return_value = mock_client

            from app.core.llm.gemini_adapter import GeminiAdapter

            adapter = GeminiAdapter(_make_settings(llm_timeout=1))
            # タイムアウトを短縮して即座にタイムアウトさせる
            adapter.timeout = 0.01
            with pytest.raises(asyncio.TimeoutError):
                await adapter.generate_dynamic_questions(
                    user_overview="テスト", system_type="web_app"
                )


# ---------------------------------------------------------------------------
# generate_estimate
# ---------------------------------------------------------------------------


class TestGenerateEstimate:
    @pytest.mark.asyncio
    async def test_success(self):
        expected = {"project_name": "テストプロジェクト", "features": []}
        mock_response = _make_response(json.dumps(expected))

        with patch("app.core.llm.gemini_adapter.genai") as mock_genai:
            mock_client = MagicMock()
            mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
            mock_genai.Client.return_value = mock_client

            from app.core.llm.gemini_adapter import GeminiAdapter

            adapter = GeminiAdapter(_make_settings())
            result = await adapter.generate_estimate({"user_input": {}, "features": []})

        assert result == expected

    @pytest.mark.asyncio
    async def test_safety_filter_block(self):
        mock_response = _make_response("", finish_reason="SAFETY")

        with patch("app.core.llm.gemini_adapter.genai") as mock_genai:
            mock_client = MagicMock()
            mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
            mock_genai.Client.return_value = mock_client

            from app.core.llm.gemini_adapter import GeminiAdapter

            adapter = GeminiAdapter(_make_settings())
            with pytest.raises(ValueError, match="safety filter"):
                await adapter.generate_estimate({"user_input": {}})


# ---------------------------------------------------------------------------
# Factory integration
# ---------------------------------------------------------------------------


class TestFactory:
    def test_gemini_provider(self):
        with patch("app.core.llm.gemini_adapter.genai"):
            from app.core.llm.factory import create_llm_adapter
            from app.core.llm.gemini_adapter import GeminiAdapter

            adapter = create_llm_adapter(
                _make_settings(llm_provider="gemini", gemini_api_key="key")
            )
            assert isinstance(adapter, GeminiAdapter)

    def test_openai_provider(self):
        with patch("app.core.llm.openai_adapter.AsyncOpenAI"):
            from app.core.llm.factory import create_llm_adapter
            from app.core.llm.openai_adapter import OpenAIAdapter

            adapter = create_llm_adapter(
                _make_settings(llm_provider="openai", openai_api_key="key")
            )
            assert isinstance(adapter, OpenAIAdapter)

    def test_fallback_provider(self):
        from app.core.llm.factory import create_llm_adapter
        from app.core.llm.fallback import FallbackAdapter

        adapter = create_llm_adapter(_make_settings(llm_provider="fallback"))
        assert isinstance(adapter, FallbackAdapter)

    def test_gemini_without_key_falls_back(self):
        from app.core.llm.factory import create_llm_adapter
        from app.core.llm.fallback import FallbackAdapter

        adapter = create_llm_adapter(
            _make_settings(llm_provider="gemini", gemini_api_key="")
        )
        assert isinstance(adapter, FallbackAdapter)

    def test_unknown_provider_falls_back(self):
        from app.core.llm.factory import create_llm_adapter
        from app.core.llm.fallback import FallbackAdapter

        adapter = create_llm_adapter(_make_settings(llm_provider="unknown"))
        assert isinstance(adapter, FallbackAdapter)
