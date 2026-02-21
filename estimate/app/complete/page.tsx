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
  TrendingDown,
  Zap,
  Clock,
} from "lucide-react";
import { load, clear } from "@/lib/sessionStorage";
import { parseContact } from "@/lib/utils";
import { TOTAL_STEPS } from "@/lib/stepConfig";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadData() {
      const session = load<EstimateSession>("session");
      if (session?.answers) {
        const raw = session.answers[TOTAL_STEPS];
        if (typeof raw === "string") {
          setClientName(parseContact(raw).name);
        }
      }
      const saved = load<GeneratedEstimate>("estimate_result");
      if (saved) setEstimate(saved);
      setLoading(false);

      // Clear session data so returning users start fresh
      clear("session");
      clear("estimate_result");
    }
    loadData();
  }, []);

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
          <a
            href="/chat"
            className="btn-puffy mt-4 inline-block rounded-xl px-6 py-3 text-sm font-bold"
          >
            見積もりを始める
          </a>
        </div>
      </div>
    );
  }

  const standard = estimate.totalCost?.standard ?? 0;
  const hybrid = estimate.totalCost?.hybrid ?? 0;
  const savings = standard - hybrid;
  const savingsPercent = standard > 0 ? Math.round((savings / standard) * 100) : 0;

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
          className="mt-7 flex items-start gap-3 rounded-2xl border border-forest/[.06] bg-white px-5 py-4"
        >
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
          <p className="text-[0.8125rem] leading-relaxed text-forest/65">
            概算お見積もりの結果は以下の通りです。
            <br className="sm:hidden" />
            正式なお見積もりは無料相談にてご案内いたします。
          </p>
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
            なぜ、ここまで安くできるのか
          </h2>

          <div className="mt-5 v-stack gap-3">
            <AdvantageCard
              icon={<Cpu className="h-[18px] w-[18px] text-sage" />}
              title="AIが開発工程の80%を自動化"
              description="設計・実装・テストをAIが遂行。エンジニアは要件定義とレビューに集中するため、人件費を根本から圧縮します。"
              delay={0.55}
            />
            <AdvantageCard
              icon={<TrendingDown className="h-[18px] w-[18px] text-sunset" />}
              title={`同品質で約${savingsPercent}%のコストダウン`}
              description="品質を落とさず開発コストだけを削減。浮いた予算は、機能追加や運用改善に投資できます。"
              delay={0.63}
            />
            <AdvantageCard
              icon={<Zap className="h-[18px] w-[18px] text-amber-500" />}
              title="納期も最短1/3に短縮"
              description="AIの並列処理で、通常3ヶ月の開発が最短1ヶ月。スピードが求められるプロジェクトに最適です。"
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
          <br />
          正式なお見積もりは無料相談にてご案内いたします。
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
