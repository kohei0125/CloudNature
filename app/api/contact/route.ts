import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactRequestBody, buildEmailHtml, buildConfirmationEmailHtml } from "./emailTemplates";
import { CONTACT_SUBJECTS } from "@/content/contact";

// ローカルはクラウドフレアのチェックをスキップ
const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";
const CLOUDFLARE_TURNSTILE_SECRET_KEY = IS_PRODUCTION
  ? (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? "")
  : "";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// --- Rate Limit (in-memory, per IP) ---
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();

function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.firstRequest > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  }
}

/** Returns `true` if the request is allowed, `false` if rate-limited. */
function checkRateLimit(ip: string): boolean {
  if (rateLimitMap.size > 100) {
    cleanupRateLimitMap();
  }

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
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
  try {
    const body: ContactRequestBody = await request.json();

    // Server-side validation
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { error: "必須項目を入力してください" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "正しいメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    if (body.subject && !CONTACT_SUBJECTS.includes(body.subject)) {
      return NextResponse.json(
        { error: "お問い合わせ種別が正しくありません" },
        { status: 400 }
      );
    }

    // Rate limit (production only)
    if (IS_PRODUCTION) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        "unknown";
      if (!checkRateLimit(ip)) {
        return NextResponse.json(
          {
            error:
              "送信回数の上限に達しました。しばらく経ってから再度お試しください。",
          },
          { status: 429 }
        );
      }
    }

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
          { error: "ボット検証に失敗しました。ページを再読み込みしてお試しください。" },
          { status: 403 }
        );
      }
    }

    // Send notification email via Resend
    const emailFrom = process.env.EMAIL_FROM;
    const notifyEmail = process.env.NOTIFY_EMAIL;

    if (!emailFrom || !notifyEmail) {
      console.error("[contact] EMAIL_FROM or NOTIFY_EMAIL not configured");
      return NextResponse.json(
        { error: "メール送信の設定が不足しています" },
        { status: 500 }
      );
    }

    const resend = getResend();
    const [notifyResult, confirmResult] = await Promise.allSettled([
      resend.emails.send({
        from: emailFrom,
        to: notifyEmail,
        subject: `【CloudNature】新しいお問い合わせがありました`,
        html: buildEmailHtml(body),
      }),
      resend.emails.send({
        from: emailFrom,
        to: body.email,
        subject: `【CloudNature】お問い合わせありがとうございます`,
        html: buildConfirmationEmailHtml(body),
      }),
    ]);

    if (notifyResult.status === "rejected") {
      throw notifyResult.reason;
    }

    if (confirmResult.status === "rejected") {
      console.error("[contact] confirmation email failed:", confirmResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "送信に失敗しました。しばらく経ってから再度お試しください。" },
      { status: 500 }
    );
  }
}
