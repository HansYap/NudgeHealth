export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  label?: string;
  /** Screen-reader text, e.g. "Step 3 of 9" or "Level 3, 60% to Level 4" */
  srLabel: string;
}

export function ProgressBar({ value, label, srLabel }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {label && (
        <p className="mb-1.5 text-caption uppercase text-slate-500">{label}</p>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={srLabel}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className="h-full rounded-full bg-brand-700 transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
