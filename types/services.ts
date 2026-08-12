export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  ctaLinks?: { url: string; label: string }[];
}

/** サービス詳細の3本柱（対象 / ゴール / 特徴） */
export interface ServicePillar {
  /** 見出しラベル（対象 / ゴール / 特徴） */
  label: string;
  title: string;
  description: string;
}

export interface ServiceDetail {
  id: string;
  /** 日本語のサービス名（システム開発 など） */
  title: string;
  /** 英語表記（JSON-LD の serviceType 用） */
  subtitle: string;
  /** キャッチコピー見出し（例: 業務に合わせて、使えるシステムをつくる。） */
  heading: string;
  /** 概要（JSON-LD・詳細ページのヒーロー説明に使用） */
  description: string;
  /** 対象 / ゴール / 特徴 の3カラム */
  pillars: ServicePillar[];
  techStack: string[];
  accentColor: string;
  image?: string;
  externalLinks?: { url: string; label: string }[];
}

export interface FlowStep {
  step: number;
  title: string;
  description: string;
}

export interface PricingItem {
  title: string;
  description: string;
}

/**
 * ラベル付きリンク。外部/内部の出し分けは href を見て SmartLink が行うため、
 * データ側に external フラグは持たせない。
 *
 * 同じ形を各所でインライン定義せず、この型を参照すること
 * （CaseStudy.link・CaseStudyDetail.link・CtaBanner・SectionHeader が参照している）。
 */
export interface LinkItem {
  label: string;
  href: string;
}

/** サービス詳細ページのリストセクション（対応領域・相談の入口など）の1項目 */
export interface ServiceScopeItem {
  title: string;
  description: string;
  /** カードから次のアクションへ直接進ませたい場合のリンク（AI見積もりへの送客など） */
  link?: LinkItem;
}
