import { NextRequest, NextResponse } from "next/server";
import { getBackendHeaders } from "@/lib/apiAuth";
import { logger } from "@/lib/logger";

const BACKEND_URL =
  process.env.BACKEND_URL ?? "http://localhost:8000";
const TIMEOUT_MS = 15_000;

export async function GET(request: NextRequest) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const isResult = searchParams.get("result") === "true";

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    // Poll for estimate result
    if (isResult) {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/estimate/result/${encodeURIComponent(sessionId)}`,
        {
          headers: getBackendHeaders(),
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        return NextResponse.json(
          { error: "Backend error" },
          { status: res.status }
        );
      }

      const data = await res.json();

      // Normalize snake_case → camelCase (same as /generate route)
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
            confidenceNote: data.estimate.confidence_note,
            confidence: data.estimate.confidence
              ? {
                  rangeLabel: data.estimate.confidence.range_label,
                  level: data.estimate.confidence.level,
                }
              : undefined,
          }
        : undefined;

      return NextResponse.json({
        status: data.status,
        estimate,
      });
    }

    // Get session
    const res = await fetch(
      `${BACKEND_URL}/api/v1/estimate/session/${encodeURIComponent(sessionId)}`,
      {
        headers: getBackendHeaders(),
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Backend error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      sessionId: data.session_id,
      status: data.status,
    });
  } catch (error) {
    logger.error("estimate/session", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timer);
  }
}
