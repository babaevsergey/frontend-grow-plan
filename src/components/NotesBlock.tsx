"use client";

import { useEffect, useState } from "react";
import { useNotesStore } from "@/store/useNotesStore";

export function NotesBlock({ subtopicId }: { subtopicId: string }) {
  const savedNote = useNotesStore((s) => s.notesBySubtopicId[subtopicId] ?? "");
  const saveNote = useNotesStore((s) => s.saveNote);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(savedNote);
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  // При переключении на другую подтему сворачиваем редактирование
  // и подхватываем заметку именно этой подтемы.
  useEffect(() => {
    setDraft(savedNote);
    setIsEditing(false);
    setStatus("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtopicId]);

  function handleSave() {
    saveNote(subtopicId, draft);
    setIsEditing(false);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  function handleCancel() {
    setDraft(savedNote);
    setIsEditing(false);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Мои заметки</h3>
        {status === "saved" && <span className="text-sm text-emerald-600">Сохранено ✓</span>}
      </div>

      {!isEditing && (
        savedNote ? (
          <div>
            <p className="mb-2 whitespace-pre-line text-sm text-slate-700">{savedNote}</p>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-sm text-brand-600 hover:underline"
            >
              ✏️ Редактировать
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500 hover:border-brand-400 hover:text-brand-600"
          >
            + Добавить заметку
          </button>
        )
      )}

      {isEditing && (
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Запишите здесь свои мысли, вопросы или конспект по этой теме..."
            rows={5}
            autoFocus
            className="w-full resize-y rounded-md border border-slate-300 p-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
