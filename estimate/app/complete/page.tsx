"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Mail,
  Loader2,
  Calendar,
  Cpu,
  TrendingUp,
  Zap,
  Clock,
  FileText,
} from "lucide-react";
import { load, clear } from "@/lib/sessionStorage";
import { parseContact } from "@/lib/utils";
import { TOTAL_STEPS } from "@/lib/stepConfig";
import { reportError } from "@/lib/errorReporter";
import type { EstimateSession, GeneratedEstimate } from "@/types/estimate";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatPrice(price: number): string {
  return `${Math.round(price / 10000).toLocaleString("ja-JP")}万円`;
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
export default function CompletePage() {
  const [estimate, setEstimate] = useState<GeneratedEstimate | null>(null);
  const [clientName, setClientName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    function loadData() {
      const session = load<EstimateSession>("session");
      if (session?.sessionId) {
        setSessionId(session.sessionId);
      }
      if (session?.answers) {
        const raw = session.answers[TOTAL_STEPS];
        if (typeof raw === "string") {
          setClientName(parseContact(raw).name);
        }
      }
      const saved = load<GeneratedEstimate>("estimate_result");
      if (saved) {
        setEstimate(saved);
        window.gtag?.("event", "view_estimate_complete", {
          features_count: saved.features?.length ?? 0,
        });
      }
      setLoading(false);

      // Clear session data so returning users start fresh
      clear("session");
      clear("estimate_result");
    }
    loadData();
  }, []);

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

  if (loading) {
    return (
      <div className="center min-h-[100dvh]">
        <Loader2 className="h-8 w-8 animate-spin text-sage" />
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="center min-h-[60vh] px-4">
        <div className="text-center">
          <p className="text-forest/60">見積もりデータが見つかりません。</p>
          <Link
            href="/chat"
            className="btn-puffy mt-4 inline-block rounded-xl px-6 py-3 text-sm font-bold"
          >
            見積もりを始める
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-linen">
      <div className="mx-auto max-w-lg px-4 pt-20 pb-16">
        {/* ── Success header ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="center mx-auto mb-4 h-16 w-16 rounded-full bg-sage/10">
            <CheckCircle className="h-9 w-9 text-sage" />
          </div>
          <h1 className="font-serif text-2xl font-bold leading-tight md:text-[1.75rem]">
            概算お見積もりが完成しました
          </h1>
          {clientName && (
            <p className="mt-2 text-sm text-forest/50">
              {clientName} 様、ありがとうございます
            </p>
          )}
        </motion.div>

        {/* ── Email notice ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-7 rounded-2xl border border-forest/[.06] bg-white px-5 py-4"
        >
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
            <p className="text-[0.8125rem] leading-relaxed text-forest/65">
              ミツモリAIによる概算お見積もりの結果をメールに送信しました。
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewPdf}
            disabled={pdfLoading}
            className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-bold text-sage transition-colors hover:text-sage/80 disabled:opacity-50"
          >
            {pdfLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            PDFを表示する
          </button>
          {pdfError && (
            <p className="mt-1.5 text-xs text-red-500">
              PDFの表示に失敗しました。時間をおいて再度お試しください。
            </p>
          )}
        </motion.div>

        {/* ── Why so cheap ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-8"
        >
          <p className="text-center text-xs font-bold uppercase tracking-widest text-forest/30">
            Why CloudNature
          </p>
          <h2 className="mt-1.5 text-center font-serif text-lg font-bold md:text-xl">
            なぜ、速く正確に開発できるのか
          </h2>

          <div className="mt-5 v-stack gap-3">
            <AdvantageCard
              icon={<Cpu className="h-[18px] w-[18px] text-sage" />}
              title="AIが開発の大部分を支援"
              description="設計・実装・テストの多くをAIが支援し、エンジニアは要件定義とレビューに集中。仕組み化により、短期間で高品質に仕上げます。"
              delay={0.55}
            />
            <AdvantageCard
              icon={<TrendingUp className="h-[18px] w-[18px] text-sunset" />}
              title="同じ予算で、できる範囲を広げる"
              description="AIを前提とした開発体制で、同じ予算でもより広い範囲を短期間で仕組み化。要件定義に集中し、スコープを最大化します。"
              delay={0.63}
            />
            <AdvantageCard
              icon={<Zap className="h-[18px] w-[18px] text-amber-500" />}
              title="開発期間を大幅に短縮"
              description="AIによる並列処理を活用し、開発スピードを最大化。従来より短い期間での構築を目指せます。"
              delay={0.71}
            />
          </div>
        </motion.div>

        {/* ── Primary CTA: Booking ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82 }}
          className="mt-10 rounded-2xl border-2 border-sunset/25 bg-white p-6 text-center md:p-7"
        >
          <h3 className="font-serif text-lg font-bold">
            正式なお見積もりは無料相談で
          </h3>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-forest/55">
            概算から更に精度を上げた正式見積もりを、
            <br className="hidden sm:inline" />
            無料ヒアリングにてご案内します。
          </p>

          <a
            href="https://cloudnature.jp/contact"
            className="btn-puffy btn-puffy-accent mt-5 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold shadow-lg shadow-sunset/20 md:text-base"
          >
            <Calendar className="h-4 w-4" />
            無料相談を予約する
          </a>

          <div className="center mt-3 gap-1.5 text-forest/40">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">
              所要時間 約30分 / オンライン対応
            </span>
          </div>
        </motion.div>

        {/* ── Back to top ── */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-forest/45 transition-colors hover:text-forest/70"
          >
            お見積もりTOPにもどる
          </Link>
        </div>

        {/* ── Disclaimer ── */}
        <p className="mt-4 text-center text-[0.6875rem] leading-relaxed text-forest/35">
          ※ 本見積もりはAIによる概算であり、法的拘束力はありません。
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Sub-components                                                     */
/* ================================================================== */

function AdvantageCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex gap-3.5 rounded-xl border border-forest/[.06] bg-white px-4 py-3.5"
    >
      <div className="center mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-forest/[.04]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[0.8125rem] font-bold leading-snug text-forest">
          {title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-forest/50">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
