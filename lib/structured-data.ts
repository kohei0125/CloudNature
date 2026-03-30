import { CANONICAL_SITE_URL as BASE_URL } from "@/lib/site";
import type { ServiceDetail } from "@/types";

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      ...items.map((item, index) => ({
        "@type": "ListItem" as const,
        position: index + 2,
        name: item.name,
        item: `${BASE_URL}${item.path}`,
      })),
    ],
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

type ServiceJsonLdInput = Pick<ServiceDetail, "title" | "description" | "subtitle" | "features" | "image"> & { path: string };

export function serviceJsonLd(service: ServiceJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}${service.path}/#service`,
    name: service.title,
    description: service.description,
    url: `${BASE_URL}${service.path}`,
    ...(service.image && { image: `${BASE_URL}${service.image}` }),
    serviceType: service.subtitle,
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: { "@type": "Place", name: "新潟県" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title}のサービス内容`,
      itemListElement: service.features.map((f) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: f.title,
          description: f.description,
        },
      })),
    },
  };
}
