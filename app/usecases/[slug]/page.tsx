import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { ArrowLeft } from "lucide-react";
import { USECASES_ARTICLES, USECASES_CTA, USECASES_DETAIL, USECASES_SECTION } from "@/content/usecases";
import CtaBanner from "@/components/shared/CtaBanner";
import NewsBody from "@/components/news/NewsBody";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { CANONICAL_SITE_URL } from "@/lib/site";
import { formatDateJP } from "@/lib/utils";
import RelatedLinks from "@/components/shared/RelatedLinks";
import { getRelatedServicesLinks } from "@/lib/related-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return USECASES_ARTICLES.map((a) => ({ slug: a.id }));
}

function findArticle(slug: string) {
  return USECASES_ARTICLES.find((a) => a.id === slug) ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return {};

  const title = `${article.title} | ${USECASES_SECTION.title} | クラウドネイチャー`;

  return {
    title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      locale: "ja_JP",
      url: `${CANONICAL_SITE_URL}/usecases/${article.id}`,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
    alternates: { canonical: `${CANONICAL_SITE_URL}/usecases/${article.id}` },
  };
}

const UseCaseDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: USECASES_SECTION.title, path: "/usecases" },
    { name: article.title, path: `/usecases/${article.id}` },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    articleSection: article.category,
    inLanguage: "ja",
    author: {
      "@type": "Organization",
      name: "株式会社クラウドネイチャー",
      url: CANONICAL_SITE_URL,
      logo: `${CANONICAL_SITE_URL}/images/logo.png`,
    },
    publisher: { "@id": `${CANONICAL_SITE_URL}/#organization` },
    image: {
      "@type": "ImageObject",
      url: `${CANONICAL_SITE_URL}${article.image}`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${CANONICAL_SITE_URL}/usecases/${article.id}`,
    },
  };

  return (
    <div className="bg-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, articleSchema]) }}
      />
      <article className="pt-20 md:pt-32 pb-10 md:pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <Link
            href={USECASES_DETAIL.backHref}
            className="inline-flex items-center gap-1.5 text-sage hover:text-forest transition-colors text-xs font-medium mb-5 md:mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {USECASES_DETAIL.backLabel}
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
            <span className="text-[11px] md:text-xs font-bold px-2.5 py-0.5 rounded-full bg-sunset/20 text-sunset">
              {article.category}
            </span>
            <time className="text-xs md:text-sm text-gray-400 font-medium">
              {formatDateJP(article.publishedAt)}
            </time>
          </div>

          <h1 className="text-xl md:text-[clamp(1.25rem,4vw,2.5rem)] font-serif font-bold text-forest leading-tight mb-5 md:mb-8">
            {article.title}
          </h1>

          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-6 md:mb-10">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <NewsBody html={article.body} />
        </div>
      </article>

      {article.body.includes("twitter-tweet") && (
        <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
      )}

      <RelatedLinks
        eyebrow="SERVICES"
        title="関連するサービス"
        items={[
          ...getRelatedServicesLinks(article.relatedServiceIds),
          { label: "お問い合わせ・無料相談", href: "/contact", description: "まずはお気軽にご相談ください" },
        ]}
      />

      <CtaBanner {...USECASES_CTA} />
    </div>
  );
};

export default UseCaseDetailPage;
