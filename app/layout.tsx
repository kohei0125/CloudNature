import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import HeaderWrapper from "@/components/shared/HeaderWrapper";
import Footer from "@/components/shared/Footer";

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
    metadataBase: new URL("https://cloudnature.jp"),
    title: "株式会社クラウドネイチャー | 新潟の中小企業向けAI・業務自動化パートナー",
    description:
      "新潟の中小企業の人手不足を、AIエージェントと堅牢なシステム開発で解決するITパートナー。",

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://cloudnature.jp/#organization",
        name: "株式会社クラウドネイチャー",
        alternateName: "CloudNature Co., Ltd.",
        url: "https://cloudnature.jp",
        logo: "https://cloudnature.jp/images/logo.png",
        description:
          "新潟の中小企業の人手不足を、AIエージェントと堅牢なシステム開発で解決するITパートナー。",
        address: {
          "@type": "PostalAddress",
          addressRegion: "新潟県",
          addressCountry: "JP",
        },
        sameAs: [],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://cloudnature.jp/#localbusiness",
        name: "株式会社クラウドネイチャー",
        url: "https://cloudnature.jp",
        image: "https://cloudnature.jp/images/logo.png",
        address: {
          "@type": "PostalAddress",
          addressRegion: "新潟県",
          addressCountry: "JP",
        },
        areaServed: {
          "@type": "Place",
          name: "新潟県",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://cloudnature.jp/#website",
        url: "https://cloudnature.jp",
        name: "株式会社クラウドネイチャー",
        publisher: { "@id": "https://cloudnature.jp/#organization" },
        inLanguage: "ja",
      },
    ],
  };

  return (
    <html lang="ja">
      <body className={cn(sans.variable, serif.variable)}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="v-stack min-h-screen font-sans text-forest selection:bg-sunset selection:text-white">
          <HeaderWrapper />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
