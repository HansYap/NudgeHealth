import type { FactorImpact, RiskFactor, RiskSummary } from "../../types/app";
import type { Locale } from "../../types/auth";
import type {
  AssessmentResponse,
  ScoreFactorResponse,
} from "../api/assessments";

const BAND_DESCRIPTIONS: Record<Locale, Record<AssessmentResponse["risk_band"], string>> = {
  en: {
    low: "Your current habits are keeping your modifiable risk low.",
    moderate: "Some changeable habits are raising your modifiable risk.",
    high: "Several changeable habits are strongly raising your modifiable risk.",
  },
  bm: {
    low: "Tabiat semasa anda mengekalkan risiko boleh ubah pada tahap rendah.",
    moderate: "Beberapa tabiat yang boleh diubah meningkatkan risiko anda.",
    high: "Beberapa tabiat yang boleh diubah meningkatkan risiko anda dengan ketara.",
  },
};

export function assessmentToRiskSummary(
  assessment: AssessmentResponse,
  locale: Locale,
  labels: Record<AssessmentResponse["risk_band"], string>,
  history: AssessmentResponse[] = [assessment]
): RiskSummary {
  const relative = formatRelativeAssessmentTime(assessment.created_at, locale);
  const firstAssessment = getOldestAssessment(history) ?? assessment;

  return {
    band: assessment.risk_band,
    label: labels[assessment.risk_band],
    description: BAND_DESCRIPTIONS[locale][assessment.risk_band],
    meta: relative,
    detailMeta: formatDetailMeta(
      firstAssessment.created_at,
      assessment.created_at,
      locale
    ),
  };
}

export function assessmentToRiskFactors(
  assessment: AssessmentResponse,
  locale: Locale
): RiskFactor[] {
  const smoking = findFactor(assessment.score_factors, "smoking");
  const bmiActivity = findFactor(assessment.score_factors, "bmi_activity");

  if (locale === "bm") {
    return [
      {
        id: "baseline",
        title: "Asas nasional",
        description: "Titik permulaan berdasarkan umur, jantina dan negeri anda.",
        impact: "baseline",
        impactLabel: "Titik mula",
      },
      {
        id: "smoking",
        title: "Status merokok",
        description: smoking
          ? "Jawapan merokok anda mempengaruhi skor ini."
          : "Tiada risiko merokok tambahan dalam penilaian ini.",
        impact: mapImpact(smoking),
        impactLabel: mapImpactLabel(smoking, locale),
      },
      {
        id: "bmi_activity",
        title: "Berat/aktiviti",
        description: bmiActivity
          ? "Gabungan berat dan aktiviti anda mempengaruhi skor ini."
          : "Tiada risiko berat/aktiviti tambahan dalam penilaian ini.",
        impact: mapImpact(bmiActivity),
        impactLabel: mapImpactLabel(bmiActivity, locale),
      },
    ];
  }

  return [
    {
      id: "baseline",
      title: "National baseline",
      description: "Starting point based on your age, sex and state.",
      impact: "baseline",
      impactLabel: "Starting point",
    },
    {
      id: "smoking",
      title: "Smoking status",
      description:
        smoking?.label ?? "No added smoking risk in this assessment.",
      impact: mapImpact(smoking),
      impactLabel: mapImpactLabel(smoking, locale),
    },
    {
      id: "bmi_activity",
      title: "Weight/activity",
      description:
        bmiActivity?.label ??
        "No added weight/activity risk in this assessment.",
      impact: mapImpact(bmiActivity),
      impactLabel: mapImpactLabel(bmiActivity, locale),
    },
  ];
}

function formatRelativeAssessmentTime(value: string, locale: Locale) {
  const assessedAt = new Date(value);
  const elapsedMs = Date.now() - assessedAt.getTime();
  const elapsedDays = Math.max(0, Math.floor(elapsedMs / 86_400_000));

  if (locale === "bm") {
    if (elapsedDays === 0) return "Dinilai hari ini";
    if (elapsedDays === 1) return "Dinilai 1 hari lalu";
    return `Dinilai ${elapsedDays} hari lalu`;
  }

  if (elapsedDays === 0) return "Last assessed today";
  if (elapsedDays === 1) return "Last assessed 1 day ago";
  return `Last assessed ${elapsedDays} days ago`;
}

function findFactor(
  factors: ScoreFactorResponse[],
  category: ScoreFactorResponse["category"]
) {
  return factors.find((factor) => factor.category === category);
}

function mapImpact(factor: ScoreFactorResponse | undefined): FactorImpact {
  if (!factor) return "neutral";
  return factor.direction === "decreases_risk" ? "lowers" : "increases";
}

function mapImpactLabel(
  factor: ScoreFactorResponse | undefined,
  locale: Locale
) {
  if (!factor) return locale === "bm" ? "Tiada tambahan" : "No added risk";
  if (factor.direction === "decreases_risk") {
    return locale === "bm" ? "Menurunkan risiko" : "Lowers risk";
  }
  return locale === "bm" ? "Meningkatkan risiko" : "Increases risk";
}

function getOldestAssessment(history: AssessmentResponse[]) {
  return [...history].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )[0];
}

function formatDetailMeta(first: string, updated: string, locale: Locale) {
  const firstDate = formatDate(first, locale);
  const updatedRelative = formatRelativeAssessmentTime(updated, locale);

  if (locale === "bm") {
    return `Mula dinilai ${firstDate} - ${updatedRelative}`;
  }

  return `First assessed ${firstDate} - ${updatedRelative}`;
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "bm" ? "ms-MY" : "en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
