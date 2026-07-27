"""Primary/secondary provider の自動フェイルオーバーを行うアダプター。"""

import logging

from app.core.llm.adapter import LLMAdapter

logger = logging.getLogger(__name__)


class ChainAdapter(LLMAdapter):
    """primary が例外を送出した場合に secondary へフェイルオーバーする。

    primary/secondary はどちらも実LLM（Gemini/OpenAI）アダプターを想定。
    両方失敗した場合は secondary の例外をそのまま送出し、
    呼び出し元（estimate_service のリトライループ）に処理を委ねる。
    """

    def __init__(self, primary: LLMAdapter, secondary: LLMAdapter) -> None:
        self.primary = primary
        self.secondary = secondary

    async def _call_with_failover(self, method: str, *args: object) -> dict:
        try:
            return await getattr(self.primary, method)(*args)
        except Exception:
            logger.warning(
                "%s failed for %s — failing over to %s",
                type(self.primary).__name__,
                method,
                type(self.secondary).__name__,
                exc_info=True,
            )
            return await getattr(self.secondary, method)(*args)

    async def generate_dynamic_questions(
        self,
        user_overview: str,
        system_type: str,
        context: dict | None = None,
    ) -> dict:
        return await self._call_with_failover(
            "generate_dynamic_questions", user_overview, system_type, context
        )

    async def generate_estimate(self, calculated_data: dict) -> dict:
        return await self._call_with_failover("generate_estimate", calculated_data)
