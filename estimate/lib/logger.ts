/**
 * Lightweight logger for estimate app.
 *
 * - Server-side (API routes): always logs (goes to server logs, not client).
 * - Client-side: logs only in development to keep browser console clean.
 */

const isServer = typeof window === "undefined";
const isDev = process.env.NODE_ENV !== "production";

export const logger = {
  error(tag: string, ...args: unknown[]) {
    if (isServer || isDev) {
      console.error(`[${tag}]`, ...args);
    }
  },
};
