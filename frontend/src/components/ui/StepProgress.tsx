import { Check } from "lucide-react";

export interface StepDefinition {
  /** 1-based step number */
  step: number;
  label: string;
  /** 0–100 completion of this step's questions */
  progressPct: number;
  complete: boolean;
}

export interface StepProgressProps {
  steps: StepDefinition[];
  current: number;
  /** Allows jumping back to an already-visited step */
  onStepClick?: (step: number) => void;
}

/**
 * Segmented progress header. Each step shows its own fill so partial
 * progress is visible, and completion is marked with a check icon as
 * well as color, so it reads without relying on hue alone.
 */
export function StepProgress({ steps, current, onStepClick }: StepProgressProps) {
  return (
    <div role="group" aria-label="Onboarding progress" className="flex gap-2.5">
      {steps.map((step) => {
        const isActive = step.step === current;
        const canJump = step.step <= current;

        return (
          <button
            key={step.step}
            type="button"
            disabled={!canJump}
            aria-current={isActive ? "step" : undefined}
            onClick={() => canJump && onStepClick?.(step.step)}
            className={`min-w-0 flex-1 rounded text-left outline-none
              focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2
              ${canJump ? "cursor-pointer" : "cursor-default"}`}
          >
            <span className="block h-2 overflow-hidden rounded-full bg-brand-50">
              <span
                className={`block h-full rounded-full transition-[width] duration-250 ease-out
                  motion-reduce:transition-none
                  ${step.complete ? "bg-sage" : "bg-brand-700"}`}
                style={{ width: `${step.progressPct}%` }}
              />
            </span>

            <span
              className={`mt-2 flex items-center gap-1.5 truncate text-caption
                ${
                  step.complete
                    ? "text-sage"
                    : isActive
                      ? "text-brand-700"
                      : "text-slate-500"
                }`}
            >
              <span
                aria-hidden="true"
                className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]
                  ${
                    step.complete
                      ? "bg-sage text-white"
                      : isActive
                        ? "bg-brand-700 text-white"
                        : "bg-hairline text-slate-500"
                  }`}
              >
                {step.complete ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : step.step}
              </span>
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
