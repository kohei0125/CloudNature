import type { MetadataRoute } from "next";
import { CANONICAL_SITE_URL, isIndexableDeployment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const isIndexable = isIndexableDeployment();

  if (!isIndexable) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  // 方針: 学習用クローラは拒否し、AI検索の引用・ユーザー起点の取得は許可する
  // （AI検索経由の露出 = AIEO を確保しつつ、モデル学習への利用は防ぐ）
  const aiSearchBots = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
  ];
  const aiTrainingBots = ["GPTBot", "Google-Extended", "ClaudeBot"];

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiSearchBots.map((userAgent) => ({ userAgent, allow: "/" })),
      ...aiTrainingBots.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
  };
}
