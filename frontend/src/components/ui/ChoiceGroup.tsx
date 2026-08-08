import { TriangleAlert } from "lucide-react";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
}

export interface ChoiceGroupProps<T extends string> {
  legend: string;
  options: ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  name: string;
  /** Secondary explanation under the legend */
  hint?: string;
  /** Validation message; also switches the group to its error styling */
  error?: string;
  /** Force a two-column grid instead of a flexible row */
  columns?: 1 | 2;
}

/**
 * Fixed-choice segmented selector rendered as a radiogroup. Each option
 * is a 48px tap target with 8px clearance (Design System 03), and the
 * selected state changes border and weight as well as fill — never
 * color alone.
 */
export function ChoiceGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
  hint,
  error,
  columns,
}: ChoiceGroupProps<T>) {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <fieldset
      className={
        error ? "rounded-[14px] outline outline-2 outline-offset-8 outline-rust" : undefined
      }
    >
      <legend className="text-body-sm font-bold text-ink-900">{legend}</legend>

      {hint && <p className="mt-1 text-caption font-normal normal-case tracking-normal text-slate-500">{hint}</p>}

      <div
        role="radiogroup"
        aria-label={legend}
        aria-describedby={errorId}
        className={`mt-3 gap-2 ${
          columns === 2 ? "grid grid-cols-1 sm:grid-cols-2" : "flex flex-wrap"
        }`}
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              name={name}
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`min-h-tap flex-1 rounded-lg border-[1.5px] px-4 text-body-sm outline-none
                transition-colors duration-150 ease-out
                focus-visible:ring-4 focus-visible:ring-brand-100
                ${
                  selected
                    ? "border-brand-700 bg-brand-50 font-bold text-brand-700"
                    : error
                      ? "border-rust bg-white font-semibold text-ink-900"
                      : "border-hairline bg-white font-semibold text-ink-900 hover:border-brand-700"
                }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-caption text-rust"
        >
          <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}
