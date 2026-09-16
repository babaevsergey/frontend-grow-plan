"use client";

import type { DifficultyLevel, InterviewFrequency } from "@/types/content";
import { useAppStore } from "@/store/useAppStore";
import { TOPICS } from "@/data/content";
import { cx } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

/**
 * Бейджи "уровень сложности" и "частота на интервью" — рендерятся
 * прямо в шапке подтемы, рядом с заголовком.
 */
const DIFFICULTY_STYLES: Record<DifficultyLevel, string> = {
  Basic: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30",
  Middle: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30",
  Senior: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
  Lead: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30",
};

const FREQUENCY_STYLES: Record<InterviewFrequency, string> = {
  High: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30",
  Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
  Low: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

export function MetaBadges({
  difficulty,
  interviewFrequency,
}: {
  difficulty?: DifficultyLevel;
  interviewFrequency?: InterviewFrequency;
}) {
  const { t } = useTranslation();
  if (!difficulty && !interviewFrequency) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {difficulty && (
        <span
          className={cx(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            DIFFICULTY_STYLES[difficulty]
          )}
        >
          {difficulty}
        </span>
      )}
      {interviewFrequency && (
        <span
          className={cx(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            FREQUENCY_STYLES[interviewFrequency]
          )}
        >
          {t.lesson.interviewFrequencyLabel}: {interviewFrequency}
        </span>
      )}
    </div>
  );
}

export function WhereUsedBlock({ text }: { text: string }) {
  const { t } = useTranslation();
  return (
    <section id="sec-where-used" className="scroll-mt-6 rounded-md border-l-4 border-l-teal-400 bg-teal-50/50 px-4 py-3 dark:border-l-teal-500 dark:bg-teal-500/10">
      <h2 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-teal-800 dark:text-teal-300">
        <span aria-hidden>🧭</span> {t.lesson.whereUsed}
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-300">{text}</p>
    </section>
  );
}

export function KeyTakeawaysBlock({ items }: { items: string[] }) {
  const { t } = useTranslation();
  if (items.length === 0) return null;
  return (
    <section id="sec-key-takeaways" className="scroll-mt-6 rounded-md border-l-4 border-l-violet-400 bg-violet-50/50 px-4 py-3 dark:border-l-violet-500 dark:bg-violet-500/10">
      <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-violet-800 dark:text-violet-300">
        <span aria-hidden>📌</span> {t.lesson.keyTakeaways}
      </h2>
      <ul className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function FollowUpQuestionsBlock({ items }: { items: string[] }) {
  const { t } = useTranslation();
  if (items.length === 0) return null;
  return (
    <section id="sec-follow-up" className="scroll-mt-6">
      <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
        {t.lesson.followUp}
      </h2>
      <ul className="list-inside list-disc space-y-1.5 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedTopicsBlock({ subtopicIds }: { subtopicIds: string[] }) {
  const { t } = useTranslation();
  const setSelectedSubtopic = useAppStore((s) => s.setSelectedSubtopic);

  const resolved = subtopicIds
    .map((id) => {
      for (const topic of TOPICS) {
        const subtopic = topic.subtopics.find((s) => s.id === id);
        if (subtopic) return { topicId: topic.id, subtopicId: subtopic.id, title: subtopic.title };
      }
      return null;
    })
    .filter((v): v is { topicId: string; subtopicId: string; title: string } => v !== null);

  if (resolved.length === 0) return null;

  return (
    <section id="sec-related" className="scroll-mt-6">
      <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{t.lesson.relatedTopics}</h2>
      <div className="flex flex-wrap gap-2">
        {resolved.map((r) => (
          <button
            key={r.subtopicId}
            type="button"
            onClick={() => setSelectedSubtopic(r.topicId, r.subtopicId)}
            className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
          >
            {r.title}
          </button>
        ))}
      </div>
    </section>
  );
}
