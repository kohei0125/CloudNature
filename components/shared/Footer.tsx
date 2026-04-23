import Link from "next/link";
import Image from "next/image";
import { HEADER_COPY, FOOTER_COPY } from "@/content/layout";

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Left: Logo + Description + Legal */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/cloudnature_white.png"
                alt={HEADER_COPY.brand}
                width={180}
                height={50}
                className="object-contain h-9 md:h-10 w-auto"
                priority={false}
              />
            </div>
            <p className="text-teal-200/70 text-sm leading-relaxed mb-6">
              {FOOTER_COPY.description}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-teal-200/50">
              {FOOTER_COPY.legalLinks.map((link) => (
                <Link key={link.label} href={link.path} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: SERVICE links */}
          <div>
            <h4 className="font-bold mb-5 text-teal-300 tracking-[0.2em] text-xs uppercase">
              {FOOTER_COPY.serviceHeading}
            </h4>
            <ul className="v-stack gap-3 text-teal-200/70 text-sm">
              {FOOTER_COPY.serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.path} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: COMPANY links */}
          <div>
            <h4 className="font-bold mb-5 text-teal-300 tracking-[0.2em] text-xs uppercase">
              {FOOTER_COPY.companyHeading}
            </h4>
            <ul className="v-stack gap-3 text-teal-200/70 text-sm">
              {FOOTER_COPY.companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.path} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-teal-200/40">
          <p>{FOOTER_COPY.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
