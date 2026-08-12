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
  client: string;
  challenge: string;
  solution: string;
  results: string[];
  quote?: { text: string; author: string; role: string };
  link?: LinkItem;
  image: string;
  imageMobile?: string;
  relatedServiceIds?: string[];
}
