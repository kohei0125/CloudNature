import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { CONTACT_HERO, STEP_FLOW_TITLE } from "@/content/contact";
import PageHero from "@/components/shared/PageHero";
import TrustBadges from "@/components/contact/TrustBadges";
import ContactForm from "@/components/contact/ContactForm";
import StepFlow from "@/components/contact/StepFlow";
import AlternativeContact from "@/components/contact/AlternativeContact";
import ContactFaq from "@/components/contact/ContactFaq";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: PAGE_META.contact.title,
  description: PAGE_META.contact.description,
  openGraph: {
    title: PAGE_META.contact.title,
    description: PAGE_META.contact.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.contact.title,
    description: PAGE_META.contact.description,
  },
  alternates: { canonical: "https://cloudnature.jp/contact" },
};

export default function ContactPage() {
  return (
    <div className="w-full bg-cream">
      <PageHero
        eyebrow={CONTACT_HERO.eyebrow}
        title={CONTACT_HERO.title}
        description={CONTACT_HERO.description}
      />
      <TrustBadges />

      {/* Form + Step Flow 2-column layout */}
      <ScrollReveal>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-5 gap-8 md:gap-12">
              <div className="md:col-span-3">
                <ContactForm />
              </div>
              <div className="md:col-span-2">
                <div className="sticky top-32">
                  <h3 className="font-bold text-forest text-lg mb-6">{STEP_FLOW_TITLE}</h3>
                  <StepFlow />
                  <div className="mt-8">
                    <AlternativeContact />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <ContactFaq />
      </ScrollReveal>
    </div>
  );
}
