import { ServiceDetail, FlowStep, PricingItem, FaqItem } from "@/types";
import { ESTIMATE_URL } from "@/content/common";

export const SERVICE_PAGE_MAP: Record<string, { title: string; path: string }> = {
  "ai-support": { title: "AI導入・伴走支援", path: "/services/ai-support" },
  "ai": { title: "AIエージェント開発", path: "/services/ai-agent" },
  "dev": { title: "システム開発", path: "/services/system-dev" },
};

export const SERVICES_HERO = {
  eyebrow: "SOLUTIONS",
  title: "必要な分だけ、確かな技術を",
  description: "大手が提案する高額パッケージではなく、本当に必要な機能だけを。中小企業の現場にマッチした、実用本位のソリューションを提供します。"
};

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: "ai-support",
    title: "AI導入・伴走支援",
    subtitle: "AI Consulting & Support",
    description:
      "「何から始めればいいか分からない」——その状態から、「現場でAIが動いている」までを伴走します。まず無料診断で自動化できる業務を特定。その後は経営者向けスクールまたは法人導入伴走の2つのパスで、御社に最適なAI活用を実現します。",
    features: [
      {
        title: "無料AI診断・導入コンサルティング",
        description:
          "30分のヒアリングで御社の業務から「自動化できる工程」を特定。導入コストと回収期間を具体的に試算し、最適なスタート地点をご提案します。"
      },
      {
        title: "法人向けAIセミナー・研修",
        description:
          "にいがたAIサミットをはじめ、御社向けのカスタマイズ研修を実施。経営層から現場社員まで、レベルに合わせたプログラムで全社的なAIリテラシーを底上げします。"
      },
      {
        title: "個別スクール（通学・オンライン対応）",
        description:
          "AI入門・業務効率化特化・AIプログラミングの3コースをプロ講師がマンツーマン指導。新潟市古町校・女池校またはZoomで受講可能。全額返金保証付き。"
      }
    ],
    techStack: ["AI導入診断", "法人研修", "個別スクール"],
    accentColor: "sea",
    image: "/images/services/dx_support.png",
    externalUrl: "https://niigata-ai-academy.com"
  },
  {
    id: "ai",
    title: "AIエージェント開発",
    subtitle: "AI Agent Development",
    description: "導入最短2週間。最新AIで作る「社内の物知りAI」。問い合わせ対応、マニュアル検索、見積もり作成など、今まで人がやっていた単純作業を24時間365日、AIが代行します。",
    features: [
      { title: "社内ナレッジAIチャット", description: "社内マニュアルやFAQをAIに学習させ、社員からの質問に即座に回答。新人教育コストを大幅に削減します。" },
      { title: "予約・問い合わせ自動応答", description: "LINE・Webチャットからの問い合わせにAIが24時間対応。予約受付から確認メール送信まで全自動化。" },
      { title: "SaaS間のデータ自動連携", description: "n8nを活用し、Slack・Gmail・Notion・kintoneなど各種SaaSを自動連携。データの手動転記を完全に撲滅します。" }
    ],
    techStack: ["Google ADK", "Mastra", "Dify", "n8n", "OpenAI", "Claude"],
    accentColor: "sunset",
    image: "/images/services/ai_agent.png"
  },
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
  }
];

export const IMPLEMENTATION_FLOW: FlowStep[] = [
  { step: 1, title: "無料ヒアリング", description: "御社の課題・要望を丁寧にお伺いし、自動化の余地を診断します。" },
  { step: 2, title: "ご提案・お見積り", description: "最適な解決策と明確な費用・スケジュールをご提示します。" },
  { step: 3, title: "設計・プロトタイプ", description: "画面設計と動くプロトタイプで、完成イメージを具体的にお見せします。" },
  { step: 4, title: "開発・テスト", description: "定期的な進捗共有で安心。品質を確保しながら着実に開発します。" },
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
    answer: "AIは単純作業だけでなく、文章作成・データ分析・意思決定支援など幅広い業務をサポートできます。社員の方はAIを活用しながら、より創造的な業務や人にしかできない判断に集中できるようになります。人を減らすのではなく、人の力を最大化するのが目的です。"
  },
  {
    question: "開発中に仕様変更は可能ですか？",
    answer: "はい、定期的な進捗共有の際にフィードバックをいただき、柔軟に対応します。ただし、大幅な仕様変更の場合は追加費用・期間についてご相談させていただきます。"
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

export const AI_SUPPORT_FAQ: FaqItem[] = [
  {
    question: "AI導入は何から始めればいいですか？",
    answer: "まずは無料診断（約30分）で、御社の業務から「AI化できる工程」を特定します。大規模な計画は不要で、1つの業務から小さく始めて効果を確認するスモールスタートをおすすめしています。"
  },
  {
    question: "AIの知識がなくても相談できますか？",
    answer: "もちろんです。「AIで何ができるのかよく分からない」という段階からサポートします。専門用語を使わず、御社の業務に即した具体的な活用方法をご説明します。"
  },
  {
    question: "セミナーと導入伴走、どちらを選べばいいですか？",
    answer: "「まず社内のAIリテラシーを上げたい」場合はセミナー・研修、「具体的な業務をAI化したい」場合は導入伴走がおすすめです。無料診断で御社の状況をお伺いし、最適なパスをご提案します。"
  },
  {
    question: "研修後のフォローアップはありますか？",
    answer: "はい。研修後も継続的なサポートを提供しています。実務で分からないことがあればいつでもご相談いただけます。また、社内で学びを定着させるためのフォローアップ研修も実施可能です。"
  },
  {
    question: "費用はどのくらいかかりますか？",
    answer: "無料診断・ヒアリングは無料です。セミナーは内容・規模によって異なりますが、個別スクールは月額制、法人研修はカスタマイズ見積もりとなります。まずはお気軽にご相談ください。"
  }
];

export const AI_AGENT_FAQ: FaqItem[] = [
  {
    question: "AIエージェントとチャットボットの違いは何ですか？",
    answer: "従来のチャットボットは決められたシナリオに沿って応答するのに対し、AIエージェントは状況に応じて自律的に判断し、複数のツールを連携させて業務を遂行します。たとえば、問い合わせ内容を理解し、社内データを検索し、回答を生成し、必要に応じて担当者にエスカレーションするといった一連の流れを自動で行えます。"
  },
  {
    question: "社内の機密情報をAIに学習させても安全ですか？",
    answer: "はい。社内専用のAI環境を構築し、入力データがAIモデルの学習に利用されないよう設定することで安全性を高めます。さらに通信の暗号化やアクセス権限の管理など、貴社のセキュリティ要件に応じた最適な構成をご提案します。"
  },
  {
    question: "どのようなSaaSと連携できますか？",
    answer: "LINE・Slack・Gmail・Notion・kintone・Salesforce・freeeなど、主要なSaaSとの連携が可能です。APIが公開されているサービスであれば、基本的に連携できます。"
  },
  {
    question: "導入までどのくらいかかりますか？",
    answer: "シンプルなAIチャットボットであれば最短2週間、複数SaaSを連携した業務自動化エージェントで1〜2ヶ月が目安です。ヒアリング後に具体的なスケジュールをご提案します。"
  },
  {
    question: "AIの回答精度はどの程度ですか？",
    answer: "御社の業務データやマニュアルを学習させることで、高い精度を実現します。導入後もフィードバックを反映して継続的に精度を改善します。また、AIが判断に迷うケースは人にエスカレーションする設計にするため、誤った対応を防げます。"
  }
];

export const SYSTEM_DEV_FAQ: FaqItem[] = [
  {
    question: "既存のシステムを活かしたまま開発できますか？",
    answer: "はい。API連携やデータベース連携で、今お使いのシステムを壊さず新機能を追加できます。「全部作り直し」ではなく、必要な部分だけを段階的に開発する方針です。"
  },
  {
    question: "開発中に仕様変更は可能ですか？",
    answer: "はい、定期的な進捗共有の際にフィードバックをいただき、柔軟に対応します。ただし、大幅な仕様変更の場合は追加費用・期間についてご相談させていただきます。"
  },
  {
    question: "開発費用の目安を教えてください",
    answer: "業務自動化システムで50万円〜、Webアプリケーション開発で100万円〜が目安です。御社の要件をヒアリングした上で、詳細な見積もりをご提示します。追加費用が発生する場合は必ず事前にご相談します。"
  },
  {
    question: "保守・運用のサポートはありますか？",
    answer: "導入後も月額保守契約でバグ修正、機能追加のご相談、サーバー監視などを継続サポートいたします。新潟市内であれば、急なトラブルにも即日訪問対応が可能です。"
  },
  {
    question: "セキュリティ対策はどうなっていますか？",
    answer: "SSL暗号化、定期的なセキュリティアップデート、アクセス制御など、業界標準のセキュリティ対策を標準で実施します。個人情報を扱うシステムでは、追加のセキュリティ要件にも対応可能です。"
  }
];
