import type { AuthUser, LoginFormValues, SignupFormValues } from "../../types/auth";
import {
  clearAuthTokens,
  getAuthTokens,
  saveAuthTokens,
  type AuthTokens,
} from "../auth/tokens";

type ApiErrorPayload = Record<string, string | string[]> & {
  detail?: string | string[];
};

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

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8000/api";

async function parseJson(response: Response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new ApiError(response.status, payload);
  }

  return payload as T;
}

export function register(values: SignupFormValues) {
  return request<{ email: string }>("/auth/register/", {
    method: "POST",
    body: JSON.stringify({
      email: values.email,
      password: values.password,
      confirm_password: values.confirmPassword,
    }),
  });
}

export function login(email: string, password: string) {
  return request<AuthTokens>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function me() {
  const tokens = getAuthTokens();
  if (!tokens) return null;

  const user = await request<{ id: number | string; email: string }>("/auth/me/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokens.access}`,
    },
  });

  return mapUser(user);
}

export async function loginWithPassword(values: LoginFormValues) {
  const tokens = await login(values.identifier, values.password);
  saveAuthTokens(tokens);
  return me();
}

export async function logout() {
  const tokens = getAuthTokens();
  clearAuthTokens();

  if (!tokens) return;

  await request<void>("/auth/logout/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokens.access}`,
    },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
}

export function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) {
    return "Email or password is incorrect.";
  }

  return error instanceof Error
    ? error.message
    : "Unable to log in. Please try again.";
}

export function getSignupErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error
      ? error.message
      : "Unable to create your account. Please try again.";
  }

  const emailMessage = getFirstMessage(error.payload?.email);
  if (
    error.status === 400 &&
    emailMessage &&
    ["already", "exists", "unique"].some((word) =>
      emailMessage.toLowerCase().includes(word)
    )
  ) {
    return "This email is already registered.";
  }

  const confirmPasswordMessage = getFirstMessage(error.payload?.confirm_password);
  if (confirmPasswordMessage) {
    return "Passwords do not match.";
  }

  return resolveErrorMessage(error.payload) ?? "Unable to create your account.";
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

function mapUser(user: { id: number | string; email: string }): AuthUser {
  return {
    id: String(user.id),
    name: user.email,
    email: user.email,
  };
}
