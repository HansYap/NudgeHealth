import type { ReactNode } from "react";
import { Stethoscope, Footprints, Salad, Moon } from "lucide-react";

export type CategoryKey = "check" | "move" | "eat" | "rest";

// Each category keeps a distinct icon (not just a background tint) so the
// four cards stay distinguishable for colorblind users and in grayscale
// printouts — per Design System 04 note.
const CATEGORY_ICON: Record<CategoryKey, ReactNode> = {
  check: <Stethoscope className="h-5 w-5" aria-hidden="true" />,
  move: <Footprints className="h-5 w-5" aria-hidden="true" />,
  eat: <Salad className="h-5 w-5" aria-hidden="true" />,
  rest: <Moon className="h-5 w-5" aria-hidden="true" />,
};

export interface CategoryCardProps {
  category: CategoryKey;
  title: string;
  description: string;
  onClick?: () => void;
}

export function CategoryCard({
  category,
  title,
  description,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-tap w-full flex-col items-start gap-3 rounded-2xl border border-slate-200
        bg-white p-4 text-left shadow-panel outline-none transition-all duration-150 ease-out
        hover:border-brand-200 hover:shadow-popover
        focus-visible:ring-4 focus-visible:ring-brand-100"
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700"
        aria-hidden="true"
      >
        {CATEGORY_ICON[category]}
      </span>
      <div>
        <p className="font-sora text-h3 text-ink-900">{title}</p>
        <p className="mt-0.5 text-body-sm text-slate-500">{description}</p>
      </div>
    </button>
  );
}
