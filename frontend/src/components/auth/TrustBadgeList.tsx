import { TrustBadgeItem } from "./TrustBadgeItem";

export interface TrustBadgeListProps {
  items: string[];
}

/**
 * Renders the vertical list of compliance/trust statements
 * shown at the bottom of the brand panel.
 */
export function TrustBadgeList({ items }: TrustBadgeListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((label) => (
        <TrustBadgeItem key={label} label={label} />
      ))}
    </ul>
  );
}
