export interface InfoCalloutProps {
  /** Uppercase heading, e.g. "Disclaimer" / "How this is calculated" */
  title: string;
  body: string;
  tone?: "default" | "alert";
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Explanatory callout with a 4px accent rule on the left. The default
 * style is used for neutral notes, while alert keeps the same shape
 * with the risk red treatment.
 */
export function InfoCallout({
  title,
  body,
  tone = "default",
  actionLabel,
  onAction,
}: InfoCalloutProps) {
  const toneClasses =
    tone === "alert"
      ? "border-rust bg-rust-light text-rust"
      : "border-coral-dark bg-coral-surface text-coral-dark";

  return (
    <aside className={`rounded-r-lg border-l-4 px-7 py-5 ${toneClasses}`}>
      <p className="text-caption uppercase">{title}</p>
      <p className="mt-2 text-body-sm leading-relaxed text-ink-900">{body}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex min-h-tap items-center rounded-full bg-rust px-5 py-3 text-body-sm font-bold text-white outline-none transition-colors hover:bg-rust/90 focus-visible:ring-4 focus-visible:ring-rust/30"
        >
          {actionLabel}
        </button>
      )}
    </aside>
  );
}
