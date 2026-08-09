import { useState } from "react";
import { Check, Lock } from "lucide-react";
import { StepProgress } from "../components/ui/StepProgress";
import { SliderField } from "../components/ui/SliderField";
import { ChoiceGroup } from "../components/ui/ChoiceGroup";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { HintLine } from "../components/ui/HintLine";
import {
  EMPTY_ANSWERS,
  MALAYSIA_STATES,
  SLIDER_RANGES,
  STEP_FIELDS,
  TOTAL_QUESTIONS,
  TOTAL_STEPS,
  computeBmi,
  type OnboardingAnswers,
  type OnboardingFieldId,
} from "../lib/onboardingConfig";

export interface OnboardingPageProps {
  copy: OnboardingCopy;
  /** Pre-fill when retaking the assessment from Profile */
  initialAnswers?: OnboardingAnswers;
  /** Fired with the completed answers when the user finishes */
  onComplete?: (answers: OnboardingAnswers) => void | Promise<void>;
  /** Shown as a "See my risk score" destination handler */
  onSeeScore?: () => void;
}

export interface OnboardingCopy {
  eyebrows: Record<string, string>;
  stepLabels: string[];
  counter: string;
  headings: Record<string, string>;
  subs: Record<string, string>;
  questions: Record<OnboardingFieldId, string>;
  hints: Partial<Record<OnboardingFieldId, string>>;
  units: Record<string, string>;
  sliderHint: string;
  options: Record<string, { value: string; label: string }[]>;
  selectPlaceholder: string;
  errors: { choice: string; slider: string };
  back: string;
  continueLabel: string;
  finish: string;
  trustNote: string;
  doneTitle: string;
  doneBody: string;
}

/**
 * Three-step baseline questionnaire. Fixed options and sliders only —
 * no free text (Epic 1.1). Validation runs per step, so the user is
 * never told about problems on pages they haven't reached yet.
 */
export function OnboardingPage({
  copy,
  initialAnswers,
  onComplete,
  onSeeScore,
}: OnboardingPageProps) {
  const [answers, setAnswers] = useState<OnboardingAnswers>(
    initialAnswers ?? EMPTY_ANSWERS
  );
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = <K extends keyof OnboardingAnswers>(
    key: K,
    value: OnboardingAnswers[K]
  ) => setAnswers((prev) => ({ ...prev, [key]: value }));

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;

  const stepProgress = (n: number) => {
    const fields = STEP_FIELDS[n];
    const answered = fields.filter((f) => answers[f] !== null).length;
    return Math.round((answered / fields.length) * 100);
  };

  const missingInStep = (n: number) =>
    STEP_FIELDS[n].filter((f) => answers[f] === null);

  const errorFor = (field: OnboardingFieldId, kind: "choice" | "slider") =>
    showErrors && answers[field] === null
      ? `${copy.questions[field]}: ${copy.errors[kind]}`
      : undefined;

  const handleNext = async () => {
    if (missingInStep(step).length > 0) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);
    setCompletedSteps((prev) => [...new Set([...prev, step])]);

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setSubmitError(null);
      setIsSubmitting(true);

      try {
        await onComplete?.(answers);
        setDone(true);
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Unable to submit your assessment. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const goToStep = (target: number) => {
    setShowErrors(false);
    setDone(false);
    setStep(target);
  };

  const bmi =
    answers.height !== null && answers.weight !== null
      ? computeBmi(answers.height, answers.weight)
      : null;

  const steps = [1, 2, 3].map((n) => ({
    step: n,
    label: copy.stepLabels[n - 1],
    progressPct: stepProgress(n),
    complete: completedSteps.includes(n),
  }));

  const eyebrow = done ? copy.eyebrows.done : copy.eyebrows[String(step)];

  return (
    <div className="flex min-h-screen items-start justify-center bg-alabaster px-5 py-14">
      <main className="w-full max-w-xl rounded-[22px] border border-hairline bg-alabaster p-6 shadow-popover sm:p-10">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
          <span className="font-sora text-caption uppercase text-brand-700">
            {eyebrow}
          </span>
          <span className="text-caption text-brand-700">
            {copy.counter
              .replace("{answered}", String(answeredCount))
              .replace("{total}", String(TOTAL_QUESTIONS))}
          </span>
        </div>

        <StepProgress
          steps={steps}
          current={done ? TOTAL_STEPS : step}
          onStepClick={goToStep}
        />

        {done ? (
          <div className="mt-8 text-center">
            <div
              className="mx-auto mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-sage p-4 text-white"
              aria-hidden="true"
            >
              <Check className="h-full w-full" strokeWidth={2.5} />
            </div>
            <h1 className="font-sora text-h2 text-brand-800">
              {copy.doneTitle}
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-body-sm text-slate-500">
              {copy.doneBody}
            </p>
          </div>
        ) : (
          <div className="mt-7">
            <h1 className="font-sora text-h2 text-brand-800">
              {copy.headings[String(step)]}
            </h1>
            <p className="mt-1.5 text-body-sm text-slate-500">
              {copy.subs[String(step)]}
            </p>

            <div className="mt-7 space-y-7">
              {step === 1 && (
                <>
                  <SliderField
                    id="f-age"
                    label={copy.questions.age}
                    unit={copy.units.age}
                    min={SLIDER_RANGES.age.min}
                    max={SLIDER_RANGES.age.max}
                    value={answers.age}
                    onChange={(v) => set("age", v)}
                    hint={copy.sliderHint}
                    error={errorFor("age", "slider")}
                  />

                  <ChoiceGroup
                    name="sex"
                    legend={copy.questions.sex}
                    options={copy.options.sex}
                    value={answers.sex}
                    onChange={(v) => set("sex", v)}
                    error={errorFor("sex", "choice")}
                  />

                  <Select
                    id="f-state"
                    label={copy.questions.state}
                    placeholder={copy.selectPlaceholder}
                    options={MALAYSIA_STATES.map((s) => ({ value: s, label: s }))}
                    value={answers.state ?? ""}
                    onChange={(e) => set("state", e.target.value)}
                    error={errorFor("state", "choice")}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <ChoiceGroup
                    name="smoking"
                    legend={copy.questions.smoking}
                    options={copy.options.smoking}
                    value={answers.smoking}
                    onChange={(v) => set("smoking", v)}
                    columns={2}
                    error={errorFor("smoking", "choice")}
                  />

                  <SliderField
                    id="f-height"
                    label={copy.questions.height}
                    unit={copy.units.height}
                    min={SLIDER_RANGES.height.min}
                    max={SLIDER_RANGES.height.max}
                    minLabel={`${SLIDER_RANGES.height.min} cm`}
                    maxLabel={`${SLIDER_RANGES.height.max} cm`}
                    value={answers.height}
                    onChange={(v) => set("height", v)}
                    hint={copy.sliderHint}
                    error={errorFor("height", "slider")}
                  />

                  <SliderField
                    id="f-weight"
                    label={copy.questions.weight}
                    unit={copy.units.weight}
                    min={SLIDER_RANGES.weight.min}
                    max={SLIDER_RANGES.weight.max}
                    minLabel={`${SLIDER_RANGES.weight.min} kg`}
                    maxLabel={`${SLIDER_RANGES.weight.max} kg`}
                    value={answers.weight}
                    onChange={(v) => set("weight", v)}
                    hint={copy.sliderHint}
                    caption={bmi ? `BMI ${bmi.bmi} \u00b7 ${bmi.category}` : undefined}
                    error={errorFor("weight", "slider")}
                  />

                  <ChoiceGroup
                    name="activity"
                    legend={copy.questions.activity}
                    hint={copy.hints.activity}
                    options={copy.options.activity}
                    value={answers.activity}
                    onChange={(v) => set("activity", v)}
                    error={errorFor("activity", "choice")}
                  />
                </>
              )}

              {step === 3 &&
                (
                  [
                    "sodium",
                    "fruitveg",
                    "screening",
                    "diabetes",
                    "hypertension",
                    "cholesterol",
                  ] as const
                ).map((field) => (
                  <ChoiceGroup
                    key={field}
                    name={field}
                    legend={copy.questions[field]}
                    options={copy.options.yesno}
                    value={answers[field]}
                    onChange={(v) => set(field, v)}
                    error={errorFor(field, "choice")}
                  />
                ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {(step > 1 || done) && (
            <Button
              variant="secondary"
              onClick={() => goToStep(done ? TOTAL_STEPS : step - 1)}
              className="border-2 border-brand-700 text-brand-700"
            >
              {copy.back}
            </Button>
          )}

          <Button
            onClick={done ? onSeeScore : handleNext}
            className="flex-1"
            isLoading={isSubmitting}
          >
            {done || step === TOTAL_STEPS ? copy.finish : copy.continueLabel}
          </Button>
        </div>

        {submitError && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-rust-light px-4 py-3 text-body-sm text-rust"
          >
            {submitError}
          </p>
        )}

        <div className="mt-6 flex justify-center">
          <HintLine
            icon={<Lock className="h-3.5 w-3.5" />}
            message={copy.trustNote}
          />
        </div>
      </main>
    </div>
  );
}
