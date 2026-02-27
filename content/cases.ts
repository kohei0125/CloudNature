import { CaseStudyDetail, FaqItem } from "@/types";

export const CASES_HERO = {
  eyebrow: "CASE STUDIES",
  title: "導入事例と数字で見る成果",
  description: "システム・AIエージェント導入事例。具体的な数値で成果をご紹介します。"
};

export const CASE_STUDY_DETAILS: CaseStudyDetail[] = [
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
    image: "/images/marketing.jpg"
  },
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
    link: { label: "AI見積もりを試す", href: "https://ai.cloudnature.jp/chat" },
    image: "/images/meeting.jpg"
  },
  {
    id: "wholesale",
    title: "卸売業の受発注DX",
    category: "卸売業 × AWS",
    client: "新潟県内 食品卸売業",
    challenge: "FAXと電話による受注対応で、聞き間違いや入力ミスが多発。事務員の残業が常態化し、月平均40時間の残業が発生していた。",
    solution: "AWSを活用したWeb受発注システムを構築。顧客が直接注文する仕組みにより、入力工数をゼロにし、リアルタイムの在庫確認も可能に。",
    results: [
      "受注入力工数を100%削減",
      "誤配送を完全解消",
      "事務員の残業を月40時間→5時間に",
      "取引先からの注文満足度アンケートが4.2→4.8に向上"
    ],
    quote: {
      text: "FAXの山と格闘していた日々が嘘のようです。お客様からも『注文しやすくなった』と好評です。",
      author: "業務部 課長",
      role: "食品卸売業"
    },
    image: "/images/office_room.jpg"
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
  primaryCta: { label: "無料でAI見積もり", href: "https://ai.cloudnature.jp/chat" },
  secondaryCta: { label: "お問い合わせ・ご相談", href: "/contact" }
};
