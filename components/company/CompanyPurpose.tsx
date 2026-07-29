import { COMPANY_PURPOSE } from "@/content/company";
import SkylineArt from "@/components/company/SkylineArt";

const CompanyPurpose = () => {
  return (
    <section
      id="purpose"
      aria-labelledby="purpose-heading"
      className="relative overflow-hidden bg-teal-50 py-16 md:py-24"
    >
      {/* 右下の山＋街並みライン画（装飾） */}
      <SkylineArt className="pointer-events-none absolute -bottom-2 right-0 hidden h-auto w-[520px] text-teal-700/25 md:block" />

      <div className="container relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-800">
          {COMPANY_PURPOSE.eyebrow}
        </p>
        <h2
          id="purpose-heading"
          className="mb-8 text-[clamp(1.5rem,4.5vw,2.25rem)] font-bold leading-[1.4] text-forest"
        >
          {COMPANY_PURPOSE.title}
        </h2>
        <div className="mx-auto max-w-2xl space-y-2 text-[15px] leading-[1.95] text-forest/70">
          {COMPANY_PURPOSE.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyPurpose;
