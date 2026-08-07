import type { ReactNode } from "react";

export interface HintLineProps {
  icon?: ReactNode;
  message: string;
}

/**
 * Small reassurance/footnote line (optionally with a leading icon),
 * e.g. "Logged automatically with today's date & time" or the privacy
 * note under the clinic list.
 */
export function HintLine({ icon, message }: HintLineProps) {
  return (
    <p className="flex items-center gap-2 text-caption font-normal normal-case tracking-normal text-slate-500">
      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {message}
    </p>
  );
}
