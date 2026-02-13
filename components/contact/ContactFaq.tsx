import SectionHeader from "@/components/shared/SectionHeader";
import FaqAccordion from "@/components/shared/FaqAccordion";
import { CONTACT_FAQ } from "@/content/contact";

const ContactFaq = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <SectionHeader eyebrow="FAQ" title="よくあるご質問" centered />
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={CONTACT_FAQ} />
        </div>
      </div>
    </section>
  );
};

export default ContactFaq;
