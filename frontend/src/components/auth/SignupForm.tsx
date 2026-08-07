import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "../ui/Input";
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";
import { signupSchema } from "../../lib/validation/signupSchema";
import { useSignup } from "../../hooks/useSignup";
import type {
  SignupFormErrors,
  SignupFormValues,
  SignupSubmitResult,
} from "../../types/auth";

export interface SignupFormCopy {
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  submit: string;
}

export interface SignupFormProps {
  copy: SignupFormCopy;
  onSuccess?: (result: SignupSubmitResult) => void;
}

const INITIAL_VALUES: SignupFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

/**
 * Controlled signup form (email + password + confirm password).
 * Mirrors LoginForm so the two stay easy to maintain side by side.
 */
export function SignupForm({ copy, onSuccess }: SignupFormProps) {
  const [values, setValues] = useState<SignupFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const { isSubmitting, error: submitError, signup } = useSignup();

  const handleChange =
    (field: keyof SignupFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = signupSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: SignupFormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof SignupFormErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const result = await signup(values);
    if (result.success) {
      onSuccess?.(result);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Input
        id="signup-email"
        name="email"
        type="email"
        label={copy.emailLabel}
        value={values.email}
        onChange={handleChange("email")}
        error={errors.email}
        autoComplete="email"
        inputMode="email"
      />

      <PasswordInput
        id="signup-password"
        name="password"
        label={copy.passwordLabel}
        value={values.password}
        onChange={handleChange("password")}
        error={errors.password}
        autoComplete="new-password"
      />

      <PasswordInput
        id="signup-confirm-password"
        name="confirmPassword"
        label={copy.confirmPasswordLabel}
        value={values.confirmPassword}
        onChange={handleChange("confirmPassword")}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      {(errors.form || submitError) && (
        <p
          role="alert"
          className="rounded-lg bg-rust-light px-4 py-3 text-body-sm text-rust"
        >
          {errors.form ?? submitError}
        </p>
      )}

      <div className="pt-1">
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          {copy.submit}
        </Button>
      </div>
    </form>
  );
}
