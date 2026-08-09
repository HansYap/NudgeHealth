const ACCESS_TOKEN_KEY = "nudgehealth.accessToken";
const REFRESH_TOKEN_KEY = "nudgehealth.refreshToken";

export interface AuthTokens {
  access: string;
  refresh: string;
}

export function saveAuthTokens(tokens: AuthTokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
}

export function getAuthTokens(): AuthTokens | null {
  const access = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!access || !refresh) return null;

  return { access, refresh };
}

export function hasAuthTokens() {
  return getAuthTokens() !== null;
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
