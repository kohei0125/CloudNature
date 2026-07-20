import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GtmNoscript from "@/components/GtmNoscript";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/metadata";
import { isIndexableDeployment } from "@/lib/site";
import "./globals.css";

// next/font/google は fonts.gstatic.com への外部アクセスが必須で、Docker・オフライン・
// プロキシ環境ではビルドに失敗する。フォントを自前ホストして next/font/local で読み込む。
const notoSansJP = localFont({
  src: [
    { path: "./fonts/NotoSansJP-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/NotoSansJP-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-sans",
});

const isIndexable = isIndexableDeployment();

export const viewport: Viewport = {
  themeColor: "#060f22",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    "Claude Code / Codex を顧客案件で使うAI開発研修｜30分無料相談｜CloudNature",
  description:
    "受託開発 / SIer / SES企業の経営者 / CTO / 開発責任者向け。Claude Code / Codexを組み込んだ開発プロセスの設計・運用・改善まで扱うAI研修を、オンライン30分の無料相談でご提案します。研修内容が未確定でもご相談いただけます。",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: "Claude Code / Codex を顧客案件で使うAI開発研修｜30分無料相談",
    description:
      "受託開発 / SIer / SES企業の経営者 / CTO / 開発責任者向け。AIを組み込んだ開発プロセスの設計・運用・改善まで扱うAI研修を、貴社の体制に合わせてご提案。オンライン30分・相談無料。",
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code / Codex を顧客案件で使うAI開発研修｜30分無料相談",
    description:
      "受託開発 / SIer / SES企業の経営者 / CTO / 開発責任者向け。AIを組み込んだ開発プロセスの設計・運用・改善まで扱うAI研修を、貴社の体制に合わせてご提案。オンライン30分・相談無料。",
    images: [OG_IMAGE.url],
  },
  ...(!isIndexable && {
    robots: { index: false, follow: false },
  }),
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body>
        <GoogleAnalytics />
        <GtmNoscript />
        {children}
      </body>
    </html>
  );
}
