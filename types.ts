import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  techStack: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  before: string;
  after: string;
  image: string;
}

export interface ValueProp {
  title: string;
  subtitle: string;
  description: string;
}
