import type { UseCaseArticle } from "@/types";
import { article as businessAutomationSmallStart } from "./business-automation-small-start";
import { article as niigataAiSubsidyGuide2026 } from "./niigata-ai-subsidy-guide-2026";
import { article as aiAutoSalesDelivery } from "./ai-auto-sales-delivery";
import { article as aiAnalyticsAutoReport } from "./ai-analytics-auto-report";

export { USECASES_SECTION, USECASES_CTA, USECASES_DETAIL } from "./_common";

export const USECASES_ARTICLES: UseCaseArticle[] = [
  businessAutomationSmallStart,
  niigataAiSubsidyGuide2026,
  aiAutoSalesDelivery,
  aiAnalyticsAutoReport,
];
