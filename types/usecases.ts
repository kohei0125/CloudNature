export interface UseCaseArticle {
  id: string;
  publishedAt: string;
  /** 大幅なリライトを行った場合の最終更新日。JSON-LD の dateModified に使う */
  updatedAt?: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  relatedServiceIds?: string[];
}
