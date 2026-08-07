export interface InfoCalloutProps {
  /** Uppercase heading, e.g. "Disclaimer" / "How this is calculated" */
  title: string;
  body: string;
}

/**
 * Explanatory callout with a 4px accent rule on the left (Coral Dark)
 * on a warm surface. Used for the score disclaimer and the "how this
 * is calculated" note — plain language, no alarm, per Design System 07.
 */
export function InfoCallout({ title, body }: InfoCalloutProps) {
  return (
    <aside className="rounded-r-lg border-l-4 border-coral-dark bg-coral-surface px-7 py-5">
      <p className="text-caption uppercase text-coral-dark">{title}</p>
      <p className="mt-2 text-body-sm leading-relaxed text-ink-900">{body}</p>
    </aside>
  );
}
