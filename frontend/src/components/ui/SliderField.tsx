import { TriangleAlert } from "lucide-react";

export interface SliderFieldProps {
  id: string;
  label: string;
  /** Unit shown next to the big numeral, e.g. "years old", "cm", "kg" */
  unit: string;
  min: number;
  max: number;
  /** null until the user has actually moved the slider */
  value: number | null;
  onChange: (value: number) => void;
  /** Shown while unanswered, e.g. "Drag the slider to answer" */
  hint: string;
  /** Labels under the track ends; defaults to min/max */
  minLabel?: string;
  maxLabel?: string;
  /** Derived caption under the track, e.g. "BMI 24.1 · Normal weight" */
  caption?: string;
  error?: string;
}

/**
 * Large-numeral slider input. The value is only counted as answered
 * once the user moves it, so a default position is never mistaken for
 * a real answer. Numeral uses Sora per Design System 02.
 */
export function SliderField({
  id,
  label,
  unit,
  min,
  max,
  value,
  onChange,
  hint,
  minLabel,
  maxLabel,
  caption,
  error,
}: SliderFieldProps) {
  const answered = value !== null;
  const current = value ?? min;
  const pct = ((current - min) / (max - min)) * 100;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div
      className={
        error ? "rounded-[14px] outline outline-2 outline-offset-8 outline-rust" : undefined
      }
    >
      <label htmlFor={id} className="block text-body-sm font-bold text-ink-900">
        {label}
      </label>

      <p className="mt-1 flex items-baseline gap-2">
        <span
          className={`font-sora text-display ${
            answered ? "text-brand-800" : "text-slate-500"
          }`}
        >
          {answered ? value : "\u2014"}
        </span>
        <span className="text-body-sm font-semibold text-slate-500">{unit}</span>
      </p>

      {!answered && (
        <p className="text-caption font-normal normal-case italic tracking-normal text-slate-500">
          {hint}
        </p>
      )}

      <div className="relative mt-2.5 flex h-tap items-center">
        <div className="relative h-2 w-full rounded-full bg-brand-50">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${
              answered ? "bg-brand-700" : "bg-hairline"
            }`}
            style={{ width: `${answered ? pct : 0}%` }}
          />
        </div>

        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={current}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-describedby={errorId}
          aria-valuetext={answered ? `${value} ${unit}` : undefined}
          className="peer absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
        />

        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2
            rounded-full border-[3px] bg-white shadow-panel
            peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100
            ${answered ? "border-brand-700" : "border-slate-400"}`}
          style={{ left: `${answered ? pct : 0}%` }}
        />
      </div>

      <div className="flex justify-between text-caption font-normal normal-case tracking-normal text-slate-500">
        <span>{minLabel ?? min}</span>
        <span>{maxLabel ?? max}</span>
      </div>

      {caption && (
        <p className="mt-2.5 text-caption text-brand-700">{caption}</p>
      )}

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
    </div>
  );
}
