import { CaseStudyDetail } from "@/types";

// 本ページは「顧客導入事例」ではなく、当社が自社開発したAI・システムの実績ページ。
// 掲載方針（数値の根拠・quote の扱い・CLIENT PROJECTS 追加条件）は
// docs/20260827_cases_page_restructure_review.md を参照。

export const CASES_HERO = {
  eyebrow: "OUR WORK",
  title: "開発・AI活用実績",
  description: "自社の業務課題に対して、自分たちでAIを設計・開発しています。ここで紹介するのは、すべて当社が自社開発したシステムです。"
};

export const CASES_INTERNAL_SECTION = {
  eyebrow: "INTERNAL PROJECTS",
  title: "自社の課題のために、自分たちで開発したAI"
};

export const CASE_STUDY_DETAILS: CaseStudyDetail[] = [
  {
    id: "ai-estimate",
    title: "AI見積もりシステム",
    category: "自社開発 × 見積もり業務",
    client: "自社開発",
    challenge: "システム開発の見積もりは、要件ヒアリング・構成検討・費用算出を人手で行うため、1件あたり約1時間を要していた。お客様は「まず概算が知りたい」だけなのに、その段階で双方に時間コストが発生していた。",
    solution: "チャット形式の13ステップでお客様自身に要件を入力していただき、AIが要件分析・機能提案・費用算出を自動実行するシステムを自社開発。17カテゴリの価格モデルと7つの補正係数で概算を算出する。",
    results: [
      "1件あたり約1時間かかっていた見積もり作成を数分に短縮（当社実測・90%以上の工数削減）",
      "17業務カテゴリ・8業種の価格モデルに対応",
      "PDF見積書の自動生成から即時メール送付までを自動化"
    ],
    status: "ai.cloudnature.jp で稼働中のものをそのまま公開しています。画面と出力結果はその場でご確認いただけます。",
    link: { label: "AI見積もりを試す", href: "https://ai.cloudnature.jp/" },
    image: "/images/meeting.jpg",
    relatedServiceIds: ["ai-support", "ai", "dev"]
  },
  {
    id: "ai-lms",
    title: "AI学習管理システム",
    category: "自社開発 × 研修・学習管理",
    client: "自社開発",
    challenge: "研修や学習管理を外部の教材サービスに頼ると、自分たちの業務に合った内容にカスタマイズできない。誰がどこまで進んでいるかも見えないまま研修期間が終わってしまう。この課題を自分たちで解くために開発した。",
    solution: "動画講座の視聴・演習問題・理解度テストをワンストップで提供するプラットフォームを構築。受講者はブラウザ上で動画を視聴し、セクションごとの演習問題を解きながら実践的に学習する。AIが正答率や学習履歴から弱点を分析し、一人ひとりに合わせた復習コースを提案する仕組みを実装した。",
    results: [
      "動画視聴・演習問題・理解度テストをブラウザ上でワンストップ提供",
      "正答率と学習履歴からAIが弱点を判定し、復習コースを自動で提案",
      "受講状況をセクション単位で可視化し、進捗把握の手作業を不要に",
      "オンライン完結のため、受講の場所・時間の制約を解消"
    ],
    image: "/images/lms_banner.jpg",
    imageMobile: "/images/top_lms_banner.jpg",
    relatedServiceIds: ["ai-support", "ai", "dev"]
  }
];

export const CASES_INLINE_CTA = {
  title: "同じ仕組みを御社の業務に置き換えられるか、確認しませんか？",
  primaryLabel: "無料でAI見積もり",
  secondaryLabel: "お問い合わせ・ご相談"
};

export const CASES_CTA = {
  eyebrow: "NEXT STEP",
  title: "御社の業務でどこまで任せられるか、確かめる",
  description: "どの業務をAIに任せられるかは、業務の性質によって変わります。まずはAIが概算費用を算出します。",
  primaryCta: { label: "無料でAI見積もり", href: "https://ai.cloudnature.jp/" },
  secondaryCta: { label: "お問い合わせ・ご相談", href: "/contact" }
};
