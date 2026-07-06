import { ESTIMATE_URL } from "@/content/common";

export const HEADER_COPY = {
  brand: "CloudNature",
  downloadCta: "資料ダウンロード",
  contactCta: "お問い合わせ",
  mobilePrompt: "お急ぎの方はこちら",
  mobileButton: "お問い合わせ"
};

export const FOOTER_COPY = {
  description: "AI導入から運用まで伴走する開発パートナー",
  serviceHeading: "SERVICE",
  companyHeading: "COMPANY",
  serviceLinks: [
    { label: "システム開発", path: "/services/system-dev" },
    { label: "AIエージェント開発", path: "/services/ai-agent" },
    { label: "法人向けAI導入支援", path: "/services/ai-support" },
    { label: "AI見積もり", path: ESTIMATE_URL, external: true }
  ],
  companyLinks: [
    { label: "企業情報", path: "/company" },
    { label: "導入事例", path: "/cases" },
    { label: "AIガイド", path: "/usecases" },
    { label: "お知らせ", path: "/news" },
  ],
  legalLinks: [
    { label: "利用規約", path: "/terms" },
    { label: "プライバシーポリシー", path: "/privacy" },
    { label: "情報セキュリティ方針", path: "/security" }
  ],
  copyright: "© 2026 CloudNature Co., Ltd. All Rights Reserved.",
};
