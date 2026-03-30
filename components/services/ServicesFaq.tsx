import SectionHeader from "@/components/shared/SectionHeader";
import FaqAccordion from "@/components/shared/FaqAccordion";
import { SERVICES_FAQ } from "@/content/services";
import type { FaqItem } from "@/types";

interface ServicesFaqProps {
  items?: FaqItem[];
}

const ServicesFaq = ({ items }: ServicesFaqProps) => {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-16 md:py-24 bg-mist">
      <div className="container mx-auto px-6 max-w-3xl">
        <SectionHeader eyebrow="FAQ" title="よくあるご質問" centered headingId="faq-heading" />
        <FaqAccordion items={items ?? SERVICES_FAQ} />
      </div>
    </section>
  );
};

export default ServicesFaq;
