import { FormattedText } from "./FormattedText";
import { useTranslation } from "@/i18n/useTranslation";

export function InterviewAnswerBlock({
  question,
  answerRu,
  answerEn,
}: {
  question: string;
  answerRu?: string;
  answerEn: string;
}) {
  const { t } = useTranslation();
  return (
    <section className="rounded-lg border border-brand-100 bg-brand-50/50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
      <h3 className="mb-2 text-sm font-semibold text-brand-700 dark:text-brand-300">{t.lesson.interview}</h3>
      <p className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">{question}</p>

      {answerRu && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Ответ (RU)</p>
          <FormattedText text={answerRu} className="text-sm text-slate-700 dark:text-slate-300" />
        </div>
      )}

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Answer (EN)</p>
        <FormattedText text={answerEn} className="text-sm text-slate-700 dark:text-slate-300" />
      </div>
    </section>
  );
}
