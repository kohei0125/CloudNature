"""週次レポートAPIエンドポイント。"""

from fastapi import APIRouter

from app.tasks.weekly_report import run_weekly_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/weekly")
async def trigger_weekly_report():
    """週次レポートを生成・送信する（Cloud Schedulerから呼び出し）。"""
    result = await run_weekly_report()
    return {"status": "ok", "result": result}
