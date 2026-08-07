import type { ReactNode } from "react";
import { Home as HomeIcon, ClipboardList, NotebookPen, User } from "lucide-react";
import type { NavRoute } from "../../types/app";

export interface NavItem {
  route: NavRoute;
  label: string;
}

const ICONS: Record<NavRoute, ReactNode> = {
  home: <HomeIcon className="h-[22px] w-[22px]" aria-hidden="true" />,
  plan: <ClipboardList className="h-[22px] w-[22px]" aria-hidden="true" />,
  diary: <NotebookPen className="h-[22px] w-[22px]" aria-hidden="true" />,
  profile: <User className="h-[22px] w-[22px]" aria-hidden="true" />,
};

export interface SidebarNavProps {
  items: NavItem[];
  active: NavRoute;
  onNavigate: (route: NavRoute) => void;
  /** "side" = vertical rail (desktop). "bottom" = tab bar (mobile). */
  variant?: "side" | "bottom";
}

/**
 * Left-side navigation from Design System 04. Active row uses the
 * Teal Light fill + Deep Teal label; every row is a 48px tap target.
 * Collapses to a bottom tab bar below md.
 */
export function SidebarNav({
  items,
  active,
  onNavigate,
  variant = "side",
}: SidebarNavProps) {
  const isBottom = variant === "bottom";

  return (
    <nav
      aria-label="Primary"
      className={
        isBottom
          ? "flex items-center justify-around border-t border-hairline bg-alabaster px-2 py-1.5"
          : "flex flex-col gap-1 p-5"
      }
    >
      {items.map((item) => {
        const isActive = item.route === active;
        return (
          <button
            key={item.route}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onNavigate(item.route)}
            className={`flex min-h-tap items-center outline-none transition-colors duration-150 ease-out
              focus-visible:ring-4 focus-visible:ring-brand-100
              ${
                isBottom
                  ? "flex-1 flex-col justify-center gap-0.5 rounded-xl px-2 text-caption"
                  : "gap-3 rounded-[14px] px-3.5 text-body-sm"
              }
              ${
                isActive
                  ? "bg-brand-50 font-bold text-brand-700"
                  : "font-semibold text-slate-500 hover:bg-brand-50/50 hover:text-ink-900"
              }`}
          >
            {ICONS[item.route]}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
