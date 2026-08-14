import type { UseCaseArticle } from "@/types";
import { article as aiEstimateAutomation } from "./ai-estimate-automation";
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

/**
 * 更新日の新しい順。TOP のカルーセルと /usecases 一覧が共通で参照する。
 * 同じ日付のときは 0 を返し、この配列に書いた順をそのまま表示順にする。
 */
export const USECASES_ARTICLES: UseCaseArticle[] = [
  aiEstimateAutomation,
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
].sort((a, b) => {
  // ISO形式（YYYY-MM-DD）の機械可読な日付なので、ロケール依存の比較は不要。
  // 単純な辞書順で降順にし、等しいときは 0 を返して配列順を維持する（sort は安定）。
  const [x, y] = [getArticleDate(a), getArticleDate(b)];
  return x < y ? 1 : x > y ? -1 : 0;
});
