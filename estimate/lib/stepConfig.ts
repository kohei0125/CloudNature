import type { StepConfig } from "@/types/estimate";
import { STEP_OPTIONS } from "@/content/estimate";
import { EMAIL_REGEX } from "@/lib/utils";

export const STEP_CONFIGS: StepConfig[] = [
  // Step 1: Business type
  {
    id: 1,
    type: "select",
    required: true,
    options: STEP_OPTIONS.businessType,
  },
  // Step 2: Industry
  {
    id: 2,
    type: "select",
    required: true,
    options: STEP_OPTIONS.industry,
  },
  // Step 3: User count
  {
    id: 3,
    type: "select",
    required: true,
    options: STEP_OPTIONS.userCount,
  },
  // Step 4: Current challenges (free text)
  {
    id: 4,
    type: "text",
    required: true,
    maxLength: 500,
    minLength: 10,
    placeholder:
      "例：紙の請求書管理に時間がかかっており、電子化して業務を効率化したい",
    validation: (value) => {
      if (typeof value === "string" && value.trim().length < 10) {
        return "10文字以上でご入力ください";
      }
      return null;
    },
  },
  // Step 5: Deployment target
  {
    id: 5,
    type: "select",
    required: true,
    options: STEP_OPTIONS.deploymentTarget,
  },
  // Step 6: System type
  {
    id: 6,
    type: "select",
    required: true,
    options: STEP_OPTIONS.systemType,
  },
  // Step 7: Development type (new / migration / enhancement)
  {
    id: 7,
    type: "select",
    required: true,
    options: STEP_OPTIONS.developmentType,
  },
  // Step 8: AI-generated feature suggestions (multi-select, optional)
  {
    id: 8,
    type: "multi-select",
    required: false,
    aiGenerated: true,
  },
  // Step 9: Timeline
  {
    id: 9,
    type: "select",
    required: true,
    options: STEP_OPTIONS.timeline,
  },
  // Step 10: Device / platform
  {
    id: 10,
    type: "select",
    required: true,
    options: STEP_OPTIONS.device,
  },
  // Step 11: Budget
  {
    id: 11,
    type: "select",
    required: true,
    options: STEP_OPTIONS.budget,
  },
  // Step 12: Additional requirements (free text, optional)
  {
    id: 12,
    type: "text",
    required: false,
    maxLength: 1000,
  },
  // Step 13: Contact info (name + company + email in one page)
  {
    id: 13,
    type: "contact",
    required: true,
    validation: (value) => {
      if (typeof value !== "string") return "入力内容が不正です";
      try {
        const parsed = JSON.parse(value);
        if (!parsed.name || parsed.name.trim().length < 2) {
          return "お名前を2文字以上でご入力ください";
        }
        if (!parsed.company || parsed.company.trim().length < 1) {
          return "企業・団体名をご入力ください";
        }
        if (!parsed.email || !EMAIL_REGEX.test(parsed.email.trim())) {
          return "有効なメールアドレスをご入力ください";
        }
        return null;
      } catch {
        return "入力内容が不正です";
      }
    },
  },
];

export const TOTAL_STEPS = STEP_CONFIGS.length;

const STEP_MAP = new Map(STEP_CONFIGS.map((s) => [s.id, s]));

export function getStepConfig(stepId: number): StepConfig | undefined {
  return STEP_MAP.get(stepId);
}
