import type { OnboardingAnswers } from "../onboardingConfig";
import { clearAuthTokens, getAuthTokens } from "../auth/tokens";
import { ApiError } from "./auth";

export interface AssessmentResponse {
  id: number;
  created_at: string;
  trigger_reason: "onboarding" | "manual_retake" | "diary_flagged";
  state: string;
  modifiable_lifestyle_score: number;
  risk_band: "low" | "moderate" | "high";
  score_factors: ScoreFactorResponse[];
  action_items: ActionItemResponse[];
}

export interface ScoreFactorResponse {
  label: string;
  direction: "increases_risk" | "decreases_risk";
  category: "smoking" | "bmi_activity";
}

export interface ActionItemResponse {
  id: number;
  rule_code: string;
  title_en: string;
  title_ms: string;
  detail_en: string;
  detail_ms: string;
  requires_clinic_visit: boolean;
  target_facility_type: string;
  is_priority_ranked: boolean;
  priority_rank: number | null;
}

export type AssessmentTriggerReason =
  | "onboarding"
  | "manual_retake"
  | "diary_flagged";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://nudgehealth-3g61.onrender.com/api";

export async function getCurrentAssessment() {
  return authenticatedRequest<AssessmentResponse>("/assessments/current/");
}

export async function getAssessmentHistory() {
  return authenticatedRequest<AssessmentResponse[]>("/assessments/history/");
}

export async function submitBaselineAssessment(
  answers: OnboardingAnswers,
  triggerReason: AssessmentTriggerReason = "onboarding"
) {
  return authenticatedRequest<AssessmentResponse>("/assessments/", {
    method: "POST",
    body: JSON.stringify(toAssessmentPayload(answers, triggerReason)),
  });
}

async function authenticatedRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const tokens = getAuthTokens();
  if (!tokens) {
    throw new ApiError(401, { detail: "Authentication required." });
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.access}`,
      ...init.headers,
    },
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    if (response.status === 401) clearAuthTokens();
    throw new ApiError(response.status, payload);
  }

  return payload as T;
}

function parseJson(response: Response) {
  return response.text().then((text) => (text ? JSON.parse(text) : null));
}

function toAssessmentPayload(
  answers: OnboardingAnswers,
  triggerReason: AssessmentTriggerReason
) {
  return {
    trigger_reason: triggerReason,
    age: requireAnswer(answers.age),
    sex: mapSex(requireAnswer(answers.sex)),
    state: mapState(requireAnswer(answers.state)),
    smoking_status: mapSmoking(requireAnswer(answers.smoking)),
    height_cm: requireAnswer(answers.height),
    weight_kg: requireAnswer(answers.weight),
    activity_level: mapActivity(requireAnswer(answers.activity)),
    high_sodium: answers.sodium === "yes",
    low_fruit_veg: answers.fruitveg === "no",
    screened_past_2yrs: answers.screening === "yes",
    has_diabetes: answers.diabetes === "yes",
    has_hypertension: answers.hypertension === "yes",
    has_high_cholesterol: answers.cholesterol === "yes",
  };
}

function requireAnswer<T>(value: T | null): T {
  if (value === null) {
    throw new Error("Please complete every question before submitting.");
  }

  return value;
}

function mapSex(value: string) {
  if (value === "male") return "M";
  if (value === "female") return "F";
  return value;
}

function mapSmoking(value: string) {
  const smoking: Record<string, string> = {
    never: "never",
    quit5plus: "former_5plus_years",
    quitunder5: "former_under_5_years",
    current: "current",
  };

  return smoking[value] ?? value;
}

function mapActivity(value: string) {
  if (value === "under150") return "inactive";
  if (value === "over150") return "active";
  return value;
}

function mapState(value: string) {
  const federalTerritories: Record<string, string> = {
    "Kuala Lumpur": "WP Kuala Lumpur",
    Labuan: "WP Labuan",
    Putrajaya: "WP Putrajaya",
  };

  return federalTerritories[value] ?? value;
}
