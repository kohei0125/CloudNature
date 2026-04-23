import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  cta?: { label: string; href: string };
  centered?: boolean;
  darkMode?: boolean;
  headingId?: string;
  eyebrowColor?: string;
  ctaDesktopOnly?: boolean;
}

const SectionHeader = ({
  eyebrow,
  title,
  cta,
  centered = false,
  darkMode = false,
  headingId,
  eyebrowColor,
  ctaDesktopOnly = false,
}: SectionHeaderProps) => {
  const eyebrowCls = eyebrowColor || (darkMode ? "text-teal-300" : "text-teal-800");
  const titleCls = darkMode ? "text-white" : "text-gray-900";

  if (centered) {
    return (
      <div className="text-center mb-12 md:mb-16">
        <p className={cn("text-sm font-bold tracking-[0.2em] mb-3 uppercase", eyebrowCls)}>{eyebrow}</p>
        <h2 id={headingId} className={cn("text-2xl md:text-3xl font-bold", titleCls)}>{title}</h2>
      </div>
    );
  }

  return (
    <div className="v-stack md:h-stack justify-between items-end mb-8 md:mb-12 gap-4">
      <div className="mx-auto md:mx-0 text-center md:text-left">
        <p className={cn("text-sm font-bold tracking-[0.2em] mb-2 uppercase", eyebrowCls)}>{eyebrow}</p>
        <h2 id={headingId} className={cn("text-2xl md:text-3xl font-bold", titleCls)}>{title}</h2>
      </div>
      {cta && (
        <Link
          href={cta.href}
          className={cn(
            "font-bold items-center gap-2 hover:gap-3 transition-all text-sm",
            darkMode ? "text-teal-300 hover:text-teal-200" : "text-teal-800 hover:text-teal-700",
            ctaDesktopOnly ? "hidden md:inline-flex" : "inline-flex"
          )}
        >
          {cta.label} <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
