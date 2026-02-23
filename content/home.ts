import { ServiceItem, CaseStudy, ValueProp, NewsItem, NewsCategory } from "@/types";

export const HERO_COPY = {
  imageSrc: "/images/niigata_city.jpg",
  badge: "AI時代における企業の開発パートナー",
  headingLine1: "新潟の中小企業に、",
  headingLine2: "人手に代わる仕組みを。",
  description:
    "人が足りない。でも、採用コストはかけられない。そんな企業の課題に、システム・AIエージェントを活用した「即効性のある業務自動化」を提供します。無料診断で、あなたの会社の自動化余地をご提案。",
  primaryCta: "最短1分でAIお見積り",
  secondaryCta: "お問い合わせ",
  heroImageAlt: "Modern office collaboration"
};

export const HERO_BENTO = {
  caseBadge: "Case Study",
  caseTitle: "営業DX：ナレッジ展開と商談自動化",
  caseDesc: "トップ営業のノウハウをAI化し、商談後の付帯業務を80%削減。",
  metricLabel: "IMPACT",
  aiCard: {
    description: "24時間稼働の「デジタル社員」。\nAIや各種ツールと連携し\n単純作業から高度な判断業務まで\nAIがあなたに代行",
    tags: ["AI", "LINE", "Notion", "Gmail", "Slack"]
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
    displayTitle: "実用本位のエンジニアリング",
    subtitle: "Practical Engineering",
    description: "「本当に必要な機能」だけを、適正価格で。大手が提案する高額なパッケージではなく、御社の業務フローに合わせた最小構成で開発します。結果、導入コストは半分以下、運用負担もゼロに近づけます。"
  },
  {
    title: "VALUE 2: 運用まで見据えた伴走",
    displayTitle: "運用まで見据えた伴走",
    subtitle: "Sustainable Partnership",
    description: "導入後の運用サポート、現場向けマニュアル作成、そして社員研修まで。「使われないシステム」を作らないために、CloudNatureは御社の一員として動きます。急なトラブルにも、新潟市内なら即日訪問対応が可能です。"
  },
  {
    title: "VALUE 3: 誠実な実装、確実な成果",
    displayTitle: "誠実な実装、確実な成果",
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
    description: "新規システムのゼロからの構築はもちろん、既存の業務システムを活かした機能追加・連携まで幅広く対応。「全部作り直し」に縛られない、予算や課題に合わせた柔軟な開発をご提案します。",
    features: ["新規業務システム・Webアプリ開発", "既存システムへの機能追加・連携", "業務効率化・自動化システム"],
    techStack: ["Python", "PHP（Web開発）", "React（高速UI）", "AWS（安定基盤）"]
  },
  {
    id: "ai",
    title: "AIエージェント開発",
    description: "自律的に思考し、複数ツールを連携して業務を完遂する「優秀なデジタル社員」を開発します。見積作成から顧客対応、システムへのデータ入力まで、24時間365日ミスなく働く頼もしい右腕が、御社の人手不足を根本から解決します。",
    features: ["自律思考型AIエージェントの開発", "複数SaaSを横断した業務の完全自動化", "社内独自データの学習・専用AI構築"],
    techStack: ["AIエージェント構築", "業務自動化プラットフォーム", "OpenAI", "Gemini"]
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
  title: "導入事例と数字で見る成果",
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
    category: "マーケティング × AI自動化",
    before: "トレンドのリサーチから記事執筆まで全て手動で行い、更新頻度が低く内容も薄くなっていた。",
    after: "自動化ツールでSNSや競合のトレンドを自律監視し、AIで高品質な記事案を自動生成する仕組みを構築。執筆・投稿の工数を80%削減し、公開頻度が1.5倍、リーチ数も大幅に向上 。",
    image: "/images/marketing.jpg"
  },
  {
    id: "hr-recruitment",
    title: "人事・採用業務の完全自動化",
    category: "人事・採用 × AI自動化",
    before: "月数百件の履歴書を手作業で確認。初期対応の遅れから、優秀な候補者を他社に逃す機会損失が発生していた。",
    after: "AIエージェントが要件に基づき候補者を自動スコアリング。自動化ツールで面接日程調整からリマインド送信まで完結。スクリーニング工数を90%削減し、採用リードタイムを平均2週間から5日に短縮することに成功 。",
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

export const NEWS_SECTION = {
  eyebrow: "Discover us",
  title: "ニュース",
  cta: { label: "他の記事を見る", href: "/news" }
};

export const NEWS_CATEGORY_COLORS: Record<NewsCategory, string> = {
  "ニュース": "bg-sage/20 text-sage",
  "事例紹介": "bg-sunset/20 text-sunset",
  "イベント": "bg-sea/20 text-sea",
  "メディア": "bg-cloud/20 text-forest",
  "ブログ": "bg-stone/20 text-forest",
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "company-established",
    publishedAt: "2025-11-01",
    category: "ニュース",
    title: "株式会社クラウドネイチャーを設立しました",
    excerpt: "新潟の中小企業のDX・AI活用を支援するため、株式会社クラウドネイチャーを設立いたしました。",
    url: "/news/company-established",
    image: "https://picsum.photos/seed/cloudnature-1/600/400"
  },
  {
    id: "ai-estimate-release",
    publishedAt: "2026-01-15",
    category: "ニュース",
    title: "AI見積もりシステムをリリースしました",
    excerpt: "チャット形式で要件を伝えるだけで、AIが最適なシステム構成と概算費用を自動算出するサービスを公開しました。",
    url: "/news/ai-estimate-release",
    image: "https://picsum.photos/seed/cloudnature-2/600/400"
  },
  {
    id: "case-marketing-automation",
    publishedAt: "2026-02-01",
    category: "事例紹介",
    title: "コンテンツマーケティング自動化の導入事例を公開",
    excerpt: "AIと自動化ツールを活用し、記事執筆工数を80%削減した事例をご紹介します。",
    url: "/news/case-marketing-automation",
    image: "https://picsum.photos/seed/cloudnature-3/600/400"
  },
  {
    id: "seminar-ai-intro",
    publishedAt: "2026-02-10",
    category: "イベント",
    title: "中小企業向けAI活用セミナーを開催します",
    excerpt: "「AIって何から始めればいい？」を解決する、未経験者向けの無料セミナーを新潟市で開催します。",
    url: "/news/seminar-ai-intro",
    image: "https://picsum.photos/seed/cloudnature-4/600/400"
  },
  {
    id: "media-nikkei",
    publishedAt: "2026-02-15",
    category: "メディア",
    title: "日経クロステックにAI見積もりシステムが掲載されました",
    excerpt: "当社のAI見積もりシステムが、日経クロステックの「注目スタートアップ」特集に掲載されました。",
    url: "/news/media-nikkei",
    image: "https://picsum.photos/seed/cloudnature-5/600/400"
  },
  {
    id: "blog-dify-tips",
    publishedAt: "2026-02-20",
    category: "ブログ",
    title: "最新AIツールで業務AIチャットボットを作る5つのコツ",
    excerpt: "ノーコードAI開発ツールを使って、社内FAQボットを構築するためのベストプラクティスを紹介します。",
    url: "/news/blog-dify-tips",
    image: "https://picsum.photos/seed/cloudnature-6/600/400"
  },
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
  primaryCta: "お問い合わせ",
  secondaryCta: "資料をダウンロード",
};
