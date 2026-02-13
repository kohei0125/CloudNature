import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  cta?: { label: string; href: string };
  centered?: boolean;
  darkMode?: boolean;
}

const SectionHeader = ({ eyebrow, title, cta, centered = false, darkMode = false }: SectionHeaderProps) => {
  if (centered) {
    return (
      <div className="text-center mb-16">
        <p className="text-sm font-bold tracking-widest mb-3 uppercase text-sage">
          {eyebrow}
        </p>
        <h2 className={cn("text-[clamp(1.75rem,5vw,2.5rem)] font-serif font-bold", darkMode ? "text-white" : "text-forest")}>
          {title}
        </h2>
      </div>
    );
  }

  return (
    <div className="v-stack md:h-stack justify-between items-end mb-12 md:mb-16 gap-6">
      <div className="mx-auto md:mx-0">
        <p className="text-sm font-bold tracking-widest text-sage mb-3">{eyebrow}</p>
        <h2 className={cn("text-[clamp(1.75rem,5vw,2.5rem)] font-serif font-bold", darkMode ? "text-white" : "text-forest")}>
          {title}
        </h2>
      </div>
      {cta ? (
        <button className="text-sunset font-bold flex items-center gap-2 hover:gap-3 transition-all">
          {cta.label} <ArrowRight className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
};

export default SectionHeader;
