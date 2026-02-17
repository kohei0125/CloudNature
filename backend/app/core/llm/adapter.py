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
    async def generate_estimate(self, user_input_history: dict) -> dict:
        """Generate full estimate and requirements data."""
        pass
