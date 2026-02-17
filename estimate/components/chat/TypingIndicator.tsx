"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface TypingIndicatorProps {
  message?: string;
}

export default function TypingIndicator({
  message = "AIがあなた専用の質問を作成中...",
}: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="v-stack items-center gap-6"
    >
      <div className="h-stack items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 md:h-20 md:w-20">
          <Image
            src="/images/avatar.png"
            alt="アシスタント"
            fill
            className="object-contain rounded-full"
          />
        </div>
        <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="h-stack items-center gap-3">
            <div className="h-stack gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block h-2 w-2 rounded-full bg-sage"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">{message}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
