import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { NEWS_PAGE } from "@/content/news";
import { NEWS_ITEMS } from "@/content/home";
import { getNewsList } from "@/lib/microcms";
import { toNewsItem } from "@/types/microcms";
import PageHero from "@/components/shared/PageHero";
import NewsCard from "@/components/news/NewsCard";
import type { NewsItem } from "@/types";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: PAGE_META.news.title,
  description: PAGE_META.news.description,
  openGraph: {
    title: PAGE_META.news.title,
    description: PAGE_META.news.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/news",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "クラウドネイチャーのニュース" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.news.title,
    description: PAGE_META.news.description,
    images: ["/images/og-image.png"],
  },
  alternates: { canonical: "https://cloudnature.jp/news" },
};

const NewsPage = async () => {
  let items: NewsItem[];
  let isFallback = false;
  try {
    const res = await getNewsList({ limit: 50 });
    if (res.contents.length > 0) {
      items = res.contents.map(toNewsItem);
    } else {
      items = NEWS_ITEMS;
      isFallback = true;
    }
  } catch {
    items = NEWS_ITEMS;
    isFallback = true;
  }

  const breadcrumb = breadcrumbJsonLd([{ name: "ニュース", path: "/news" }]);

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHero
        eyebrow={NEWS_PAGE.eyebrow}
        title={NEWS_PAGE.title}
        description={NEWS_PAGE.description}
      />

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <NewsCard key={item.id} item={item} disableLink={isFallback} />
            ))}
          </div>

          {items.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              記事がまだありません。
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
