import { Logo } from "../ui/Logo";
import { TrustBadgeList } from "./TrustBadgeList";

export interface BrandPanelProps {
  brandName: string;
  headline: string;
  trustBadges: string[];
}

/**
 * Left-hand marketing/brand panel: logo, headline copy, and
 * a list of trust/compliance statements anchored toward the bottom.
 */
export function BrandPanel({
  brandName,
  headline,
  trustBadges,
}: BrandPanelProps) {
  return (
    <aside
      aria-label="About NudgeHealth"
      className="flex h-full w-full flex-col justify-between p-10 lg:p-14"
    >
      <Logo name={brandName} variant="dark" />

      <h1 className="max-w-sm font-sora text-h2 text-white">
        {headline}
      </h1>

      <TrustBadgeList items={trustBadges} />
    </aside>
  );
}
