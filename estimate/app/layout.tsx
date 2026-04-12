import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import EstimateHeader from "@/components/shared/EstimateHeader";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import GtmNoscript from "@/components/shared/GtmNoscript";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/metadata";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "新潟のシステム開発・AI導入見積もり｜最短1分で自動算出【CloudNature】",
    template: "%s | CloudNature AI見積もり",
  },
  description:
    "新潟の中小企業向けにAIを活用したシステム開発を提供。AI見積もりシミュレーターで、Webアプリ・AIエージェント・業務自動化の概算費用を最短1分で無料算出。従来の相場の1/2のコスト感で、補助金活用のご提案も可能です。",
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
        <div className="min-h-screen font-sans selection:bg-blue-200">
          <EstimateHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
