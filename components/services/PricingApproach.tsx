"use client";

import { FileSearch, TrendingUp, HandCoins } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { PRICING_APPROACH } from "@/content/services";

const icons = [FileSearch, TrendingUp, HandCoins];
const accents = [
  { bg: "bg-teal-600/10", text: "text-teal-600", bar: "bg-teal-600" },
  { bg: "bg-teal-800/10", text: "text-teal-800", bar: "bg-teal-800" },
  { bg: "bg-teal-500/10", text: "text-teal-500", bar: "bg-teal-500" },
];

const PricingApproach = () => {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="py-16 md:py-24 bg-white texture-grain">
      <div className="container mx-auto px-6">
        <SectionHeader eyebrow="PRICING" title="料金の考え方" centered headingId="pricing-heading" />

        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          {PRICING_APPROACH.map((item, index) => {
            const Icon = icons[index];
            const accent = accents[index];
            const num = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={index}
                className="relative bg-white rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-lg transition-all duration-300 group overflow-hidden"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${accent.bar}`} />

                {/* Background number */}
                <span className="absolute top-4 right-6 text-[5rem] font-bold leading-none text-forest/[0.04] pointer-events-none select-none">
                  {num}
                </span>

                {/* Step label */}
                <p className={`text-[0.65rem] font-bold tracking-widest uppercase mb-4 ${accent.text}`}>
                  STEP {num}
                </p>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${accent.bg} center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${accent.text}`} />
                </div>

                <h3 className="font-bold text-forest text-lg mb-3 relative z-10">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingApproach;
