"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { IMPLEMENTATION_FLOW } from "@/content/services";

const ImplementationFlow = () => {
  return (
    <section className="py-16 md:py-24 bg-mist relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-32 w-64 h-64 bg-sage/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-64 h-64 bg-sunset/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader eyebrow="PROCESS" title="導入の流れ" centered />

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* Background connecting line */}
          <div className="absolute top-6 left-[calc(100%/12)] right-[calc(100%/12)] h-px bg-forest/10" />
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute top-6 left-[calc(100%/12)] h-px bg-gradient-to-r from-sage via-sunset to-sea"
            initial={{ width: 0 }}
            whileInView={{ width: "calc(100% - 100%/6)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          <div className="grid grid-cols-6 gap-4">
            {IMPLEMENTATION_FLOW.map((item, index) => (
              <motion.div
                key={item.step}
                className="relative v-stack items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="w-12 h-12 rounded-xl bg-forest text-white center text-sm font-bold relative z-10">
                  {String(item.step).padStart(2, "0")}
                </div>
                <h4 className="font-bold text-forest text-base mt-4 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
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
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="v-stack items-center">
                <div className="w-12 h-12 rounded-xl bg-forest text-white center text-sm font-bold flex-shrink-0">
                  {String(item.step).padStart(2, "0")}
                </div>
                {index < IMPLEMENTATION_FLOW.length - 1 && (
                  <motion.div
                    className="w-px flex-1 mt-2 bg-gradient-to-b from-forest/30 to-forest/10"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    style={{ transformOrigin: "top" }}
                  />
                )}
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-forest/5 shadow-sm flex-1 mb-2">
                <h4 className="font-bold text-forest text-base">
                  {item.title}
                </h4>
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
