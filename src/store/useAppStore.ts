"use client";

import { create } from "zustand";
import { TOPICS } from "@/data/content";

interface AppStore {
  selectedTopicId: string;
  selectedSubtopicId: string;
  setSelectedSubtopic: (topicId: string, subtopicId: string) => void;
}

const firstTopic = TOPICS[0];
const firstSubtopic = firstTopic?.subtopics[0];

/**
 * Хранит только "навигационное" состояние UI:
 * какая тема/подтема сейчас открыта справа.
 * Это состояние не сохраняется в localStorage — при перезагрузке
 * страница просто открывается на первой теме.
 */
export const useAppStore = create<AppStore>((set) => ({
  selectedTopicId: firstTopic?.id ?? "",
  selectedSubtopicId: firstSubtopic?.id ?? "",
  setSelectedSubtopic: (topicId, subtopicId) =>
    set({ selectedTopicId: topicId, selectedSubtopicId: subtopicId }),
}));
