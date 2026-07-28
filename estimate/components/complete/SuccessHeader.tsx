"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function SuccessHeader({ clientName }: { clientName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="center mx-auto mb-4 h-16 w-16 rounded-full bg-sage/10">
        <CheckCircle className="h-9 w-9 text-sage" />
      </div>
      <h1 className="font-serif text-2xl font-bold leading-tight md:text-[1.75rem]">
        概算お見積もりが完成しました
      </h1>
      {clientName && (
        <p className="mt-2 text-sm text-forest/50">
          {clientName} 様、ありがとうございます
        </p>
      )}
    </motion.div>
  );
}
