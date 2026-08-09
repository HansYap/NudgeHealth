import type { FocusTask, PlanItem, TaskCategory } from "../../types/app";
import type { Locale } from "../../types/auth";
import type { ActionItemResponse } from "../api/assessments";

const RULE_META: Record<
  string,
  {
    category: TaskCategory;
    frequency_en: string;
    frequency_ms: string;
    why_en: string;
    why_ms: string;
  }
> = {
  SMOKING_CURRENT_MQUIT: {
    category: "check",
    frequency_en: "book once",
    frequency_ms: "tempah sekali",
    why_en: "Why: you reported current smoking.",
    why_ms: "Sebab: anda melaporkan sedang merokok.",
  },
  BMI_OBESE_DIETITIAN: {
    category: "check",
    frequency_en: "book once",
    frequency_ms: "tempah sekali",
    why_en: "Why: your weight range triggered dietitian support.",
    why_ms: "Sebab: julat berat anda mencetuskan sokongan pakar pemakanan.",
  },
  ACTIVITY_INACTIVE_TARGET: {
    category: "move",
    frequency_en: "weekly target",
    frequency_ms: "sasaran mingguan",
    why_en: "Why: your activity level was below the weekly target.",
    why_ms: "Sebab: tahap aktiviti anda di bawah sasaran mingguan.",
  },
  HIGH_SODIUM_DASH: {
    category: "eat",
    frequency_en: "daily",
    frequency_ms: "harian",
    why_en: "Why: you reported frequent high-sodium choices.",
    why_ms: "Sebab: anda melaporkan pilihan tinggi natrium yang kerap.",
  },
  LOW_FRUIT_VEG_INCREASE: {
    category: "eat",
    frequency_en: "daily",
    frequency_ms: "harian",
    why_en: "Why: fruit and vegetable intake was below the target.",
    why_ms: "Sebab: pengambilan buah dan sayur di bawah sasaran.",
  },
  SCREENING_BASELINE: {
    category: "check",
    frequency_en: "once this month",
    frequency_ms: "sekali bulan ini",
    why_en: "Why: you have not had a recent general health screening.",
    why_ms: "Sebab: anda belum menjalani saringan kesihatan umum baru-baru ini.",
  },
  DIABETES_ANNUAL_SCREENING: {
    category: "check",
    frequency_en: "annually",
    frequency_ms: "setiap tahun",
    why_en: "Why: you reported a diabetes diagnosis.",
    why_ms: "Sebab: anda melaporkan diagnosis diabetes.",
  },
  HYPERTENSION_BP_LOG: {
    category: "check",
    frequency_en: "daily",
    frequency_ms: "harian",
    why_en: "Why: you reported a hypertension diagnosis.",
    why_ms: "Sebab: anda melaporkan diagnosis hipertensi.",
  },
  CHOLESTEROL_LIPID_PANEL: {
    category: "check",
    frequency_en: "every 6-12 months",
    frequency_ms: "setiap 6-12 bulan",
    why_en: "Why: you reported high cholesterol.",
    why_ms: "Sebab: anda melaporkan kolesterol tinggi.",
  },
};

export function actionItemsToFocusTasks(
  items: ActionItemResponse[],
  locale: Locale,
  limit = 3
): FocusTask[] {
  return items.slice(0, limit).map((item) => {
    const meta = RULE_META[item.rule_code] ?? fallbackMeta;
    const categoryLabel = getCategoryLabel(meta.category, locale);
    const frequency = locale === "bm" ? meta.frequency_ms : meta.frequency_en;

    return {
      id: String(item.id),
      category: meta.category,
      title: locale === "bm" ? item.title_ms : item.title_en,
      meta: `${categoryLabel} - ${frequency}`,
    };
  });
}

export function actionItemsToPlanItems(
  items: ActionItemResponse[],
  locale: Locale
): PlanItem[] {
  return actionItemsToFocusTasks(items, locale, items.length).map((task, index) => {
    const item = items[index];
    const meta = RULE_META[item.rule_code] ?? fallbackMeta;

    return {
      ...task,
      priority: item.is_priority_ranked,
      detail: locale === "bm" ? item.detail_ms : item.detail_en,
      why: locale === "bm" ? meta.why_ms : meta.why_en,
    };
  });
}

const fallbackMeta = {
  category: "check" as TaskCategory,
  frequency_en: "as recommended",
  frequency_ms: "seperti disyorkan",
  why_en: "Why: this was triggered by your assessment.",
  why_ms: "Sebab: ini dicetuskan oleh penilaian anda.",
};

function getCategoryLabel(category: TaskCategory, locale: Locale) {
  if (locale === "bm") {
    const labels: Record<TaskCategory, string> = {
      check: "Periksa",
      move: "Bergerak",
      eat: "Makan",
    };
    return labels[category];
  }

  const labels: Record<TaskCategory, string> = {
    check: "Check",
    move: "Move",
    eat: "Eat",
  };
  return labels[category];
}
