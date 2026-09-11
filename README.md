# Frontend Grow Plan

Личная учебная база знаний по frontend-темам: React, TypeScript, JavaScript,
State Management, Data Fetching & Cache, Next.js/SSR, Authorization & Security,
Performance, Frontend Architecture, Testing, Interview Questions, Practice Tasks.

Слева — список тем и подтем с чекбоксами прогресса, справа — материал
по выбранной подтеме (что это / зачем / где применяется / trade-offs /
как объяснить на интервью / практическая задача / мои заметки).

## Архитектура

```
src/
  app/                  Next.js App Router: страницы
    page.tsx            главная страница (sidebar + контент)
    drafts/page.tsx      страница "Черновик" со всеми заметками
    layout.tsx           корневой layout, подключает globals.css
  types/content.ts       TypeScript-типы: Topic, Subtopic, LessonContent,
                          ProgressState, NotesState
  data/content.ts         статический учебный контент (только данные,
                          без completed/notes — это пользовательское состояние)
  store/
    useAppStore.ts        выбранная тема/подтема (навигация, не персистится)
    useProgressStore.ts   прогресс прохождения тем (persist -> localStorage)
    useNotesStore.ts      заметки пользователя (persist -> localStorage)
  components/
    AppLayout.tsx         общий layout + мобильный sidebar
    Sidebar.tsx           список тем/подтем + прогресс + ссылки на quiz/черновик
    ProgressBar.tsx       полоска прогресса и "Пройдено X из Y тем"
    TopicGroup.tsx        раскрывающаяся группа подтем
    SubtopicItem.tsx      строка подтемы с чекбоксом
    LessonContent.tsx     материал по выбранной подтеме
    CodeBlock.tsx         блок с примером кода, подсветка синтаксиса через Prism
    InterviewAnswerBlock.tsx  блок "Как объяснить на интервью" (RU + EN)
    PracticeTaskBlock.tsx     практическая задача + типичные ошибки
    NotesBlock.tsx        заметка: кнопка "+ Добавить заметку" -> textarea -> сохранить
    ResourcesBlock.tsx    "Дополнительные материалы" — офиц. документация + статьи
    DraftsList.tsx        список всех заметок для страницы /drafts
    quiz/
      QuizApp.tsx          стейт-машина quiz mode: setup -> session -> results
      QuizSetup.tsx        выбор тем и количества вопросов
      QuizSession.tsx      один вопрос: показать ответ, отметить знал/не знал
      QuizResults.tsx      итог сессии + список тем "стоит повторить"
```

Контент (`content.ts`) намеренно отделён от пользовательского состояния
(`store/*`): это позволяет позже подключить бэкенд или синхронизацию,
поменяв только stores, не трогая учебные материалы.

## Что наполнено контентом

Полный материал (7 полей на подтему + RU/EN интервью-ответ) есть для всех
12 тем из sidebar — 63 подтемы:

- **React**: Rendering, Re-render, Custom Hooks, Stale Closure, Memoization
- **TypeScript**: Generics, Union Types, Narrowing, never, Mapped Types
- **JavaScript**: Event Loop, Closures, Prototypes, this, Promises & async/await
- **State Management**: Zustand vs Redux vs Context, Normalizing State,
  Derived State, Local vs Global State, Form State
- **Data Fetching & Cache**: Server State vs Client State, TanStack Query,
  Query Keys, Cache Invalidation, Optimistic Updates
- **Next.js / SSR**: SSR, Server Components, Client Components, Hydration,
  Next.js Caching
- **Authorization & Security**: Authentication vs Authorization, JWT vs
  Session, Access Token / Refresh Token, HttpOnly Cookies, XSS/CSRF/CORS
- **Performance**: Core Web Vitals, Critical Rendering Path, Reflow/Repaint,
  Bundle Optimization, Image Optimization
- **Frontend Architecture**: Feature-Sliced Design, Separation of UI and
  Business Logic, Monorepos, Design Systems, Composition over Inheritance
- **Testing**: Testing Pyramid, React Testing Library, Mocking & Stubs,
  Snapshot Testing, Testing Custom Hooks
- **Interview Questions**: Virtual DOM vs Real DOM, Event Delegation,
  REST vs GraphQL, var vs let vs const, == vs ===
- **Practice Tasks**: useDebounce, useThrottle, useLocalStorage, useFetch,
  Promise.all, deepClone, groupBy, memoize

Контент можно расширять дальше — добавляйте новые подтемы в любую тему
по такому же шаблону (см. раздел ниже).

Все 63 подтемы также содержат `resources` — по 1 ссылке на официальную
документацию и 1-3 статьи по теме (проверенные, реальные ссылки на
react.dev, developer.mozilla.org, tanstack.com, nextjs.org, web.dev,
owasp.org, tkdodo.eu, overreacted.io и т.п.), которые отображаются блоком
«Дополнительные материалы» внизу страницы подтемы.

## Подсветка кода

`CodeBlock` подсвечивает примеры кода через PrismJS (грамматика `tsx`,
покрывает и обычный JS) в цветовой теме, приближенной к Darcula из
WebStorm/IntelliJ — тёмный фон, оранжевые ключевые слова, зелёные строки,
жёлтые имена функций. Стили темы лежат в `globals.css` под классом
`.code-darcula`.

## Quiz mode

Страница `/quiz` (ссылка «🎯 Quiz mode» в sidebar) — тренажёр интервью-вопросов:

1. **Настройка** — выбираете темы (по умолчанию все) и количество вопросов
   (5 / 10 / 20 / все доступные).
2. **Сессия** — вопрос берётся из поля `interviewQuestion` случайной подтемы.
   Сначала вы пытаетесь ответить сами, затем жмёте «Показать ответ» и видите
   `interviewAnswerRu` и `interviewAnswerEn`, после чего честно отмечаете
   «✅ Знал» или «❌ Не знал».
3. **Результаты** — процент правильных ответов и список тем, которые стоит
   повторить, с прямой ссылкой обратно на подтему (открывает её в `/`).

Вопросы для quiz mode ничего не хранят отдельно — они собираются на лету из
`content.ts` через `buildQuizItems()` (см. `src/data/content.ts`), поэтому
любая новая подтема с заполненными `interviewQuestion`/`interviewAnswerRu`/
`interviewAnswerEn` автоматически попадает в пул вопросов. Результаты сессии
не сохраняются в localStorage — это осознанный выбор для MVP, каждая сессия
начинается заново (см. "Дальнейшее развитие" про историю попыток).

## Как запустить локально

Нужен Node.js 18+ (проверить: `node -v`).

```bash
cd frontend-grow-plan
npm install
npm run dev
```

Откройте http://localhost:3000 — слева список тем, справа материал.
Прогресс и заметки сохраняются в localStorage браузера автоматически.

Для продакшн-сборки:

```bash
npm run build
npm run start
```

Проект уже проверен: `npx tsc --noEmit` проходит без ошибок, `npm run build`
собирается успешно.

## Как добавить новую тему или подтему

1. Откройте `src/data/content.ts`.
2. Добавьте новый объект `Subtopic` в массив `subtopics` нужной темы
   (или новый `Topic` в массив `TOPICS`), заполнив все поля `LessonContent`.
3. Ничего больше менять не нужно — sidebar, прогресс-бар и черновик
   автоматически подхватят новую тему через `getAllSubtopicIds()`.

## Дальнейшее развитие (после MVP)

- ~~поиск по темам~~ — реализовано (поле поиска над списком тем в sidebar)
- ~~фильтр "Показать только непройденные"~~ — реализовано (чекбокс в sidebar)
- статусы "Не начато / В процессе / Пройдено" вместо простого чекбокса
- дата последнего изучения темы
- повторение темы через несколько дней (spaced repetition)
- избранные темы
- сложность темы (лёгкая / средняя / сложная)
- ~~quiz mode~~ — реализовано (`/quiz`)
- история попыток quiz mode (даты, % по темам, прогресс во времени)
- quiz только по непройденным/пройденным темам, а не по всем сразу
- interview mode — таймер + запись собственного ответа
- code practice mode — редактор кода прямо в приложении для Practice Tasks
- flashcards на основе interviewQuestion / interviewAnswerRu
- общий dashboard прогресса по всем темам (графики, streak дней подряд)
- экспорт заметок в markdown (по теме или целиком)
- тёмная тема
- импорт/экспорт прогресса и заметок (JSON-файл)
# frontend-grow-plan
