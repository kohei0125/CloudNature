import Image from "next/image";
import { ArrowRight, ShieldCheck, Check } from "lucide-react";
import { LP_COPY } from "@/content/estimate";

const { footer } = LP_COPY;

const BADGE_ICONS = { ShieldCheck, Check } as const;

export default function FooterSection() {
  return (
    <footer className="relative overflow-hidden bg-forest pb-12 pt-24 text-white">
      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-16 grid gap-12 md:grid-cols-4">
          {/* Logo + tagline */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <Image
                src="/images/footer_logo.png"
                alt="CloudNature"
                width={200}
                height={60}
                className="h-10 w-auto object-contain md:h-12"
              />
            </div>
            <p className="max-w-md pl-1 leading-loose text-gray-400">
              {footer.taglineLines[0]}
              <br />
              {footer.taglineLines[1]}
              <br />
              {footer.taglineLines[2]}
            </p>
          </div>

          {/* Service links */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-sage">
              {footer.serviceHeading}
            </h4>
            <ul className="v-stack gap-4 text-sm text-gray-400">
              {footer.serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.path}
                    className="group relative block transition-colors hover:text-white"
                  >
                    <span className="absolute -left-5 top-1/2 -translate-y-1/2 text-sunset opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-sage">
              {footer.companyHeading}
            </h4>
            <ul className="v-stack gap-4 text-sm text-gray-400">
              {footer.companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.path}
                    className="group relative block transition-colors hover:text-white"
                  >
                    <span className="absolute -left-5 top-1/2 -translate-y-1/2 text-sunset opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="v-stack items-center justify-between border-t border-white/10 pt-8 text-xs text-gray-500 md:h-stack">
          <p>{footer.copyright}</p>
          <div className="mt-4 h-stack gap-8 md:mt-0">
            {footer.badges.map((badge) => {
              const Icon = BADGE_ICONS[badge.icon];
              return (
                <div key={badge.label} className="h-stack items-center gap-2">
                  <Icon className="h-4 w-4 text-sage" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
