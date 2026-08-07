import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

/**
 * Fixed-choice field for onboarding/assessment questions (state, smoking
 * status, activity level, etc). Design System 04 + backend model choices
 * both require a closed set of options — never a free-text input here.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { id, label, options, placeholder, error, className = "", ...rest },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="mb-2 block text-caption text-ink-900"
        >
          {label}
        </label>

        <div className="relative">
          <select
            id={id}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            defaultValue=""
            className={`w-full min-h-tap appearance-none rounded-lg border bg-white px-4 py-3 pr-11
              text-body-sm text-ink-900 shadow-panel outline-none transition-colors duration-150 ease-out
              disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400
              ${
                error
                  ? "border-rust/50 focus:border-rust focus:ring-4 focus:ring-rust/10"
                  : "border-slate-200 hover:border-slate-300 focus:border-brand-700 focus:ring-4 focus:ring-brand-100"
              }
              ${className}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </div>

        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-body-sm text-rust">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
