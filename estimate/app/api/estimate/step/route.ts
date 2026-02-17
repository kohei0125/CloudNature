import { NextRequest, NextResponse } from "next/server";
import { getBackendHeaders } from "@/lib/apiAuth";

const BACKEND_URL =
  process.env.BACKEND_URL ?? "http://localhost:8000";
const TIMEOUT_MS = 60_000; // AI generation on step 7 can take longer

interface StepRequestBody {
  sessionId: string;
  stepNumber: number;
  value: string | string[];
}

export async function POST(request: NextRequest) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body: StepRequestBody = await request.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/estimate/step`, {
      method: "POST",
      headers: getBackendHeaders(),
      body: JSON.stringify({
        session_id: body.sessionId,
        step_number: body.stepNumber,
        value: body.value,
      }),
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
    const raw = data.ai_options;
    const aiOptions = raw
      ? { step8Features: raw.step8_features }
      : undefined;

    return NextResponse.json({
      success: data.success,
      nextStep: data.next_step,
      aiOptions,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit step" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timer);
  }
}
