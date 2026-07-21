import { CompanyInfo } from "@/types";

export const COMPANY_HERO = {
  eyebrow: "COMPANY",
  title: "企業情報",
  description:
    "新潟から、中小企業の未来を変えるテクノロジーを。クラウドネイチャーは、AI・システム開発で現場の課題を解決する伴走型パートナーです。",
};

export const COMPANY_OVERVIEW: CompanyInfo[] = [
  { label: "会社名", value: "株式会社クラウドネイチャー" },
  { label: "設立", value: "2026年4月" },
  { label: "代表者", value: "代表取締役 渡邉 浩平" },
  { label: "所在地", value: "〒951-8068 新潟県新潟市中央区上大川前通七番町1230番地7 ストークビル鏡橋 7F" },
  {
    label: "事業内容",
    value:
      "AIエージェント開発 / 業務システム開発 / AI活用支援 / Webアプリケーション開発",
  },
  {
    label: "主要技術",
    value: "Next.js / TypeScript / React / Python / AWS / Google Cloud / Claude / OpenAI",
  },
];

export const COMPANY_PROFILE_DOC = {
  label: "会社紹介資料（PDF）",
  description: "事業内容・サービス・実績をまとめた資料です。社内でのご検討にご活用ください。",
  href: "/docs/cloudnature-company-profile.pdf",
};

export const REPRESENTATIVE_MESSAGE = {
  eyebrow: "MESSAGE",
  title: "代表メッセージ",
  name: "渡邉 浩平",
  role: "代表取締役",
  paragraphs: [
    "「テクノロジーの恩恵を、すべての企業へ。」",
    "新潟のIT企業からキャリアをスタートし、その後は独立して東京・大阪の企業を中心に、数十万人が毎日使うサービスの開発や大手企業のシステム構築に携わってきました。約8年間、開発の現場に立ち続ける中で確信したのは、AIが企業の経営を根本から変える力を持つということです。AIやシステムの力は、まだ全ての企業に届いているわけではありません。もっとできることがあるはず。その想いを胸に、クラウドネイチャーを立ち上げました。",
  ]
};

export const COMPANY_ACCESS = {
  eyebrow: "ACCESS",
  title: "アクセス",
  postalCode: "〒951-8068",
  address: "新潟県新潟市中央区上大川前通七番町1230番地7 ストークビル鏡橋 7F",
  description: "新潟駅万代口より徒歩20分",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3147.378727701607!2d139.04604607589036!3d37.92158187194876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff4c9f21b684e13%3A0x1ab254c8d8886f9f!2z44CSOTUxLTgwNjgg5paw5r2f55yM5paw5r2f5biC5Lit5aSu5Yy65LiK5aSn5bed5YmN6YCa77yX55Wq55S677yR77yS77yT77yQ4oiS77yX!5e0!3m2!1sja!2sjp!4v1772406451398!5m2!1sja!2sjp",
};

export const COMPANY_MID_CTA = {
  text: "CloudNatureに相談してみませんか？",
  primaryLabel: "無料でAI見積もり",
  secondaryLabel: "お問い合わせ・ご相談",
};

export const COMPANY_CTA = {
  eyebrow: "GET STARTED",
  title: "まずはお気軽にご相談ください",
  description:
    "AIが概算費用を即時算出。または30分の無料ヒアリングで、御社の課題に最適な解決策をご提案します。",
  primaryCta: { label: "無料でAI見積もり", href: "https://ai.cloudnature.jp/" },
  secondaryCta: { label: "お問い合わせ・ご相談", href: "/contact" },
};
