import { NextRequest, NextResponse } from "next/server";
import { getBackendHeaders } from "@/lib/apiAuth";

const BACKEND_URL =
  process.env.BACKEND_URL ?? "http://localhost:8000";
const TIMEOUT_MS = 120_000; // Estimate generation can take up to 2 minutes

interface GenerateRequestBody {
  sessionId: string;
  answers: Record<string, string | string[]>;
}

export async function POST(request: NextRequest) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body: GenerateRequestBody = await request.json();

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
