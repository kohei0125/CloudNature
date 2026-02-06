import { ShieldCheck, Check } from "lucide-react";

export const HEADER_COPY = {
  brand: "CloudNature",
  consultation: "無料相談",
  mobilePrompt: "お急ぎの方はこちら",
  mobileButton: "無料相談を予約する"
};

export const FOOTER_COPY = {
  taglineLines: [
    "新潟の中小企業に、人手に代わる仕組みを。",
    "AIと業務自動化で、現場を変える。",
    "開発から定着支援まで、伴走型でサポートします。"
  ],
  serviceHeading: "Service",
  companyHeading: "Company",
  serviceLinks: [
    { label: "システム開発", path: "/services" },
    { label: "AIエージェント開発", path: "/services" },
    { label: "DX伴走支援", path: "/services" }
  ],
  companyLinks: [
    { label: "想い (Philosophy)", path: "/philosophy" },
    { label: "導入事例", path: "/cases" },
    { label: "プライバシーポリシー", path: "/privacy" },
    { label: "情報セキュリティ方針", path: "/security" }
  ],
  copyright: "© 2026 CloudNature Co., Ltd. All Rights Reserved.",
  badges: [
    { icon: ShieldCheck, label: "AI Guidelines" },
    { icon: Check, label: "GDPR Compliant" }
  ],
  socials: ["FB", "X"]
};
