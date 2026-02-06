import { TrendingUp } from "lucide-react";
import { HERO_BENTO } from "@/content/strings";

const HeroCardMetrics = () => {
  return (
    <div className="h-[260px] md:h-[220px] lg:h-full rounded-[24px] md:rounded-[40px] glass-card-dark p-4 md:p-6 flex flex-col justify-center relative overflow-hidden group shadow-2xl texture-grain border border-white/5 w-full">
      {/* Dynamic abstract background line */}
      <div className="absolute top-1/2 left-0 w-full h-32 bg-gradient-to-t from-[#8A9668]/20 to-transparent transform -skew-y-12 translate-y-4"></div>

      <TrendingUp className="w-8 h-8 text-[#DD9348] mb-4 relative z-10" />
      <div className="relative z-10">
        <p className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">
          {HERO_BENTO.metricLabel}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl md:text-5xl font-bold text-white highlight-cloud">
            {HERO_BENTO.metricValue}
          </span>
          <span className="text-base md:text-xl text-[#8A9668] font-bold">
            {HERO_BENTO.metricUnit}
          </span>
        </div>
        <p className="text-gray-400 text-[10px] md:text-xs mt-1 md:mt-2 leading-tight whitespace-pre-line">
          {HERO_BENTO.metricDesc}
        </p>
      </div>
    </div>
  );
};

export default HeroCardMetrics;
