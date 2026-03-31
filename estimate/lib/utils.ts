import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[0-9\-+()（）\s]*[0-9][0-9\-+()（）\s]*$/;

export interface ContactValue {
  name: string;
  company: string;
  phone: string;
  email: string;
}

export function parseContact(value: string): ContactValue {
  if (!value) return { name: "", company: "", phone: "", email: "" };
  try {
    const parsed = JSON.parse(value);
    return {
      name: parsed.name ?? "",
      company: parsed.company ?? "",
      phone: parsed.phone ?? "",
      email: parsed.email ?? "",
    };
  } catch {
    return { name: "", company: "", phone: "", email: "" };
  }
}
