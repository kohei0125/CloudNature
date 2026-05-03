import { NextRequest, NextResponse } from "next/server";
import { getBackendHeaders } from "@/lib/apiAuth";
import { logger } from "@/lib/logger";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";
const TIMEOUT_MS = 5_000;

function safeOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

interface ReportErrorBody {
  sessionId?: string;
  source?: string;
  errorType?: string;
  message?: string;
  stepNumber?: number;
  statusCode?: number;
  userAgent?: string;
}

export async function POST(request: NextRequest) {
  // 同一サイト由来のリクエストのみ受け付ける（CSRF/外部からの通知発火対策）。
  // Origin/Referer は curl 等で偽装可能だが、ブラウザ経由の opportunistic な
  // 大量呼び出しは弾けるため、最低限の濫用対策として有効。
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const refererOrigin = referer ? safeOrigin(referer) : null;
  const isSameOrigin = origin === requestOrigin || refererOrigin === requestOrigin;
  if (!isSameOrigin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body: ReportErrorBody = await request.json();

    if (!body.errorType || !body.source) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    const payload = {
      session_id: body.sessionId ?? "",
      source: body.source,
      error_type: body.errorType,
      message: body.message,
      step_number: body.stepNumber,
      status_code: body.statusCode,
      user_agent: body.userAgent,
    };

    const res = await fetch(`${BACKEND_URL}/api/v1/estimate/report-error`, {
      method: "POST",
      headers: getBackendHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      logger.error("estimate/report-error", "backend non-OK:", res.status);
      return NextResponse.json({ error: "Backend error" }, { status: 502 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("estimate/report-error", error);
    return NextResponse.json({ error: "Failed to report" }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
