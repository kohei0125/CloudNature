"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn, EMAIL_REGEX } from "@/lib/utils";
import { ERROR_MESSAGES } from "@/content/estimate";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function EmailInput({
  value,
  onChange,
  maxLength = 254,
}: EmailInputProps) {
  const [touched, setTouched] = useState(false);
  const isValid = EMAIL_REGEX.test(value.trim());
  const showError = touched && value.length > 0 && !isValid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="v-stack gap-1.5"
    >
      <input
        type="email"
        inputMode="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        maxLength={maxLength}
        placeholder="example@company.co.jp"
        className={cn(
          "w-full rounded-[14px] border-[1.5px] bg-white px-5 py-4",
          "text-[0.9375rem] text-gray-800 placeholder:text-gray-400",
          "outline-none transition-all",
          showError
            ? "border-red-300 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
            : "border-[#d6d3cd] focus:border-sage focus:shadow-[0_0_0_3px_rgba(138,150,104,0.12)]"
        )}
      />
      {showError && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-red-500"
        >
          {ERROR_MESSAGES.invalidEmail}
        </motion.span>
      )}
    </motion.div>
  );
}
