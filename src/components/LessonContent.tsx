"use client";

import type { Topic, Subtopic } from "@/types/content";
import { CodeBlock } from "./CodeBlock";
import { InterviewAnswerBlock } from "./InterviewAnswerBlock";
import { PracticeTaskBlock } from "./PracticeTaskBlock";
import { NotesBlock } from "./NotesBlock";
import { ResourcesBlock } from "./ResourcesBlock";
import { Collapsible } from "./Collapsible";
import { PageToc, type TocEntry } from "./PageToc";
import { NextTopicCard } from "./NextTopicCard";
import { DIAGRAMS } from "./diagrams/registry";
import { useProgressStore } from "@/store/useProgressStore";
import { useTranslation } from "@/i18n/useTranslation";
import { getLocalizedContent } from "@/data/translations";
import {
  MetaBadges,
  WhereUsedBlock,
  KeyTakeawaysBlock,
  FollowUpQuestionsBlock,
  RelatedTopicsBlock,
} from "./ExtendedInfoBlocks";

export function LessonContent({ topic, subtopic }: { topic: Topic; subtopic: Subtopic }) {
  const isCompleted = useProgressStore((s) => s.isCompleted(subtopic.id));
  const toggleCompleted = useProgressStore((s) => s.toggleCompleted);
  const { t, locale } = useTranslation();
  const content = getLocalizedContent(subtopic.id, subtopic.content, locale);
  const Diagram = DIAGRAMS[subtopic.id];

  const tocEntries: TocEntry[] = [
    content.shortExplanation && { id: "sec-short", label: t.lesson.short },
    content.detailedExplanation && { id: "sec-detailed", label: t.lesson.detailed },
    Diagram && { id: "sec-diagram", label: t.lesson.diagram },
    content.codeExample && { id: "sec-code", label: t.lesson.codeExample },
    content.whereUsed && { id: "sec-where-used", label: t.lesson.whereUsed },
    { id: "sec-interview", label: t.lesson.interview },
    content.followUpQuestions && content.followUpQuestions.length > 0 && {
      id: "sec-follow-up",
      label: t.lesson.followUp,
    },
    content.keyTakeaways && content.keyTakeaways.length > 0 && {
      id: "sec-key-takeaways",
      label: t.lesson.keyTakeaways,
    },
    { id: "sec-notes", label: t.lesson.notes },
    content.resources && { id: "sec-resources", label: t.lesson.resources },
    (content.practiceTask || (content.pitfalls && content.pitfalls.length > 0)) && {
      id: "sec-practice",
      label: t.lesson.practiceAndPitfalls,
    },
    content.relatedTopics && content.relatedTopics.length > 0 && { id: "sec-related", label: t.lesson.relatedTopics },
  ].filter(Boolean) as TocEntry[];

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
      {/* Колонка с текстом — светлая "карточка" на фоне более тёмных боков (см. AppLayout) */}
      <div
        key={subtopic.id}
        className="animate-fadein flex min-w-0 max-w-3xl flex-1 flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <header>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
            {topic.title}
          </p>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{content.title}</h1>
            <label className="flex shrink-0 items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => toggleCompleted(subtopic.id)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
              />
              {t.lesson.completed}
            </label>
          </div>
          <MetaBadges difficulty={content.difficulty} interviewFrequency={content.interviewFrequency} />
        </header>

        {content.shortExplanation && (
          <section
            id="sec-short"
            className="scroll-mt-6 rounded-md border-l-4 border-l-sky-400 bg-sky-50/60 px-4 py-3 dark:border-l-sky-500 dark:bg-sky-950/30"
          >
            <h2 className="mb-1 text-sm font-semibold text-sky-800 dark:text-sky-300">{t.lesson.short}</h2>
            <p className="text-base text-slate-800 dark:text-slate-200">{content.shortExplanation}</p>
          </section>
        )}

        {content.detailedExplanation && (
          <section id="sec-detailed" className="scroll-mt-6">
            <Collapsible title={t.lesson.detailed} defaultOpen={false}>
              <p className="whitespace-pre-line text-base leading-relaxed text-slate-800 dark:text-slate-200">
                {content.detailedExplanation}
              </p>
            </Collapsible>
          </section>
        )}

        {Diagram && (
          <section id="sec-diagram" className="scroll-mt-6">
            <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{t.lesson.diagram}</h2>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <Diagram />
            </div>
          </section>
        )}

        {content.codeExample && (
          <section id="sec-code" className="scroll-mt-6">
            <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{t.lesson.codeExample}</h2>
            <CodeBlock code={content.codeExample} />
          </section>
        )}

        {content.whereUsed && <WhereUsedBlock text={content.whereUsed} />}

        <section id="sec-interview" className="scroll-mt-6">
          <InterviewAnswerBlock
            question={content.interviewQuestion}
            answerRu={content.interviewAnswerRu}
            answerEn={content.interviewAnswerEn}
          />
        </section>

        {content.followUpQuestions && content.followUpQuestions.length > 0 && (
          <FollowUpQuestionsBlock items={content.followUpQuestions} />
        )}

        {content.keyTakeaways && content.keyTakeaways.length > 0 && (
          <KeyTakeawaysBlock items={content.keyTakeaways} />
        )}

        <section id="sec-notes" className="scroll-mt-6">
          <NotesBlock subtopicId={subtopic.id} />
        </section>

        {content.resources && (
          <section id="sec-resources" className="scroll-mt-6">
            <ResourcesBlock docs={content.resources.docs} articles={content.resources.articles} />
          </section>
        )}

        {(content.practiceTask || (content.pitfalls && content.pitfalls.length > 0)) && (
          <section id="sec-practice" className="scroll-mt-6">
            <PracticeTaskBlock task={content.practiceTask} pitfalls={content.pitfalls ?? []} />
          </section>
        )}

        {content.relatedTopics && content.relatedTopics.length > 0 && (
          <RelatedTopicsBlock subtopicIds={content.relatedTopics} />
        )}

        <NextTopicCard currentSubtopicId={subtopic.id} />
      </div>

      <PageToc entries={tocEntries} />
    </div>
  );
}
