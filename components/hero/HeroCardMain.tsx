import { Users } from "lucide-react";
import Image from "next/image";
import { HERO_COPY, HERO_BENTO } from "@/content/strings";

const HeroCardMain = () => {
  return (
    <div className="h-[260px] md:h-[300px] lg:h-full rounded-[24px] md:rounded-[40px] overflow-hidden relative shadow-2xl glass-card group w-full">
      {/* Background Image */}
      <Image
        src={HERO_COPY.imageSrc}
        alt={HERO_COPY.heroImageAlt}
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition-transform duration-[2000ms] group-hover:scale-110 saturate-[0.8] group-hover:saturate-100"
      />
      {/* Texture Overlay on Image */}
      <div className="absolute inset-0 texture-grain opacity-20"></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#19231B]/90 via-[#19231B]/10 to-transparent"></div>

      {/* Content Overlay */}
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <Users className="w-3 h-3 text-[#DD9348]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0F2F5]">
            {HERO_BENTO.caseBadge}
          </span>
        </div>
        <p className="text-2xl leading-tight mb-2 font-bold">
          {HERO_BENTO.caseTitle}
        </p>
        <p className="text-sm text-gray-300">{HERO_BENTO.caseDesc}</p>
      </div>
    </div>
  );
};

export default HeroCardMain;
