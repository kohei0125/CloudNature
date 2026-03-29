import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface RelatedLinkItem {
  label: string;
  href: string;
  description?: string;
}

interface RelatedLinksProps {
  eyebrow?: string;
  title?: string;
  items: RelatedLinkItem[];
}

const RelatedLinks = ({
  eyebrow = "RELATED",
  title = "関連ページ",
  items,
}: RelatedLinksProps) => {
  if (items.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-linen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <p className="text-sm font-bold tracking-widest mb-2 uppercase text-sage">
            {eyebrow}
          </p>
          <h2 className="text-lg md:text-xl font-serif font-bold text-forest">
            {title}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between gap-3 bg-white rounded-xl px-5 py-4 border border-gray-100 hover:border-sage/30 hover:shadow-sm transition-all"
            >
              <div className="min-w-0">
                <p className="font-bold text-forest text-sm leading-snug">
                  {item.label}
                </p>
                {item.description && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {item.description}
                  </p>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-sage flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedLinks;
