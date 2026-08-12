import Link from "next/link";
import type { ReactNode } from "react";
import { ESTIMATE_URL } from "@/content/common";
import EstimateCtaLink from "@/components/shared/EstimateCtaLink";
import type { EstimateCtaLocation } from "@/lib/analytics";

interface SmartLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  /**
   * AI見積もりへの導線のときだけ意味を持つ、CTAの配置ラベル。
   * 省略すると `other` として計測され、GA4 上でどの導線か分からなくなるので、
   * 見積もりへ送る箇所では必ず指定する。
   */
  ctaLocation?: EstimateCtaLocation;
}

/** 外部リンク（別タブで開く）かどうか。アイコンの出し分けなど描画側でも使う */
export const isExternalHref = (href: string) => href.startsWith("http");

/**
 * 内部リンクは next/link、外部リンク（http から始まる URL）は別タブで開く <a> を描画する。
 * ai.cloudnature.jp のようなサブドメインへの導線は「別タブで開く」のがサイト全体の慣習
 * （HeroSection・InlineCta・ServiceDetailCard・記事本文いずれも target="_blank"）。
 *
 * AI見積もりへの導線だけは EstimateCtaLink に委譲し、`estimate_cta_click` を発火させる。
 * ここで一元的に振り分けることで、content 側にCTAを増やしても計測漏れが起きないようにしている
 * （以前は呼び出し側が個別に EstimateCtaLink を使う必要があり、6箇所が未計測だった）。
 *
 * サーバーコンポーネントからも使えるよう "use client" は付けない。
 */
const SmartLink = ({ href, className, children, ctaLocation }: SmartLinkProps) => {
  if (href === ESTIMATE_URL) {
    return (
      <EstimateCtaLink ctaLocation={ctaLocation ?? "other"} className={className}>
        {children}
      </EstimateCtaLink>
    );
  }

  return isExternalHref(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

export default SmartLink;
