"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { StepOption } from "@/types/estimate";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectInputProps {
  options: StepOption[];
  value: string[];
  onChange: (value: string[]) => void;
  "aria-label"?: string;
}

export default function MultiSelectInput({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: MultiSelectInputProps) {
  function toggleOption(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  }

  return (
    <motion.div
      role="group"
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="v-stack gap-3"
    >
      <p className="text-xs font-medium text-gray-400">複数選択できます</p>
      {options.map((option, i) => {
        const selected = value.includes(option.value);
        return (
          <motion.button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            onClick={() => toggleOption(option.value)}
            className={cn("option-card", selected && "option-card--selected")}
          >
            <span className="font-medium text-gray-800">{option.label}</span>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                  className="center h-8 w-8 shrink-0 rounded-full bg-sage text-white shadow-sm"
                >
                  <Check className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="empty"
                  className="h-8 w-8 shrink-0 rounded-full border-2 border-gray-200"
                />
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
