import { useState, type FormEvent } from "react";
import { Input } from "../ui/Input";
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";
import { ForgotPasswordLink } from "./ForgotPasswordLink";
import { loginSchema } from "../../lib/validation/loginSchema";
import { useAuth } from "../../hooks/useAuth";
import type {
  LoginFormErrors,
  LoginFormValues,
  LoginSubmitResult,
} from "../../types/auth";

export interface LoginFormCopy {
  identifierLabel: string;
  passwordLabel: string;
  forgotPassword: string;
  submit: string;
}

export interface LoginFormProps {
  copy: LoginFormCopy;
  /** Called after a successful login submit */
  onSuccess?: (result: LoginSubmitResult) => void;
  /** Called when the "Forgot password?" link is activated */
  onForgotPassword?: () => void;
}

const INITIAL_VALUES: LoginFormValues = {
  identifier: "",
  password: "",
};

/**
 * Controlled login form: owns field state, runs zod validation on submit,
 * and delegates the actual request to the useAuth hook.
 */
export function LoginForm({
  copy,
  onSuccess,
  onForgotPassword,
}: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { isSubmitting, error: submitError, login } = useAuth();

  const handleChange =
    (field: keyof LoginFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: LoginFormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof LoginFormErrors;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const result = await login(parsed.data);
    if (result.success) {
      onSuccess?.(result);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Input
        id="identifier"
        name="identifier"
        label={copy.identifierLabel}
        value={values.identifier}
        onChange={handleChange("identifier")}
        error={errors.identifier}
        autoComplete="username"
        inputMode="email"
      />

      <div>
        <PasswordInput
          id="password"
          name="password"
          label={copy.passwordLabel}
          value={values.password}
          onChange={handleChange("password")}
          error={errors.password}
          autoComplete="current-password"
        />
        <div className="mt-2 flex justify-end">
          <ForgotPasswordLink
            label={copy.forgotPassword}
            onClick={onForgotPassword}
          />
        </div>
      </div>

      {(errors.form || submitError) && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {errors.form ?? submitError}
        </p>
      )}

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        {copy.submit}
      </Button>
    </form>
  );
}
