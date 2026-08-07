import type { ReactNode } from "react";
import { Stethoscope, Footprints, Salad, Moon } from "lucide-react";
import { StatusPill } from "./FactorRow";
import type { TaskCategory } from "../../types/app";

/**
 * Each category keeps a distinct icon, not just a background tint, so
 * the categories stay distinguishable for colorblind users and in
 * grayscale printouts (Design System 04).
 */
const CATEGORY_TOKENS: Record<
  TaskCategory,
  { icon: typeof Stethoscope; bg: string; text: string }
> = {
  check: { icon: Stethoscope, bg: "bg-brand-50", text: "text-brand-700" },
  move: { icon: Footprints, bg: "bg-coral-light", text: "text-coral-dark" },
  eat: { icon: Salad, bg: "bg-sage-light", text: "text-sage" },
  rest: { icon: Moon, bg: "bg-amber-light", text: "text-amber" },
};

export interface TaskCardProps {
  category: TaskCategory;
  title: string;
  /** Secondary line, e.g. "Check - once this month" */
  meta: string;
  /** Optional pill next to the title, e.g. "PRIORITY" */
  badgeLabel?: string;
  /** Optional italic rationale line, e.g. "Why: low activity level..." */
  why?: string;
  /** Optional trailing control, e.g. an "Open in Maps" button */
  action?: ReactNode;
  onClick?: () => void;
}

/**
 * Shared row card for a recommended action. Used for the Home focus
 * list, the ranked monthly plan (with priority badge + rationale) and
 * the nearby-clinic list (with a trailing action button).
 */
export function TaskCard({
  category,
  title,
  meta,
  badgeLabel,
  why,
  action,
  onClick,
}: TaskCardProps) {
  const tokens = CATEGORY_TOKENS[category];
  const Icon = tokens.icon;

  const body = (
    <>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${tokens.bg} ${tokens.text}`}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-body-sm font-bold text-ink-900">{title}</span>
          {badgeLabel && (
            <StatusPill label={badgeLabel} tone="teal" uppercase />
          )}
        </span>

        <span className="mt-0.5 block text-caption font-normal normal-case tracking-normal text-slate-500">
          {meta}
        </span>

        {why && (
          <span className="mt-1 block text-caption font-normal normal-case italic tracking-normal text-slate-500">
            {why}
          </span>
        )}
      </span>

      {action && <span className="shrink-0">{action}</span>}
    </>
  );

  const base =
    "flex min-h-tap w-full items-center gap-4 rounded-[14px] border border-hairline bg-white px-6 py-5 text-left";

  // A card with its own trailing control must not also be a button
  // (nested interactive elements break keyboard and screen-reader use).
  if (!onClick || action) {
    return <div className={base}>{body}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} outline-none transition-all duration-150 ease-out
        hover:border-brand-200 hover:shadow-panel
        focus-visible:ring-4 focus-visible:ring-brand-100`}
    >
      {body}
    </button>
  );
}
