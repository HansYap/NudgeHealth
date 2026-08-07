export interface TextLinkProps {
  label: string;
  onClick?: () => void;
  /** Renders the arrow before the label instead of after (e.g. "← Back to Home") */
  leading?: boolean;
}

/**
 * Inline navigational text link ("View full plan →", "← Back to Home").
 * Kept at a 48px tap height per Design System 03.
 */
export function TextLink({ label, onClick, leading = false }: TextLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-tap items-center gap-1.5 rounded text-body-sm font-bold text-brand-700
        outline-none transition-colors duration-150 hover:text-brand-900 hover:underline
        focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
    >
      {leading && <span aria-hidden="true">←</span>}
      {label}
      {!leading && <span aria-hidden="true">→</span>}
    </button>
  );
}
