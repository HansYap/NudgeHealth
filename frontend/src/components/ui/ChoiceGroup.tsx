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
}

/**
 * Fixed-choice segmented selector rendered as a radiogroup. Each option
 * is a 48px tap target with 8px clearance (Design System 03), and the
 * selected state uses the Teal Light fill rather than color alone —
 * the border and weight change too.
 */
export function ChoiceGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset>
      <legend className="text-body-sm font-bold text-ink-900">{legend}</legend>

      <div role="radiogroup" aria-label={legend} className="mt-3 flex flex-wrap gap-2">
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
              className={`min-h-tap rounded-lg border px-8 text-body-sm outline-none
                transition-colors duration-150 ease-out
                focus-visible:ring-4 focus-visible:ring-brand-100
                ${
                  selected
                    ? "border-brand-700 bg-brand-50 font-bold text-brand-700"
                    : "border-hairline bg-white font-semibold text-ink-900 hover:border-brand-200"
                }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
