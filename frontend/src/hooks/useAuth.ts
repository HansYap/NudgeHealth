import { useCallback, useState } from "react";
import type { LoginFormValues, LoginSubmitResult } from "../types/auth";

interface UseAuthReturn {
  isSubmitting: boolean;
  error: string | null;
  login: (values: LoginFormValues) => Promise<LoginSubmitResult>;
  clearError: () => void;
}

/**
 * Encapsulates the login request lifecycle (loading/error state).
 * Actual network call is injected/replaced with a real API client later.
 */
export function useAuth(): UseAuthReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (values: LoginFormValues): Promise<LoginSubmitResult> => {
      setIsSubmitting(true);
      setError(null);

      try {
        // TODO: replace with a real API call, e.g.
        // const res = await fetch("/api/login", { method: "POST", body: JSON.stringify(values) });
        void values;
        const result: LoginSubmitResult = await Promise.resolve({
          success: true,
        });

        if (!result.success) {
          setError(result.error ?? "Unable to log in. Please try again.");
        }

        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
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
