import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactValue {
  name: string;
  company: string;
  email: string;
}

export function parseContact(value: string): ContactValue {
  if (!value) return { name: "", company: "", email: "" };
  try {
    const parsed = JSON.parse(value);
    return {
      name: parsed.name ?? "",
      company: parsed.company ?? "",
      email: parsed.email ?? "",
    };
  } catch {
    return { name: "", company: "", email: "" };
  }
}
