import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MISSION_COPY, VALUES } from "@/content/home";

const VALUE_ICONS = [
  "/images/renewal/icon_value_1_tr.png",
  "/images/renewal/icon_value_2_tr.png",
  "/images/renewal/icon_value_3_tr.png"
];

const MissionSection = () => {
  return (
    <section id="mission" aria-labelledby="mission-heading" className="py-16 md:py-20 bg-teal-50">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 lg:gap-14 items-center">

          {/* Left: ラベル + 見出し + 説明 + リンク */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-teal-800 mb-3 uppercase">
              {MISSION_COPY.eyebrow}
            </p>
            <h2 id="mission-heading" className="text-[1.5rem] md:text-[1.65rem] font-bold text-gray-900 mb-5 leading-[1.5]">
              {MISSION_COPY.titleLine1}
              <br />
              {MISSION_COPY.titleLine2}
            </h2>
            <div className="text-[13px] text-gray-500 leading-[1.9] mb-6">
              {MISSION_COPY.paragraphs.map((line, i) => (
                <span key={i}>
                  {line === "" ? <br /> : <>{line}<br /></>}
                </span>
              ))}
            </div>
            <Link
              href={MISSION_COPY.link.href}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-800 hover:text-teal-700 transition-colors"
            >
              {MISSION_COPY.link.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: 3つのバリューカード（横並び・中央揃え） */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {VALUES.map((value, index) => (
              <div key={index} className="text-center px-2">
                <div className="flex justify-center mb-3">
                  <Image
                    src={VALUE_ICONS[index]}
                    alt=""
                    width={52}
                    height={52}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-[13px] font-bold text-gray-900 mb-2 leading-[1.6]">
                  {value.displayTitle}
                </h3>
                <p className="text-xs text-gray-500 leading-[1.8]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default MissionSection;
