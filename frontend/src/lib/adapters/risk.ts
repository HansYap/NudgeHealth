import type { RiskSummary } from "../../types/app";
import type { Locale } from "../../types/auth";
import type { AssessmentResponse } from "../api/assessments";

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
  labels: Record<AssessmentResponse["risk_band"], string>
): RiskSummary {
  const relative = formatRelativeAssessmentTime(assessment.created_at, locale);

  return {
    band: assessment.risk_band,
    label: labels[assessment.risk_band],
    description: BAND_DESCRIPTIONS[locale][assessment.risk_band],
    meta: relative,
    detailMeta: relative,
  };
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
