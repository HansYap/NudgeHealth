import { StatusPill, type PillTone } from "../ui/FactorRow";
import type { DiaryEntry, Mood } from "../../types/app";

/** Mood tints reuse the same semantic colors as the risk bands. */
const MOOD_TONE: Record<Mood, PillTone> = {
  good: "sage",
  okay: "amber",
  bad: "rust",
};

export interface DiaryEntryCardProps {
  entry: DiaryEntry;
  /** Localized mood label, e.g. "Good" / "Baik" */
  moodLabel: string;
}

/** One row in the diary history list: timestamp + mood pill + note. */
export function DiaryEntryCard({ entry, moodLabel }: DiaryEntryCardProps) {
  return (
    <article className="min-h-tap rounded-[14px] border border-hairline bg-white px-4 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-body-sm font-bold text-ink-900">{entry.timestamp}</h3>
        <StatusPill label={moodLabel} tone={MOOD_TONE[entry.mood]} />
      </div>
      {entry.note && (
        <p className="mt-1 text-caption font-normal normal-case tracking-normal text-slate-500">
          {entry.note}
        </p>
      )}
    </article>
  );
}
