/**
 * 一覧・カルーセルのカード表示に必要な最小フィールド。
 * body（記事本文HTML・1本あたり30〜45KB）を持たないので、
 * client component へ渡してもブラウザのJSバンドルに本文が載らない。
 * フィールドの型は UseCaseArticle から Pick して同期させる
 * （article 側の型を絞ったときにカード側だけ取り残されるのを防ぐ）。
 */
export type UseCaseCard = Pick<
  UseCaseArticle,
  "id" | "title" | "excerpt" | "image" | "category"
> & {
  /** 表示用の日付。updatedAt があればそちら */
  date: string;
};

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
