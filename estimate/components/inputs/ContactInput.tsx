"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, BellOff } from "lucide-react";
import { cn, EMAIL_REGEX } from "@/lib/utils";
import { ERROR_MESSAGES } from "@/content/estimate";

interface ContactValue {
  name: string;
  company: string;
  email: string;
}

interface ContactInputProps {
  value: string;
  onChange: (value: string) => void;
}

function parseContact(value: string): ContactValue {
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

export default function ContactInput({ value, onChange }: ContactInputProps) {
  const contact = useMemo(() => parseContact(value), [value]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (field: keyof ContactValue, v: string) => {
      const updated = { ...parseContact(value), [field]: v };
      onChange(JSON.stringify(updated));
    },
    [value, onChange]
  );

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const nameError =
    touched.name && contact.name.trim().length > 0 && contact.name.trim().length < 2
      ? "2文字以上でご入力ください"
      : null;

  const emailError =
    touched.email && contact.email.length > 0 && !EMAIL_REGEX.test(contact.email.trim())
      ? ERROR_MESSAGES.invalidEmail
      : null;
  const companyError =
    touched.company && contact.company.trim().length === 0
      ? "企業・団体名をご入力ください"
      : null;

  const fieldClass = (hasError: boolean) =>
    cn(
      "w-full rounded-[14px] border-[1.5px] bg-white px-5 py-4",
      "text-[0.9375rem] text-gray-800 placeholder:text-gray-400",
      "outline-none transition-all",
      hasError
        ? "border-red-300 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
        : "border-[#d6d3cd] focus:border-sage focus:shadow-[0_0_0_3px_rgba(138,150,104,0.12)]"
    );

  return (
    <motion.div
      initial={{ y: 8 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="v-stack gap-5"
    >
      {/* Trust signals */}
      <div className="rounded-2xl border border-sage/20 bg-sage/5 px-5 py-4">
        <div className="v-stack gap-2.5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-sage" />
            <span className="text-[0.8125rem] text-gray-600">
              SSL暗号化通信で安全に送信されます
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Lock className="h-4 w-4 shrink-0 text-sage" />
            <span className="text-[0.8125rem] text-gray-600">
              第三者への提供・共有は一切行いません
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <BellOff className="h-4 w-4 shrink-0 text-sage" />
            <span className="text-[0.8125rem] text-gray-600">
              お見積もり以外に使用しません。営業メールもお送りいたしません。
            </span>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="v-stack gap-1.5">
        <label htmlFor="contact-name" className="text-sm font-medium text-gray-700">
          お名前 <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={contact.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          placeholder="山田 太郎"
          maxLength={100}
          className={fieldClass(!!nameError)}
        />
        {nameError && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500"
          >
            {nameError}
          </motion.span>
        )}
      </div>

      {/* Company */}
      <div className="v-stack gap-1.5">
        <label htmlFor="contact-company" className="text-sm font-medium text-gray-700">
          企業・団体名 <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-company"
          type="text"
          value={contact.company}
          onChange={(e) => handleChange("company", e.target.value)}
          onBlur={() => handleBlur("company")}
          placeholder="株式会社〇〇"
          maxLength={100}
          className={fieldClass(!!companyError)}
        />
        {companyError && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500"
          >
            {companyError}
          </motion.span>
        )}
      </div>

      {/* Email */}
      <div className="v-stack gap-1.5">
        <label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
          メールアドレス <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          inputMode="email"
          value={contact.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder="example@company.co.jp"
          maxLength={254}
          className={fieldClass(!!emailError)}
        />
        {emailError && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500"
          >
            {emailError}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
