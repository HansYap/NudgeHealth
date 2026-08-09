import { useEffect, useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { HomePage } from "./pages/HomePage";
import { RiskDetailPage } from "./pages/RiskDetailPage";
import { PlanPage } from "./pages/PlanPage";
import { ClinicPage } from "./pages/ClinicPage";
import { DiaryPage } from "./pages/DiaryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import type { OnboardingAnswers } from "./lib/onboardingConfig";
import { AppShell } from "./components/layout/AppShell";
import type { AppRoute, NavRoute } from "./types/app";
import type { AuthUser, Locale, LoginSubmitResult, SignupSubmitResult } from "./types/auth";
import { logout as logoutFromApi, me } from "./lib/api/auth";
import { clearAuthTokens, hasAuthTokens } from "./lib/auth/tokens";
import {
  MOCK_RISK,
  MOCK_TASKS,
  MOCK_FACTORS,
  MOCK_PLAN,
  MOCK_CLINICS,
  MOCK_DIARY,
} from "./lib/mockData";

import en from "./lib/i18n/en.json";
import bm from "./lib/i18n/bm.json";

const COPY: Record<Locale, typeof en> = { en, bm };

type Route = "login" | "signup" | AppRoute;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthTokens);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [route, setRoute] = useState<Route>(() =>
    hasAuthTokens() ? "home" : "login"
  );
  const [locale, setLocale] = useState<Locale>("en");
  // Null until the baseline questionnaire has been completed. Everything
  // in the app depends on it, so there is no meaningful Home without it.
  const [baseline, setBaseline] = useState<OnboardingAnswers | null>(null);
  // Set when onboarding was opened from Profile, so we can return there
  // instead of dropping the user on Home.
  const [retakeOrigin, setRetakeOrigin] = useState<AppRoute | null>(null);
  const t = COPY[locale];

  useEffect(() => {
    if (!isAuthenticated || currentUser) return;

    me()
      .then((user) => {
        if (user) {
          setCurrentUser(user);
          return;
        }

        clearAuthTokens();
        setIsAuthenticated(false);
        setRoute("login");
      })
      .catch(() => {
        clearAuthTokens();
        setIsAuthenticated(false);
        setRoute("login");
      });
  }, [currentUser, isAuthenticated]);

  const completeLogin = (result?: LoginSubmitResult) => {
    setCurrentUser(result?.user ?? null);
    setIsAuthenticated(true);
    setRoute("home");
  };

  const completeSignup = (result?: SignupSubmitResult) => {
    setCurrentUser(result?.user ?? null);
    setIsAuthenticated(true);
    setRoute("onboarding");
  };

  const endSession = async () => {
    try {
      await logoutFromApi();
    } catch {
      clearAuthTokens();
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setRetakeOrigin(null);
      setRoute("login");
    }
  };

  if (route === "login") {
    return (
      <LoginPage
        onLoginSuccess={completeLogin}
        onNavigateToSignup={() => setRoute("signup")}
        onNavigateToForgotPassword={() => {
          // TODO: wire up routing to /forgot-password
        }}
      />
    );
  }

  if (route === "signup") {
    return (
      <SignupPage
        onSignupSuccess={completeSignup}
        onNavigateToLogin={() => setRoute("login")}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={completeLogin}
        onNavigateToSignup={() => setRoute("signup")}
        onNavigateToForgotPassword={() => {
          // TODO: wire up routing to /forgot-password
        }}
      />
    );
  }

  // Signup still lands on onboarding. Returning login lands on Home; assessment
  // existence will be wired to the backend in the assessment stories.
  if (route === "onboarding") {
    return (
      <OnboardingPage
        copy={t.onboarding}
        initialAnswers={baseline ?? undefined}
        onComplete={setBaseline}
        onSeeScore={() => {
          setRoute(retakeOrigin ?? "home");
          setRetakeOrigin(null);
        }}
      />
    );
  }

  const navItems = [
    { route: "home" as NavRoute, label: t.nav.home },
    { route: "plan" as NavRoute, label: t.nav.plan },
    { route: "diary" as NavRoute, label: t.nav.diary },
    { route: "profile" as NavRoute, label: t.nav.profile },
  ];

  // The risk detail page lives under Home, so Home stays highlighted in the nav.
  // Sub-pages keep their parent highlighted in the nav.
  const activeNav: NavRoute =
    route === "risk" ? "home" : route === "clinic" ? "plan" : route;

  const renderPage = () => {
    switch (route) {
      case "risk":
        return (
          <RiskDetailPage
            copy={{
              back: t.risk.back,
              riskEyebrow: t.home.riskEyebrow,
              calcTitle: t.risk.calcTitle,
              calcBody: t.risk.calcBody,
              contributingTitle: t.risk.contributingTitle,
              seePlan: t.risk.seePlan,
            }}
            risk={{ ...MOCK_RISK, label: t.risk.bands.moderate }}
            factors={MOCK_FACTORS}
            onBack={() => setRoute("home")}
            onSeePlan={() => setRoute("plan")}
          />
        );
      case "plan":
        return (
          <PlanPage
            copy={t.plan}
            items={MOCK_PLAN}
            onFindClinic={() => setRoute("clinic")}
          />
        );
      case "clinic":
        return (
          <ClinicPage
            copy={t.clinic}
            options={MOCK_CLINICS}
            onBack={() => setRoute("plan")}
          />
        );
      case "diary":
        return <DiaryPage copy={t.diary} initialEntries={MOCK_DIARY} />;
      case "profile":
        return (
          <ProfilePage
            copy={t.profile}
            email={currentUser?.email ?? ""}
            risk={{ ...MOCK_RISK, label: t.risk.bands.moderate }}
            locale={locale}
            onLocaleChange={setLocale}
            onRetakeAssessment={() => {
              setRetakeOrigin("profile");
              setRoute("onboarding");
            }}
            onLogout={endSession}
          />
        );
      default:
        return (
          <HomePage
            copy={t.home}
            risk={{ ...MOCK_RISK, label: t.risk.bands.moderate }}
            tasks={MOCK_TASKS}
            onViewRiskDetail={() => setRoute("risk")}
            onViewFullPlan={() => setRoute("plan")}
          />
        );
    }
  };

  return (
    <AppShell
      brandName={t.brand.name}
      navItems={navItems}
      active={activeNav}
      onNavigate={(next) => setRoute(next)}
      locale={locale}
      onLocaleChange={setLocale}
    >
      {renderPage()}
    </AppShell>
  );
}
