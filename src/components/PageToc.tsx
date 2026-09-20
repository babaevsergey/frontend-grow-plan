"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/utils";

export interface TocEntry {
  id: string;
  label: string;
}

/**
 * Правый sticky TOC в духе nextjs.org/docs: список секций текущей страницы,
 * активный пункт подсвечивается при скролле через IntersectionObserver.
 * Ключ по subtopicId — чтобы список секций пересобирался при смене темы
 * (см. использование в LessonContent).
 */
export function PageToc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (visibleEntries) => {
        const visible = visibleEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-72px 0px -70% 0px", threshold: 0 }
    );

    entries.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 2) return null;

  return (
    <nav className="sticky top-8 hidden w-52 shrink-0 self-start xl:flex xl:flex-col">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        На странице
      </p>
      <div className="flex flex-col gap-0.5 rounded-lg border border-slate-200/70 bg-white/60 p-1.5 dark:border-slate-800 dark:bg-slate-900/40">
        {entries.map((entry) => (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            className={cx(
              "rounded-md border-l-2 px-2.5 py-1.5 text-xs font-normal leading-snug transition-colors",
              activeId === entry.id
                ? "border-l-brand-500 bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                : "border-l-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
            )}
          >
            {entry.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
