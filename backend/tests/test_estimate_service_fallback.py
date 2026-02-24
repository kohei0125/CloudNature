"""estimate_service の fallback 経路における回帰テスト。"""

from __future__ import annotations

import importlib
import sys
from types import SimpleNamespace

import pytest

from app.core.llm.fallback import FallbackAdapter


class _DummyDB:
    def __init__(self) -> None:
        self._records: dict[int, object] = {}
        self._next_id = 1

    def add(self, obj: object) -> None:
        setattr(obj, "id", self._next_id)
        self._records[self._next_id] = obj
        self._next_id += 1

    def commit(self) -> None:
        return

    def refresh(self, obj: object) -> None:
        return

    def get(self, _model: object, record_id: int) -> object | None:
        return self._records.get(record_id)


class _DummySessionManager:
    def __init__(self, db: _DummyDB) -> None:
        self._db = db

    def __enter__(self) -> _DummyDB:
        return self._db

    def __exit__(self, exc_type, exc, tb) -> bool:
        return False


class _FailingLLM:
    async def generate_estimate(self, calculated_data: dict) -> dict:
        raise RuntimeError("LLM unavailable")


@pytest.mark.asyncio
async def test_generate_estimate_uses_fallback_with_step4_and_step8_labels(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "sqlite:///./test_estimate_service.db")
    sys.modules.pop("app.config", None)
    sys.modules.pop("app.db", None)
    sys.modules.pop("app.services.estimate_service", None)
    estimate_service = importlib.import_module("app.services.estimate_service")

    captured: dict[str, dict] = {}
    fallback_called = {"value": False}

    dummy_db = _DummyDB()

    def fake_get_session():
        return _DummySessionManager(dummy_db)

    session_answers = {
        "_step8_categories": {
            "employee_master": "シンプルなCRUD管理画面",
            "attendance_mgmt": "カレンダー・スケジュール",
        },
        "_step8_labels": {
            "employee_master": "社員情報マスタ管理",
            "attendance_mgmt": "出退勤・勤怠管理",
        },
    }

    def fake_get_estimate_session(_session_id: str):
        return SimpleNamespace(answers=session_answers)

    def fake_calculate_pricing(user_input: dict) -> dict:
        captured["user_input"] = user_input
        return {
            "features": [
                {"category": "シンプルなCRUD管理画面", "standard_price": 500000, "hybrid_price": 300000},
                {"category": "カレンダー・スケジュール", "standard_price": 400000, "hybrid_price": 240000},
            ],
            "total_standard": 900000,
            "total_hybrid": 540000,
            "confidence": {"range_label": "±20%", "level": "high"},
            "user_input": user_input,
        }

    async def passthrough_audit(estimate_data: dict, calculated_data: dict, start_time: float) -> dict:
        return estimate_data

    original_fallback_generate = FallbackAdapter.generate_estimate

    async def wrapped_fallback_generate(self, calculated_data: dict) -> dict:
        fallback_called["value"] = True
        return await original_fallback_generate(self, calculated_data)

    monkeypatch.setattr(estimate_service, "get_session", fake_get_session)
    monkeypatch.setattr(estimate_service, "save_session_answers", lambda _sid, _a: None)
    monkeypatch.setattr(estimate_service, "get_estimate_session", fake_get_estimate_session)
    monkeypatch.setattr(estimate_service, "update_session_status", lambda _sid, _status: None)
    monkeypatch.setattr(estimate_service, "calculate_pricing", fake_calculate_pricing)
    monkeypatch.setattr(estimate_service, "_audit_estimate", passthrough_audit)
    monkeypatch.setattr(estimate_service, "_llm", _FailingLLM())
    monkeypatch.setattr(estimate_service.settings, "llm_max_retries", 1)
    monkeypatch.setattr(FallbackAdapter, "generate_estimate", wrapped_fallback_generate)

    result = await estimate_service.generate_estimate(
        session_id="test-session",
        answers={
            "2": "manufacturing",
            "4": "人材管理システムを構築したい",
            "8": ["employee_master", "attendance_mgmt"],
        },
    )

    assert result is not None
    assert fallback_called["value"] is True
    assert captured["user_input"]["step_8_labels"] == session_answers["_step8_labels"]
    assert "人材管理" in result["project_name"]

    feature_names = [f["name"] for f in result["features"]]
    assert "社員情報マスタ管理" in feature_names
    assert "出退勤・勤怠管理" in feature_names
    assert "受発注管理" not in feature_names
    assert "在庫管理" not in feature_names
