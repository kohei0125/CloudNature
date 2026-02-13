"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { IMPLEMENTATION_FLOW } from "@/content/services";

const ImplementationFlow = () => {
  return (
    <section className="py-16 md:py-24 bg-mist">
      <div className="container mx-auto px-6">
        <SectionHeader eyebrow="PROCESS" title="導入の流れ" centered />

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-4">
          {IMPLEMENTATION_FLOW.map((item, index) => (
            <motion.div
              key={item.step}
              className="relative v-stack items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              {/* Connecting line */}
              {index < IMPLEMENTATION_FLOW.length - 1 && (
                <motion.div
                  className="absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-px bg-sage/30"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              )}
              <div className="w-10 h-10 rounded-full bg-sage text-white center text-sm font-bold relative z-10">
                {item.step}
              </div>
              <h4 className="font-bold text-forest text-sm mt-4 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="lg:hidden space-y-6">
          {IMPLEMENTATION_FLOW.map((item, index) => (
            <motion.div
              key={item.step}
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="v-stack items-center">
                <div className="w-10 h-10 rounded-full bg-sage text-white center text-sm font-bold flex-shrink-0">
                  {item.step}
                </div>
                {index < IMPLEMENTATION_FLOW.length - 1 && (
                  <motion.div
                    className="w-px flex-1 bg-sage/30 mt-2"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                    style={{ transformOrigin: "top" }}
                  />
                )}
              </div>
              <div className="pb-6">
                <h4 className="font-bold text-forest text-sm">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImplementationFlow;
