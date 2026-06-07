export const CANONICAL_SITE_URL = "https://cloudnature.jp";

/** 本番環境かどうか（レート制限・Turnstile 検証などの有効化判定に使用） */
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";

function parseUrl(value?: string): URL | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function isIndexableDeployment(): boolean {
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV === "production";
  }

  const siteUrl = parseUrl(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL);
  return siteUrl?.origin === CANONICAL_SITE_URL;
}
