import type { NewsItem, NewsCategory } from "./news";

// microCMS 共通フィールド
export interface MicroCMSDate {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

export interface MicroCMSImage {
  url: string;
  height: number;
  width: number;
}

// microCMS コンテンツ参照型（カテゴリ）
export interface MicroCMSCategoryRef {
  id: string;
  name: string;
}

// microCMS リスト API レスポンス
export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

// news API のコンテンツ型（MicroCMSスキーマに合わせたフィールド名）
export interface MicroCMSNewsArticle extends MicroCMSDate {
  id: string;
  title: string;
  image?: MicroCMSImage;
  category?: MicroCMSCategoryRef;
  excerpt?: string;
  content?: string;
}

const CATEGORY_MAP: Record<string, NewsCategory> = {
  "ニュース": "ニュース",
  "お知らせ": "ニュース",
  "事例紹介": "事例紹介",
  "イベント": "イベント",
  "メディア": "メディア",
  "ブログ": "ブログ",
};

/** microCMS 記事 → 既存 NewsItem 型へ変換 */
export function toNewsItem(article: MicroCMSNewsArticle): NewsItem {
  const rawCategory = article.category?.name ?? "ニュース";
  const category: NewsCategory = CATEGORY_MAP[rawCategory] ?? "ニュース";
  return {
    id: article.id,
    publishedAt: article.publishedAt,
    category,
    title: article.title,
    excerpt: article.excerpt ?? "",
    url: `/news/${article.id}`,
    image: article.image?.url,
  };
}

