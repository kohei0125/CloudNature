export function getBackendHeaders(): HeadersInit {
  const key = process.env.BACKEND_API_KEY;
  if (!key) throw new Error("BACKEND_API_KEY is not configured");
  return { "Content-Type": "application/json", "X-API-Key": key };
}
