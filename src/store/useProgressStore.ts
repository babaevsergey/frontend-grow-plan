"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAllSubtopicIds } from "@/data/content";
import type { ProgressState } from "@/types/content";

interface ProgressStore {
  completedSubtopics: ProgressState;
  toggleCompleted: (subtopicId: string) => void;
  isCompleted: (subtopicId: string) => boolean;
  getProgress: () => { done: number; total: number; percent: number };
}

/**
 * Прогресс прохождения тем. Хранится отдельно от контента (content.ts)
 * и сохраняется в localStorage через zustand/persist, чтобы переживать
 * перезагрузку страницы.
 */
export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedSubtopics: {},
      toggleCompleted: (subtopicId) =>
        set((state) => ({
          completedSubtopics: {
            ...state.completedSubtopics,
            [subtopicId]: !state.completedSubtopics[subtopicId],
          },
        })),
      isCompleted: (subtopicId) => Boolean(get().completedSubtopics[subtopicId]),
      getProgress: () => {
        const total = getAllSubtopicIds().length;
        const done = Object.values(get().completedSubtopics).filter(Boolean).length;
        const percent = total === 0 ? 0 : Math.round((done / total) * 100);
        return { done, total, percent };
      },
    }),
    {
      name: "frontend-grow-plan:progress",
    }
  )
);
