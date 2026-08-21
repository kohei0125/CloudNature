"use client";

import Script from "next/script";
import { IS_PRODUCTION } from "@/lib/site";

const AHREFS_KEY = process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY;

/**
 * Ahrefs Web Analytics のトラッキングタグ。
 * Ahrefs 側プロジェクトは subdomains モードのため、同じキーで
 * cloudnature.jp / ai.cloudnature.jp / ai-dev.cloudnature.jp を1つのレポートに集約できる。
 * Cookie を使わない計測のため同意バナーの対象外。
 */
export default function AhrefsAnalytics() {
  if (!AHREFS_KEY || !IS_PRODUCTION) return null;

  return (
    <Script
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={AHREFS_KEY}
      strategy="afterInteractive"
    />
  );
}
