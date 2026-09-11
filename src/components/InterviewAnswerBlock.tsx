import { FormattedText } from "./FormattedText";

export function InterviewAnswerBlock({
  question,
  answerRu,
  answerEn,
}: {
  question: string;
  answerRu?: string;
  answerEn: string;
}) {
  return (
    <section className="rounded-lg border border-brand-100 bg-brand-50/50 p-4">
      <h3 className="mb-2 text-sm font-semibold text-brand-700">Как объяснить на интервью</h3>
      <p className="mb-3 text-sm font-bold text-slate-900">{question}</p>

      {answerRu && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Ответ (RU)</p>
          <FormattedText text={answerRu} className="text-sm text-slate-700" />
        </div>
      )}

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Answer (EN)</p>
        <FormattedText text={answerEn} className="text-sm text-slate-700" />
      </div>
    </section>
  );
}
