import { CaseStudyDetail, FaqItem } from "@/types";

export const CASES_HERO = {
  eyebrow: "CASE STUDIES",
  title: "導入事例と数字で見る成果",
  description: "システム・AIエージェント導入事例。具体的な数値で成果をご紹介します。"
};

export const CASE_STUDY_DETAILS: CaseStudyDetail[] = [
  {
    id: "ai-estimate",
    title: "AI見積もりシステムの自社開発",
    category: "自社プロダクト × AI",
    client: "株式会社CloudNature（自社プロダクト）",
    challenge: "システム開発の見積もりは、要件ヒアリング・構成検討・費用算出に数日〜数週間を要するのが業界の常識。顧客は「まず概算が知りたい」のに、その段階で大きな時間コストが発生していた。",
    solution: "チャット形式の13ステップで要件をヒアリングし、AIが要件分析・機能提案・費用算出を1分以内に自動実行するシステムを自社開発。17カテゴリの価格モデルと7つの補正係数による高精度な見積もりエンジンを搭載。",
    results: [
      "見積もり作成時間を数日→1分に短縮",
      "17業務カテゴリ・8業種に対応",
      "AIハイブリッド開発で相場の40%コスト削減を実現",
      "PDF見積書の自動生成・即時メール送付"
    ],
    quote: {
      text: "概算だけでも数日待つのが当たり前だと思っていました。1分で見積もりが届いたときは正直驚きました。",
      author: "利用企業 経営者",
      role: "IT企業"
    },
    link: { label: "AI見積もりを試す", href: "https://ai.cloudnature.jp/" },
    image: "/images/meeting.jpg",
    relatedServiceIds: ["ai-support", "ai", "dev"]
  },
  {
    id: "ai-lms",
    title: "AI学習管理システム",
    category: "教育 × AI",
    client: "新潟県内 研修サービス企業",
    challenge: "研修や学習管理は外部の教材サービスに頼りきりで、自社の業務に合った内容にカスタマイズできなかった。受講状況の把握も難しく、誰がどこまで学習したか分からないまま研修期間が終わるケースも多かった。",
    solution: "動画講座の視聴・演習問題・理解度テストをワンストップで提供するプラットフォームを構築。受講者はブラウザ上で動画を視聴し、セクションごとの演習問題を解きながら実践的に学習。AIが正答率や学習履歴から弱点を自動分析し、一人ひとりに最適な復習コースを提案する仕組みを実現。",
    results: [
      "研修管理工数を大幅に削減",
      "研修完了率が大幅に向上",
      "受講者満足度が改善",
      "動画視聴＋演習のオンライン完結で受講の場所・時間の制約を解消"
    ],
    quote: {
      text: "動画を見て、すぐに問題を解ける仕組みが社員に好評です。AIが苦手分野を自動で出題してくれるので、全員がしっかり理解してから次に進めるようになりました。",
      author: "人事部 部長",
      role: "研修サービス企業"
    },
    image: "/images/lms_banner.jpg",
    imageMobile: "/images/top_lms_banner.jpg",
    relatedServiceIds: ["ai-support", "ai", "dev"]
  },
  {
    id: "marketing-automation",
    title: "コンテンツマーケティングの自律的運営",
    category: "マーケティング × AI自動化",
    client: "新潟県内 マーケティング企業",
    challenge: "トレンドのリサーチから記事執筆まで全て手動で行い、更新頻度が低く内容も薄くなっていた。担当者は他業務との兼任で、月に2〜3本の記事作成が限界だった。",
    solution: "自動化ツールでSNSや競合のトレンドを自律監視し、AIで高品質な記事案を自動生成する仕組みを構築。担当者は生成された記事案のレビューと最終調整に集中できる体制に。",
    results: [
      "執筆・投稿の工数を80%削減",
      "公開頻度が月3本→月8本に向上",
      "リーチ数が3ヶ月で2倍に増加",
      "担当者が戦略立案に集中可能に"
    ],
    quote: {
      text: "AIが下書きしてくれるので、私は戦略を考える時間が大幅に増えました。記事の品質も以前より上がっています。",
      author: "マーケティング担当",
      role: "マーケティング企業"
    },
    image: "/images/marketing.jpg",
    relatedServiceIds: ["ai-support", "ai"]
  }
];

export const CASES_INLINE_CTA = {
  title: "御社でも同じ成果を実現できるか、確認しませんか？",
  primaryLabel: "無料でAI見積もり",
  secondaryLabel: "お問い合わせ・ご相談"
};

export const CASES_CTA = {
  eyebrow: "NEXT STEP",
  title: "平均80%の工数削減を、御社でも",
  description: "事例でご紹介したような成果を、御社でも実現できるか——AIが概算費用を即時算出します。",
  primaryCta: { label: "無料でAI見積もり", href: "https://ai.cloudnature.jp/" },
  secondaryCta: { label: "お問い合わせ・ご相談", href: "/contact" }
};
