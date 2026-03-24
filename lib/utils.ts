import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** パスがアクティブかどうかを判定する（"/" は完全一致、それ以外は前方一致） */
export function isPathActive(path: string, pathname: string): boolean {
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}

/** 日付を「YYYY年M月D日」形式にフォーマット */
export function formatDateJP(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

/** 日付を「YYYY.MM.DD」形式にフォーマット */
export function formatDateDot(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}
