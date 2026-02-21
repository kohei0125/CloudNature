"""PII sanitizer for data sent to LLM."""

import re

# Keys that should never be sent to the LLM
_SKIP_KEYS = frozenset({"email", "phone", "company_name", "user_name", "address"})

# Step keys containing PII that should be excluded entirely
_PII_STEP_KEYS = frozenset({"step_13"})

# Free-text step keys where prompt injection filtering is applied
_FREE_TEXT_STEP_KEYS = frozenset({"step_4", "step_12", "challenges"})

# Regex patterns for PII detection in free-text fields
_PII_PATTERNS = [
    # Email addresses
    (re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"), "[EMAIL]"),
    # Japanese phone numbers (with/without hyphens)
    (re.compile(r"(?:0\d{1,4}[-\s]?\d{1,4}[-\s]?\d{3,4}|\d{10,11})"), "[PHONE]"),
    # URLs (may contain tracking params)
    (re.compile(r"https?://\S+"), "[URL]"),
]

# Regex patterns for prompt injection detection in free-text fields.
# Patterns are intentionally narrow to avoid false positives on legitimate
# business descriptions (e.g. "フォーマットを変えたい", "役割を変更したい").
_INJECTION_PATTERNS = [
    # Role change attempts targeting the AI itself
    re.compile(r"(あなたは|you\s+are|act\s+as|pretend).{0,20}(になって|として|に切り替え|switch|change\s+role)", re.IGNORECASE),
    # Ignore previous instructions
    re.compile(r"(ignore|無視して|忘れて|disregard).{0,20}(previous|前の|上記の|instructions|指示を|プロンプト)", re.IGNORECASE),
    # Prompt leak requests
    re.compile(r"(system\s*prompt|システムプロンプト|指示内容を|プロンプトを).{0,20}(教えて|出力して|表示して|show|reveal|print)", re.IGNORECASE),
    # Output format override targeting JSON output
    re.compile(r"(JSON出力を|JSON形式を|出力形式を).{0,20}(やめて|変えて|無視して|override)", re.IGNORECASE),
]


def sanitize_for_llm(data: dict) -> dict:
    """Remove PII and neutralize prompt injection before sending to LLM.

    - Skips known PII keys entirely (email, phone, etc.)
    - Skips PII-heavy steps (company name, contact person, email steps)
    - Applies regex-based redaction on remaining free-text values
    - Removes prompt injection patterns from free-text values
    """
    sanitized = {}
    for key, value in data.items():
        if key in _SKIP_KEYS or key in _PII_STEP_KEYS:
            continue
        if isinstance(value, str):
            for pattern, replacement in _PII_PATTERNS:
                value = pattern.sub(replacement, value)
            if key in _FREE_TEXT_STEP_KEYS:
                for injection_pattern in _INJECTION_PATTERNS:
                    value = injection_pattern.sub("[FILTERED]", value)
        sanitized[key] = value
    return sanitized

