"use client";

import { motion } from "framer-motion";
import { Cpu, TrendingUp, Zap } from "lucide-react";

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

export default function WhyCloudNature() {
  return (
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
  );
}
