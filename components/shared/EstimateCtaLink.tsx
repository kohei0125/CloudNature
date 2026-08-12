"use client";

import type { ReactNode } from "react";
import { ESTIMATE_URL } from "@/content/common";
import { trackEstimateCtaClick, type EstimateCtaLocation } from "@/lib/analytics";

interface EstimateCtaLinkProps {
  /** どの配置のCTAか。GA4 で導線ごとのクリック数を分離するために使う。 */
  ctaLocation: EstimateCtaLocation;
  className?: string;
  children: ReactNode;
}

/**
 * AI見積もり（ai.cloudnature.jp）への導線。
 * クリックを GA4 に送るためだけのクライアントコンポーネントで、
 * 呼び出し元（HeroSection 等）は Server Component のまま維持できる。
 */
const EstimateCtaLink = ({
  ctaLocation,
  className,
  children,
}: EstimateCtaLinkProps) => (
  <a
    href={ESTIMATE_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
    onClick={() => trackEstimateCtaClick(ctaLocation)}
  >
    {children}
  </a>
);

export default EstimateCtaLink;
