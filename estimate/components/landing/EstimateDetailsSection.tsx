"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { LP_COPY } from "@/content/estimate";

const ease = [0.25, 0.1, 0.25, 1] as const;
const { estimateDetails } = LP_COPY;

export default function EstimateDetailsSection() {
  return (
    <section id="estimate-details" className="bg-slate-50 py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sage">
            {estimateDetails.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight md:text-[2rem]">
            {estimateDetails.title}
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {estimateDetails.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="rounded-2xl bg-white p-6 md:p-8"
            >
              <h3 className="text-base font-bold tracking-tight md:text-lg">
                {item.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-forest/60">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
