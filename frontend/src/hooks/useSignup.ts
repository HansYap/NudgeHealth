import { useCallback, useState } from "react";
import type { SignupFormValues, SignupSubmitResult } from "../types/auth";

interface UseSignupReturn {
  isSubmitting: boolean;
  error: string | null;
  signup: (values: SignupFormValues) => Promise<SignupSubmitResult>;
  clearError: () => void;
}

/**
 * Mirrors useAuth for the signup request lifecycle.
 * Swap the body of `signup` for the real accounts API call later.
 */
export function useSignup(): UseSignupReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(
    async (values: SignupFormValues): Promise<SignupSubmitResult> => {
      setIsSubmitting(true);
      setError(null);

      try {
        // TODO: replace with a real API call, e.g.
        // const res = await fetch("/api/accounts/signup", { method: "POST", ... });
        void values;
        const result: SignupSubmitResult = await Promise.resolve({
          success: true,
        });

        if (!result.success) {
          setError(
            result.error ?? "Unable to create your account. Please try again."
          );
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

  return { isSubmitting, error, signup, clearError };
}
