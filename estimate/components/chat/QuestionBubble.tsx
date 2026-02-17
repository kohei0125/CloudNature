"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface QuestionBubbleProps {
  question: string;
}

export default function QuestionBubble({ question }: QuestionBubbleProps) {
  return (
    <motion.div
      key={question}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-stack items-start gap-4"
    >
      <div className="relative h-16 w-16 shrink-0 md:h-20 md:w-20">
        <Image
          src="/images/avatar.png"
          alt="アシスタント"
          fill
          className="object-contain rounded-full"
          priority
        />
      </div>
      <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <p className="text-sm leading-relaxed text-gray-800 md:text-[0.9375rem]">
          {question}
        </p>
      </div>
    </motion.div>
  );
}
