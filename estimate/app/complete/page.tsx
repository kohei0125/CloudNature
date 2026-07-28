"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import SuccessHeader from "@/components/complete/SuccessHeader";
import EmailNotice from "@/components/complete/EmailNotice";
import WhyCloudNature from "@/components/complete/WhyCloudNature";
import BookingSection from "@/components/complete/BookingSection";
import { load, clear } from "@/lib/sessionStorage";
import { parseContact } from "@/lib/utils";
import { TOTAL_STEPS } from "@/lib/stepConfig";
import type { EstimateSession, GeneratedEstimate } from "@/types/estimate";

export default function CompletePage() {
  const [estimate, setEstimate] = useState<GeneratedEstimate | null>(null);
  const [clientName, setClientName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="mx-auto max-w-lg px-4 pt-20">
        <SuccessHeader clientName={clientName} />
        <EmailNotice
          estimate={estimate}
          clientName={clientName}
          sessionId={sessionId}
        />
        <WhyCloudNature />
      </div>

      {/* カレンダーが広がれるよう、このセクションのみ max-w-2xl */}
      <div className="mx-auto mt-10 max-w-2xl px-4">
        <BookingSection />
      </div>

      <div className="mx-auto max-w-lg px-4 pb-16">
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
