import { NavItem } from "@/types";

export const ESTIMATE_URL = "https://ai.cloudnature.jp";

export const SITE_CTA = {
  primary: { label: "無料でAI見積もり", href: "https://ai.cloudnature.jp" },
  secondary: { label: "お問い合わせ・ご相談", href: "/contact" },
};

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
  { label: "企業情報", path: "/company" },
  { label: "お問い合わせ", path: "/contact" }
];

export const PAGE_META = {
  home: {
    title: "株式会社クラウドネイチャー | 新潟の中小企業向けAI・業務自動化パートナー",
    description:
      "新潟の中小企業の人手不足を、AIエージェントと堅牢なシステム開発で解決。先進的なAIと業務自動化で、現場の負担を半分に。無料診断受付中。"
  },
  philosophy: {
    title: "想い | 新潟発のIT企業 クラウドネイチャー",
    description: "作って終わりにしない、伴走型の開発パートナー。新潟の中小企業に寄り添い、AIとシステムで現場の課題を解決します。"
  },
  services: {
    title: "サービス | 新潟のAI・システム開発 クラウドネイチャー",
    description: "システム開発・AIエージェント開発・AI活用支援。新潟の中小企業に最適なテクノロジーで、人手不足の解消と業務効率化を実現します。"
  },
  cases: {
    title: "導入事例 | 新潟の製造業・サービス業でのAI活用実績",
    description: "新潟の製造業・サービス業・自治体でのAIエージェント導入事例。教育コスト40%削減、事務作業週15時間→2時間など、具体的な成果を紹介。"
  },
  contact: {
    title: "お問い合わせ・無料診断 | クラウドネイチャー",
    description: "AI導入・業務自動化の無料診断、資料請求はこちら。新潟の中小企業の人手不足や業務効率化の課題をお気軽にご相談ください。"
  },
  privacy: {
    title: "プライバシーポリシー | 株式会社クラウドネイチャー",
    description: "個人情報の取り扱い方針についてご案内します。"
  },
  company: {
    title: "企業情報 | 株式会社クラウドネイチャー",
    description: "株式会社クラウドネイチャーの会社概要・代表メッセージ・沿革・アクセス情報。新潟の中小企業に寄り添うAI・システム開発パートナーです。"
  },
  security: {
    title: "情報セキュリティ方針 | 株式会社クラウドネイチャー",
    description: "情報資産の保護と安全管理に関する取り組みを記載しています。"
  },
  terms: {
    title: "利用規約 | 株式会社クラウドネイチャー",
    description: "サービスのご利用にあたっての規約・条件についてご案内します。"
  },
  news: {
    title: "ニュース | 株式会社クラウドネイチャー",
    description: "CloudNatureの最新ニュース、登壇実績等の情報を発信しています。"
  }
};
