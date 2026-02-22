import type { StepOption } from "@/types/estimate";

// ---------------------------------------------------------------------------
// Step messages (system chat bubbles)
// ---------------------------------------------------------------------------
export const STEP_MESSAGES: Record<
  number,
  { question: string; description: string }
> = {
  1: {
    question: "はじめまして。まず、御社の事業形態を教えてください。",
    description: "事業形態の選択",
  },
  2: {
    question: "ありがとうございます。御社の業種を教えてください。",
    description: "業種の選択",
  },
  3: {
    question: "システムを利用するユーザー数はどのくらいですか？",
    description: "利用予定人数の選択",
  },
  4: {
    question:
      "現在抱えている課題や、システムで解決したいことを教えてください。",
    description: "現在の課題・要望の入力",
  },
  5: {
    question: "システムの導入先はどちらを想定されていますか？",
    description: "導入先の選択",
  },
  6: {
    question: "どのようなシステムをお考えですか？",
    description: "システム種別の選択",
  },
  7: {
    question: "今回は新しくシステムを作りますか？それとも既存のシステムからの移行ですか？",
    description: "新規開発・移行の選択",
  },
  8: {
    question:
      "以下の機能候補から、必要と思われるものを選択してください。（複数選択可）",
    description: "機能候補の選択",
  },
  9: {
    question: "ご希望の導入時期はいつ頃ですか？",
    description: "導入時期の選択",
  },
  10: {
    question: "主にどのデバイスでご利用予定ですか？",
    description: "利用デバイスの選択",
  },
  11: {
    question: "ご予算の目安を教えてください。",
    description: "予算の選択",
  },
  12: {
    question:
      "その他、気になっていることやご要望があればお聞かせください。（任意）",
    description: "追加要望の入力",
  },
  13: {
    question:
      "最後に、お見積もり結果をお送りするための情報を入力してください。",
    description: "お名前・企業名・メールアドレスの入力",
  },
};

// ---------------------------------------------------------------------------
// Step options (static selects)
// ---------------------------------------------------------------------------
export const STEP_OPTIONS: Record<string, StepOption[]> = {
  businessType: [
    { value: "corporation", label: "法人（株式会社・合同会社等）" },
    { value: "sole_proprietor", label: "個人事業主" },
    { value: "other", label: "その他" },
  ],
  industry: [
    { value: "manufacturing", label: "製造業" },
    { value: "retail", label: "小売・卸売業" },
    { value: "construction", label: "建設・不動産業" },
    { value: "food_service", label: "飲食・宿泊業" },
    { value: "healthcare", label: "医療・福祉" },
    { value: "it_service", label: "IT・情報サービス業" },
    { value: "logistics", label: "物流・運輸業" },
    { value: "other", label: "その他" },
  ],
  userCount: [
    { value: "1-5", label: "1〜5名" },
    { value: "6-20", label: "6〜20名" },
    { value: "21-50", label: "21〜50名" },
    { value: "51-100", label: "51〜100名" },
    { value: "101+", label: "101名以上" },
  ],
  deploymentTarget: [
    { value: "internal", label: "自社利用（社員向け）" },
    { value: "client_b2b", label: "お客様提供用（B2B）" },
    { value: "client_b2c", label: "一般ユーザー向け（B2C）" },
    { value: "undecided", label: "未定" },
  ],
  systemType: [
    { value: "web_app", label: "WEBアプリ" },
    { value: "mobile_app", label: "スマホアプリ" },
    { value: "undecided_other", label: "決まっていない/その他" },
  ],
  developmentType: [
    { value: "new", label: "新規開発（ゼロから構築）" },
    { value: "migration", label: "既存システムからの移行・リプレイス" },
    { value: "enhancement", label: "既存システムの機能追加・改修" },
    { value: "undecided", label: "まだ決まっていない" },
  ],
  timeline: [
    { value: "asap", label: "できるだけ早く（1〜2ヶ月）" },
    { value: "3months", label: "3ヶ月以内" },
    { value: "6months", label: "半年以内" },
    { value: "1year", label: "1年以内" },
    { value: "undecided", label: "時期は未定" },
  ],
  device: [
    { value: "pc", label: "PC（デスクトップ）中心" },
    { value: "mobile", label: "スマートフォン中心" },
    { value: "both", label: "PC・スマートフォン両方" },
    { value: "tablet", label: "タブレット含む全デバイス" },
  ],
  budget: [
    { value: "under_500k", label: "50万円未満" },
    { value: "500k_1m", label: "50万円〜100万円" },
    { value: "1m_3m", label: "100万円〜300万円" },
    { value: "3m_5m", label: "300万円〜500万円" },
    { value: "5m_10m", label: "500万円〜1,000万円" },
    { value: "10m_plus", label: "1,000万円以上" },
    { value: "unknown", label: "わからない・未定" },
  ],
};

// ---------------------------------------------------------------------------
// Landing page copy
// ---------------------------------------------------------------------------
export const LP_COPY = {
  // ヒーロー
  hero: {
    eyebrow: "Next-Gen AI Estimate Platform",
    headingLine1: "相場の1/2でシステム開発",
    // headingLine2: "不確実なシステム開発コストを、",
    headingLine3: "最新AI活用で3分で見積",
    description:
      "過去の膨大なデータに基づき、ハイブリッドAIエージェントが最適なシステム構成を逆算。従来のSIerでは数週間を要する「要件定義・開発計画書」と「データに基づく見積もり」を最短3分で自動生成し、そのまま稟議書として活用可能です。",
    descriptionShort:
      "AIエージェントが最適なシステム構成を逆算し、見積もりから開発計画書まで最短3分で自動生成します。",
    cta: "無料で見積もりを始める",
    ctaMicro: "営業電話は一切ありません",
  },

  // シミュレーター（ヒーロー右側）
  simulator: {
    appTypes: [
      { label: "Webアプリ", baseCost: 80 },
      { label: "AIエージェント", baseCost: 110 },
      { label: "業務自動化", baseCost: 45 },
      { label: "モバイルアプリ", baseCost: 165 },
    ],
    scales: [
      { label: "小規模", sub: "〜50ユーザー", multiplier: 1 },
      { label: "中規模", sub: "50〜500", multiplier: 2 },
      { label: "大規模", sub: "500〜", multiplier: 3.5 },
    ],
    disclaimer: "※ 実際の費用はプロジェクト詳細により変動します",
  },

  // 選ばれる理由
  reasons: {
    eyebrow: "Why choose us",
    title: "なぜ、当社の見積もりは「安くて正確」なのか？",
    cards: [
      {
        number: "01",
        icon: "chart",
        title: "専門データ学習済みAIが正確に見積もり",
        subtitle: "データドリブンな精度",
        description:
          "開発実績データを学習したAIが、業種・規模・要件に応じた精度の高い概算を算出。勘や経験則に頼らない、データに裏付けされた見積もりを最短3分でお届けします。",
      },
      {
        number: "02",
        icon: "cpu",
        title: "最先端のAI活用で設計・開発の効率化",
        subtitle: "マルチエージェント要件分析",
        description:
          "複数の専門エージェントが並列で要件分析・技術選定・開発計画から実行まで、人間が数週間かける作業を圧倒的な効率で完了します。",
      },
      {
        number: "03",
        icon: "users",
        title: "中間マージンを排除し40%コスト削減",
        subtitle: "最適リソースの動的アサインメント",
        description:
          "AI要件定義の結果に基づき、最適な人材を自動マッチング。多重下請け構造を排除し、高品質と低価格を両立します。",
      },
    ],
  },

  // ご利用の流れ
  flow: {
    eyebrow: "How it works",
    title: "プロジェクトの進め方",
    steps: [
      {
        number: "01",
        title: "AI見積もり",
        description:
          "簡単な質問に答えるだけで、AIが最短3分で概算見積もりを自動生成。費用感をすぐに把握できます。",
      },
      {
        number: "02",
        title: "詳細ヒアリング",
        description:
          "オンラインでもOK。専門エンジニアがご要望を深掘り。要件を整理し、正式な見積もりと最適な開発プランをご提案します。",
      },
      {
        number: "03",
        title: "開発",
        description:
          "AIと専門エンジニアのハイブリッド体制で開発を進行。進捗は随時共有し、透明性の高いプロジェクト運営を行います。",
      },
      {
        number: "04",
        title: "納品",
        description:
          "テスト・検収を経て納品。運用開始後の保守・改善サポートもご用意しています。",
      },
    ],
  },

  // FAQ
  faq: {
    eyebrow: "FAQ",
    title: "よくあるご質問",
    items: [
      {
        q: "AI見積もりの精度はどの程度ですか？",
        a: "本サービスのAI見積もりは概算です。プロジェクトの方向性や予算感を素早く把握するためにご活用ください。詳細な見積もりは無料相談にて、ヒアリングのうえ作成いたします。",
      },
      {
        q: "費用は本当にかかりませんか？",
        a: "AI見積もりの生成は完全無料です。クレジットカードの登録も不要で、営業電話も一切ありません。詳細見積もりや開発のご相談も、初回は無料で承っています。",
      },
      {
        q: "どのようなシステムの見積もりに対応していますか？",
        a: "Webアプリ、モバイルアプリ、業務自動化、AIエージェント開発など幅広く対応しています。具体的な技術要件や特殊な要件がある場合は、無料相談にてご相談ください。",
      },
      {
        q: "見積もり後、開発を依頼しなくても大丈夫ですか？",
        a: "もちろんです。見積もり結果は社内検討やベンダー比較の材料としてご自由にお使いください。開発をご依頼いただくかどうかはお客様のご判断にお任せしています。",
      },
    ],
  },

  // ボトムCTA
  bottomCta: {
    heading: "最短3分でお見積。無料でお試しください。",
    cta: "無料で見積もりを始める",
    ctaSub: "営業電話一切なし",
  },

  // フッター
  footer: {
    taglineLines: [
      "新潟の中小企業に、人手に代わる仕組みを。",
      "AIと業務自動化で、現場を変える。",
      "開発から定着支援まで、伴走型でサポートします。",
    ],
    serviceHeading: "Service",
    companyHeading: "Company",
    serviceLinks: [
      { label: "システム開発", path: "https://cloudnature.jp/services" },
      { label: "AIエージェント開発", path: "https://cloudnature.jp/services" },
      { label: "AI活用支援", path: "https://cloudnature.jp/services" },
    ],
    companyLinks: [
      { label: "想い (Philosophy)", path: "https://cloudnature.jp/philosophy" },
      { label: "企業情報", path: "https://cloudnature.jp/company" },
      { label: "導入事例", path: "https://cloudnature.jp/cases" },
      { label: "プライバシーポリシー", path: "https://cloudnature.jp/privacy" },
      {
        label: "情報セキュリティ方針",
        path: "https://cloudnature.jp/security",
      },
    ],
    copyright: `© ${new Date().getFullYear()} CloudNature Co., Ltd. All Rights Reserved.`,
    badges: [
      { icon: "ShieldCheck" as const, label: "AI Guidelines" },
      { icon: "Check" as const, label: "GDPR Compliant" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Error messages
// ---------------------------------------------------------------------------
export const ERROR_MESSAGES = {
  required: "この項目は必須です",
  minLength: (min: number) => `${min}文字以上でご入力ください`,
  maxLength: (max: number) => `${max}文字以内でご入力ください`,
  invalidEmail: "有効なメールアドレスをご入力ください",
  selectRequired: "いずれかを選択してください",
  multiSelectRequired: "1つ以上選択してください",
  networkError: "通信エラーが発生しました。もう一度お試しください。",
  serverError: "サーバーエラーが発生しました。しばらくしてからお試しください。",
  sessionExpired: "セッションが期限切れです。最初からやり直してください。",
};

// ---------------------------------------------------------------------------
// Common labels
// ---------------------------------------------------------------------------
export const COMMON_LABELS = {
  progress: {
    step: "ステップ",
    of: "/",
    complete: "完了",
  },
  navigation: {
    next: "次へ",
    back: "戻る",
    submit: "送信する",
    skip: "スキップ",
    startOver: "最初からやり直す",
  },
  consent: {
    label:
      "プライバシーポリシーに同意の上、見積もりを送信します。",
    privacyLink: "プライバシーポリシー",
    required: "同意が必要です",
  },
  result: {
    title: "お見積もり結果",
    generating: "お見積もりを作成中です...",
    downloadPdf: "PDFをダウンロード",
    requestMeeting: "無料相談を予約する",
    standardModel: "従来型開発",
    hybridModel: "AIハイブリッド開発",
    totalLabel: "概算合計",
    taxNote: "※ 税別表示",
    disclaimer:
      "本見積もりはAIによる概算です。正式なお見積もりは別途ご相談ください。",
  },
};

// ---------------------------------------------------------------------------
// AI processing messages
// ---------------------------------------------------------------------------
export const AI_MESSAGES = {
  generatingQuestion: "AIがあなた専用の質問を作成中...",
  generatingOptions: "貴社に最適な選択肢を分析中...",
  generatingFeatures: "機能候補を選定中です...",
  generatingEstimate: "お見積もりを作成中です。少々お待ちください...",
  estimateReady: "お見積もりが完成しました。",
  error: "エラーが発生しました。もう一度お試しください。",
};
