import { CaseStudyDetail, KpiHighlight, FaqItem } from "@/types";

export const CASES_HERO = {
  eyebrow: "CASE STUDIES",
  title: "「仕組み」が変われば、未来が変わる。",
  description: "新潟の製造業・サービス業でのAIエージェント導入事例。具体的な数値で成果をご紹介します。"
};

export const KPI_HIGHLIGHTS: KpiHighlight[] = [
  { value: "80", unit: "%", label: "業務工数削減" },
  { value: "2.5", unit: "x", label: "生産性向上" },
  { value: "2", unit: "週間", label: "最短導入期間" }
];

export const KPI_NOTE = "※ 導入企業の実績に基づく数値です";

export const CASE_STUDY_DETAILS: CaseStudyDetail[] = [
  {
    id: "marketing-automation",
    title: "コンテンツマーケティングの自律的運営",
    category: "マーケティング × n8n / Dify",
    client: "新潟県内 マーケティング企業",
    challenge: "トレンドのリサーチから記事執筆まで全て手動で行い、更新頻度が低く内容も薄くなっていた。担当者は他業務との兼任で、月に2〜3本の記事作成が限界だった。",
    solution: "n8nでSNSや競合のトレンドを自律監視し、Difyで高品質な記事案を自動生成する仕組みを構築。担当者は生成された記事案のレビューと最終調整に集中できる体制に。",
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
    id: "hr-recruitment",
    title: "人事・採用業務の完全自動化",
    category: "人事・採用 × n8n / Dify",
    client: "新潟県内 中堅製造業",
    challenge: "月数百件の履歴書を手作業で確認。初期対応の遅れから、優秀な候補者を他社に逃す機会損失が発生していた。人事担当者は書類選考だけで週20時間を費やしていた。",
    solution: "AIエージェントが要件に基づき候補者を自動スコアリング。n8nで面接日程調整からリマインド送信まで完結する仕組みを構築。",
    results: [
      "スクリーニング工数を90%削減",
      "採用リードタイムを2週間→5日に短縮",
      "候補者への初期対応が24時間以内に",
      "採用担当者が面接と戦略に集中可能に"
    ],
    quote: {
      text: "以前は書類選考だけで丸一日かかっていましたが、今はAIが優先度をつけてくれるので、面接に集中できます。",
      author: "人事部長",
      role: "製造業"
    },
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
  primaryCta: { label: "無料でAI見積もり", href: "https://ai.cloudnature.jp" },
  secondaryCta: { label: "お問い合わせ・ご相談", href: "/contact" }
};
