import { Code2, Bot, TrendingUp, ShieldCheck, Check } from "lucide-react";
import { NavItem, ServiceItem, CaseStudy, ValueProp } from "@/types";

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

export const HEADER_COPY = {
  brand: "CloudNature",
  consultation: "無料相談",
  mobilePrompt: "お急ぎの方はこちら",
  mobileButton: "無料相談を予約する"
};

export const HERO_COPY = {
  imageSrc: "/images/hero-office.svg",
  badge: "2026 STRATEGIC PARTNER",
  headingLine1: "事業に効く",
  headingLine2: "システム開発を",
  description:
    "人手不足という「不自由」からの解放。最新のAIエージェントと、地に足のついたシステム開発で、地方企業の組織を「強く、しなやか」に変革します。",
  primaryCta: "無料診断・相談",
  secondaryCta: "3分でわかるサービス",
  heroImageAlt: "Modern office collaboration"
};

export const HERO_BENTO = {
  caseBadge: "Case Study",
  caseTitle: "製造業DXの軌跡",
  caseDesc: "熟練工のナレッジをAI化し、教育コストを40%削減。",
  aiCardTitleLines: ["AI Agent", "Architecture"],
  metricLabel: "Impact",
  metricValue: "2.5",
  metricUnit: "x",
  metricDesc: "Dify導入による\n業務効率化実績"
};

export const MISSION_COPY = {
  eyebrow: "OUR PROMISE",
  title: "人手に代わる、仕組みを届ける",
  paragraphs: [
    "現代の企業が求めているのは、抽象的なアドバイスではありません。",
    "現場の痛みを直接取り除く、具体的な「システム」と「AI」の実装です。",
    "CloudNatureは、3つの価値観で信頼に応えます。"
  ]
};

export const VALUES: ValueProp[] = [
  {
    title: "VALUE 1: 実用本位のエンジニアリング",
    subtitle: "Practical Engineering",
    description: "流行に左右されず、現場で「本当に役立つ」ことを最優先する技術的誠実さ。オーバースペックな開発を避け、現時点での最適解を提案します。"
  },
  {
    title: "VALUE 2: 運用まで見据えた伴走",
    subtitle: "Sustainable Partnership",
    description: "作って終わりにしない、小規模組織ならではのフットワークと徹底した定着支援。現場への浸透まで責任を持ちます。"
  },
  {
    title: "VALUE 3: 誠実な実装、確実な成果",
    subtitle: "Integrity & Results",
    description: "納期と品質の厳守。当たり前のことを高いレベルで積み重ねることで得られる地域からの信頼を大切にします。"
  }
];

export const SERVICES_SECTION = {
  eyebrow: "SOLUTIONS",
  title: "現場最適のテクノロジー実装",
  cta: "全サービスを見る"
};

export const SERVICES: ServiceItem[] = [
  {
    id: "dev",
    title: "システム開発",
    description: "「資産としてのシステム」を構築。複雑な業務ロジックも堅牢に実装します。",
    icon: Code2,
    features: ["AI・データ解析連携", "大規模Webアプリ", "既存CMS連携"],
    techStack: ["Python", "PHP", "React", "AWS"]
  },
  {
    id: "ai",
    title: "AIエージェント開発",
    description: "Dify/n8nを活用した即効性のある業務改善。社内ナレッジの即時回答やAPI連携を実現。",
    icon: Bot,
    features: ["社内チャットボット", "SaaS間連携自動化", "自律型エージェント"],
    techStack: ["Dify", "n8n", "OpenAI", "Gemini"]
  },
  {
    id: "dx",
    title: "DXサポート（伴走型）",
    description: "ツール導入だけでなく、組織文化の変革を含めた支援。デジタイゼーションからトランスフォーメーションへ。",
    icon: TrendingUp,
    features: ["現状分析・課題抽出", "導入研修・定着支援", "データ活用経営"],
    techStack: ["Consulting", "Training", "Analytics"]
  }
];

export const CASES_SECTION = {
  eyebrow: "CASE STUDIES",
  title: "成果で語る、共創の記録",
  cta: "事例をもっと見る",
  labels: {
    before: "Before:",
    after: "After:"
  }
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "manufacturing",
    title: "製造業における人手不足解消",
    category: "製造業 × Dify",
    before: "熟練工の勘に頼り、新人の教育に2年を要していた。",
    after: "ナレッジをAI化し、新人教育コストを40%削減。即戦力化を実現。",
    image: "/images/case-1.svg"
  },
  {
    id: "service",
    title: "サービス業の完全自動化",
    category: "サービス業 × n8n",
    before: "予約管理からメール対応まで手動で行い、本来の業務が圧迫されていた。",
    after: "予約・リマインド・集計を全自動化。オーナーの現場改善時間を創出。",
    image: "/images/case-2.svg"
  },
  {
    id: "municipality",
    title: "地域DX実証実験",
    category: "自治体 × Python",
    before: "観光需要の予測が難しく、交通渋滞や機会損失が発生していた。",
    after: "AI需要予測により交通最適化を実現。観光満足度が向上。",
    image: "/images/case-3.svg"
  }
];

export const CTA_BANNER = {
  eyebrow: "CONSULTATION",
  titleLines: ["人手不足からの解放へ。", "まずは30分の無料相談で、", "課題を整理しませんか？"],
  description:
    "現場の業務フロー、既存システム、社内リソースを踏まえ、最短の打ち手をご提案します。技術的な質問だけでも歓迎です。",
  primaryCta: "無料で相談する",
  secondaryCta: "サービス資料をダウンロード",
  bullets: ["最短2週間で導入", "データ連携対応", "現場目線のUX"],
  sideBadge: "Regional DX Support",
  sideTitle: "「仕組み」で、地域の企業を強くする。\n伴走型で、成果までやり切ります。",
  sideDescription: "導入後の運用・内製化までサポートし、属人化を解消。"
};

export const FOOTER_COPY = {
  taglineLines: [
    "「仕組み」で、現場を変える。",
    "AI時代を共に歩む、あなたのITパートナー。",
    "システム開発からDX伴走支援まで、誠実にサポートします。"
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

export const PLACEHOLDER_COPY = {
  description: "現在、このページは準備中です。ホームに戻ってサービスの詳細をご覧ください。",
  back: "ホームへ戻る"
};

export const AI_COPY = {
  initial: "こんにちは。株式会社クラウドネイチャーのAIコンシェルジュです。業務自動化やDXについて、お困りのことはありませんか？",
  placeholderReply: "AI応答は現在準備中です。お問い合わせは無料相談ボタンまたはフォームからお願いいたします。",
  inputPlaceholder: "例：自動化の事例を知りたい",
  typingNote: "AIは誤った情報を生成する可能性があります。"
};

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
