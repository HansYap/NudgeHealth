import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  error?: string;
  /** Optional element rendered inside the input on the right (e.g. an icon button) */
  trailingAdornment?: React.ReactNode;
}

/**
 * Generic labeled text input. Base for email, phone, and password fields.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { id, label, error, trailingAdornment, className = "", ...inputProps },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-semibold text-ink-900"
        >
          {label}
        </label>

        <div className="relative">
          <input
            id={id}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-[15px] leading-6 text-ink-900
              shadow-panel outline-none transition-colors duration-150 ease-out
              placeholder:text-slate-400
              disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400
              ${trailingAdornment ? "pr-11" : ""}
              ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-200 hover:border-slate-300 focus:border-brand-700 focus:ring-4 focus:ring-brand-100"
              }
              ${className}`}
            {...inputProps}
          />

          {trailingAdornment && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
              {trailingAdornment}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-sm text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
