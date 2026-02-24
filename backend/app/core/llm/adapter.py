"""Abstract base class for LLM adapters."""

from abc import ABC, abstractmethod


class LLMAdapter(ABC):
    """Interface for LLM adapters used by the estimate service."""

    @abstractmethod
    async def generate_dynamic_questions(
        self,
        user_overview: str,
        system_type: str,
        context: dict | None = None,
    ) -> dict:
        """Generate Step 8-10 questions based on user input."""
        pass

    @abstractmethod
    async def generate_estimate(self, calculated_data: dict) -> dict:
        """Generate text content for an estimate using pre-calculated pricing data.

        Args:
            calculated_data: Output of pricing_engine.calculate_estimate(),
                containing user_input, features (with prices), totals, etc.
        """
        pass

    @abstractmethod
    async def audit_estimate(
        self, estimate_data: dict, calculated_data: dict
    ) -> dict:
        """第3回AIチェック: 見積もり出力の品質監査と修正。

        Args:
            estimate_data: 第2回AI出力（enforce済み）
            calculated_data: Pricing Engine出力
        """
        pass
