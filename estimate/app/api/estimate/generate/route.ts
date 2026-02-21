import { NextRequest, NextResponse } from "next/server";
import { getBackendHeaders } from "@/lib/apiAuth";

const BACKEND_URL =
  process.env.BACKEND_URL ?? "http://localhost:8000";
const TIMEOUT_MS = 120_000; // Estimate generation can take up to 2 minutes
// ローカルはクラウドフレアのチェックをスキップ
const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";
const CLOUDFLARE_TURNSTILE_SECRET_KEY = IS_PRODUCTION
  ? (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? "")
  : "";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface GenerateRequestBody {
  sessionId: string;
  answers: Record<string, string | string[]>;
  turnstileToken?: string;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: CLOUDFLARE_TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch (error) {
    console.error("[turnstile] verification failed:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body: GenerateRequestBody = await request.json();

    // Verify Turnstile token (skip if secret key not configured)
    if (CLOUDFLARE_TURNSTILE_SECRET_KEY) {
      if (!body.turnstileToken) {
        return NextResponse.json(
          { error: "Turnstile token required" },
          { status: 403 }
        );
      }
      const valid = await verifyTurnstile(body.turnstileToken);
      if (!valid) {
        return NextResponse.json(
          { error: "Turnstile verification failed" },
          { status: 403 }
        );
      }
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/estimate/generate`, {
      method: "POST",
      headers: getBackendHeaders(),
      body: JSON.stringify({
        session_id: body.sessionId,
        answers: body.answers,
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
    const estimate = data.estimate
      ? {
        projectName: data.estimate.project_name,
        summary: data.estimate.summary,
        developmentModelExplanation: data.estimate.development_model_explanation,
        features: (data.estimate.features ?? []).map(
          (f: Record<string, unknown>) => ({
            name: f.name,
            detail: f.detail,
            standardPrice: f.standard_price,
            hybridPrice: f.hybrid_price,
          })
        ),
        discussionAgenda: data.estimate.discussion_agenda,
        totalCost: data.estimate.total_cost
          ? {
            standard: data.estimate.total_cost.standard,
            hybrid: data.estimate.total_cost.hybrid,
            message: data.estimate.total_cost.message,
          }
          : undefined,
      }
      : undefined;

    return NextResponse.json({
      status: data.status,
      estimate,
    });
  } catch (error) {
    console.error("[estimate/generate]", error);
    return NextResponse.json(
      { error: "Failed to generate estimate" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timer);
  }
}
