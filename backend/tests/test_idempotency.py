"""見積もり生成のべき等性（idempotency）テスト。

同一セッションIDで generate_estimate() を2回呼んだ場合、
2回目はDBからキャッシュ済み結果を返し、LLMを再呼び出ししないことを検証する。
"""

from __future__ import annotations

import importlib
import json
import sys
from types import SimpleNamespace

import pytest

from app.core.llm.fallback import FallbackAdapter


class _DummyDB:
    """Mock DB that tracks completed estimates for idempotency testing."""

    def __init__(self) -> None:
        self._records: dict[int, object] = {}
        self._next_id = 1
        self._completed_sessions: dict[str, object] = {}

    def add(self, obj: object) -> None:
        setattr(obj, "id", self._next_id)
        self._records[self._next_id] = obj
        self._next_id += 1

    def commit(self) -> None:
        # When a record is committed with status=completed, track it
        for rec in self._records.values():
            status = getattr(rec, "status", None)
            sid = getattr(rec, "session_id", None)
            if status == "completed" and sid:
                self._completed_sessions[sid] = rec

    def refresh(self, obj: object) -> None:
        return

    def exec(self, _statement: object):
        """Mock exec: return completed record if exists for the session."""
        # The idempotency check queries by session_id + status=completed.
        # We inspect _completed_sessions to decide what to return.
        # Since the statement object is opaque, we check all completed sessions.
        # In practice there's only one session per test.
        if self._completed_sessions:
            first_record = next(iter(self._completed_sessions.values()))
            return SimpleNamespace(first=lambda: first_record)
        return SimpleNamespace(first=lambda: None)

    def get(self, _model: object, record_id: int) -> object | None:
        return self._records.get(record_id)


class _DummySessionManager:
    def __init__(self, db: _DummyDB) -> None:
        self._db = db

    def __enter__(self) -> _DummyDB:
        return self._db

    def __exit__(self, exc_type, exc, tb) -> bool:
        return False


class _CountingFallbackLLM:
    """LLM mock that counts how many times generate_estimate is called."""

    def __init__(self) -> None:
        self.call_count = 0

    async def generate_estimate(self, calculated_data: dict) -> dict:
        self.call_count += 1
        adapter = FallbackAdapter()
        return await adapter.generate_estimate(calculated_data=calculated_data)


@pytest.mark.asyncio
async def test_idempotency_returns_cached_on_second_call(monkeypatch):
    """2回目のgenerate_estimate()呼び出しはキャッシュを返し、LLMを呼ばない。"""
    monkeypatch.setenv("DATABASE_URL", "sqlite:///./test_idempotency.db")
    sys.modules.pop("app.config", None)
    sys.modules.pop("app.db", None)
    sys.modules.pop("app.services.estimate_service", None)
    estimate_service = importlib.import_module("app.services.estimate_service")

    dummy_db = _DummyDB()
    counting_llm = _CountingFallbackLLM()

    def fake_get_session():
        return _DummySessionManager(dummy_db)

    session_answers = {
        "_step8_categories": {
            "employee_master": "基本データ管理",
        },
        "_step8_labels": {
            "employee_master": "社員情報マスタ管理",
        },
    }

    def fake_get_estimate_session(_session_id: str):
        return SimpleNamespace(answers=session_answers)

    def fake_calculate_pricing(user_input: dict) -> dict:
        return {
            "features": [
                {"category": "基本データ管理", "standard_price": 500000, "hybrid_price": 300000},
            ],
            "total_standard": 500000,
            "total_hybrid": 300000,
            "confidence": {"range_label": "±20%", "level": "high"},
            "user_input": user_input,
        }

    monkeypatch.setattr(estimate_service, "get_session", fake_get_session)
    monkeypatch.setattr(estimate_service, "save_session_answers", lambda _sid, _a: None)
    monkeypatch.setattr(estimate_service, "get_estimate_session", fake_get_estimate_session)
    monkeypatch.setattr(estimate_service, "update_session_status", lambda _sid, _status: None)
    monkeypatch.setattr(estimate_service, "calculate_pricing", fake_calculate_pricing)
    monkeypatch.setattr(estimate_service, "_llm", counting_llm)
    monkeypatch.setattr(estimate_service.settings, "llm_max_retries", 1)

    answers = {
        "2": "manufacturing",
        "4": "人材管理",
        "8": ["employee_master"],
    }

    # --- 1st call: should generate via LLM ---
    result1 = await estimate_service.generate_estimate(
        session_id="idem-session-1",
        answers=answers,
    )

    assert result1 is not None
    assert counting_llm.call_count == 1

    # --- 2nd call: should return cached result, NOT call LLM again ---
    result2 = await estimate_service.generate_estimate(
        session_id="idem-session-1",
        answers=answers,
    )

    assert result2 is not None
    assert counting_llm.call_count == 1, (
        f"LLM was called {counting_llm.call_count} times; expected 1 (cached on 2nd call)"
    )

    # Results should be identical
    assert result1 == result2


@pytest.mark.asyncio
async def test_different_sessions_generate_independently(monkeypatch):
    """異なるセッションIDの場合はそれぞれ独立して生成される。"""
    monkeypatch.setenv("DATABASE_URL", "sqlite:///./test_idempotency2.db")
    sys.modules.pop("app.config", None)
    sys.modules.pop("app.db", None)
    sys.modules.pop("app.services.estimate_service", None)
    estimate_service = importlib.import_module("app.services.estimate_service")

    # Use separate DBs per session to simulate isolation
    dummy_db_1 = _DummyDB()
    dummy_db_2 = _DummyDB()
    current_db = {"ref": dummy_db_1}
    counting_llm = _CountingFallbackLLM()

    def fake_get_session():
        return _DummySessionManager(current_db["ref"])

    session_answers = {
        "_step8_categories": {"feature_a": "基本データ管理"},
        "_step8_labels": {"feature_a": "機能A"},
    }

    def fake_get_estimate_session(_session_id: str):
        return SimpleNamespace(answers=session_answers)

    def fake_calculate_pricing(user_input: dict) -> dict:
        return {
            "features": [
                {"category": "基本データ管理", "standard_price": 500000, "hybrid_price": 300000},
            ],
            "total_standard": 500000,
            "total_hybrid": 300000,
            "confidence": {"range_label": "±20%", "level": "high"},
            "user_input": user_input,
        }

    monkeypatch.setattr(estimate_service, "get_session", fake_get_session)
    monkeypatch.setattr(estimate_service, "save_session_answers", lambda _sid, _a: None)
    monkeypatch.setattr(estimate_service, "get_estimate_session", fake_get_estimate_session)
    monkeypatch.setattr(estimate_service, "update_session_status", lambda _sid, _status: None)
    monkeypatch.setattr(estimate_service, "calculate_pricing", fake_calculate_pricing)
    monkeypatch.setattr(estimate_service, "_llm", counting_llm)
    monkeypatch.setattr(estimate_service.settings, "llm_max_retries", 1)

    answers = {"2": "retail", "4": "在庫管理", "8": ["feature_a"]}

    # Session A
    current_db["ref"] = dummy_db_1
    result_a = await estimate_service.generate_estimate(
        session_id="session-A",
        answers=answers,
    )

    # Session B (different session, fresh DB)
    current_db["ref"] = dummy_db_2
    result_b = await estimate_service.generate_estimate(
        session_id="session-B",
        answers=answers,
    )

    assert result_a is not None
    assert result_b is not None
    # Both calls should have invoked the LLM
    assert counting_llm.call_count == 2
