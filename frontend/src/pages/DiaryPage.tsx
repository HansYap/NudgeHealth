import { useEffect, useRef, useState } from "react";
import { NotebookPen, Clock, Info, X } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { ChoiceGroup } from "../components/ui/ChoiceGroup";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { HintLine } from "../components/ui/HintLine";
import { EmptyState } from "../components/ui/EmptyState";
import { DiaryEntryCard } from "../components/diary/DiaryEntryCard";
import { createDiaryEntry, listDiaryEntries } from "../lib/api/diary";
import { diaryEntriesToView, diaryEntryToView } from "../lib/adapters/diary";
import type { DiaryEntry, Mood } from "../types/app";
import type { Locale } from "../types/auth";

export interface DiaryPageCopy {
  title: string;
  subtitle: string;
  moodLegend: string;
  moods: Record<Mood, string>;
  moodInfoLabel: string;
  moodInfoTitle: string;
  moodInfoIntro: string;
  moodInfoItems: Record<Mood, string>;
  moodInfoClose: string;
  loadError: string;
  saveError: string;
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
  locale: Locale;
}

/**
 * Health diary: a one-tap mood check-in with an optional note, plus the
 * running history. Mood is required before saving; the note never is.
 */
export function DiaryPage({ copy, locale }: DiaryPageProps) {
  const formRef = useRef<HTMLElement>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const moodOptions = [
    { value: "not_great" as Mood, label: copy.moods.not_great },
    { value: "okay" as Mood, label: copy.moods.okay },
    { value: "good" as Mood, label: copy.moods.good },
  ];

  useEffect(() => {
    let cancelled = false;

    listDiaryEntries()
      .then((items) => {
        if (!cancelled) {
          setEntries(diaryEntriesToView(items, locale));
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError(copy.loadError);
      });

    return () => {
      cancelled = true;
    };
  }, [copy.loadError, locale]);

  const handleSave = async () => {
    if (!mood) return;

    setIsSaving(true);
    setError(null);

    try {
      const entry = await createDiaryEntry({
        feeling: mood,
        note: note.trim(),
      });
      setEntries((prev) => [diaryEntryToView(entry, locale), ...prev]);
      setMood(null);
      setNote("");
    } catch {
      setError(copy.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PageHeader title={copy.title} subtitle={copy.subtitle} />

      <section
        ref={formRef}
        className="relative space-y-5 rounded-[14px] border border-hairline bg-white p-6"
      >
        <button
          type="button"
          aria-label={copy.moodInfoLabel}
          onClick={() => setIsInfoOpen(true)}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-brand-700 outline-none transition-colors hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-700"
        >
          <Info className="h-5 w-5" aria-hidden="true" />
        </button>

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
          maxLength={240}
          onChange={(event) => setNote(event.target.value)}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <HintLine
            icon={<Clock className="h-3.5 w-3.5" />}
            message={copy.autoLogged}
          />
          <Button onClick={handleSave} disabled={!mood} isLoading={isSaving}>
            {copy.save}
          </Button>
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-rust-light px-4 py-3 text-body-sm text-rust"
        >
          {error}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="font-sora text-h3 text-brand-800">{copy.historyTitle}</h2>

        {entries.length === 0 ? (
          <EmptyState
            icon={<NotebookPen className="h-6 w-6" />}
            title={copy.emptyTitle}
            message={copy.emptyMessage}
            actionLabel={copy.emptyCta}
            onAction={() =>
              formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
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

      {isInfoOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-40 flex items-center justify-center bg-ink-900/40 px-5"
          onClick={() => setIsInfoOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="mood-info-title"
            className="w-full max-w-md rounded-[14px] border border-hairline bg-white p-6 shadow-popover"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="mood-info-title"
                  className="font-sora text-h3 text-brand-800"
                >
                  {copy.moodInfoTitle}
                </h2>
                <p className="mt-2 text-body-sm text-slate-500">
                  {copy.moodInfoIntro}
                </p>
              </div>
              <button
                type="button"
                aria-label={copy.moodInfoClose}
                onClick={() => setIsInfoOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 outline-none transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {moodOptions.map((option) => (
                <div
                  key={option.value}
                  className="rounded-[10px] border border-hairline bg-alabaster px-4 py-3"
                >
                  <p className="text-body-sm font-bold text-ink-900">
                    {option.label}
                  </p>
                  <p className="mt-1 text-body-sm text-slate-600">
                    {copy.moodInfoItems[option.value]}
                  </p>
                </div>
              ))}
            </div>

            <Button
              fullWidth
              className="mt-5"
              onClick={() => setIsInfoOpen(false)}
            >
              {copy.moodInfoClose}
            </Button>
          </section>
        </div>
      )}
    </>
  );
}
