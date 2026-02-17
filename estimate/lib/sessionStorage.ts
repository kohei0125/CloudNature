const STORAGE_PREFIX = "cn_estimate_";
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const SCHEMA_VERSION = 1;

interface StoredData<T> {
  v: number;
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Save data to localStorage with a timestamp and TTL.
 */
export function save<T>(key: string, data: T, ttl = DEFAULT_TTL_MS): void {
  try {
    const stored: StoredData<T> = {
      v: SCHEMA_VERSION,
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(
      STORAGE_PREFIX + key,
      JSON.stringify(stored)
    );
  } catch {
    // localStorage may be full or unavailable; silently fail
  }
}

/**
 * Load data from localStorage. Returns null if expired or unavailable.
 */
export function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;

    const stored: StoredData<T> = JSON.parse(raw);

    // Discard data from older schema versions
    if (stored.v !== SCHEMA_VERSION) {
      clear(key);
      return null;
    }

    // Check TTL
    if (Date.now() - stored.timestamp > stored.ttl) {
      clear(key);
      return null;
    }

    return stored.data;
  } catch {
    return null;
  }
}

/**
 * Remove data from localStorage.
 */
export function clear(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    // silently fail
  }
}
