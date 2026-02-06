import { ArrowRight } from "lucide-react";

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
        <p className={`text-sm font-bold tracking-widest mb-3 uppercase ${darkMode ? "text-[#8A9668]" : "text-[#8A9668]"}`}>
          {eyebrow}
        </p>
        <h2 className={`text-[clamp(1.75rem,5vw,2.5rem)] font-serif font-bold ${darkMode ? "text-white" : "text-[#19231B]"}`}>
          {title}
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
      <div>
        <p className="text-sm font-bold tracking-widest text-[#8A9668] mb-3">{eyebrow}</p>
        <h2 className={`text-[clamp(1.75rem,5vw,2.5rem)] font-serif font-bold ${darkMode ? "text-white" : "text-[#19231B]"}`}>
          {title}
        </h2>
      </div>
      {cta && (
        <button className="text-[#DD9348] font-bold flex items-center gap-2 hover:gap-3 transition-all">
          {cta.label} <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
