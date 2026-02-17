"""PII sanitizer for data sent to LLM."""

import re

# Keys that should never be sent to the LLM
_SKIP_KEYS = frozenset({"email", "phone", "company_name", "user_name", "address"})

# Step keys containing PII that should be excluded entirely
_PII_STEP_KEYS = frozenset({"step_13"})

# Regex patterns for PII detection in free-text fields
_PII_PATTERNS = [
    # Email addresses
    (re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"), "[EMAIL]"),
    # Japanese phone numbers (with/without hyphens)
    (re.compile(r"(?:0\d{1,4}[-\s]?\d{1,4}[-\s]?\d{3,4}|\d{10,11})"), "[PHONE]"),
    # URLs (may contain tracking params)
    (re.compile(r"https?://\S+"), "[URL]"),
]


def sanitize_for_llm(data: dict) -> dict:
    """Remove PII before sending to LLM.

    - Skips known PII keys entirely (email, phone, etc.)
    - Skips PII-heavy steps (company name, contact person, email steps)
    - Applies regex-based redaction on remaining free-text values
    """
    sanitized = {}
    for key, value in data.items():
        if key in _SKIP_KEYS or key in _PII_STEP_KEYS:
            continue
        if isinstance(value, str):
            for pattern, replacement in _PII_PATTERNS:
                value = pattern.sub(replacement, value)
        sanitized[key] = value
    return sanitized
