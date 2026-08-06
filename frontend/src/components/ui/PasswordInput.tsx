import { forwardRef, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./Input";
import { usePasswordVisibility } from "../../hooks/usePasswordVisibility";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  id: string;
  label: string;
  error?: string;
}

/**
 * Password field with a built-in visibility toggle (eye icon).
 * Wraps the base Input and injects the toggle as a trailing adornment.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, label, error, ...inputProps }, ref) => {
    const { inputType, isVisible, toggle } = usePasswordVisibility();

    return (
      <Input
        id={id}
        label={label}
        error={error}
        ref={ref}
        type={inputType}
        trailingAdornment={
          <button
            type="button"
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            onClick={toggle}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400
              transition-colors duration-150 hover:text-slate-600
              focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-1"
          >
            {isVisible ? (
              <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" />
            ) : (
              <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
          </button>
        }
        {...inputProps}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
