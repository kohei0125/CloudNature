import type { ReactNode } from "react";
import { SITE_URL, MAIN_SITE_URL } from "@/lib/metadata";

export const FAQ_ITEMS = [
  {
    question: "相談に必要な準備はありますか？",
    answer: "特にありません。現状の開発体制やお困りごとを口頭で共有いただくだけで構いません。",
  },
  {
    question: "AIツールの導入前でも相談できますか？",
    answer: "はい。導入前の情報収集の段階でもご相談いただけます。無理のない始め方からご提案します。",
  },
  {
    question: "相談したら研修を必ず発注する必要がありますか？",
    answer:
      "いいえ。比較検討段階の情報収集としてもご利用いただけます。研修内容が未確定の状態でのご相談も歓迎です。",
  },
  {
    question: "同業他社でも相談できますか？",
    answer: "同業の研修・セミナー事業を運営される方のご相談はお断りする場合があります。",
  },
];

export const PROBLEM_CARDS: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "現場の課題",
    text: "どの工程でAIを使えば効果的か分からない。試してはいるが、属人化して再現性がない。チームへの展開方法が定まっていない。",
    icon: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
        <circle cx="9" cy="7" r="2" fill="#f2f6fe" />
        <circle cx="15" cy="12" r="2" fill="#f2f6fe" />
        <circle cx="7.5" cy="17" r="2" fill="#f2f6fe" />
      </>
    ),
  },
  {
    title: "品質・信頼の課題",
    text: "生成されたコードの品質にばらつきがある。レビューやテストの基準が曖昧。納品品質と説明責任に不安が残る。",
    icon: (
      <>
        <path d="M12 3l7.5 3.2v5.1c0 4.6-3.1 7.7-7.5 9.7-4.4-2-7.5-5.1-7.5-9.7V6.2z" />
        <path d="M9 11.8l2.2 2.2 3.8-3.8" />
      </>
    ),
  },
  {
    title: "組織・顧客の課題",
    text: "情報漏えいやセキュリティリスクが心配。顧客への説明や合意形成が難しい。社内ルールや教育が追いついていない。",
    icon: (
      <>
        <circle cx="12" cy="7.5" r="3" />
        <path d="M6.8 20c0-2.9 2.3-5.2 5.2-5.2s5.2 2.3 5.2 5.2" />
        <circle cx="4.9" cy="9.5" r="2.2" />
        <path d="M1.5 18.5c0-2.3 1.5-4.1 3.6-4.6" />
        <circle cx="19.1" cy="9.5" r="2.2" />
        <path d="M22.5 18.5c0-2.3-1.5-4.1-3.6-4.6" />
      </>
    ),
  },
];

export const PROCESS_STEPS: { label: ReactNode; icon: ReactNode }[] = [
  {
    label: (
      <>
        企画
        <br />
        要件定義
      </>
    ),
    icon: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
        <path d="M9 11h6M9 15h6" />
      </>
    ),
  },
  {
    label: (
      <>
        設計
        <br />
        コーディング
      </>
    ),
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
        <path d="M8.5 15.5l.9-2.8 6.2-6.2 1.9 1.9-6.2 6.2z" />
      </>
    ),
  },
  {
    label: (
      <>
        テスト
        <br />
        レビュー
      </>
    ),
    icon: (
      <>
        <path d="M12 3l7.5 3.2v5.1c0 4.6-3.1 7.7-7.5 9.7-4.4-2-7.5-5.1-7.5-9.7V6.2z" />
        <path d="M9 11.8l2.2 2.2 3.8-3.8" />
      </>
    ),
  },
  {
    label: (
      <>
        ドキュメント
        <br />
        運用改善
      </>
    ),
    icon: (
      <>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v4h4M10 12h5M10 16h5" />
      </>
    ),
  },
];

export const STATS_ITEMS: { label: string; value: string; icon: ReactNode }[] = [
  {
    label: "受講者満足度 ※講師担当パート",
    value: "4.0 / 5.0",
    icon: <path d="M12 3.5l2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z" />,
  },
  {
    label: "AI研修・セミナー 累計参加者",
    value: "延べ100名以上",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20c0-3 2.4-5.4 5.5-5.4S14.5 17 14.5 20M17.5 10.5v5M20 13h-5" />
      </>
    ),
  },
  {
    label: "要件定義〜実装・レビュー・テスト",
    value: "全工程を実演",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="14" rx="2" />
        <path d="M4 8.5h16M9 21h6M8.5 13l2 2 4-4" />
      </>
    ),
  },
  {
    label: "開発現場に特化した",
    value: "実践ノウハウ",
    icon: (
      <path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h5l2 2.5h7A1.5 1.5 0 0 1 20.5 9v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18zM3.5 11h17" />
    ),
  },
];

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "株式会社クラウドネイチャー",
  alternateName: "CloudNature",
  url: MAIN_SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
};

export const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: "Claude Code / Codex を顧客案件で使うAI開発研修｜30分無料相談",
  description:
    "受託開発 / SIer / SES企業の経営者 / CTO / 開発責任者向け。Claude Code / Codexを組み込んだ開発プロセスの設計・運用・改善まで扱うAI研修を、オンライン30分の無料相談でご提案します。",
  isPartOf: {
    "@type": "WebSite",
    url: MAIN_SITE_URL,
    name: "CloudNature",
  },
};

export const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};
