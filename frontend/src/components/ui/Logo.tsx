import { Activity } from "lucide-react";

export interface LogoProps {
  name: string;
  /** Renders wordmark next to icon; set false for icon-only contexts */
  showWordmark?: boolean;
  /** "dark" = for use on the dark brand panel (white text). "light" = for use on light backgrounds (dark text). */
  variant?: "dark" | "light";
}

/**
 * Brand mark: icon + product name.
 */
export function Logo({ name, showWordmark = true, variant = "dark" }: LogoProps) {
  const isOnDarkBg = variant === "dark";

  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isOnDarkBg ? "bg-white/15" : "bg-brand-900"
        }`}
        aria-hidden="true"
      >
        <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>

      {showWordmark && (
        <span
          className={`text-lg font-bold tracking-tight ${
            isOnDarkBg ? "text-white" : "text-ink-900"
          }`}
        >
          {name}
        </span>
      )}
    </div>
  );
}
