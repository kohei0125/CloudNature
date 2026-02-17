"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { LP_COPY } from "@/content/estimate";

const ease = [0.25, 0.1, 0.25, 1] as const;
const { bottomCta } = LP_COPY;

export default function TrustBar() {
  return (
    <section className="bg-earth py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-10">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="font-serif text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-snug tracking-tight text-white"
        >
          {bottomCta.heading}
        </motion.h2>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="mt-10"
        >
          <Link
            href="/chat"
            className="group inline-flex items-center gap-3 rounded-full bg-sunset px-10 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:brightness-110"
          >
            {bottomCta.cta}
            <ArrowRight className="h-4 w-4 animate-nudge-x" />
          </Link>

          <p className="mt-4 text-sm text-white/35">{bottomCta.ctaSub}</p>
        </motion.div>
      </div>
    </section>
  );
}
