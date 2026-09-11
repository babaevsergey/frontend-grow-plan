"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TOPICS } from "@/data/content";
import { TopicGroup } from "./TopicGroup";
import { ProgressBar } from "./ProgressBar";
import { useProgressStore } from "@/store/useProgressStore";

export function Sidebar() {
  const [search, setSearch] = useState("");
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);
  const completedSubtopics = useProgressStore((s) => s.completedSubtopics);

  const isFiltering = search.trim().length > 0 || onlyIncomplete;

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();

    return TOPICS.map((topic) => {
      const topicMatchesQuery = query === "" || topic.title.toLowerCase().includes(query);

      const subtopics = topic.subtopics.filter((subtopic) => {
        const matchesQuery =
          topicMatchesQuery || subtopic.title.toLowerCase().includes(query);
        if (!matchesQuery) return false;

        if (onlyIncomplete && completedSubtopics[subtopic.id]) return false;

        return true;
      });

      return { ...topic, subtopics };
    }).filter((topic) => topic.subtopics.length > 0);
  }, [search, onlyIncomplete, completedSubtopics]);

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-white">
      <div className="px-4 py-4 border-b border-slate-200">
        <h1 className="text-sm font-semibold text-slate-900">Frontend Grow Plan</h1>
        <p className="text-xs text-slate-500">Личная база знаний</p>
      </div>

      <ProgressBar />

      <div className="flex flex-col gap-2 border-b border-slate-200 px-3 py-2.5">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по темам..."
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-7 pr-7 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Очистить поиск"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={onlyIncomplete}
            onChange={(e) => setOnlyIncomplete(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Показать только непройденные
        </label>
      </div>

      <nav className="flex-1 px-2 py-3">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <TopicGroup key={topic.id} topic={topic} forceOpen={isFiltering} />
          ))
        ) : (
          <p className="px-2 py-4 text-center text-sm text-slate-400">Ничего не найдено</p>
        )}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-slate-200 px-2 py-3">
        <Link
          href="/quiz"
          className="block rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          🎯 Quiz mode
        </Link>
        <Link
          href="/drafts"
          className="block rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          📝 Черновик (все заметки)
        </Link>
      </div>
    </aside>
  );
}
