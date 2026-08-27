import type { LinkItem } from "./services";

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  before: string;
  after: string;
  image: string;
  link?: LinkItem;
}

export interface CaseStudyDetail {
  id: string;
  title: string;
  category: string;
  /** 開発主体。自社開発か、外部クライアント案件かが読み手に伝わる表記にする */
  client: string;
  challenge: string;
  solution: string;
  results: string[];
  /** 現在の運用状況。公開物など第三者が確認できる事実のみ記載する */
  status?: string;
  /**
   * 実在の発言のみ設定する。出所を示せない推薦文は景表法（優良誤認）に触れる。
   * consentedAt（掲載許諾を得た日 YYYY-MM-DD）を必須にすることで、
   * 許諾の確認なしに quote を追加できないようにしている。
   */
  quote?: { text: string; author: string; role: string; consentedAt: string };
  link?: LinkItem;
  image: string;
  imageMobile?: string;
  relatedServiceIds?: string[];
}
