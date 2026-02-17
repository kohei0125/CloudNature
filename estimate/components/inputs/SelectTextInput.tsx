"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { StepOption } from "@/types/estimate";
import { cn } from "@/lib/utils";

interface SelectTextInputProps {
  options: StepOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onAutoAdvance?: () => void;
  "aria-label"?: string;
}

const OTHER_VALUE = "__other__";

export default function SelectTextInput({
  options,
  value,
  onChange,
  onAutoAdvance,
  "aria-label": ariaLabel,
}: SelectTextInputProps) {
  const currentValue = typeof value === "string" ? value : "";
  const isOther = currentValue.startsWith(OTHER_VALUE + ":");
  const selectedOption = isOther ? OTHER_VALUE : currentValue;
  const otherText = isOther
    ? currentValue.slice(OTHER_VALUE.length + 1)
    : "";

  function handleSelect(optionValue: string) {
    if (optionValue === OTHER_VALUE) {
      onChange(`${OTHER_VALUE}:${otherText}`);
    } else {
      onChange(optionValue);
      if (onAutoAdvance) {
        setTimeout(onAutoAdvance, 120);
      }
    }
  }

  function handleOtherTextChange(text: string) {
    onChange(`${OTHER_VALUE}:${text}`);
  }

  return (
    <motion.div
      role="radiogroup"
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="v-stack gap-3"
    >
      {[...options, { value: OTHER_VALUE, label: "その他（自由記述）" }].map(
        (option, i) => {
          const selected = selectedOption === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
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
        }
      )}

      <AnimatePresence>
        {selectedOption === OTHER_VALUE && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              aria-label="その他の詳細"
              value={otherText}
              onChange={(e) => handleOtherTextChange(e.target.value)}
              placeholder="詳細をご入力ください..."
              maxLength={500}
              rows={3}
              className={cn(
                "mt-1 w-full resize-none rounded-[14px] border-[1.5px] border-[#d6d3cd] bg-white px-5 py-4",
                "text-[0.9375rem] text-gray-800 placeholder:text-gray-400",
                "outline-none transition-all",
                "focus:border-sage focus:shadow-[0_0_0_3px_rgba(138,150,104,0.12)]"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
