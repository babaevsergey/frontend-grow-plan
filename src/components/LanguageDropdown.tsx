"use client";

import { useTranslation } from "@/i18n/useTranslation";
import type { Locale } from "@/store/useLocaleStore";

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "ru", label: "RU" },
  { value: "ua", label: "UA" },
  { value: "en", label: "EN" },
];

/**
 * Дропдаун выбора языка интерфейса (RU/UA/EN). Меняет useLocaleStore,
 * который persist-ится в localStorage — выбор сохраняется между визитами.
 * Контент тем переводится отдельно (см. getLocalizedContent) и не для
 * всех подтем ещё доступен на выбранном языке — там, где перевода нет,
 * секции с текстом темы остаются на языке оригинала (обычно русском).
 */
export function LanguageDropdown() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <label className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
      <span className="sr-only">{t.language.label}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label={t.language.label}
        className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 py-1 pl-1.5 pr-6 text-xs text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        {LOCALE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
