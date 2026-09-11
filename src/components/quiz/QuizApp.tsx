"use client";

import { useMemo, useState } from "react";
import { TOPICS, buildQuizItems } from "@/data/content";
import { shuffle } from "@/lib/utils";
import type { QuizAnswer, QuizItem } from "@/types/content";
import { QuizSetup } from "./QuizSetup";
import { QuizSession } from "./QuizSession";
import { QuizResults } from "./QuizResults";

type Stage = "setup" | "session" | "results";

export function QuizApp() {
  const [stage, setStage] = useState<Stage>("setup");
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(TOPICS.map((t) => t.id));
  const [count, setCount] = useState<number | "all">(10);

  const [sessionItems, setSessionItems] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const availableCount = useMemo(
    () => buildQuizItems(selectedTopicIds).length,
    [selectedTopicIds]
  );

  function toggleTopic(topicId: string) {
    setSelectedTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  }

  function startQuiz() {
    const pool = shuffle(buildQuizItems(selectedTopicIds));
    const items = typeof count === "number" ? pool.slice(0, count) : pool;
    setSessionItems(items);
    setCurrentIndex(0);
    setAnswers([]);
    setStage("session");
  }

  function handleAnswer(knew: boolean) {
    const item = sessionItems[currentIndex];
    const nextAnswers = [...answers, { subtopicId: item.subtopicId, knew }];
    setAnswers(nextAnswers);

    if (currentIndex + 1 < sessionItems.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setStage("results");
    }
  }

  function restart() {
    setStage("setup");
  }

  if (stage === "session") {
    return (
      <QuizSession
        items={sessionItems}
        currentIndex={currentIndex}
        onAnswer={handleAnswer}
        onExit={() => setStage("results")}
      />
    );
  }

  if (stage === "results") {
    return <QuizResults items={sessionItems} answers={answers} onRestart={restart} />;
  }

  return (
    <QuizSetup
      topics={TOPICS}
      selectedTopicIds={selectedTopicIds}
      onToggleTopic={toggleTopic}
      onSelectAll={() => setSelectedTopicIds(TOPICS.map((t) => t.id))}
      onSelectNone={() => setSelectedTopicIds([])}
      count={count}
      onSetCount={setCount}
      availableCount={availableCount}
      onStart={startQuiz}
    />
  );
}
