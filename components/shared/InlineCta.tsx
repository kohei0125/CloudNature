import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ESTIMATE_URL } from "@/content/common";

interface InlineCtaProps {
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
}

const InlineCta = ({ title, primaryLabel, secondaryLabel }: InlineCtaProps) => {
  return (
    <div className="glass-card rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
      {/* Decorative blur elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-sunset/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sage/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <p className="font-bold text-forest mb-6">{title}</p>
        <div className="v-stack sm:h-stack gap-3 justify-center">
          <a
            href={ESTIMATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-puffy btn-puffy-accent px-6 py-3 rounded-full font-bold text-sm text-white inline-flex items-center justify-center gap-2"
          >
            {primaryLabel}
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/contact"
            className="px-6 py-3 border border-forest/20 text-forest rounded-full font-bold text-sm hover:bg-forest/5 transition-colors inline-flex items-center justify-center gap-2"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InlineCta;
