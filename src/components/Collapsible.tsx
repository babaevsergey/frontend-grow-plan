"use client";

import { useState, type ReactNode } from "react";
import { cx } from "@/lib/utils";

/**
 * Сворачиваемая секция в духе "Deep Dive" из react.dev: заголовок с полосой
 * слева и стрелкой, контент скрыт по умолчанию, чтобы длинные страницы
 * (например "Подробнее") не выглядели одной сплошной простынёй текста.
 */
export function Collapsible({
  title,
  children,
  defaultOpen = false,
  accent = "brand",
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  accent?: "brand" | "slate";
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const accentClasses =
    accent === "brand"
      ? "border-l-brand-400 hover:bg-brand-50/40 dark:border-l-brand-500 dark:hover:bg-brand-500/10"
      : "border-l-slate-300 hover:bg-slate-50 dark:border-l-slate-600 dark:hover:bg-slate-800/60";

  return (
    <div className={cx("rounded-md border-l-4 bg-white dark:bg-slate-800/40", accentClasses)}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</span>
        <span
          className={cx(
            "shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500",
            isOpen && "rotate-90"
          )}
          aria-hidden
        >
          ▸
        </span>
      </button>
      {isOpen && (
        <div className="animate-fadein-fast px-4 pb-4">{children}</div>
      )}
    </div>
  );
}
