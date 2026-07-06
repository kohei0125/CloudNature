export interface ServiceItem {
  id: string;
  title: string;
  /** TOPカードの訴求リード（「○○したい企業へ」）。タイトルと説明文の間に表示する */
  tagline?: string;
  description: string;
  features: string[];
  techStack: string[];
  ctaUrl?: string;
  ctaLabel?: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: { title: string; description: string }[];
  techStack: string[];
  accentColor: string;
  image?: string;
  externalUrl?: string;
  externalLabel?: string;
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
