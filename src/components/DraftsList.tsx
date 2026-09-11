"use client";

import Link from "next/link";
import { TOPICS } from "@/data/content";
import { useNotesStore } from "@/store/useNotesStore";
import { useAppStore } from "@/store/useAppStore";

export function DraftsList() {
  const notesBySubtopicId = useNotesStore((s) => s.notesBySubtopicId);
  const setSelectedSubtopic = useAppStore((s) => s.setSelectedSubtopic);

  const entries = TOPICS.flatMap((topic) =>
    topic.subtopics
      .filter((subtopic) => (notesBySubtopicId[subtopic.id] ?? "").trim().length > 0)
      .map((subtopic) => ({
        topic,
        subtopic,
        note: notesBySubtopicId[subtopic.id],
      }))
  );

  if (entries.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Пока нет ни одной заметки. Откройте любую подтему и заполните блок «Мои заметки».
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map(({ topic, subtopic, note }) => (
        <article key={subtopic.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{topic.title}</p>
              <h2 className="text-sm font-semibold text-slate-900">{subtopic.title}</h2>
            </div>
            <Link
              href="/"
              onClick={() => setSelectedSubtopic(topic.id, subtopic.id)}
              className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Открыть тему →
            </Link>
          </div>
          <p className="whitespace-pre-line text-sm text-slate-700">{note}</p>
        </article>
      ))}
    </div>
  );
}
