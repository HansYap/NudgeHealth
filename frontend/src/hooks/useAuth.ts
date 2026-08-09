import { useCallback, useState } from "react";
import { getLoginErrorMessage, loginWithPassword } from "../lib/api/auth";
import type { LoginFormValues, LoginSubmitResult } from "../types/auth";

interface UseAuthReturn {
  isSubmitting: boolean;
  error: string | null;
  login: (values: LoginFormValues) => Promise<LoginSubmitResult>;
  clearError: () => void;
}

/** Encapsulates the login request lifecycle (loading/error state). */
export function useAuth(): UseAuthReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (values: LoginFormValues): Promise<LoginSubmitResult> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const user = await loginWithPassword(values);
        return { success: true, user: user ?? undefined };
      } catch (err) {
        const message = getLoginErrorMessage(err);
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { isSubmitting, error, login, clearError };
}
