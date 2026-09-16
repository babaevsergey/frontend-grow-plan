"use client";

import { TOPICS } from "@/data/content";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/i18n/useTranslation";

/**
 * Карточка "следующая тема" внизу страницы — в духе карточек "Next steps"
 * из nextjs.org/docs. Помогает двигаться по плану линейно, не возвращаясь
 * каждый раз в сайдбар.
 */
export function NextTopicCard({ currentSubtopicId }: { currentSubtopicId: string }) {
  const setSelectedSubtopic = useAppStore((s) => s.setSelectedSubtopic);
  const { t } = useTranslation();

  const flat = TOPICS.flatMap((topic) =>
    topic.subtopics.map((subtopic) => ({ topic, subtopic }))
  );
  const currentIndex = flat.findIndex(({ subtopic }) => subtopic.id === currentSubtopicId);
  const next = currentIndex >= 0 ? flat[currentIndex + 1] : undefined;

  if (!next) return null;

  return (
    <button
      type="button"
      onClick={() => setSelectedSubtopic(next.topic.id, next.subtopic.id)}
      className="group flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-brand-500"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {t.lesson.nextTopic}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-slate-800 group-hover:text-brand-700 dark:text-slate-200 dark:group-hover:text-brand-400">
          {next.subtopic.title}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{next.topic.title}</p>
      </div>
      <span className="shrink-0 text-lg text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500 dark:text-slate-600">
        →
      </span>
    </button>
  );
}
