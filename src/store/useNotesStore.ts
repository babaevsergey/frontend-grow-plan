"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotesState } from "@/types/content";

interface NotesStore {
  notesBySubtopicId: NotesState;
  saveNote: (subtopicId: string, note: string) => void;
  getNote: (subtopicId: string) => string;
}

/**
 * Личные заметки пользователя по каждой подтеме.
 * Хранится отдельно от контента и от прогресса, в своём ключе localStorage.
 */
export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notesBySubtopicId: {},
      saveNote: (subtopicId, note) =>
        set((state) => ({
          notesBySubtopicId: { ...state.notesBySubtopicId, [subtopicId]: note },
        })),
      getNote: (subtopicId) => get().notesBySubtopicId[subtopicId] ?? "",
    }),
    {
      name: "frontend-grow-plan:notes",
      // См. комментарий в useProgressStore.ts — отключаем автогидратацию,
      // чтобы избежать SSR/client hydration mismatch.
      skipHydration: true,
    }
  )
);
