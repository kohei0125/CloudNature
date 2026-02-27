"""Google Gemini-based LLM adapter implementation."""

import asyncio
import json
import logging
from pathlib import Path

from google import genai
from google.genai import types

from app.config import Settings
from app.core.llm.adapter import LLMAdapter

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).resolve().parent.parent.parent / "prompts" / "v1"


def _load_prompt(filename: str) -> str:
    """Load a prompt template from the prompts directory."""
    return (PROMPTS_DIR / filename).read_text(encoding="utf-8")


class GeminiAdapter(LLMAdapter):
    """LLM adapter using Google Gemini API."""

    def __init__(self, settings: Settings) -> None:
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = settings.gemini_model
        self.timeout = settings.llm_timeout

    def _check_safety_block(self, response: types.GenerateContentResponse) -> None:
        """Safety filter でブロックされた場合に ValueError を送出する。"""
        if (
            response.candidates
            and response.candidates[0].finish_reason == "SAFETY"
        ):
            raise ValueError("Response blocked by safety filter")

    async def generate_dynamic_questions(
        self,
        user_overview: str,
        system_type: str,
        context: dict | None = None,
    ) -> dict:
        """Generate Step 8 feature suggestions based on user input."""
        system_prompt = _load_prompt("dynamic_questions.txt")

        if context:
            user_content = json.dumps(context, ensure_ascii=False)
        else:
            user_content = (
                f"システム種類: {system_type}\n\n"
                f"システム概要:\n{user_overview}"
            )

        response = await asyncio.wait_for(
            self.client.aio.models.generate_content(
                model=self.model,
                contents=user_content,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.7,
                    response_mime_type="application/json",
                ),
            ),
            timeout=self.timeout,
        )

        self._check_safety_block(response)
        content = response.text or "{}"
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            logger.error("Failed to parse dynamic questions response: %s", content[:200])
            raise

    async def generate_estimate(self, calculated_data: dict) -> dict:
        """Generate text content for an estimate using pre-calculated pricing data."""
        system_prompt = _load_prompt("estimate_generation.txt")

        user_message = {
            "user_input": calculated_data.get("user_input", {}),
            "calculated": {
                k: v for k, v in calculated_data.items() if k != "user_input"
            },
        }

        response = await asyncio.wait_for(
            self.client.aio.models.generate_content(
                model=self.model,
                contents=json.dumps(user_message, ensure_ascii=False),
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.5,
                    response_mime_type="application/json",
                ),
            ),
            timeout=self.timeout,
        )

        self._check_safety_block(response)
        content = response.text or "{}"
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            logger.error("Failed to parse estimate response: %s", content[:200])
            raise

