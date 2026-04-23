import { ServiceItem, CaseStudy, ValueProp, NewsItem, NewsCategory } from "@/types";

export const HERO_COPY = {
  imageSrc: "/images/niigata.jpeg",
  badge: "AI導入から運用まで伴走する開発パートナー",
  headingLine1: "AIトランスフォーメーションで",
  headingLine2: "人手に代わる仕組みを",
  description:
    "AIとクラウド技術を活用し、業務の自動化・効率化を実現するソリューションを提供します。ビジネスに、確かな変化を生み出します。",
  primaryCta: "最短1分でAIお見積り",
  secondaryCta: "お問い合わせ",
  heroImageAlt: "新潟の中小企業向けAI導入支援・業務自動化パートナー クラウドネイチャー"
};


export const MISSION_COPY = {
  eyebrow: "OUR VALUE",
  titleLine1: "人手に代わる、",
  titleLine2: "仕組みを届ける",
  paragraphs: [
    "AIの進化は、業務のあり方そのものを変えています。",
    "CloudNatureは、現場の課題に寄り添い、",
    "実現可能なAI・自動化ソリューションを提供します。",
    "",
    "「何から始めればいいか分からない」という声に、",
    "私たちは具体的な一歩を一緒に考え、",
    "導入から定着まで伴走します。",
  ],
  link: { label: "私たちの想いを見る", href: "/company" },
};

export const VALUES: ValueProp[] = [
  {
    title: "VALUE 1: スモールスタートで、確かな成果を",
    displayTitle: "スモールスタートで、確かな成果を",
    subtitle: "Start Small, Deliver Results",
    description: "小さく始めて早く効果を実感できるプロジェクト設計を提案します。"
  },
  {
    title: "VALUE 2: 導入後も、使える状態になるまで伴走",
    displayTitle: "導入後も、使える状態になるまで伴走",
    subtitle: "Sustainable Partnership",
    description: "運用定着まで支援し、実務に根づく仕組みとして定着させます。"
  },
  {
    title: "VALUE 3: できることからはじめて、正解に近づける",
    displayTitle: "できることからはじめて、正解に近づける",
    subtitle: "Integrity & Trust",
    description: "段階的に改善を重ね、最適な形へと進化していく支援を行います。"
  }
];

export const SERVICES_SECTION = {
  eyebrow: "SERVICE",
  title: "サービス内容",
  cta: "すべてのサービスを見る"
};

export const SERVICES: ServiceItem[] = [
  {
    id: "dev",
    title: "システム開発",
    description: "AIやクラウドを活用した業務システムの受託開発を行います。",
    features: ["新規業務システム・Webアプリ開発", "既存システムへの機能追加・連携", "業務効率化・自動化システム"],
    techStack: ["業務システム", "Webアプリ", "クラウド"]
  },
  {
    id: "ai",
    title: "AIエージェント開発",
    description: "業務を自動化・効率化するAIエージェントを設計・開発します。",
    features: ["自律思考型AIエージェントの開発", "複数SaaSを横断した業務の完全自動化", "社内独自データの学習・専用AI構築"],
    techStack: ["業務自動化", "RAG", "業務連携"]
  },
  {
    id: "ai-support",
    title: "AI導入・伴走支援",
    description: "業務分析からAI活用の設計、導入・運用までを一貫してサポートします。",
    features: [
      "ヒアリングで自動化余地を診断",
      "法人向けAI導入コンサルティング・伴走支援",
      "経営者・社員向けAIセミナー・研修の実施"
    ],
    techStack: ["業務分析", "AI戦略設計", "導入支援"],
    ctaUrl: "https://niigata-ai-academy.com",
    ctaLabel: "新潟AIアカデミーを見る"
  }
];

export const CASES_SECTION = {
  eyebrow: "CASE STUDY",
  titleLine1: "導入事例",
  description: "さまざまな業種・業務での導入実績と、\n具体的な成果をご紹介します。",
  cta: "事例を見る",
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "ai-estimate",
    title: "AI見積もりシステムの自動連携",
    category: "製造業",
    before: "",
    after: "見積作成にかかる時間を80%削減。ヒューマンエラーも同時に実現。",
    link: { label: "AI見積もりを試す", href: "https://ai.cloudnature.jp/" },
    image: "/images/meeting.jpg"
  },
  {
    id: "ai-lms",
    title: "AI学習管理システム",
    category: "サービス業",
    before: "",
    after: "研修の属人化を解消し、学習成果の可視化と管理工数も大幅に削減。",
    link: { label: "事例を見る", href: "/cases" },
    image: "/images/top_lms_banner.jpg"
  },
  {
    id: "marketing-automation",
    title: "AIによるコンテンツ・デザイン提案の自動化",
    category: "小売業",
    before: "",
    after: "コンテンツ制作を自動化し、CTRを改善。投稿内容やデザインのパターンも分析",
    link: { label: "事例を見る", href: "/cases" },
    image: "/images/marketing.jpg"
  }
];

export const NEWS_SECTION = {
  eyebrow: "NEWS",
  title: "お知らせ",
  cta: { label: "一覧を見る", href: "/news" }
};

export const NEWS_CATEGORY_COLORS: Record<NewsCategory, string> = {
  "お知らせ": "bg-teal-100 text-teal-800",
  "事例紹介": "bg-amber-100 text-amber-800",
  "イベント": "bg-violet-100 text-violet-800",
  "メディア": "bg-sky-100 text-sky-800",
  "ブログ": "bg-emerald-100 text-emerald-800",
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "company-established",
    publishedAt: "2025-11-01",
    category: "お知らせ",
    title: "株式会社クラウドネイチャーを設立しました",
    excerpt: "新潟の中小企業のDX・AI活用を支援するため、株式会社クラウドネイチャーを設立いたしました。",
    url: "/news/company-established",
    image: "/images/og-img.jpg"
  },
  {
    id: "ai-estimate-release",
    publishedAt: "2026-01-15",
    category: "お知らせ",
    title: "AI見積もりシステムをリリースしました",
    excerpt: "チャット形式で要件を伝えるだけで、AIが最適なシステム構成と概算費用を自動算出するサービスを公開しました。",
    url: "/news/ai-estimate-release",
    image: "/images/og-img.jpg"
  },
  {
    id: "case-marketing-automation",
    publishedAt: "2026-02-01",
    category: "事例紹介",
    title: "コンテンツマーケティング自動化の導入事例を公開",
    excerpt: "AIと自動化ツールを活用し、記事執筆工数を80%削減した事例をご紹介します。",
    url: "/news/case-marketing-automation",
    image: "/images/og-img.jpg"
  },
  {
    id: "seminar-ai-intro",
    publishedAt: "2026-02-10",
    category: "イベント",
    title: "中小企業向けAI活用セミナーを開催します",
    excerpt: "「AIって何から始めればいい？」を解決する、未経験者向けの無料セミナーを新潟市で開催します。",
    url: "/news/seminar-ai-intro",
    image: "/images/og-img.jpg"
  },
  {
    id: "media-nikkei",
    publishedAt: "2026-02-15",
    category: "メディア",
    title: "日経クロステックにAI見積もりシステムが掲載されました",
    excerpt: "当社のAI見積もりシステムが、日経クロステックの「注目スタートアップ」特集に掲載されました。",
    url: "/news/media-nikkei",
    image: "/images/og-img.jpg"
  },
  {
    id: "blog-dify-tips",
    publishedAt: "2026-02-20",
    category: "ブログ",
    title: "最新AIツールで業務AIチャットボットを作る5つのコツ",
    excerpt: "ノーコードAI開発ツールを使って、社内FAQボットを構築するためのベストプラクティスを紹介します。",
    url: "/news/blog-dify-tips",
    image: "/images/og-img.jpg"
  },
];

export const CTA_BANNER = {
  title: "お気軽にご相談ください",
  description: "AI活用の最適解を、貴社の課題に合わせてご提案いたします。まずはお気軽にご相談ください。",
  primaryCta: "お問い合わせ",
  secondaryCta: "資料をダウンロード",
};

export const AI_GUIDES_SECTION = {
  eyebrow: "AI GUIDES",
  title: "AI導入のヒント・実践ガイド",
};

export const AI_GUIDES_ITEMS = [
  {
    id: "ai-agent-intro",
    title: "AIエージェントとは？中小企業で活用する方法",
    category: "基礎知識",
    image: "/images/og-img.jpg",
    url: "/usecases/ai-agent-intro",
  },
  {
    id: "cost-reduction",
    title: "AI導入で業務コストを削減する5つのステップ",
    category: "実践ガイド",
    image: "/images/og-img.jpg",
    url: "/usecases/cost-reduction",
  },
  {
    id: "chatbot-building",
    title: "社内FAQチャットボットの作り方と運用のコツ",
    category: "技術解説",
    image: "/images/og-img.jpg",
    url: "/usecases/chatbot-building",
  },
  {
    id: "dx-first-step",
    title: "DX推進の第一歩：まず何から始めるべきか",
    category: "基礎知識",
    image: "/images/og-img.jpg",
    url: "/usecases/dx-first-step",
  },
];
