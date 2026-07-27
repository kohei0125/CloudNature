"""ChainAdapter（Gemini⇔OpenAI 自動フェイルオーバー）のユニットテスト。"""

from unittest.mock import AsyncMock

import pytest

from app.core.llm.chain import ChainAdapter


class _StubAdapter:
    """LLMAdapter を模した最小スタブ。"""

    def __init__(self, dynamic_questions_result=None, estimate_result=None, error=None):
        self.generate_dynamic_questions = AsyncMock(
            side_effect=error, return_value=dynamic_questions_result
        )
        self.generate_estimate = AsyncMock(side_effect=error, return_value=estimate_result)


class TestChainAdapterGenerateEstimate:
    @pytest.mark.asyncio
    async def test_primary_success_secondary_not_called(self):
        primary = _StubAdapter(estimate_result={"project_name": "primary"})
        secondary = _StubAdapter(estimate_result={"project_name": "secondary"})
        chain = ChainAdapter(primary, secondary)

        result = await chain.generate_estimate({"user_input": {}})

        assert result == {"project_name": "primary"}
        secondary.generate_estimate.assert_not_called()

    @pytest.mark.asyncio
    async def test_primary_failure_fails_over_to_secondary(self):
        primary = _StubAdapter(error=RuntimeError("gemini down"))
        secondary = _StubAdapter(estimate_result={"project_name": "secondary"})
        chain = ChainAdapter(primary, secondary)

        result = await chain.generate_estimate({"user_input": {}})

        assert result == {"project_name": "secondary"}
        secondary.generate_estimate.assert_awaited_once_with({"user_input": {}})

    @pytest.mark.asyncio
    async def test_both_fail_propagates_secondary_exception(self):
        primary = _StubAdapter(error=RuntimeError("gemini down"))
        secondary = _StubAdapter(error=ValueError("openai down"))
        chain = ChainAdapter(primary, secondary)

        with pytest.raises(ValueError, match="openai down"):
            await chain.generate_estimate({"user_input": {}})


class TestChainAdapterGenerateDynamicQuestions:
    @pytest.mark.asyncio
    async def test_primary_success_secondary_not_called(self):
        primary = _StubAdapter(dynamic_questions_result={"step8_features": ["primary"]})
        secondary = _StubAdapter(dynamic_questions_result={"step8_features": ["secondary"]})
        chain = ChainAdapter(primary, secondary)

        result = await chain.generate_dynamic_questions("overview", "web_app")

        assert result == {"step8_features": ["primary"]}
        secondary.generate_dynamic_questions.assert_not_called()

    @pytest.mark.asyncio
    async def test_primary_failure_fails_over_to_secondary(self):
        primary = _StubAdapter(error=RuntimeError("openai down"))
        secondary = _StubAdapter(dynamic_questions_result={"step8_features": ["secondary"]})
        chain = ChainAdapter(primary, secondary)

        result = await chain.generate_dynamic_questions(
            "overview", "web_app", context={"industry": "retail"}
        )

        assert result == {"step8_features": ["secondary"]}
        secondary.generate_dynamic_questions.assert_awaited_once_with(
            "overview", "web_app", {"industry": "retail"}
        )

    @pytest.mark.asyncio
    async def test_both_fail_propagates_secondary_exception(self):
        primary = _StubAdapter(error=RuntimeError("openai down"))
        secondary = _StubAdapter(error=ValueError("gemini down"))
        chain = ChainAdapter(primary, secondary)

        with pytest.raises(ValueError, match="gemini down"):
            await chain.generate_dynamic_questions("overview", "web_app")
