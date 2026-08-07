import type { ReactNode } from "react";
import { Logo } from "../ui/Logo";
import { LanguageToggle } from "../ui/LanguageToggle";
import { SidebarNav, type NavItem } from "./SidebarNav";
import type { Locale } from "../../types/auth";
import type { NavRoute } from "../../types/app";

export interface AppShellProps {
  brandName: string;
  navItems: NavItem[];
  active: NavRoute;
  onNavigate: (route: NavRoute) => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  children: ReactNode;
}

/**
 * Shared shell for every signed-in screen: left nav rail + content
 * column on desktop, bottom tab bar on mobile. Background is Alabaster
 * per Design System 01.
 */
export function AppShell({
  brandName,
  navItems,
  active,
  onNavigate,
  locale,
  onLocaleChange,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-alabaster">
      <aside className="hidden w-[270px] shrink-0 flex-col border-r border-hairline bg-alabaster md:flex">
        <div className="px-5 pt-5">
          <Logo name={brandName} variant="light" />
        </div>
        <SidebarNav items={navItems} active={active} onNavigate={onNavigate} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-4 md:justify-end md:px-12">
          <div className="md:hidden">
            <Logo name={brandName} variant="light" showWordmark={false} />
          </div>
          <LanguageToggle value={locale} onChange={onLocaleChange} />
        </header>

        <main className="flex-1 px-6 pb-28 md:px-12 md:pb-12">
          <div className="mx-auto w-full max-w-3xl animate-fade-in space-y-8">
            {children}
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 md:hidden">
        <SidebarNav
          items={navItems}
          active={active}
          onNavigate={onNavigate}
          variant="bottom"
        />
      </div>
    </div>
  );
}
