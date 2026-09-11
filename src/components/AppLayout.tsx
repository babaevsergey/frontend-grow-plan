"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { LessonContent } from "./LessonContent";
import { useAppStore } from "@/store/useAppStore";
import { findSubtopic } from "@/data/content";
import { cx } from "@/lib/utils";

export function AppLayout() {
  const selectedSubtopicId = useAppStore((s) => s.selectedSubtopicId);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const found = findSubtopic(selectedSubtopicId);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <span className="text-sm font-semibold text-slate-900">Frontend Grow Plan</span>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen((v) => !v)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
        >
          {isMobileSidebarOpen ? "Закрыть" : "Темы"}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={cx(
          "border-r border-slate-200 md:block md:w-[280px] md:shrink-0",
          isMobileSidebarOpen ? "block" : "hidden"
        )}
      >
        <Sidebar />
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {found ? (
          <LessonContent topic={found.topic} subtopic={found.subtopic} />
        ) : (
          <div className="p-8 text-slate-500">Выберите тему слева, чтобы начать изучение.</div>
        )}
      </main>
    </div>
  );
}
