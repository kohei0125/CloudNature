"use client";

import Script from "next/script";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const TIMEREX_BOOKING_URL = "https://timerex.net/s/watakooh5_f4a4/0f5faefd";

export default function BookingSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.82 }}
    >
      <p className="text-center text-xs font-bold uppercase tracking-widest text-forest/30">
        Next Step
      </p>
      <h2 className="mt-1.5 text-center font-serif text-lg font-bold md:text-xl">
        正式なお見積もりは無料相談で
      </h2>
      <p className="mt-2 text-center text-[0.8125rem] leading-relaxed text-forest/55">
        概算から更に精度を上げた正式見積もりを、無料ヒアリングにてご案内します。
        <br className="hidden sm:inline" />
        ご都合の良い日時を、カレンダーからそのままご予約ください。
      </p>
      <div className="center mt-2 gap-1.5 text-forest/40">
        <Clock className="h-3.5 w-3.5" />
        <span className="text-xs">所要時間 約30分 / オンライン対応</span>
      </div>

      <div className="mt-5 rounded-2xl border-2 border-sunset/25 bg-white p-2 md:p-4">
        <div id="timerex_calendar" data-url={TIMEREX_BOOKING_URL} />
      </div>
      {/* onReady はロード完了後に加えてマウントごとに発火するため、SPA再訪でも初期化される */}
      <Script
        id="timerex_embed"
        src="https://asset.timerex.net/js/embed.js"
        strategy="afterInteractive"
        onReady={() => window.TimerexCalendar?.()}
      />
      <p className="mt-3 text-center text-xs text-forest/45">
        フォームでのお問い合わせは
        <a
          href="https://cloudnature.jp/contact"
          className="font-bold text-sage underline-offset-2 hover:underline"
        >
          こちら
        </a>
      </p>
    </motion.div>
  );
}
