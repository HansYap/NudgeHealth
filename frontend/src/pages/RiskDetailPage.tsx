import { RiskHeroCard } from "../components/ui/RiskHeroCard";
import { InfoCallout } from "../components/ui/InfoCallout";
import { FactorRow } from "../components/ui/FactorRow";
import { TextLink } from "../components/ui/TextLink";
import { Button } from "../components/ui/Button";
import type { RiskFactor, RiskSummary } from "../types/app";

export interface RiskDetailPageCopy {
  back: string;
  riskEyebrow: string;
  calcTitle: string;
  calcBody: string;
  contributingTitle: string;
  seePlan: string;
}

export interface RiskDetailPageProps {
  copy: RiskDetailPageCopy;
  risk: RiskSummary;
  factors: RiskFactor[];
  onBack?: () => void;
  onSeePlan?: () => void;
}

/**
 * Risk band detail: the full explanation behind the score shown on
 * Home. Reuses the same hero card in its larger "detail" size.
 */
export function RiskDetailPage({
  copy,
  risk,
  factors,
  onBack,
  onSeePlan,
}: RiskDetailPageProps) {
  return (
    <>
      <TextLink label={copy.back} onClick={onBack} leading />

      <RiskHeroCard
        band={risk.band}
        eyebrow={copy.riskEyebrow}
        label={risk.label}
        description={risk.description}
        meta={risk.detailMeta}
        size="detail"
      />

      <InfoCallout title={copy.calcTitle} body={copy.calcBody} />

      <section className="space-y-4">
        <h2 className="font-sora text-h3 text-brand-800">
          {copy.contributingTitle}
        </h2>

        <div className="space-y-3">
          {factors.map((factor) => (
            <FactorRow
              key={factor.id}
              title={factor.title}
              description={factor.description}
              impact={factor.impact}
              impactLabel={factor.impactLabel}
            />
          ))}
        </div>
      </section>

      <Button onClick={onSeePlan}>{copy.seePlan}</Button>
    </>
  );
}
