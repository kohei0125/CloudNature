"""Factory for creating LLM adapters."""

from app.config import Settings
from app.core.llm.adapter import LLMAdapter
from app.core.llm.fallback import FallbackAdapter
from app.core.llm.openai_adapter import OpenAIAdapter


def create_llm_adapter(settings: Settings) -> LLMAdapter:
    """Create the appropriate LLM adapter based on configuration."""
    if settings.openai_api_key:
        return OpenAIAdapter(settings)
    return FallbackAdapter()
