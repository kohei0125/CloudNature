import { CASE_STUDY_DETAILS } from "@/content/cases";
import { USECASES_ARTICLES } from "@/content/usecases";
import { SERVICE_PAGE_MAP } from "@/content/services";
import type { RelatedLinkItem } from "@/components/shared/RelatedLinks";

export function getRelatedLinksForService(serviceId: string): RelatedLinkItem[] {
  const links: RelatedLinkItem[] = [];

  const relatedCases = CASE_STUDY_DETAILS.filter(
    (c) => c.relatedServiceIds?.includes(serviceId)
  );
  for (const c of relatedCases) {
    links.push({ label: c.title, href: "/cases", description: "導入事例" });
  }

  const relatedUsecases = USECASES_ARTICLES.filter(
    (u) => u.relatedServiceIds?.includes(serviceId)
  );
  for (const u of relatedUsecases) {
    links.push({ label: u.title, href: `/usecases/${u.id}`, description: "AI活用術" });
  }

  links.push({ label: "お問い合わせ・無料相談", href: "/contact", description: "まずはお気軽にご相談ください" });

  return links;
}

export function getRelatedServicesLinks(serviceIds: string[] | undefined): RelatedLinkItem[] {
  if (!serviceIds || serviceIds.length === 0) return [];
  return serviceIds
    .map((id) => SERVICE_PAGE_MAP[id])
    .filter(Boolean)
    .map((s) => ({ label: s.title, href: s.path, description: "サービス詳細" }));
}
