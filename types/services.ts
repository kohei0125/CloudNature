export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  techStack: string[];
}

export interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: { title: string; description: string }[];
  techStack: string[];
  accentColor: string;
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
