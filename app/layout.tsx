import type { Metadata } from "next";
import { Noto_Sans_JP, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import HeaderWrapper from "@/components/shared/HeaderWrapper";
import Footer from "@/components/shared/Footer";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import GtmNoscript from "@/components/shared/GtmNoscript";
import ClarityAnalytics from "@/components/shared/ClarityAnalytics";
import { CANONICAL_SITE_URL, isIndexableDeployment } from "@/lib/site";

const sans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  variable: "--font-sans"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = (() => {
  const isIndexable = isIndexableDeployment();
  return {
    metadataBase: new URL(CANONICAL_SITE_URL),
    title: "新潟のAI開発・AIエージェント開発｜株式会社クラウドネイチャー",
    description:
      "新潟の中小企業向けAI開発会社。自律型AIエージェント開発・業務システム開発で、人手不足を仕組みから解決。費用が見える最短1分のAI見積もりも公開中。",
    openGraph: {
      title: "新潟のAI開発・AIエージェント開発｜株式会社クラウドネイチャー",
      description: "新潟の中小企業向けAI開発会社。自律型AIエージェント開発・業務システム開発で、人手不足を仕組みから解決。費用が見える最短1分のAI見積もりも公開中。",
      url: CANONICAL_SITE_URL,
      siteName: "株式会社クラウドネイチャー",
      images: [
        {
          url: "/images/og-img.jpg",
          width: 1200,
          height: 630,
          alt: "株式会社クラウドネイチャー",
        },
      ],
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "新潟のAI開発・AIエージェント開発｜株式会社クラウドネイチャー",
      description: "新潟の中小企業向けAI開発会社。自律型AIエージェント開発・業務システム開発で、人手不足を仕組みから解決。費用が見える最短1分のAI見積もりも公開中。",
      images: ["/images/og-img.jpg"],
    },

    robots: isIndexable
      ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true
        }
      }
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
  const postalAddress = {
    "@type": "PostalAddress",
    postalCode: "951-8068",
    addressLocality: "新潟市中央区",
    streetAddress: "上大川前通七番町1230番地7 ストークビル鏡橋 7F",
    addressRegion: "新潟県",
    addressCountry: "JP",
  };

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
          "新潟の中小企業向けAI開発会社。自律型AIエージェント開発・業務システム開発で、人手不足を仕組みから解決。費用が見える最短1分のAI見積もりも公開中。",
        address: postalAddress,
        founder: {
          "@type": "Person",
          name: "渡邉 浩平",
          jobTitle: "代表取締役",
        },
        foundingDate: "2026-04",
        // TODO: Google Business Profile・SNS を開設したら URL を追加する（ローカルSEOの最重要施策）
        sameAs: [],
      },
      {
        // ProfessionalService は LocalBusiness のサブタイプ（事業内容をより具体的に伝える）
        "@type": "ProfessionalService",
        "@id": "https://cloudnature.jp/#localbusiness",
        name: "株式会社クラウドネイチャー",
        url: "https://cloudnature.jp",
        image: "https://cloudnature.jp/images/logo.png",
        description:
          "新潟のAI開発・AIエージェント開発会社。AI導入支援から業務システム開発まで、導入から運用まで伴走します。",
        address: postalAddress,
        // 座標は会社ページの Google マップ埋め込み（content/company.ts）と同一地点
        geo: {
          "@type": "GeoCoordinates",
          latitude: 37.9215819,
          longitude: 139.0460461,
        },
        hasMap:
          "https://www.google.com/maps/search/?api=1&query=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E4%B8%8A%E5%A4%A7%E5%B7%9D%E5%89%8D%E9%80%9A%E4%B8%83%E7%95%AA%E7%94%BA1230%E7%95%AA%E5%9C%B07",
        parentOrganization: { "@id": "https://cloudnature.jp/#organization" },
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
      <body className={cn(sans.variable, inter.variable)}>
        <GoogleAnalytics />
        <GtmNoscript />
        <ClarityAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* JS 無効環境ではスクロール演出（初期 opacity:0）を無効化してコンテンツを可視化する */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <div className="v-stack min-h-screen font-sans text-gray-800 selection:bg-teal-600 selection:text-white">
          <HeaderWrapper />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
