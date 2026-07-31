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

// news API のコンテンツ型（microCMS から返る生の形）
export interface MicroCMSNewsArticle extends MicroCMSDate {
  id: string;
  /** CMS 側で未入力のまま公開されることがあるため optional */
  title?: string;
  image?: MicroCMSImage;
  category?: MicroCMSCategoryRef;
  excerpt?: string;
  content?: string;
}

/** タイトル未入力の記事でも表示・alt が壊れないようにするフォールバック */
export const NEWS_FALLBACK_TITLE = "お知らせ";

/**
 * 取得層（lib/microcms）で正規化済みの記事。title が必ず入っていることを型で保証する。
 * 画面側はこちらだけを受け取るため、各所でフォールバックを書く必要がない。
 */
export type NewsArticle = Omit<MicroCMSNewsArticle, "title"> & { title: string };

/** 生の記事を正規化する。取得層からのみ呼ぶ */
export function normalizeNewsArticle(article: MicroCMSNewsArticle): NewsArticle {
  return { ...article, title: article.title?.trim() || NEWS_FALLBACK_TITLE };
}

const CATEGORY_MAP: Record<string, NewsCategory> = {
  "ニュース": "お知らせ",
  "お知らせ": "お知らせ",
  "事例紹介": "事例紹介",
  "イベント": "イベント",
  "メディア": "メディア",
  "ブログ": "ブログ",
};

/** microCMS 記事 → 既存 NewsItem 型へ変換 */
export function toNewsItem(article: NewsArticle): NewsItem {
  const rawCategory = article.category?.name ?? "お知らせ";
  const category: NewsCategory = CATEGORY_MAP[rawCategory] ?? "お知らせ";
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

