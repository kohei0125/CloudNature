"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { LP_COPY } from "@/content/estimate";

const ease = [0.25, 0.1, 0.25, 1] as const;
const { hero, simulator } = LP_COPY;

function CostSimulator() {
  const [appIdx, setAppIdx] = useState(0);
  const [scaleIdx, setScaleIdx] = useState(0);

  const app = simulator.appTypes[appIdx];
  const scale = simulator.scales[scaleIdx];
  const cost = app.baseCost * scale.multiplier;
  const durationMonths = Math.ceil(cost / 200);

  return (
    <div className="rounded-2xl border border-forest/6 bg-white p-4 shadow-xl md:p-6 lg:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-sage">
        Instant Simulator
      </p>
      <h3 className="mt-2 md:mt-3 font-serif text-[clamp(1.2rem,4vw,2rem)] font-bold tracking-tight">
        概算シミュレーター
      </h3>

      {/* App type selector */}
      <div className="mt-4 md:mt-6">
        <p className="text-xs font-bold text-forest/50">アプリ種類</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5 md:gap-2">
          {simulator.appTypes.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setAppIdx(i)}
              className={`rounded-lg border px-2 py-1.5 md:px-3 md:py-2 text-sm font-medium transition-all ${i === appIdx
                ? "border-sunset bg-sunset/10 text-forest"
                : "border-forest/8 text-forest/50 hover:border-forest/20"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scale selector */}
      <div className="mt-3 md:mt-5">
        <p className="text-xs font-bold text-forest/50">規模</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5 md:gap-2">
          {simulator.scales.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setScaleIdx(i)}
              className={`rounded-lg border px-2 py-1.5 md:px-3 md:py-2 text-center transition-all ${i === scaleIdx
                ? "border-sunset bg-sunset/10 text-forest"
                : "border-forest/8 text-forest/50 hover:border-forest/20"
                }`}
            >
              <span className="block text-sm font-medium">{s.label}</span>
              <span className="block text-[10px] text-forest/40">{s.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="mt-4 md:mt-6 rounded-xl bg-linen p-3 md:p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-forest/40">概算費用</p>
            <p className="mt-1 font-serif text-3xl font-bold tracking-tight text-forest">
              {cost.toLocaleString()}
              <span className="text-base text-forest/50">万円〜</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-forest/40">想定期間</p>
            <p className="mt-1 font-serif text-xl font-bold tracking-tight text-forest">
              {durationMonths}
              <span className="text-sm text-forest/50">ヶ月〜</span>
            </p>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-forest/30">
          {simulator.disclaimer}
        </p>
      </div>

      {/* Simulator CTA */}
      <Link
        href="/chat"
        className="group mt-3 md:mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-2.5 md:py-3 text-sm font-bold text-white transition-colors hover:bg-earth"
      >
        この条件で詳しく見積もる
        <ArrowRight className="h-3.5 w-3.5 animate-nudge-x" />
      </Link>
    </div>
  );
}

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-svh md:min-h-[92vh] flex-col justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <Image
          src="/images/hero-bg.jpg"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/50" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 md:grid-cols-[3fr_2fr] md:items-center md:gap-8 md:px-10">
        {/* Left: Text */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease }}
            className="text-[11px] font-bold uppercase tracking-[0.25em] text-sage"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="mt-4 font-serif text-[clamp(1.8rem,4vw,3.5rem)] font-bold leading-[1.15] tracking-tight md:mt-10"
          >
            <span className="block text-[0.45em] font-bold tracking-wide text-forest/40">現場で使える独自システム開発</span>
            <span className="text-[0.8em] font-bold">開発</span>
            <span className="text-[1.3em] text-sunset">コスト</span>
            <span className="text-[0.8em] font-bold">を相場の</span>
            <span className="text-[1.3em] text-sunset">1/2</span>
            <span className="text-[0.8em] font-bold">へ</span>
            <br />
            <span className="text-[0.8em] font-bold">まずは</span>
            <span className="text-[1.3em] text-sunset">3分</span>
            <span className="text-[0.8em] font-bold">で</span>
            <span className="text-[1.3em] text-sunset">お見積</span>
            <span className="text-[0.8em] font-bold">から。</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="mt-4 md:mt-8 max-w-lg text-[14px] leading-[1.9] text-forest/55 md:text-[15px]"
          >
            <span className="md:hidden">{hero.descriptionShort}</span>
            <span className="hidden md:inline">{hero.description}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="mt-8 hidden md:block"
          >
            <Link
              href="/chat"
              className="group inline-flex items-center gap-3 rounded-full bg-sunset px-14 py-[14px] text-[15px] font-bold text-white shadow-lg transition-all duration-200 hover:brightness-110"
            >
              {hero.cta}
              <ArrowRight className="h-4 w-4 animate-nudge-x" />
            </Link>
            <p className="mt-3 text-[11px] text-forest/35">{hero.ctaMicro}</p>
          </motion.div>
        </div>

        {/* Right: Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          <CostSimulator />
        </motion.div>
      </div>
    </section>
  );
}
