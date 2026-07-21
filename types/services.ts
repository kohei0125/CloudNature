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
