import { NextResponse } from "next/server";
import { getBackendHeaders } from "@/lib/apiAuth";

const BACKEND_URL =
  process.env.BACKEND_URL ?? "http://localhost:8000";
const TIMEOUT_MS = 15_000;

export async function POST() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/estimate/session`, {
      method: "POST",
      headers: getBackendHeaders(),
      body: JSON.stringify({}),
      signal: controller.signal,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Backend error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    // Normalize snake_case → camelCase for frontend
    return NextResponse.json({
      sessionId: data.session_id,
      status: data.status,
    });
  } catch (error) {
    console.error("[estimate/start]", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timer);
  }
}
