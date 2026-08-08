/** Every onboarding answer id, in the order they appear. */
export type OnboardingFieldId =
  | "age"
  | "sex"
  | "state"
  | "smoking"
  | "height"
  | "weight"
  | "activity"
  | "sodium"
  | "fruitveg"
  | "screening"
  | "diabetes"
  | "hypertension"
  | "cholesterol";

export interface OnboardingAnswers {
  age: number | null;
  sex: string | null;
  state: string | null;
  smoking: string | null;
  height: number | null;
  weight: number | null;
  activity: string | null;
  sodium: string | null;
  fruitveg: string | null;
  screening: string | null;
  diabetes: string | null;
  hypertension: string | null;
  cholesterol: string | null;
}

export const EMPTY_ANSWERS: OnboardingAnswers = {
  age: null,
  sex: null,
  state: null,
  smoking: null,
  height: null,
  weight: null,
  activity: null,
  sodium: null,
  fruitveg: null,
  screening: null,
  diabetes: null,
  hypertension: null,
  cholesterol: null,
};

/** Which questions belong to which step. */
export const STEP_FIELDS: Record<number, OnboardingFieldId[]> = {
  1: ["age", "sex", "state"],
  2: ["smoking", "height", "weight", "activity"],
  3: [
    "sodium",
    "fruitveg",
    "screening",
    "diabetes",
    "hypertension",
    "cholesterol",
  ],
};

export const TOTAL_STEPS = 3;

export const TOTAL_QUESTIONS = Object.values(STEP_FIELDS).flat().length;

/** Slider ranges. Age spans the full adult lifespan. */
export const SLIDER_RANGES = {
  age: { min: 0, max: 100 },
  height: { min: 140, max: 200 },
  weight: { min: 40, max: 150 },
} as const;

/** Malaysian states & federal territories, alphabetical. */
export const MALAYSIA_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Kuala Lumpur",
  "Labuan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Putrajaya",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
];

/** Standard WHO BMI bands, used for the caption under the weight slider. */
export function computeBmi(heightCm: number, weightKg: number) {
  const metres = heightCm / 100;
  const bmi = weightKg / (metres * metres);

  let category: string;
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else if (bmi < 35) category = "Obese I";
  else category = "Obese II+";

  return { bmi: Number(bmi.toFixed(1)), category };
}
