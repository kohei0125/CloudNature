import SectionHeader from "@/components/shared/SectionHeader";
import FaqAccordion from "@/components/shared/FaqAccordion";
import { SERVICES_FAQ } from "@/content/services";

const ServicesFaq = () => {
  return (
    <section className="py-16 md:py-24 bg-mist">
      <div className="container mx-auto px-6 max-w-3xl">
        <SectionHeader eyebrow="FAQ" title="よくあるご質問" centered />
        <FaqAccordion items={SERVICES_FAQ} />
      </div>
    </section>
  );
};

export default ServicesFaq;
