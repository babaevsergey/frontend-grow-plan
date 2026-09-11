/**
 * Статические типы учебного контента.
 * Важно: сюда НЕ входят пользовательские данные (прогресс, заметки) —
 * они живут отдельно, в src/store/*, и сохраняются в localStorage.
 */

export interface ResourceLink {
  title: string;
  url: string;
}

export interface LessonContent {
  title: string;
  /**
   * Опционально: некоторые подтемы (например, готовые ответы для
   * конкретного интервью) состоят только из вопроса и ответа, без
   * отдельных секций "Коротко"/"Подробнее".
   */
  shortExplanation?: string;
  detailedExplanation?: string;
  /**
   * Опционально: не у всех подтем есть смысл в примере кода
   * (например, у блока HR Interview — там вместо этого просто ответ).
   */
  codeExample?: string;
  interviewQuestion: string;
  /**
   * Опционально: если подготовлен только английский ответ (например,
   * для реального interview-скрипта), русский блок можно не заполнять.
   */
  interviewAnswerRu?: string;
  interviewAnswerEn: string;
  /**
   * Опционально: если для подтемы нет ни типичных ошибок, ни
   * практического задания, блок целиком скрывается.
   */
  pitfalls?: string[];
  practiceTask?: string;
  /**
   * Дополнительные материалы: официальная документация и статьи по теме.
   * Опционально — старые/неполные подтемы могут быть без этого поля.
   */
  resources?: {
    docs: ResourceLink[];
    articles: ResourceLink[];
  };
}

export interface Subtopic {
  id: string;
  title: string;
  content: LessonContent;
}

export interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

/**
 * Пользовательское состояние прогресса.
 * Ключ — id подтемы, значение — пройдена она или нет.
 */
export type ProgressState = Record<string, boolean>;

/**
 * Пользовательские заметки.
 * Ключ — id подтемы, значение — текст заметки.
 */
export type NotesState = Record<string, string>;

/**
 * Один вопрос для Quiz mode — "выжимка" из LessonContent конкретной подтемы,
 * только то, что нужно для тренировки интервью-вопросов.
 */
export interface QuizItem {
  topicId: string;
  topicTitle: string;
  subtopicId: string;
  subtopicTitle: string;
  question: string;
  answerRu?: string;
  answerEn: string;
}

/**
 * Результат прохождения одного вопроса в рамках сессии quiz mode.
 */
export interface QuizAnswer {
  subtopicId: string;
  knew: boolean;
}
