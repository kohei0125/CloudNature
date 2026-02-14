import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LegalSection } from "@/types";

interface LegalDocumentProps {
  sections: LegalSection[];
  relatedLink?: { label: string; href: string };
}

const LegalDocument = ({ sections, relatedLink }: LegalDocumentProps) => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="space-y-10">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-lg font-bold text-forest mb-4">{section.title}</h2>
              {Array.isArray(section.content) ? (
                <ul className="space-y-2">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="h-stack items-start gap-3 text-sm text-gray-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Post-document navigation */}
        <div className="mt-16 pt-10 border-t border-gray-200 space-y-6">
          {relatedLink && (
            <Link
              href={relatedLink.href}
              className="text-sage font-bold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all"
            >
              {relatedLink.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <div className="bg-mist rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              ご不明な点がございましたら、お気軽にお問い合わせください。
            </p>
            <Link
              href="/contact"
              className="btn-puffy btn-puffy-accent px-6 py-3 rounded-full font-bold text-sm text-white inline-flex items-center gap-2"
            >
              お問い合わせ
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalDocument;
