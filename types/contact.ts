export interface TrustBadge {
  icon: string;
  label: string;
}

export interface StepFlowItem {
  step: number;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContactFormLabels {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  submit: string;
  submitNote: string;
  required: string;
  successTitle: string;
  successMessage: string;
  successCta: string;
  estimateCta: string;
}
