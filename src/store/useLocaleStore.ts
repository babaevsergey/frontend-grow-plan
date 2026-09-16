"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "ru" | "ua" | "en";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/**
 * Выбранный язык интерфейса и (там, где переведено) контента.
 * Сохраняется в localStorage через zustand/persist, аналогично useThemeStore.
 * По умолчанию — русский, так как основная масса контента изначально на русском.
 */
export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "ru",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "frontend-grow-plan:locale",
    }
  )
);
