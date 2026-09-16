"use client";

import { useLocaleStore, type Locale } from "@/store/useLocaleStore";
import ru from "./locales/ru.json";
import ua from "./locales/ua.json";
import en from "./locales/en.json";

export type UiDictionary = typeof ru;

const DICTIONARIES: Record<Locale, UiDictionary> = { ru, ua, en };

/**
 * Хук для UI-строк интерфейса (не для контента тем — тот переводится
 * отдельно через src/data/translations/*, см. getLocalizedContent).
 *
 * Использование: const { t, locale, setLocale } = useTranslation();
 * t.sidebar.searchPlaceholder, t.lesson.short, и т.д.
 */
export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const t = DICTIONARIES[locale];
  return { t, locale, setLocale };
}
