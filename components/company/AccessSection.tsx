import { MapPin, Train } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { COMPANY_ACCESS } from "@/content/company";

const AccessSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white texture-grain">
      <div className="container mx-auto px-6 max-w-3xl">
        <SectionHeader
          eyebrow={COMPANY_ACCESS.eyebrow}
          title={COMPANY_ACCESS.title}
          centered
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
              <div className="w-10 h-10 rounded-full bg-sunset/10 center shrink-0">
                <Train className="w-5 h-5 text-sunset" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">アクセス</p>
                <p className="text-sm text-gray-600">
                  {COMPANY_ACCESS.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessSection;
