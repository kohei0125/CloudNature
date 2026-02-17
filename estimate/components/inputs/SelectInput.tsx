"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { StepOption } from "@/types/estimate";
import { cn } from "@/lib/utils";

interface SelectInputProps {
  options: StepOption[];
  value: string;
  onChange: (value: string) => void;
  onAutoAdvance?: () => void;
}

export default function SelectInput({
  options,
  value,
  onChange,
  onAutoAdvance,
}: SelectInputProps) {
  function handleSelect(optionValue: string) {
    onChange(optionValue);
    if (onAutoAdvance) {
      setTimeout(onAutoAdvance, 250);
    }
  }

  return (
    <motion.div
      role="radiogroup"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="v-stack gap-3"
    >
      {options.map((option, i) => {
        const selected = value === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            onClick={() => handleSelect(option.value)}
            className={cn("option-card", selected && "option-card--selected")}
          >
            <span className="font-medium text-gray-800">{option.label}</span>
            <span
              className={cn(
                "center h-8 w-8 shrink-0 rounded-full transition-all",
                selected
                  ? "bg-sage text-white shadow-sm"
                  : "bg-sage/70 text-white/90"
              )}
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
