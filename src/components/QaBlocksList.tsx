import { FormattedText } from "./FormattedText";

interface QaBlock {
  question: string;
  answerRu?: string;
  answerEn: string;
}

/**
 * Рендерит набор самостоятельных вопросов-ответов (LessonContent.qaBlocks)
 * как список отдельных выделенных карточек — в отличие от InterviewAnswerBlock,
 * который рендерит один вопрос/ответ как единый блок. Используется на
 * страницах-скриптах вида "HR Interview", где вопросов много и каждый
 * должен читаться как самостоятельная, визуально отделённая единица.
 */
export function QaBlocksList({ items }: { items: QaBlock[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((qa, i) => (
        <section
          key={i}
          className="rounded-lg border border-brand-100 bg-brand-50/50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10"
        >
          <p className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">{qa.question}</p>

          {qa.answerRu && (
            <div className="mb-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Ответ (RU)
              </p>
              <FormattedText text={qa.answerRu} className="text-sm text-slate-700 dark:text-slate-300" />
            </div>
          )}

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Answer (EN)
            </p>
            <FormattedText text={qa.answerEn} className="text-sm text-slate-700 dark:text-slate-300" />
          </div>
        </section>
      ))}
    </div>
  );
}
