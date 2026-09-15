"use client";

import { useState } from "react";
import type { Topic } from "@/types/content";
import { SubtopicItem } from "./SubtopicItem";
import { useAppStore } from "@/store/useAppStore";

export function TopicGroup({ topic, forceOpen }: { topic: Topic; forceOpen?: boolean }) {
  const isTopicActive = useAppStore((s) => s.selectedTopicId === topic.id);
  const [isOpen, setIsOpen] = useState(isTopicActive);

  // Пока активен поиск/фильтр, группа принудительно раскрыта,
  // чтобы сразу были видны совпавшие подтемы, независимо от того,
  // сворачивал ли её пользователь вручную ранее.
  const isExpanded = forceOpen || isOpen;

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        disabled={forceOpen}
        className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 disabled:cursor-default dark:text-slate-400 dark:hover:text-slate-200"
      >
        <span>{topic.title}</span>
        {!forceOpen && <span className="text-slate-400 dark:text-slate-500">{isExpanded ? "−" : "+"}</span>}
      </button>
      {isExpanded && (
        <div className="mt-0.5 flex flex-col gap-0.5">
          {topic.subtopics.map((subtopic) => (
            <SubtopicItem key={subtopic.id} topicId={topic.id} subtopic={subtopic} />
          ))}
        </div>
      )}
    </div>
  );
}
