import { useState } from "react";
import { NotebookPen, Clock } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { ChoiceGroup } from "../components/ui/ChoiceGroup";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { HintLine } from "../components/ui/HintLine";
import { EmptyState } from "../components/ui/EmptyState";
import { DiaryEntryCard } from "../components/diary/DiaryEntryCard";
import type { DiaryEntry, Mood } from "../types/app";

export interface DiaryPageCopy {
  title: string;
  subtitle: string;
  moodLegend: string;
  moods: Record<Mood, string>;
  noteLabel: string;
  notePlaceholder: string;
  autoLogged: string;
  save: string;
  historyTitle: string;
  emptyTitle: string;
  emptyMessage: string;
  emptyCta: string;
}

export interface DiaryPageProps {
  copy: DiaryPageCopy;
  initialEntries: DiaryEntry[];
}

/**
 * Health diary: a one-tap mood check-in with an optional note, plus the
 * running history. Mood is required before saving; the note never is.
 */
export function DiaryPage({ copy, initialEntries }: DiaryPageProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>(initialEntries);
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");

  const moodOptions = [
    { value: "bad" as Mood, label: copy.moods.bad },
    { value: "okay" as Mood, label: copy.moods.okay },
    { value: "good" as Mood, label: copy.moods.good },
  ];

  const handleSave = () => {
    if (!mood) return;

    const now = new Date();
    const time = now.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    setEntries((prev) => [
      {
        id: `local-${now.getTime()}`,
        timestamp: `Today, ${time}`,
        mood,
        note: note.trim() || undefined,
      },
      ...prev,
    ]);

    setMood(null);
    setNote("");
  };

  return (
    <>
      <PageHeader title={copy.title} subtitle={copy.subtitle} />

      <section className="space-y-5 rounded-[14px] border border-hairline bg-white p-6">
        <ChoiceGroup
          name="mood"
          legend={copy.moodLegend}
          options={moodOptions}
          value={mood}
          onChange={setMood}
        />

        <Input
          id="diary-note"
          label={copy.noteLabel}
          placeholder={copy.notePlaceholder}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <HintLine
            icon={<Clock className="h-3.5 w-3.5" />}
            message={copy.autoLogged}
          />
          <Button onClick={handleSave} disabled={!mood}>
            {copy.save}
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-sora text-h3 text-brand-800">{copy.historyTitle}</h2>

        {entries.length === 0 ? (
          <EmptyState
            icon={<NotebookPen className="h-6 w-6" />}
            title={copy.emptyTitle}
            message={copy.emptyMessage}
            actionLabel={copy.emptyCta}
          />
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <DiaryEntryCard
                key={entry.id}
                entry={entry}
                moodLabel={copy.moods[entry.mood]}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
