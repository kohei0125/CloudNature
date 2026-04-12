import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    absolute:
      "AI見積もりツール｜無料でシステム開発費を自動算出【CloudNature】",
  },
  description:
    "AIが質問に沿ってヒアリングし、システム開発の概算見積もり・開発計画書を最短1分で自動生成。営業電話なし・完全無料。新潟県の中小企業のAI導入・業務自動化をサポートします。",
  openGraph: {
    title:
      "AI見積もりツール｜無料でシステム開発費を自動算出【CloudNature】",
    description:
      "質問に答えるだけで、AIがシステム開発の概算見積もりを自動生成。",
    url: `${SITE_URL}/chat`,
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "AI見積もりツール｜無料でシステム開発費を自動算出【CloudNature】",
    description:
      "質問に答えるだけで、AIがシステム開発の概算見積もりを自動生成。",
    images: [OG_IMAGE.url],
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
