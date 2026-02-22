"""OpenAI-based LLM adapter implementation."""

import json
import logging
from pathlib import Path

from openai import AsyncOpenAI

from app.config import Settings
from app.core.llm.adapter import LLMAdapter

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).resolve().parent.parent.parent / "prompts" / "v1"


def _load_prompt(filename: str) -> str:
    """Load a prompt template from the prompts directory."""
    return (PROMPTS_DIR / filename).read_text(encoding="utf-8")


class OpenAIAdapter(LLMAdapter):
    """LLM adapter using OpenAI API (gpt-4o)."""

    def __init__(self, settings: Settings) -> None:
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
        self.timeout = settings.llm_timeout

    async def generate_dynamic_questions(
        self,
        user_overview: str,
        system_type: str,
        context: dict | None = None,
    ) -> dict:
        """Generate Step 8 feature suggestions based on user input."""
        system_prompt = _load_prompt("dynamic_questions.txt")

        # Build user message from full context if available
        if context:
            user_content = json.dumps(context, ensure_ascii=False)
        else:
            user_content = (
                f"システム種類: {system_type}\n\n"
                f"システム概要:\n{user_overview}"
            )

        # Structured message separation to mitigate prompt injection
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
            timeout=self.timeout,
        )

        content = response.choices[0].message.content or "{}"
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            logger.error("Failed to parse dynamic questions response: %s", content[:200])
            raise

    async def generate_estimate(self, calculated_data: dict) -> dict:
        """Generate text content for an estimate using pre-calculated pricing data."""
        system_prompt = _load_prompt("estimate_generation.txt")

        # Separate user_input and calculated data as the prompt expects
        user_message = {
            "user_input": calculated_data.get("user_input", {}),
            "calculated": {
                k: v for k, v in calculated_data.items() if k != "user_input"
            },
        }

        # Structured message separation to mitigate prompt injection
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": json.dumps(
                        user_message, ensure_ascii=False
                    ),
                },
            ],
            temperature=0.5,
            response_format={"type": "json_object"},
            timeout=self.timeout,
        )

        content = response.choices[0].message.content or "{}"
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            logger.error("Failed to parse estimate response: %s", content[:200])
            raise
