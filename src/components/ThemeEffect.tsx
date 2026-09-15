"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * Применяет класс "dark" на <html> при изменении темы в сторе.
 * Начальное значение при первой загрузке страницы уже выставлено
 * блокирующим инлайн-скриптом в layout.tsx (чтобы избежать "мигания"
 * неправильной темой до гидратации React) — этот эффект только держит
 * DOM синхронизированным при последующих переключениях через toggleTheme.
 */
export function ThemeEffect() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}
