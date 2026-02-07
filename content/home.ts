import { ServiceItem, CaseStudy, ValueProp } from "@/types";

export const HERO_COPY = {
  imageSrc: "/images/hero-office.svg",
  badge: "AI時代における企業の開発パートナー",
  headingLine1: "新潟の中小企業に、",
  headingLine2: "人手に代わる仕組みを。",
  description:
    "人が足りない。でも、採用コストはかけられない。そんな企業の課題に、AIエージェントを活用した「即効性のある業務自動化」を提供します。無料診断で、あなたの会社の自動化余地をご提案。",
  primaryCta: "無料診断・相談",
  secondaryCta: "3分でわかるサービス",
  heroImageAlt: "Modern office collaboration"
};

export const HERO_BENTO = {
  caseBadge: "Case Study",
  caseTitle: "製造業DXの軌跡",
  caseDesc: "熟練工のナレッジをAI化し、新人教育コストを40%削減。",
  metricLabel: "IMPACT",
  aiCard: {
    title: "AI業務自動化\n成果物",
    description: "24時間稼働の「デジタル社員」。\nDify × n8n 等と連携し\n単純作業から高度な判断業務まで\nAIがあなたに代行",
    tags: ["Dify", "LINE", "Notion", "Gmail", "Slack"]
  },
  metricCard: {
    value: "2.5",
    unit: "x",
    description: "業務効率化の成果\n定型業務を自動化。\n残った80%を、創造化。\nより付加価値の高い営業や\n戦略立案へ"
  }
};

export const MISSION_COPY = {
  eyebrow: "OUR PROMISE",
  title: "人手に代わる、仕組みを届ける",
  paragraphs: [
    "中小企業が本当に必要としているのは、コンサルの提案書ではありません。",
    "明日から使える「システム」と「AIエージェント」、そして現場への定着支援です。",
    "CloudNatureは、作って終わりにしない、伴走型の開発パートナーです。"
  ]
};

export const VALUES: ValueProp[] = [
  {
    title: "VALUE 1: 実用本位のエンジニアリング",
    subtitle: "Practical Engineering",
    description: "「本当に必要な機能」だけを、適正価格で。大手が提案する高額なパッケージではなく、御社の業務フローに合わせた最小構成で開発します。結果、導入コストは半分以下、運用負担もゼロに近づけます。"
  },
  {
    title: "VALUE 2: 運用まで見据えた伴走",
    subtitle: "Sustainable Partnership",
    description: "導入後3ヶ月間の無料サポート、現場向けマニュアル作成、そして社員研修まで。「使われないシステム」を作らないために、CloudNatureは御社の一員として動きます。急なトラブルにも、新潟市内なら即日訪問対応が可能です。"
  },
  {
    title: "VALUE 3: 誠実な実装、確実な成果",
    subtitle: "Integrity & Results",
    description: "見積もりから納品まで、すべてのプロセスを明確にお伝えします。追加費用が発生する場合は必ず事前相談。新潟の企業様との長期的な信頼関係を、誠実な仕事の積み重ねで築きます。"
  }
];

export const SERVICES_SECTION = {
  eyebrow: "SOLUTIONS",
  title: "現場に最適なテクノロジー",
  cta: "全サービスを見る"
};

export const SERVICES: ServiceItem[] = [
  {
    id: "dev",
    title: "システム開発",
    description: "既存の業務システムはそのまま活かし、必要な機能だけを追加・連携。「全部作り直し」ではない、コストを抑えた段階的な開発を行います。",
    features: ["既存システムとのAPI連携", "業務管理Webアプリ開発", "データ分析基盤の構築"],
    techStack: ["Python（AI・分析）", "PHP（Web開発）", "React（高速UI）", "AWS（安定基盤）"]
  },
  {
    id: "ai",
    title: "AIエージェント開発",
    description: "導入最短2週間。Difyで作る「社内の物知りAI」。問い合わせ対応、マニュアル検索、見積もり作成など、今まで人がやっていた単純作業を24時間365日、AIが代行します。",
    features: ["社内ナレッジAIチャット", "予約・問い合わせ自動応答", "SaaS間のデータ自動連携"],
    techStack: ["Dify（AIチャット構築）", "n8n（業務自動化）", "OpenAI", "Gemini"]
  },
  {
    id: "dx",
    title: "DXサポート（伴走型）",
    description: "「何から始めればいいかわからない」を解決。現場ヒアリングから課題を可視化し、最もコスパの高い施策から段階的に導入。社員研修と定着支援まで一貫サポートします。",
    features: ["現場ヒアリング・課題の可視化", "社員向け導入研修・マニュアル整備", "データに基づく経営判断支援"],
    techStack: ["現状分析", "導入研修", "運用定着支援"]
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
    before: "熟練工の勘と経験に頼り、新人の教育に2年以上を要していた。",
    after: "熟練工の作業手順と判断基準をDifyに学習させ、新人がAIに質問しながら作業できる環境を構築。OJT期間が24ヶ月→14ヶ月に短縮、年間約360万円のコスト圧縮に成功。",
    image: "/images/case-1.svg"
  },
  {
    id: "service",
    title: "サービス業の完全自動化",
    category: "サービス業 × n8n",
    before: "予約管理からメール対応まですべて手作業。本来の接客業務が圧迫されていた。",
    after: "n8nで予約受付・リマインド送信・売上集計を完全自動化。オーナーの事務作業が週15時間→2時間に削減、接客と新メニュー開発に集中できる環境を実現。",
    image: "/images/case-2.svg"
  },
  {
    id: "municipality",
    title: "地域DX実証実験",
    category: "自治体 × Python",
    before: "観光需要の予測が難しく、繁忙期の交通渋滞や閑散期の機会損失が発生していた。",
    after: "過去5年分の観光データをPythonで分析し、AI需要予測モデルを構築。交通誘導の最適化で渋滞を30%緩和、閑散期のプロモーション精度も向上。",
    image: "/images/case-3.svg"
  }
];

export const CTA_BANNER = {
  eyebrow: "CONSULTATION",
  titleLines: ["会社の「自動化余地」を、", "30分で無料診断。"],
  description:
    "どの業務がAI化できるのか、導入コストはいくらか、何ヶ月で元が取れるのか——経営判断に必要な数字を、すべてお見せします。",
  downloadTitle: "2026年版 中小企業のためのAIエージェント導入実践ガイド",
  downloadMeta: "PDF / 全24ページ / 最終更新 2026.02",
  primaryCta: "無料診断を予約する",
  secondaryCta: "資料をダウンロード",
};
