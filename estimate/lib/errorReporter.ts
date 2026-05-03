"use client";

import { logger } from "@/lib/logger";

const DEDUP_KEY_PREFIX = "cn_err_reported__";
const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5分

export interface ErrorReport {
  sessionId: string | null;
  errorType: string;
  message?: string;
  stepNumber?: number;
  statusCode?: number;
}

function dedupKey(sessionId: string, errorType: string): string {
  return `${DEDUP_KEY_PREFIX}${sessionId}__${errorType}`;
}

function shouldSend(sessionId: string, errorType: string): boolean {
  if (typeof window === "undefined") return false;
  const key = dedupKey(sessionId, errorType);
  try {
    const last = window.sessionStorage.getItem(key);
    if (last) {
      const elapsed = Date.now() - Number(last);
      if (Number.isFinite(elapsed) && elapsed < DEDUP_WINDOW_MS) return false;
    }
    window.sessionStorage.setItem(key, String(Date.now()));
    return true;
  } catch {
    return true;
  }
}

function clearDedupMark(sessionId: string, errorType: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(dedupKey(sessionId, errorType));
  } catch {
    // ignore
  }
}

/**
 * 見積もりフローで検知したエラーをサーバーに通知（fire-and-forget）。
 * 同一 session × error_type は5分間ローカルで重複抑止する。
 * 報告自体の失敗はユーザーに見せない。
 */
export function reportError(report: ErrorReport): void {
  const sessionId = report.sessionId ?? "";
  if (!shouldSend(sessionId, report.errorType)) return;

  const payload = {
    sessionId,
    source: "frontend",
    errorType: report.errorType,
    message: report.message?.slice(0, 500),
    stepNumber: report.stepNumber,
    statusCode: report.statusCode,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : undefined,
  };

  // beacon は keepalive 相当の挙動。ページ遷移直前でも届きやすい。
  // sendBeacon が false を返したらキューに乗らなかったので fetch に流す。
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/estimate/report-error", blob);
      if (ok) return;
    }
  } catch {
    // fall through to fetch
  }

  // 送信失敗時は dedup マークを消して、次の発生で再送できるようにする
  // （Resend ダウン等の致命的失敗をローカル抑止で隠さないため）
  void fetch("/api/estimate/report-error", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then((res) => {
      if (!res.ok) clearDedupMark(sessionId, report.errorType);
    })
    .catch((err) => {
      logger.error("errorReporter", "report failed:", err);
      clearDedupMark(sessionId, report.errorType);
    });
}
