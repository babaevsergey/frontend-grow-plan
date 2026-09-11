"use client";

import { useState } from "react";
import type { QuizItem } from "@/types/content";
import { FormattedText } from "../FormattedText";

export function QuizSession({
  items,
  currentIndex,
  onAnswer,
  onExit,
}: {
  items: QuizItem[];
  currentIndex: number;
  onAnswer: (knew: boolean) => void;
  onExit: () => void;
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const item = items[currentIndex];
  const total = items.length;

  function handleAnswer(knew: boolean) {
    setIsRevealed(false);
    onAnswer(knew);
  }

  if (!item) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{item.topicTitle}</p>
        <button type="button" onClick={onExit} className="text-xs text-slate-400 hover:text-slate-600">
          Завершить досрочно
        </button>
      </div>

      <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${(currentIndex / total) * 100}%` }}
        />
      </div>
      <p className="mb-6 text-xs text-slate-500">
        Вопрос {currentIndex + 1} из {total}
      </p>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="mb-1 text-xs font-medium text-slate-400">{item.subtopicTitle}</p>
        <h2 className="text-lg font-semibold text-slate-900">{item.question}</h2>

        {isRevealed && (
          <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5">
            {item.answerRu && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Ответ (RU)</p>
                <FormattedText text={item.answerRu} className="text-sm leading-relaxed text-slate-700" />
              </div>
            )}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Answer (EN)</p>
              <FormattedText text={item.answerEn} className="text-sm leading-relaxed text-slate-700" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        {!isRevealed ? (
          <button
            type="button"
            onClick={() => setIsRevealed(true)}
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Показать ответ
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleAnswer(false)}
              className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-100"
            >
              ❌ Не знал
            </button>
            <button
              type="button"
              onClick={() => handleAnswer(true)}
              className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
            >
              ✅ Знал
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
