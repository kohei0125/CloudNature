import Link from "next/link";
import Image from "next/image";
import SmartLink from "@/components/shared/SmartLink";
import { HEADER_COPY, FOOTER_COPY } from "@/content/layout";

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Left: Logo + Description + Legal */}
          <div>
            <div className="mb-4">
              {/* SVG は余白なしのため、旧 PNG（余白込み h-9/h-10）と見た目が同じサイズになる高さに調整 */}
              <Image
                src="/images/cloudnature_logo_horizontal_white.svg"
                alt={HEADER_COPY.brand}
                width={258}
                height={45}
                className="object-contain h-7 md:h-8 w-auto"
                priority={false}
                unoptimized
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
                  {link.external ? (
                    // SmartLink 経由にすることで、AI見積もりへの導線は estimate_cta_click が発火する
                    <SmartLink
                      href={link.path}
                      ctaLocation="nav"
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </SmartLink>
                  ) : (
                    <Link href={link.path} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  )}
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
