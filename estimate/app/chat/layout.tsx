import type { Metadata } from "next";

const SITE_URL = "https://ai.cloudnature.jp";

export const metadata: Metadata = {
  title: "AI見積もりシミュレーター｜チャットで簡単・最短1分",
  description:
    "AIエージェントに質問形式で答えるだけで、システム開発の概算見積もり・WBS・機能一覧を自動生成。完全無料でお試しいただけます。",
  openGraph: {
    title: "AI見積もりシミュレーター｜チャットで簡単・最短1分",
    description:
      "質問に答えるだけで、AIがシステム開発の概算見積もりを自動生成。",
    url: `${SITE_URL}/chat`,
  },
  twitter: {
    title: "AI見積もりシミュレーター｜チャットで簡単・最短1分",
    description:
      "質問に答えるだけで、AIがシステム開発の概算見積もりを自動生成。",
  },
  alternates: {
    canonical: `${SITE_URL}/chat`,
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
