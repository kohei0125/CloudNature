import { ESTIMATE_URL } from "@/content/common";

export const NEWS_PAGE = {
  eyebrow: "NOTICE",
  title: "お知らせ",
  description: "CloudNatureの最新情報、事例紹介、技術ブログをお届けします。",
};

export const NEWS_CTA = {
  eyebrow: "NEXT STEP",
  title: "AI導入、何から始めるか迷ったら",
  description: "「自社に合うAI活用は何か」を無料診断。概算費用もその場でお伝えします。",
  primaryCta: { label: "無料でAI見積もり", href: ESTIMATE_URL },
  secondaryCta: { label: "お問い合わせ・ご相談", href: "/contact" },
};

export const NEWS_DETAIL = {
  backLabel: "一覧に戻る",
  backHref: "/news",
};
