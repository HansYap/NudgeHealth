import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-900 text-white hover:bg-brand-950 focus-visible:ring-brand-700 disabled:bg-slate-300 disabled:text-white",
  secondary:
    "bg-white text-brand-900 border border-slate-200 hover:bg-slate-50 focus-visible:ring-brand-700 disabled:text-slate-400",
  ghost:
    "bg-transparent text-brand-900 hover:bg-brand-50 focus-visible:ring-brand-700 disabled:text-slate-400",
};

/**
 * Generic pill-shaped button used for the submit action and other CTAs.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      className = "",
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5
          text-[15px] font-semibold transition-all duration-150 ease-out
          outline-none focus-visible:ring-4 focus-visible:ring-offset-0
          disabled:cursor-not-allowed
          active:scale-[0.98]
          ${fullWidth ? "w-full" : ""}
          ${VARIANT_CLASSES[variant]}
          ${className}`}
        {...rest}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
