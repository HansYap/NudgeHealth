import type { ReactNode } from "react";

export interface SettingRowProps {
  title: string;
  description?: string;
  /** Trailing control: a button, toggle, or status pill */
  action?: ReactNode;
  /** Renders the title in Sora at H3 size (used for the account row) */
  emphasis?: boolean;
}

/**
 * Generic settings/summary card: label block on the left, control on
 * the right. Used for the account row, the health-baseline row and the
 * language row — same shape, different trailing control.
 */
export function SettingRow({
  title,
  description,
  action,
  emphasis = false,
}: SettingRowProps) {
  return (
    <div className="flex min-h-tap flex-wrap items-center justify-between gap-4 rounded-[14px] border border-hairline bg-white px-6 py-6">
      <div className="min-w-0">
        <p
          className={
            emphasis
              ? "font-sora text-h3 text-ink-900"
              : "text-body-sm font-bold text-ink-900"
          }
        >
          {title}
        </p>
        {description && (
          <p className="mt-0.5 text-caption font-normal normal-case tracking-normal text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
