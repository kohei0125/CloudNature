import { ServiceItem, CaseStudy, ValueProp, NewsItem, NewsCategory } from "@/types";

export const HERO_COPY = {
  imageSrc: "/images/niigata.jpeg",
  badge: "AI導入から運用まで伴走する開発パートナー",
  headingLine1: "AIトランスフォーメーションで",
  headingLine2: "人手に代わる仕組みを",
  description:
    "ビジネスも、生活も、AIが当たり前になる時代へ。\nAIを単に手法として捉えるのではなく、人とAIが共創する。\n御社のビジネスに、確かな変化を生み出します。",
  primaryCta: "最短1分でAIお見積り",
  secondaryCta: "お問い合わせ",
  heroImageAlt: "新潟の中小企業向けAI導入支援・業務自動化パートナー クラウドネイチャー"
};


export const MISSION_COPY = {
  eyebrow: "OUR PROMISE",
  title: "人手に代わる、仕組みを届ける",
  paragraphs: [
    "AIの進化は、誰も止めることのできないスピードで世界を書き換えています。",
    "一方で本質的なAI活用ができる企業は、まだ多くありません。",
    "この転換期を、誰よりも深く理解し、どこよりも早く提供する。",
    "それが私たちのミッションです。",
  ]
};

export const VALUES: ValueProp[] = [
  {
    title: "VALUE 1: スモールスタートで、確かな成果を",
    displayTitle: "スモールスタートで、確かな成果を",
    subtitle: "Start Small, Deliver Results",
    description: "大規模なDXプロジェクトにはしません。まず1つの業務から始めて、効果を確認してから広げる。御社の業務フローに合わせた最小構成で、導入コストを抑えながら確実に成果を出します。"
  },
  {
    title: "VALUE 2: 導入後も、使える状態になるまで伴走",
    displayTitle: "導入後も、使える状態になるまで伴走",
    subtitle: "Sustainable Partnership",
    description: "手順書・研修・例外対応まで含めて「運用が回る形」に。「使われないシステム」を作らないために、CloudNatureは御社の一員として動きます。急なトラブルにも、新潟市内なら即日訪問対応が可能です。"
  },
  {
    title: "VALUE 3: できること・できないことを、正直に伝える",
    displayTitle: "できること・できないことを、正直に伝える",
    subtitle: "Integrity & Trust",
    description: "AIで解決できる領域と、システム開発が必要な領域を正直にお伝えします。見積もりから納品まで、すべてのプロセスを明確に。新潟の企業様との長期的な信頼関係を、誠実な仕事の積み重ねで築きます。"
  }
];

export const SERVICES_SECTION = {
  eyebrow: "SOLUTIONS",
  title: "事業内容",
  cta: "全サービスを見る"
};

export const SERVICES: ServiceItem[] = [
  {
    id: "ai-support",
    title: "AI導入・伴走支援",
    description:
      "「何から始めればいいか分からない」から、「現場でAIが動いている」までを伴走。まずヒアリングで自動化できる業務を特定し、経営者向けAI支援、法人向け導入支援の2つのソリューションを提供します。",
    features: [
      "ヒアリングで自動化余地を診断",
      "法人向けAI導入コンサルティング・伴走支援",
      "経営者・社員向けAIセミナー・研修の実施"
    ],
    techStack: ["AI導入診断", "法人研修", "個別スクール", "オンライン対応"],
    ctaUrl: "https://niigata-ai-academy.com",
    ctaLabel: "新潟AIアカデミーを見る"
  },
  {
    id: "ai",
    title: "AIエージェント開発",
    description: "自律的に思考し、複数ツールを連携して業務を完遂する「優秀なデジタル社員」を開発します。見積作成から顧客対応、システムへのデータ入力まで、24時間365日ミスなく働く頼もしい右腕が、御社の人手不足を根本から解決します。",
    features: ["自律思考型AIエージェントの開発", "複数SaaSを横断した業務の完全自動化", "社内独自データの学習・専用AI構築"],
    techStack: ["AIエージェント構築", "業務自動化プラットフォーム", "OpenAI", "Gemini"]
  },
  {
    id: "dev",
    title: "システム開発",
    description: "新規システムのゼロからの構築はもちろん、既存の業務システムを活かした機能追加・連携まで幅広く対応。「全部作り直し」に縛られない、予算や課題に合わせた柔軟な開発をご提案します。",
    features: ["新規業務システム・Webアプリ開発", "既存システムへの機能追加・連携", "業務効率化・自動化システム"],
    techStack: ["Python", "PHP（Web開発）", "React（高速UI）", "AWS（安定基盤）"]
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
    id: "ai-estimate",
    title: "AI見積もりシステムの自社開発",
    category: "自社プロダクト × AI",
    before: "従来のシステム開発見積もりは、要件ヒアリングから概算提示まで数日〜数週間かかるのが業界の常識だった。",
    after: "チャット形式で13の質問に回答するだけで、AIが最適なシステム構成・概算費用を1分以内に自動算出。見積もり業務の工数を95%削減し、顧客体験を大幅に向上。",
    link: { label: "AI見積もりを試す", href: "https://ai.cloudnature.jp/" },
    image: "/images/meeting.jpg"
  },
  {
    id: "ai-lms",
    title: "AI学習管理システム",
    category: "教育 × AI",
    before: "研修や学習管理は外部の教材サービスに頼りきりで、自社に合った内容にカスタマイズできず、受講状況の把握も困難だった。",
    after: "動画講座の視聴・演習問題・理解度テストをワンストップで提供するプラットフォームを構築。AIが正答率や学習履歴から弱点を分析し、最適な復習コースを自動提案。管理工数を大幅に削減し、受講者の学習定着率も向上。",
    image: "/images/top_lms_banner.jpg"
  },
  {
    id: "marketing-automation",
    title: "AIによるコンテンツマーケティング業務の自動化",
    category: "マーケティング × AI自動化",
    before: "トレンドのリサーチから記事執筆まで全て手動で行い、更新頻度が低く内容も薄くなっていた。",
    after: "自動化ツールでSNSや競合のトレンドを自律監視し、AIで高品質な記事案を自動生成する仕組みを構築。執筆・投稿の工数を80%削減し、公開頻度が1.5倍、リーチ数も大幅に向上 。",
    image: "/images/marketing.jpg"
  }
];

export const NEWS_SECTION = {
  eyebrow: "Discover us",
  title: "お知らせ",
  cta: { label: "他の記事を見る", href: "/news" }
};

export const NEWS_CATEGORY_COLORS: Record<NewsCategory, string> = {
  "お知らせ": "bg-sage/20 text-sage",
  "事例紹介": "bg-sunset/20 text-sunset",
  "イベント": "bg-sea/20 text-sea",
  "メディア": "bg-cloud/20 text-forest",
  "ブログ": "bg-stone/20 text-forest",
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
  eyebrow: "CONSULTATION",
  titleLines: ["まずは、お気軽に", "ご相談ください。"],
  description:
    "AI導入の可能性や費用感について、30分の無料相談で率直にお話しします。",
  appealPoints: [
    "御社の業務をお伺いし、AI活用の方向性を整理",
    "費用感やスケジュールを率直にご説明",
    "無理な営業は一切いたしません"
  ],
  bookHighlights: [
    "AIエージェントの基礎知識",
    "費用対効果の算出方法",
    "失敗しないベンダー選定",
    "2026年最新導入事例"
  ],
  downloadTitle: "2026年版 中小企業のためのAIエージェント導入実践ガイド",
  primaryCta: "お問い合わせ",
  secondaryCta: "資料をダウンロード",
};
