import { PageHeader } from "../components/ui/PageHeader";
import { RiskHeroCard } from "../components/ui/RiskHeroCard";
import { InfoCallout } from "../components/ui/InfoCallout";
import { TaskCard } from "../components/ui/TaskCard";
import { TextLink } from "../components/ui/TextLink";
import { EmptyState } from "../components/ui/EmptyState";
import { TriangleAlert } from "lucide-react";
import type { FocusTask, RiskSummary } from "../types/app";

export interface HomePageCopy {
  title: string;
  subtitle: string;
  riskEyebrow: string;
  viewDetails: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  focusTitle: string;
  viewFullPlan: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
}

export interface HomePageProps {
  copy: HomePageCopy;
  /** null renders the calm "couldn't calculate your score" state instead */
  risk: RiskSummary | null;
  tasks: FocusTask[];
  onViewRiskDetail?: () => void;
  onViewFullPlan?: () => void;
  onRetryScore?: () => void;
}

export function HomePage({
  copy,
  risk,
  tasks,
  onViewRiskDetail,
  onViewFullPlan,
  onRetryScore,
}: HomePageProps) {
  return (
    <>
      <PageHeader title={copy.title} subtitle={copy.subtitle} />

      {risk ? (
        <RiskHeroCard
          band={risk.band}
          eyebrow={copy.riskEyebrow}
          label={risk.label}
          meta={risk.meta}
          ctaLabel={copy.viewDetails}
          onCtaClick={onViewRiskDetail}
        />
      ) : (
        <EmptyState
          icon={<TriangleAlert className="h-6 w-6" />}
          title={copy.errorTitle}
          message={copy.errorBody}
          actionLabel={copy.retry}
          tone="error"
          onAction={onRetryScore}
        />
      )}

      <InfoCallout title={copy.disclaimerTitle} body={copy.disclaimerBody} />

      <section className="space-y-4">
        <h2 className="font-sora text-h3 text-brand-800">{copy.focusTitle}</h2>

        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              category={task.category}
              title={task.title}
              meta={task.meta}
              onClick={onViewFullPlan}
            />
          ))}
        </div>

        <TextLink label={copy.viewFullPlan} onClick={onViewFullPlan} />
      </section>
    </>
  );
}
