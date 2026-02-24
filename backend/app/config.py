import logging

from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-nano"
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    llm_provider: str = "gemini"  # "gemini" | "openai" | "fallback"
    llm_max_retries: int = 2
    llm_timeout: int = 45
    resend_api_key: str = ""
    email_from: str = "CloudNature <cloudnature@stage-site.net>"
    notify_email: str = ""
    database_url: str = "sqlite:///./estimate.db"
    frontend_url: str = "http://localhost:3001"
    cors_origins: str = "http://localhost:3001"
    data_ttl_days: int = 31
    api_key: str = ""
    notion_api_key: str = ""
    notion_database_id: str = ""
    audit_enabled: bool = True
    audit_temperature: float = 0.3

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

# Startup warnings for missing configuration
if settings.llm_provider == "gemini" and not settings.gemini_api_key:
    logger.warning("GEMINI_API_KEY is not set — LLM will use fallback adapter")
if settings.llm_provider == "openai" and not settings.openai_api_key:
    logger.warning("OPENAI_API_KEY is not set — LLM will use fallback adapter")
if not settings.resend_api_key:
    logger.warning("RESEND_API_KEY is not set — email sending is disabled")
if not settings.notion_api_key:
    logger.warning("NOTION_API_KEY is not set — Notion integration is disabled")
