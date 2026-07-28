"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, FileText } from "lucide-react";
import { reportError } from "@/lib/errorReporter";
import { PRODUCT_NAME } from "@/lib/metadata";
import type { GeneratedEstimate } from "@/types/estimate";

interface EmailNoticeProps {
  estimate: GeneratedEstimate;
  clientName: string;
  sessionId: string | null;
}

export default function EmailNotice({
  estimate,
  clientName,
  sessionId,
}: EmailNoticeProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  async function handleViewPdf() {
    if (pdfLoading) return;
    setPdfLoading(true);
    setPdfError(false);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estimate,
          clientName: clientName || "お客様",
        }),
      });
      if (!res.ok) {
        throw new Error(`PDF generation failed with status ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      window.gtag?.("event", "view_estimate_pdf");
      // Revoke once the new tab has had time to load the blob
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      reportError({
        sessionId,
        errorType: "complete_pdf_view_failed",
        message: error instanceof Error ? error.message : String(error),
      });
      setPdfError(true);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-7 rounded-2xl border border-forest/[.06] bg-white px-5 py-4"
    >
      <div className="flex items-start gap-3">
        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
        <p className="text-[0.8125rem] leading-relaxed text-forest/65">
          {PRODUCT_NAME}による概算お見積もりの結果をメールに送信しました。
        </p>
      </div>

      <button
        type="button"
        onClick={handleViewPdf}
        disabled={pdfLoading}
        className="btn-puffy mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold disabled:opacity-50 md:text-base"
      >
        {pdfLoading ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
        ) : (
          <FileText className="h-[18px] w-[18px]" />
        )}
        お見積もりを確認する
      </button>
      {pdfError && (
        <p className="mt-2 text-center text-xs text-red-500">
          PDFの表示に失敗しました。時間をおいて再度お試しください。
        </p>
      )}
    </motion.div>
  );
}
