import type { MetadataRoute } from "next";
import { CANONICAL_SITE_URL, isIndexableDeployment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const isIndexable = isIndexableDeployment();

  if (!isIndexable) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
    ],
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
  };
}
