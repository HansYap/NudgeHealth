// Shared types for authentication / login flow

export type Locale = "en" | "bm";

export interface LoginFormValues {
  identifier: string;
  password: string;
}

export interface LoginFormErrors {
  identifier?: string;
  password?: string;
  form?: string; // top-level/server error
}

export interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface TrustBadge {
  id: string;
  label: string;
}

export interface LoginSubmitResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface SignupSubmitResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}
