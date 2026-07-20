import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  ConsultationRequestBody,
  buildNotificationEmailHtml,
  buildConfirmationEmailHtml,
} from "@/lib/emailTemplates";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { IS_PRODUCTION } from "@/lib/site";
import { MAX_SHORT_FIELD_LENGTH, MAX_EMAIL_LENGTH, MAX_TOPIC_LENGTH } from "@/lib/validation";

const MAX_BODY_BYTES = 32 * 1024; // 32KB

// --- Rate Limit (in-memory) ---
const checkIpRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
});
const checkEmailRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2,
});

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

interface RawBody {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  role?: unknown;
  topic?: unknown;
  website?: unknown; // honeypot
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  page_referrer?: unknown;
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// Resend SDKはAPIエラー時にPromiseをrejectせず { data: null, error } を返すため、
// rejected（ネットワーク層の失敗）と fulfilled かつ error あり（APIエラー）の両方を見る必要がある
function emailSendError(
  result: PromiseSettledResult<{ error: { message: string } | null }>
): Error | null {
  if (result.status === "rejected") {
    return result.reason instanceof Error ? result.reason : new Error(String(result.reason));
  }
  return result.value.error ? new Error(result.value.error.message) : null;
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "リクエストが大きすぎます" }, { status: 413 });
    }

    const rawText = await request.text();
    if (new TextEncoder().encode(rawText).length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "リクエストが大きすぎます" }, { status: 413 });
    }

    let raw: RawBody;
    try {
      raw = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
    }

    // ハニーポット: 通常の利用者には見えないフィールド。入力があれば正常応答を返しつつ破棄する
    if (asTrimmedString(raw.website)) {
      return NextResponse.json({ success: true });
    }

    const body: ConsultationRequestBody = {
      name: asTrimmedString(raw.name),
      company: asTrimmedString(raw.company),
      email: asTrimmedString(raw.email),
      role: asTrimmedString(raw.role),
      topic: asTrimmedString(raw.topic) || undefined,
      utmSource: asTrimmedString(raw.utm_source) || undefined,
      utmMedium: asTrimmedString(raw.utm_medium) || undefined,
      utmCampaign: asTrimmedString(raw.utm_campaign) || undefined,
      pageReferrer: asTrimmedString(raw.page_referrer) || undefined,
    };

    // Server-side validation
    if (!body.name || !body.company || !body.email || !body.role) {
      return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
    }

    if (
      body.name.length > MAX_SHORT_FIELD_LENGTH ||
      body.company.length > MAX_SHORT_FIELD_LENGTH ||
      body.role.length > MAX_SHORT_FIELD_LENGTH
    ) {
      return NextResponse.json({ error: "入力内容が長すぎます" }, { status: 400 });
    }

    if (body.email.length > MAX_EMAIL_LENGTH || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "正しいメールアドレスを入力してください" }, { status: 400 });
    }

    if (body.topic && body.topic.length > MAX_TOPIC_LENGTH) {
      return NextResponse.json({ error: "ご相談内容が長すぎます" }, { status: 400 });
    }

    // Rate limit (production only): IP単位 + メールアドレス単位
    if (IS_PRODUCTION) {
      const ip = getClientIp(request.headers);
      if (!checkIpRateLimit(ip) || !checkEmailRateLimit(body.email.toLowerCase())) {
        return NextResponse.json(
          { error: "送信回数の上限に達しました。しばらく経ってから再度お試しください。" },
          { status: 429 }
        );
      }
    }

    const emailFrom = process.env.EMAIL_FROM;
    const notifyEmail = process.env.NOTIFY_EMAIL;

    if (!emailFrom || !notifyEmail) {
      console.error("[consultation] EMAIL_FROM or NOTIFY_EMAIL not configured");
      return NextResponse.json({ error: "メール送信の設定が不足しています" }, { status: 500 });
    }

    const resend = getResend();
    const [notifyResult, confirmResult] = await Promise.allSettled([
      resend.emails.send({
        from: emailFrom,
        to: notifyEmail,
        replyTo: body.email,
        subject: "【CloudNature AI開発研修】無料相談のお申し込み",
        html: buildNotificationEmailHtml(body),
      }),
      resend.emails.send({
        from: emailFrom,
        to: body.email,
        replyTo: notifyEmail,
        subject: "【CloudNature AI開発研修】無料相談のお申し込みありがとうございます",
        html: buildConfirmationEmailHtml(body),
      }),
    ]);

    const notifyError = emailSendError(notifyResult);
    if (notifyError) {
      throw notifyError;
    }

    const confirmError = emailSendError(confirmResult);
    if (confirmError) {
      console.error("[consultation] confirmation email failed:", confirmError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[consultation]", error);
    return NextResponse.json(
      { error: "送信に失敗しました。しばらく経ってから再度お試しください。" },
      { status: 500 }
    );
  }
}
