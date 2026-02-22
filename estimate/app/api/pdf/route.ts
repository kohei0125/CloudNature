import "@/components/pdf/shared/PdfFonts";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import EstimatePdf from "@/components/pdf/EstimatePdf";
import type { GeneratedEstimate } from "@/types/estimate";
import { logger } from "@/lib/logger";

interface PdfRequestBody {
  estimate: GeneratedEstimate;
  clientName: string;
}

function generateDocumentNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `EST-${y}${m}${d}-${seq}`;
}

function isValidBody(body: unknown): body is PdfRequestBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (typeof b.clientName !== "string" || b.clientName.length === 0)
    return false;
  if (!b.estimate || typeof b.estimate !== "object") return false;
  const est = b.estimate as Record<string, unknown>;
  if (typeof est.projectName !== "string") return false;
  if (!Array.isArray(est.features) || est.features.length === 0) return false;
  if (!est.totalCost || typeof est.totalCost !== "object") return false;
  const tc = est.totalCost as Record<string, unknown>;
  if (typeof tc.standard !== "number" || typeof tc.hybrid !== "number")
    return false;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const date = new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const documentNumber = generateDocumentNumber();

    const props = {
      estimate: body.estimate,
      clientName: body.clientName,
      date,
      documentNumber,
    };

    const element = createElement(EstimatePdf, props);

    const buffer = await renderToBuffer(element as ReactElement<any>);

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent("御見積書.pdf")}`,
      },
    });
  } catch (error) {
    logger.error("pdf", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
