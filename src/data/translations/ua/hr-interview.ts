import type { ContentTranslationMap } from "../types";

/**
 * HR Interview содержит только англоязычные ответы (interviewAnswerEn),
 * которые по дизайну ContentTranslation никогда не переопределяются —
 * они уже двуязычны сами по себе. Переводим только заголовок темы/подтемы,
 * который отображается в сайдбаре и хлебных крошках.
 */
export const hrInterviewUa: ContentTranslationMap = {
  "hr-interview-all": {
    title: "Співбесіда з HR",
  },
};
