import type { UseCaseArticle } from "@/types";
import { article as aiDevelopmentBottleneckShift } from "./ai-development-bottleneck-shift";
import { article as niigataAiDevelopmentCompanyGuide } from "./niigata-ai-development-company-guide";
import { article as niigataFdeSharedAiDevelopment } from "./niigata-fde-shared-ai-development";
import { article as aiPocMethodCostKpi } from "./ai-poc-method-cost-kpi";
import { article as businessAutomationSmallStart } from "./business-automation-small-start";
import { article as niigataAiSubsidyGuide2026 } from "./niigata-ai-subsidy-guide-2026";
import { article as aiAutoSalesDelivery } from "./ai-auto-sales-delivery";
import { article as aiAnalyticsAutoReport } from "./ai-analytics-auto-report";
import { article as aiInstallationFailure } from "./ai-installation-failure";
import { article as aiTaskAllocation } from "./ai-task-allocation";

export { USECASES_SECTION, USECASES_CTA, USECASES_DETAIL } from "./_common";

/**
 * 記事の「更新日」。大幅リライトした記事は updatedAt、それ以外は公開日を使う。
 * 一覧の並び順・日付表示・sitemap の lastModified を、この1箇所に揃える。
 */
export function getArticleDate(
  article: Pick<UseCaseArticle, "publishedAt" | "updatedAt">,
): string {
  return article.updatedAt ?? article.publishedAt;
}

/** 更新日の新しい順。TOP のカルーセルと /usecases 一覧が共通で参照する */
export const USECASES_ARTICLES: UseCaseArticle[] = [
  aiDevelopmentBottleneckShift,
  niigataAiDevelopmentCompanyGuide,
  niigataFdeSharedAiDevelopment,
  aiPocMethodCostKpi,
  aiTaskAllocation,
  aiInstallationFailure,
  businessAutomationSmallStart,
  niigataAiSubsidyGuide2026,
  aiAutoSalesDelivery,
  aiAnalyticsAutoReport,
].sort((a, b) => (getArticleDate(a) < getArticleDate(b) ? 1 : -1));
