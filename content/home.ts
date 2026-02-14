import { ServiceItem, CaseStudy, ValueProp } from "@/types";

export const HERO_COPY = {
  imageSrc: "/images/niigata_city.jpg",
  badge: "AI時代における企業の開発パートナー",
  headingLine1: "新潟の中小企業に、",
  headingLine2: "人手に代わる仕組みを。",
  description:
    "人が足りない。でも、採用コストはかけられない。そんな企業の課題に、システム・AIエージェントを活用した「即効性のある業務自動化」を提供します。無料診断で、あなたの会社の自動化余地をご提案。",
  primaryCta: "無料診断・相談",
  secondaryCta: "3分でわかるサービス",
  heroImageAlt: "Modern office collaboration"
};

export const HERO_BENTO = {
  caseBadge: "Case Study",
  caseTitle: "営業DX：ナレッジ展開と商談自動化",
  caseDesc: "トップ営業のノウハウをAI化し、商談後の付帯業務を80%削減。",
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
    description: "導入後の運用サポート、現場向けマニュアル作成、そして社員研修まで。「使われないシステム」を作らないために、CloudNatureは御社の一員として動きます。急なトラブルにも、新潟市内なら即日訪問対応が可能です。"
  },
  {
    title: "VALUE 3: 誠実な実装、確実な成果",
    subtitle: "Integrity & Results",
    description: "見積もりから納品まで、すべてのプロセスを明確にお伝えします。追加費用が発生する場合は必ず事前相談。新潟の企業様との長期的な信頼関係を、誠実な仕事の積み重ねで築きます。"
  }
];

export const SERVICES_SECTION = {
  eyebrow: "SOLUTIONS",
  title: "事業内容",
  cta: "全サービスを見る"
};

export const SERVICES: ServiceItem[] = [
  {
    id: "dev",
    title: "システム開発",
    description: "既存の業務システムはそのまま活かし、必要な機能だけを追加・連携。「全部作り直し」ではない、コストを抑えた段階的な開発を行います。",
    features: ["既存システムとのAPI連携", "業務管理Webアプリ開発", "業務効率化・自動化システム"],
    techStack: ["Python", "PHP（Web開発）", "React（高速UI）", "AWS（安定基盤）"]
  },
  {
    id: "ai",
    title: "AIエージェント開発",
    description: "導入最短2週間。Difyで作る「社内の物知りAI」。問い合わせ対応、マニュアル検索、見積もり作成など、今まで人がやっていた単純作業を24時間365日、AIが代行します。",
    features: ["社内ナレッジAIチャット", "予約・問い合わせ自動応答", "SaaS間のデータ自動連携"],
    techStack: ["Dify（AIチャット構築）", "n8n（業務自動化）", "OpenAI", "Gemini"]
  },
  {
    id: "ai-training",
    title: "AI活用支援",
    description:
      "「AIを使いたいけど、何から始めれば？」を最短1ヶ月で解決。未経験の社員でも資料作成時間を3時間→30分に短縮した実績あり。セミナー・個別スクール・法人研修で、御社に最適なAI人材育成を実現します。",
    features: [
      "未経験から最短1ヶ月でAI業務活用スキルを習得",
      "法人向けAIセミナー・社員研修の実施",
      "受講後の継続サポートと全額返金保証"
    ],
    techStack: ["セミナー", "個別スクール", "法人研修", "オンライン対応"],
    ctaUrl: "https://niigata-ai-academy.com",
    ctaLabel: "新潟AIアカデミーを見る"
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
    id: "marketing-automation",
    title: "コンテンツマーケティングの自律的運営",
    category: "マーケティング × n8n / Dify",
    before: "トレンドのリサーチから記事執筆まで全て手動で行い、更新頻度が低く内容も薄くなっていた。",
    after: "n8nでSNSや競合のトレンドを自律監視し、Difyで高品質な記事案を自動生成する仕組みを構築。執筆・投稿の工数を80%削減し、公開頻度が1.5倍、リーチ数も大幅に向上 。",
    image: "/images/marketing.jpg"
  },
  {
    id: "hr-recruitment",
    title: "人事・採用業務の完全自動化",
    category: "人事・採用 × n8n / Dify",
    before: "月数百件の履歴書を手作業で確認。初期対応の遅れから、優秀な候補者を他社に逃す機会損失が発生していた。",
    after: "AIエージェントが要件に基づき候補者を自動スコアリング。n8nで面接日程調整からリマインド送信まで完結。スクリーニング工数を90%削減し、採用リードタイムを平均2週間から5日に短縮することに成功 。",
    image: "/images/meeting.jpg"
  },
  {
    id: "wholesale",
    title: "卸売業の受発注DX",
    category: "卸売業 × AWS",
    before: "FAXと電話による受注対応で、聞き間違いや入力ミスが多発。事務員の残業が常態化していた。",
    after: "AWSを活用したWeb受発注システムを構築。顧客が直接注文する仕組みにより入力工数をゼロにし、誤配送も完全に解消。",
    image: "/images/office_room.jpg"
  }
];

export const CTA_BANNER = {
  eyebrow: "CONSULTATION",
  titleLines: ["会社の「自動化余地」を、", "30分で無料診断。"],
  description:
    "どの業務がAI化できるのか、導入コストはいくらか、何ヶ月で元が取れるのか——経営判断に必要な数字を、すべてお見せします。",
  appealPoints: [
    "御社の業務から「自動化できる工程」を特定",
    "導入コストと回収期間を具体的に試算",
    "最適な技術スタックと導入ステップをご提案"
  ],
  bookHighlights: [
    "AIエージェントの基礎知識",
    "費用対効果の算出方法",
    "失敗しないベンダー選定",
    "2026年最新導入事例"
  ],
  downloadTitle: "2026年版 中小企業のためのAIエージェント導入実践ガイド",
  downloadMeta: "PDF / 全24ページ / 最終更新 2026.02",
  primaryCta: "無料診断を予約する",
  secondaryCta: "資料をダウンロード",
};
