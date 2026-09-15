"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Светлая/тёмная тема. Сохраняется в localStorage через zustand/persist.
 * Фактическое применение класса "dark" на <html> происходит в ThemeEffect —
 * само значение в сторе используется только для UI переключателя и синхронизации.
 * Флеш неправильной темы при загрузке страницы предотвращается инлайновым
 * скриптом в layout.tsx, который выставляет класс ещё до гидратации React.
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "frontend-grow-plan:theme",
    }
  )
);
