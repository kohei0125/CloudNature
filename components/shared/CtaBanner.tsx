import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CtaBannerProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

const CtaBanner = ({ eyebrow, title, description, primaryCta, secondaryCta }: CtaBannerProps) => {
  return (
    <section className="py-16 md:py-24 bg-forest text-white relative overflow-hidden texture-grain">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_30%,#8A9668,transparent_25%),radial-gradient(circle_at_80%_70%,#DD9348,transparent_25%),radial-gradient(circle_at_50%_50%,#C8E8FF,transparent_30%)]"></div>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
        {eyebrow ? (
          <p className="text-sm font-bold tracking-widest text-sage mb-4 uppercase">{eyebrow}</p>
        ) : null}
        <h2 className="text-[clamp(1.75rem,5vw,2.5rem)] font-serif font-bold mb-6">
          {title}
        </h2>
        <p className="text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="v-stack sm:h-stack gap-4 justify-center">
          <Link
            href={primaryCta.href}
            className="btn-puffy btn-puffy-accent px-8 py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-lg shadow-sunset/20 hover:shadow-sunset/40 transition-all"
          >
            {primaryCta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="px-8 py-4 border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
