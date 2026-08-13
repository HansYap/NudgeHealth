import {
  clearAuthTokens,
  getAuthTokens,
  saveAuthTokens,
  type AuthTokens,
} from "../auth/tokens";
import { API_BASE_URL } from "./config";

type ApiErrorPayload = Record<string, string | string[]> & {
  detail?: string | string[];
};

interface RefreshResponse {
  access: string;
  refresh?: string;
}

const TRANSIENT_STATUSES = new Set([502, 503, 504]);
let refreshRequest: Promise<AuthTokens> | null = null;

export class ApiError extends Error {
  status: number;
  payload: ApiErrorPayload | null;

  constructor(status: number, payload: ApiErrorPayload | null) {
    super(resolveErrorMessage(payload) ?? "Request failed.");
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  retryTransient = isReadOnlyRequest(init)
): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init.headers,
        },
      });

      if (
        retryTransient &&
        attempt === 0 &&
        TRANSIENT_STATUSES.has(response.status)
      ) {
        attempt += 1;
        await wait(750);
        continue;
      }

      const payload = await parseJson(response);
      if (!response.ok) {
        throw new ApiError(response.status, toErrorPayload(payload));
      }

      return payload as T;
    } catch (error) {
      if (retryTransient && attempt === 0 && !(error instanceof ApiError)) {
        attempt += 1;
        await wait(750);
        continue;
      }

      throw error;
    }
  }
}

export async function authenticatedRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const tokens = getAuthTokens();
  if (!tokens) {
    throw new ApiError(401, { detail: "Authentication required." });
  }

  try {
    return await requestWithAccessToken<T>(path, init, tokens.access);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;

    const latestTokens = getAuthTokens();
    if (latestTokens && latestTokens.access !== tokens.access) {
      return requestWithAccessToken<T>(path, init, latestTokens.access);
    }

    const refreshedTokens = await refreshAuthTokens(tokens.refresh);
    return requestWithAccessToken<T>(path, init, refreshedTokens.access);
  }
}

function requestWithAccessToken<T>(
  path: string,
  init: RequestInit,
  accessToken: string
) {
  return apiRequest<T>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
  });
}

function refreshAuthTokens(refreshToken: string): Promise<AuthTokens> {
  if (!refreshRequest) {
    refreshRequest = apiRequest<RefreshResponse>(
      "/auth/login/refresh/",
      {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      },
      true
    )
      .then((response) => {
        const tokens = {
          access: response.access,
          refresh: response.refresh ?? refreshToken,
        };
        saveAuthTokens(tokens);
        return tokens;
      })
      .catch((error) => {
        if (
          error instanceof ApiError &&
          (error.status === 400 || error.status === 401)
        ) {
          clearAuthTokens();
          throw new ApiError(401, { detail: "Your session has expired." });
        }
        throw error;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function toErrorPayload(payload: unknown): ApiErrorPayload | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  return payload as ApiErrorPayload;
}

function isReadOnlyRequest(init: RequestInit) {
  const method = (init.method ?? "GET").toUpperCase();
  return method === "GET" || method === "HEAD" || method === "OPTIONS";
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function resolveErrorMessage(payload: ApiErrorPayload | null): string | null {
  if (!payload) return null;

  return (
    getFirstMessage(payload.detail) ??
    getFirstMessage(payload.email) ??
    getFirstMessage(payload.confirm_password) ??
    null
  );
}

function getFirstMessage(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}
