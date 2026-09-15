"use client";

import { useProgressStore } from "@/store/useProgressStore";

export function ProgressBar() {
  // Подписка на весь объект completedSubtopics, чтобы бар перерисовывался
  // при каждом toggle любого чекбокса.
  useProgressStore((s) => s.completedSubtopics);
  const { done, total, percent } = useProgressStore((s) => s.getProgress());

  return (
    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 dark:text-slate-400">
        <span>Прогресс обучения</span>
        <span className="font-medium text-slate-700 dark:text-slate-200">{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        Пройдено {done} из {total} тем
      </p>
    </div>
  );
}
