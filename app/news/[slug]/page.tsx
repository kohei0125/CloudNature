import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getNewsArticle, getAllNewsIds } from "@/lib/microcms";
import { NEWS_DETAIL } from "@/content/news";
import { NEWS_CATEGORY_COLORS } from "@/content/home";
import NewsBody from "@/components/news/NewsBody";
import type { NewsCategory } from "@/types";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 60;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const ids = await getAllNewsIds();
    return ids.filter(Boolean).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) return {};

  return {
    title: `${article.title} | クラウドネイチャー`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? "",
      type: "article",
      locale: "ja_JP",
      url: `https://cloudnature.jp/news/${article.id}`,
      images: article.image
        ? [{ url: article.image.url, width: article.image.width, height: article.image.height }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt ?? "",
      images: article.image ? [article.image.url] : undefined,
    },
    alternates: { canonical: `https://cloudnature.jp/news/${article.id}` },
  };
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

const NewsArticlePage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  const category = (article.category?.name ?? "ニュース") as NewsCategory;
  const colorClass = NEWS_CATEGORY_COLORS[category] ?? "bg-stone/20 text-forest";

  const breadcrumb = breadcrumbJsonLd([
    { name: "ニュース", path: "/news" },
    { name: article.title, path: `/news/${article.id}` },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Organization", name: "株式会社クラウドネイチャー", url: "https://cloudnature.jp" },
    publisher: { "@id": "https://cloudnature.jp/#organization" },
    ...(article.image ? { image: article.image.url } : {}),
  };

  return (
    <div className="bg-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, articleSchema]) }}
      />
      <article className="pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          {/* 戻るリンク */}
          <Link
            href={NEWS_DETAIL.backHref}
            className="inline-flex items-center gap-2 text-sage hover:text-forest transition-colors text-xs md:text-sm font-medium mb-6 md:mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {NEWS_DETAIL.backLabel}
          </Link>

          {/* メタ情報 */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${colorClass}`}>
              {category}
            </span>
            <time className="text-sm text-gray-400 font-medium">
              {formatDate(article.publishedAt)}
            </time>
          </div>

          {/* タイトル */}
          <h1 className="text-[clamp(1.25rem,4vw,2.5rem)] font-serif font-bold text-forest leading-tight mb-6 md:mb-8">
            {article.title}
          </h1>

          {/* アイキャッチ */}
          {article.image && (
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-8 md:mb-10">
              <Image
                src={article.image.url}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}

          {/* 本文 */}
          <NewsBody html={article.content ?? ""} />
        </div>
      </article>
    </div>
  );
};

export default NewsArticlePage;
