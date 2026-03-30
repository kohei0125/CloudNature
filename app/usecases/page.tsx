import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CtaBanner from "@/components/shared/CtaBanner";
import { USECASES_ARTICLES, USECASES_SECTION } from "@/content/usecases";
import { CASES_CTA } from "@/content/cases";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { CANONICAL_SITE_URL } from "@/lib/site";
import { formatDateJP } from "@/lib/utils";

export const metadata: Metadata = {
  title: `${USECASES_SECTION.title} | クラウドネイチャー`,
  description: USECASES_SECTION.description,
  openGraph: {
    title: `${USECASES_SECTION.title} | クラウドネイチャー`,
    description: USECASES_SECTION.description,
    type: "website",
    locale: "ja_JP",
    url: `${CANONICAL_SITE_URL}/usecases`,
    images: [{ url: "/images/og-img.jpg", width: 1200, height: 630, alt: USECASES_SECTION.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${USECASES_SECTION.title} | クラウドネイチャー`,
    description: USECASES_SECTION.description,
  },
  alternates: { canonical: `${CANONICAL_SITE_URL}/usecases` },
};

const categories = Array.from(
  new Set(USECASES_ARTICLES.map((a) => a.category))
);

const archiveYears = Array.from(
  new Set(USECASES_ARTICLES.map((a) => new Date(a.publishedAt).getFullYear()))
).sort((a, b) => b - a);

export default function UseCasesPage() {
  const breadcrumb = breadcrumbJsonLd([{ name: USECASES_SECTION.title, path: "/usecases" }]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: USECASES_SECTION.title,
    description: USECASES_SECTION.description,
    url: `${CANONICAL_SITE_URL}/usecases`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: USECASES_ARTICLES.length,
      itemListElement: USECASES_ARTICLES.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${CANONICAL_SITE_URL}/usecases/${article.id}`,
        name: article.title,
      })),
    },
  };

  return (
    <div className="w-full bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, collectionSchema]) }}
      />
      <PageHero
        eyebrow={USECASES_SECTION.eyebrow}
        title={USECASES_SECTION.title}
        description={(
          <>
            <span className="sm:hidden">
              AI導入の考え方や
              <br />
              業種別の進め方を学べる記事をまとめます
            </span>
            <span className="hidden sm:inline">
              {USECASES_SECTION.description}
            </span>
          </>
        )}
      />

      <section id="usecases-list" className="py-8 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">

          <p className="hidden md:block text-sm text-gray-500 text-right mb-8">
            {USECASES_ARTICLES.length}件
          </p>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* PC: 左サイドバー */}
            <aside className="hidden lg:block lg:w-56 flex-shrink-0">
              <div className="mb-10">
                <h2 className="text-sm font-bold text-forest tracking-wide mb-4">
                  カテゴリー
                </h2>
                <ul className="space-y-1">
                  <li>
                    <span className="flex items-center gap-2 text-sm font-semibold text-sage py-1.5 cursor-default">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                      すべて
                    </span>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <span className="flex items-center justify-between text-sm text-gray-600 hover:text-forest py-1.5 transition-colors cursor-default">
                        {cat}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-bold text-forest tracking-wide mb-4">
                  アーカイブ
                </h2>
                <ul className="space-y-1">
                  {archiveYears.map((year) => (
                    <li key={year}>
                      <span className="flex items-center justify-between text-sm text-gray-600 hover:text-forest py-1.5 transition-colors cursor-default">
                        {year}年
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* 記事一覧 */}
            <div className="flex-1 divide-y divide-gray-100">
              {USECASES_ARTICLES.map((article) => (
                <Link
                  key={article.id}
                  href={`/usecases/${article.id}`}
                  className="group flex gap-4 md:gap-8 py-4 md:py-8 first:pt-0 last:pb-0"
                >
                  {/* サムネイル */}
                  <div className="relative flex-shrink-0 w-32 aspect-video md:w-72 md:aspect-video rounded-lg overflow-hidden bg-mist">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      className="object-cover blur-md scale-110 opacity-60"
                      sizes="(max-width: 768px) 128px, 288px"
                    />
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105 relative z-10"
                      sizes="(max-width: 768px) 128px, 288px"
                    />
                    <span className="hidden md:block absolute top-3 left-3 z-20 text-[11px] font-bold px-3 py-1 rounded bg-sage text-white shadow-sm">
                      {article.category}
                    </span>
                  </div>

                  {/* テキスト */}
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <span className="md:hidden text-[11px] font-bold text-sage mb-1">
                      {article.category}
                    </span>
                    <h3 className="text-forest font-bold text-[15px] md:text-lg leading-snug mb-1 md:mb-2 line-clamp-2 group-hover:text-sage transition-colors">
                      {article.title}
                    </h3>
                    <time className="text-[11px] md:text-sm text-gray-400">
                      {formatDateJP(article.publishedAt)}
                    </time>
                    <p className="hidden md:block text-sm text-gray-500 leading-relaxed line-clamp-2 mt-2">
                      {article.excerpt}
                    </p>
                    <div className="hidden md:flex items-center justify-end mt-3">
                      <span className="w-8 h-8 rounded-full border border-sage/30 text-sage flex items-center justify-center transition-all group-hover:bg-sage group-hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* スマホ: 右矢印 */}
                  <div className="flex md:hidden items-center flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow={CASES_CTA.eyebrow}
        title={CASES_CTA.title}
        description={CASES_CTA.description}
        primaryCta={CASES_CTA.primaryCta}
        secondaryCta={CASES_CTA.secondaryCta}
      />
    </div>
  );
}
