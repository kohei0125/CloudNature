export type NewsCategory = "お知らせ" | "事例紹介" | "イベント" | "メディア" | "ブログ";

export interface NewsItem {
  id: string;
  publishedAt: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  url: string;
  image?: string;
}
