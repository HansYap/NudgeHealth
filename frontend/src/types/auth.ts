// Shared types for authentication / login flow

export type Locale = "en" | "bm";

export interface LoginFormValues {
  identifier: string; // email or phone number
  password: string;
}

export interface LoginFormErrors {
  identifier?: string;
  password?: string;
  form?: string; // top-level/server error
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
