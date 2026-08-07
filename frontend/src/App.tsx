import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { HomePage } from "./pages/HomePage";
import { RiskDetailPage } from "./pages/RiskDetailPage";
import { PlanPage } from "./pages/PlanPage";
import { ClinicPage } from "./pages/ClinicPage";
import { DiaryPage } from "./pages/DiaryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AppShell } from "./components/layout/AppShell";
import type { AppRoute, NavRoute } from "./types/app";
import type { Locale } from "./types/auth";
import {
  MOCK_RISK,
  MOCK_TASKS,
  MOCK_FACTORS,
  MOCK_PLAN,
  MOCK_CLINICS,
  MOCK_DIARY,
  MOCK_USER,
} from "./lib/mockData";

import en from "./lib/i18n/en.json";
import bm from "./lib/i18n/bm.json";

const COPY: Record<Locale, typeof en> = { en, bm };

type Route = "login" | "signup" | AppRoute;

export default function App() {
  const [route, setRoute] = useState<Route>("login");
  const [locale, setLocale] = useState<Locale>("en");
  const t = COPY[locale];

  if (route === "login") {
    return (
      <LoginPage
        onLoginSuccess={() => setRoute("home")}
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
        onSignupSuccess={() => setRoute("home")}
        onNavigateToLogin={() => setRoute("login")}
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
            email={MOCK_USER.email}
            risk={{ ...MOCK_RISK, label: t.risk.bands.moderate }}
            locale={locale}
            onLocaleChange={setLocale}
            onLogout={() => setRoute("login")}
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
