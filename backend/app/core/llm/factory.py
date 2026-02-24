"""Factory for creating LLM adapters."""

import logging

from app.config import Settings
from app.core.llm.adapter import LLMAdapter
from app.core.llm.fallback import FallbackAdapter

logger = logging.getLogger(__name__)


def create_llm_adapter(settings: Settings) -> LLMAdapter:
    """Create the appropriate LLM adapter based on configuration.

    llm_provider の設定値に基づきアダプターを選択する:
      - "gemini"   → GeminiAdapter  (GEMINI_API_KEY 必須)
      - "openai"   → OpenAIAdapter  (OPENAI_API_KEY 必須)
      - "fallback" → FallbackAdapter (テンプレート応答)

    APIキーが未設定の場合は FallbackAdapter にフォールバックする。
    """
    provider = settings.llm_provider.lower()

    if provider == "gemini":
        if not settings.gemini_api_key:
            logger.warning("LLM_PROVIDER=gemini but GEMINI_API_KEY is empty — using fallback")
            return FallbackAdapter()
        from app.core.llm.gemini_adapter import GeminiAdapter
        logger.info("Using Gemini adapter (model=%s)", settings.gemini_model)
        return GeminiAdapter(settings)

    if provider == "openai":
        if not settings.openai_api_key:
            logger.warning("LLM_PROVIDER=openai but OPENAI_API_KEY is empty — using fallback")
            return FallbackAdapter()
        from app.core.llm.openai_adapter import OpenAIAdapter
        logger.info("Using OpenAI adapter (model=%s)", settings.openai_model)
        return OpenAIAdapter(settings)

    if provider == "fallback":
        logger.info("Using fallback adapter (LLM_PROVIDER=fallback)")
        return FallbackAdapter()

    logger.warning("Unknown LLM_PROVIDER=%s — using fallback", provider)
    return FallbackAdapter()
