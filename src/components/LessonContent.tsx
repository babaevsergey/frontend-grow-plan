"use client";

import type { Topic, Subtopic } from "@/types/content";
import { CodeBlock } from "./CodeBlock";
import { InterviewAnswerBlock } from "./InterviewAnswerBlock";
import { PracticeTaskBlock } from "./PracticeTaskBlock";
import { NotesBlock } from "./NotesBlock";
import { ResourcesBlock } from "./ResourcesBlock";
import { DIAGRAMS } from "./diagrams/registry";
import { useProgressStore } from "@/store/useProgressStore";

export function LessonContent({ topic, subtopic }: { topic: Topic; subtopic: Subtopic }) {
  const isCompleted = useProgressStore((s) => s.isCompleted(subtopic.id));
  const toggleCompleted = useProgressStore((s) => s.toggleCompleted);
  const { content } = subtopic;
  const Diagram = DIAGRAMS[subtopic.id];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
      <header>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-600">{topic.title}</p>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">{content.title}</h1>
          <label className="flex shrink-0 items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => toggleCompleted(subtopic.id)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Пройдено
          </label>
        </div>
      </header>

      {content.shortExplanation && (
        <section>
          <h2 className="mb-1 text-sm font-semibold text-slate-500">Коротко</h2>
          <p className="text-base text-slate-800">{content.shortExplanation}</p>
        </section>
      )}

      {content.detailedExplanation && (
        <section>
          <h2 className="mb-1 text-sm font-semibold text-slate-500">Подробнее</h2>
          <p className="whitespace-pre-line text-base leading-relaxed text-slate-800">
            {content.detailedExplanation}
          </p>
        </section>
      )}

      {Diagram && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Схема</h2>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <Diagram />
          </div>
        </section>
      )}

      {content.codeExample && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Пример кода</h2>
          <CodeBlock code={content.codeExample} />
        </section>
      )}

      <InterviewAnswerBlock
        question={content.interviewQuestion}
        answerRu={content.interviewAnswerRu}
        answerEn={content.interviewAnswerEn}
      />

      {(content.practiceTask || (content.pitfalls && content.pitfalls.length > 0)) && (
        <PracticeTaskBlock task={content.practiceTask} pitfalls={content.pitfalls ?? []} />
      )}

      <NotesBlock subtopicId={subtopic.id} />

      {content.resources && (
        <ResourcesBlock docs={content.resources.docs} articles={content.resources.articles} />
      )}
    </div>
  );
}
