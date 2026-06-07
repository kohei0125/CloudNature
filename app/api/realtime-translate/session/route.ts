import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { IS_PRODUCTION } from "@/lib/site";

// リアルタイム翻訳: パスワード照合 + OpenAI Realtime API 一時トークン発行
// 設計: docs/20260607_openai_translate.md

// 固定パスワード（カタカナ・ハードコーディング）
const GATE_PASSWORD = "クラウドネイチャー";

const OPENAI_CLIENT_SECRETS_URL =
  "https://api.openai.com/v1/realtime/client_secrets";
const REALTIME_MODEL = "gpt-realtime";
const SESSION_TTL_SECONDS = 600;

// 双方向通訳: 入力言語を自動判定し、日本語→英語 / 英語→日本語へ翻訳する
const INSTRUCTIONS = [
  "You are a real-time interpreter between Japanese and English.",
  "Automatically detect the language of the user's speech.",
  "If the user speaks Japanese, translate it into natural English.",
  "If the user speaks English, translate it into natural Japanese.",
  "Do not answer questions.",
  "Do not add explanations.",
  "Only translate.",
].join("\n");

interface SessionRequestBody {
  password?: string;
  verifyOnly?: boolean;
}

// --- Rate Limit (in-memory, per IP) ---
const checkRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
});

export async function POST(request: NextRequest) {
  try {
    const body: SessionRequestBody = await request.json();

    // Rate limit (production only)
    if (IS_PRODUCTION) {
      if (!checkRateLimit(getClientIp(request.headers))) {
        return NextResponse.json(
          {
            error:
              "リクエスト回数の上限に達しました。しばらく経ってから再度お試しください。",
          },
          { status: 429 }
        );
      }
    }

    // パスワード照合（毎回サーバー側で行う）
    if (body.password !== GATE_PASSWORD) {
      return NextResponse.json(
        { error: "パスワードが正しくありません" },
        { status: 401 }
      );
    }

    // ゲート画面での照合のみ（トークンは発行しない）
    if (body.verifyOnly) {
      return NextResponse.json({ ok: true });
    }

    const apiKey = process.env.OPEN_AI_REALTIME_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.error(
        "[realtime-translate] OPEN_AI_REALTIME_TRANSLATE_API_KEY not configured"
      );
      return NextResponse.json(
        { error: "サーバーの設定が不足しています" },
        { status: 500 }
      );
    }

    // 一時クライアントシークレット（ek_...）を発行
    const res = await fetch(OPENAI_CLIENT_SECRETS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expires_after: { anchor: "created_at", seconds: SESSION_TTL_SECONDS },
        session: {
          type: "realtime",
          model: REALTIME_MODEL,
          instructions: INSTRUCTIONS,
          audio: {
            input: {
              transcription: { model: "gpt-4o-mini-transcribe" },
              turn_detection: { type: "server_vad" },
            },
            output: { voice: "marin" },
          },
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(
        `[realtime-translate] client_secrets failed (${res.status}):`,
        detail
      );
      return NextResponse.json(
        { error: "翻訳セッションの開始に失敗しました" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      clientSecret: data.value,
      expiresAt: data.expires_at,
    });
  } catch (error) {
    console.error("[realtime-translate]", error);
    return NextResponse.json(
      { error: "エラーが発生しました。しばらく経ってから再度お試しください。" },
      { status: 500 }
    );
  }
}
