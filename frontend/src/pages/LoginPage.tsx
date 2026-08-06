import { useState } from "react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { BrandPanel } from "../components/auth/BrandPanel";
import { FormHeader } from "../components/auth/FormHeader";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupPrompt } from "../components/auth/SignupPrompt";
import { SecurityNote } from "../components/auth/SecurityNote";
import { LanguageToggle } from "../components/ui/LanguageToggle";
import { Logo } from "../components/ui/Logo";
import type { Locale, LoginSubmitResult } from "../types/auth";

import en from "../lib/i18n/en.json";
import bm from "../lib/i18n/bm.json";

const COPY: Record<Locale, typeof en> = { en, bm };

export interface LoginPageProps {
  /** Called on successful authentication, e.g. to redirect */
  onLoginSuccess?: (result: LoginSubmitResult) => void;
  /** Navigate to the signup route */
  onNavigateToSignup?: () => void;
  /** Navigate to the forgot-password route */
  onNavigateToForgotPassword?: () => void;
  initialLocale?: Locale;
}

/**
 * Top-level login screen. Wires localized copy, language switching,
 * and the auth layout/form components together.
 */
export function LoginPage({
  onLoginSuccess,
  onNavigateToSignup,
  onNavigateToForgotPassword,
  initialLocale = "en",
}: LoginPageProps) {
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
      <FormHeader title={t.login.title} subtitle={t.login.subtitle} />

      <div className="mt-8">
        <LoginForm
          copy={{
            identifierLabel: t.login.identifierLabel,
            passwordLabel: t.login.passwordLabel,
            forgotPassword: t.login.forgotPassword,
            submit: t.login.submit,
          }}
          onSuccess={onLoginSuccess}
          onForgotPassword={onNavigateToForgotPassword}
        />
      </div>

      <div className="mt-6">
        <SignupPrompt
          promptText={t.login.signupPrompt}
          ctaText={t.login.signupCta}
          onCtaClick={onNavigateToSignup}
        />
      </div>

      <SecurityNote message={t.login.securityNote} />
    </AuthLayout>
  );
}
