import { CompanyInfo } from "@/types";

export const COMPANY_HERO = {
  eyebrow: "COMPANY",
  title: "企業情報",
  description:
    "新潟から、中小企業の未来を変えるテクノロジーを。CloudNatureは、AI・システム開発で現場の課題を解決する伴走型パートナーです。",
};

export const COMPANY_OVERVIEW: CompanyInfo[] = [
  { label: "会社名", value: "株式会社クラウドネイチャー" },
  { label: "代表者", value: "代表取締役 ○○ ○○" },
  { label: "所在地", value: "〒950-0000 新潟県新潟市中央区○○○ ○-○-○" },
  { label: "設立", value: "2024年○月" },
  { label: "資本金", value: "○○○万円" },
  {
    label: "事業内容",
    value:
      "AIエージェント開発 / 業務システム開発 / AI活用支援 / Webアプリケーション開発",
  },
  {
    label: "主要技術",
    value: "Next.js / React / TypeScript / Python / AI・自動化 / AWS",
  },
  { label: "取引銀行", value: "○○銀行 ○○支店" },
];

export const REPRESENTATIVE_MESSAGE = {
  eyebrow: "MESSAGE",
  title: "代表メッセージ",
  name: "○○ ○○",
  role: "代表取締役",
  paragraphs: [
    "「技術は、使われてこそ価値がある。」",
    "新潟のIT企業で数年間、その後東京・大阪と複数の企業で、数十万人が利用するサービスの開発や大手企業のプロジェクトに携わってきました。その中で痛感したのは、どれだけ優れた技術も、現場で使われなければ意味がないということです。",
    "地元の中小企業の方々とお話しする中で、人手不足という深刻な課題に直面しました。しかし同時に、AIやシステムの力で解決できる余地が大きいことにも気づきました。",
    "CloudNatureは、「作って終わり」にしない開発会社です。現場に足を運び、課題を理解し、本当に使われるシステムを一緒に作り上げる。そして導入後も、定着するまで伴走し続けます。",
    "新潟の中小企業が、テクノロジーの力でもっと強くなれる。その確信を胸に、一社一社に真剣に向き合ってまいります。",
  ],
};

export const COMPANY_ACCESS = {
  eyebrow: "ACCESS",
  title: "アクセス",
  postalCode: "〒950-0000",
  address: "新潟県新潟市中央区○○○ ○-○-○",
  description: "新潟駅万代口より徒歩○分",
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
  primaryCta: { label: "無料でAI見積もり", href: "https://ai.cloudnature.jp/chat" },
  secondaryCta: { label: "お問い合わせ・ご相談", href: "/contact" },
};
