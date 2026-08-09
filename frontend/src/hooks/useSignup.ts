import { useCallback, useState } from "react";
import { getSignupErrorMessage, login, me, register } from "../lib/api/auth";
import { saveAuthTokens } from "../lib/auth/tokens";
import type { SignupFormValues, SignupSubmitResult } from "../types/auth";

interface UseSignupReturn {
  isSubmitting: boolean;
  error: string | null;
  signup: (values: SignupFormValues) => Promise<SignupSubmitResult>;
  clearError: () => void;
}

/** Mirrors useAuth for the signup request lifecycle. */
export function useSignup(): UseSignupReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(
    async (values: SignupFormValues): Promise<SignupSubmitResult> => {
      setIsSubmitting(true);
      setError(null);

      try {
        await register(values);
        const tokens = await login(values.email, values.password);
        saveAuthTokens(tokens);
        const user = await me();

        return { success: true, user: user ?? undefined };
      } catch (err) {
        const message = getSignupErrorMessage(err);
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
