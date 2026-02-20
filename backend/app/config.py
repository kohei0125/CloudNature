import logging

from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    openai_api_key: str = ""
    openai_model: str = "gpt-4o"
    llm_max_retries: int = 3
    llm_timeout: int = 30
    resend_api_key: str = ""
    email_from: str = "CloudNature <cloudnature@stage-site.net>"
    notify_email: str = ""
    database_url: str = "sqlite:///./estimate.db"
    frontend_url: str = "http://localhost:3001"
    cors_origins: str = "http://localhost:3001"
    data_ttl_days: int = 31
    api_key: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

# Startup warnings for missing configuration
if not settings.openai_api_key:
    logger.warning("OPENAI_API_KEY is not set — LLM will use fallback adapter")
if not settings.resend_api_key:
    logger.warning("RESEND_API_KEY is not set — email sending is disabled")
