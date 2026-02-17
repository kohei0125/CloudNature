"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { LP_COPY } from "@/content/estimate";

const ease = [0.25, 0.1, 0.25, 1] as const;
const { flow } = LP_COPY;

export default function FlowSection() {
  return (
    <section id="flow" className="relative overflow-hidden bg-charcoal py-24 md:py-32">
      {/* Background Image - Right aligned (desktop only) */}
      <div className="absolute bottom-0 right-0 top-0 z-0 w-full md:w-3/5 lg:w-1/2">
        <Image
          src="/images/flow_bg_bright.png"
          alt="Flow Background"
          fill
          className="object-cover object-right opacity-60"
        />
        {/* Gradient overlay to blend with the solid background color on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
            {flow.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-white md:text-[2rem]">
            {flow.title}
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="mt-14 grid gap-12 md:mt-16 md:grid-cols-4 md:gap-0">
          {flow.steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
              className="relative md:pr-10"
            >
              {/* Vertical connector (mobile) */}
              {i < flow.steps.length - 1 && (
                <div
                  className="absolute -bottom-8 left-3 h-5 w-px bg-white/10 md:hidden"
                  aria-hidden="true"
                />
              )}

              {/* Horizontal connector (desktop) */}
              {i < flow.steps.length - 1 && (
                <div
                  className="absolute right-0 top-3 hidden h-px w-10 bg-white/10 md:block"
                  aria-hidden="true"
                />
              )}

              {/* Number */}
              <p className="text-[13px] font-bold tracking-[0.15em] text-sunset">
                {step.number}
              </p>

              {/* Thin rule */}
              <div
                className="mt-4 h-px w-10 bg-white/20"
                aria-hidden="true"
              />

              {/* Title */}
              <h3 className="mt-5 text-lg font-bold text-white">
                {step.title}
              </h3>

              {/* Body */}
              <p className="mt-3 text-[13px] leading-[1.9] text-white/60 md:text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Section CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="mt-16 text-center"
        >
          <Link
            href="/chat"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-[14px] text-[15px] font-bold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10"
          >
            まずは無料で試してみる
            <ArrowRight className="h-4 w-4 animate-nudge-x" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
