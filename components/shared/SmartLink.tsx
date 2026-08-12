import Link from "next/link";
import type { ReactNode } from "react";

interface SmartLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/**
 * 内部リンクは next/link、外部リンク（http から始まる URL）は別タブで開く <a> を描画する。
 * ai.cloudnature.jp のようなサブドメインへの導線は「別タブで開く」のがサイト全体の慣習
 * （HeroSection・InlineCta・ServiceDetailCard・記事本文いずれも target="_blank"）。
 *
 * サーバーコンポーネントからも使えるよう "use client" は付けない。
 */
/** 外部リンク（別タブで開く）かどうか。アイコンの出し分けなど描画側でも使う */
export const isExternalHref = (href: string) => href.startsWith("http");

const SmartLink = ({ href, className, children }: SmartLinkProps) =>
  isExternalHref(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );

export default SmartLink;
