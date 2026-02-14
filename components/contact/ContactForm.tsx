"use client";

import { useState, FormEvent } from "react";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { CONTACT_FORM_LABELS, CONTACT_SUBJECTS } from "@/content/contact";
import { ESTIMATE_URL } from "@/content/common";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: CONTACT_SUBJECTS[0],
    message: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validate = (field: string, value: string) => {
    if (field === "name" && !value.trim()) return "お名前を入力してください";
    if (field === "email" && !value.trim()) return "メールアドレスを入力してください";
    if (field === "email" && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "正しいメールアドレスを入力してください";
    if (field === "message" && !value.trim()) return "お問い合わせ内容を入力してください";
    return "";
  };

  const getError = (field: string) => {
    if (!touched[field]) return "";
    return validate(field, formData[field as keyof typeof formData]);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isValid =
    formData.name.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.message.trim() !== "";

  // TODO: Integrate with backend API
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!isValid) return;

    setSubmitting(true);
    setError("");
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSubmitted(true);
    } catch {
      setError("送信に失敗しました。しばらく経ってから再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 text-center">
        <CheckCircle className="w-16 h-16 text-sage mx-auto mb-4" />
        <h3 className="text-xl font-bold text-forest mb-2">
          {CONTACT_FORM_LABELS.successTitle}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-6">
          {CONTACT_FORM_LABELS.successMessage}
        </p>
        <div className="v-stack sm:h-stack gap-3 justify-center">
          <Link
            href="/cases"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-mist text-forest font-bold rounded-full hover:bg-gray-200 transition-colors text-sm"
          >
            {CONTACT_FORM_LABELS.successCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={ESTIMATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 btn-puffy btn-puffy-accent rounded-full font-bold text-sm text-white"
          >
            {CONTACT_FORM_LABELS.estimateCta}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 space-y-5" noValidate>
      {/* Name */}
      <div>
        <label className="block text-sm font-bold text-forest mb-1.5">
          {CONTACT_FORM_LABELS.name}
          <span className="text-sunset text-xs ml-2">{CONTACT_FORM_LABELS.required}</span>
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          onBlur={() => handleBlur("name")}
          className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-sage/50 focus:border-sage outline-none transition-colors ${getError("name") ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
        />
        {getError("name") && <p className="text-red-500 text-xs mt-1">{getError("name")}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold text-forest mb-1.5">
          {CONTACT_FORM_LABELS.email}
          <span className="text-sunset text-xs ml-2">{CONTACT_FORM_LABELS.required}</span>
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          onBlur={() => handleBlur("email")}
          className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-sage/50 focus:border-sage outline-none transition-colors ${getError("email") ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
        />
        {getError("email") && <p className="text-red-500 text-xs mt-1">{getError("email")}</p>}
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-bold text-forest mb-1.5">
          {CONTACT_FORM_LABELS.company}
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-sage/50 focus:border-sage outline-none transition-colors"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-bold text-forest mb-1.5">
          {CONTACT_FORM_LABELS.subject}
        </label>
        <select
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-sage/50 focus:border-sage outline-none transition-colors bg-white"
        >
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-bold text-forest mb-1.5">
          {CONTACT_FORM_LABELS.message}
          <span className="text-sunset text-xs ml-2">{CONTACT_FORM_LABELS.required}</span>
        </label>
        <textarea
          required
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          onBlur={() => handleBlur("message")}
          placeholder="例：社員10名の事務所で、請求書処理を自動化したい"
          className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-sage/50 focus:border-sage outline-none transition-colors resize-vertical ${getError("message") ? "border-red-300 bg-red-50/50" : "border-gray-200"}`}
        />
        {getError("message") && <p className="text-red-500 text-xs mt-1">{getError("message")}</p>}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-puffy btn-puffy-accent w-full py-3.5 rounded-xl text-white font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              送信中...
            </>
          ) : (
            CONTACT_FORM_LABELS.submit
          )}
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          {CONTACT_FORM_LABELS.submitNote}
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
