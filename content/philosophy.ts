import { DevApproachStep } from "@/types";

export const PHILOSOPHY_HERO = {
  eyebrow: "PHILOSOPHY",
  title: "作って終わりにしない。",
  description: "CloudNatureは、新潟の中小企業に寄り添う伴走型の開発パートナーです。テクノロジーの力で、現場の課題を一つひとつ解決していきます。"
};

export const FOUNDING_STORY = {
  eyebrow: "OUR STORY",
  title: "原体験 — なぜ、新潟で創業したのか",
  paragraphs: [
    "「このシステム、結局誰も使ってないんだよね。」",
    "ある新潟の製造業の社長から聞いた言葉が、CloudNature創業のきっかけです。大手SIerに数千万円で発注したシステムが、現場に定着せず放置されていた。原因は明確でした。開発会社が現場を見ていなかったのです。",
    "数十万人が利用するサービスの開発や大手企業のプロジェクトに携わる中でも、同じような話を何度も耳にしました。高額なシステムを入れたものの使われない。導入後のサポートがない。追加開発のたびに見積もりが膨らむ。",
    "「現場を知り、現場に寄り添い、使われるシステムを作る」——その信念を胸に、地元新潟で CloudNature を立ち上げました。"
  ]
};

export const MISSION_DEEP_DIVE = {
  eyebrow: "MISSION",
  title: "人手に代わる、仕組みを届ける",
  description: "新潟の中小企業が直面する最大の課題は「人手不足」。しかし、すべての業務に人が必要なわけではありません。定型的な事務作業、データ入力、問い合わせ対応——こうした業務こそ、AIとシステムの力で自動化できます。",
  points: [
    { title: "人を減らすのではなく、人の力を最大化する", description: "自動化の目的は「人減らし」ではありません。社員がより創造的で付加価値の高い業務に集中できる環境を作ること。それがCloudNatureの考える本当のDXです。" },
    { title: "中小企業に、大企業レベルの技術を", description: "AIやクラウドは、もはや大企業だけのものではありません。適切な設計と実装で、中小企業でも最先端の技術を手頃な価格で活用できます。" },
    { title: "段階的な投資で、リスクを最小化", description: "いきなり大規模投資をお願いすることはありません。最小限の構成でスタートし、効果を確認してから段階的に拡張。御社のリスクを限りなくゼロに近づけます。" }
  ]
};

export const VALUES_EXPANDED = [
  {
    title: "実用本位のエンジニアリング",
    subtitle: "Practical Engineering",
    description: "「本当に必要な機能」だけを、適正価格で。大手が提案する高額なパッケージではなく、御社の業務フローに合わせた最小構成で開発します。",
    details: [
      "過剰な機能は作らない——必要最小限の設計",
      "既存システムを活かす段階的な開発",
      "導入コストを大手の半額以下に抑える",
      "運用負担を限りなくゼロに近づける"
    ],
    accentColor: "sage"
  },
  {
    title: "運用まで見据えた伴走",
    subtitle: "Sustainable Partnership",
    description: "導入後の運用サポート、現場向けマニュアル作成、社員研修まで。「使われないシステム」を作らないために、御社の一員として動きます。",
    details: [
      "導入後の運用サポート体制",
      "現場向けの操作マニュアル作成",
      "社員向け導入研修の実施",
      "新潟市内なら即日訪問対応"
    ],
    accentColor: "sunset"
  },
  {
    title: "誠実な実装、確実な成果",
    subtitle: "Integrity & Results",
    description: "見積もりから納品まで、すべてのプロセスを明確にお伝えします。追加費用が発生する場合は必ず事前相談。誠実な仕事の積み重ねで、長期的な信頼関係を築きます。",
    details: [
      "事前の見積もりに追加費用なし",
      "2週間ごとの進捗報告で透明性を確保",
      "成果が出なければ正直にお伝えする",
      "長期的なパートナーシップを重視"
    ],
    accentColor: "sea"
  }
];

export const DEV_APPROACH: DevApproachStep[] = [
  { step: 1, title: "現場を知る", description: "まず現場に伺い、実際の業務フローを観察。データや数字だけでは見えない「本当の課題」を見つけます。" },
  { step: 2, title: "課題を整理する", description: "ヒアリング結果を元に課題を整理・優先順位付け。最もインパクトの大きい施策から着手します。" },
  { step: 3, title: "形にして見せる", description: "動くプロトタイプで「完成イメージ」を共有。認識のズレを早期に解消し、手戻りを防ぎます。" },
  { step: 4, title: "一緒に作り上げる", description: "2週間ごとの進捗報告とフィードバック。御社と一緒にシステムを磨き上げていきます。" },
  { step: 5, title: "定着するまで支える", description: "研修・マニュアル・運用サポート。現場で「使われるシステム」になるまで伴走します。" }
];

export const PHILOSOPHY_MID_CTA = {
  text: "同じような課題をお持ちですか？",
  primaryLabel: "無料でAI見積もり",
  secondaryLabel: "お問い合わせ・ご相談"
};

export const PHILOSOPHY_CTA = {
  eyebrow: "GET STARTED",
  title: "御社の自動化余地を、無料で診断します",
  description: "AIが概算費用を即時算出。または30分の無料ヒアリングで、御社の課題に最適な解決策をご提案します。",
  primaryCta: { label: "無料でAI見積もり", href: "https://ai.cloudnature.jp/chat" },
  secondaryCta: { label: "お問い合わせ・ご相談", href: "/contact" }
};
