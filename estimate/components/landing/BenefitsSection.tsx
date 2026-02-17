"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LP_COPY } from "@/content/estimate";

const ease = [0.25, 0.1, 0.25, 1] as const;
const { reasons } = LP_COPY;

const items = [
  {
    image: "/images/benefits/benefits_budget_sunset.png",
    alt: "Budget Risk Visualization",
    color: "text-sunset",
    bg: "bg-sunset/8",
  },
  {
    image: "/images/benefits/benefits_speed_sage.png",
    alt: "AI Speed and Automation",
    color: "text-sage",
    bg: "bg-sage/8",
  },
  {
    image: "/images/benefits/benefits_team_sea.png",
    alt: "Team Collaboration and Cost Reduction",
    color: "text-sea",
    bg: "bg-sea/8",
  },
];

export default function BenefitsSection() {
  return (
    <section id="reasons" className="bg-white py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sage">
            {reasons.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight md:text-[2rem]">
            {reasons.title}
          </h2>
        </motion.div>

        {/* Items grid */}
        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-10">
          {reasons.cards.map((card, i) => {
            const { image, alt, color, bg } = items[i];
            return (
              <motion.div
                key={card.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
              >
                {/* Desktop image */}
                <div className="mb-6 hidden h-64 w-full items-center justify-center rounded-2xl bg-slate-50 overflow-hidden md:flex">
                  <div className="relative h-full w-full">
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Mobile: horizontal card with circle image */}
                <div className="flex items-start gap-4 md:hidden">
                  <div className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full ${bg}`}>
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[11px] font-bold tracking-[0.15em] ${color}`}>
                      {card.number}
                    </p>
                    <h3 className="mt-1 text-base font-bold leading-snug tracking-tight">
                      {card.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-[1.8] text-forest/45">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Desktop text (hidden on mobile) */}
                <div className="hidden md:block">
                  <p className={`mt-5 text-[11px] font-bold tracking-[0.15em] ${color}`}>
                    {card.number}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.9] text-forest/45">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
