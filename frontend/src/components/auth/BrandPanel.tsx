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

      <h1 className="max-w-sm text-[32px] font-bold leading-[1.2] tracking-tight text-white lg:text-4xl">
        {headline}
      </h1>

      <TrustBadgeList items={trustBadges} />
    </aside>
  );
}
