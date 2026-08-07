import { BAND_TOKENS, type RiskBand } from "./RiskBand";
import { Button } from "./Button";

export interface RiskHeroCardProps {
  band: RiskBand;
  /** Small uppercase eyebrow, e.g. "Your risk this month" */
  eyebrow: string;
  /** Band name shown large, e.g. "Moderate" */
  label: string;
  /** Timestamp line, e.g. "Last assessed 3 days ago" */
  meta: string;
  /** Longer explanation — only rendered in the "detail" size */
  description?: string;
  /** "compact" = Home summary (with optional CTA). "detail" = Risk page hero. */
  size?: "compact" | "detail";
  ctaLabel?: string;
  onCtaClick?: () => void;
}

/**
 * Solid risk-band hero card. Per Design System 05 the band is never
 * communicated by color alone — the icon and the text label always
 * ship together, so it still reads in grayscale and to screen readers.
 */
export function RiskHeroCard({
  band,
  eyebrow,
  label,
  meta,
  description,
  size = "compact",
  ctaLabel,
  onCtaClick,
}: RiskHeroCardProps) {
  const tokens = BAND_TOKENS[band];
  const isDetail = size === "detail";

  return (
    <section className={`rounded-[14px] ${tokens.bg} p-6 text-white`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-caption uppercase text-white/85">{eyebrow}</p>

          <p
            className={`mt-2 flex items-center gap-2.5 font-sora ${
              isDetail ? "text-display" : "text-h2"
            }`}
          >
            <span className="h-[0.85em] w-[0.85em] shrink-0" aria-hidden="true">
              {tokens.icon}
            </span>
            <span>{label}</span>
          </p>

          {isDetail && description && (
            <p className="mt-3 max-w-lg text-body-sm text-white/90">
              {description}
            </p>
          )}

          <p className="mt-3 text-caption font-normal normal-case tracking-normal text-white/80">
            {meta}
          </p>
        </div>

        {ctaLabel && (
          <Button
            variant="secondary"
            onClick={onCtaClick}
            className={`shrink-0 border-transparent ${tokens.text}`}
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
