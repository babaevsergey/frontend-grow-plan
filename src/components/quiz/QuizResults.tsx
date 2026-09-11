"use client";

import Link from "next/link";
import type { QuizItem, QuizAnswer } from "@/types/content";
import { useAppStore } from "@/store/useAppStore";

export function QuizResults({
  items,
  answers,
  onRestart,
}: {
  items: QuizItem[];
  answers: QuizAnswer[];
  onRestart: () => void;
}) {
  const setSelectedSubtopic = useAppStore((s) => s.setSelectedSubtopic);

  const total = answers.length;
  const knewCount = answers.filter((a) => a.knew).length;
  const percent = total === 0 ? 0 : Math.round((knewCount / total) * 100);

  const missed = answers
    .filter((a) => !a.knew)
    .map((a) => items.find((i) => i.subtopicId === a.subtopicId))
    .filter((item): item is QuizItem => Boolean(item));

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Результаты</h1>
      <p className="mb-6 text-sm text-slate-600">Вы прошли {total} вопросов.</p>

      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 text-center">
        <p className="text-4xl font-bold text-brand-600">{percent}%</p>
        <p className="mt-1 text-sm text-slate-500">
          Знали ответ на {knewCount} из {total}
        </p>
      </div>

      {missed.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Стоит повторить ({missed.length})
          </h2>
          <div className="flex flex-col gap-2">
            {missed.map((item) => (
              <Link
                key={item.subtopicId}
                href="/"
                onClick={() => setSelectedSubtopic(item.topicId, item.subtopicId)}
                className="flex items-center justify-between rounded-md border border-rose-100 bg-rose-50/50 px-3 py-2 text-sm hover:bg-rose-50"
              >
                <span>
                  <span className="text-xs text-slate-500">{item.topicTitle} · </span>
                  <span className="font-medium text-slate-800">{item.subtopicTitle}</span>
                </span>
                <span className="text-xs text-rose-600">Повторить →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <p className="mb-8 rounded-md border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-700">
          Отлично, все вопросы знали! 🎉
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Пройти ещё раз
        </button>
        <Link
          href="/"
          className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          К темам
        </Link>
      </div>
    </div>
  );
}
