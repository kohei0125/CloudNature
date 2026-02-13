import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Check } from "lucide-react";
import { HEADER_COPY, FOOTER_COPY } from "@/content/layout";

const BADGE_ICONS = { ShieldCheck, Check } as const;

const Footer = () => {
  return (
    <footer className="bg-forest text-white pt-24 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('/images/wood-pattern.svg')]"></div>
      <div className="absolute top-10 left-10 w-64 h-64 pointer-events-none opacity-5">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current text-white">
          <path d="M100,0 C120,50 180,80 200,100 C150,120 120,180 100,200 C80,150 20,120 0,100 C50,80 80,20 100,0 Z M100,0 L100,200 M0,100 L200,100" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="mb-6">
              <Image
                src="/images/footer_logo.png"
                alt={HEADER_COPY.brand}
                width={200}
                height={60}
                className="object-contain h-10 md:h-12 w-auto"
                priority={false}
              />
            </div>
            <p className="text-gray-400 leading-loose max-w-md mb-8 pl-1">
              {FOOTER_COPY.taglineLines[0]}
              <br />
              {FOOTER_COPY.taglineLines[1]}
              <br />
              {FOOTER_COPY.taglineLines[2]}
            </p>
            <div className="flex gap-4 pl-1">
              {FOOTER_COPY.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-sunset transition-colors group"
                >
                  <span className="text-xs font-bold group-hover:text-white">{s.abbr}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sage tracking-widest text-sm uppercase">{FOOTER_COPY.serviceHeading}</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {FOOTER_COPY.serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.path} className="group hover:text-white transition-colors relative block">
                    <span className="absolute -left-5 top-1/2 -translate-y-1/2 text-sunset opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sage tracking-widest text-sm uppercase">{FOOTER_COPY.companyHeading}</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {FOOTER_COPY.companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.path} className="group hover:text-white transition-colors relative block">
                    <span className="absolute -left-5 top-1/2 -translate-y-1/2 text-sunset opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>{FOOTER_COPY.copyright}</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            {FOOTER_COPY.badges.map((badge) => {
              const Icon = BADGE_ICONS[badge.icon];
              return (
                <div key={badge.label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-sage" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
