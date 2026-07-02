"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
}

const PageHero = ({ eyebrow, title, description, bgColor = "#FAFAFA", id }: PageHeroProps) => {
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
      </div>
    </section>
  );
};

export default PageHero;
