"use client";

import { useProgressStore } from "@/store/useProgressStore";

export function ProgressBar() {
  // Подписка на весь объект completedSubtopics, чтобы бар перерисовывался
  // при каждом toggle любого чекбокса.
  useProgressStore((s) => s.completedSubtopics);
  const { done, total, percent } = useProgressStore((s) => s.getProgress());

  return (
    <div className="px-4 py-3 border-b border-slate-200">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
        <span>Прогресс обучения</span>
        <span className="font-medium text-slate-700">{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        Пройдено {done} из {total} тем
      </p>
    </div>
  );
}
