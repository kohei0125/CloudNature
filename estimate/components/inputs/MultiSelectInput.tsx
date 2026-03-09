"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { StepOption } from "@/types/estimate";
import { Check, ListChecks } from "lucide-react";
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
    <div
      role="group"
      aria-label={ariaLabel}
      className="v-stack gap-3"
    >
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-sage/30 bg-sage/10 px-3 py-1 text-xs font-medium text-sage">
        <ListChecks className="h-3.5 w-3.5" />
        複数選択可
      </span>
      {options.map((option, i) => {
        const selected = value.includes(option.value);
        return (
          <motion.button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={selected}
            initial={{ y: 6 }}
            animate={{ y: 0 }}
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
    </div>
  );
}
