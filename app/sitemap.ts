import type { MetadataRoute } from "next";
import { getAllNewsForSitemap } from "@/lib/microcms";
import { CANONICAL_SITE_URL as BASE_URL } from "@/lib/site";
import { USECASES_ARTICLES } from "@/content/usecases";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: "2026-02-27", changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/services`, lastModified: "2026-02-20", changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/cases`, lastModified: "2026-02-27", changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/company`, lastModified: "2026-02-06", changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: "2026-02-06", changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/news`, lastModified: "2026-02-27", changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/usecases`, lastModified: "2026-03-27", changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: "2025-11-01", changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/security`, lastModified: "2025-11-01", changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: "2025-11-01", changeFrequency: "yearly", priority: 0.3 },
  ];

  let newsItems: { id: string; updatedAt: string }[] = [];
  try {
    newsItems = await getAllNewsForSitemap();
  } catch {
    // microCMS 不通時はニュース記事をスキップ
  }

  const newsRoutes: MetadataRoute.Sitemap = newsItems.map((item) => ({
    url: `${BASE_URL}/news/${item.id}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const usecasesRoutes: MetadataRoute.Sitemap = USECASES_ARTICLES.map((article) => ({
    url: `${BASE_URL}/usecases/${article.id}`,
    lastModified: article.publishedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...newsRoutes, ...usecasesRoutes];
}
