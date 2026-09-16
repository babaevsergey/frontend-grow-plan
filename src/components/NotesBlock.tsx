"use client";

import { useEffect, useState } from "react";
import { useNotesStore } from "@/store/useNotesStore";
import { useTranslation } from "@/i18n/useTranslation";

export function NotesBlock({ subtopicId }: { subtopicId: string }) {
  const { t } = useTranslation();
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
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/40">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.lesson.notes}</h3>
        {status === "saved" && <span className="text-sm text-emerald-600 dark:text-emerald-400">{t.lesson.notesSaved}</span>}
      </div>

      {!isEditing && (
        savedNote ? (
          <div>
            <p className="mb-2 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{savedNote}</p>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-sm text-brand-600 hover:underline dark:text-brand-400"
            >
              {t.lesson.notesEdit}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500 hover:border-brand-400 hover:text-brand-600 dark:border-slate-600 dark:text-slate-400 dark:hover:border-brand-500 dark:hover:text-brand-400"
          >
            {t.lesson.notesAdd}
          </button>
        )
      )}

      {isEditing && (
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t.lesson.notesPlaceholder}
            rows={5}
            autoFocus
            className="w-full resize-y rounded-md border border-slate-300 p-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              {t.lesson.notesSave}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {t.lesson.notesCancel}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
