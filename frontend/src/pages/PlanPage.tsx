import { PageHeader } from "../components/ui/PageHeader";
import { TaskCard } from "../components/ui/TaskCard";
import { TextLink } from "../components/ui/TextLink";
import type { PlanItem } from "../types/app";

export interface PlanPageCopy {
  title: string;
  subtitle: string;
  priority: string;
  findClinic: string;
}

export interface PlanPageProps {
  copy: PlanPageCopy;
  items: PlanItem[];
  onFindClinic?: () => void;
}

/**
 * Monthly plan: the same recommendations as the Home focus list, but
 * ranked and annotated with a priority pill and a plain-language
 * rationale so the ordering never feels arbitrary.
 */
export function PlanPage({ copy, items, onFindClinic }: PlanPageProps) {
  return (
    <>
      <PageHeader title={copy.title} subtitle={copy.subtitle} />

      <div className="space-y-3">
        {items.map((item) => (
          <TaskCard
            key={item.id}
            category={item.category}
            title={item.title}
            meta={item.meta}
            badgeLabel={item.priority ? copy.priority : undefined}
            why={item.why}
          />
        ))}
      </div>

      <TextLink label={copy.findClinic} onClick={onFindClinic} />
    </>
  );
}
