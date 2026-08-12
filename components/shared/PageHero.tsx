"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import SmartLink from "@/components/shared/SmartLink";
import type { LinkItem } from "@/types";

// 入場アニメーション（eyebrow → title → description の順に delay をずらす）
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

const heroBlobs = (
  <>
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cloud rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none animate-blob" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sage rounded-full mix-blend-multiply filter blur-[120px] opacity-15 pointer-events-none animate-blob animation-delay-2000" />
  </>
);

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  bgColor?: string;
  /** section に付与する id */
  id?: string;
  /** ファーストビューに置く主要導線。外部URLなら SmartLink が別タブで開く */
  cta?: LinkItem;
}

const PageHero = ({ eyebrow, title, description, bgColor = "#FAFAFA", id, cta }: PageHeroProps) => {
  return (
    <section id={id} className="pt-32 pb-16 relative overflow-hidden texture-grain" style={{ backgroundColor: bgColor }}>
      {heroBlobs}

      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* data-reveal: JS 無効時に layout.tsx の <noscript> スタイルで初期非表示を解除する */}
        <motion.p
          {...reveal()}
          className="text-sm font-bold tracking-widest text-sage mb-4 uppercase"
          data-reveal
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          {...reveal(0.1)}
          className="text-[clamp(1.5rem,5vw,3rem)] font-sans font-bold text-forest mb-6"
          data-reveal
        >
          {title}
        </motion.h1>
        {description ? (
          <motion.p
            {...reveal(0.2)}
            className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
            data-reveal
          >
            {description}
          </motion.p>
        ) : null}
        {cta ? (
          <motion.div {...reveal(0.3)} className="mt-8" data-reveal>
            {/* InlineCta の主要ボタンと同じサイズ・見た目に揃える（CTAの寸法を増やさない） */}
            <SmartLink
              href={cta.href}
              className="btn-puffy btn-puffy-accent px-6 py-3 rounded-full font-bold text-sm text-white inline-flex items-center justify-center gap-2"
            >
              {cta.label}
              <ArrowRight className="w-4 h-4" />
            </SmartLink>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
};

export default PageHero;
