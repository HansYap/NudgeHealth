import type { FactorImpact } from "../../types/app";

/** Semantic tints from Design System 01/05, reused by every small pill. */
export type PillTone = "teal" | "sage" | "amber" | "rust";

const TONE_CLASSES: Record<PillTone, string> = {
  teal: "bg-brand-50 text-brand-700",
  sage: "bg-sage-light text-sage",
  amber: "bg-amber-light text-amber",
  rust: "bg-rust-light text-rust",
};

export interface StatusPillProps {
  label: string;
  tone: PillTone;
  /** Optional leading glyph, e.g. "+" / "−". Carries meaning alongside color. */
  symbol?: string;
  /** Uppercase treatment for category-style labels like "PRIORITY" */
  uppercase?: boolean;
}

/**
 * Small status pill. Where the pill signals direction (risk up/down) the
 * +/- symbol carries the same meaning as the color, so it still reads in
 * grayscale and for colorblind users.
 */
export function StatusPill({
  label,
  tone,
  symbol,
  uppercase = false,
}: StatusPillProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-caption ${
        TONE_CLASSES[tone]
      } ${uppercase ? "uppercase tracking-wide" : "normal-case tracking-normal"}`}
    >
      {symbol && <span aria-hidden="true">{symbol}</span>}
      {label}
    </span>
  );
}

const IMPACT_TOKENS: Record<FactorImpact, { tone: PillTone; symbol?: string }> = {
  neutral: { tone: "teal", symbol: "0" },
  baseline: { tone: "teal", symbol: "0" },
  increases: { tone: "rust", symbol: "+" },
  lowers: { tone: "sage", symbol: "\u2212" },
};

export interface FactorRowProps {
  title: string;
  description?: string;
  impact: FactorImpact;
  impactLabel: string;
}

/** One row of the "What's contributing" breakdown on the risk detail page. */
export function FactorRow({
  title,
  description,
  impact,
  impactLabel,
}: FactorRowProps) {
  const tokens = IMPACT_TOKENS[impact];
  return (
    <div className="flex min-h-tap items-center justify-between gap-4 rounded-[14px] border border-hairline bg-white px-4 py-4">
      <div className="min-w-0">
        <p className="text-body-sm font-bold text-ink-900">{title}</p>
        {description && (
          <p className="mt-0.5 text-caption font-normal normal-case tracking-normal text-slate-500">
            {description}
          </p>
        )}
      </div>
      <StatusPill label={impactLabel} tone={tokens.tone} symbol={tokens.symbol} />
    </div>
  );
}
