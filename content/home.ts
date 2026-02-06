import { Code2, Bot, TrendingUp } from "lucide-react";
import { ServiceItem, CaseStudy, ValueProp } from "@/types";

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
  title: "「仕組み」が変われば、未来が変わる。",
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
  titleLines: ["失敗しないAI導入の", "はじめの一歩。"],
  description:
    "中小企業がAIエージェントを導入する際に陥りがちな罠と、成功への5つのステップをまとめた資料を無料で公開しています。",
  downloadTitle: "2025年版 中小企業のためのAIエージェント導入実践ガイド",
  downloadMeta: "PDF / 全24ページ / 最終更新 2025.04",
  primaryCta: "資料をダウンロード",
  secondaryCta: "無料診断を受ける",
};
