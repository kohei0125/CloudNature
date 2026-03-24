import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { USECASES_ARTICLES, USECASES_DETAIL } from "@/content/usecases";
import { CASES_CTA } from "@/content/cases";
import CtaBanner from "@/components/shared/CtaBanner";
import NewsBody from "@/components/news/NewsBody";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { formatDateJP } from "@/lib/utils";

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

  const title = `${article.title} | 話題のAI活用術 | クラウドネイチャー`;

  return {
    title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      locale: "ja_JP",
      url: `https://cloudnature.jp/usecases/${article.id}`,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
    alternates: { canonical: `https://cloudnature.jp/usecases/${article.id}` },
  };
}

const UseCaseDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "話題のAI活用術", path: "/usecases" },
    { name: article.title, path: `/usecases/${article.id}` },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: "株式会社クラウドネイチャー", url: "https://cloudnature.jp" },
    publisher: { "@id": "https://cloudnature.jp/#organization" },
    image: `https://cloudnature.jp${article.image}`,
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

      <CtaBanner
        eyebrow={CASES_CTA.eyebrow}
        title={CASES_CTA.title}
        description={CASES_CTA.description}
        primaryCta={CASES_CTA.primaryCta}
        secondaryCta={CASES_CTA.secondaryCta}
      />
    </div>
  );
};

export default UseCaseDetailPage;
