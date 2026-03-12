import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** パスがアクティブかどうかを判定する（"/" は完全一致、それ以外は前方一致） */
export function isPathActive(path: string, pathname: string): boolean {
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}
