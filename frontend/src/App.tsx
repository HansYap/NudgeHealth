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
import type { AppRoute, ClinicOption, NavRoute } from "./types/app";
import type {
  AuthUser,
  Locale,
  LoginSubmitResult,
  SignupSubmitResult,
} from "./types/auth";
import { ApiError, logout as logoutFromApi, me } from "./lib/api/auth";
import {
  type AssessmentTriggerReason,
  type AssessmentResponse,
  getAssessmentHistory,
  getCurrentAssessment,
  submitBaselineAssessment,
} from "./lib/api/assessments";
import { clearAuthTokens, hasAuthTokens } from "./lib/auth/tokens";
import { getSavedLocale, saveLocale } from "./lib/i18n/locale";
import { clinicsToOptions } from "./lib/adapters/clinics";
import { actionItemsToFocusTasks, actionItemsToPlanItems } from "./lib/adapters/plan";
import {
  assessmentToRiskFactors,
  assessmentToRiskSummary,
} from "./lib/adapters/risk";
import { listClinics } from "./lib/api/clinics";
import { getReassessmentPrompt } from "./lib/api/diary";
import {
  MOCK_RISK,
  MOCK_TASKS,
  MOCK_FACTORS,
  MOCK_PLAN,
} from "./lib/mockData";

import en from "./lib/i18n/en.json";
import bm from "./lib/i18n/bm.json";

const COPY: Record<Locale, typeof en> = { en, bm };

type Route = "login" | "signup" | AppRoute;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthTokens);
  const [isBootstrapping, setIsBootstrapping] = useState(hasAuthTokens);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [route, setRoute] = useState<Route>(() =>
    hasAuthTokens() ? "home" : "login"
  );
  const [locale, setLocaleState] = useState<Locale>(getSavedLocale);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState<
    boolean | null
  >(hasAuthTokens() ? null : false);
  const [currentAssessment, setCurrentAssessment] =
    useState<AssessmentResponse | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<
    AssessmentResponse[]
  >([]);
  const [clinicOptions, setClinicOptions] = useState<ClinicOption[]>([]);
  const [baseline, setBaseline] = useState<OnboardingAnswers | null>(null);
  // Set when onboarding was opened from Profile, so we can return there
  // instead of dropping the user on Home.
  const [retakeOrigin, setRetakeOrigin] = useState<AppRoute | null>(null);
  const [retakeTriggerReason, setRetakeTriggerReason] =
    useState<AssessmentTriggerReason>("onboarding");
  const [shouldPromptReassessment, setShouldPromptReassessment] =
    useState(false);
  const t = COPY[locale];

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    saveLocale(nextLocale);
  };

  useEffect(() => {
    if (!hasAuthTokens()) return;

    let cancelled = false;

    const bootstrapSession = async () => {
      try {
        const user = await me();
        if (user) {
          if (cancelled) return;
          setCurrentUser(user);
          const hasAssessment = await syncAssessmentState();
          if (!cancelled) setRoute(hasAssessment ? "home" : "onboarding");
        } else {
          clearAuthTokens();
          if (!cancelled) {
            setIsAuthenticated(false);
            setHasCompletedAssessment(false);
            setRoute("login");
          }
        }
      } catch {
        clearAuthTokens();
        if (!cancelled) {
          setIsAuthenticated(false);
          setHasCompletedAssessment(false);
          setRoute("login");
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    };

    void bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (route !== "clinic" || !currentAssessment?.state) return;

    let cancelled = false;

    listClinics(currentAssessment.state)
      .then((clinics) => {
        if (!cancelled) setClinicOptions(clinicsToOptions(clinics));
      })
      .catch(() => {
        if (!cancelled) setClinicOptions([]);
      });

    return () => {
      cancelled = true;
    };
  }, [currentAssessment?.state, route]);

  useEffect(() => {
    if (route !== "home" || !isAuthenticated || hasCompletedAssessment !== true) {
      return;
    }

    let cancelled = false;

    getReassessmentPrompt()
      .then((prompt) => {
        if (!cancelled) {
          setShouldPromptReassessment(prompt.should_prompt_reassessment);
        }
      })
      .catch(() => {
        if (!cancelled) setShouldPromptReassessment(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hasCompletedAssessment, isAuthenticated, route]);

  const syncAssessmentState = async () => {
    try {
      const [assessment, history] = await Promise.all([
        getCurrentAssessment(),
        getAssessmentHistory(),
      ]);
      setCurrentAssessment(assessment);
      setAssessmentHistory(history);
      setHasCompletedAssessment(true);
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setCurrentAssessment(null);
        setAssessmentHistory([]);
        setHasCompletedAssessment(false);
        return false;
      }

      throw error;
    }
  };

  const completeLogin = async (result?: LoginSubmitResult) => {
    setCurrentUser(result?.user ?? null);
    setIsAuthenticated(true);

    const hasAssessment = await syncAssessmentState();
    setRoute(hasAssessment ? "home" : "onboarding");
  };

  const completeSignup = (result?: SignupSubmitResult) => {
    setCurrentUser(result?.user ?? null);
    setIsAuthenticated(true);
    setHasCompletedAssessment(false);
    setRoute("onboarding");
  };

  const completeBaseline = async (answers: OnboardingAnswers) => {
    const assessment = await submitBaselineAssessment(answers, retakeTriggerReason);
    setCurrentAssessment(assessment);
    setAssessmentHistory((prev) => [assessment, ...prev]);
    setBaseline(answers);
    setHasCompletedAssessment(true);
    setShouldPromptReassessment(false);
  };

  const startRetakeAssessment = (
    origin: AppRoute,
    triggerReason: AssessmentTriggerReason
  ) => {
    setRetakeOrigin(origin);
    setRetakeTriggerReason(triggerReason);
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
      setCurrentAssessment(null);
      setClinicOptions([]);
      setAssessmentHistory([]);
      setHasCompletedAssessment(false);
      setRetakeOrigin(null);
      setRetakeTriggerReason("onboarding");
      setShouldPromptReassessment(false);
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
        locale={locale}
        onLocaleChange={setLocale}
      />
    );
  }

  if (route === "signup") {
    return (
      <SignupPage
        onSignupSuccess={completeSignup}
        onNavigateToLogin={() => setRoute("login")}
        locale={locale}
        onLocaleChange={setLocale}
      />
    );
  }

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-alabaster px-6 text-body-sm text-slate-500">
        Loading...
      </div>
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
        locale={locale}
        onLocaleChange={setLocale}
      />
    );
  }

  if (route === "onboarding" || hasCompletedAssessment === false) {
    return (
      <OnboardingPage
        copy={t.onboarding}
        initialAnswers={baseline ?? undefined}
        onComplete={completeBaseline}
        onSeeScore={() => {
          setRoute(retakeOrigin ?? "home");
          setRetakeOrigin(null);
          setRetakeTriggerReason("onboarding");
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

  const risk = currentAssessment
    ? assessmentToRiskSummary(
        currentAssessment,
        locale,
        t.risk.bands,
        assessmentHistory.length > 0 ? assessmentHistory : [currentAssessment]
      )
    : null;
  const fallbackRisk = {
    ...MOCK_RISK,
    label: t.risk.bands[MOCK_RISK.band],
  };
  const riskFactors = currentAssessment
    ? assessmentToRiskFactors(currentAssessment, locale)
    : MOCK_FACTORS;
  const focusTasks = currentAssessment
    ? actionItemsToFocusTasks(currentAssessment.action_items, locale)
    : MOCK_TASKS;
  const planItems = currentAssessment
    ? actionItemsToPlanItems(currentAssessment.action_items, locale)
    : MOCK_PLAN;

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
            risk={risk ?? fallbackRisk}
            factors={riskFactors}
            onBack={() => setRoute("home")}
            onSeePlan={() => setRoute("plan")}
          />
        );
      case "plan":
        return (
          <PlanPage
            copy={t.plan}
            items={planItems}
            onFindClinic={() => setRoute("clinic")}
          />
        );
      case "clinic":
        return (
          <ClinicPage
            copy={t.clinic}
            options={clinicOptions}
            onBack={() => setRoute("plan")}
          />
        );
      case "diary":
        return <DiaryPage copy={t.diary} locale={locale} />;
      case "profile":
        return (
          <ProfilePage
            copy={t.profile}
            email={currentUser?.email ?? ""}
            risk={risk ?? fallbackRisk}
            locale={locale}
            onLocaleChange={setLocale}
            onRetakeAssessment={() => {
              startRetakeAssessment("profile", "manual_retake");
            }}
            onLogout={endSession}
          />
        );
      default:
        return (
          <HomePage
            copy={t.home}
            risk={risk}
            tasks={focusTasks}
            onViewRiskDetail={() => setRoute("risk")}
            onViewFullPlan={() => setRoute("plan")}
            onRetryScore={syncAssessmentState}
            shouldPromptReassessment={shouldPromptReassessment}
            onRetakeAssessment={() => {
              startRetakeAssessment("home", "diary_flagged");
            }}
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
