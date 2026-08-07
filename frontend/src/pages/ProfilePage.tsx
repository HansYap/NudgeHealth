import { SettingRow } from "../components/ui/SettingRow";
import { RiskPill } from "../components/ui/RiskBand";
import { Button } from "../components/ui/Button";
import { LanguageToggle } from "../components/ui/LanguageToggle";
import type { Locale } from "../types/auth";
import type { RiskSummary } from "../types/app";

export interface ProfilePageCopy {
  title: string;
  baselineTitle: string;
  retake: string;
  settingsTitle: string;
  language: string;
  logout: string;
}

export interface ProfilePageProps {
  copy: ProfilePageCopy;
  email: string;
  risk: RiskSummary;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onRetakeAssessment?: () => void;
  onLogout?: () => void;
}

/**
 * Profile: account identity, health-baseline summary, and settings.
 * The language control is the same toggle used in the app header, so
 * switching from either place stays in sync.
 */
export function ProfilePage({
  copy,
  email,
  risk,
  locale,
  onLocaleChange,
  onRetakeAssessment,
  onLogout,
}: ProfilePageProps) {
  return (
    <>
      {/* The design has no visible page title, but screen readers still
          need one to announce the screen. */}
      <h1 className="sr-only">{copy.title}</h1>

      <SettingRow
        title={email}
        emphasis
        action={<RiskPill band={risk.band} label={risk.label} variant="solid" />}
      />

      <SettingRow
        title={copy.baselineTitle}
        description={risk.meta}
        action={
          <Button
            variant="secondary"
            onClick={onRetakeAssessment}
            className="border-2 border-brand-700 text-brand-700"
          >
            {copy.retake}
          </Button>
        }
      />

      <section className="space-y-4">
        <h2 className="font-sora text-h3 text-brand-800">
          {copy.settingsTitle}
        </h2>

        <SettingRow
          title={copy.language}
          action={<LanguageToggle value={locale} onChange={onLocaleChange} />}
        />
      </section>

      <Button
        variant="secondary"
        fullWidth
        onClick={onLogout}
        className="border-2 border-brand-700 text-brand-700"
      >
        {copy.logout}
      </Button>
    </>
  );
}
