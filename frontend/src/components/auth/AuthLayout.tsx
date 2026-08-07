import type { ReactNode } from "react";

export interface AuthLayoutProps {
  /** Left brand/marketing panel content (hidden below md breakpoint) */
  panel: ReactNode;
  /** Compact brand mark shown only on small screens, in place of the full panel */
  mobileBrand?: ReactNode;
  /** Content pinned to the top-right of the form panel (e.g. language switch) */
  topRight?: ReactNode;
  /** Right form panel content */
  children: ReactNode;
}

/**
 * Split-screen shell shared by all auth pages (login, signup, reset, etc).
 * Left panel is full-bleed brand color and hidden on mobile; right panel
 * is centered content with a persistent top-right utility slot.
 */
export function AuthLayout({
  panel,
  mobileBrand,
  topRight,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-alabaster md:flex-row">
      <div className="hidden shrink-0 bg-gradient-to-br from-brand-700 to-brand-800 md:flex md:w-[42%] lg:w-[40%] xl:w-[38%]">
        {panel}
      </div>

      <div className="relative flex flex-1 flex-col bg-alabaster">
        <div className="flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
          <div className="md:hidden">{mobileBrand}</div>
          <div className="ml-auto">{topRight}</div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md animate-fade-in">{children}</div>
        </div>
      </div>
    </div>
  );
}
