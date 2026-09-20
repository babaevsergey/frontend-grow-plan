import type { ContentTranslationMap } from "../types";

/**
 * HR Interview содержит только англоязычные ответы (interviewAnswerEn),
 * которые по дизайну ContentTranslation никогда не переопределяются —
 * они уже двуязычны сами по себе. Заголовок совпадает с базовым (EN),
 * поэтому переопределять здесь нечего — файл существует для единообразия
 * структуры реестра переводов.
 */
export const hrInterviewEn: ContentTranslationMap = {};
