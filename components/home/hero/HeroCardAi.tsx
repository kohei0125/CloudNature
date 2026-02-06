import { Bot } from "lucide-react";
import { HERO_BENTO } from "@/content/home";

const HeroCardAi = () => {
  return (
    <div className="h-[260px] md:h-[240px] lg:h-full rounded-[24px] md:rounded-[40px] glass-card p-4 md:p-5 flex flex-col justify-between relative overflow-visible transform transition-all hover:-translate-y-2 duration-500 z-20 w-full">
      {/* Bleeding Element: Bot Icon popping out */}
      <div className="absolute top-3 right-3 md:-top-4 md:-right-4 w-10 h-10 md:w-14 md:h-14 bg-[#DD9348] rounded-xl md:rounded-2xl rotate-0 md:rotate-12 flex items-center justify-center shadow-lg md:animate-blob animation-delay-2000 border-2 md:border-4 border-[#EDE8E5]">
        <Bot className="text-white w-5 h-5 md:w-7 md:h-7 rotate-0 md:-rotate-12" />
      </div>

      <div className="mt-2 h-full flex flex-col justify-between">
        <h4 className="font-bold text-[#19231B] leading-tight text-sm">
          {HERO_BENTO.aiCardTitleLines[0]}
          <br />
          {HERO_BENTO.aiCardTitleLines[1]}
        </h4>

        {/* Animated Abstract Workflow */}
        <div className="relative h-20 w-full mt-2">
          {/* Nodes */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#8A9668] animate-pulse"></div>
          <div className="absolute top-8 right-4 w-2 h-2 rounded-full bg-[#8A9668] animate-pulse delay-700"></div>
          <div className="absolute bottom-2 left-6 w-2 h-2 rounded-full bg-[#DD9348] animate-pulse delay-300"></div>

          {/* Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <path
              d="M 12 12 L 30 60"
              stroke="#8A9668"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="opacity-50"
            />
            <path
              d="M 30 60 L 80 40"
              stroke="#DD9348"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="opacity-50"
            />
            <path
              d="M 80 40 L 12 12"
              stroke="#8A9668"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="opacity-50"
            />
          </svg>

          {/* Processing Chip */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-gray-100 shadow-sm">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-[#19231B] rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-[#19231B] rounded-full animate-bounce delay-100"></div>
              <div className="w-1 h-1 bg-[#19231B] rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCardAi;
