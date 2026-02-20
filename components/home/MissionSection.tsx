import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MISSION_COPY, VALUES } from "@/content/home";

const MissionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white relative texture-grain overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left Column: Text */}
          <div className="text-center md:text-left z-10 relative">
            <p className="text-sm font-bold tracking-widest text-sage mb-4">{MISSION_COPY.eyebrow}</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-serif font-bold text-forest mb-8 text-balance md:text-wrap">
              {MISSION_COPY.title}
            </h2>
            <p className="text-sm leading-loose text-gray-600 md:text-base mb-8 md:mb-0">
              {MISSION_COPY.paragraphs[0]}
              <br className="hidden md:block" />
              {MISSION_COPY.paragraphs[1]}
              <br className="hidden md:block" />
              {MISSION_COPY.paragraphs[2]}
            </p>
          </div>

          {/* Right Column: Glassmorphism Cards */}
          <div className="relative">
            {/* Abstract Background Blob for Glass Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-cloud/30 via-sage/20 to-sunset/20 rounded-full blur-3xl opacity-60"></div>

            <div className="relative space-y-4 md:space-y-6">
              {VALUES.map((value, index) => {
                const textColors = ["text-sage", "text-sunset", "text-sea"] as const;
                const icons = ["/images/logo_green.png", "/images/logo_orange.png", "/images/logo_blue.png"];
                const textColor = textColors[index];
                const iconSrc = icons[index];

                return (
                  <div
                    key={index}
                    className="group flex items-start gap-5 p-5 md:p-6 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm hover:shadow-lg hover:bg-white/60 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Number */}
                    <div
                      className={`text-5xl md:text-6xl font-bold absolute -right-2 -top-4 font-serif pointer-events-none select-none group-hover:scale-110 transition-transform opacity-20 ${textColor}`}
                    >
                      0{index + 1}
                    </div>

                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full center shadow-sm transition-colors relative z-10">
                      <Image
                        src={iconSrc}
                        alt=""
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </div>

                    <div className="relative z-10">
                      <h4 className="text-lg font-bold text-forest mb-1">{value.displayTitle}</h4>
                      <p className={`text-xs font-bold mb-2 tracking-wider ${textColor}`}>{value.subtitle}</p>
                      <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/philosophy" className="text-sage font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
            私たちの想いを詳しく見る <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* SEO Content (Screen Reader Only) - Values List */}
        <div className="sr-only">
          <ul>
            {VALUES.map((value, index) => (
              <li key={index}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
