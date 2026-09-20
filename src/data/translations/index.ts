import type { LessonContent } from "@/types/content";
import type { Locale } from "@/store/useLocaleStore";
import type { ContentTranslationMap } from "./types";
import { javascriptEn } from "./en/javascript";
import { javascriptUa } from "./ua/javascript";
import { typescriptEn } from "./en/typescript";
import { typescriptUa } from "./ua/typescript";
import { reactEn } from "./en/react";
import { reactUa } from "./ua/react";
import { nextjsSsrEn } from "./en/nextjs-ssr";
import { nextjsSsrUa } from "./ua/nextjs-ssr";
import { dataFetchingCacheEn } from "./en/data-fetching-cache";
import { dataFetchingCacheUa } from "./ua/data-fetching-cache";
import { apisNetworkingEn } from "./en/apis-networking";
import { apisNetworkingUa } from "./ua/apis-networking";
import { authSecurityEn } from "./en/auth-security";
import { authSecurityUa } from "./ua/auth-security";
import { performanceEn } from "./en/performance";
import { performanceUa } from "./ua/performance";
import { practiceTasksEn } from "./en/practice-tasks";
import { practiceTasksUa } from "./ua/practice-tasks";
import { stateManagementEn } from "./en/state-management";
import { stateManagementUa } from "./ua/state-management";
import { frontendArchitectureEn } from "./en/frontend-architecture";
import { frontendArchitectureUa } from "./ua/frontend-architecture";
import { formsEn } from "./en/forms";
import { formsUa } from "./ua/forms";
import { testingEn } from "./en/testing";
import { testingUa } from "./ua/testing";
import { frontendSystemDesignEn } from "./en/frontend-system-design";
import { frontendSystemDesignUa } from "./ua/frontend-system-design";
import { leadSeniorEngineeringEn } from "./en/lead-senior-engineering";
import { leadSeniorEngineeringUa } from "./ua/lead-senior-engineering";
import { aiInEngineeringEn } from "./en/ai-in-engineering";
import { aiInEngineeringUa } from "./ua/ai-in-engineering";
import { interviewQuestionsEn } from "./en/interview-questions";
import { interviewQuestionsUa } from "./ua/interview-questions";
import { hrInterviewEn } from "./en/hr-interview";
import { hrInterviewUa } from "./ua/hr-interview";
import { interviewsTrading212En } from "./en/interviews-trading212";
import { interviewsTrading212Ua } from "./ua/interviews-trading212";

/**
 * Реестр переводов контента по языкам. Пока переведён топик JavaScript —
 * это первый (и самый читаемый) раздел сайта, остальные темы будут
 * добавляться сюда постепенно, тема за темой. Если для конкретной
 * подтемы перевода ещё нет, getLocalizedContent просто вернёт базовый
 * (русский) контент — сайт не ломается и не показывает пустые поля.
 */
const TRANSLATIONS: Partial<Record<Locale, ContentTranslationMap>> = {
  en: { ...javascriptEn, ...typescriptEn, ...reactEn, ...nextjsSsrEn, ...dataFetchingCacheEn, ...apisNetworkingEn, ...authSecurityEn, ...performanceEn, ...practiceTasksEn, ...stateManagementEn, ...frontendArchitectureEn, ...formsEn, ...testingEn, ...frontendSystemDesignEn, ...leadSeniorEngineeringEn, ...aiInEngineeringEn, ...interviewQuestionsEn, ...hrInterviewEn, ...interviewsTrading212En },
  ua: { ...javascriptUa, ...typescriptUa, ...reactUa, ...nextjsSsrUa, ...dataFetchingCacheUa, ...apisNetworkingUa, ...authSecurityUa, ...performanceUa, ...practiceTasksUa, ...stateManagementUa, ...frontendArchitectureUa, ...formsUa, ...testingUa, ...frontendSystemDesignUa, ...leadSeniorEngineeringUa, ...aiInEngineeringUa, ...interviewQuestionsUa, ...hrInterviewUa, ...interviewsTrading212Ua },
};

/**
 * Возвращает контент подтемы, локализованный под выбранный язык
 * интерфейса. Для "ru" всегда возвращает базовый контент как есть
 * (весь сайт изначально писался на русском). Для "ua"/"en" — накладывает
 * переведённые поля (title/shortExplanation/detailedExplanation/whereUsed/
 * pitfalls/practiceTask/keyTakeaways/followUpQuestions) поверх базового
 * контента; поля без перевода (interviewAnswerRu/interviewAnswerEn,
 * codeExample, resources, difficulty, interviewFrequency, relatedTopics)
 * остаются как в базовом контенте — они либо не переводятся принципиально
 * (код, ссылки), либо уже двуязычны сами по себе (блок интервью-ответа).
 */
export function getLocalizedContent(subtopicId: string, baseContent: LessonContent, locale: Locale): LessonContent {
  if (locale === "ru") return baseContent;

  const override = TRANSLATIONS[locale]?.[subtopicId];
  if (!override) return baseContent;

  return { ...baseContent, ...override };
}
