"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { LP_COPY } from "@/content/estimate";

const ease = [0.25, 0.1, 0.25, 1] as const;
const { faq } = LP_COPY;

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease }}
      className="border-b border-forest/8"
    >
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-[15px] font-bold leading-relaxed text-forest">
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-forest/30 transition-transform duration-300 ${open ? "rotate-180" : ""
            }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <p className="pb-5 text-[14px] leading-[1.9] text-forest/50">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  return (
    <section id="faq" className="bg-mist py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sage">
            {faq.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight md:text-[2rem]">
            {faq.title}
          </h2>
        </motion.div>

        {/* FAQ items */}
        <div className="mt-14 md:mt-16">
          {faq.items.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
