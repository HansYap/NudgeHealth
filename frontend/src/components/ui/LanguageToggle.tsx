import type { Locale } from "../../types/auth";

export interface LanguageToggleProps {
  value: Locale;
  onChange: (locale: Locale) => void;
  options?: { value: Locale; label: string }[];
}

const DEFAULT_OPTIONS: { value: Locale; label: string }[] = [
  { value: "bm", label: "BM" },
  { value: "en", label: "EN" },
];

/**
 * Segmented pill control for switching between Bahasa Malaysia and English.
 */
export function LanguageToggle({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}: LanguageToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 p-1"
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold outline-none
              transition-colors duration-150 ease-out
              focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-1
              ${
                active
                  ? "bg-brand-900 text-white shadow-panel"
                  : "text-slate-500 hover:text-ink-900"
              }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
