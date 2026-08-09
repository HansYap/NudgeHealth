import type { DiaryEntry } from "../../types/app";
import type { Locale } from "../../types/auth";
import type { DiaryEntryResponse } from "../api/diary";

export function diaryEntryToView(
  entry: DiaryEntryResponse,
  locale: Locale
): DiaryEntry {
  return {
    id: String(entry.id),
    timestamp: formatDiaryTimestamp(entry.logged_at, locale),
    mood: entry.feeling,
    note: entry.note.trim() || undefined,
  };
}

export function diaryEntriesToView(
  entries: DiaryEntryResponse[],
  locale: Locale
) {
  return entries.map((entry) => diaryEntryToView(entry, locale));
}

function formatDiaryTimestamp(value: string, locale: Locale) {
  const loggedAt = new Date(value);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const time = new Intl.DateTimeFormat(locale === "bm" ? "ms-MY" : "en-MY", {
    hour: "numeric",
    minute: "2-digit",
  }).format(loggedAt);

  if (isSameDate(loggedAt, now)) {
    return locale === "bm" ? `Hari ini, ${time}` : `Today, ${time}`;
  }

  if (isSameDate(loggedAt, yesterday)) {
    return locale === "bm" ? `Semalam, ${time}` : `Yesterday, ${time}`;
  }

  const date = new Intl.DateTimeFormat(locale === "bm" ? "ms-MY" : "en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(loggedAt);

  return `${date}, ${time}`;
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
