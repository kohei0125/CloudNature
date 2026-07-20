// IP・メールアドレスごとの簡易レート制限（インメモリ・API Route 用）
// 利用例: const checkRateLimit = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

/** リクエストヘッダーからクライアント IP を取得する（レート制限のキー用） */
export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

interface RateLimiterOptions {
  /** 制限ウィンドウ（ミリ秒） */
  windowMs: number;
  /** ウィンドウ内の最大リクエスト数 */
  max: number;
}

/** Returns a function that returns `true` if the request is allowed, `false` if rate-limited. */
export function createRateLimiter({ windowMs, max }: RateLimiterOptions) {
  const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();

  function cleanup() {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now - entry.firstRequest > windowMs) {
        rateLimitMap.delete(key);
      }
    }
  }

  return function checkRateLimit(key: string): boolean {
    if (rateLimitMap.size > 100) {
      cleanup();
    }

    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now - entry.firstRequest > windowMs) {
      rateLimitMap.set(key, { count: 1, firstRequest: now });
      return true;
    }

    if (entry.count >= max) {
      return false;
    }

    entry.count++;
    return true;
  };
}
