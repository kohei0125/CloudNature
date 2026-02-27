export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  before: string;
  after: string;
  image: string;
  link?: { label: string; href: string };
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
  link?: { label: string; href: string };
  image: string;
}
