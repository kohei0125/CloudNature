import { TrustBadge, StepFlowItem, FaqItem, ContactFormLabels } from "@/types";

export const CONTACT_HERO = {
  eyebrow: "CONTACT",
  title: "人手不足の解決策を、無料で診断します",
  description: "30分のヒアリングで、御社の自動化ポテンシャルと概算コストをお伝えします。営業電話は一切ありません。"
};

export const TRUST_BADGES: TrustBadge[] = [
  { icon: "CircleDollarSign", label: "相談無料" },
  { icon: "Lock", label: "秘密厳守" },
  { icon: "PhoneOff", label: "営業電話なし" }
];

export const CONTACT_FORM_LABELS: ContactFormLabels = {
  name: "お名前",
  email: "メールアドレス",
  company: "会社名",
  phone: "電話番号",
  subject: "お問い合わせ種別",
  message: "お問い合わせ内容",
  submit: "無料で相談する（営業電話なし）",
  submitNote: "入力は1分で完了。2営業日以内にご返信します。",
  required: "必須",
  successTitle: "お問い合わせを受け付けました",
  successMessage: "担当者より2営業日以内にメールでご連絡いたします。",
  successCta: "待ち時間に導入事例をご覧ください",
  estimateCta: "今すぐAI見積もりを試す"
};

export const CONTACT_SUBJECTS = [
  "AI導入・業務自動化の相談",
  "サービスについて詳しく知りたい",
  "見積もりを依頼したい",
  "資料を請求したい",
  "その他"
];

export const STEP_FLOW_TITLE = "ご相談の流れ";

export const STEP_FLOW: StepFlowItem[] = [
  { step: 1, title: "お問い合わせ", description: "フォームまたはお電話でご連絡ください。" },
  { step: 2, title: "無料ヒアリング", description: "御社の課題やご要望をお伺いします（約30分）。" },
  { step: 3, title: "ご提案・お見積り", description: "最適な解決策と明確な費用をご提示します。" },
  { step: 4, title: "開発スタート", description: "ご納得いただけたら、伴走型で開発を進めます。" }
];

export const ALTERNATIVE_CONTACT = {
  title: "その他のお問い合わせ方法",
  phone: { label: "お電話", value: "025-XXX-XXXX", note: "平日 9:00〜18:00" },
  email: { label: "メール", value: "info@cloudnature.jp" }
};

export const CONTACT_FAQ: FaqItem[] = [
  {
    question: "相談だけでも大丈夫ですか？",
    answer: "もちろんです。まずはお気軽にお話しください。無理な営業は一切いたしません。ヒアリングの結果、自動化の余地が少ない場合は正直にお伝えします。"
  },
  {
    question: "費用はどのくらいかかりますか？",
    answer: "案件の内容によって異なりますが、AIチャットボット導入で月額5万円〜、業務自動化システムで50万円〜が目安です。必ず事前に詳細なお見積りをご提示し、追加費用が発生する場合も事前にご相談します。"
  },
  {
    question: "新潟県外からの依頼も可能ですか？",
    answer: "はい、オンラインでのお打ち合わせ・開発対応が可能です。ただし、現地訪問が必要な場合は別途交通費をご相談させていただきます。"
  },
  {
    question: "開発期間はどのくらいですか？",
    answer: "AIチャットボットの導入であれば最短2週間、業務システム開発は1〜3ヶ月が目安です。ヒアリング後に具体的なスケジュールをご提案します。"
  },
  {
    question: "ITに詳しくないのですが大丈夫ですか？",
    answer: "ご安心ください。専門用語を使わず、わかりやすくご説明します。導入後も社員向け研修やマニュアル作成でしっかりサポートしますので、ITに不慣れな現場でも安心して使い始められます。"
  }
];
