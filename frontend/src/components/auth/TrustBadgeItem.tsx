import { Check } from "lucide-react";

export interface TrustBadgeItemProps {
  label: string;
}

/**
 * One line item in the trust/compliance list (e.g. "Complies with PDPA 2010").
 */
export function TrustBadgeItem({ label }: TrustBadgeItemProps) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15"
        aria-hidden="true"
      >
        <Check className="h-3 w-3 text-white" strokeWidth={3} />
      </span>
      <span className="text-[15px] leading-relaxed text-white/80">
        {label}
      </span>
    </li>
  );
}
