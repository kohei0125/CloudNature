import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import EstimateHeader from "@/components/shared/EstimateHeader";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-sans",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-serif",
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

const SITE_URL = "https://ai.cloudnature.jp";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI見積もりシミュレーター｜システム開発費を最短1分で自動算出 | CloudNature",
    template: "%s | CloudNature AI見積もり",
  },
  description:
    "AIエージェントがシステム開発の概算見積もりを自動生成。質問に答えるだけで、WBS・機能一覧・費用比較を最短1分でお届け。相場の1/2のコストで高品質な開発を実現するCloudNatureの無料見積もりツール。",
  keywords: [
    "AI見積もり",
    "AI開発",
    "システム開発 見積もり",
    "開発コスト シミュレーター",
    "ソフトウェア開発 費用",
    "AIエージェント 開発",
    "CloudNature",
  ],
  authors: [{ name: "CloudNature", url: "https://cloudnature.jp" }],
  creator: "CloudNature",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "CloudNature AI見積もり",
    title: "AI見積もりシミュレーター｜システム開発費を最短1分で自動算出",
    description:
      "質問に答えるだけで、AIがシステム開発の概算見積もりを自動生成。",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "CloudNature AI見積もりシミュレーター",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI見積もりシミュレーター｜システム開発費を最短1分で自動算出",
    description:
      "質問に答えるだけで、AIがシステム開発の概算見積もりを自動生成。WBS・機能一覧・費用比較をお届けします。",
    images: ["/images/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.png",
  },
  ...(!isProduction && {
    robots: { index: false, follow: false },
  }),
};

export default function EstimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${notoSerifJP.variable}`}>
      <body>
        <div className="min-h-screen font-sans selection:bg-blue-200">
          <EstimateHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
