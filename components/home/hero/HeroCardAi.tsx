import { Bot } from "lucide-react";
import Image from "next/image";
import { HERO_BENTO } from "@/content/home";

const HeroCardAi = () => {
  return (
    <div className="h-[260px] md:h-[240px] lg:h-full rounded-[24px] md:rounded-[40px] bg-linen p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300 w-full border border-white/50">
      {/* Background Image - n8n style network */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/n8n-bg.png"
          alt="Network background"
          fill
          className="object-cover opacity-70 mix-blend-multiply"
        />
        {/* Subtle gradient overlay to blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-linen/80 via-transparent to-linen/40"></div>
      </div>

      {/* Static Icon Visual with Glassmorphism */}
      <div className="relative h-[80px] w-full flex items-end justify-start px-2 mt-4 z-10">
        <div className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-sm border border-white/60">
          <Bot className="w-6 h-6 text-sunset" />
        </div>
      </div>

      <div className="mt-2 relative z-10">
        <h4 className="font-bold text-forest leading-tight text-sm whitespace-pre-line mb-2">
          {HERO_BENTO.aiCard.title}
        </h4>
        <p className="text-[10px] text-gray-600 leading-relaxed md:whitespace-pre-line">
          {HERO_BENTO.aiCard.description}
        </p>
      </div>
    </div>
  );
};

export default HeroCardAi;
