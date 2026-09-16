import type { LessonContent } from "@/types/content";

/**
 * Перевод контента одной подтемы на конкретный язык.
 * Не обязаны переводиться все поля: interviewAnswerRu/interviewAnswerEn
 * намеренно НЕ переопределяются — InterviewAnswerBlock всегда показывает
 * оба варианта (RU и EN) вместе, независимо от языка интерфейса, так как
 * это тренажёр интервью-ответов, а не просто описание темы. То же самое —
 * codeExample и resources обычно язык-независимы (код и ссылки не переводятся).
 */
export type ContentTranslation = Partial<
  Pick<
    LessonContent,
    | "title"
    | "shortExplanation"
    | "detailedExplanation"
    | "whereUsed"
    | "pitfalls"
    | "practiceTask"
    | "keyTakeaways"
    | "followUpQuestions"
  >
>;

/** Ключ — id подтемы (Subtopic.id), значение — переведённые поля. */
export type ContentTranslationMap = Record<string, ContentTranslation>;
