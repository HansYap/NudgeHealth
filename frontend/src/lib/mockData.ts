import type {
  ClinicOption,
  DiaryEntry,
  FocusTask,
  PlanItem,
  RiskFactor,
  RiskSummary,
} from "../types/app";

/**
 * Placeholder data standing in for the scoring / recommendations APIs.
 * Replace these with real fetches once the backend endpoints are wired.
 */

export const MOCK_RISK: RiskSummary = {
  band: "moderate",
  label: "Moderate",
  description:
    "A few changeable habits are pulling your score up, most of what's driving it is within your control.",
  meta: "Last assessed 3 days ago",
  detailMeta: "First assessed Jan 2026 · Updated 3 days ago",
};

export const MOCK_TASKS: FocusTask[] = [
  {
    id: "t1",
    category: "check",
    title: "Book a mammogram screening",
    meta: "Check · once this month",
  },
  {
    id: "t2",
    category: "check",
    title: "Book a health screening",
    meta: "Check · once this month",
  },
  {
    id: "t3",
    category: "move",
    title: "Walk 20 minutes",
    meta: "Move · 4 times this week",
  },
];

export const MOCK_FACTORS: RiskFactor[] = [
  {
    id: "f1",
    title: "National baseline",
    description: "Malaysia's life table data for your age, sex & state",
    impact: "baseline",
    impactLabel: "Starting point",
  },
  {
    id: "f2",
    title: "Activity level: Low",
    impact: "increases",
    impactLabel: "Increases risk",
  },
  {
    id: "f3",
    title: "Smoking status: Former smoker",
    impact: "increases",
    impactLabel: "Increases risk",
  },
  {
    id: "f4",
    title: "Screening history: up to date",
    impact: "lowers",
    impactLabel: "Lowers risk",
  },
];

export const MOCK_PLAN: PlanItem[] = [
  {
    id: "p1",
    category: "check",
    title: "Book a mammogram screening",
    meta: "Check \u00b7 once this month",
    priority: true,
    why: "Why: elevated risk flagged for your age & sex band",
  },
  {
    id: "p2",
    category: "move",
    title: "Walk 20 minutes",
    meta: "Move \u00b7 4 times this week",
    priority: true,
    why: "Why: low activity level flagged in your assessment",
  },
  {
    id: "p3",
    category: "eat",
    title: "Cut down red meat, add more veg",
    meta: "Eat \u00b7 3 times this week",
    priority: true,
    why: "Why: supports cardiovascular risk reduction",
  },
  {
    id: "p4",
    category: "rest",
    title: "Sleep 7+ hours nightly",
    meta: "Rest \u00b7 nightly",
    priority: true,
    why: "Why: low reported sleep quality",
  },
  {
    id: "p5",
    category: "check",
    title: "Blood pressure check",
    meta: "Check \u00b7 once this month",
    priority: false,
    why: "Why: preventive \u2014 not urgent given your profile",
  },
  {
    id: "p6",
    category: "move",
    title: "10-minute stretch routine",
    meta: "Move \u00b7 3 times this week",
    priority: false,
    why: "Why: complements your walking goal",
  },
];

export const MOCK_CLINICS: ClinicOption[] = [
  {
    id: "c1",
    category: "check",
    title: "General health screening",
    meta: "Klinik Kesihatan & government clinics",
    query: "Klinik Kesihatan near me",
  },
  {
    id: "c2",
    category: "check",
    title: "Mammogram / breast screening",
    meta: "Private clinics & hospitals",
    query: "mammogram screening clinic near me",
  },
  {
    id: "c3",
    category: "check",
    title: "Blood pressure & diabetes check",
    meta: "Nearby pharmacies & clinics",
    query: "blood pressure diabetes check pharmacy near me",
  },
];

export const MOCK_DIARY: DiaryEntry[] = [
  {
    id: "d1",
    timestamp: "Today, 8:12 AM",
    mood: "good",
    note: "Slept well, went for a walk",
  },
  {
    id: "d2",
    timestamp: "Yesterday, 9:40 PM",
    mood: "okay",
    note: "Bit tired after work",
  },
  {
    id: "d3",
    timestamp: "2 days ago, 7:55 AM",
    mood: "bad",
    note: "Headache, skipped breakfast",
  },
];

export const MOCK_USER = {
  email: "lmwjian@gmail.com",
};
