import type { MetadataRoute } from "next";
import { CANONICAL_SITE_URL, isIndexableDeployment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexableDeployment()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
  };
}
