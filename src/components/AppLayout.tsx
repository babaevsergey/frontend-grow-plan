"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { LessonContent } from "./LessonContent";
import { ThemeEffect } from "./ThemeEffect";
import { useAppStore } from "@/store/useAppStore";
import { findSubtopic } from "@/data/content";
import { cx } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

export function AppLayout() {
  const selectedSubtopicId = useAppStore((s) => s.selectedSubtopicId);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const found = findSubtopic(selectedSubtopicId);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <ThemeEffect />

      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.appName}</span>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen((v) => !v)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
        >
          {isMobileSidebarOpen ? t.mobile.close : t.mobile.topics}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={cx(
          "border-r border-slate-200 dark:border-slate-800 md:block md:w-[310px] md:shrink-0",
          isMobileSidebarOpen ? "block" : "hidden"
        )}
      >
        <Sidebar />
      </div>

      {/* Content — фон чуть темнее, чем центральная колонка с текстом,
          чтобы сама колонка визуально "всплывала" светлым пятном. */}
      <main className="flex-1 overflow-y-auto bg-slate-200/60 dark:bg-slate-950">
        {found ? (
          <LessonContent topic={found.topic} subtopic={found.subtopic} />
        ) : (
          <div className="p-8 text-slate-500 dark:text-slate-400">
            {t.empty.selectTopic}
          </div>
        )}
      </main>
    </div>
  );
}
