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
 *
 * rel に `noreferrer` を付けないのは、遷移先が自社サブドメインであり、
 * Referer を残さないと _ga Cookie を共有できない環境（プレビュー環境など）で
 * 流入元が (direct) に落ちて Organic → 見積もり の経路が追えなくなるため。
 * `noopener` は window.opener 経由の干渉を防ぐために付ける。
 */
const EstimateCtaLink = ({
  ctaLocation,
  className,
  children,
}: EstimateCtaLinkProps) => (
  <a
    href={ESTIMATE_URL}
    target="_blank"
    rel="noopener"
    className={className}
    onClick={() => trackEstimateCtaClick(ctaLocation)}
  >
    {children}
  </a>
);

export default EstimateCtaLink;
