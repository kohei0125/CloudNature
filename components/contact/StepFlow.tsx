"use client";

import { motion } from "framer-motion";
import { STEP_FLOW } from "@/content/contact";

const StepFlow = () => {
  return (
    <div className="relative">
      {STEP_FLOW.map((item, index) => (
        <motion.div
          key={item.step}
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
        >
          {/* Left column: number circle + connecting line */}
          <div className="v-stack items-center">
            <div className="w-10 h-10 rounded-full bg-sage text-white center font-bold flex-shrink-0 hover:bg-sage/80 hover:shadow-[0_0_10px_rgba(138,150,104,0.3)] transition-all duration-300">
              {item.step}
            </div>
            {index < STEP_FLOW.length - 1 && (
              <motion.div
                className="w-0.5 bg-sage/30 flex-1 min-h-[40px]"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                style={{ transformOrigin: "top" }}
              />
            )}
          </div>

          {/* Right column: title + description */}
          <div className="pb-8">
            <h4 className="font-bold text-forest mb-1">{item.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StepFlow;
