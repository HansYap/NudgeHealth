// Shared domain types for the authenticated app screens.
import type { RiskBand } from "../components/ui/RiskBand";

export type AppRoute =
  | "onboarding"
  | "home"
  | "risk"
  | "plan"
  | "clinic"
  | "diary"
  | "profile";

/** Left-nav destinations (Design System 04). "risk" is a sub-page of home. */
export type NavRoute = Exclude<AppRoute, "risk" | "clinic" | "onboarding">;

export interface RiskSummary {
  band: RiskBand;
  /** Short band name shown in the hero, e.g. "Moderate" */
  label: string;
  /** One-line context under the hero label (detail view only) */
  description: string;
  /** e.g. "Last assessed 3 days ago" */
  meta: string;
  /** e.g. "First assessed Jan 2026 · Updated 3 days ago" (detail view) */
  detailMeta: string;
}

export type TaskCategory = "check" | "move" | "eat";

export interface FocusTask {
  id: string;
  category: TaskCategory;
  title: string;
  /** e.g. "Check · once this month" */
  meta: string;
}

export type FactorImpact = "neutral" | "baseline" | "increases" | "lowers";

export interface RiskFactor {
  id: string;
  title: string;
  description?: string;
  impact: FactorImpact;
  impactLabel: string;
}

/** A ranked recommendation on the monthly plan (extends the Home focus task). */
export interface PlanItem extends FocusTask {
  /** Shows the PRIORITY pill when true */
  priority: boolean;
  /** Backend action detail, localized by the adapter */
  detail: string;
  /** Plain-language rationale, e.g. "Why: low activity level flagged..." */
  why: string;
}

/** A screening type the user can look up on Google Maps. */
export interface ClinicOption {
  id: string;
  category: TaskCategory;
  title: string;
  meta: string;
  /** Search phrase handed to Google Maps */
  query: string;
}

export type Mood = "good" | "okay" | "bad";

export interface DiaryEntry {
  id: string;
  /** Pre-formatted, e.g. "Today, 8:12 AM" */
  timestamp: string;
  mood: Mood;
  note?: string;
}
