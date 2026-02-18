import type {
  SessionResponse,
  StepResponse,
  EstimateResultResponse,
  AiGeneratedOptions,
} from "@/types/estimate";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";
const DEFAULT_TIMEOUT_MS = 30_000;

// ---------------------------------------------------------------------------
// Internal fetch wrapper
// ---------------------------------------------------------------------------
class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(
        text || `HTTP ${res.status}`,
        res.status
      );
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Public API client
// ---------------------------------------------------------------------------

/** Create a new estimate session. */
export async function createSession(): Promise<SessionResponse> {
  return apiFetch<SessionResponse>("/api/estimate/start", {
    method: "POST",
  });
}

/** Get an existing session. */
export async function getSession(
  sessionId: string
): Promise<SessionResponse> {
  return apiFetch<SessionResponse>(
    `/api/estimate/session?sessionId=${encodeURIComponent(sessionId)}`
  );
}

/** Submit a step answer. */
export async function submitStep(
  sessionId: string,
  stepNumber: number,
  value: string | string[],
  answers?: Record<string, string | string[]>,
): Promise<StepResponse & { aiOptions?: AiGeneratedOptions }> {
  const payload: Record<string, unknown> = { sessionId, stepNumber, value };
  if (answers) {
    payload.answers = answers;
  }
  return apiFetch("/api/estimate/step", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Trigger estimate generation. */
export async function generateEstimate(
  sessionId: string,
  answers: Record<string, string | string[]>,
): Promise<EstimateResultResponse> {
  return apiFetch<EstimateResultResponse>(
    "/api/estimate/generate",
    {
      method: "POST",
      body: JSON.stringify({ sessionId, answers }),
    },
    120_000,
  );
}

/** Poll for estimate result. */
export async function getEstimateResult(
  sessionId: string
): Promise<EstimateResultResponse> {
  return apiFetch<EstimateResultResponse>(
    `/api/estimate/session?sessionId=${encodeURIComponent(sessionId)}&result=true`
  );
}

export { ApiError };
