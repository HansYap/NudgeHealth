import { useState } from "react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { BrandPanel } from "../components/auth/BrandPanel";
import { FormHeader } from "../components/auth/FormHeader";
import { SignupForm } from "../components/auth/SignupForm";
import { SignupPrompt } from "../components/auth/SignupPrompt";
import { SecurityNote } from "../components/auth/SecurityNote";
import { LanguageToggle } from "../components/ui/LanguageToggle";
import { Logo } from "../components/ui/Logo";
import type { Locale, SignupSubmitResult } from "../types/auth";

import en from "../lib/i18n/en.json";
import bm from "../lib/i18n/bm.json";

const COPY: Record<Locale, typeof en> = { en, bm };

export interface SignupPageProps {
  /** Called on successful account creation, e.g. to redirect to onboarding */
  onSignupSuccess?: (result: SignupSubmitResult) => void;
  /** Navigate back to the login route */
  onNavigateToLogin?: () => void;
  initialLocale?: Locale;
}

/**
 * Top-level signup screen. Shares the entire auth shell with LoginPage —
 * only the header copy, form fields, and prompt direction differ.
 */
export function SignupPage({
  onSignupSuccess,
  onNavigateToLogin,
  initialLocale = "en",
}: SignupPageProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = COPY[locale];

  return (
    <AuthLayout
      panel={
        <BrandPanel
          brandName={t.brand.name}
          headline={t.brand.headline}
          trustBadges={t.trustBadges}
        />
      }
      mobileBrand={
        <Logo name={t.brand.name} variant="light" showWordmark={false} />
      }
      topRight={<LanguageToggle value={locale} onChange={setLocale} />}
    >
      <FormHeader title={t.signup.title} subtitle={t.signup.subtitle} />

      <div className="mt-8">
        <SignupForm
          copy={{
            emailLabel: t.signup.emailLabel,
            passwordLabel: t.signup.passwordLabel,
            confirmPasswordLabel: t.signup.confirmPasswordLabel,
            submit: t.signup.submit,
          }}
          onSuccess={onSignupSuccess}
        />
      </div>

      <div className="mt-6">
        <SignupPrompt
          promptText={t.signup.loginPrompt}
          ctaText={t.signup.loginCta}
          onCtaClick={onNavigateToLogin}
        />
      </div>

      <SecurityNote message={t.signup.securityNote} />
    </AuthLayout>
  );
}
