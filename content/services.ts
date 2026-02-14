import { ServiceDetail, FlowStep, PricingItem, FaqItem } from "@/types";
import { ESTIMATE_URL } from "@/content/common";

export const SERVICES_HERO = {
  eyebrow: "SOLUTIONS",
  title: "御社に最適なテクノロジーを、適正価格で",
  description: "大手が提案する高額パッケージではなく、本当に必要な機能だけを。新潟の中小企業の現場を知るからこそ、実用本位のソリューションを提供します。"
};

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: "dev",
    title: "システム開発",
    subtitle: "System Development",
    description: "既存の業務システムはそのまま活かし、必要な機能だけを追加・連携。「全部作り直し」ではなく、コストを抑えた段階的な開発で、御社の業務効率を飛躍的に向上させます。",
    features: [
      { title: "既存システムとのAPI連携", description: "今お使いのシステムを壊さず、新機能をつなげます。データの二重入力をゼロにし、業務フローをシームレスに。" },
      { title: "業務管理Webアプリ開発", description: "受発注、在庫管理、勤怠管理など、御社の業務に合わせたオーダーメイドのWebアプリを開発します。" },
      { title: "業務効率化・自動化システム", description: "手作業で行っていたデータ入力、帳票作成、メール送信などを自動化。ヒューマンエラーを削減し、生産性を向上。" }
    ],
    techStack: ["Python", "PHP", "React", "AWS"],
    accentColor: "sage",
    image: "/images/services/system_dev.png"
  },
  {
    id: "ai",
    title: "AIエージェント開発",
    subtitle: "AI Agent Development",
    description: "導入最短2週間。Difyで作る「社内の物知りAI」。問い合わせ対応、マニュアル検索、見積もり作成など、今まで人がやっていた単純作業を24時間365日、AIが代行します。",
    features: [
      { title: "社内ナレッジAIチャット", description: "社内マニュアルやFAQをAIに学習させ、社員からの質問に即座に回答。新人教育コストを大幅に削減します。" },
      { title: "予約・問い合わせ自動応答", description: "LINE・Webチャットからの問い合わせにAIが24時間対応。予約受付から確認メール送信まで全自動化。" },
      { title: "SaaS間のデータ自動連携", description: "n8nを活用し、Slack・Gmail・Notion・kintoneなど各種SaaSを自動連携。データの手動転記を完全に撲滅します。" }
    ],
    techStack: ["Dify", "n8n", "OpenAI", "Gemini"],
    accentColor: "sunset",
    image: "/images/services/ai_agent.png"
  },
  {
    id: "ai-training",
    title: "AI活用支援",
    subtitle: "AI Training & Academy",
    description:
      "「AIを導入したいが、社員が使いこなせるか不安」——その課題を、新潟AIアカデミーが解決します。未経験者でも最短1ヶ月でAI業務活用スキルを習得。資料作成3時間→30分、年収15%アップなど、受講者から具体的な成果が出ています。",
    features: [
      {
        title: "法人向けAIセミナー・研修",
        description:
          "にいがたAIサミットをはじめ、御社向けのカスタマイズ研修を実施。経営層から現場社員まで、レベルに合わせたプログラムで全社的なAIリテラシーを底上げします。"
      },
      {
        title: "個別スクール（通学・オンライン対応）",
        description:
          "AI入門・業務効率化特化・AIプログラミングの3コースをプロ講師がマンツーマン指導。新潟市古町校・女池校またはZoomで受講可能。全額返金保証付き。"
      },
      {
        title: "受講後の継続サポート・キャリア支援",
        description:
          "スキルを身につけて終わりにしません。受講後も継続的なサポートと、AIスキルを活かせる仕事の紹介で、学びを確実に成果につなげます。"
      }
    ],
    techStack: ["セミナー", "個別スクール", "法人研修", "オンライン対応"],
    accentColor: "sea",
    image: "/images/services/dx_support.png",
    externalUrl: "https://niigata-ai-academy.com"
  }
];

export const IMPLEMENTATION_FLOW: FlowStep[] = [
  { step: 1, title: "無料ヒアリング", description: "御社の課題・要望を丁寧にお伺いし、自動化の余地を診断します。" },
  { step: 2, title: "ご提案・お見積り", description: "最適な解決策と明確な費用・スケジュールをご提示します。" },
  { step: 3, title: "設計・プロトタイプ", description: "画面設計と動くプロトタイプで、完成イメージを具体的にお見せします。" },
  { step: 4, title: "開発・テスト", description: "2週間ごとの進捗報告で安心。品質を確保しながら着実に開発します。" },
  { step: 5, title: "導入・研修", description: "本番環境への導入と、現場向けの操作研修を実施します。" },
  { step: 6, title: "運用・定着支援", description: "導入後の運用サポートも万全。トラブル対応もお任せください。" }
];

export const PRICING_APPROACH: PricingItem[] = [
  { title: "明確な見積もり", description: "「作ってみないとわからない」は言いません。要件定義後に詳細な見積もりを提示し、追加費用が発生する場合は必ず事前にご相談します。" },
  { title: "段階的な導入", description: "いきなり大規模投資をお願いすることはありません。最小限のスタートで効果を確認してから、段階的に拡張していきます。" },
  { title: "適正価格の約束", description: "大手SIerの半額以下を目指します。高額なライセンス費用や、不要な機能への課金はありません。必要な機能だけを、適正価格でご提供します。" }
];

export const SERVICES_MID_CTA = {
  title: "概算費用をすぐに知りたい方へ",
  description: "AIが御社の要件をヒアリングし、概算見積もりを即時生成します。",
  primaryCta: { label: "無料でAI見積もり", href: ESTIMATE_URL },
  secondaryCta: { label: "お問い合わせ・ご相談", href: "/contact" },
};

export const SERVICES_BOTTOM_CTA = {
  title: "御社の課題、お聞かせください",
  description: "AIが概算費用を即時算出。または30分の無料ヒアリングで、最適な解決策をご提案します。",
  primaryCta: { label: "無料でAI見積もり", href: ESTIMATE_URL },
  secondaryCta: { label: "お問い合わせ・ご相談", href: "/contact" },
};

export const SERVICES_FAQ: FaqItem[] = [
  {
    question: "既存のシステムとの連携は可能ですか？",
    answer: "はい、API連携やデータベース連携で、既存システムを活かしたまま新機能を追加できます。主要なSaaS（kintone、Salesforce、freeeなど）との連携実績もあります。"
  },
  {
    question: "AIを導入すると、社員の仕事がなくなりませんか？",
    answer: "AIが代替するのは「単純な繰り返し作業」です。社員の方はより付加価値の高い業務（顧客対応、企画、戦略立案など）に集中できるようになります。人を減らすのではなく、人の力を最大化するのが目的です。"
  },
  {
    question: "開発中に仕様変更は可能ですか？",
    answer: "はい、2週間ごとの進捗報告の際にフィードバックをいただき、柔軟に対応します。ただし、大幅な仕様変更の場合は追加費用・期間についてご相談させていただきます。"
  },
  {
    question: "保守・運用のサポートはありますか？",
    answer: "導入後も月額保守契約でバグ修正、機能追加のご相談、サーバー監視などを継続サポートいたします。"
  },
  {
    question: "セキュリティ対策はどうなっていますか？",
    answer: "SSL暗号化、定期的なセキュリティアップデート、アクセス制御など、業界標準のセキュリティ対策を標準で実施します。個人情報を扱うシステムでは、追加のセキュリティ要件にも対応可能です。"
  }
];
