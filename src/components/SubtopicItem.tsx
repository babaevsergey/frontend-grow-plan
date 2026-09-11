"use client";

import type { Subtopic } from "@/types/content";
import { useAppStore } from "@/store/useAppStore";
import { useProgressStore } from "@/store/useProgressStore";
import { cx } from "@/lib/utils";

export function SubtopicItem({ topicId, subtopic }: { topicId: string; subtopic: Subtopic }) {
  const isSelected = useAppStore((s) => s.selectedSubtopicId === subtopic.id);
  const setSelectedSubtopic = useAppStore((s) => s.setSelectedSubtopic);
  const isCompleted = useProgressStore((s) => s.isCompleted(subtopic.id));
  const toggleCompleted = useProgressStore((s) => s.toggleCompleted);

  return (
    <div
      className={cx(
        "flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer text-sm",
        isSelected ? "bg-brand-50 text-brand-700 font-medium" : "hover:bg-slate-100 text-slate-700"
      )}
      onClick={() => setSelectedSubtopic(topicId, subtopic.id)}
    >
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={(e) => {
          e.stopPropagation();
          toggleCompleted(subtopic.id);
        }}
        onClick={(e) => e.stopPropagation()}
        className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
      <span className={cx(isCompleted && "text-slate-400 line-through decoration-slate-300")}>
        {subtopic.title}
      </span>
      {isCompleted && <span className="ml-auto text-brand-500 text-xs">✓</span>}
    </div>
  );
}
