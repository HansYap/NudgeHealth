import type { Locale } from "../../types/auth";

const LOCALE_KEY = "nudgehealth.locale";

export function getSavedLocale(): Locale {
  const value = localStorage.getItem(LOCALE_KEY);
  return value === "bm" || value === "en" ? value : "en";
}

export function saveLocale(locale: Locale) {
  localStorage.setItem(LOCALE_KEY, locale);
}
