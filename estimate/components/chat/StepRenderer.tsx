"use client";

import type { StepConfig, StepOption } from "@/types/estimate";
import SelectInput from "@/components/inputs/SelectInput";
import MultiSelectInput from "@/components/inputs/MultiSelectInput";
import TextInput from "@/components/inputs/TextInput";
import EmailInput from "@/components/inputs/EmailInput";
import ContactInput from "@/components/inputs/ContactInput";
import SelectTextInput from "@/components/inputs/SelectTextInput";

interface StepRendererProps {
  stepConfig: StepConfig;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  aiOptions?: StepOption[];
  onAutoAdvance?: () => void;
}

export default function StepRenderer({
  stepConfig,
  value,
  onChange,
  aiOptions,
  onAutoAdvance,
}: StepRendererProps) {
  const options = stepConfig.aiGenerated ? aiOptions : stepConfig.options;

  switch (stepConfig.type) {
    case "select":
      return (
        <SelectInput
          options={options ?? []}
          value={typeof value === "string" ? value : ""}
          onChange={(v) => onChange(v)}
          onAutoAdvance={onAutoAdvance}
        />
      );

    case "multi-select":
      return (
        <MultiSelectInput
          options={options ?? []}
          value={Array.isArray(value) ? value : []}
          onChange={(v) => onChange(v)}
        />
      );

    case "text":
      return (
        <TextInput
          value={typeof value === "string" ? value : ""}
          onChange={(v) => onChange(v)}
          maxLength={stepConfig.maxLength}
        />
      );

    case "email":
      return (
        <EmailInput
          value={typeof value === "string" ? value : ""}
          onChange={(v) => onChange(v)}
          maxLength={stepConfig.maxLength}
        />
      );

    case "contact":
      return (
        <ContactInput
          value={typeof value === "string" ? value : ""}
          onChange={(v) => onChange(v)}
        />
      );

    case "select-text":
      return (
        <SelectTextInput
          options={options ?? []}
          value={value}
          onChange={onChange}
          onAutoAdvance={onAutoAdvance}
        />
      );

    default:
      return null;
  }
}
