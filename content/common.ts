import { NavItem } from "@/types";

export const ESTIMATE_URL = "https://ai.cloudnature.jp/";
export const AI_DEV_URL = "https://ai-dev.cloudnature.jp/";

/**
 * サービスの表示順（TOP・サービス詳細ページ共通の正）。
 * システム開発 → AIエージェント開発 → AI導入・伴走支援 の順で表示する。
 */
export const SERVICE_ORDER: readonly string[] = ["dev", "ai", "ai-support"];

/** SERVICE_ORDER に従ってサービス配列を並べるための比較関数 */
export const byServiceOrder = (a: { id: string }, b: { id: string }) =>
  SERVICE_ORDER.indexOf(a.id) - SERVICE_ORDER.indexOf(b.id);

export const SITE_CTA = {
  primary: { label: "無料でAI見積もり", href: "https://ai.cloudnature.jp/" },
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
  { label: "サービス", path: "/services" },
  { label: "導入事例", path: "/cases" },
  { label: "AIガイド", path: "/usecases" },
  { label: "会社情報", path: "/company" },
  { label: "お知らせ", path: "/news" },
];

export const PAGE_META = {
  home: {
    title: "新潟のAI開発・AIエージェント開発会社 | 株式会社クラウドネイチャー",
    description:
      "新潟の中小企業向けAI開発会社。自律型AIエージェント開発・業務システム開発で人手不足を解決。スモールスタートと費用が見える見積もりで、初めてのAI開発でも伴走します。無料診断実施中。"
  },
  services: {
    title: "新潟のAIエージェント開発・システム開発・AI導入支援 | 株式会社クラウドネイチャー",
    description: "AIエージェント開発、業務システム開発、AI導入・伴走支援の3つのサービスで、新潟の中小企業の業務効率化・人手不足解消をスモールスタートで実現。開発費用の概算がその場で分かる無料のAI見積もりもご利用いただけます。"
  },
  cases: {
    title: "AI導入事例｜見積もり作成の工数を90%以上削減など中小企業の成果 | クラウドネイチャー",
    description: "見積もりAIで作成工数を1件あたり約1時間から90%以上削減、コンテンツ制作の工数削減など、新潟の中小企業で実際に成果が出たAI導入事例を、課題・解決策・数字つきでご紹介します。"
  },
  contact: {
    title: "AI導入の無料相談・お問い合わせ | 株式会社クラウドネイチャー",
    description: "AI導入・業務効率化の無料診断を実施中。「何から始めればいいか分からない」方もお気軽にご相談ください。オンライン相談30分で、AI活用の方向性をご提案します。"
  },
  privacy: {
    title: "プライバシーポリシー | 株式会社クラウドネイチャー",
    description: "株式会社クラウドネイチャーのプライバシーポリシー。個人情報の定義・収集方法・利用目的・第三者提供・管理、開示・訂正・削除の手続き、Cookieの使用についてご案内します。"
  },
  company: {
    title: "企業情報 | 株式会社クラウドネイチャー — 新潟のAI導入支援パートナー",
    description: "株式会社クラウドネイチャーの会社概要・代表メッセージ・アクセス情報。AI導入支援・AIエージェント開発・業務システム開発の3つのサービスで、新潟の中小企業に寄り添う伴走型パートナーです。"
  },
  security: {
    title: "情報セキュリティ方針 | 株式会社クラウドネイチャー",
    description: "株式会社クラウドネイチャーの情報セキュリティ方針。セキュリティ管理体制、技術的・物理的対策、開発プロセスにおけるセキュリティ、インシデント対応の取り組みを記載しています。"
  },
  terms: {
    title: "利用規約 | 株式会社クラウドネイチャー",
    description: "株式会社クラウドネイチャーの利用規約。サービスの内容と利用条件、AI見積もりに関する注意事項、知的財産権、個人情報の取り扱い、免責事項などについて定めています。"
  },
  news: {
    title: "お知らせ | 株式会社クラウドネイチャー — AI導入支援の最新情報",
    description: "株式会社クラウドネイチャーからのお知らせ一覧。AI活用セミナーの開催報告、イベントでの自社ツール活用、新サービスのリリース情報など、最新の取り組みをお届けします。"
  },
  servicesAiSupport: {
    title: "新潟のAI導入支援・伴走型コンサルティング | 株式会社クラウドネイチャー",
    description: "「何から始めればいいか分からない」を解決。無料診断で自動化できる業務を特定し、AI導入から運用定着まで伴走。経営者向けAIスクール・法人研修も提供。新潟の中小企業のAI業務効率化を支援します。"
  },
  servicesAiAgent: {
    title: "新潟のAIエージェント開発・チャットボット構築 | 株式会社クラウドネイチャー",
    description: "社内ナレッジAI、問い合わせ自動応答、SaaS間データ連携など、24時間365日稼働するAIエージェントを開発。LINE・Slack・kintone連携対応。新潟の中小企業の人手不足を根本から解決します。"
  },
  // このページが受けるのは「システム開発会社を探す」意図（新潟 システム開発会社 / 業務システム開発会社 /
  // システム開発 対応領域・保守 など）。費用・見積もり・相場の意図は ai.cloudnature.jp が受けるため、
  // ここでは会社・対応領域の語を前に出し、費用訴求は見積もりツールへの送客に留める。
  servicesSystemDev: {
    title: "新潟のシステム開発会社｜業務システム・既存システム連携 | 株式会社クラウドネイチャー",
    description: "新潟市を拠点に、業務に合わせたシステム開発を行う株式会社クラウドネイチャー。受発注管理・在庫管理・勤怠管理などのオーダーメイド開発から、既存システムとのAPI連携、リリース後の保守・運用まで対応します。対応領域と進め方、概算費用の調べ方をご案内します。"
  }
};
