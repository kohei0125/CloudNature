import { MapPin, Train } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { COMPANY_ACCESS } from "@/content/company";

const AccessSection = () => {
  return (
    <section id="access" aria-labelledby="access-heading" className="py-16 md:py-24 bg-white texture-grain">
      <div className="container mx-auto px-6 max-w-3xl">
        <SectionHeader
          eyebrow={COMPANY_ACCESS.eyebrow}
          title={COMPANY_ACCESS.title}
          centered
          headingId="access-heading"
        />

        <div className="glass-card rounded-2xl p-8 md:p-10">
          <div className="v-stack gap-6">
            <div className="h-stack gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-sage/10 center shrink-0">
                <MapPin className="w-5 h-5 text-sage" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">所在地</p>
                <p className="font-bold text-forest">
                  {COMPANY_ACCESS.postalCode}
                </p>
                <p className="text-sm text-gray-600">{COMPANY_ACCESS.address}</p>
              </div>
            </div>

            <div className="h-stack gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-teal-800/10 center shrink-0">
                <Train className="w-5 h-5 text-teal-800" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">アクセス</p>
                <p className="text-sm text-gray-600">
                  {COMPANY_ACCESS.description}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-forest/10">
              <iframe
                src={COMPANY_ACCESS.mapEmbedUrl}
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full md:h-[380px]"
                title="株式会社クラウドネイチャーの所在地マップ"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessSection;
