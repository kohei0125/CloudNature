import type { UseCaseArticle } from "@/types";
import { article as businessAutomationSmallStart } from "./business-automation-small-start";
import { article as niigataAiSubsidyGuide2026 } from "./niigata-ai-subsidy-guide-2026";
import { article as aiAutoSalesDelivery } from "./ai-auto-sales-delivery";
import { article as aiAnalyticsAutoReport } from "./ai-analytics-auto-report";
import { article as aiInstallationFailure } from "./ai-installation-failure";
import { article as aiTaskAllocation } from "./ai-task-allocation";

export { USECASES_SECTION, USECASES_CTA, USECASES_DETAIL } from "./_common";

export const USECASES_ARTICLES: UseCaseArticle[] = [
  aiTaskAllocation,
  aiInstallationFailure,
  businessAutomationSmallStart,
  niigataAiSubsidyGuide2026,
  aiAutoSalesDelivery,
  aiAnalyticsAutoReport,
];
