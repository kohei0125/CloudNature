import { CompanyInfo } from "@/types";

/**
 * ヒーロー画像の候補。
 * COMPANY_HERO.image の参照先を `HERO_IMAGES.main` / `HERO_IMAGES.sub` に
 * 書き換えるだけでヒーローの画像を切り替えられる。
 */
const HERO_IMAGES = {
  /** メイン: 人物なしのオフィス */
  main: {
    src: "/images/company/office-hero.webp",
    alt: "観葉植物と大きな窓のある明るいオフィスの会議スペース",
  },
  /** サブ: 3人で打ち合わせをする人物あり版 */
  sub: {
    src: "/images/company/office-hero-sub.webp",
    alt: "観葉植物のある明るいオフィスで、ノートパソコンを囲んで打ち合わせをする3人のスタッフ",
  },
};

/** ヒーロー：見出し＋説明＋フルワイド画像 */
export const COMPANY_HERO = {
  eyebrow: "COMPANY",
  title: "AIを、経営のど真ん中へ",
  description:
    "クラウドネイチャーは、自社の経営と業務にAIを実装しながら、その知見を企業の現場へ届ける新潟の開発会社です。構想だけで終わらせず、システム開発・AIエージェント開発・導入支援を通じて、実際に使われるところまで伴走します。",
  image: HERO_IMAGES.main, // ← `.main` を `.sub` に変えると人物あり版に切り替え
};

/** OUR PURPOSE：存在意義 */
export const COMPANY_PURPOSE = {
  eyebrow: "OUR PURPOSE",
  title: "一部の先進企業だけのものにしない",
  paragraphs: [
    "AIの導入が進まない理由は、技術がないからだけではありません。",
    "どの業務に使うのか、既存の仕事とどう接続するのか、誰が運用するのかが整理されていないことが、多くの企業にとっての障壁です。",
    "私たちは、企業ごとの業務や組織に向き合い、AIを現場で機能する仕組みに変えていきます。",
  ],
};

/** AI WORKSPACE：社内のAI活用基盤 */
export const COMPANY_WORKSPACE = {
  eyebrow: "AI WORKSPACE",
  title: "AIとともに働く日常",
  description:
    "特定のツールに依存せず、業務ごとに最適なAIを選び、組み合わせ、仕組みとして定着させています。",
  diagramLabel: "業務を支える主なAIツール",
  image: {
    src: "/images/company/ai-workspace.webp",
    alt: "CloudNature AI Workspaceを中心に、Notion・Claude・ChatGPT・GCP・GitHub・Slackなどの社内AIツールがつながる構成図",
    width: 1672,
    height: 941,
  },
};

/** 代表メッセージ */
export const COMPANY_MESSAGE = {
  eyebrow: "MESSAGE",
  title: "テクノロジーを、\n現場で使われる力に",
  name: "渡邉 浩平",
  role: "代表取締役",
  image: {
    src: "/images/company/office-message.webp",
    alt: "窓辺のデスクに置かれたノートパソコンと観葉植物",
  },
  paragraphs: [
    "新潟のIT企業でキャリアを始め、その後、東京・大阪の企業を中心に、大規模サービスや業務システムの開発に携わってきました。",
    "開発の現場に立ち続ける中で感じたのは、優れた技術があっても、それだけでは企業の仕事は変わらないということです。業務を理解し、既存の仕組みと接続し、現場で使われる状態までつくる必要があります。",
    "AIも同じです。導入すること自体ではなく、営業・開発・管理・意思決定といった日々の仕事を、実際に前へ進めることに価値があります。",
    "クラウドネイチャーは、自社でもAIを徹底的に活用しながら、そこで得た知見をお客様の業務に合わせて実装します。新潟から、AIを経営の当たり前にする会社を増やしていきます。",
  ],
};

/** 会社概要（左: テーブル / 右: 日本地図） */
export const COMPANY_OVERVIEW_HEADING = {
  eyebrow: "COMPANY INFO",
  title: "会社概要",
};

export const COMPANY_OVERVIEW: CompanyInfo[] = [
  { label: "会社名", value: "株式会社クラウドネイチャー" },
  { label: "代表者", value: "渡邉 浩平" },
  {
    label: "所在地",
    value: "〒951-8068 新潟県新潟市中央区上大川前通七番町1230番地7 ストークビル鏡橋 7F",
  },
  { label: "事業内容", value: "システム開発 / AIエージェント開発 / AI導入伴走支援" },
];

/** 会社概要の右側に表示するドットマップ（スクリプト生成SVG、新潟にアクセント。PCのみ表示） */
export const COMPANY_MAP = {
  src: "/images/company/japan-dots.svg",
  alt: "新潟県新潟市の位置を示す日本のドットマップ",
  width: 640,
  height: 711,
};

export const COMPANY_PROFILE_DOC = {
  label: "会社紹介資料（PDF）",
  description: "事業内容・サービス・実績をまとめた資料です。社内でのご検討にご活用ください。",
  href: "/docs/cloudnature-company-profile.pdf",
};

/** 下部CTA */
export const COMPANY_CTA = {
  eyebrow: "GET STARTED",
  title: "まずはお気軽にご相談ください",
  description:
    "AIの活用方法や開発のご相談など、お気軽にお問い合わせください。御社の課題に合わせて、最適な進め方をご提案します。",
  primaryCta: { label: "お問い合わせ", href: "/contact" },
  secondaryCta: { label: "サービスを見る", href: "/services" },
};
