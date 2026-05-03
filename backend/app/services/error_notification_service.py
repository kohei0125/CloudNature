"""Error notification orchestrator with in-memory deduplication.

見積もりフローで検知したエラーを運用者に通知する。
同一 session × エラー種別で短時間（DEDUP_WINDOW_SEC秒）に発生した
重複通知を抑止し、メールスパムを防ぐ。

Cloud Run はインスタンスを跨いで状態を共有しないため、
同一エラーが複数インスタンスで発生した場合は最大インスタンス数分の
通知が飛ぶ可能性があるが、本用途では許容範囲とする。
"""

import asyncio
import logging
import threading
import time

from app.services.email_service import send_error_notification

logger = logging.getLogger(__name__)

DEDUP_WINDOW_SEC = 300  # 5分

_lock = threading.Lock()
_last_notified: dict[tuple[str, str], float] = {}

# asyncio.create_task は強参照を保持しないと GC される。完了時に discard。
_pending_tasks: set[asyncio.Task] = set()


def _should_send(session_id: str, error_type: str) -> bool:
    """同一 session × error_type が DEDUP_WINDOW_SEC 以内に通知済みかを判定。"""
    key = (session_id or "(unknown)", error_type)
    now = time.time()
    with _lock:
        last = _last_notified.get(key)
        if last is not None and (now - last) < DEDUP_WINDOW_SEC:
            return False
        _last_notified[key] = now
        # 古いエントリの掃除（メモリ枯渇防止）
        cutoff = now - DEDUP_WINDOW_SEC * 2
        for k in [k for k, t in _last_notified.items() if t < cutoff]:
            _last_notified.pop(k, None)
    return True


def _clear_dedup(session_id: str, error_type: str) -> None:
    """送信失敗時に dedup マークをクリアし、次の発生で再送できるようにする。"""
    key = (session_id or "(unknown)", error_type)
    with _lock:
        _last_notified.pop(key, None)


async def notify_error(
    session_id: str,
    source: str,
    error_type: str,
    message: str = "",
    context: dict | None = None,
) -> None:
    """重複抑止付きでエラー通知メールを送る（呼び出し側を待たせる版）。

    `send_error_notification` 自身が例外を握りつぶして bool を返すため、
    本関数は例外を上げない（best-effort）。
    """
    if not _should_send(session_id, error_type):
        logger.info(
            "Suppressing duplicate error notification (session=%s, type=%s)",
            session_id,
            error_type,
        )
        return
    ok = await send_error_notification(
        session_id=session_id,
        source=source,
        error_type=error_type,
        message=message,
        context=context,
    )
    if not ok:
        # 送信失敗時は dedup マークを消し、次の発生で再送できるようにする
        # （Resend ダウン等の致命的失敗を5分間隠さないため）
        _clear_dedup(session_id, error_type)


def notify_error_in_background(
    session_id: str,
    source: str,
    error_type: str,
    message: str = "",
    context: dict | None = None,
) -> None:
    """API ハンドラやサービス層から fire-and-forget で通知を発射する。

    Resend API 往復をリクエスト応答パスに乗せないため、現在のイベントループに
    タスクを積んで即座に返す。タスクへの強参照を `_pending_tasks` で保持し、
    完了時に discard することで GC を防ぐ。
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        # 同期コンテキストから呼ばれた場合は同期送信にフォールバック
        asyncio.run(
            notify_error(
                session_id=session_id,
                source=source,
                error_type=error_type,
                message=message,
                context=context,
            )
        )
        return

    task = loop.create_task(
        notify_error(
            session_id=session_id,
            source=source,
            error_type=error_type,
            message=message,
            context=context,
        )
    )
    _pending_tasks.add(task)
    task.add_done_callback(_pending_tasks.discard)
