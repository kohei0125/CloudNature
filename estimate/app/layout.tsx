import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import EstimateHeader from "@/components/shared/EstimateHeader";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import GtmNoscript from "@/components/shared/GtmNoscript";
import ClarityAnalytics from "@/components/shared/ClarityAnalytics";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/metadata";
import "./globals.css";

// next/font/google は fonts.gstatic.com への外部アクセスが必須で、Docker・オフライン・
// プロキシ環境ではビルドに失敗する。フォントを自前ホストして next/font/local で読み込む。
// woff2 は scripts/build-ui-fonts.sh で生成（Noto Sans JP 400/700, Noto Serif JP 700）。
const notoSansJP = localFont({
  src: [
    { path: "./fonts/NotoSansJP-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/NotoSansJP-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-sans",
});

const notoSerifJP = localFont({
  src: [
    { path: "./fonts/NotoSerifJP-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-serif",
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "新潟のシステム開発・AI導入見積もり｜最短1分で自動算出【CloudNature】",
    template: "%s | CloudNature AI見積もり",
  },
  description:
    "新潟の中小企業向けにAIを活用したシステム開発を提供。AI見積もりシミュレーターで、Webアプリ・AIエージェント・業務自動化の概算費用を最短1分で無料算出。要件定義から開発計画までをAIが自動生成し、補助金活用のご提案も可能です。",
  keywords: [
    "AI見積もり",
    "AI導入",
    "システム開発 見積もり",
    "見積もりツール",
    "AIエージェント 見積もり",
    "開発コスト シミュレーター",
    "ソフトウェア開発 費用",
    "AIエージェント 開発",
    "新潟 システム開発",
    "ツール開発",
    "業務自動化",
    "CloudNature",
  ],
  authors: [{ name: "CloudNature", url: "https://cloudnature.jp" }],
  creator: "CloudNature",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title:
      "新潟のシステム開発・AI導入見積もり｜最短1分で自動算出【CloudNature】",
    description:
      "新潟の中小企業向けAI見積もりシミュレーター。Webアプリ・AIエージェント・業務自動化の概算費用を最短1分で無料算出。",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "新潟のシステム開発・AI導入見積もり｜最短1分で自動算出",
    description:
      "新潟の中小企業向けAI見積もりシミュレーター。概算費用を最短1分で無料算出。",
    images: [OG_IMAGE.url],
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
        <GoogleAnalytics />
        <GtmNoscript />
        <ClarityAnalytics />
        <div className="min-h-screen font-sans selection:bg-blue-200">
          <EstimateHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
