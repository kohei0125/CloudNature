import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  cta?: { label: string; href: string; external?: boolean };
  centered?: boolean;
  darkMode?: boolean;
  /** eyebrow のカラークラス（デフォルト: "text-sage"） */
  eyebrowColor?: string;
  /** CTA をデスクトップのみ表示（モバイルで非表示） */
  ctaDesktopOnly?: boolean;
}

const SectionHeader = ({
  eyebrow,
  title,
  cta,
  centered = false,
  darkMode = false,
  eyebrowColor = "text-sage",
  ctaDesktopOnly = false,
}: SectionHeaderProps) => {
  if (centered) {
    return (
      <div className="text-center mb-16">
        <p className={cn("text-sm font-bold tracking-widest mb-3 uppercase", eyebrowColor)}>
          {eyebrow}
        </p>
        <h2 className={cn("text-[clamp(1.375rem,5vw,2.25rem)] font-serif font-bold", darkMode ? "text-white" : "text-forest")}>
          {title}
        </h2>
      </div>
    );
  }

  return (
    <div className="v-stack md:h-stack justify-between items-end mb-8 md:mb-16 gap-6">
      <div className="mx-auto md:mx-0 text-center md:text-left">
        <p className={cn("text-sm font-bold tracking-widest mb-3 uppercase", eyebrowColor)}>{eyebrow}</p>
        <h2 className={cn("text-[clamp(1.375rem,5vw,2.25rem)] font-serif font-bold", darkMode ? "text-white" : "text-forest")}>
          {title}
        </h2>
      </div>
      {cta ? (
        <Link
          href={cta.href}
          className={cn(
            "text-sunset font-bold items-center gap-2 hover:gap-3 transition-all",
            ctaDesktopOnly ? "hidden md:inline-flex" : "inline-flex"
          )}
        >
          {cta.label} {cta.external ? <ExternalLink className="w-4 h-4 flex-shrink-0" /> : <ArrowRight className="w-4 h-4 flex-shrink-0" />}
        </Link>
      ) : null}
    </div>
  );
};

export default SectionHeader;
