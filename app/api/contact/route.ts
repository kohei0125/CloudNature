import { NextRequest, NextResponse, after } from "next/server";
import { Resend } from "resend";
import { ContactRequestBody, buildEmailHtml, buildConfirmationEmailHtml } from "./emailTemplates";
import { CONTACT_SUBJECTS } from "@/content/contact";
import { PHONE_REGEX } from "@/lib/utils";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { IS_PRODUCTION } from "@/lib/site";
import { saveContactToNotion } from "./notionService";

// ローカルはクラウドフレアのチェックをスキップ
const CLOUDFLARE_TURNSTILE_SECRET_KEY = IS_PRODUCTION
  ? (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? "")
  : "";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// --- Rate Limit (in-memory, per IP) ---
const checkRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
});

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
    if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim() || !body.message?.trim()) {
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

    if (!PHONE_REGEX.test(body.phone)) {
      return NextResponse.json(
        { error: "正しい電話番号を入力してください" },
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
      if (!checkRateLimit(getClientIp(request.headers))) {
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

    // Notion保存（レスポンス送信後に実行・失敗してもレスポンスに影響しない）
    // after() でレスポンス返却後も関数の寿命を延長し、保存処理を完走させる。
    // ※ await なしの fire-and-forget だとレスポンス直後に関数が凍結され、
    //   Notion API へのリクエストが完走できず保存に失敗する（ログにも残らない）。
    after(async () => {
      try {
        await saveContactToNotion({
          name: body.name,
          email: body.email,
          phone: body.phone,
          company: body.company,
          subject: body.subject,
          message: body.message,
        });
      } catch (err) {
        console.error("[notion] Failed to save contact:", err);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "送信に失敗しました。しばらく経ってから再度お試しください。" },
      { status: 500 }
    );
  }
}
