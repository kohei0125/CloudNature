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

export async function POST(request: NextRequest) {
  try {
    const body: PdfRequestBody = await request.json();
    const date = new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const props = {
      estimate: body.estimate,
      clientName: body.clientName,
      date,
    };

    const element = createElement(EstimatePdf, props);

    const buffer = await renderToBuffer(element as ReactElement<any>);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent("概算お見積書.pdf")}`,
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
