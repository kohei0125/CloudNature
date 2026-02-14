import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStudyDetail } from "@/types";

interface CaseStudyDetailCardProps {
  study: CaseStudyDetail;
  index: number;
}

const CaseStudyDetailCard = ({ study, index }: CaseStudyDetailCardProps) => {
  const isEven = index % 2 === 0;

  return (
    <div className="group grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Image */}
      <div className={cn("relative h-64 md:h-full min-h-[320px] rounded-2xl overflow-hidden", !isEven && "md:order-2")}>
        <Image
          src={study.image}
          alt={study.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      </div>

      {/* Content */}
      <div className={cn(!isEven && "md:order-1")}>
        <span className="inline-block px-4 py-1.5 bg-sunset text-white text-xs font-bold rounded-full mb-4">
          {study.category}
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-forest mb-2">{study.title}</h3>
        <p className="text-sm text-gray-500 mb-6">{study.client}</p>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-xs font-bold text-forest uppercase tracking-wider mb-1">CHALLENGE</p>
            <p className="text-sm text-gray-600 leading-relaxed">{study.challenge}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-forest uppercase tracking-wider mb-1">SOLUTION</p>
            <p className="text-sm text-gray-600 leading-relaxed">{study.solution}</p>
          </div>
        </div>

        <ul className="space-y-2 mb-6">
          {study.results.map((result) => (
            <li key={result} className="h-stack items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
              <span className="text-sm text-forest font-medium">{result}</span>
            </li>
          ))}
        </ul>

        {study.quote ? (
          <blockquote className="glass-card rounded-r-xl border-l-4 border-sunset pl-4 py-3 pr-4">
            <p className="text-sm italic text-gray-600 leading-relaxed mb-2">
              {study.quote.text}
            </p>
            <cite className="text-xs text-gray-500 not-italic">
              {study.quote.author} / {study.quote.role}
            </cite>
          </blockquote>
        ) : null}
      </div>
    </div>
  );
};

export default CaseStudyDetailCard;
