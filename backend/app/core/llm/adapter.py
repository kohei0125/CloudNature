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

