const DEFAULT_API_URL = "https://nudgehealth-3g61.onrender.com/api";

const configuredApiUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  (import.meta.env.VITE_API_URL as string | undefined) ??
  DEFAULT_API_URL;

export const API_BASE_URL = normalizeApiUrl(configuredApiUrl);

function normalizeApiUrl(url: string) {
  const trimmedUrl = url.replace(/\/+$/, "");
  return trimmedUrl.endsWith("/api") ? trimmedUrl : `${trimmedUrl}/api`;
}
