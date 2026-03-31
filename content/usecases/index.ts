import type { UseCaseArticle } from "@/types";
import { article as aiAutoSalesDelivery } from "./ai-auto-sales-delivery";
import { article as aiAnalyticsAutoReport } from "./ai-analytics-auto-report";

export { USECASES_SECTION, USECASES_CTA, USECASES_DETAIL } from "./_common";

export const USECASES_ARTICLES: UseCaseArticle[] = [
  aiAutoSalesDelivery,
  aiAnalyticsAutoReport,
];
