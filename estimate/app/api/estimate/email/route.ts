import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import EstimatePdf from "@/components/pdf/EstimatePdf";
import type { GeneratedEstimate } from "@/types/estimate";
import {
  type EstimateEmailData,
  buildEstimateNotifyHtml,
  buildEstimateConfirmHtml,
} from "./emailTemplates";

interface EmailRequestBody {
  estimate: GeneratedEstimate;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
}

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequestBody = await request.json();
    const { estimate, clientName, clientEmail, clientCompany } = body;

    if (!estimate || !clientEmail) {
      return NextResponse.json(
        { error: "estimate and clientEmail are required" },
        { status: 400 },
      );
    }

    const emailFrom = process.env.EMAIL_FROM;
    const notifyEmail = process.env.NOTIFY_EMAIL;

    if (!emailFrom || !notifyEmail) {
      console.error("[estimate-email] EMAIL_FROM or NOTIFY_EMAIL not configured");
      return NextResponse.json(
        { error: "メール送信の設定が不足しています" },
        { status: 500 },
      );
    }

    // Generate PDF
    const date = new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const element = createElement(EstimatePdf, { estimate, clientName, date });
    const pdfBuffer = await renderToBuffer(element as ReactElement<any>);

    // Build email data
    const standard = estimate.totalCost?.standard ?? 0;
    const hybrid = estimate.totalCost?.hybrid ?? 0;
    const savingsPercent =
      standard > 0 ? Math.round(((standard - hybrid) / standard) * 100) : 0;

    const emailData: EstimateEmailData = {
      clientName,
      clientEmail,
      clientCompany,
      projectName: estimate.projectName,
      standardCost: standard,
      hybridCost: hybrid,
      savingsPercent,
      costMessage: estimate.totalCost?.message ?? "",
    };

    // Send emails in parallel
    const resend = getResend();
    const attachment = {
      filename: "概算お見積書.pdf",
      content: Buffer.from(pdfBuffer),
    };

    const [notifyResult, confirmResult] = await Promise.allSettled([
      resend.emails.send({
        from: emailFrom,
        to: notifyEmail,
        subject: "【CloudNature】新しい概算見積もりリクエスト",
        html: buildEstimateNotifyHtml(emailData),
        attachments: [attachment],
      }),
      resend.emails.send({
        from: emailFrom,
        to: clientEmail,
        subject: "【CloudNature】概算お見積もりが完成しました",
        html: buildEstimateConfirmHtml(emailData),
        attachments: [attachment],
      }),
    ]);

    if (notifyResult.status === "rejected") {
      throw notifyResult.reason;
    }

    if (confirmResult.status === "rejected") {
      console.error("[estimate-email] confirmation email failed:", confirmResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[estimate-email]", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 },
    );
  }
}
