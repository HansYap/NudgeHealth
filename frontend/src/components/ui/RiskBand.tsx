import type { ReactNode } from "react";
import { Circle, TriangleAlert, Plus } from "lucide-react";

// Maps 1:1 to backend RiskAssessment.RISK_BAND_CHOICES ("low" | "moderate" | "high").
export type RiskBand = "low" | "moderate" | "high";

export interface BandTokens {
  bg: string;
  bgSoft: string;
  text: string;
  icon: ReactNode;
  defaultLabel: string;
}

export const BAND_TOKENS: Record<RiskBand, BandTokens> = {
  low: {
    bg: "bg-sage",
    bgSoft: "bg-sage-light",
    text: "text-sage",
    icon: <Circle className="h-full w-full" aria-hidden="true" strokeWidth={3} />,
    defaultLabel: "Low",
  },
  moderate: {
    bg: "bg-amber",
    bgSoft: "bg-amber-light",
    text: "text-amber",
    icon: <TriangleAlert className="h-full w-full" aria-hidden="true" />,
    defaultLabel: "Moderate",
  },
  high: {
    bg: "bg-rust",
    bgSoft: "bg-rust-light",
    text: "text-rust",
    icon: <Plus className="h-full w-full" aria-hidden="true" strokeWidth={3} />,
    defaultLabel: "High",
  },
};

export interface RiskPillProps {
  band: RiskBand;
  label?: string;
  /** "soft" = tinted background (default). "solid" = filled band color. */
  variant?: "soft" | "solid";
}

/**
 * Compact inline badge: icon + label on a soft tint. Use next to a score,
 * in a list row, or a nav item. Never color-only — icon + text always ship
 * together so meaning survives colorblindness / grayscale screenshots.
 */
export function RiskPill({ band, label, variant = "soft" }: RiskPillProps) {
  const tokens = BAND_TOKENS[band];
  const isSolid = variant === "solid";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 ${
        isSolid ? `${tokens.bg} text-white` : `${tokens.bgSoft} ${tokens.text}`
      }`}
    >
      <span className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
        {tokens.icon}
      </span>
      <span className="text-caption">{label ?? tokens.defaultLabel}</span>
    </span>
  );
}

export interface RiskBandCardProps {
  band: RiskBand;
  label?: string;
  message: string;
}

/**
 * Full-width risk band card: Low / Moderate / High, each with a solid icon chip, bold
 * label, and a short next-step message.
 */
export function RiskBandCard({ band, label, message }: RiskBandCardProps) {
  const tokens = BAND_TOKENS[band];
  return (
    <div
      className={`flex min-h-tap items-center gap-4 rounded-2xl ${tokens.bgSoft} p-4`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tokens.bg} p-2 text-white`}
        aria-hidden="true"
      >
        {tokens.icon}
      </span>
      <div>
        <p className={`font-sora text-h3 ${tokens.text}`}>
          {label ?? tokens.defaultLabel}
        </p>
        <p className="text-body-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
}
