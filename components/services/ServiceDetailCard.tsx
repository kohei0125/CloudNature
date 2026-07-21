"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SERVICE_ORDER } from "@/content/common";
import type { ServiceDetail } from "@/types";

// アクセント配色（accentColor キーごとに bg / text / border をまとめて保持）
const accents: Record<string, { bg: string; text: string; border: string }> = {
  primary: { bg: "bg-teal-800", text: "text-teal-800", border: "border-teal-800" },
  secondary: { bg: "bg-teal-600", text: "text-teal-600", border: "border-teal-600" },
  tertiary: { bg: "bg-teal-500", text: "text-teal-500", border: "border-teal-500" },
};

interface ServiceDetailCardProps {
  service: ServiceDetail;
}

const ServiceDetailCard = ({ service }: ServiceDetailCardProps) => {
  // 表示順（SERVICE_ORDER）を唯一の正として番号・左右交互を決める
  const order = SERVICE_ORDER.indexOf(service.id);
  const num = String(order + 1).padStart(2, "0");
  const isEven = order % 2 === 0;
  const accent = accents[service.accentColor] ?? accents.secondary;

  return (
    <article
      className={cn(
        "v-stack md:h-stack gap-8 md:gap-12 lg:gap-16",
        !isEven && "md:h-stack-reverse"
      )}
    >
      {/* Image */}
      {service.image && (
        <div className="relative w-full md:w-[45%] flex-shrink-0">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          {/* Caption-style subtitle under image on mobile */}
          <p className={cn("mt-3 text-xs font-bold tracking-widest uppercase md:hidden", accent.text)}>
            {service.subtitle}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="md:w-[55%] v-stack justify-center">
        {/* Number + Subtitle (desktop) */}
        <div className="hidden md:flex items-center gap-4 mb-4">
          <span className="text-forest/20 font-sans text-5xl font-bold leading-none">{num}</span>
          <div className={cn("h-px flex-1 max-w-16", accent.bg)} />
          <p className={cn("text-xs font-bold tracking-widest uppercase", accent.text)}>
            {service.subtitle}
          </p>
        </div>

        {/* Mobile number */}
        <span className="text-forest/15 font-sans text-4xl font-bold leading-none mb-2 md:hidden">
          {num}
        </span>

        {/* サービス名 */}
        <p className="text-sm font-medium text-gray-500 mb-2">{service.title}</p>

        {/* キャッチコピー見出し */}
        <h3 className="text-2xl md:text-3xl font-sans font-bold text-forest mb-8 leading-snug">
          {service.heading}
        </h3>

        {/* 対象 / ゴール / 特徴 — アクセントの縦ボーダー付きリスト */}
        <div className={cn("border-l-2 pl-5 space-y-5 mb-8", accent.border)}>
          {service.pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
            >
              <p className={cn("text-[11px] font-bold tracking-wider mb-1", accent.text)}>
                {pillar.label}
              </p>
              <p className="font-bold text-forest text-sm leading-snug">{pillar.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed mt-1">{pillar.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech stack — inline text */}
        <p className="text-xs text-gray-400 tracking-wide">{service.techStack.join(" / ")}</p>

        {service.externalLinks && service.externalLinks.length > 0 && (
          <div className="mt-8 v-stack gap-3 items-start">
            {service.externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-bold transition-all hover:underline hover:underline-offset-4",
                  accent.text
                )}
              >
                {link.label}
                <ExternalLink className="w-4 h-4" />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default ServiceDetailCard;
