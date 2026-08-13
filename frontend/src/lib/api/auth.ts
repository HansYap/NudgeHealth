import type { AuthUser, LoginFormValues, SignupFormValues } from "../../types/auth";
import {
  clearAuthTokens,
  getAuthTokens,
  saveAuthTokens,
  type AuthTokens,
} from "../auth/tokens";
import { ApiError, apiRequest, authenticatedRequest } from "./client";

export function register(values: SignupFormValues) {
  return apiRequest<{ email: string }>("/auth/register/", {
    method: "POST",
    body: JSON.stringify({
      email: values.email,
      password: values.password,
      confirm_password: values.confirmPassword,
    }),
  });
}

export function login(email: string, password: string) {
  return apiRequest<AuthTokens>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function me() {
  if (!getAuthTokens()) return null;

  const user = await authenticatedRequest<{
    id: number | string;
    email: string;
  }>("/auth/me/");

  return mapUser(user);
}

export async function loginWithPassword(values: LoginFormValues) {
  const tokens = await login(values.identifier, values.password);
  saveAuthTokens(tokens);
  return me();
}

export async function logout() {
  const tokens = getAuthTokens();
  if (!tokens) return;

  try {
    await authenticatedRequest<void>("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh: tokens.refresh }),
    });
  } finally {
    clearAuthTokens();
  }
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

function resolveErrorMessage(
  payload: Record<string, string | string[]> | null
): string | null {
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
