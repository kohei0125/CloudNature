import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CtaBanner from "@/components/shared/CtaBanner";
import { PAGE_META } from "@/content/common";
import { NEWS_PAGE, NEWS_CTA } from "@/content/news";
import { NEWS_ITEMS, NEWS_CATEGORY_COLORS } from "@/content/home";
import { getNewsList } from "@/lib/microcms";
import { toNewsItem } from "@/types/microcms";
import type { NewsItem } from "@/types";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { CANONICAL_SITE_URL } from "@/lib/site";
import { formatDateJP } from "@/lib/utils";

export const metadata: Metadata = {
  title: PAGE_META.news.title,
  description: PAGE_META.news.description,
  openGraph: {
    title: PAGE_META.news.title,
    description: PAGE_META.news.description,
    type: "website",
    locale: "ja_JP",
    url: `${CANONICAL_SITE_URL}/news`,
    images: [{ url: "/images/og-img.jpg", width: 1200, height: 630, alt: "クラウドネイチャーのお知らせ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.news.title,
    description: PAGE_META.news.description,
    images: ["/images/og-img.jpg"],
  },
  alternates: { canonical: `${CANONICAL_SITE_URL}/news` },
};

const NewsPage = async () => {
  let items: NewsItem[];
  try {
    const res = await getNewsList({ limit: 50 });
    if (res.contents.length > 0) {
      items = res.contents.map(toNewsItem);
    } else {
      items = NEWS_ITEMS;
    }
  } catch {
    items = NEWS_ITEMS;
  }

  const categories = Array.from(
    new Set(items.map((a) => a.category))
  );

  const archiveYears = Array.from(
    new Set(items.map((a) => new Date(a.publishedAt).getFullYear()))
  ).sort((a, b) => b - a);

  const breadcrumb = breadcrumbJsonLd([{ name: "お知らせ", path: "/news" }]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: NEWS_PAGE.title,
    description: NEWS_PAGE.description,
    url: `${CANONICAL_SITE_URL}/news`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.url.startsWith("http") ? item.url : `${CANONICAL_SITE_URL}${item.url}`,
        name: item.title,
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
        eyebrow={NEWS_PAGE.eyebrow}
        title={NEWS_PAGE.title}
        description={(
          <>
            <span className="sm:hidden">
              最新情報や事例紹介、
              <br />
              技術ブログをお届けします
            </span>
            <span className="hidden sm:inline">
              {NEWS_PAGE.description}
            </span>
          </>
        )}
      />

      <section id="news-list" className="py-8 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">

          <p className="hidden md:block text-sm text-gray-500 text-right mb-8">
            {items.length}件
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
              {items.map((item) => {
                const colorClass = NEWS_CATEGORY_COLORS[item.category] ?? "bg-stone/20 text-forest";
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className="group flex gap-4 md:gap-8 py-4 md:py-8 first:pt-0 last:pb-0"
                  >
                    {/* サムネイル */}
                    <div className="relative flex-shrink-0 w-32 aspect-video md:w-72 md:aspect-video rounded-lg overflow-hidden bg-mist">
                      {item.image ? (
                        <>
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover blur-md scale-110 opacity-60"
                            sizes="(max-width: 768px) 128px, 288px"
                          />
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105 relative z-10"
                            sizes="(max-width: 768px) 128px, 288px"
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sage/10 to-cloud/30" />
                      )}
                      <span className={`hidden md:block absolute top-3 left-3 z-20 text-[11px] font-bold px-3 py-1 rounded ${colorClass}`}>
                        {item.category}
                      </span>
                    </div>

                    {/* テキスト */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <span className={`md:hidden text-[11px] font-bold mb-1 ${colorClass.split(" ").filter(c => c.startsWith("text-")).join(" ")}`}>
                        {item.category}
                      </span>
                      <h3 className="text-forest font-bold text-[15px] md:text-lg leading-snug mb-1 md:mb-2 line-clamp-2 group-hover:text-sage transition-colors">
                        {item.title}
                      </h3>
                      <time className="text-[11px] md:text-sm text-gray-400">
                        {formatDateJP(item.publishedAt)}
                      </time>
                      <p className="hidden md:block text-sm text-gray-500 leading-relaxed line-clamp-2 mt-2">
                        {item.excerpt}
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
                );
              })}

              {items.length === 0 && (
                <p className="text-center text-gray-500 py-12">
                  記事がまだありません。
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner {...NEWS_CTA} />
    </div>
  );
};

export default NewsPage;
