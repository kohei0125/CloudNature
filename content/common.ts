import { NavItem } from "@/types";

export const ESTIMATE_URL = "https://ai.cloudnature.jp/chat";

export const SITE_CTA = {
  primary: { label: "無料でAI見積もり", href: "https://ai.cloudnature.jp/chat" },
  secondary: { label: "お問い合わせ・ご相談", href: "/contact" },
};

export const COLORS = {
  sageGreen: "#8A9668",
  deepForest: "#19231B",
  pebbleBeige: "#F0F0F0",
  warmSunset: "#DD9348",
  cloudBlue: "#C8E8FF",
  earth: "#261D14",
  sea: "#79C0BC",
  stone: "#CADCEB"
};

export const NAV_ITEMS: NavItem[] = [
  { label: "ホーム", path: "/" },
  { label: "サービス", path: "/services" },
  { label: "事例", path: "/cases" },
  { label: "AIガイド", path: "/usecases" },
  { label: "企業情報", path: "/company" },
  { label: "お問い合わせ", path: "/contact" }
];

export const PAGE_META = {
  home: {
    title: "AI導入支援・業務自動化の伴走型パートナー | 株式会社クラウドネイチャー（新潟）",
    description:
      "新潟の中小企業向けAI導入支援・業務自動化パートナー。「当たり前」になっている業務からAI化し、スモールスタートで成果を実感。AIエージェント開発・システム開発・経営者向けAIスクールも提供。無料診断実施中。"
  },
  services: {
    title: "AI導入支援・AIエージェント開発・システム開発 | クラウドネイチャー（新潟）",
    description: "AI導入・伴走支援、AIエージェント開発、業務システム開発。新潟の中小企業の業務効率化・人手不足解消を、スモールスタートで実現します。"
  },
  cases: {
    title: "AI導入事例 | 新潟の中小企業でのAI活用実績・成果 | クラウドネイチャー",
    description: "新潟の中小企業でのAI導入事例。見積もり作成95%削減、コンテンツ制作工数80%削減など、業種別の具体的な成果をご紹介します。"
  },
  contact: {
    title: "AI導入の無料相談・お問い合わせ | クラウドネイチャー（新潟）",
    description: "AI導入・業務効率化の無料診断を実施中。「何から始めればいいか分からない」方もお気軽にご相談ください。オンライン相談30分で、AI活用の方向性をご提案します。"
  },
  privacy: {
    title: "プライバシーポリシー | 株式会社クラウドネイチャー",
    description: "個人情報の取り扱い方針についてご案内します。"
  },
  company: {
    title: "企業情報 | 株式会社クラウドネイチャー — 新潟のAI導入支援パートナー",
    description: "株式会社クラウドネイチャーの会社概要・代表メッセージ・アクセス情報。新潟の中小企業に寄り添うAI導入支援・伴走型パートナーです。"
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
    title: "お知らせ | 株式会社クラウドネイチャー — AI導入支援の最新情報",
    description: "CloudNatureの最新のお知らせ、AI導入事例、登壇実績、技術ブログをお届けします。"
  },
  servicesAiSupport: {
    title: "AI導入支援・伴走型コンサルティング | クラウドネイチャー（新潟）",
    description: "「何から始めればいいか分からない」を解決。無料診断で自動化できる業務を特定し、AI導入から運用定着まで伴走。経営者向けAIスクール・法人研修も提供。新潟の中小企業のAI業務効率化を支援します。"
  },
  servicesAiAgent: {
    title: "AIエージェント開発・チャットボット構築 | クラウドネイチャー（新潟）",
    description: "社内ナレッジAI、問い合わせ自動応答、SaaS間データ連携など、24時間365日稼働するAIエージェントを開発。LINE・Slack・kintone連携対応。新潟の中小企業の人手不足を根本から解決します。"
  },
  servicesSystemDev: {
    title: "業務システム開発・既存システム連携 | クラウドネイチャー（新潟）",
    description: "受発注管理・在庫管理・勤怠管理など、御社の業務に合わせたオーダーメイド開発。既存システムを活かしたAPI連携で、コストを抑えた段階的な業務効率化を実現します。"
  }
};
