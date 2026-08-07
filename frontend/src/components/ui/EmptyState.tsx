import type { ReactNode } from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  actionLabel: string;
  onAction?: () => void;
  /** "neutral" for empty states (e.g. no diary entries), "error" for failures */
  tone?: "neutral" | "error";
}

/**
 * Plain, calm empty/error state per Design System 07: an alarming or vague
 * error can spike anxiety in a health app, so every state names what
 * happened and gives one clear next action in plain language.
 */
export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  tone = "neutral",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          tone === "error" ? "bg-rust-light text-rust" : "bg-brand-50 text-brand-700"
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <p className="font-sora text-h3 text-ink-900">{title}</p>
      <p className="max-w-xs text-body-sm text-slate-500">{message}</p>
      <Button variant={tone === "error" ? "secondary" : "primary"} onClick={onAction} className="mt-2">
        {actionLabel}
      </Button>
    </div>
  );
}
