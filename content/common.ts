import { NavItem } from "@/types";

export const COLORS = {
  sageGreen: "#8A9668",
  deepForest: "#19231B",
  pebbleBeige: "#EDE8E5",
  warmSunset: "#DD9348",
  cloudBlue: "#C8E8FF",
  earth: "#261D14",
  sea: "#79C0BC",
  stone: "#CADCEB"
};

export const NAV_ITEMS: NavItem[] = [
  { label: "ホーム", path: "/" },
  { label: "想い", path: "/philosophy" },
  { label: "サービス", path: "/services" },
  { label: "事例", path: "/cases" },
  { label: "お問い合わせ", path: "/contact" }
];

export const PAGE_META = {
  home: {
    title: "株式会社クラウドネイチャー | AI時代を、共に歩むITパートナー",
    description:
      "地方企業の人手不足をAIエージェントと堅牢なシステム開発で解決。システム開発、AIエージェント開発、DX伴走支援をワンストップ提供。"
  },
  philosophy: {
    title: "想い | 株式会社クラウドネイチャー",
    description: "CloudNatureの使命と価値観。誠実な実装と伴走で地域企業の課題解決に取り組みます。"
  },
  services: {
    title: "サービス | 株式会社クラウドネイチャー",
    description: "システム開発・AIエージェント開発・DX伴走支援。現場最適なテクノロジーで成果を出すサービス群。"
  },
  cases: {
    title: "導入事例 | 株式会社クラウドネイチャー",
    description: "製造業・サービス業・自治体でのDX/自動化事例を紹介。成果と効果を具体的に掲載。"
  },
  contact: {
    title: "お問い合わせ | 株式会社クラウドネイチャー",
    description: "無料相談・資料請求はこちらから。人手不足や業務自動化の課題をお気軽にご相談ください。"
  },
  privacy: {
    title: "プライバシーポリシー | 株式会社クラウドネイチャー",
    description: "個人情報の取り扱い方針についてご案内します。"
  },
  security: {
    title: "情報セキュリティ方針 | 株式会社クラウドネイチャー",
    description: "情報資産の保護と安全管理に関する取り組みを記載しています。"
  }
};
