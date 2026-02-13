"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { DEV_APPROACH } from "@/content/philosophy";

const DevApproach = () => {
  return (
    <section className="relative py-16 md:py-24 bg-forest text-white texture-grain">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,#8A9668,transparent_30%),radial-gradient(circle_at_70%_50%,#DD9348,transparent_30%)]"></div>
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="APPROACH"
          title="開発の進め方"
          centered
          darkMode
        />

        <div className="grid md:grid-cols-5 gap-6">
          {DEV_APPROACH.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              {/* Connector dash (desktop only, not on last item) */}
              {index < DEV_APPROACH.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-6 left-[calc(50%+30px)] right-[-24px] border-t-2 border-dashed border-sage/40"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              )}

              <div className="v-stack items-center md:items-start">
                <div className="w-12 h-12 rounded-full border-2 border-sage text-sage center text-lg font-bold mb-4 hover:bg-sage hover:text-white hover:shadow-[0_0_15px_rgba(138,150,104,0.4)] transition-all duration-300 cursor-default">
                  {step.step}
                </div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DevApproach;
