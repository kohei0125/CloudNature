import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** パスがアクティブかどうかを判定する（"/" は完全一致、それ以外は前方一致） */
export function isPathActive(path: string, pathname: string): boolean {
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}

const JP_TIME_ZONE = "Asia/Tokyo";
const JP_DATE_PARTS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: JP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getDateParts(value: string): { year: string; month: string; day: string } | null {
  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) {
    const parts = JP_DATE_PARTS_FORMATTER.formatToParts(date);

    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;

    if (year && month && day) {
      return { year, month, day };
    }
  }

  const fallbackMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!fallbackMatch) return null;

  const [, year, month, day] = fallbackMatch;
  return { year, month, day };
}

/** 日付を「YYYY年M月D日」形式にフォーマット */
export function formatDateJP(iso: string): string {
  const parts = getDateParts(iso);
  if (!parts) return iso;

  return `${Number(parts.year)}年${Number(parts.month)}月${Number(parts.day)}日`;
}

/** 日付を「YYYY.MM.DD」形式にフォーマット */
export function formatDateDot(iso: string): string {
  const parts = getDateParts(iso);
  if (!parts) return iso;

  return `${parts.year}.${parts.month}.${parts.day}`;
}
