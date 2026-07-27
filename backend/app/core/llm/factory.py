"""Factory for creating LLM adapters."""

import logging

from app.config import Settings
from app.core.llm.adapter import LLMAdapter
from app.core.llm.chain import ChainAdapter
from app.core.llm.fallback import FallbackAdapter

logger = logging.getLogger(__name__)

_REAL_PROVIDERS = ("gemini", "openai")


def _build_provider_adapter(provider: str, settings: Settings) -> LLMAdapter | None:
    """指定プロバイダのアダプターを生成する。APIキー未設定なら None を返す。"""
    if provider == "gemini":
        if not settings.gemini_api_key:
            return None
        from app.core.llm.gemini_adapter import GeminiAdapter
        logger.info("Gemini adapter available (model=%s)", settings.gemini_model)
        return GeminiAdapter(settings)

    if provider == "openai":
        if not settings.openai_api_key:
            return None
        from app.core.llm.openai_adapter import OpenAIAdapter
        logger.info("OpenAI adapter available (model=%s)", settings.openai_model)
        return OpenAIAdapter(settings)

    return None


def create_llm_adapter(settings: Settings) -> LLMAdapter:
    """Create the appropriate LLM adapter based on configuration.

    llm_provider の設定値に基づきprimaryプロバイダを選択する:
      - "gemini"   → GeminiAdapter を primary、OpenAIAdapter を secondary
      - "openai"   → OpenAIAdapter を primary、GeminiAdapter を secondary
      - "fallback" → FallbackAdapter (テンプレート応答)

    primary/secondary 双方のAPIキーが揃っている場合、primaryが実行時エラーで
    失敗すると secondary（別プロバイダ）へ自動フェイルオーバーする(ChainAdapter)。
    どちらか一方しかキーが無い場合はそのプロバイダを単独で使用し、
    どちらも無い場合は FallbackAdapter (テンプレート応答) を使用する。
    """
    provider = settings.llm_provider.lower()

    if provider == "fallback":
        logger.info("Using fallback adapter (LLM_PROVIDER=fallback)")
        return FallbackAdapter()

    if provider not in _REAL_PROVIDERS:
        logger.warning("Unknown LLM_PROVIDER=%s — using fallback", provider)
        return FallbackAdapter()

    secondary_provider = "openai" if provider == "gemini" else "gemini"

    primary = _build_provider_adapter(provider, settings)
    secondary = _build_provider_adapter(secondary_provider, settings)

    if primary and secondary:
        logger.info(
            "Using %s adapter as primary with %s failover", provider, secondary_provider
        )
        return ChainAdapter(primary, secondary)

    if adapter := (primary or secondary):
        logger.warning(
            "LLM_PROVIDER=%s but only one of %s/%s API keys is set — using %s without failover",
            provider,
            provider,
            secondary_provider,
            type(adapter).__name__,
        )
        return adapter

    logger.warning(
        "LLM_PROVIDER=%s but neither %s nor %s API key is set — using fallback",
        provider,
        provider,
        secondary_provider,
    )
    return FallbackAdapter()
