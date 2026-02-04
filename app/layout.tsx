import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const sans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  variable: "--font-sans"
});

const serif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: false,
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "serif"],
  variable: "--font-serif"
});

export const metadata: Metadata = (() => {
  const isProd = process.env.NEXT_PUBLIC_ENV === "production";
  return {
    title: "株式会社クラウドネイチャー | AI時代を、共に歩むITパートナー",
    description:
      "地方企業の人手不足を解消するAIエージェントと誠実なシステム開発で、組織を「強く、しなやか」に変革するITパートナー。",

    robots: isProd
      ? undefined
      : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noarchive: true,
          nosnippet: true
        }
      }
  };
})();

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${sans.variable} ${serif.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
