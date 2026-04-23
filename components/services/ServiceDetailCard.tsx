"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ServiceDetail } from "@/types";

const accentBg: Record<string, string> = {
  sage: "bg-sage",
  sunset: "bg-sunset",
  sea: "bg-sea",
};

const accentText: Record<string, string> = {
  sage: "text-sage",
  sunset: "text-sunset",
  sea: "text-sea",
};

const accentBorder: Record<string, string> = {
  sage: "border-sage",
  sunset: "border-sunset",
  sea: "border-sea",
};

interface ServiceDetailCardProps {
  service: ServiceDetail;
  index: number;
}

const ServiceDetailCard = ({ service, index }: ServiceDetailCardProps) => {
  const isEven = index % 2 === 0;
  const num = String(index + 1).padStart(2, "0");

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
          <p
            className={cn(
              "mt-3 text-xs font-bold tracking-widest uppercase md:hidden",
              accentText[service.accentColor]
            )}
          >
            {service.subtitle}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="md:w-[55%] v-stack justify-center">
        {/* Number + Subtitle (desktop) */}
        <div className="hidden md:flex items-center gap-4 mb-4">
          <span className="text-forest/20 font-sans text-5xl font-bold leading-none">
            {num}
          </span>
          <div
            className={cn("h-px flex-1 max-w-16", accentBg[service.accentColor])}
          />
          <p
            className={cn(
              "text-xs font-bold tracking-widest uppercase",
              accentText[service.accentColor]
            )}
          >
            {service.subtitle}
          </p>
        </div>

        {/* Mobile number */}
        <span className="text-forest/15 font-sans text-4xl font-bold leading-none mb-2 md:hidden">
          {num}
        </span>

        <h3 className="text-2xl md:text-3xl font-sans font-bold text-forest mb-4 leading-snug">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
          {service.description}
        </p>

        {/* Features — simple stacked list with accent left border */}
        <div
          className={cn(
            "border-l-2 pl-5 space-y-5 mb-8",
            accentBorder[service.accentColor]
          )}
        >
          {service.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
            >
              <p className="font-bold text-forest text-sm leading-snug">
                {feature.title}
              </p>
              <p className="text-gray-500 text-xs leading-relaxed mt-1">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tech stack — inline text */}
        <p className="text-xs text-gray-400 tracking-wide">
          {service.techStack.join(" / ")}
        </p>

        {service.externalUrl && (
          <a
            href={service.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-8 inline-flex items-center gap-2 text-sm font-bold transition-all hover:underline hover:underline-offset-4",
              accentText[service.accentColor]
            )}
          >
            新潟AIアカデミーを詳しく見る
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
};

export default ServiceDetailCard;
