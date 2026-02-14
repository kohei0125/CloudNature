"use client";

import { useState, FormEvent } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
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
  const [submitted, setSubmitted] = useState(false);

  // TODO: Integrate with backend API
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 space-y-5">
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
          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-sage/50 focus:border-sage outline-none transition-colors"
        />
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
          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-sage/50 focus:border-sage outline-none transition-colors"
        />
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
          placeholder="例：社員10名の事務所で、請求書処理を自動化したい"
          className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-sage/50 focus:border-sage outline-none transition-colors resize-vertical"
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="btn-puffy btn-puffy-accent w-full py-3.5 rounded-xl text-white font-bold text-base"
        >
          {CONTACT_FORM_LABELS.submit}
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          {CONTACT_FORM_LABELS.submitNote}
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
