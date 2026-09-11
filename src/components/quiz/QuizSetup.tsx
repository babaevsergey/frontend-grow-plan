"use client";

import type { Topic } from "@/types/content";
import { cx } from "@/lib/utils";

const COUNT_OPTIONS = [5, 10, 20] as const;

export function QuizSetup({
  topics,
  selectedTopicIds,
  onToggleTopic,
  onSelectAll,
  onSelectNone,
  count,
  onSetCount,
  availableCount,
  onStart,
}: {
  topics: Topic[];
  selectedTopicIds: string[];
  onToggleTopic: (topicId: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  count: number | "all";
  onSetCount: (count: number | "all") => void;
  availableCount: number;
  onStart: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quiz mode</h1>
        <p className="mt-1 text-sm text-slate-600">
          Тренируйтесь отвечать на интервью-вопросы по выбранным темам. Вопрос берётся
          из блока «Как объяснить на интервью» каждой подтемы — вы отвечаете вслух или
          мысленно, затем открываете эталонный ответ и честно отмечаете, знали вы его или нет.
        </p>
      </header>

      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Темы</h2>
          <div className="flex gap-2 text-xs">
            <button type="button" onClick={onSelectAll} className="text-brand-600 hover:underline">
              Выбрать все
            </button>
            <span className="text-slate-300">/</span>
            <button type="button" onClick={onSelectNone} className="text-brand-600 hover:underline">
              Снять все
            </button>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {topics.map((topic) => {
            const isSelected = selectedTopicIds.includes(topic.id);
            return (
              <label
                key={topic.id}
                className={cx(
                  "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
                  isSelected
                    ? "border-brand-300 bg-brand-50 text-brand-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleTopic(topic.id)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>{topic.title}</span>
                <span className="ml-auto text-xs text-slate-400">{topic.subtopics.length}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Количество вопросов</h2>
        <div className="flex flex-wrap gap-2">
          {COUNT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSetCount(option)}
              className={cx(
                "rounded-md border px-3 py-1.5 text-sm",
                count === option
                  ? "border-brand-500 bg-brand-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {option}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onSetCount("all")}
            className={cx(
              "rounded-md border px-3 py-1.5 text-sm",
              count === "all"
                ? "border-brand-500 bg-brand-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            Все ({availableCount})
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={onStart}
        disabled={availableCount === 0}
        className="w-full rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {availableCount === 0 ? "Выберите хотя бы одну тему" : `Начать (${Math.min(
          typeof count === "number" ? count : availableCount,
          availableCount
        )} вопросов)`}
      </button>
    </div>
  );
}
