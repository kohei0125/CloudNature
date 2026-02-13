import { CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { PRICING_APPROACH } from "@/content/services";

const PricingApproach = () => {
  return (
    <section className="py-16 md:py-24 bg-white texture-grain">
      <div className="container mx-auto px-6">
        <SectionHeader eyebrow="PRICING" title="料金の考え方" centered />

        <div className="grid md:grid-cols-3 gap-8">
          {PRICING_APPROACH.map((item, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6 md:p-8 hover:shadow-lg hover:bg-white/80 transition-all duration-300 group"
            >
              <CheckCircle2 className="w-6 h-6 text-sage mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-forest text-lg mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingApproach;
