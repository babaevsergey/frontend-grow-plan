"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TOPICS } from "@/data/content";
import { TopicGroup } from "./TopicGroup";
import { ProgressBar } from "./ProgressBar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageDropdown } from "./LanguageDropdown";
import { useProgressStore } from "@/store/useProgressStore";
import { useTranslation } from "@/i18n/useTranslation";

export function Sidebar() {
  const { t } = useTranslation();
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
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-white dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
        <div>
          <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.appName}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.appTagline}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <LanguageDropdown />
          <ThemeToggle />
        </div>
      </div>

      <ProgressBar />

      <div className="flex flex-col gap-2 border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.sidebar.searchPlaceholder}
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-7 pr-7 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
          />
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={t.sidebar.clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            checked={onlyIncomplete}
            onChange={(e) => setOnlyIncomplete(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600"
          />
          {t.sidebar.onlyIncomplete}
        </label>
      </div>

      <nav className="flex-1 px-2 py-3">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <TopicGroup key={topic.id} topic={topic} forceOpen={isFiltering} />
          ))
        ) : (
          <p className="px-2 py-4 text-center text-sm text-slate-400 dark:text-slate-500">{t.sidebar.noResults}</p>
        )}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-slate-200 px-2 py-3 dark:border-slate-800">
        <Link
          href="/quiz"
          className="block rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          🎯 {t.sidebar.quizMode}
        </Link>
        <Link
          href="/drafts"
          className="block rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          📝 {t.sidebar.drafts}
        </Link>
      </div>
    </aside>
  );
}
