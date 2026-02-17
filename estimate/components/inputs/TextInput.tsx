"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  rows?: number;
}

export default function TextInput({
  value,
  onChange,
  maxLength,
  placeholder = "こちらにご入力ください...",
  rows = 4,
}: TextInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="v-stack gap-1.5"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full resize-none rounded-[14px] border-[1.5px] border-[#d6d3cd] bg-white px-5 py-4",
          "text-[0.9375rem] text-gray-800 placeholder:text-gray-400",
          "outline-none transition-all",
          "focus:border-sage focus:shadow-[0_0_0_3px_rgba(138,150,104,0.12)]"
        )}
      />
      {maxLength && (
        <span className="text-right text-xs text-gray-400">
          {value.length}/{maxLength}
        </span>
      )}
    </motion.div>
  );
}
