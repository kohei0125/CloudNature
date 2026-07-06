"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { IMPLEMENTATION_FLOW } from "@/content/services";

const ImplementationFlow = () => {
  // ステップ数は IMPLEMENTATION_FLOW を単一の正とし、グリッド列数・接続線の位置をここから導出する
  // （Tailwind の動的クラスは JIT でパージされるため、算出値はインライン style で指定）
  const stepCount = IMPLEMENTATION_FLOW.length;

  return (
    <section id="implementation" aria-labelledby="implementation-heading" className="py-16 md:py-24 bg-mist relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-32 w-64 h-64 bg-teal-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-64 h-64 bg-teal-800/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader eyebrow="PROCESS" title="導入の流れ" centered headingId="implementation-heading" />

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* Background connecting line（両端ノードの中心＝半カラム分内側に寄せる） */}
          <div
            className="absolute top-6 h-px bg-forest/10"
            style={{ left: `calc(100% / ${stepCount * 2})`, right: `calc(100% / ${stepCount * 2})` }}
          />
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute top-6 h-px bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400"
            style={{ left: `calc(100% / ${stepCount * 2})` }}
            initial={{ width: 0 }}
            whileInView={{ width: `calc(100% - 100% / ${stepCount})` }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))` }}>
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
                <h3 className="font-bold text-forest text-base mt-4 mb-2">
                  {item.title}
                </h3>
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
                <h3 className="font-bold text-forest text-base">
                  {item.title}
                </h3>
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
