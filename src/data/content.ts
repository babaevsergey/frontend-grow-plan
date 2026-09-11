import type { Topic, QuizItem } from "@/types/content";

/**
 * Весь учебный контент приложения.
 * Это статические данные — они не меняются в рантайме.
 * Прогресс и заметки пользователя хранятся отдельно (см. src/store).
 */
export const TOPICS: Topic[] = [
  // ---------------------------------------------------------------------
  // REACT
  // ---------------------------------------------------------------------
  {
    id: "react",
    title: "React",
    subtopics: [
      {
        id: "react-rendering",
        title: "Rendering",
        content: {
          title: "Rendering (рендеринг)",
          shortExplanation:
            "Rendering — это процесс, в котором React вызывает функцию компонента, чтобы получить описание того, что должно быть на экране (дерево React-элементов из JSX). Сам по себе рендер — это только вычисление в памяти, а не изменение DOM: реальные DOM-узлы обновляются позже, в отдельной фазе commit.",
          detailedExplanation:
            "Рендер запускается по одной из трёх причин: изменился собственный state компонента, изменился контекст, который он читает, или ре-рендерится родитель (тогда по умолчанию React вызывает и все дочерние компоненты, даже без изменения их пропсов). В момент рендера React буквально вызывает вашу функцию-компонент как обычную JS-функцию. JSX внутри неё — это синтаксический сахар над React.createElement(...), поэтому результатом вызова является не разметка, а обычное дерево JS-объектов (React Element Tree, часто называемое 'виртуальным DOM'). На этом этапе браузер ещё ни при чём — это чистое вычисление в памяти.\n\nДальше наступает фаза reconciliation ('согласование'): React сравнивает новое дерево элементов с деревом от предыдущего рендера — по типу узла и его key — и вычисляет минимальный набор реальных изменений, которые нужно применить. Если на одном и том же месте в дереве раньше был <button>, а теперь снова <button> с другим текстом, React обновит только текстовый узел внутри, а не пересоздаст DOM-элемент с нуля. Если же тип элемента изменился (например, <button> заменился на <a>), старый DOM-узел будет полностью удалён, а новый создан заново — вместе со всем состоянием дочерних компонентов внутри него.\n\nТолько после того, как список изменений посчитан, React переходит к фазе commit — именно здесь и только здесь браузерный DOM реально меняется, срабатывают браузерные layout/paint, и уже после этого запускаются эффекты (useEffect/useLayoutEffect). Если diffing показал, что менять нечего (новое дерево элементов идентично предыдущему), commit может быть пустым: React 'отрендерил' компонент — то есть вызвал функцию и посчитал разницу — но ни один DOM-узел на самом деле не тронул.\n\nИз этого следует важное практическое правило: функция компонента должна быть чистой (pure) по отношению к рендеру — не мутировать внешние переменные, не делать сетевые запросы и не трогать DOM напрямую прямо в теле функции. React не гарантирует, что вызовет компонент ровно один раз за одно обновление: в React Strict Mode (только в development) компоненты намеренно вызываются дважды подряд, чтобы выявить именно такие побочные эффекты, спрятанные в рендере. Всё, что должно происходить 'взаправду' — запрос данных, подписка на событие, ручная работа с DOM — должно жить в useEffect, который React запускает уже после commit, а не во время самого рендера.\n\nНа практике эта разница между 'рендер' и 'commit' — то, что чаще всего путают при оптимизации производительности. React DevTools Profiler показывает именно рендеры (сколько раз вызывалась функция и сколько это заняло времени), а не только реальные изменения DOM — поэтому компонент может показывать 'ре-рендерился 50 раз' в профайлере, при этом ни разу не изменив ни одного пикселя на экране. Умение отличать 'лишний вызов функции' от 'лишнего обновления DOM' — это как раз то, что дальше разбирается в темах Re-render и Memoization.",
          codeExample:
            "function Counter() {\n  const [count, setCount] = useState(0);\n  console.log('render'); // вызывается при каждом рендере\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}",
          interviewQuestion: "Что происходит в React, когда вы говорите 'компонент отрендерился'?",
          interviewAnswerRu:
            "Это значит, что React вызвал функцию компонента, получил новое дерево элементов и сравнил его с предыдущим через reconciliation. Если есть реальные отличия, React обновит DOM в фазе commit.",
          interviewAnswerEn:
            "It means React called the component function again, produced a new element tree, and diffed it against the previous one via reconciliation. If there are real differences, React applies them to the DOM during the commit phase.",
          pitfalls: [
            "Путать 'рендер' с 'обновлением DOM' — это разные фазы.",
            "Считать, что рендер компонента — это всегда дорого; часто дорога не сама функция, а побочные эффекты внутри неё.",
          ],
          practiceTask:
            "Добавьте console.log в компонент и понаблюдайте, сколько раз он рендерится при разных действиях: клик по кнопке внутри компонента, клик по кнопке в родителе, изменение несвязанного состояния.",
          resources: {
            docs: [
              { title: "Render and Commit — React docs", url: "https://react.dev/learn/render-and-commit" },
            ],
            articles: [
              { title: "A Complete Guide to useEffect (Dan Abramov)", url: "https://overreacted.io/a-complete-guide-to-useeffect/" },
            ],
          },
        },
      },
      {
        id: "react-re-render",
        title: "Re-render",
        content: {
          title: "Re-render (повторный рендер)",
          shortExplanation:
            "Re-render — это повторный вызов компонента, который происходит из-за изменения state, пропсов или контекста, либо из-за ре-рендера родителя.",
          detailedExplanation:
            "React ре-рендерит компонент в трёх основных случаях: изменился его собственный state, изменился контекст, который он читает, или ре-рендерится родитель (тогда по умолчанию ре-рендерятся и все дети, даже если их пропсы не менялись). Это нормальное поведение React, а не баг. Проблемой это становится, когда ре-рендер происходит слишком часто или затрагивает тяжёлые части дерева — тогда используют memo, useMemo, useCallback или пересмотр структуры компонентов (composition).",
          codeExample:
            "function Parent() {\n  const [tick, setTick] = useState(0);\n  return (\n    <div>\n      <button onClick={() => setTick(t => t + 1)}>tick</button>\n      {/* Child ре-рендерится при каждом клике, даже без пропсов */}\n      <Child />\n    </div>\n  );\n}",
          interviewQuestion: "Почему дочерний компонент ре-рендерится, если его пропсы не изменились?",
          interviewAnswerRu:
            "Потому что по умолчанию React ре-рендерит всех детей при ре-рендере родителя, независимо от того, изменились ли их пропсы. Чтобы этого избежать, компонент нужно обернуть в React.memo — тогда React сравнит пропсы и пропустит рендер, если они не изменились (по ссылке).",
          interviewAnswerEn:
            "By default React re-renders all children whenever the parent re-renders, regardless of whether their props changed. Wrapping the child in React.memo makes React shallow-compare props and skip the render if they are referentially equal.",
          pitfalls: [
            "Оборачивать всё подряд в memo 'на всякий случай' — это добавляет накладные расходы на сравнение пропсов.",
            "Забывать, что новый объект/массив/функция в пропсах каждый рендер делает memo бесполезным.",
          ],
          practiceTask:
            "Сделайте Parent с состоянием и Child без пропсов. Оберните Child в React.memo и проверьте через console.log, ре-рендерится ли он теперь при изменении state в Parent.",
          resources: {
            docs: [
              { title: "memo — React docs", url: "https://react.dev/reference/react/memo" },
            ],
            articles: [
              { title: "Why React Re-Renders (Josh W. Comeau)", url: "https://www.joshwcomeau.com/react/why-react-re-renders/" },
            ],
          },
        },
      },
      {
        id: "react-custom-hooks",
        title: "Custom Hooks",
        content: {
          title: "Custom Hooks (собственные хуки)",
          shortExplanation:
            "Custom hook — это обычная функция, имя которой начинается с 'use', которая переиспользует логику работы со state и эффектами между компонентами.",
          detailedExplanation:
            "Кастомные хуки не добавляют новых возможностей React — они просто позволяют вынести повторяющуюся логику (например, подписку на события, работу с localStorage, debounce) в отдельную переиспользуемую функцию. Внутри кастомного хука можно использовать любые другие хуки (useState, useEffect, другие кастомные хуки). Главное правило — соблюдать 'Rules of Hooks': вызывать хуки только на верхнем уровне функции и только в React-функциях (компонентах или других хуках).",
          codeExample:
            "function useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    const onResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', onResize);\n    return () => window.removeEventListener('resize', onResize);\n  }, []);\n  return width;\n}",
          interviewQuestion: "Чем custom hook отличается от обычной utility-функции?",
          interviewAnswerRu:
            "Custom hook может использовать состояние, эффекты и другие хуки React и 'подключён' к жизненному циклу компонента, в котором он вызван. Обычная функция этого не может — она не имеет доступа к state и не переживает ре-рендеры сама по себе.",
          interviewAnswerEn:
            "A custom hook can use React state, effects, and other hooks, and it's tied to the lifecycle of the component that calls it. A plain utility function can't do that — it has no access to state and doesn't persist across re-renders on its own.",
          pitfalls: [
            "Вызывать хуки внутри условий, циклов или после return — нарушает Rules of Hooks.",
            "Делать хук слишком 'умным' и завязанным на конкретный компонент — теряется переиспользуемость.",
          ],
          practiceTask:
            "Напишите useLocalStorage(key, initialValue), который читает значение из localStorage при инициализации и синхронизирует его при каждом изменении.",
          resources: {
            docs: [
              { title: "Reusing Logic with Custom Hooks — React docs", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" },
            ],
            articles: [
              { title: "When to useMemo and useCallback (Kent C. Dodds)", url: "https://kentcdodds.com/blog/usememo-and-usecallback" },
            ],
          },
        },
      },
      {
        id: "react-stale-closure",
        title: "Stale Closure",
        content: {
          title: "Stale Closure (устаревшее замыкание)",
          shortExplanation:
            "Stale closure — ситуация, когда функция (например, внутри useEffect или setTimeout) 'помнит' старое значение переменной из предыдущего рендера, а не актуальное.",
          detailedExplanation:
            "Каждый рендер компонента создаёт новые замыкания для всех функций внутри него, включая обработчики событий и колбэки в useEffect. Если такая функция сохраняется 'надолго' (например, через setTimeout, setInterval или подписку на событие) и в её теле список зависимостей useEffect указан неверно (например, пустой массив), функция продолжит использовать значения переменных из того рендера, в котором была создана — даже если state с тех пор изменился.",
          codeExample:
            "function Timer() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => {\n      console.log(count); // всегда 0 — stale closure\n    }, 1000);\n    return () => clearInterval(id);\n  }, []); // count не в зависимостях\n  return <button onClick={() => setCount(c => c + 1)}>+1</button>;\n}",
          interviewQuestion: "Почему в setInterval внутри useEffect count всегда остаётся 0?",
          interviewAnswerRu:
            "Потому что useEffect с пустым массивом зависимостей выполняется один раз, и функция внутри setInterval замыкает переменную count из того самого первого рендера. Исправить можно, добавив count в зависимости, используя функциональное обновление setCount(c => c + 1), или храня актуальное значение в useRef.",
          interviewAnswerEn:
            "Because the effect runs only once (empty dependency array), the callback inside setInterval closes over the count value from that very first render. Fixes include adding count to the dependency array, using the functional update form setCount(c => c + 1), or keeping the latest value in a ref.",
          pitfalls: [
            "Указывать неполный массив зависимостей, чтобы 'убрать warning', вместо того чтобы понять причину.",
            "Не использовать функциональные обновления state там, где это решает проблему проще, чем правка зависимостей.",
          ],
          practiceTask:
            "Воспроизведите баг из примера, затем исправьте его двумя разными способами: через зависимости useEffect и через useRef.",
          resources: {
            docs: [
              { title: "Synchronizing with Effects — React docs", url: "https://react.dev/learn/synchronizing-with-effects" },
            ],
            articles: [
              { title: "Be Aware of Stale Closures when Using React Hooks (Dmitri Pavlutin)", url: "https://dmitripavlutin.com/react-hooks-stale-closures/" },
              { title: "A Complete Guide to useEffect (Dan Abramov)", url: "https://overreacted.io/a-complete-guide-to-useeffect/" },
            ],
          },
        },
      },
      {
        id: "react-memoization",
        title: "Memoization",
        content: {
          title: "Memoization (мемоизация)",
          shortExplanation:
            "Мемоизация — это кэширование результата вычисления или объекта, чтобы не пересоздавать его при каждом рендере без необходимости.",
          detailedExplanation:
            "В React для мемоизации есть три основных инструмента: useMemo — кэширует значение (например, результат тяжёлого вычисления или новый объект/массив), useCallback — кэширует ссылку на функцию, React.memo — кэширует результат рендера всего компонента на основе сравнения пропсов. Мемоизация не ускоряет сам первый рендер — она помогает избежать повторной работы при последующих рендерах, если входные данные не изменились.",
          codeExample:
            "const sortedItems = useMemo(\n  () => items.slice().sort((a, b) => a.value - b.value),\n  [items]\n);\n\nconst handleClick = useCallback(() => {\n  onSelect(id);\n}, [id, onSelect]);",
          interviewQuestion: "Когда мемоизация действительно даёт выигрыш, а когда только усложняет код?",
          interviewAnswerRu:
            "Мемоизация полезна, когда вычисление реально тяжёлое (сортировка/фильтрация больших списков) или когда стабильная ссылка нужна для React.memo дочернего компонента или как зависимость другого хука. Если вычисление дешёвое, useMemo только добавляет накладные расходы на сравнение зависимостей и усложняет чтение кода.",
          interviewAnswerEn:
            "Memoization pays off when the computation is genuinely expensive (sorting/filtering large lists) or when a stable reference is needed for a memoized child component or as a dependency of another hook. For cheap computations, useMemo just adds the overhead of comparing dependencies and makes the code harder to read.",
          pitfalls: [
            "Мемоизировать всё подряд 'для перфоманса' без профилирования.",
            "Забывать полный список зависимостей в useMemo/useCallback, получая устаревшие значения.",
          ],
          practiceTask:
            "Возьмите список из 10 000 элементов, добавьте тяжёлую сортировку без useMemo и с useMemo, сравните через React DevTools Profiler.",
          resources: {
            docs: [
              { title: "useMemo — React docs", url: "https://react.dev/reference/react/useMemo" },
            ],
            articles: [
              { title: "When to useMemo and useCallback (Kent C. Dodds)", url: "https://kentcdodds.com/blog/usememo-and-usecallback" },
            ],
          },
        },
      },
    ],
  },

  // ---------------------------------------------------------------------
  // TYPESCRIPT
  // ---------------------------------------------------------------------
  {
    id: "typescript",
    title: "TypeScript",
    subtopics: [
      {
        id: "ts-generics",
        title: "Generics",
        content: {
          title: "Generics (обобщённые типы)",
          shortExplanation:
            "Generics позволяют писать функции, типы и компоненты, которые работают с разными типами данных, сохраняя типовую безопасность.",
          detailedExplanation:
            "Вместо того чтобы писать отдельную функцию для каждого типа данных или использовать any (теряя проверку типов), generics вводят 'типовой параметр' — например <T> — который подставляется реальным типом в месте вызова. TypeScript выводит T автоматически из аргументов, но его также можно указать явно. Generics широко используются в React (например, useState<T>()), в утилитах массивов, в API-клиентах.",
          codeExample:
            "function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nconst num = first([1, 2, 3]); // number | undefined\nconst str = first(['a', 'b']); // string | undefined",
          interviewQuestion: "Зачем нужны generics, если можно использовать any?",
          interviewAnswerRu:
            "any полностью отключает проверку типов — компилятор перестаёт помогать. Generics сохраняют связь между входными и выходными типами: если в функцию передали number[], TypeScript знает, что вернётся number | undefined, а не any. Это даёт автодополнение и защиту от ошибок при использовании результата.",
          interviewAnswerEn:
            "any disables type checking entirely — the compiler stops helping you. Generics preserve the relationship between input and output types: if you pass in a number[], TypeScript knows the return type is number | undefined, not any. That gives you autocomplete and error checking wherever the result is used.",
          pitfalls: [
            "Использовать generic там, где подошёл бы простой конкретный тип — усложняет чтение без пользы.",
            "Путать generic-параметр с any, когда ограничения (extends) не заданы.",
          ],
          practiceTask:
            "Напишите generic-функцию groupBy<T, K extends string | number>(items: T[], getKey: (item: T) => K): Record<K, T[]>.",
          resources: {
            docs: [
              { title: "Generics — TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" },
            ],
            articles: [
              { title: "Generics (TypeScript Deep Dive, Basarat)", url: "https://basarat.gitbook.io/typescript/type-system/generics" },
              { title: "Generic Parameter Defaults in TypeScript (Marius Schulz)", url: "https://mariusschulz.com/blog/generic-parameter-defaults-in-typescript" },
            ],
          },
        },
      },
      {
        id: "ts-union-types",
        title: "Union Types",
        content: {
          title: "Union Types (объединённые типы)",
          shortExplanation:
            "Union type — это тип, значение которого может быть одним из нескольких перечисленных типов, например string | number.",
          detailedExplanation:
            "Union types (A | B) описывают значение, которое реально может принимать разные формы — типичный пример: результат запроса { status: 'loading' } | { status: 'success', data: T } | { status: 'error', error: string }. TypeScript заставляет вас проверить, какой именно вариант перед вами (через narrowing), прежде чем обращаться к полям, специфичным для одного из вариантов.",
          codeExample:
            "type Result =\n  | { status: 'loading' }\n  | { status: 'success'; data: string }\n  | { status: 'error'; error: string };\n\nfunction render(result: Result) {\n  if (result.status === 'success') {\n    return result.data; // TS знает, что data есть\n  }\n}",
          interviewQuestion: "Чем union type отличается от enum?",
          interviewAnswerRu:
            "Union type из строковых литералов ('a' | 'b') существует только на уровне типов и не создаёт рантайм-объект, в то время как enum генерирует реальный JS-объект (кроме const enum). Для большинства случаев в React/TS-проектах предпочитают union из строковых литералов — они проще, легче сериализуются и лучше работают с discriminated unions.",
          interviewAnswerEn:
            "A string literal union ('a' | 'b') exists only at the type level and produces no runtime object, whereas a regular enum compiles to an actual JS object (except const enum). In most React/TS codebases string literal unions are preferred — they're simpler, serialize cleanly, and work well with discriminated unions.",
          pitfalls: [
            "Забывать обработать один из вариантов union — TypeScript подскажет через exhaustiveness check с never.",
            "Делать слишком широкие union (string | number | boolean | object), теряя смысл типа.",
          ],
          practiceTask:
            "Опишите discriminated union для формы Shape = Circle | Square | Rectangle и напишите функцию area(shape: Shape): number с полным разбором через switch.",
          resources: {
            docs: [
              { title: "Everyday Types: Union Types — TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" },
            ],
            articles: [
              { title: "Tagged Union Types in TypeScript (Marius Schulz)", url: "https://mariusschulz.com/blog/tagged-union-types-in-typescript" },
              { title: "Discriminated Unions (TypeScript Deep Dive, Basarat)", url: "https://basarat.gitbook.io/typescript/type-system/discriminated-unions" },
            ],
          },
        },
      },
      {
        id: "ts-narrowing",
        title: "Narrowing",
        content: {
          title: "Narrowing (сужение типов)",
          shortExplanation:
            "Narrowing — это процесс, при котором TypeScript уточняет (сужает) широкий тип до более конкретного на основе проверок в коде.",
          detailedExplanation:
            "TypeScript анализирует условия — typeof, instanceof, in, сравнение с литералом, кастомные type guard функции (value is Type) — и внутри соответствующей ветки кода 'сужает' тип переменной. Это позволяет безопасно работать с union types без явных приведений типов (as).",
          codeExample:
            "function printLength(value: string | string[]) {\n  if (Array.isArray(value)) {\n    console.log(value.length); // value: string[]\n  } else {\n    console.log(value.length); // value: string\n  }\n}\n\nfunction isString(v: unknown): v is string {\n  return typeof v === 'string';\n}",
          interviewQuestion: "Как TypeScript понимает, что внутри if переменная стала конкретного типа?",
          interviewAnswerRu:
            "TypeScript анализирует поток управления (control flow analysis) и связывает конкретные проверки — typeof, instanceof, in, сравнение с литералом или пользовательский type guard — с сужением типа внутри блока, где условие истинно. Это статический анализ на этапе компиляции, в рантайме TS-типов не существует.",
          interviewAnswerEn:
            "TypeScript performs control flow analysis and associates specific checks — typeof, instanceof, in, literal comparisons, or a custom type guard — with narrowing the type inside the branch where the condition holds. This is purely a compile-time static analysis; there are no types left at runtime.",
          pitfalls: [
            "Полагаться на as вместо настоящего narrowing — компилятор перестаёт реально проверять корректность.",
            "Забывать, что narrowing 'ломается', если между проверкой и использованием переменная переприсваивается через замыкание.",
          ],
          practiceTask:
            "Напишите type guard isError(value: unknown): value is Error и используйте его в try/catch блоке для безопасного доступа к error.message.",
          resources: {
            docs: [
              { title: "Narrowing — TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html" },
            ],
            articles: [
              { title: "Discriminated Unions (TypeScript Deep Dive, Basarat)", url: "https://basarat.gitbook.io/typescript/type-system/discriminated-unions" },
            ],
          },
        },
      },
      {
        id: "ts-never",
        title: "never",
        content: {
          title: "never",
          shortExplanation:
            "never — тип, который означает 'значение, которого никогда не будет': функция никогда не завершится нормально, либо ветка кода недостижима.",
          detailedExplanation:
            "never используется в двух основных случаях: для функций, которые всегда бросают исключение или уходят в бесконечный цикл (function fail(): never { throw new Error() }), и для проверки исчерпывающей обработки (exhaustiveness check) в union types — если после обработки всех вариантов switch остаётся значение типа never, значит все случаи покрыты. Если позже добавить новый вариант в union и забыть обработать его, TypeScript покажет ошибку именно в месте с never.",
          codeExample:
            "type Shape = { kind: 'circle' } | { kind: 'square' };\n\nfunction area(shape: Shape): number {\n  switch (shape.kind) {\n    case 'circle': return 1;\n    case 'square': return 2;\n    default:\n      const _exhaustive: never = shape; // ошибка, если забыт вариант\n      throw new Error('unreachable');\n  }\n}",
          interviewQuestion: "Чем never отличается от void и почему это полезно для проверки switch?",
          interviewAnswerRu:
            "void означает 'функция ничего не возвращает', но при этом нормально завершается. never значит, что функция вообще не может завершиться нормально (бросает исключение или бесконечна), либо что тип сужен до 'ничего не осталось'. Приём с never в default-ветке switch — это способ заставить компилятор проверить, что все варианты union обработаны: если добавить новый вариант и забыть case, присвоение в never даст ошибку компиляции.",
          interviewAnswerEn:
            "void means 'the function returns nothing' but still completes normally. never means the function can never complete normally at all (it always throws or loops forever), or that a type has been narrowed down to 'nothing is left'. Assigning the switch's default value to a never-typed variable is a trick to force exhaustiveness checking: if a new union member is added and a case is missed, that assignment fails to compile.",
          pitfalls: [
            "Путать never с void в сигнатурах функций.",
            "Не использовать exhaustiveness check и получать необработанные случаи в рантайме, которые компилятор мог бы поймать.",
          ],
          practiceTask:
            "Добавьте третий вариант ('triangle') в Shape из примера и убедитесь, что компилятор ругается на строку с never, пока вы не добавите обработку.",
          resources: {
            docs: [
              { title: "Functions: the never type — TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#never" },
            ],
            articles: [
              { title: "Narrowing: Exhaustiveness Checking — TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking" },
              { title: "Discriminated Unions (TypeScript Deep Dive, Basarat)", url: "https://basarat.gitbook.io/typescript/type-system/discriminated-unions" },
            ],
          },
        },
      },
      {
        id: "ts-mapped-types",
        title: "Mapped Types",
        content: {
          title: "Mapped Types (маппированные типы)",
          shortExplanation:
            "Mapped types позволяют создавать новый тип, проходя по всем ключам существующего типа и трансформируя их (например, делая все поля опциональными).",
          detailedExplanation:
            "Синтаксис { [K in keyof T]: ... } перебирает все ключи типа T и применяет к каждому полю указанное преобразование. Встроенные утилитарные типы Partial<T>, Required<T>, Readonly<T>, Pick<T, K>, Record<K, V> — это именно mapped types, определённые в стандартной библиотеке TypeScript. Можно писать и свои — например, тип, который делает все поля объекта функциями-геттерами.",
          codeExample:
            "type User = { id: string; name: string; age: number };\n\ntype PartialUser = { [K in keyof User]?: User[K] }; // = Partial<User>\n\ntype Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];\n};\n// { getId: () => string; getName: () => string; getAge: () => number }",
          interviewQuestion: "Как реализован Partial<T> внутри TypeScript и зачем это знать?",
          interviewAnswerRu:
            "Partial<T> определён как mapped type: { [P in keyof T]?: T[P] } — он проходит по всем ключам T и добавляет к каждому знак опциональности. Понимание этого механизма помогает писать собственные утилиты трансформации типов (например, сделать все поля readonly и опциональными одновременно) вместо того, чтобы вручную дублировать интерфейсы.",
          interviewAnswerEn:
            "Partial<T> is defined as a mapped type: { [P in keyof T]?: T[P] } — it iterates over every key of T and marks each one optional. Understanding this mechanism lets you write your own type-transformation utilities (e.g. making every field both readonly and optional) instead of manually duplicating interfaces.",
          pitfalls: [
            "Дублировать интерфейсы вручную для 'почти такого же' типа вместо использования mapped types.",
            "Забывать про key remapping (as) и не уметь переименовывать ключи в новом типе.",
          ],
          practiceTask:
            "Напишите свой mapped type Nullable<T>, который делает каждое поле T либо исходного типа, либо null.",
          resources: {
            docs: [
              { title: "Mapped Types — TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html" },
            ],
            articles: [
              { title: "Mapped Types in TypeScript (Marius Schulz)", url: "https://mariusschulz.com/blog/mapped-types-in-typescript" },
              { title: "Mastering TypeScript Mapped Types (LogRocket)", url: "https://blog.logrocket.com/typescript-mapped-types/" },
            ],
          },
        },
      },
    ],
  },

  // ---------------------------------------------------------------------
  // DATA FETCHING & CACHE
  // ---------------------------------------------------------------------
  {
    id: "data-fetching-cache",
    title: "Data Fetching & Cache",
    subtopics: [
      {
        id: "df-server-vs-client-state",
        title: "Server State vs Client State",
        content: {
          title: "Server State vs Client State",
          shortExplanation:
            "Server state — данные, которые реально живут на сервере и лишь синхронизируются на клиенте; client state — данные, которые существуют только в UI (открыт ли модал, значение инпута).",
          detailedExplanation:
            "Это разделение важно, потому что у server state есть особенности, которых нет у обычного UI-состояния: он может устареть, его может параллельно менять кто-то другой, его нужно кэшировать, ревалидировать, обрабатывать загрузку и ошибки. Попытка управлять server state так же, как client state (просто useState + useEffect с fetch), приводит к дублированию логики загрузки, гонкам запросов и рассинхронизации кэша. Поэтому для server state используют специализированные инструменты (TanStack Query, SWR, RTK Query), а для client state — Zustand, Redux, useState/useReducer.",
          codeExample:
            "// Client state — обычный useState, ничего 'внешнего' нет\nconst [isModalOpen, setModalOpen] = useState(false);\n\n// Server state — данные с сервера, нужны кэш, loading, ошибки, ревалидация\nconst { data, isLoading, error } = useQuery({\n  queryKey: ['user', id],\n  queryFn: () => fetchUser(id),\n});",
          interviewQuestion: "Почему для данных с сервера не советуют просто useState + useEffect?",
          interviewAnswerRu:
            "Потому что этот подход не решает целый набор задач: кэширование между компонентами, дедупликацию одинаковых запросов, повторные попытки при ошибке, фоновую ревалидацию при возврате на вкладку, обработку гонок (race conditions) между быстро сменяющимися запросами. Всё это приходится реализовывать вручную и обычно с багами, тогда как библиотеки вроде TanStack Query решают это из коробки.",
          interviewAnswerEn:
            "Because that approach leaves out a whole set of concerns: caching data across components, deduplicating identical requests, retrying on failure, background revalidation on refocus, and handling race conditions between rapidly changing requests. All of that ends up hand-rolled and usually buggy, whereas libraries like TanStack Query handle it out of the box.",
          pitfalls: [
            "Хранить server state в Redux/Zustand 'как обычные данные', вручную реализуя кэш и инвалидацию.",
            "Не различать 'загрузка данных' (server state) и 'состояние формы фильтра' (client state) — и мешать их в одном месте.",
          ],
          practiceTask:
            "Возьмите любой компонент с useState + useEffect + fetch и перепишите его на useQuery, сравнив количество кода и обработанных edge cases.",
          resources: {
            docs: [
              { title: "TanStack Query Overview", url: "https://tanstack.com/query/latest/docs/framework/react/overview" },
            ],
            articles: [
              { title: "Practical React Query (TkDodo)", url: "https://tkdodo.eu/blog/practical-react-query" },
              { title: "React Query as a State Manager (TkDodo)", url: "https://tkdodo.eu/blog/react-query-as-a-state-manager" },
            ],
          },
        },
      },
      {
        id: "df-tanstack-query",
        title: "TanStack Query",
        content: {
          title: "TanStack Query",
          shortExplanation:
            "TanStack Query — библиотека для работы с server state в React: кэширование, ревалидация, повторные запросы, мутации — из коробки.",
          detailedExplanation:
            "Основная идея — каждый запрос идентифицируется query key, и библиотека сама решает, когда данные 'свежие' (fresh) и не требуют повторного запроса, а когда 'устаревшие' (stale) и должны быть обновлены в фоне. Для чтения данных используется useQuery, для изменения данных на сервере — useMutation, с возможностью инвалидировать связанные запросы после успешной мутации.",
          codeExample:
            "const { data, isLoading } = useQuery({\n  queryKey: ['todos'],\n  queryFn: fetchTodos,\n  staleTime: 60_000,\n});\n\nconst mutation = useMutation({\n  mutationFn: addTodo,\n  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),\n});",
          interviewQuestion: "Как TanStack Query решает, когда нужно перезапросить данные заново?",
          interviewAnswerRu:
            "Каждый запрос имеет staleTime — время, в течение которого данные считаются свежими и повторный fetch не делается. После истечения staleTime данные считаются 'stale', и при следующем событии-триггере (монтирование компонента, возврат фокуса на вкладку, восстановление сети) библиотека делает фоновый рефетч, но продолжает показывать старые данные, пока не придут новые (stale-while-revalidate).",
          interviewAnswerEn:
            "Every query has a staleTime — the window during which the data is considered fresh and no refetch happens. Once staleTime elapses the data becomes 'stale', and the next trigger event (component mount, window refocus, network reconnect) causes a background refetch, while the old data keeps rendering until the new data arrives — the classic stale-while-revalidate pattern.",
          pitfalls: [
            "Ставить staleTime: 0 везде 'для надёжности' и получать лишние сетевые запросы на каждый фокус вкладки.",
            "Забывать инвалидировать связанные query keys после мутации — UI показывает устаревшие данные.",
          ],
          practiceTask:
            "Реализуйте список задач с useQuery для чтения и useMutation для добавления задачи с инвалидацией кэша после успеха.",
          resources: {
            docs: [
              { title: "TanStack Query Overview", url: "https://tanstack.com/query/latest/docs/framework/react/overview" },
            ],
            articles: [
              { title: "Practical React Query (TkDodo)", url: "https://tkdodo.eu/blog/practical-react-query" },
              { title: "Inside React Query (TkDodo)", url: "https://tkdodo.eu/blog/inside-react-query" },
            ],
          },
        },
      },
      {
        id: "df-query-keys",
        title: "Query Keys",
        content: {
          title: "Query Keys",
          shortExplanation:
            "Query key — уникальный идентификатор запроса в кэше (обычно массив), по которому библиотека находит, обновляет и инвалидирует связанные данные.",
          detailedExplanation:
            "Query key — это не просто 'название', а часть данных, которая должна включать все параметры, влияющие на результат запроса: ['todos', { status: 'done' }] и ['todos', { status: 'all' }] — это два разных, независимо кэшируемых запроса. Если параметр не включён в key, но влияет на запрос, кэш будет отдавать неправильные (чужие) данные для разных параметров.",
          codeExample:
            "// Разные ключи — разные записи в кэше\nuseQuery({ queryKey: ['user', userId], queryFn: () => fetchUser(userId) });\nuseQuery({ queryKey: ['todos', { status: filter }], queryFn: () => fetchTodos(filter) });\n\n// Инвалидация всех запросов, начинающихся с 'todos'\nqueryClient.invalidateQueries({ queryKey: ['todos'] });",
          interviewQuestion: "Почему важно включать все параметры фильтрации в query key?",
          interviewAnswerRu:
            "Потому что TanStack Query использует key как единственный способ различать закэшированные результаты. Если два разных набора фильтров дают один и тот же key, библиотека решит, что это один и тот же запрос, и вернёт закэшированные (неправильные для одного из фильтров) данные вместо нового запроса.",
          interviewAnswerEn:
            "Because the query key is the only thing the library uses to distinguish cached results. If two different filter combinations produce the same key, the library treats them as the same query and serves cached — and for one of the filters, wrong — data instead of fetching fresh results.",
          pitfalls: [
            "Забывать параметр фильтра в query key и получать 'залипшие' неправильные данные.",
            "Делать key нестабильным (новый объект каждый рендер без нормализации) — кэш перестаёт совпадать между рендерами.",
          ],
          practiceTask:
            "Сделайте список с фильтром по статусу, где query key включает статус, и продемонстрируйте, что переключение фильтра туда-обратно не делает лишних сетевых запросов (данные берутся из кэша).",
          resources: {
            docs: [
              { title: "Query Keys — TanStack Query Docs", url: "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys" },
            ],
            articles: [
              { title: "Effective React Query Keys (TkDodo)", url: "https://tkdodo.eu/blog/effective-react-query-keys" },
            ],
          },
        },
      },
      {
        id: "df-cache-invalidation",
        title: "Cache Invalidation",
        content: {
          title: "Cache Invalidation",
          shortExplanation:
            "Инвалидация кэша — это явная пометка данных как устаревших, после которой библиотека делает повторный запрос за актуальными данными.",
          detailedExplanation:
            "После мутации (создание/обновление/удаление на сервере) локальный кэш перестаёт соответствовать реальности. Инвалидация решает эту проблему: вы указываете, какие query keys 'протухли', и библиотека либо сразу рефетчит их (если они используются на экране), либо пометит как stale для следующего использования. Это надёжнее, чем вручную вычислять и подставлять новые данные в кэш (хотя такой подход — 'optimistic update' — тоже существует и рассматривается отдельно).",
          codeExample:
            "const mutation = useMutation({\n  mutationFn: updateTodo,\n  onSuccess: (_, variables) => {\n    queryClient.invalidateQueries({ queryKey: ['todos'] });\n    queryClient.invalidateQueries({ queryKey: ['todo', variables.id] });\n  },\n});",
          interviewQuestion: "Чем инвалидация кэша отличается от простого повторного fetch по таймеру?",
          interviewAnswerRu:
            "Инвалидация — это точечное и осознанное действие 'эти данные больше не актуальны' сразу после события, которое их изменило (мутация). Рефетч по таймеру — это грубый способ 'на всякий случай', который либо слишком редко (данные долго неактуальны), либо слишком часто (лишняя нагрузка на сервер) обновляет данные, не привязываясь к реальным событиям изменения.",
          interviewAnswerEn:
            "Invalidation is a precise, deliberate 'this data is no longer valid' signal fired right after the event that changed it (a mutation). Polling on a timer is a blunt fallback that's either too infrequent (data stays stale too long) or too frequent (unnecessary server load), since it isn't tied to the actual change events.",
          pitfalls: [
            "Инвалидировать слишком широкий query key (например, весь кэш) — вызывает лавину ненужных запросов.",
            "Забывать инвалидировать связанные, но по-другому названные ключи (например, ['todos'] и ['todo', id] по отдельности).",
          ],
          practiceTask:
            "Добавьте мутацию удаления задачи и убедитесь, что после неё список задач и счётчик 'всего задач' оба обновляются через инвалидацию нужных ключей.",
          resources: {
            docs: [
              { title: "Query Invalidation — TanStack Query Docs", url: "https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation" },
            ],
            articles: [
              { title: "Mastering Mutations in React Query (TkDodo)", url: "https://tkdodo.eu/blog/mastering-mutations-in-react-query" },
            ],
          },
        },
      },
      {
        id: "df-optimistic-updates",
        title: "Optimistic Updates",
        content: {
          title: "Optimistic Updates",
          shortExplanation:
            "Optimistic update — это немедленное обновление UI до того, как сервер подтвердил изменение, чтобы интерфейс ощущался мгновенным.",
          detailedExplanation:
            "Вместо того чтобы ждать ответа сервера и только потом обновлять экран, приложение сразу применяет ожидаемый результат к локальному кэшу, а запрос отправляет в фоне. Если запрос завершается успешно — ничего менять не нужно (или подтверждаем реальными данными с сервера). Если запрос падает — нужно откатить изменение (rollback) к предыдущему состоянию и, как правило, показать сообщение об ошибке.",
          codeExample:
            "const mutation = useMutation({\n  mutationFn: toggleTodo,\n  onMutate: async (id) => {\n    await queryClient.cancelQueries({ queryKey: ['todos'] });\n    const previous = queryClient.getQueryData(['todos']);\n    queryClient.setQueryData(['todos'], (old) => toggleInList(old, id));\n    return { previous };\n  },\n  onError: (_err, _id, context) => {\n    queryClient.setQueryData(['todos'], context?.previous);\n  },\n  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),\n});",
          interviewQuestion: "Какие риски несёт optimistic update и как их снижать?",
          interviewAnswerRu:
            "Главный риск — пользователь увидит 'успех', которого на самом деле не произошло, если запрос упадёт. Поэтому обязательно нужен откат (rollback) к предыдущему состоянию при ошибке и понятная обратная связь пользователю (тост, уведомление). Также важно отменять текущие фоновые рефетчи перед оптимистичным изменением, чтобы они не перезаписали его старыми данными.",
          interviewAnswerEn:
            "The main risk is that the user sees a 'success' that never actually happened if the request fails. That's why a rollback to the previous state on error is mandatory, along with clear user feedback (a toast or notification). It's also important to cancel any in-flight background refetches before applying the optimistic change so they don't overwrite it with stale data.",
          pitfalls: [
            "Забыть rollback при ошибке — UI 'врёт' пользователю о результате операции.",
            "Не отменять параллельные запросы (cancelQueries) — гонка перезаписывает оптимистичное изменение.",
          ],
          practiceTask:
            "Реализуйте переключение чекбокса 'выполнено' у задачи с optimistic update, а затем искусственно сделайте mutationFn падать в 50% случаев и проверьте, что rollback работает.",
          resources: {
            docs: [
              { title: "Optimistic Updates — TanStack Query Docs", url: "https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates" },
            ],
            articles: [
              { title: "Mastering Mutations in React Query (TkDodo)", url: "https://tkdodo.eu/blog/mastering-mutations-in-react-query" },
            ],
          },
        },
      },
    ],
  },

  // ---------------------------------------------------------------------
  // NEXT.JS / SSR
  // ---------------------------------------------------------------------
  {
    id: "nextjs-ssr",
    title: "Next.js / SSR",
    subtopics: [
      {
        id: "nextjs-ssr-basics",
        title: "SSR",
        content: {
          title: "SSR (Server-Side Rendering)",
          shortExplanation:
            "SSR — это рендеринг React-компонентов в HTML на сервере при каждом запросе, а не только в браузере.",
          detailedExplanation:
            "При SSR сервер выполняет React-код, генерирует готовый HTML и отправляет его браузеру, который сразу показывает контент без 'пустого экрана'. После загрузки JS на клиенте происходит гидрация (hydration) — React 'подключается' к уже существующему HTML, добавляя интерактивность. SSR улучшает первый рендер (First Contentful Paint) и SEO, но добавляет нагрузку на сервер и требует, чтобы данные для страницы были доступны на момент запроса.",
          codeExample:
            "// app/products/[id]/page.tsx — Server Component по умолчанию в Next.js\nexport default async function ProductPage({ params }: { params: { id: string } }) {\n  const product = await fetchProduct(params.id); // выполняется на сервере\n  return <h1>{product.title}</h1>;\n}",
          interviewQuestion: "В чём разница между SSR и CSR (Client-Side Rendering)?",
          interviewAnswerRu:
            "При CSR браузер сначала получает почти пустой HTML и минимальный JS-бандл, а весь рендеринг и запросы данных происходят уже в браузере — пользователь какое-то время видит пустой экран или спиннер. При SSR сервер уже отдаёт готовый HTML с контентом, поэтому первый экран появляется быстрее, а интерактивность 'догоняет' через гидрацию.",
          interviewAnswerEn:
            "With CSR the browser first receives an almost empty HTML shell and a minimal JS bundle, and all rendering and data fetching happen in the browser afterward — so the user sees a blank screen or spinner for a while. With SSR the server already sends fully rendered HTML, so the first paint appears faster, and interactivity catches up via hydration.",
          pitfalls: [
            "Думать, что SSR автоматически решает все проблемы производительности — при плохой архитектуре сервер может стать узким местом.",
            "Забывать, что SSR-страница не интерактивна до завершения гидрации на клиенте.",
          ],
          practiceTask:
            "Сравните Network-вкладку в DevTools для одной и той же страницы, отрендеренной через SSR и через чистый CSR (например, через 'use client' страницу с useEffect + fetch).",
          resources: {
            docs: [
              { title: "Server and Client Components — Next.js Docs", url: "https://nextjs.org/docs/app/getting-started/server-and-client-components" },
            ],
            articles: [
              { title: "Making Sense of React Server Components (Josh Comeau)", url: "https://www.joshwcomeau.com/react/server-components/" },
            ],
          },
        },
      },
      {
        id: "nextjs-server-components",
        title: "Server Components",
        content: {
          title: "Server Components",
          shortExplanation:
            "Server Components — компоненты, которые выполняются только на сервере, не попадают в JS-бандл клиента и могут напрямую обращаться к данным.",
          detailedExplanation:
            "В Next.js App Router все компоненты по умолчанию являются Server Components, если явно не указано 'use client'. Они могут быть async, напрямую делать запросы к БД или внешним API без создания отдельного API-эндпоинта, и их код (включая используемые тяжёлые библиотеки) не отправляется в браузер — это уменьшает размер клиентского бандла. Ограничение: Server Components не могут использовать хуки состояния (useState, useEffect) и браузерные API, потому что они не выполняются в браузере.",
          codeExample:
            "// Это Server Component: без 'use client', может быть async\nexport default async function Page() {\n  const data = await db.posts.findMany(); // прямой доступ к БД\n  return <PostList posts={data} />;\n}",
          interviewQuestion: "Почему Server Components уменьшают размер JS-бандла на клиенте?",
          interviewAnswerRu:
            "Потому что код Server Component выполняется исключительно на сервере: React рендерит его в специальный сериализованный формат (RSC payload) и отправляет клиенту уже готовый результат, а не исходный JS-код компонента и его зависимостей. Если компонент использует тяжёлую библиотеку только для форматирования данных на сервере, эта библиотека вообще не попадёт в браузер.",
          interviewAnswerEn:
            "Because a Server Component's code runs exclusively on the server: React renders it into a special serialized format (the RSC payload) and sends the client the already-computed result, not the component's source code and its dependencies. If a component uses a heavy library only to format data server-side, that library never ships to the browser at all.",
          pitfalls: [
            "Пытаться использовать useState/useEffect в Server Component — это ошибка компиляции.",
            "Не понимать, что 'use client' в файле делает клиентским весь его поддерево импортов по умолчанию (если явно не разделить компоненты).",
          ],
          practiceTask:
            "Создайте страницу-Server Component, которая делает fetch данных 'на сервере', и дочерний интерактивный компонент с 'use client' внутри неё, передавая данные как пропсы.",
          resources: {
            docs: [
              { title: "Server and Client Components — Next.js Docs", url: "https://nextjs.org/docs/app/getting-started/server-and-client-components" },
            ],
            articles: [
              { title: "Server Components — React Docs", url: "https://react.dev/reference/rsc/server-components" },
              { title: "Making Sense of React Server Components (Josh Comeau)", url: "https://www.joshwcomeau.com/react/server-components/" },
            ],
          },
        },
      },
      {
        id: "nextjs-client-components",
        title: "Client Components",
        content: {
          title: "Client Components",
          shortExplanation:
            "Client Components — компоненты с директивой 'use client' наверху файла, которые выполняются в браузере и могут использовать state, эффекты и события.",
          detailedExplanation:
            "Client Component нужен там, где требуется интерактивность: обработчики событий (onClick, onChange), состояние (useState, useReducer), эффекты (useEffect), браузерные API (window, localStorage) или сторонние библиотеки, рассчитанные на клиентское выполнение (например, большинство UI-библиотек с состоянием). 'use client' — это граница: она помечает не только сам файл, но и всё, что он импортирует, как часть клиентского бандла.",
          codeExample:
            "'use client';\n\nimport { useState } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}",
          interviewQuestion: "Как правильно комбинировать Server и Client Components, чтобы не 'утяжелять' клиента?",
          interviewAnswerRu:
            "Общий принцип — 'use client' ставить как можно ниже по дереву, только на реально интерактивных листовых компонентах, а не на верхнеуровневых страницах или layout. Данные лучше грузить в Server Component и передавать их как пропсы в маленький интерактивный Client Component, а не тянуть весь layout в клиентский рендеринг.",
          interviewAnswerEn:
            "The general rule is to put 'use client' as low in the tree as possible — only on the actually interactive leaf components, not on top-level pages or layouts. Data should be fetched in a Server Component and passed as props into a small interactive Client Component, rather than pulling the entire layout into client-side rendering.",
          pitfalls: [
            "Ставить 'use client' в самом верху дерева 'на всякий случай', превращая всё приложение в CSR.",
            "Передавать в Client Component функции или данные, которые не сериализуются (например, экземпляры классов из БД).",
          ],
          practiceTask:
            "Возьмите страницу из предыдущего примера и вынесите интерактивную кнопку 'Добавить в избранное' в отдельный маленький Client Component, оставив остальную страницу серверной.",
          resources: {
            docs: [
              { title: "Server and Client Components — Next.js Docs", url: "https://nextjs.org/docs/app/getting-started/server-and-client-components" },
            ],
            articles: [
              { title: "Making Sense of React Server Components (Josh Comeau)", url: "https://www.joshwcomeau.com/react/server-components/" },
            ],
          },
        },
      },
      {
        id: "nextjs-hydration",
        title: "Hydration",
        content: {
          title: "Hydration (гидрация)",
          shortExplanation:
            "Hydration — процесс, в котором React 'оживляет' уже отрендеренный на сервере HTML, добавляя обработчики событий и внутреннее состояние.",
          detailedExplanation:
            "После того как браузер получил готовый HTML от SSR, он загружает JS-бандл React, который повторно 'рендерит' то же дерево компонентов, но не создаёт новые DOM-узлы, а привязывается к уже существующим и навешивает на них обработчики событий. Если результат рендера на клиенте не совпадает с тем, что было на сервере (например, из-за использования Date.now() или window напрямую в рендере), возникает hydration mismatch — предупреждение или ошибка о несовпадении разметки.",
          codeExample:
            "// Плохо: разное значение на сервере и клиенте -> hydration mismatch\nfunction Clock() {\n  return <span>{new Date().toLocaleTimeString()}</span>;\n}\n\n// Лучше: показываем реальное время только после монтирования на клиенте\nfunction Clock() {\n  const [time, setTime] = useState<string | null>(null);\n  useEffect(() => setTime(new Date().toLocaleTimeString()), []);\n  return <span>{time ?? '--:--:--'}</span>;\n}",
          interviewQuestion: "Что такое hydration mismatch и почему он возникает?",
          interviewAnswerRu:
            "Hydration mismatch — это ситуация, когда HTML, сгенерированный React на сервере, не совпадает с тем, что React рендерит при гидрации на клиенте. Частые причины: использование Date.now(), Math.random(), window/localStorage прямо в теле рендера, различия в данных или локали между сервером и клиентом. React в этом случае либо выводит предупреждение и использует клиентскую версию, либо (в серьёзных случаях) ломает интерактивность части дерева.",
          interviewAnswerEn:
            "A hydration mismatch happens when the HTML React generated on the server doesn't match what React renders during hydration on the client. Common causes: calling Date.now(), Math.random(), or accessing window/localStorage directly in the render body, or differences in data or locale between server and client. React either warns and falls back to the client-rendered version, or in worse cases breaks interactivity for part of the tree.",
          pitfalls: [
            "Использовать данные, зависящие от времени/рандома/браузера, прямо в рендере серверного компонента.",
            "Игнорировать предупреждения о hydration mismatch в консоли — они указывают на реальный баг.",
          ],
          practiceTask:
            "Специально вызовите hydration mismatch (например, через new Date() в рендере) и изучите предупреждение в консоли браузера, затем исправьте его через useEffect.",
          resources: {
            docs: [
              { title: "hydrateRoot — React Docs", url: "https://react.dev/reference/react-dom/client/hydrateRoot" },
            ],
            articles: [
              { title: "Server and Client Components (hydration explained) — Next.js Docs", url: "https://nextjs.org/docs/app/getting-started/server-and-client-components" },
            ],
          },
        },
      },
      {
        id: "nextjs-caching",
        title: "Next.js Caching",
        content: {
          title: "Next.js Caching",
          shortExplanation:
            "Next.js кэширует данные и рендер на нескольких уровнях (fetch cache, Full Route Cache, Router Cache), чтобы не пересчитывать одно и то же при каждом запросе.",
          detailedExplanation:
            "В App Router есть несколько независимых слоёв кэша: Data Cache — кэш результатов fetch() на сервере (можно управлять через опции cache и revalidate); Full Route Cache — кэш отрендеренного HTML/RSC-payload для статических маршрутов; Router Cache — кэш на стороне клиента для уже посещённых маршрутов, чтобы навигация между ними была мгновенной. Каждый слой можно настраивать и инвалидировать отдельно, что даёт гибкость, но требует понимания, какой именно кэш 'мешает' увидеть свежие данные.",
          codeExample:
            "// Кэшировать бессрочно (по умолчанию для fetch в Server Component)\nawait fetch(url);\n\n// Ревалидировать раз в 60 секунд (ISR-подобное поведение)\nawait fetch(url, { next: { revalidate: 60 } });\n\n// Никогда не кэшировать — всегда свежие данные\nawait fetch(url, { cache: 'no-store' });",
          interviewQuestion: "Почему обновлённые данные в БД иногда не сразу видны на странице Next.js?",
          interviewAnswerRu:
            "Скорее всего сработал один из слоёв кэша: fetch с cache: 'force-cache' (значение по умолчанию) отдал закэшированный ответ, либо сработал Full Route Cache для статически сгенерированной страницы. Решение — задать revalidate (по времени или через revalidatePath/revalidateTag после изменения данных), либо явно указать cache: 'no-store' там, где данные должны быть всегда свежими.",
          interviewAnswerEn:
            "Most likely one of the caching layers kicked in: a fetch with the default cache: 'force-cache' returned a cached response, or the Full Route Cache served a statically generated page. The fix is to set a revalidate window (time-based, or via revalidatePath/revalidateTag right after the data changes), or explicitly use cache: 'no-store' where the data must always be fresh.",
          pitfalls: [
            "Не понимать, что fetch в Next.js кэшируется по умолчанию иначе, чем обычный fetch в браузере.",
            "Забывать вызвать revalidatePath/revalidateTag после мутации данных на сервере (например, в Server Action).",
          ],
          practiceTask:
            "Сделайте страницу с fetch(url, { next: { revalidate: 10 } }) и понаблюдайте, как часто обновляются данные при повторных заходах с интервалом больше и меньше 10 секунд.",
          resources: {
            docs: [
              { title: "Caching — Next.js Docs", url: "https://nextjs.org/docs/app/getting-started/caching" },
            ],
            articles: [
              { title: "Fetching, Caching and Revalidating — Next.js Docs", url: "https://nextjs.org/docs/app/getting-started/fetching-data" },
            ],
          },
        },
      },
    ],
  },

  // ---------------------------------------------------------------------
  // AUTHORIZATION & SECURITY
  // ---------------------------------------------------------------------
  {
    id: "auth-security",
    title: "Authorization & Security",
    subtopics: [
      {
        id: "auth-authn-vs-authz",
        title: "Authentication vs Authorization",
        content: {
          title: "Authentication vs Authorization",
          shortExplanation:
            "Authentication (аутентификация) отвечает на вопрос 'кто ты?', authorization (авторизация) — на вопрос 'что тебе разрешено делать?'.",
          detailedExplanation:
            "Аутентификация — это процесс проверки личности пользователя: логин/пароль, OAuth, magic link, биометрия. Результат аутентификации — подтверждённая личность (обычно в виде токена или сессии). Авторизация происходит уже после аутентификации и решает, какие действия и ресурсы доступны этому конкретному пользователю (роли, права, ownership ресурса). Путаница между ними часто приводит к багам безопасности: например, проверяют только 'залогинен ли пользователь', но не проверяют, имеет ли он право на конкретное действие.",
          codeExample:
            "// Authentication: кто ты\nconst session = await getSession(request);\nif (!session) return redirect('/login');\n\n// Authorization: что тебе можно\nif (session.user.role !== 'admin') {\n  return new Response('Forbidden', { status: 403 });\n}",
          interviewQuestion: "Приведите пример бага, который возникает из-за смешивания authentication и authorization.",
          interviewAnswerRu:
            "Классический пример — эндпоинт /api/orders/:id проверяет только 'пользователь залогинен', но не проверяет, принадлежит ли конкретный заказ этому пользователю. В результате любой аутентифицированный пользователь может подставить чужой id и увидеть чужой заказ (это относится к классу уязвимостей IDOR — Insecure Direct Object Reference).",
          interviewAnswerEn:
            "A classic example is an /api/orders/:id endpoint that only checks 'is the user logged in' but never checks whether this particular order belongs to that user. As a result, any authenticated user can substitute someone else's id and view their order — this falls into the IDOR (Insecure Direct Object Reference) vulnerability class.",
          pitfalls: [
            "Проверять права доступа только на фронтенде (скрывать кнопку) без проверки на бэкенде.",
            "Путать роль пользователя (role) с владением конкретным ресурсом (ownership) — это разные проверки.",
          ],
          practiceTask:
            "Опишите (в псевдокоде или реальном коде) middleware, которое сначала проверяет аутентификацию (валидный токен), а затем отдельно — авторизацию (роль admin) для доступа к /admin.",
          resources: {
            docs: [
              { title: "OWASP Top 10: Broken Access Control", url: "https://owasp.org/Top10/A01_2021-Broken_Access_Control/" },
            ],
            articles: [
              { title: "Insecure Direct Object References (IDOR) — PortSwigger", url: "https://portswigger.net/web-security/access-control/idor" },
            ],
          },
        },
      },
      {
        id: "auth-jwt-vs-session",
        title: "JWT vs Session",
        content: {
          title: "JWT vs Session",
          shortExplanation:
            "Session-based auth хранит состояние сессии на сервере и выдаёт клиенту только id сессии; JWT хранит все данные пользователя прямо в подписанном токене, не требуя хранилища на сервере.",
          detailedExplanation:
            "При session-based подходе сервер после логина создаёт запись в хранилище сессий (обычно в Redis/БД) и отдаёт клиенту session id (обычно в cookie). При каждом запросе сервер ищет сессию по этому id. При JWT-подходе сервер выдаёт клиенту подписанный токен, который сам содержит нужные данные (userId, роль, срок действия) — сервер может проверить его подпись без обращения к БД, но зато отозвать (revoke) JWT до истечения срока действия сложнее, чем удалить запись сессии.",
          codeExample:
            "// Session: сервер хранит состояние\n// cookie: sessionId=abc123 -> Redis: { userId: 42, role: 'user' }\n\n// JWT: состояние 'внутри' токена, сервер только проверяет подпись\n// cookie: token=eyJhbGciOi... -> decode -> { userId: 42, role: 'user', exp: 1234567890 }",
          interviewQuestion: "Почему отозвать JWT-токен сложнее, чем сессию в БД?",
          interviewAnswerRu:
            "Сессия хранится на сервере, поэтому для мгновенного отзыва достаточно удалить запись из хранилища — при следующем запросе сервер её просто не найдёт. JWT самодостаточен: сервер проверяет только подпись и срок действия, не обращаясь к базе, поэтому если токен скомпрометирован, он остаётся действительным до истечения exp, если не завести отдельный механизм — blacklist отозванных токенов или короткий срок жизни access-токена с refresh-токеном.",
          interviewAnswerEn:
            "A session is stored server-side, so instant revocation is just deleting that record — the next request simply won't find it. A JWT is self-contained: the server only checks its signature and expiry without hitting a database, so a compromised token stays valid until it expires unless you add an extra mechanism — a blacklist of revoked tokens, or a short-lived access token paired with a refresh token.",
          pitfalls: [
            "Хранить в JWT слишком много или чувствительных данных — токен легко декодируется (не шифруется, а лишь подписывается).",
            "Делать JWT с очень долгим сроком жизни без механизма отзыва.",
          ],
          practiceTask:
            "Раскодируйте (без секретного ключа) любой реальный JWT на jwt.io и посмотрите, какие данные лежат в payload открытым текстом.",
          resources: {
            docs: [
              { title: "Introduction to JSON Web Tokens", url: "https://jwt.io/introduction" },
            ],
            articles: [
              { title: "ID Token and Access Token: What's the Difference? (Auth0)", url: "https://auth0.com/blog/id-token-access-token-what-is-the-difference/" },
            ],
          },
        },
      },
      {
        id: "auth-access-refresh-token",
        title: "Access Token / Refresh Token",
        content: {
          title: "Access Token / Refresh Token",
          shortExplanation:
            "Access token — короткоживущий токен для доступа к API; refresh token — долгоживущий токен, который используется только для получения нового access token.",
          detailedExplanation:
            "Схема с двумя токенами решает конфликт между безопасностью и удобством: короткий срок жизни access token (минуты) снижает ущерб от его утечки, а refresh token (дни/недели), который хранится более защищённо (HttpOnly cookie) и используется реже, позволяет не заставлять пользователя логиниться заново каждые несколько минут. Когда access token истекает, клиент обращается к специальному эндпоинту с refresh token и получает новую пару токенов.",
          codeExample:
            "// Access token живёт 15 минут, используется в каждом запросе\nAuthorization: Bearer <access_token>\n\n// Когда access token истёк -> запрос на обновление\nPOST /auth/refresh\nCookie: refreshToken=<refresh_token> (HttpOnly)\n-> { accessToken: '<new_access_token>' }",
          interviewQuestion: "Зачем нужны два токена вместо одного долгоживущего?",
          interviewAnswerRu:
            "Один долгоживущий токен — это большой риск: если он утечёт, злоумышленник получает доступ на весь срок его жизни. Короткий access token минимизирует окно атаки, а refresh token, который используется редко и хранится в защищённом месте (HttpOnly, Secure cookie), даёт возможность обновлять access token без повторного логина, сохраняя баланс между безопасностью и удобством пользователя.",
          interviewAnswerEn:
            "A single long-lived token is a big risk: if it leaks, an attacker gets access for its entire lifetime. A short-lived access token minimizes that attack window, while a refresh token — used rarely and stored somewhere protected (an HttpOnly, Secure cookie) — lets the client get a new access token without forcing the user to log in again, balancing security and user convenience.",
          pitfalls: [
            "Хранить refresh token в localStorage — он становится доступен для чтения через XSS.",
            "Не реализовывать отзыв refresh token (например, при logout или подозрительной активности).",
          ],
          practiceTask:
            "Опишите (в псевдокоде) клиентский interceptor, который при получении 401 от API автоматически пытается обновить access token через refresh token и повторяет исходный запрос один раз.",
          resources: {
            docs: [
              { title: "Introduction to JSON Web Tokens", url: "https://jwt.io/introduction" },
            ],
            articles: [
              { title: "What Are Refresh Tokens and How to Use Them Securely (Auth0)", url: "https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/" },
              { title: "ID Token and Access Token: What's the Difference? (Auth0)", url: "https://auth0.com/blog/id-token-access-token-what-is-the-difference/" },
            ],
          },
        },
      },
      {
        id: "auth-httponly-cookies",
        title: "HttpOnly Cookies",
        content: {
          title: "HttpOnly Cookies",
          shortExplanation:
            "HttpOnly cookie — cookie, недоступная из JavaScript (document.cookie), что защищает её от кражи через XSS-атаки.",
          detailedExplanation:
            "Обычные cookie и данные в localStorage доступны любому JS-коду на странице — если на сайте есть XSS-уязвимость (внедрение чужого скрипта), злоумышленник может прочитать токен и отправить его себе. Флаг HttpOnly запрещает браузеру давать доступ к такой cookie через JavaScript — она видна только в HTTP-заголовках при запросах к серверу. В сочетании с флагами Secure (только HTTPS) и SameSite (защита от CSRF) это один из базовых способов защиты токенов аутентификации.",
          codeExample:
            "Set-Cookie: refreshToken=abc123; HttpOnly; Secure; SameSite=Strict; Path=/auth\n\n// В браузере:\ndocument.cookie; // 'refreshToken' здесь не будет виден вообще",
          interviewQuestion: "Почему токен аутентификации лучше хранить в HttpOnly cookie, а не в localStorage?",
          interviewAnswerRu:
            "localStorage полностью доступен из JavaScript, поэтому при любой XSS-уязвимости на сайте злоумышленник может прочитать токен и украсть сессию пользователя. HttpOnly cookie не читается из JS вообще, поэтому даже при успешной XSS-атаке украсть сам токен напрямую не получится — браузер сам прикрепляет cookie к запросам к нужному домену.",
          interviewAnswerEn:
            "localStorage is fully accessible from JavaScript, so any XSS vulnerability on the site lets an attacker read the token and hijack the user's session. An HttpOnly cookie can't be read from JS at all, so even a successful XSS attack can't directly steal the token itself — the browser attaches the cookie to requests to the right domain automatically.",
          pitfalls: [
            "Считать HttpOnly cookie полной защитой от всего — она не защищает от CSRF без дополнительного SameSite/CSRF-токена.",
            "Хранить в localStorage 'просто для удобства чтения на клиенте' токены, которые должны быть защищены.",
          ],
          practiceTask:
            "Настройте простой Express/Next.js эндпоинт логина, который ставит refreshToken как HttpOnly, Secure, SameSite=Strict cookie, и проверьте в DevTools, что document.cookie её не показывает.",
          resources: {
            docs: [
              { title: "Using HTTP Cookies — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" },
            ],
            articles: [
              { title: "Secure Cookie Configuration — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies" },
            ],
          },
        },
      },
      {
        id: "auth-xss-csrf-cors",
        title: "XSS / CSRF / CORS",
        content: {
          title: "XSS / CSRF / CORS",
          shortExplanation:
            "XSS — внедрение чужого JS-кода на страницу; CSRF — выполнение нежелательного действия от имени залогиненного пользователя; CORS — механизм браузера, ограничивающий, какие сайты могут делать запросы к вашему API.",
          detailedExplanation:
            "XSS (Cross-Site Scripting) возникает, когда приложение вставляет непроверенный пользовательский ввод в DOM как исполняемый код — атакующий может выполнить свой JS в контексте вашего сайта. CSRF (Cross-Site Request Forgery) эксплуатирует то, что браузер автоматически прикладывает cookie к запросам — вредоносный сайт заставляет браузер жертвы отправить запрос на ваш API, используя её действующую сессию. CORS — это не уязвимость, а защитный механизм браузера: он не даёт JS-коду с одного origin читать ответы от API на другом origin, если сервер явно это не разрешил через заголовки.",
          codeExample:
            "// XSS-уязвимость: вставка непроверенного HTML\nelement.innerHTML = userInput; // опасно\n\n// Защита от CSRF: SameSite cookie + CSRF-токен в форме\nSet-Cookie: session=xyz; SameSite=Strict\n\n// CORS: сервер явно разрешает конкретный origin\nAccess-Control-Allow-Origin: https://myapp.com",
          interviewQuestion: "Защищает ли CORS ваш API от атак из других приложений (например, curl или Postman)?",
          interviewAnswerRu:
            "Нет. CORS — это ограничение, которое соблюдают только браузеры при выполнении JS-запросов с одной страницы к другому origin. Он никак не мешает прямому запросу через curl, Postman или серверный код — там просто нет браузерного движка, который проверяет CORS-заголовки. Поэтому CORS не заменяет настоящую аутентификацию и авторизацию на сервере, это просто defense для сценария 'чужой сайт делает запрос через браузер жертвы'.",
          interviewAnswerEn:
            "No. CORS is a restriction enforced only by browsers when JavaScript on one page tries to call another origin. It does nothing to stop a direct request via curl, Postman, or server-side code — there's no browser engine there to check CORS headers. So CORS is not a substitute for real server-side authentication and authorization; it's defense specifically for the 'another site makes a request through the victim's browser' scenario.",
          pitfalls: [
            "Считать, что настройка CORS = защита API — это не так, нужны отдельные проверки auth на сервере.",
            "Вставлять пользовательский контент через dangerouslySetInnerHTML/innerHTML без санитизации.",
          ],
          practiceTask:
            "Найдите в своём (или учебном) проекте все места, где пользовательский ввод вставляется в DOM напрямую, и проверьте, есть ли санитизация (например, через DOMPurify).",
          resources: {
            docs: [
              { title: "Types of Cross-Site Scripting — OWASP", url: "https://owasp.org/www-community/Types_of_Cross-Site_Scripting" },
            ],
            articles: [
              { title: "Cross-Site Request Forgery (CSRF) — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF" },
              { title: "Cross-Origin Resource Sharing (CORS) — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS" },
            ],
          },
        },
      },
    ],
  },

  // ---------------------------------------------------------------------
  // PERFORMANCE
  // ---------------------------------------------------------------------
  {
    id: "performance",
    title: "Performance",
    subtopics: [
      {
        id: "perf-core-web-vitals",
        title: "Core Web Vitals",
        content: {
          title: "Core Web Vitals",
          shortExplanation:
            "Core Web Vitals — набор метрик Google, которые измеряют реальный пользовательский опыт загрузки и отклика страницы: LCP, INP (ранее FID) и CLS.",
          detailedExplanation:
            "LCP (Largest Contentful Paint) — время появления самого крупного видимого элемента (обычно герой-картинка или заголовок), показывает воспринимаемую скорость загрузки. INP (Interaction to Next Paint) — задержка между действием пользователя и визуальным откликом интерфейса, показывает отзывчивость. CLS (Cumulative Layout Shift) — суммарная 'прыгучесть' layout во время загрузки (например, картинка без заданных размеров сдвигает текст ниже). Эти метрики влияют и на реальный UX, и на ранжирование в поиске Google.",
          codeExample:
            "// Пример ухудшения CLS: картинка без размеров\n<img src='/banner.jpg' /> // layout shift при загрузке\n\n// Исправление: явные размеры или aspect-ratio\n<img src='/banner.jpg' width={1200} height={400} />",
          interviewQuestion: "Как можно улучшить LCP на типичной странице с герой-изображением?",
          interviewAnswerRu:
            "Основные способы: отдавать изображение в современном формате (WebP/AVIF) и правильном размере, использовать preload для критичного изображения, избегать блокирующих рендер скриптов и шрифтов перед ним, использовать SSR/статическую генерацию вместо чистого CSR, чтобы контент был в HTML сразу, а не появлялся после загрузки JS.",
          interviewAnswerEn:
            "Key techniques: serve the image in a modern format (WebP/AVIF) at the right size, preload the critical image, avoid render-blocking scripts and fonts ahead of it, and use SSR or static generation instead of pure CSR so the content is already in the HTML instead of appearing only after JS loads.",
          pitfalls: [
            "Оптимизировать метрики 'на глаз' без измерения через Lighthouse/PageSpeed Insights/реальные данные пользователей (CrUX).",
            "Не задавать размеры изображениям и блокам, зависящим от асинхронных данных — это портит CLS.",
          ],
          practiceTask:
            "Прогоните любую свою страницу через Lighthouse (в DevTools) и запишите значения LCP, INP/TBT и CLS, затем внесите одно улучшение и замерьте разницу.",
          resources: {
            docs: [
              { title: "Web Vitals — web.dev", url: "https://web.dev/articles/vitals" },
            ],
            articles: [
              { title: "Optimize Largest Contentful Paint — web.dev", url: "https://web.dev/articles/optimize-lcp" },
            ],
          },
        },
      },
      {
        id: "perf-critical-rendering-path",
        title: "Critical Rendering Path",
        content: {
          title: "Critical Rendering Path",
          shortExplanation:
            "Critical Rendering Path — последовательность шагов браузера от получения HTML/CSS/JS до отрисовки пикселей на экране.",
          detailedExplanation:
            "Путь примерно такой: браузер парсит HTML в DOM, парсит CSS в CSSOM, объединяет их в Render Tree, вычисляет Layout (геометрию каждого элемента) и делает Paint (закрашивание пикселей), а затем при наличии слоёв — Composite. CSS считается 'render-blocking' по умолчанию — браузер не покажет страницу, пока не получит и не обработает весь CSS в <head>. JS может как блокировать парсинг HTML (обычный <script> без defer/async), так и не блокировать (defer, async, или скрипты в конце body).",
          codeExample:
            "<!-- Блокирует парсинг HTML до полной загрузки и выполнения -->\n<script src='/heavy.js'></script>\n\n<!-- Не блокирует парсинг, выполняется после него, в порядке подключения -->\n<script src='/heavy.js' defer></script>",
          interviewQuestion: "Почему CSS в <head> считается 'блокирующим рендер', а defer-скрипт — нет?",
          interviewAnswerRu:
            "Браузер не может корректно построить Render Tree и начать отрисовку, пока не знает все стили — иначе пришлось бы перерисовывать страницу по мере догрузки CSS, что визуально дёргалось бы. Поэтому CSS в <head> блокирует первый рендер по умолчанию. Скрипт с defer, наоборот, явно говорит браузеру: 'не жди меня, продолжай парсить HTML, а выполни меня после того, как DOM будет готов' — поэтому он не блокирует построение страницы.",
          interviewAnswerEn:
            "The browser can't correctly build the render tree and start painting until it knows all the styles — otherwise the page would have to repaint as CSS keeps arriving, causing visible jank. That's why CSS in <head> blocks the first render by default. A script with defer, on the other hand, explicitly tells the browser 'don't wait for me, keep parsing the HTML, and run me once the DOM is ready' — so it doesn't block page construction.",
          pitfalls: [
            "Подключать большие CSS/JS-файлы без async/defer и без разделения на критичные и некритичные части.",
            "Не учитывать, что 'блокирующий' скрипт в середине HTML останавливает парсинг именно в этом месте документа.",
          ],
          practiceTask:
            "Откройте вкладку Performance в DevTools, перезагрузите страницу и найдите на таймлайне этапы Parse HTML, Recalculate Style, Layout и Paint.",
          resources: {
            docs: [
              { title: "Critical Rendering Path — web.dev", url: "https://web.dev/articles/critical-rendering-path" },
            ],
            articles: [
              { title: "Rendering Performance — web.dev", url: "https://web.dev/articles/rendering-performance" },
            ],
          },
        },
      },
      {
        id: "perf-reflow-repaint",
        title: "Reflow / Repaint",
        content: {
          title: "Reflow / Repaint",
          shortExplanation:
            "Reflow (layout) — пересчёт геометрии и положения элементов на странице; repaint — перерисовка пикселей без изменения геометрии (например, смена цвета).",
          detailedExplanation:
            "Reflow происходит, когда меняется что-то, влияющее на размеры или позицию элементов (изменение width/height, добавление/удаление DOM-узла, изменение шрифта) — браузеру приходится заново вычислять layout всего затронутого поддерева, а иногда и всей страницы. Repaint — более дешёвая операция: меняются только визуальные свойства (color, background, visibility), геометрия остаётся прежней. Чтение layout-свойств (offsetWidth, getBoundingClientRect) сразу после их изменения в цикле вызывает 'layout thrashing' — многократный принудительный пересчёт вместо одного.",
          codeExample:
            "// Плохо: layout thrashing — чтение и запись чередуются в цикле\nitems.forEach(item => {\n  item.style.width = item.offsetWidth + 10 + 'px'; // read, потом write, каждый раз\n});\n\n// Лучше: сначала все чтения, потом все записи\nconst widths = items.map(item => item.offsetWidth);\nitems.forEach((item, i) => { item.style.width = widths[i] + 10 + 'px'; });",
          interviewQuestion: "Что такое layout thrashing и как его избежать?",
          interviewAnswerRu:
            "Layout thrashing — это ситуация, когда код многократно чередует чтение layout-свойств (offsetWidth, getBoundingClientRect) и их изменение в цикле. Каждое такое чтение после изменения заставляет браузер синхронно пересчитать layout, вместо того чтобы сделать это один раз в конце кадра. Решение — разделить фазы: сначала прочитать все нужные значения, затем применить все изменения (или использовать requestAnimationFrame и батчинг через библиотеки/React).",
          interviewAnswerEn:
            "Layout thrashing happens when code repeatedly alternates between reading layout properties (offsetWidth, getBoundingClientRect) and mutating them inside a loop. Each such read right after a write forces the browser to synchronously recompute layout, instead of doing it once at the end of the frame. The fix is to separate the phases: read all the values you need first, then apply all the mutations (or use requestAnimationFrame and batching via a library or React).",
          pitfalls: [
            "Чередовать чтение и запись layout-свойств в циклах над списком DOM-узлов.",
            "Часто менять inline-стили в анимациях вместо использования transform/opacity, которые обычно избегают reflow.",
          ],
          practiceTask:
            "Воспроизведите layout thrashing на списке из 200 div-ов (чтение offsetWidth сразу после записи в цикле), замерьте время через Performance.now(), затем перепишите с разделением read/write фаз и сравните.",
          resources: {
            docs: [
              { title: "Reflow — MDN Glossary", url: "https://developer.mozilla.org/en-US/docs/Glossary/Reflow" },
            ],
            articles: [
              { title: "Avoid Large, Complex Layouts and Layout Thrashing — web.dev", url: "https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing" },
              { title: "What Forces Layout / Reflow (Paul Irish)", url: "https://gist.github.com/paulirish/5d52fb081b3570c81e3a" },
            ],
          },
        },
      },
      {
        id: "perf-bundle-optimization",
        title: "Bundle Optimization",
        content: {
          title: "Bundle Optimization",
          shortExplanation:
            "Bundle optimization — набор техник для уменьшения размера JS/CSS, которые браузер должен скачать и выполнить перед тем, как страница станет интерактивной.",
          detailedExplanation:
            "Основные техники: code splitting (разбиение бандла на части, которые грузятся по требованию — например, по маршрутам или через dynamic import), tree shaking (удаление неиспользуемого кода при сборке, требует ES-модулей и 'чистых' библиотек без побочных эффектов на верхнем уровне), lazy loading тяжёлых компонентов и библиотек, анализ состава бандла (bundle analyzer) для поиска неожиданно тяжёлых зависимостей.",
          codeExample:
            "// Code splitting через dynamic import — этот код попадёт в отдельный чанк\nconst HeavyChart = dynamic(() => import('./HeavyChart'), { ssr: false });\n\n// Использование только нужной части библиотеки вместо всей\nimport debounce from 'lodash/debounce'; // вместо import _ from 'lodash'",
          interviewQuestion: "Чем tree shaking отличается от code splitting?",
          interviewAnswerRu:
            "Tree shaking убирает из финального бандла код, который вообще нигде не используется (мёртвый код) — это происходит на этапе сборки автоматически, если позволяет структура импортов. Code splitting не удаляет код, а разбивает используемый код на несколько файлов (чанков), которые загружаются не все сразу, а по мере необходимости — например, код страницы /admin грузится, только когда пользователь реально туда переходит.",
          interviewAnswerEn:
            "Tree shaking removes code from the final bundle that isn't used anywhere at all (dead code) — this happens automatically at build time if the import structure allows it. Code splitting doesn't remove code; it splits code that is used into multiple chunks that load on demand rather than all at once — for example, the /admin page's code only loads once the user actually navigates there.",
          pitfalls: [
            "Импортировать библиотеку целиком (import _ from 'lodash') там, где нужна одна функция.",
            "Не проверять реальный состав бандла через анализатор и не замечать случайно попавшую туда тяжёлую зависимость.",
          ],
          practiceTask:
            "Подключите @next/bundle-analyzer к проекту, соберите билд и найдите три самых тяжёлых пакета в клиентском бандле.",
          resources: {
            docs: [
              { title: "Lazy Loading Components and Libraries — Next.js Docs", url: "https://nextjs.org/docs/app/guides/lazy-loading" },
            ],
            articles: [
              { title: "Reduce JavaScript Payloads with Code Splitting — web.dev", url: "https://web.dev/articles/reduce-javascript-payloads-with-code-splitting" },
            ],
          },
        },
      },
      {
        id: "perf-image-optimization",
        title: "Image Optimization",
        content: {
          title: "Image Optimization",
          shortExplanation:
            "Оптимизация изображений — уменьшение их размера и правильная загрузка (формат, размер под устройство, ленивая загрузка), поскольку картинки часто самый тяжёлый ресурс страницы.",
          detailedExplanation:
            "Ключевые техники: использование современных форматов (WebP, AVIF) с меньшим весом при том же качестве, responsive images (разные размеры для разных экранов через srcset или встроенный next/image), lazy loading изображений вне первого экрана (loading='lazy'), явное указание width/height или aspect-ratio для предотвращения layout shift, приоритетная загрузка (preload/priority) для LCP-изображения. В Next.js компонент next/image делает большинство этого автоматически.",
          codeExample:
            "import Image from 'next/image';\n\n<Image\n  src='/hero.jpg'\n  alt='Hero'\n  width={1200}\n  height={600}\n  priority // не откладывать загрузку — это LCP-изображение\n/>",
          interviewQuestion: "Почему next/image по умолчанию делает изображения lazy, и когда это нужно отключать?",
          interviewAnswerRu:
            "По умолчанию next/image откладывает загрузку изображений, которые не видны в первом экране (viewport), чтобы не тратить пропускную способность на контент, который пользователь может и не увидеть — это ускоряет загрузку видимой части страницы. Но если изображение и есть тот самый LCP-элемент (например, герой-баннер), его наоборот нужно грузить с максимальным приоритетом — для этого используется проп priority, который отключает lazy loading и добавляет preload.",
          interviewAnswerEn:
            "By default next/image defers loading images that aren't visible in the initial viewport, so bandwidth isn't spent on content the user might never scroll to — this speeds up loading of the visible part of the page. But if an image is itself the LCP element (e.g. a hero banner), it needs to load with the highest priority instead — that's what the priority prop is for: it disables lazy loading and adds a preload hint.",
          pitfalls: [
            "Ставить priority на все изображения на странице — это возвращает проблему, которую lazy loading должен был решить.",
            "Не указывать width/height у next/image, из-за чего пропадает автоматическая защита от layout shift.",
          ],
          practiceTask:
            "Замените обычный <img> на next/image на тестовой странице, задайте priority только герой-картинке, а остальным оставьте lazy по умолчанию, и сравните LCP до/после.",
          resources: {
            docs: [
              { title: "Image Component — Next.js Docs", url: "https://nextjs.org/docs/app/api-reference/components/image" },
            ],
            articles: [
              { title: "Serve Responsive Images — web.dev", url: "https://web.dev/articles/serve-responsive-images" },
            ],
          },
        },
      },
    ],
  },

  // ---------------------------------------------------------------------
  // PRACTICE TASKS
  // ---------------------------------------------------------------------
  {
    id: "practice-tasks",
    title: "Practice Tasks",
    subtopics: [
      {
        id: "practice-use-debounce",
        title: "useDebounce",
        content: {
          title: "useDebounce",
          shortExplanation:
            "Debounce откладывает выполнение функции, пока не пройдёт заданная пауза без новых вызовов — полезно для поиска по мере ввода текста.",
          detailedExplanation:
            "Классическая задача на понимание таймеров и хуков. useDebounce(value, delay) должен возвращать 'отложенную' версию значения: при каждом изменении value запускается новый таймер на delay миллисекунд, а предыдущий таймер отменяется. Только если пользователь перестал печатать на delay миллисекунд, хук вернёт новое значение — это снижает число сетевых запросов при поиске 'по мере ввода'.",
          codeExample:
            "function useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n}",
          interviewQuestion: "Чем debounce отличается от throttle?",
          interviewAnswerRu:
            "Debounce откладывает вызов до тех пор, пока не наступит пауза нужной длины между событиями — если события идут непрерывно, вызова вообще не будет, пока поток не прервётся. Throttle, наоборот, гарантирует вызов не чаще, чем раз в N миллисекунд, независимо от того, продолжаются события или нет.",
          interviewAnswerEn:
            "Debounce delays the call until there's been a pause of the required length between events — if events keep firing continuously, the call never happens until the stream stops. Throttle, in contrast, guarantees a call at most once every N milliseconds, regardless of whether events keep coming or not.",
          pitfalls: [
            "Забывать очищать предыдущий таймер (clearTimeout) — накапливаются лишние отложенные вызовы.",
            "Дебаунсить сам обработчик события вместо значения — усложняет тестирование и переиспользование.",
          ],
          practiceTask:
            "Реализуйте поле поиска, которое делает 'запрос' (например, console.log) только через 400мс после того, как пользователь прекратил печатать.",
          resources: {
            docs: [
              { title: "useDebounceValue — usehooks-ts", url: "https://usehooks-ts.com/react-hook/use-debounce-value" },
            ],
            articles: [
              { title: "Debouncing and Throttling Explained Through Examples — CSS-Tricks", url: "https://css-tricks.com/debouncing-throttling-explained-examples/" },
            ],
          },
        },
      },
      {
        id: "practice-use-throttle",
        title: "useThrottle",
        content: {
          title: "useThrottle",
          shortExplanation:
            "Throttle гарантирует, что функция вызывается не чаще одного раза за заданный интервал, независимо от частоты событий.",
          detailedExplanation:
            "Полезно для событий, которые срабатывают очень часто (scroll, resize, mousemove), когда обрабатывать каждое событие дорого, но и полностью откладывать реакцию (как в debounce) нежелательно — пользователю нужна обратная связь 'по ходу' действия, просто не на каждый пиксель. Реализация обычно хранит 'последний вызов был в момент X' и игнорирует новые вызовы, пока не пройдёт интервал.",
          codeExample:
            "function useThrottle<T>(value: T, interval: number): T {\n  const [throttled, setThrottled] = useState(value);\n  const lastRan = useRef(Date.now());\n  useEffect(() => {\n    const id = setTimeout(() => {\n      if (Date.now() - lastRan.current >= interval) {\n        setThrottled(value);\n        lastRan.current = Date.now();\n      }\n    }, interval - (Date.now() - lastRan.current));\n    return () => clearTimeout(id);\n  }, [value, interval]);\n  return throttled;\n}",
          interviewQuestion: "Какой случай использования лучше подходит для throttle, а не debounce?",
          interviewAnswerRu:
            "Обработка скролла для показа/скрытия шапки сайта или подгрузки контента при бесконечном скролле — здесь нужна регулярная, но не слишком частая реакция во время самого процесса скролла. Debounce в этом случае сработал бы только после того, как пользователь перестал скроллить, что не подходит для 'живой' реакции интерфейса.",
          interviewAnswerEn:
            "Handling scroll to show/hide a sticky header or to load more content for infinite scroll — this needs a regular but not too-frequent reaction while scrolling is actually happening. Debounce would only fire after the user stops scrolling, which doesn't work for a 'live' interface reaction.",
          pitfalls: [
            "Использовать throttle там, где на самом деле нужен debounce (например, для инпута поиска) — интерфейс будет делать лишние запросы.",
            "Забывать про 'последний' пропущенный вызов в конце серии событий — иногда нужно гарантированно обработать финальное значение.",
          ],
          practiceTask:
            "Реализуйте индикатор прогресса чтения статьи, который обновляется по scroll не чаще раза в 100мс.",
          resources: {
            docs: [
              { title: "useDebounceValue — usehooks-ts", url: "https://usehooks-ts.com/react-hook/use-debounce-value" },
            ],
            articles: [
              { title: "Debouncing and Throttling Explained Through Examples — CSS-Tricks", url: "https://css-tricks.com/debouncing-throttling-explained-examples/" },
            ],
          },
        },
      },
      {
        id: "practice-use-local-storage",
        title: "useLocalStorage",
        content: {
          title: "useLocalStorage",
          shortExplanation:
            "Хук, который синхронизирует React state с localStorage: читает значение при инициализации и сохраняет его при каждом изменении.",
          detailedExplanation:
            "Задача проверяет понимание работы с побочными эффектами, сериализации (JSON.stringify/parse) и обработки ошибок (localStorage может быть недоступен, значение — повреждённым JSON). Хорошая реализация лениво читает начальное значение (через функцию в useState, а не при каждом рендере), безопасно обрабатывает JSON.parse, и оборачивает setter, чтобы одновременно обновлять state и localStorage.",
          codeExample:
            "function useLocalStorage<T>(key: string, initialValue: T) {\n  const [value, setValue] = useState<T>(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? (JSON.parse(item) as T) : initialValue;\n    } catch {\n      return initialValue;\n    }\n  });\n\n  useEffect(() => {\n    window.localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue] as const;\n}",
          interviewQuestion: "Почему начальное значение из localStorage лучше читать через функцию в useState, а не напрямую?",
          interviewAnswerRu:
            "useState(() => computeInitial()) — 'ленивая инициализация' — вызывает функцию только один раз, при первом рендере. Если написать useState(computeInitial()), выражение computeInitial() будет вычисляться при каждом рендере компонента (хотя результат используется только в первом), что означает лишнее обращение к localStorage и JSON.parse на каждый ре-рендер.",
          interviewAnswerEn:
            "useState(() => computeInitial()) — lazy initialization — calls the function only once, on the first render. Writing useState(computeInitial()) instead means computeInitial() gets evaluated on every render of the component (even though the result is only used on the first one), causing an unnecessary localStorage read and JSON.parse on every re-render.",
          pitfalls: [
            "Не оборачивать JSON.parse в try/catch — повреждённые данные в localStorage уронят приложение.",
            "Читать localStorage без проверки typeof window !== 'undefined' в SSR-окружении (Next.js).",
          ],
          practiceTask:
            "Используйте useLocalStorage для сохранения выбранной темы (light/dark) и проверьте, что значение переживает перезагрузку страницы.",
          resources: {
            docs: [
              { title: "Window: localStorage — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" },
            ],
            articles: [
              { title: "useLocalStorage — usehooks-ts", url: "https://usehooks-ts.com/react-hook/use-local-storage" },
            ],
          },
        },
      },
      {
        id: "practice-use-fetch",
        title: "useFetch",
        content: {
          title: "useFetch",
          shortExplanation:
            "Простой хук для загрузки данных с сервера с состояниями loading/error/data — учебный аналог того, что решают библиотеки вроде TanStack Query.",
          detailedExplanation:
            "Задача помогает понять, из чего 'состоит' любая библиотека для работы с данными: нужно отслеживать три состояния (загрузка, ошибка, данные), корректно обрабатывать отмену запроса при размонтировании компонента или смене url (через AbortController), и избегать race condition — если url поменялся до того, как пришёл первый ответ, нужно проигнорировать устаревший ответ.",
          codeExample:
            "function useFetch<T>(url: string) {\n  const [state, setState] = useState<{ data: T | null; error: string | null; loading: boolean }>(\n    { data: null, error: null, loading: true }\n  );\n\n  useEffect(() => {\n    const controller = new AbortController();\n    setState(s => ({ ...s, loading: true }));\n\n    fetch(url, { signal: controller.signal })\n      .then(res => res.json())\n      .then(data => setState({ data, error: null, loading: false }))\n      .catch(err => {\n        if (err.name !== 'AbortError') {\n          setState({ data: null, error: err.message, loading: false });\n        }\n      });\n\n    return () => controller.abort();\n  }, [url]);\n\n  return state;\n}",
          interviewQuestion: "Как этот хук защищается от race condition при быстрой смене url?",
          interviewAnswerRu:
            "Через AbortController: при каждом изменении url useEffect сначала создаёт новый controller, а функция очистки предыдущего эффекта вызывает controller.abort() для отменённого запроса. Это не только экономит сеть, но и гарантирует, что устаревший ответ (например, от старого поискового запроса) не перезапишет более новые данные в state.",
          interviewAnswerEn:
            "Via AbortController: each time url changes, the effect creates a new controller, and the cleanup function of the previous effect calls controller.abort() on the outdated request. This not only saves bandwidth but also guarantees that a stale response (say, from an earlier search query) can't overwrite newer data in state.",
          pitfalls: [
            "Не отменять предыдущий запрос при смене url — race condition может показать устаревшие данные как актуальные.",
            "Забывать проверять err.name === 'AbortError', из-за чего отменённый запрос ошибочно показывается как реальная ошибка.",
          ],
          practiceTask:
            "Постройте инпут поиска, который дергает useFetch(`/api/search?q=${query}`) при каждом изменении query, и убедитесь, что быстрые повторные вводы не приводят к 'миганию' старых результатов.",
          resources: {
            docs: [
              { title: "AbortController — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController" },
            ],
            articles: [
              { title: "Using Promises — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises" },
            ],
          },
        },
      },
      {
        id: "practice-promise-all",
        title: "Promise.all",
        content: {
          title: "Promise.all",
          shortExplanation:
            "Promise.all запускает несколько промисов параллельно и ждёт, пока выполнятся все — если хотя бы один отклонится, весь Promise.all сразу отклоняется.",
          detailedExplanation:
            "Это одна из базовых задач на понимание асинхронности в JS. Важно понимать разницу с последовательным await в цикле: await в цикле выполняет запросы один за другим (медленнее, если они независимы), а Promise.all запускает их все сразу и ждёт самого медленного. Также стоит знать Promise.allSettled — аналог, который не 'падает' при первой ошибке, а возвращает результат по каждому промису (fulfilled или rejected).",
          codeExample:
            "// Последовательно — медленно, если запросы независимы\nconst user = await fetchUser(id);\nconst posts = await fetchPosts(id);\n\n// Параллельно — быстрее, оба запроса идут одновременно\nconst [user, posts] = await Promise.all([fetchUser(id), fetchPosts(id)]);",
          interviewQuestion: "Что произойдёт с Promise.all, если один из промисов отклонится, а остальные ещё выполняются?",
          interviewAnswerRu:
            "Promise.all сразу отклонится с причиной (reason) первого упавшего промиса, не дожидаясь остальных. Остальные промисы при этом продолжат выполняться в фоне (их нельзя 'отменить' самим Promise.all), но их результат уже никак не повлияет на итоговый результат Promise.all. Если нужно дождаться всех независимо от исхода каждого — используется Promise.allSettled.",
          interviewAnswerEn:
            "Promise.all immediately rejects with the reason of the first promise that fails, without waiting for the others. The other promises keep running in the background regardless (Promise.all itself can't cancel them), but their outcome no longer affects the overall Promise.all result. If you need to wait for all of them regardless of individual outcomes, use Promise.allSettled instead.",
          pitfalls: [
            "Использовать await в цикле для независимых запросов, теряя параллелизм без необходимости.",
            "Не обрабатывать частичный провал — если нужен результат по каждому запросу отдельно, Promise.all не подходит.",
          ],
          practiceTask:
            "Напишите функцию, которая параллельно загружает данные трёх пользователей по id через Promise.all, и отдельно — версию через Promise.allSettled, которая не падает, если один id некорректен.",
          resources: {
            docs: [
              { title: "Using Promises — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises" },
            ],
            articles: [
              { title: "Promise API — javascript.info", url: "https://javascript.info/promise-api" },
            ],
          },
        },
      },
      {
        id: "practice-deep-clone",
        title: "deepClone",
        content: {
          title: "deepClone",
          shortExplanation:
            "Глубокое клонирование создаёт полностью независимую копию объекта/массива, включая все вложенные структуры, а не просто копию верхнего уровня.",
          detailedExplanation:
            "Обычное присваивание ({ ...obj } или Object.assign) копирует только верхний уровень (shallow copy) — вложенные объекты и массивы остаются общими ссылками между оригиналом и копией. Задача deepClone проверяет умение рекурсивно обходить структуру данных, обрабатывать массивы, объекты, примитивы отдельно, и (в сложных версиях) специальные типы вроде Date, Map, Set, а также циклические ссылки.",
          codeExample:
            "function deepClone<T>(value: T, seen = new WeakMap()): T {\n  if (value === null || typeof value !== 'object') return value;\n  if (seen.has(value as object)) return seen.get(value as object);\n\n  const result: any = Array.isArray(value) ? [] : {};\n  seen.set(value as object, result);\n\n  for (const key in value) {\n    result[key] = deepClone((value as any)[key], seen);\n  }\n  return result;\n}",
          interviewQuestion: "Почему structuredClone (встроенный в браузеры) часто предпочтительнее самописного deepClone?",
          interviewAnswerRu:
            "structuredClone реализован на уровне движка и правильно обрабатывает Date, Map, Set, циклические ссылки, TypedArray и многие другие случаи 'из коробки', тогда как самописная рекурсивная реализация обычно покрывает только простые объекты и массивы и может сломаться на edge cases. Самописный deepClone стоит писать в первую очередь как учебное упражнение на рекурсию, а не как продакшн-решение.",
          interviewAnswerEn:
            "structuredClone is implemented at the engine level and correctly handles Date, Map, Set, circular references, TypedArrays, and many other cases out of the box, whereas a hand-rolled recursive implementation usually only covers plain objects and arrays and can break on edge cases. A hand-written deepClone is best treated as a recursion learning exercise rather than a production solution.",
          pitfalls: [
            "Забывать обработку циклических ссылок — рекурсия уходит в бесконечность или падает со stack overflow.",
            "Не различать массив и объект при создании результата — теряется тип структуры.",
          ],
          practiceTask:
            "Расширьте deepClone из примера так, чтобы он отдельно обрабатывал значения типа Date (клонировал как новый Date, а не как обычный объект).",
          resources: {
            docs: [
              { title: "Window: structuredClone() — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone" },
            ],
            articles: [
              { title: "Deep-copying in JavaScript using structuredClone — web.dev", url: "https://web.dev/articles/structured-clone" },
            ],
          },
        },
      },
      {
        id: "practice-group-by",
        title: "groupBy",
        content: {
          title: "groupBy",
          shortExplanation:
            "groupBy группирует элементы массива в объект по ключу, вычисляемому из каждого элемента — например, список заказов по статусу.",
          detailedExplanation:
            "Классическая задача на работу с reduce и типами (generics). Функция принимает массив и функцию получения ключа для каждого элемента, а возвращает объект, где каждый ключ — это одно из значений, а значение — массив элементов с этим ключом. Полезна на практике при подготовке данных для UI: сгруппировать задачи по статусу, заказы по дате, товары по категории.",
          codeExample:
            "function groupBy<T, K extends string | number>(\n  items: T[],\n  getKey: (item: T) => K\n): Record<K, T[]> {\n  return items.reduce((acc, item) => {\n    const key = getKey(item);\n    (acc[key] ??= []).push(item);\n    return acc;\n  }, {} as Record<K, T[]>);\n}\n\ngroupBy(orders, (o) => o.status);\n// { pending: [...], done: [...] }",
          interviewQuestion: "Как обобщить groupBy через generics, чтобы TypeScript правильно выводил тип результата?",
          interviewAnswerRu:
            "Нужно два типовых параметра: T — тип элементов массива, и K extends string | number — тип ключа группировки (ограничение нужно, потому что ключи объекта в JS/TS — это строки или числа). Тогда getKey: (item: T) => K, а возвращаемый тип — Record<K, T[]>. TypeScript выведет K автоматически из того, что реально возвращает функция getKey в месте вызова.",
          interviewAnswerEn:
            "You need two type parameters: T for the array's element type, and K extends string | number for the grouping key type (the constraint is needed because object keys in JS/TS must be strings or numbers). Then getKey: (item: T) => K, and the return type is Record<K, T[]>. TypeScript infers K automatically from whatever getKey actually returns at the call site.",
          pitfalls: [
            "Не ограничивать K типом string | number — TypeScript не даст использовать произвольный тип как ключ объекта.",
            "Мутировать исходный массив вместо создания нового объекта группировки.",
          ],
          practiceTask:
            "Сгруппируйте список пользователей по первой букве имени и по возрастной группе (например, '18-25', '26-35') с помощью одной функции groupBy.",
          resources: {
            docs: [
              { title: "Object.groupBy() — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy" },
            ],
            articles: [
              { title: "Lodash groupBy docs", url: "https://lodash.com/docs/4.17.15#groupBy" },
            ],
          },
        },
      },
      {
        id: "practice-memoize",
        title: "memoize",
        content: {
          title: "memoize",
          shortExplanation:
            "memoize — функция высшего порядка, которая кэширует результат вызова другой функции по её аргументам, чтобы не пересчитывать одно и то же дважды.",
          detailedExplanation:
            "Простая реализация хранит Map, где ключ — сериализованные аргументы (например, JSON.stringify(args)), а значение — результат вызова. При повторном вызове с теми же аргументами функция не выполняется заново, а сразу возвращается закэшированный результат. Ограничения простого подхода: сериализация аргументов через JSON.stringify не работает для функций, Map/Set, циклических структур, а кэш растёт бесконечно без стратегии вытеснения (LRU и т.п.).",
          codeExample:
            "function memoize<Args extends unknown[], R>(fn: (...args: Args) => R) {\n  const cache = new Map<string, R>();\n  return (...args: Args): R => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key)!;\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\nconst slowSquare = (n: number) => { /* тяжёлое вычисление */ return n * n; };\nconst fastSquare = memoize(slowSquare);",
          interviewQuestion: "В чём разница между memoize (обычная функция) и useMemo (React hook)?",
          interviewAnswerRu:
            "memoize — это универсальная техника кэширования результата чистой функции по её аргументам, живёт вне React и кэш существует, пока существует замыкание. useMemo — React-специфичный хук, который кэширует значение между рендерами одного конкретного компонента и пересчитывает его, когда меняются переданные зависимости; кэш живёт вместе с компонентом и очищается при его размонтировании.",
          interviewAnswerEn:
            "memoize is a general-purpose technique for caching a pure function's result by its arguments; it lives outside React and its cache persists as long as the closure exists. useMemo is a React-specific hook that caches a value across renders of one particular component and recomputes it when the given dependencies change; its cache lives with the component and is cleared when it unmounts.",
          pitfalls: [
            "Мемоизировать функции с побочными эффектами или недетерминированным результатом — кэш вернёт неправильный результат.",
            "Не ограничивать размер кэша — при большом количестве уникальных аргументов растёт утечка памяти.",
          ],
          practiceTask:
            "Замерьте время выполнения тяжёлой рекурсивной функции (например, наивный fibonacci) до и после memoize при повторных одинаковых вызовах.",
          resources: {
            docs: [
              { title: "Memoization — MDN Glossary", url: "https://developer.mozilla.org/en-US/docs/Glossary/Memoization" },
            ],
            articles: [
              { title: "Understanding useMemo and useCallback — Josh W. Comeau", url: "https://www.joshwcomeau.com/react/usememo-and-usecallback/" },
            ],
          },
        },
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Разделы в разработке (структура готова, контент будет добавлен позже)
  // ---------------------------------------------------------------------
  {
    id: "javascript",
    title: "JavaScript",
    subtopics: [
      {
        id: "js-event-loop",
        title: "Event Loop",
        content: {
          title: "Event Loop (цикл событий)",
          shortExplanation:
            "Event Loop — это механизм, который позволяет однопоточному JavaScript выполнять асинхронные операции, не блокируя основной поток.",
          detailedExplanation:
            "JavaScript выполняет код в одном потоке через call stack (стек вызовов). Асинхронные операции (таймеры, сетевые запросы, промисы) не выполняются прямо в стеке — они передаются в Web API/Node API, а их колбэки попадают в очереди задач. Есть две основные очереди: microtask queue (промисы, queueMicrotask) и macrotask queue (setTimeout, setInterval, события). Event Loop на каждой итерации сначала опустошает call stack, затем полностью очищает microtask queue, и только потом берёт одну задачу из macrotask queue — поэтому промисы всегда выполняются раньше setTimeout(fn, 0).",
          codeExample:
            "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');\n\n// Порядок вывода: 1, 4, 3, 2\n// Синхронный код -> microtasks (промисы) -> macrotasks (setTimeout)",
          interviewQuestion: "Почему Promise.resolve().then(...) выполнится раньше, чем setTimeout(fn, 0)?",
          interviewAnswerRu:
            "Потому что callback промиса попадает в microtask queue, а callback setTimeout — в macrotask queue. Event Loop после каждой синхронной операции (или macrotask) сначала полностью опустошает microtask queue и только потом переходит к следующей macrotask. Поэтому даже с нулевой задержкой setTimeout выполнится после всех уже запланированных промисов.",
          interviewAnswerEn:
            "Because a promise's callback goes into the microtask queue, while setTimeout's callback goes into the macrotask queue. After each synchronous run (or macrotask), the event loop always drains the entire microtask queue before moving on to the next macrotask. So even with a zero delay, setTimeout runs after all promises that were already scheduled.",
          pitfalls: [
            "Думать, что setTimeout(fn, 0) выполнится 'сразу же' — на деле он всегда после текущего синхронного кода и всех микрозадач.",
            "Не учитывать, что бесконечно добавляющиеся микрозадачи (например, рекурсивный .then) могут заблокировать macrotask queue и рендеринг браузера.",
          ],
          practiceTask:
            "Напишите код с несколькими console.log, setTimeout и Promise.then вперемешку и предскажите порядок вывода до запуска, затем проверьте себя.",
          resources: {
            docs: [
              { title: "JavaScript Execution Model — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model" },
            ],
            articles: [
              { title: "Tasks, microtasks, queues and schedules (Jake Archibald)", url: "https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/" },
              { title: "Event Loop: Microtasks and Macrotasks (javascript.info)", url: "https://javascript.info/event-loop" },
            ],
          },
        },
      },
      {
        id: "js-closures",
        title: "Closures",
        content: {
          title: "Closures (замыкания)",
          shortExplanation:
            "Замыкание — это функция, которая 'помнит' переменные из области видимости, в которой была создана, даже после того как эта область формально завершила выполнение.",
          detailedExplanation:
            "Каждая функция в JavaScript создаёт замыкание над лексическим окружением, в котором она объявлена. Это позволяет писать паттерны вроде фабрик функций, приватных переменных (через модульный паттерн) и каррирования. Замыкания — основа многих React-концепций: хуки, обработчики событий, кастомные хуки — всё это активно использует замыкания, поэтому баги вроде stale closure напрямую связаны с этой темой.",
          codeExample:
            "function createCounter() {\n  let count = 0; // приватная переменная, доступна только через замыкание\n  return {\n    increment: () => ++count,\n    get: () => count,\n  };\n}\n\nconst counter = createCounter();\ncounter.increment();\ncounter.increment();\nconsole.log(counter.get()); // 2",
          interviewQuestion: "Как замыкания помогают реализовать приватные переменные в JavaScript?",
          interviewAnswerRu:
            "В JavaScript нет встроенных приватных полей для обычных функций (в отличие от классов с #field), но замыкание решает эту задачу: если переменная объявлена внутри внешней функции и не возвращается напрямую, доступ к ней возможен только через функции, которые эта внешняя функция вернула (например, increment/get). Снаружи нет способа обратиться к count напрямую — только через предоставленный API.",
          interviewAnswerEn:
            "JavaScript has no built-in private fields for plain functions (unlike classes with #field), but closures solve this: if a variable is declared inside an outer function and never returned directly, it can only be accessed through the functions that outer function returned (like increment/get). There's no way to reach count directly from the outside — only through the exposed API.",
          pitfalls: [
            "Создавать замыкание внутри цикла с var и получать одно и то же значение переменной во всех колбэках (классическая ловушка var vs let).",
            "Не понимать связь между замыканиями и утечками памяти — замкнутые переменные не собираются сборщиком мусора, пока жив колбэк, который их использует.",
          ],
          practiceTask:
            "Воспроизведите классический баг: цикл for (var i = 0; ...) с setTimeout внутри, который выводит одно и то же значение i для всех итераций, затем исправьте через let или через IIFE.",
          resources: {
            docs: [
              { title: "Closures — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures" },
            ],
            articles: [
              { title: "You Don't Know JS Yet: Using Closures (Kyle Simpson)", url: "https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch7.md" },
            ],
          },
        },
      },
      {
        id: "js-prototypes",
        title: "Prototypes",
        content: {
          title: "Prototypes (прототипы)",
          shortExplanation:
            "Прототип — это объект, на который ссылается другой объект и у которого 'заимствует' свойства и методы, если не находит их у себя напрямую.",
          detailedExplanation:
            "В JavaScript у каждого объекта есть внутренняя ссылка [[Prototype]] (доступная через Object.getPrototypeOf или устаревшее __proto__) на другой объект. Когда вы обращаетесь к свойству, движок сначала ищет его на самом объекте, а если не находит — поднимается по цепочке прототипов (prototype chain), пока не найдёт свойство или не дойдёт до null. Классы в JS (class Foo {}) — это синтаксический сахар поверх той же прототипной модели: методы класса на самом деле лежат на Foo.prototype.",
          codeExample:
            "function Animal(name) {\n  this.name = name;\n}\nAnimal.prototype.speak = function () {\n  return `${this.name} makes a sound`;\n};\n\nconst dog = new Animal('Rex');\ndog.speak(); // 'Rex makes a sound' — метод найден через прототип\nObject.getPrototypeOf(dog) === Animal.prototype; // true",
          interviewQuestion: "Чем прототипное наследование отличается от классического (например, в Java)?",
          interviewAnswerRu:
            "В классическом наследовании классы — это статические шаблоны, и объект получает копию поведения класса при создании. В JavaScript наследование основано на живых ссылках: объект не копирует методы прототипа, а обращается к ним по цепочке в момент вызова. Это значит, что изменение Animal.prototype.speak после создания dog всё равно повлияет на dog.speak(), потому что dog обращается к актуальному прототипу, а не к его снимку на момент создания.",
          interviewAnswerEn:
            "In classical inheritance, classes are static blueprints, and an object receives a copy of the class's behavior at creation time. JavaScript's inheritance is based on live references: an object doesn't copy the prototype's methods, it looks them up along the chain at call time. That means changing Animal.prototype.speak after dog was created still affects dog.speak(), because dog looks up the current prototype, not a snapshot taken at creation.",
          pitfalls: [
            "Путать class-синтаксис с 'настоящими' классами других языков — под капотом это всё равно прототипы.",
            "Модифицировать встроенные прототипы (Array.prototype, Object.prototype) — считается плохой практикой и может сломать сторонний код.",
          ],
          practiceTask:
            "Реализуйте наследование без class-синтаксиса: создайте Dog.prototype = Object.create(Animal.prototype) и переопределите speak в Dog.prototype, вызывая родительский метод через Animal.prototype.speak.call(this).",
          resources: {
            docs: [
              { title: "Inheritance and the Prototype Chain — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain" },
            ],
            articles: [
              { title: "Prototypal Inheritance (javascript.info)", url: "https://javascript.info/prototype-inheritance" },
            ],
          },
        },
      },
      {
        id: "js-this",
        title: "this",
        content: {
          title: "this",
          shortExplanation:
            "this — это специальное значение внутри функции, которое указывает на объект, в контексте которого функция была вызвана, а не на то, где она была объявлена.",
          detailedExplanation:
            "Значение this определяется способом вызова функции, а не местом её объявления (кроме стрелочных функций). Основные правила: при вызове как метода объекта (obj.method()) this — это obj; при обычном вызове функции (fn()) this — undefined в strict mode или глобальный объект иначе; при вызове через call/apply/bind this задаётся явно; стрелочные функции не имеют своего this — они берут его из внешнего (лексического) окружения, в котором были объявлены. Именно поэтому стрелочные функции так удобны для колбэков внутри методов классов и React-компонентов.",
          codeExample:
            "const obj = {\n  name: 'obj',\n  regular() { return this.name; },\n  arrow: () => this?.name, // берёт this из внешнего окружения, не из obj\n};\n\nconst { regular } = obj;\nregular(); // undefined или ошибка — потерян контекст вызова\nobj.regular(); // 'obj' — вызван как метод obj",
          interviewQuestion: "Почему this 'теряется', когда метод объекта передают как колбэк (например, в setTimeout)?",
          interviewAnswerRu:
            "Потому что this определяется на момент вызова функции, а не на момент её объявления или извлечения из объекта. Когда вы пишете setTimeout(obj.regular, 1000), вы передаёте только саму функцию, оторванную от obj, и вызывается она уже как обычная функция, без привязки к объекту — поэтому this внутри неё не будет obj. Исправить можно через .bind(obj), обёртку в стрелочную функцию (() => obj.regular()), или объявив метод как стрелочную функцию-свойство класса.",
          interviewAnswerEn:
            "Because this is determined at call time, not at the point where the function was declared or pulled off an object. When you write setTimeout(obj.regular, 1000), you're passing just the bare function, detached from obj, and it later gets called as a plain function with no binding to the object — so this inside it won't be obj. Fixes: .bind(obj), wrapping it in an arrow function (() => obj.regular()), or declaring the method as an arrow-function class property.",
          pitfalls: [
            "Передавать метод объекта как колбэк напрямую (onClick={obj.method}) без bind или обёртки в React-коде на классах.",
            "Использовать обычную function для колбэка там, где нужен this из внешнего окружения — тогда лучше подходит стрелочная функция.",
          ],
          practiceTask:
            "Создайте объект с методом, который использует this, передайте этот метод в setTimeout напрямую и понаблюдайте за ошибкой, затем исправьте тремя разными способами (bind, стрелочная обёртка, arrow-свойство).",
          resources: {
            docs: [
              { title: "this — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this" },
            ],
            articles: [
              { title: "Understanding JavaScript Function Invocation and \"this\" (Yehuda Katz)", url: "https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/" },
            ],
          },
        },
      },
      {
        id: "js-promises-async",
        title: "Promises & async/await",
        content: {
          title: "Promises & async/await",
          shortExplanation:
            "Promise — объект, представляющий результат асинхронной операции в будущем; async/await — синтаксический сахар, который позволяет писать асинхронный код в стиле, похожем на синхронный.",
          detailedExplanation:
            "Promise может находиться в одном из трёх состояний: pending (в ожидании), fulfilled (выполнен успешно) или rejected (завершён с ошибкой), и это состояние можно изменить только один раз. async-функция всегда возвращает Promise, а await 'приостанавливает' выполнение функции до того, как промис выполнится, разворачивая его результат — при этом сама async-функция не блокирует остальной код, потому что она асинхронна целиком. Обработка ошибок в async/await идёт через обычный try/catch, что часто удобнее, чем цепочка .then/.catch.",
          codeExample:
            "async function loadUser(id) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    if (!response.ok) throw new Error('Network error');\n    const user = await response.json();\n    return user;\n  } catch (error) {\n    console.error('Failed to load user:', error);\n    throw error;\n  }\n}",
          interviewQuestion: "Что произойдёт, если внутри async-функции забыть await перед промисом?",
          interviewAnswerRu:
            "Функция не будет ждать завершения этого промиса — код продолжит выполняться дальше немедленно, а сам промис останется 'висеть' в фоне. Если это была операция с побочным эффектом (например, запись в БД), она всё равно выполнится, но код, идущий после, может завершиться раньше, чем эта операция закончится, и любая ошибка внутри непойманного промиса приведёт к unhandled promise rejection, а не будет поймана внешним try/catch.",
          interviewAnswerEn:
            "The function won't wait for that promise to settle — execution continues immediately, and the promise is left running in the background unattended. If it was a side-effecting operation (like a database write), it still runs, but code after it may finish before that operation completes, and any error inside the un-awaited promise becomes an unhandled promise rejection instead of being caught by the surrounding try/catch.",
          pitfalls: [
            "Забывать await перед промисом внутри async-функции — асинхронная операция 'улетает' в фон незамеченной.",
            "Использовать await последовательно там, где операции независимы и могли бы выполняться параллельно через Promise.all.",
          ],
          practiceTask:
            "Перепишите цепочку .then().catch() на async/await с try/catch для функции, которая делает fetch и парсит JSON, сохранив ту же обработку ошибок.",
          resources: {
            docs: [
              { title: "Using Promises — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises" },
            ],
            articles: [
              { title: "Async/await (javascript.info)", url: "https://javascript.info/async-await" },
              { title: "Tasks, microtasks, queues and schedules (Jake Archibald)", url: "https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/" },
            ],
          },
        },
      },
    ],
  },
  {
    id: "state-management",
    title: "State Management",
    subtopics: [
      {
        id: "state-zustand-vs-redux",
        title: "Zustand vs Redux vs Context",
        content: {
          title: "Zustand vs Redux vs Context",
          shortExplanation:
            "Это три разных инструмента для одной задачи — разделить и переиспользовать состояние между компонентами, но с разной ценой boilerplate и разной производительностью.",
          detailedExplanation:
            "Context API встроен в React и хорошо подходит для редко меняющихся данных (тема, локаль, текущий пользователь), но при частых обновлениях приводит к ре-рендеру всех компонентов-потребителей, потому что Context не умеет подписывать компонент только на часть значения. Redux даёт строгую предсказуемую архитектуру (единое состояние, экшены, редьюсеры, DevTools с time-travel), но требует много boilerplate-кода даже для простых случаев. Zustand — минималистичная библиотека: состояние и действия описываются в одном месте без экшенов/редьюсеров, а компоненты подписываются только на нужный кусок состояния через селектор, что даёт точечные ре-рендеры без явной мемоизации.",
          codeExample:
            "// Zustand: состояние и действия в одном месте, без экшенов/редьюсеров\nconst useStore = create((set) => ({\n  count: 0,\n  increment: () => set((s) => ({ count: s.count + 1 })),\n}));\n\n// В компоненте подписываемся только на count — не на весь стор\nconst count = useStore((s) => s.count);",
          interviewQuestion: "Почему Context API не подходит для часто меняющегося глобального состояния?",
          interviewAnswerRu:
            "Потому что любой компонент, вызвавший useContext(MyContext), ре-рендерится при каждом изменении значения контекста целиком — Context не поддерживает подписку на отдельные поля объекта, в отличие от Zustand или Redux с селекторами. Если в контексте лежит объект с несколькими полями и меняется только одно из них, ре-рендерятся все потребители контекста, даже те, кому нужно было другое поле.",
          interviewAnswerEn:
            "Because any component calling useContext(MyContext) re-renders on every change to the context value as a whole — Context has no built-in way to subscribe to individual fields, unlike Zustand or Redux with selectors. If the context holds an object with several fields and only one of them changes, every consumer re-renders, even ones that only cared about a different field.",
          pitfalls: [
            "Класть в один Context часто меняющиеся данные вместе с редко меняющимися — все потребители страдают от лишних ре-рендеров.",
            "Выбирать Redux 'по умолчанию' для маленького проекта, где было бы достаточно Zustand или даже useState, и тратить время на boilerplate.",
          ],
          practiceTask:
            "Реализуйте одно и то же счётчик-состояние через Context, через Zustand и сравните количество кода и ре-рендеров дочерних компонентов, не подписанных на это состояние.",
          resources: {
            docs: [
              { title: "Zustand: Getting Started — official docs", url: "https://zustand.docs.pmnd.rs/getting-started/introduction" },
            ],
            articles: [
              { title: "How to use React Context effectively (Kent C. Dodds)", url: "https://kentcdodds.com/blog/how-to-use-react-context-effectively" },
              { title: "Working with Zustand (TkDodo)", url: "https://tkdodo.eu/blog/working-with-zustand" },
            ],
          },
        },
      },
      {
        id: "state-normalization",
        title: "Normalizing State",
        content: {
          title: "Normalizing State (нормализация состояния)",
          shortExplanation:
            "Нормализация — это хранение данных в виде плоских структур по id (как в базе данных), а не вложенных деревьев, чтобы избежать дублирования и упростить обновления.",
          detailedExplanation:
            "Если хранить данные как вложенные массивы объектов (например, список постов, где у каждого поста есть массив комментариев с вложенным автором), одно и то же значение (например, данные пользователя) может дублироваться в нескольких местах — и при обновлении нужно синхронизировать все копии. Нормализованная структура хранит сущности в плоском виде: { posts: { byId: {...}, allIds: [...] }, comments: { byId: {...} }, users: { byId: {...} } }, а связи между ними — через id-ссылки. Это похоже на таблицы в реляционной БД и делает обновление одной сущности мгновенным для всех мест, где она используется.",
          codeExample:
            "// Ненормализованно: автор комментария дублируется в каждом посте\n{ posts: [{ id: 1, comments: [{ id: 10, author: { id: 5, name: 'Anna' } }] }] }\n\n// Нормализованно: одна копия пользователя, доступ через userId\n{\n  posts: { byId: { 1: { id: 1, commentIds: [10] } } },\n  comments: { byId: { 10: { id: 10, authorId: 5 } } },\n  users: { byId: { 5: { id: 5, name: 'Anna' } } },\n}",
          interviewQuestion: "Зачем нормализовать состояние, если данные и так приходят с сервера в удобном виде?",
          interviewAnswerRu:
            "Проблема возникает не при получении данных, а при их обновлении на клиенте: если один и тот же объект (например, пользователь) встречается в нескольких местах вложенного дерева, обновление его имени потребует найти и изменить все копии. В нормализованном виде достаточно обновить один объект по id в users.byId — все места, ссылающиеся на этот id, автоматически 'увидят' новые данные при следующем рендере.",
          interviewAnswerEn:
            "The problem isn't fetching the data — it's updating it on the client afterward: if the same object (say, a user) appears in several places in a nested tree, updating their name means finding and changing every copy. In normalized form, you only update one object by id in users.byId — everywhere that references that id automatically 'sees' the new data on the next render.",
          pitfalls: [
            "Нормализовать данные, которые никогда не обновляются и не переиспользуются в разных местах — это лишнее усложнение без пользы.",
            "Забывать удалить связи (например, commentIds) при удалении сущности, оставляя 'битые' ссылки на несуществующие id.",
          ],
          practiceTask:
            "Возьмите вложенный JSON с постами и комментариями и напишите функцию normalize(), которая превращает его в плоскую структуру byId/allIds для каждой сущности.",
          resources: {
            docs: [
              { title: "Normalizing State Shape — Redux docs", url: "https://redux.js.org/usage/structuring-reducers/normalizing-state-shape" },
            ],
            articles: [
              { title: "normalizr — normalize nested JSON by schema (paularmstrong)", url: "https://github.com/paularmstrong/normalizr" },
            ],
          },
        },
      },
      {
        id: "state-derived-state",
        title: "Derived State",
        content: {
          title: "Derived State (производное состояние)",
          shortExplanation:
            "Производное состояние — это значение, которое можно вычислить из уже существующего state, а не хранить как отдельную независимую переменную состояния.",
          detailedExplanation:
            "Частая ошибка — хранить в state значение, которое на самом деле является функцией от других значений state (например, filteredList как отдельный useState, хотя его можно вычислить из items и filter при каждом рендере). Это приводит к рассинхронизации: забыли обновить производное значение при изменении исходного — получили баг. Правильный подход — вычислять производные значения прямо в теле компонента (при необходимости обернув в useMemo для дорогих вычислений), а не дублировать их в отдельном state.",
          codeExample:
            "// Плохо: filteredItems может рассинхронизироваться с items/filter\nconst [items, setItems] = useState([]);\nconst [filter, setFilter] = useState('');\nconst [filteredItems, setFilteredItems] = useState([]); // лишнее состояние\n\n// Хорошо: вычисляем прямо при рендере\nconst filteredItems = useMemo(\n  () => items.filter((i) => i.name.includes(filter)),\n  [items, filter]\n);",
          interviewQuestion: "Как понять, что значение должно быть derived state, а не отдельным useState?",
          interviewAnswerRu:
            "Если значение можно полностью и однозначно вычислить из уже существующих props/state в любой момент времени без дополнительной информации — это производное значение, и хранить его в отдельном state не нужно. Признак проблемы — синхронизирующий useEffect, который 'обновляет одно состояние при изменении другого': чаще всего это сигнал, что одно из двух состояний на самом деле лишнее и должно быть просто вычислением.",
          interviewAnswerEn:
            "If a value can be fully and unambiguously computed from already-existing props/state at any point in time, with no extra information needed, it's a derived value and doesn't need its own state slot. A red flag is a synchronizing useEffect that 'updates one state whenever another changes' — that's usually a sign one of the two states is redundant and should just be a computation instead.",
          pitfalls: [
            "Синхронизировать derived state через useEffect вместо простого вычисления в рендере — источник трудноуловимых багов рассинхронизации.",
            "Забывать useMemo для действительно дорогих производных вычислений, из-за чего они пересчитываются на каждый несвязанный рендер.",
          ],
          practiceTask:
            "Найдите в любом своём компоненте useEffect, который синхронизирует одно состояние с другим, и перепишите его как обычное вычисление (при необходимости — с useMemo).",
          resources: {
            docs: [
              { title: "Choosing the State Structure — React docs", url: "https://react.dev/learn/choosing-the-state-structure" },
            ],
            articles: [
              { title: "Don't Sync State. Derive It! (Kent C. Dodds)", url: "https://kentcdodds.com/blog/dont-sync-state-derive-it" },
              { title: "You Might Not Need an Effect — React docs", url: "https://react.dev/learn/you-might-not-need-an-effect" },
            ],
          },
        },
      },
      {
        id: "state-local-vs-global",
        title: "Local vs Global State",
        content: {
          title: "Local vs Global State",
          shortExplanation:
            "Локальное состояние живёт внутри одного компонента и не нужно нигде больше; глобальное — используется многими несвязанными компонентами в разных частях дерева.",
          detailedExplanation:
            "Главный принцип — состояние должно жить максимально близко к тому месту, где оно используется (co-location), и подниматься выше по дереву (lifting state up) или в глобальное хранилище только тогда, когда это реально необходимо нескольким удалённым друг от друга компонентам. Преждевременный перевод всего в глобальный store (Redux/Zustand) усложняет код, добавляет лишнюю связанность и может провоцировать ненужные ре-рендеры в местах, не связанных с изменением.",
          codeExample:
            "// Состояние открытости дропдауна — чисто локальное, не нужно в глобальном сторе\nfunction Dropdown() {\n  const [isOpen, setIsOpen] = useState(false);\n  return <div onClick={() => setIsOpen(v => !v)}>{/* ... */}</div>;\n}\n\n// Данные текущего пользователя — нужны в Header, Sidebar, Profile -> глобальный store",
          interviewQuestion: "Какой критерий помогает решить, поднимать ли состояние в глобальный store?",
          interviewAnswerRu:
            "Главный вопрос — используется ли это состояние компонентами, у которых нет общего близкого родителя, через которого пропсы разумно прокинуть, или изменение этого состояния должно быть видно в нескольких независимых частях приложения одновременно (например, авторизация пользователя, тема оформления, содержимое корзины). Если состояние нужно только одному компоненту и его прямым детям — локальный useState почти всегда лучше глобального store.",
          interviewAnswerEn:
            "The key question is whether this state is used by components with no reasonably close common ancestor to pass props through, or whether a change to it needs to be visible across several independent parts of the app at once (user auth, theme, cart contents). If the state is only needed by one component and its direct children, local useState is almost always the better choice over a global store.",
          pitfalls: [
            "Складывать в глобальный store всё состояние 'на всякий случай' — усложняет отладку и добавляет ненужную связанность между частями приложения.",
            "Слишком долго прокидывать пропсы через много уровней (prop drilling) вместо того, чтобы признать состояние действительно глобальным.",
          ],
          practiceTask:
            "Возьмите один Zustand-store из вашего проекта и проверьте каждое поле: правда ли оно нужно нескольким несвязанным компонентам, или его можно было бы сделать локальным useState.",
          resources: {
            docs: [
              { title: "Sharing State Between Components — React docs", url: "https://react.dev/learn/sharing-state-between-components" },
            ],
            articles: [
              { title: "Application State Management with React (Kent C. Dodds)", url: "https://kentcdodds.com/blog/application-state-management-with-react" },
            ],
          },
        },
      },
      {
        id: "state-form-state",
        title: "Form State",
        content: {
          title: "Form State (состояние форм)",
          shortExplanation:
            "Состояние формы — значения полей, ошибки валидации, флаги touched/dirty и статус отправки — обычно управляется отдельно от остального состояния приложения из-за своей специфики.",
          detailedExplanation:
            "Формы обновляются очень часто (на каждое нажатие клавиши), требуют валидации (на уровне поля и всей формы), должны различать 'поле ещё не тронуто' и 'поле тронуто, но невалидно', и часто содержат вложенные и массивоподобные структуры (список телефонов, динамические поля). Из-за этой специфики для форм часто используют отдельные библиотеки (React Hook Form, Formik) вместо того, чтобы хранить состояние формы в общем сторе (Zustand/Redux) — это позволяет минимизировать ре-рендеры (например, React Hook Form вообще не ре-рендерит компонент на каждое нажатие клавиши, используя неконтролируемые инпуты и рефы).",
          codeExample:
            "const { register, handleSubmit, formState: { errors } } = useForm();\n\n<form onSubmit={handleSubmit(onSubmit)}>\n  <input {...register('email', { required: 'Email обязателен' })} />\n  {errors.email && <span>{errors.email.message}</span>}\n</form>",
          interviewQuestion: "Почему для форм часто не используют общий глобальный store вроде Redux?",
          interviewAnswerRu:
            "Состояние формы обновляется очень часто (буквально на каждое нажатие клавиши), и если хранить его в глобальном сторе, каждое изменение может вызывать ре-рендер множества подписанных компонентов, а не только самой формы. Специализированные библиотеки для форм решают это через неконтролируемые инпуты и рефы, ре-рендеря только те части UI, которые реально должны обновиться (например, конкретное сообщение об ошибке), а не всю форму или тем более всё приложение.",
          interviewAnswerEn:
            "Form state updates extremely often (literally on every keystroke), and storing it in a global store could trigger a re-render of every subscribed component on each change, not just the form. Dedicated form libraries solve this using uncontrolled inputs and refs, re-rendering only the specific UI pieces that actually need to update — like one error message — rather than the whole form or the whole app.",
          pitfalls: [
            "Хранить каждое поле формы в отдельном useState — при росте формы это быстро становится неуправляемым.",
            "Путать 'невалидно' и 'ещё не тронуто пользователем' — показывать ошибки на пустой только что открытой форме.",
          ],
          practiceTask:
            "Реализуйте простую форму логина (email + password) с валидацией через React Hook Form (или руками через useState + собственную функцию валидации) и корректной обработкой touched/errors.",
          resources: {
            docs: [
              { title: "React Hook Form: Get Started — official docs", url: "https://react-hook-form.com/get-started" },
            ],
            articles: [
              { title: "React Hook Form vs. React 19 (LogRocket)", url: "https://blog.logrocket.com/react-hook-form-vs-react-19/" },
            ],
          },
        },
      },
    ],
  },
  {
    id: "frontend-architecture",
    title: "Frontend Architecture",
    subtopics: [
      {
        id: "arch-feature-sliced",
        title: "Feature-Sliced Design",
        content: {
          title: "Feature-Sliced Design (FSD)",
          shortExplanation:
            "Feature-Sliced Design — методология организации фронтенд-кода по слоям (app, pages, widgets, features, entities, shared) и по фичам внутри слоёв, а не по техническому типу файла.",
          detailedExplanation:
            "Классическая организация 'по типу' (все компоненты в components/, весь стейт в store/, все хуки в hooks/) плохо масштабируется: чтобы понять одну фичу, приходится прыгать по десяткам папок. FSD группирует код вокруг бизнес-смысла: каждый слой ниже не может импортировать слои выше (entities не знает про features, features не знает про widgets), а внутри слоя код делится на независимые 'срезы' (например, features/add-to-cart, features/auth). Это делает границы ответственности явными и облегчает удаление/перенос целой фичи.",
          codeExample:
            "src/\n  app/          // инициализация приложения, провайдеры, роутинг\n  pages/        // страницы, композиция виджетов\n  widgets/      // крупные независимые блоки UI (Header, ProductCard)\n  features/     // конкретные пользовательские сценарии (add-to-cart, login-form)\n  entities/     // бизнес-сущности (user, product) и работа с ними\n  shared/       // переиспользуемый UI-kit, утилиты, без бизнес-логики",
          interviewQuestion: "Зачем нужны строгие правила импортов между слоями в FSD?",
          interviewAnswerRu:
            "Без строгих правил проект быстро превращается в 'спагетти', где entities начинает знать о конкретных features, а shared-компоненты — о бизнес-логике конкретной страницы. Правило 'слой может импортировать только более низкие слои' гарантирует, что низкоуровневый переиспользуемый код (shared, entities) никогда не завязан на конкретные фичи или страницы, поэтому его можно безопасно переиспользовать и тестировать в изоляции.",
          interviewAnswerEn:
            "Without strict rules, a project quickly turns into spaghetti, where entities start knowing about specific features, and shared components end up coupled to one page's business logic. The rule 'a layer may only import from layers below it' guarantees that low-level reusable code (shared, entities) is never tied to specific features or pages, so it can be safely reused and tested in isolation.",
          pitfalls: [
            "Заводить FSD-структуру в маленьком проекте, где хватило бы простой организации по фичам без строгих слоёв — лишняя церемония.",
            "Нарушать правило импортов 'снизу вверх' 'на один раз', открывая дорогу к постепенной деградации границ.",
          ],
          practiceTask:
            "Возьмите один существующий компонент из вашего проекта и определите, в какой слой FSD (shared/entities/features/widgets) он попал бы и почему.",
          resources: {
            docs: [
              { title: "Feature-Sliced Design — official docs", url: "https://feature-sliced.design/" },
            ],
            articles: [
              { title: "FSD with Next.js guide", url: "https://feature-sliced.design/docs/guides/tech/with-nextjs" },
              { title: "Container/Presentational Pattern", url: "https://www.patterns.dev/react/presentational-container-pattern" },
            ],
          },
        },
      },
      {
        id: "arch-layered",
        title: "Separation of UI and Business Logic",
        content: {
          title: "Separation of UI and Business Logic",
          shortExplanation:
            "Разделение UI и бизнес-логики означает, что компоненты отвечают только за отображение и взаимодействие, а вычисления, правила и работа с данными вынесены в отдельные функции/хуки.",
          detailedExplanation:
            "Компонент, в котором смешаны JSX, вызовы API, валидация и сложные вычисления, тяжело тестировать и переиспользовать: чтобы протестировать бизнес-правило, приходится рендерить весь компонент. Вынос логики в кастомные хуки (useCartTotal, useAuthStatus) или чистые функции (calculateDiscount, validateOrder) позволяет тестировать её независимо от UI и переиспользовать между разными компонентами представления (например, одна и та же логика для десктопной и мобильной версии страницы).",
          codeExample:
            "// Плохо: бизнес-логика (расчёт скидки) прямо внутри JSX-компонента\nfunction Cart({ items }) {\n  const total = items.reduce((sum, i) => sum + i.price, 0);\n  const discount = total > 100 ? total * 0.1 : 0;\n  return <div>{total - discount}</div>;\n}\n\n// Лучше: логика вынесена, компонент только отображает результат\nfunction useCartTotal(items) {\n  const total = items.reduce((sum, i) => sum + i.price, 0);\n  const discount = total > 100 ? total * 0.1 : 0;\n  return total - discount;\n}\nfunction Cart({ items }) {\n  return <div>{useCartTotal(items)}</div>;\n}",
          interviewQuestion: "Как разделение UI и бизнес-логики упрощает тестирование?",
          interviewAnswerRu:
            "Если бизнес-логика вынесена в чистую функцию или хук без зависимости от JSX, её можно протестировать напрямую: вызвать с разными входными данными и проверить результат, без рендеринга компонентов и работы с DOM. Это делает тесты быстрее, стабильнее (нет хрупких селекторов) и точнее указывает на то, что именно сломалось — логика или отображение.",
          interviewAnswerEn:
            "If business logic is extracted into a pure function or hook with no dependency on JSX, it can be tested directly: call it with different inputs and check the result, with no component rendering or DOM involved. This makes tests faster, more stable (no fragile selectors), and more precise about what actually broke — the logic or the rendering.",
          pitfalls: [
            "Разделять логику и UI 'ради красоты' там, где компонент и так простой — избыточная абстракция.",
            "Оставлять сложные ветвления бизнес-правил прямо в JSX (тернарники внутри тернарников) вместо вынесения в именованную функцию.",
          ],
          practiceTask:
            "Найдите в своём проекте компонент с вычислением внутри JSX (не в отдельной функции/хуке) и вынесите это вычисление в отдельную протестированную функцию.",
          resources: {
            docs: [
              { title: "Composition vs Inheritance — React docs", url: "https://legacy.reactjs.org/docs/composition-vs-inheritance.html" },
            ],
            articles: [
              { title: "Container/Presentational Pattern", url: "https://www.patterns.dev/react/presentational-container-pattern" },
              { title: "Common mistakes with React Testing Library", url: "https://kentcdodds.com/blog/common-mistakes-with-react-testing-library" },
            ],
          },
        },
      },
      {
        id: "arch-monorepo",
        title: "Monorepos",
        content: {
          title: "Monorepos (монорепозитории)",
          shortExplanation:
            "Монорепозиторий — это один git-репозиторий, в котором живут несколько связанных пакетов или приложений (например, сайт, админка и общая библиотека компонентов).",
          detailedExplanation:
            "Монорепо решает проблему переиспользования кода между несколькими приложениями одной команды: общий UI-kit, типы, утилиты лежат в отдельном пакете внутри того же репозитория и подключаются через локальные ссылки (workspace), без публикации в npm и версионирования вручную. Инструменты вроде Turborepo, Nx или pnpm workspaces добавляют кэширование сборки и запуск задач только для изменённых пакетов. Плата за это — более сложная настройка CI/CD и инструментов сборки, а также риск излишней связанности между 'независимыми' пакетами.",
          codeExample:
            "apps/\n  web/            // основной сайт, зависит от packages/ui\n  admin/          // админка, тоже зависит от packages/ui\npackages/\n  ui/             // общий UI-kit\n  eslint-config/  // общие правила линтера\n\n// В package.json web: \"dependencies\": { \"@repo/ui\": \"workspace:*\" }",
          interviewQuestion: "В чём главное преимущество монорепо перед несколькими отдельными репозиториями?",
          interviewAnswerRu:
            "Главное преимущество — мгновенное переиспользование общего кода без публикации пакетов и без версионирования: изменение в packages/ui сразу доступно во всех приложениях монорепо без npm publish и bump версии. Это также упрощает атомарные изменения сразу в нескольких приложениях (один PR меняет и библиотеку, и оба приложения, которые её используют) и даёт единые правила линтинга/сборки для всей команды.",
          interviewAnswerEn:
            "The main advantage is instant reuse of shared code without publishing packages or versioning: a change in packages/ui is immediately available to every app in the monorepo, with no npm publish or version bump needed. It also simplifies atomic changes across multiple apps at once (one PR touches both the library and the apps that use it) and gives the whole team a single set of lint/build rules.",
          pitfalls: [
            "Заводить монорепо для одного-единственного приложения без реальной потребности в переиспользовании между несколькими проектами.",
            "Не настраивать кэширование сборки (Turborepo/Nx) — CI начинает пересобирать вообще всё при любом небольшом изменении.",
          ],
          practiceTask:
            "Опишите (в виде дерева папок) структуру монорепо для проекта из сайта, админки и общей библиотеки компонентов, указав, какие пакеты от каких зависят.",
          resources: {
            docs: [
              { title: "Turborepo — official docs", url: "https://turborepo.dev/docs" },
            ],
            articles: [
              { title: "Monorepo Explained (monorepo.tools)", url: "https://monorepo.tools/" },
            ],
          },
        },
      },
      {
        id: "arch-design-system",
        title: "Design Systems",
        content: {
          title: "Design Systems (дизайн-системы)",
          shortExplanation:
            "Дизайн-система — это набор переиспользуемых UI-компонентов, токенов (цвета, отступы, типографика) и правил их использования, общий для всех продуктов компании.",
          detailedExplanation:
            "Дизайн-система решает две задачи одновременно: визуальную согласованность продукта (одна кнопка, одни отступы, один набор цветов везде) и ускорение разработки (не изобретать заново Button/Modal/Input в каждой новой фиче). Технически это обычно отдельный пакет с UI-компонентами поверх дизайн-токенов (переменных для цвета/отступов/шрифтов), который версионируется отдельно от продуктовых приложений и документируется, часто через Storybook.",
          codeExample:
            "// Токены дизайн-системы\nexport const tokens = {\n  color: { primary: '#3b6ff2', danger: '#e5484d' },\n  spacing: { sm: '8px', md: '16px', lg: '24px' },\n};\n\n// Компонент использует токены, а не 'магические' значения\nfunction Button({ variant = 'primary', children }) {\n  return <button style={{ background: tokens.color[variant] }}>{children}</button>;\n}",
          interviewQuestion: "Почему дизайн-токены лучше, чем захардкоженные значения цвета/отступов в каждом компоненте?",
          interviewAnswerRu:
            "Токены — это единственный источник правды (single source of truth) для визуальных значений: если бренд-цвет меняется, достаточно поменять его в одном месте (tokens.color.primary), и изменение подхватят все компоненты, которые его используют. Захардкоженные значения (#3b6ff2 в 50 разных файлах) требуют ручного поиска и замены везде, с риском что-то пропустить и получить визуальную несогласованность.",
          interviewAnswerEn:
            "Tokens are the single source of truth for visual values: if the brand color changes, you update it in one place (tokens.color.primary) and every component using it picks up the change automatically. Hardcoded values (#3b6ff2 scattered across 50 files) require manually finding and replacing every occurrence, with a real risk of missing some and ending up with visual inconsistency.",
          pitfalls: [
            "Строить полноценную дизайн-систему для одного небольшого продукта без перспективы переиспользования — избыточные затраты.",
            "Позволять продуктовым командам 'обходить' дизайн-систему точечными хардкодами 'just this once' — со временем система теряет смысл.",
          ],
          practiceTask:
            "Выпишите 5 захардкоженных значений цвета/отступов из любого своего проекта и превратите их в именованные токены, используемые через переменные.",
          resources: {
            docs: [
              { title: "Design Systems 101 — Nielsen Norman Group", url: "https://www.nngroup.com/articles/design-systems-101/" },
            ],
            articles: [
              { title: "Atomic Design — Brad Frost", url: "https://bradfrost.com/blog/post/atomic-web-design/" },
            ],
          },
        },
      },
      {
        id: "arch-composition",
        title: "Composition over Inheritance",
        content: {
          title: "Composition over Inheritance",
          shortExplanation:
            "В React переиспользование поведения между компонентами достигается через композицию (передачу компонентов как пропсов/children), а не через наследование классов.",
          detailedExplanation:
            "React изначально спроектирован вокруг композиции: вместо того чтобы создавать BaseModal и наследовать от него ConfirmModal, InfoModal и т.д., в React принято передавать переменные части как children или как специализированные пропсы (например, <Modal footer={<Button />} />). Это даёт большую гибкость, чем наследование: компонент можно 'собрать' из разных кусков в разных местах приложения без создания новых классов и без хрупкой иерархии наследования, где изменение базового класса рискует сломать всех наследников.",
          codeExample:
            "// Композиция вместо наследования\nfunction Modal({ title, children, footer }) {\n  return (\n    <div className='modal'>\n      <h2>{title}</h2>\n      <div>{children}</div>\n      <div className='modal-footer'>{footer}</div>\n    </div>\n  );\n}\n\n<Modal title='Удалить?' footer={<button>Подтвердить</button>}>\n  Это действие необратимо.\n</Modal>",
          interviewQuestion: "Почему официальная документация React рекомендует композицию вместо наследования компонентов?",
          interviewAnswerRu:
            "Наследование компонентов создаёт жёсткую связь между базовым и производным компонентом: изменение базового класса может неожиданно сломать поведение всех наследников, а сама иерархия становится сложной для понимания при росте числа вариантов. Композиция (передача children, render props, специализированных пропсов-компонентов) даёт те же возможности переиспользования, но через явные, локальные связи — понятно, что именно передаётся и куда, без скрытой цепочки наследования.",
          interviewAnswerEn:
            "Component inheritance creates a tight coupling between the base and derived component: changing the base class can unexpectedly break every subclass's behavior, and the hierarchy becomes hard to follow as variants multiply. Composition (passing children, render props, specialized component props) gives the same reuse benefits but through explicit, local relationships — it's clear exactly what's being passed and where, with no hidden inheritance chain.",
          pitfalls: [
            "Пытаться строить иерархии наследования компонентов (class ConfirmModal extends Modal) там, где композиция решила бы задачу проще.",
            "Злоупотреблять children/render props там, где хватило бы простого булевого пропа — усложняет API компонента без нужды.",
          ],
          practiceTask:
            "Возьмите два похожих компонента с частично общей структурой (например, два разных модальных окна) и объедините их в один через композицию (children/пропсы) вместо копирования кода.",
          resources: {
            docs: [
              { title: "Composition vs Inheritance — React docs", url: "https://legacy.reactjs.org/docs/composition-vs-inheritance.html" },
            ],
            articles: [
              { title: "Container/Presentational Pattern", url: "https://www.patterns.dev/react/presentational-container-pattern" },
            ],
          },
        },
      },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    subtopics: [
      {
        id: "testing-pyramid",
        title: "Testing Pyramid",
        content: {
          title: "Testing Pyramid (Unit / Integration / E2E)",
          shortExplanation:
            "Пирамида тестирования описывает рекомендуемое соотношение разных видов тестов: много быстрых unit-тестов внизу, меньше integration-тестов посередине, ещё меньше медленных e2e-тестов сверху.",
          detailedExplanation:
            "Unit-тесты проверяют одну маленькую единицу кода (функцию, хук) в изоляции — они самые быстрые и дешёвые, но не гарантируют, что части системы правильно работают вместе. Integration-тесты проверяют взаимодействие нескольких единиц (например, компонент + хук + стор) — медленнее, но ближе к реальному использованию. E2E-тесты (Cypress, Playwright) проверяют весь путь пользователя в реальном (или похожем на реальный) браузере — самые медленные и хрупкие, но дают наибольшую уверенность, что фича действительно работает. 'Пирамида' — это совет не переворачивать это соотношение: не пытаться покрыть всё только e2e-тестами.",
          codeExample:
            "// Unit-тест: изолированная функция\ntest('sum adds two numbers', () => {\n  expect(sum(2, 3)).toBe(5);\n});\n\n// Integration-тест: компонент + взаимодействие пользователя\ntest('form shows error on invalid email', async () => {\n  render(<LoginForm />);\n  await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');\n  await userEvent.click(screen.getByRole('button', { name: /submit/i }));\n  expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();\n});",
          interviewQuestion: "Почему не стоит покрывать всё приложение только e2e-тестами?",
          interviewAnswerRu:
            "E2E-тесты запускают весь стек — реальный (или почти реальный) браузер, сеть, иногда бэкенд — поэтому они на порядки медленнее unit-тестов и более хрупкие (падают из-за таймингов, изменений вёрстки, нестабильной сети), что усложняет их поддержку. Если полагаться только на них, обратная связь при разработке становится очень медленной, а флейки (нестабильно падающие тесты) снижают доверие ко всей тестовой базе. Основную логику дешевле и надёжнее проверять unit- и integration-тестами, оставляя e2e для нескольких критичных пользовательских сценариев.",
          interviewAnswerEn:
            "E2E tests run the whole stack — a real (or near-real) browser, network, sometimes a backend — so they're orders of magnitude slower than unit tests and more fragile (failing due to timing, layout changes, flaky networking), which makes them expensive to maintain. Relying on them alone makes development feedback very slow, and flaky tests erode trust in the whole test suite. Core logic is cheaper and more reliably covered with unit and integration tests, leaving e2e for a handful of critical user journeys.",
          pitfalls: [
            "Писать unit-тесты, которые дублируют реализацию 1-в-1 (проверяют детали внутренностей, а не поведение) — ломаются при любом рефакторинге.",
            "Не иметь ни одного e2e-теста на критичный путь (например, оформление заказа) — баг может пройти все unit-тесты и всё равно сломать продакшн.",
          ],
          practiceTask:
            "Возьмите одну фичу своего приложения и распишите, какие тесты для неё были бы unit, какие — integration, а какие оправданно оставить только на e2e-уровне.",
          resources: {
            docs: [
              { title: "Test Pyramid — Martin Fowler", url: "https://martinfowler.com/bliki/TestPyramid.html" },
            ],
            articles: [
              { title: "Write tests. Not too many. Mostly integration.", url: "https://kentcdodds.com/blog/write-tests" },
            ],
          },
        },
      },
      {
        id: "testing-rtl",
        title: "React Testing Library",
        content: {
          title: "React Testing Library",
          shortExplanation:
            "React Testing Library (RTL) — библиотека для тестирования React-компонентов, построенная на принципе 'тестируй так, как компонентом пользуется реальный человек'.",
          detailedExplanation:
            "В отличие от Enzyme (который позволял проверять внутреннее состояние и структуру компонента), RTL намеренно не даёт лёгкого доступа к деталям реализации: элементы ищутся по тому, что видит и слышит пользователь — тексту, роли (role), aria-атрибутам, а не по CSS-классам или именам внутренних методов. Это делает тесты устойчивыми к рефакторингу внутренней реализации компонента (смена useState на useReducer не должна ломать тесты, если поведение снаружи не изменилось) и заставляет писать более доступный (accessible) UI, потому что тесты используют те же способы поиска элементов, что и screen reader.",
          codeExample:
            "import { render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\n\ntest('increments counter on click', async () => {\n  render(<Counter />);\n  const button = screen.getByRole('button', { name: /increment/i });\n  await userEvent.click(button);\n  expect(screen.getByText('Count: 1')).toBeInTheDocument();\n});",
          interviewQuestion: "Почему RTL советует искать элементы по role/тексту, а не по data-testid или CSS-классу?",
          interviewAnswerRu:
            "Поиск по роли и тексту проверяет то же, что видит и использует реальный пользователь (в том числе пользователь скринридера), поэтому такой тест одновременно служит проверкой доступности интерфейса. CSS-классы и внутренние testid — это детали реализации, не видимые пользователю: их можно менять при рефакторинге вёрстки, и хороший тест не должен на них ломаться. data-testid остаётся как 'запасной вариант', когда элемент нельзя однозначно найти доступным способом, а не как основной инструмент поиска.",
          interviewAnswerEn:
            "Querying by role and text checks exactly what a real user (including a screen-reader user) sees and interacts with, so such a test doubles as an accessibility check. CSS classes and internal test ids are implementation details invisible to the user: they can change during a markup refactor, and a good test shouldn't break because of that. data-testid remains a fallback for when an element genuinely can't be found in an accessible way, not the primary search tool.",
          pitfalls: [
            "Использовать getByTestId как основной способ поиска элементов вместо getByRole/getByLabelText — тест перестаёт проверять доступность.",
            "Тестировать внутреннее состояние компонента напрямую вместо проверки того, что видно и доступно пользователю на экране.",
          ],
          practiceTask:
            "Напишите тест для формы логина, который находит поля через getByLabelText, кнопку — через getByRole, и проверяет появление сообщения об ошибке через findByText.",
          resources: {
            docs: [
              { title: "Testing Library — Guiding Principles", url: "https://testing-library.com/docs/guiding-principles/" },
            ],
            articles: [
              { title: "Common mistakes with React Testing Library", url: "https://kentcdodds.com/blog/common-mistakes-with-react-testing-library" },
            ],
          },
        },
      },
      {
        id: "testing-mocks",
        title: "Mocking & Stubs",
        content: {
          title: "Mocking & Stubs",
          shortExplanation:
            "Моки и стабы — это 'подставные' версии реальных зависимостей (API, модулей, таймеров), которые используются в тестах, чтобы изолировать тестируемый код от внешнего мира.",
          detailedExplanation:
            "Тест не должен зависеть от реального сетевого запроса, реальной базы данных или реального таймера — это делает тесты медленными, нестабильными (флейки из-за сети) и трудными для проверки edge cases (например, 'что если сервер вернёт 500'). Мок — функция/модуль, которая имитирует поведение реальной зависимости и позволяет проверить, была ли она вызвана и с какими аргументами. Стаб — упрощённая версия, которая просто возвращает заранее заданное значение, не отслеживая вызовы. Для сетевых запросов часто используют MSW (Mock Service Worker), который перехватывает fetch/XHR на уровне сети, а не подменяет код приложения.",
          codeExample:
            "import { http, HttpResponse } from 'msw';\nimport { setupServer } from 'msw/node';\n\nconst server = setupServer(\n  http.get('/api/user', () => HttpResponse.json({ name: 'Anna' }))\n);\n\ntest('shows user name after loading', async () => {\n  render(<UserProfile />);\n  expect(await screen.findByText('Anna')).toBeInTheDocument();\n});",
          interviewQuestion: "Зачем мокать сетевые запросы вместо того, чтобы тестировать против реального (тестового) бэкенда?",
          interviewAnswerRu:
            "Мокирование делает тесты быстрыми (нет реальной сети), детерминированными (не зависят от состояния внешнего сервиса или тестовой БД) и позволяют легко проверить edge cases, которые трудно или невозможно воспроизвести на реальном бэкенде — например, таймаут, ошибку 500 или конкретную гоночную ситуацию. Тесты против реального бэкенда важны, но это уже задача integration/e2e-тестов на отдельном уровне пирамиды тестирования, а не unit-тестов компонента.",
          interviewAnswerEn:
            "Mocking makes tests fast (no real network), deterministic (not dependent on the state of an external service or test database), and lets you easily cover edge cases that are hard or impossible to reproduce against a real backend — a timeout, a 500 error, a specific race condition. Testing against a real backend still matters, but that's the job of integration/e2e tests at a different level of the testing pyramid, not a component's unit tests.",
          pitfalls: [
            "Мокать слишком глубоко (внутренние детали реализации модуля) вместо точки входа во внешнюю зависимость — тест ломается при рефакторинге, который не меняет поведение.",
            "Забывать сбрасывать моки между тестами (jest.clearAllMocks()) — результат одного теста влияет на следующий.",
          ],
          practiceTask:
            "Настройте MSW для перехвата одного GET-запроса в вашем приложении и напишите тест, который проверяет и успешный ответ, и ответ с ошибкой (500) для одного и того же компонента.",
          resources: {
            docs: [
              { title: "Mock Service Worker — Introduction", url: "https://mswjs.io/docs/" },
            ],
            articles: [
              { title: "But really, what is a JavaScript mock?", url: "https://kentcdodds.com/blog/but-really-what-is-a-javascript-mock" },
            ],
          },
        },
      },
      {
        id: "testing-snapshot",
        title: "Snapshot Testing",
        content: {
          title: "Snapshot Testing",
          shortExplanation:
            "Снапшот-тест сохраняет 'снимок' вывода компонента (обычно сериализованный DOM) в файл и в следующих запусках сравнивает текущий вывод с сохранённым, сообщая о любых отличиях.",
          detailedExplanation:
            "Снапшот-тесты полезны для быстрой проверки того, что структура вывода не изменилась случайно, но у них есть известная слабость: разработчики часто обновляют снапшот 'не глядя' (jest --updateSnapshot), когда тест падает, не проверяя, было ли изменение намеренным — в результате снапшот перестаёт что-либо реально гарантировать. Снапшоты лучше всего работают для небольших, стабильных, редко меняющихся структур (например, сериализация конфигурации), и хуже — для больших UI-компонентов, где любое косметическое изменение вёрстки роняет тест без реальной пользы.",
          codeExample:
            "test('renders button with correct structure', () => {\n  const { container } = render(<Button>Click me</Button>);\n  expect(container).toMatchSnapshot();\n});\n\n// При первом запуске создаётся __snapshots__/Button.test.tsx.snap\n// При последующих — вывод сравнивается с сохранённым файлом",
          interviewQuestion: "В чём главный риск снапшот-тестов для больших React-компонентов?",
          interviewAnswerRu:
            "Главный риск — 'слепое' обновление снапшотов: когда тест падает из-за любого изменения вёрстки (даже случайного или нежелательного), разработчик под давлением дедлайна часто просто запускает --updateSnapshot, не читая diff внимательно. В таком режиме снапшот-тест перестаёт защищать от реальных регрессий и превращается в формальность, которая создаёт ложное чувство защищённости, при этом требуя поддержки большого количества .snap файлов.",
          interviewAnswerEn:
            "The main risk is blindly updating snapshots: when a test fails because of any markup change (even an accidental or unwanted one), a developer under deadline pressure often just runs --updateSnapshot without carefully reading the diff. In that mode, snapshot tests stop protecting against real regressions and become a formality that creates a false sense of safety, while still requiring a large set of .snap files to maintain.",
          pitfalls: [
            "Делать огромные снапшоты целых страниц — любое косметическое изменение роняет тест, и diff невозможно осмысленно прочитать.",
            "Обновлять снапшоты автоматически в CI или 'не глядя', не читая, что именно изменилось и было ли это намеренно.",
          ],
          practiceTask:
            "Сделайте снапшот-тест для маленького переиспользуемого компонента (например, Badge или Tag), затем намеренно измените в нём один стиль и прочитайте diff снапшота перед обновлением.",
          resources: {
            docs: [
              { title: "Jest — Snapshot Testing", url: "https://jestjs.io/docs/snapshot-testing" },
            ],
            articles: [
              { title: "Common mistakes with React Testing Library", url: "https://kentcdodds.com/blog/common-mistakes-with-react-testing-library" },
            ],
          },
        },
      },
      {
        id: "testing-hooks",
        title: "Testing Custom Hooks",
        content: {
          title: "Testing Custom Hooks",
          shortExplanation:
            "Тестирование кастомных хуков проверяет их поведение (возвращаемые значения, реакцию на изменения) без необходимости рендерить конкретный UI-компонент, который их использует.",
          detailedExplanation:
            "Кастомный хук нельзя вызвать напрямую как обычную функцию в тесте — правила хуков требуют React-окружения. Для этого используется renderHook из @testing-library/react, который 'монтирует' хук в тестовый компонент-обёртку и даёт доступ к его возвращаемому значению через result.current, а также к функции rerender для симуляции изменения пропсов и act для обёртывания асинхронных обновлений состояния.",
          codeExample:
            "import { renderHook, act } from '@testing-library/react';\n\ntest('useCounter increments value', () => {\n  const { result } = renderHook(() => useCounter());\n\n  act(() => {\n    result.current.increment();\n  });\n\n  expect(result.current.count).toBe(1);\n});",
          interviewQuestion: "Почему нельзя просто вызвать customHook() напрямую внутри теста, как обычную функцию?",
          interviewAnswerRu:
            "Потому что внутри кастомного хука используются другие хуки React (useState, useEffect и т.д.), а они требуют находиться в контексте рендеринга React-компонента — правила хуков (Rules of Hooks) запрещают вызывать их вне тела компонента или другого хука. Если вызвать хук как обычную функцию вне React-дерева, React не сможет связать его состояние с конкретным компонентом и упадёт с ошибкой. renderHook решает это, создавая минимальный тестовый компонент-обёртку под капотом.",
          interviewAnswerEn:
            "Because a custom hook internally uses other React hooks (useState, useEffect, etc.), and those require being inside a React component's render context — the Rules of Hooks forbid calling them outside a component or another hook's body. Calling the hook as a plain function outside a React tree means React has no component to attach its state to, and it errors out. renderHook solves this by creating a minimal test wrapper component under the hood.",
          pitfalls: [
            "Забывать оборачивать вызовы, меняющие состояние, в act() — тест может выдавать предупреждения или неактуальный result.current.",
            "Тестировать кастомный хук только через полноценный рендер компонента-потребителя, когда renderHook дал бы более простой и быстрый тест.",
          ],
          practiceTask:
            "Напишите тест для useDebounce (или useLocalStorage) из раздела Practice Tasks с помощью renderHook, проверив и начальное значение, и поведение после изменения входных данных.",
          resources: {
            docs: [
              { title: "Testing Library — renderHook API", url: "https://testing-library.com/docs/react-testing-library/api/" },
            ],
            articles: [
              { title: "How to test custom React hooks — Kent C. Dodds", url: "https://kentcdodds.com/blog/how-to-test-custom-react-hooks" },
            ],
          },
        },
      },
    ],
  },
  {
    id: "interview-questions",
    title: "Interview Questions",
    subtopics: [
      {
        id: "interview-virtual-dom",
        title: "Virtual DOM vs Real DOM",
        content: {
          title: "Virtual DOM vs Real DOM",
          shortExplanation:
            "Virtual DOM — это лёгкое JS-представление реального DOM в памяти, которое React использует, чтобы вычислить минимальный набор изменений перед тем, как трогать настоящий DOM.",
          detailedExplanation:
            "Прямые манипуляции с реальным DOM (через document.createElement, appendChild и т.д.) дорогие, потому что каждое изменение может вызывать layout/paint. React вместо этого при каждом рендере строит новое дерево виртуальных объектов (обычные JS-объекты, описывающие 'что должно быть'), сравнивает его с предыдущим деревом (diffing/reconciliation) и применяет к реальному DOM только реальные отличия одним пакетом (batch update). Это не значит, что Virtual DOM всегда быстрее прямых манипуляций в каждом отдельном случае — его реальное преимущество в том, что он даёт предсказуемую модель обновлений и автоматически батчит изменения, не заставляя разработчика вручную оптимизировать каждое обновление DOM.",
          codeExample:
            "// React под капотом (упрощённо):\n// 1. render() -> новое virtual DOM дерево (обычные объекты)\n// 2. diff(prevTree, nextTree) -> список конкретных изменений\n// 3. commit(changes) -> применение изменений к реальному DOM одним батчем\n\nconst element = { type: 'button', props: { children: 'Click' } }; // virtual DOM node",
          interviewQuestion: "Правда ли, что Virtual DOM всегда быстрее прямой работы с реальным DOM?",
          interviewAnswerRu:
            "Нет, это распространённое упрощение. Точечное, хорошо написанное прямое обновление одного конкретного DOM-узла может быть быстрее, чем построение нового virtual DOM дерева и его сравнение — сам diffing тоже стоит времени и памяти. Реальное преимущество Virtual DOM не в 'сырой скорости', а в том, что он даёт декларативную модель ('опиши, что должно быть на экране') вместо императивной ('опиши, как именно менять DOM'), автоматически батчит обновления и снижает число ошибок, которые возникают при ручной оптимизации прямых DOM-изменений.",
          interviewAnswerEn:
            "No, that's a common oversimplification. A targeted, well-written direct update to one specific DOM node can be faster than building a new virtual DOM tree and diffing it — the diffing itself costs time and memory too. The real advantage of the Virtual DOM isn't raw speed, it's that it provides a declarative model ('describe what should be on screen') instead of an imperative one ('describe exactly how to change the DOM'), automatically batches updates, and reduces the bugs that come from manually optimizing direct DOM changes.",
          pitfalls: [
            "Повторять фразу 'Virtual DOM быстрее' на интервью без понимания, в чём именно его реальное преимущество.",
            "Не знать, что современный React (Fiber) может прерывать и приоритизировать рендеринг именно благодаря промежуточному virtual DOM представлению.",
          ],
          practiceTask:
            "Объясните своими словами (вслух или письменно) три конкретных шага, которые происходят между вызовом setState и обновлением экрана в React.",
          resources: {
            docs: [
              { title: "Virtual DOM and Internals — React docs", url: "https://legacy.reactjs.org/docs/faq-internals.html" },
            ],
            articles: [
              { title: "What is the Virtual DOM in React? — freeCodeCamp", url: "https://www.freecodecamp.org/news/what-is-the-virtual-dom-in-react/" },
              { title: "React as a UI Runtime — Dan Abramov", url: "https://overreacted.io/react-as-a-ui-runtime/" },
            ],
          },
        },
      },
      {
        id: "interview-event-delegation",
        title: "Event Delegation",
        content: {
          title: "Event Delegation (делегирование событий)",
          shortExplanation:
            "Делегирование событий — техника, при которой один обработчик вешается на общего родителя, а не на каждый дочерний элемент по отдельности, используя всплытие событий (event bubbling).",
          detailedExplanation:
            "Большинство DOM-событий (click, input и др.) всплывают от целевого элемента вверх по дереву до document. Это позволяет повесить один обработчик на родительский контейнер (например, <ul>) и внутри него определить, по какому именно дочернему элементу (event.target) произошёл клик, вместо того чтобы вешать отдельный обработчик на каждый <li>. React использует эту идею внутри себя: вместо того чтобы вешать нативный обработчик на каждый DOM-узел с onClick, React вешает один обработчик на корень приложения и сам определяет, какой компонент должен получить событие (в актуальных версиях React обработчик вешается на корневой контейнер, а не на document).",
          codeExample:
            "// Один обработчик на родителе вместо N обработчиков на каждом <li>\ndocument.querySelector('ul').addEventListener('click', (event) => {\n  if (event.target.tagName === 'LI') {\n    console.log('Clicked item:', event.target.textContent);\n  }\n});",
          interviewQuestion: "Зачем использовать делегирование событий вместо обработчика на каждом элементе списка?",
          interviewAnswerRu:
            "Во-первых, это экономит память и упрощает управление обработчиками: один обработчик вместо тысячи для большого списка. Во-вторых, это автоматически работает для элементов, добавленных в DOM позже (динамически), потому что обработчик висит на родителе и не привязан к конкретным дочерним узлам — не нужно вручную навешивать новый обработчик на каждый новый элемент списка.",
          interviewAnswerEn:
            "First, it saves memory and simplifies handler management: one handler instead of thousands for a large list. Second, it automatically works for elements added to the DOM later (dynamically), because the handler lives on the parent and isn't tied to specific child nodes — there's no need to manually attach a new handler to every newly added list item.",
          pitfalls: [
            "Забывать, что не все события всплывают (например, focus/blur не всплывают в их обычной форме, хотя есть focusin/focusout, которые всплывают).",
            "Проверять event.target без учёта того, что клик мог произойти по вложенному элементу внутри <li> (например, по иконке), а не по самому <li> — нужен closest() вместо строгого сравнения tagName.",
          ],
          practiceTask:
            "Реализуйте список задач, где удаление элемента по клику на иконку 'крестик' обрабатывается одним делегированным обработчиком на родительском <ul>, используя event.target.closest().",
          resources: {
            docs: [
              { title: "DOM events — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events" },
            ],
            articles: [
              { title: "Event delegation — javascript.info", url: "https://javascript.info/event-delegation" },
            ],
          },
        },
      },
      {
        id: "interview-rest-vs-graphql",
        title: "REST vs GraphQL",
        content: {
          title: "REST vs GraphQL",
          shortExplanation:
            "REST организует API вокруг фиксированных эндпоинтов и ресурсов с заранее заданной формой ответа; GraphQL даёт клиенту один эндпоинт, где сам клиент описывает, какие именно поля данных ему нужны.",
          detailedExplanation:
            "В REST для получения, например, поста с автором и комментариями часто нужно либо несколько запросов (/posts/1, /posts/1/comments, /users/5), либо специальный эндпоинт, заранее спроектированный именно под этот экран (что плохо масштабируется на много разных экранов). GraphQL решает это одним запросом, в котором клиент явно перечисляет нужные поля вложенных сущностей, и сервер возвращает ровно столько данных, сколько запрошено — не больше (решает over-fetching) и не меньше (решает under-fetching, когда пришлось бы делать дополнительный запрос). Платой за гибкость является более сложная настройка кэширования на клиенте (в REST кэшировать по URL просто, в GraphQL нужны специальные библиотеки вроде Apollo Client или же тот же TanStack Query поверх GraphQL-запросов) и потенциальная возможность клиента запросить слишком дорогой для сервера запрос.",
          codeExample:
            "// REST: обычно несколько запросов или специальный агрегирующий эндпоинт\nGET /posts/1\nGET /posts/1/comments\nGET /users/5\n\n// GraphQL: один запрос, клиент описывает форму ответа\nquery {\n  post(id: 1) {\n    title\n    author { name }\n    comments { text author { name } }\n  }\n}",
          interviewQuestion: "Что такое over-fetching и under-fetching, и как GraphQL решает обе проблемы одновременно?",
          interviewAnswerRu:
            "Over-fetching — это когда REST-эндпоинт возвращает больше полей, чем нужно конкретному экрану (например, весь профиль пользователя, хотя нужно только имя), что тратит трафик впустую. Under-fetching — обратная ситуация, когда одного запроса недостаточно и приходится делать ещё один (например, получить пост, а потом отдельно — данные его автора). GraphQL решает обе проблемы тем, что клиент сам явно описывает форму нужных данных в одном запросе — сервер не возвращает лишние поля и не заставляет делать второй запрос за недостающими данными.",
          interviewAnswerEn:
            "Over-fetching is when a REST endpoint returns more fields than a particular screen needs (e.g. the whole user profile when only the name is needed), wasting bandwidth. Under-fetching is the opposite — one request isn't enough, so a second is needed (get a post, then separately fetch its author's data). GraphQL solves both because the client explicitly describes the exact shape of data it needs in a single request — the server doesn't return extra fields, and no second request is needed for missing data.",
          pitfalls: [
            "Считать, что GraphQL 'всегда лучше' REST — для простых CRUD-API с небольшим числом экранов REST часто проще и достаточно.",
            "Не задумываться о кэшировании в GraphQL — без библиотеки вроде Apollo Client/normalized cache легко получить много повторных запросов за одни и те же данные.",
          ],
          practiceTask:
            "Опишите (в виде списка эндпоинтов и одного GraphQL-запроса) один и тот же сценарий 'получить пост с автором и последними 3 комментариями' через REST и через GraphQL, сравнив число запросов.",
          resources: {
            docs: [
              { title: "GraphQL — official Learn docs", url: "https://graphql.org/learn/" },
            ],
            articles: [
              { title: "GraphQL vs. REST — Apollo GraphQL Blog", url: "https://www.apollographql.com/blog/graphql/basics/graphql-vs-rest/" },
            ],
          },
        },
      },
      {
        id: "interview-var-let-const",
        title: "var vs let vs const",
        content: {
          title: "var vs let vs const",
          shortExplanation:
            "var имеет функциональную область видимости и поднимается (hoisting) с инициализацией undefined; let и const имеют блочную область видимости и находятся в 'temporal dead zone' до объявления.",
          detailedExplanation:
            "var видна во всей функции, в которой объявлена (не учитывая блоки {} внутри), и её объявление 'поднимается' наверх функции автоматически, из-за чего обращение к переменной до строки объявления не выбрасывает ошибку, а даёт undefined. let и const видны только внутри блока {}, в котором объявлены, и хотя они тоже технически 'поднимаются', обращение к ним до объявления выбрасывает ReferenceError (эта зона называется temporal dead zone). const дополнительно запрещает переприсваивание самой переменной (но не запрещает изменение содержимого объекта/массива, на который она ссылается).",
          codeExample:
            "if (true) {\n  var x = 1;\n  let y = 2;\n}\nconsole.log(x); // 1 — var видна за пределами блока if\nconsole.log(y); // ReferenceError — let не видна за пределами блока\n\nconst obj = { a: 1 };\nobj.a = 2; // OK — меняем содержимое, не переприсваиваем переменную\nobj = {}; // TypeError — нельзя переприсвоить const",
          interviewQuestion: "Почему цикл for (var i = 0; ...) с setTimeout внутри выводит одно и то же значение i для всех итераций, а for (let i = ...) — нет?",
          interviewAnswerRu:
            "var имеет одну общую переменную на весь цикл (функциональная область видимости), поэтому все замыкания внутри setTimeout ссылаются на одну и ту же переменную, значение которой к моменту выполнения колбэков уже равно финальному значению после цикла. let создаёт новую привязку переменной на каждую итерацию цикла (специальное поведение для for-циклов), поэтому каждое замыкание в setTimeout захватывает 'своё' значение i, соответствующее именно той итерации.",
          interviewAnswerEn:
            "var has a single shared variable for the whole loop (function scope), so every closure inside setTimeout references that same variable, whose value by the time the callbacks run has already reached its final post-loop value. let creates a fresh binding of the variable on every loop iteration (special behavior for for-loops), so each closure inside setTimeout captures 'its own' value of i, matching that specific iteration.",
          pitfalls: [
            "Использовать var по привычке в новом коде — практически всегда стоит использовать let/const из-за более предсказуемой блочной области видимости.",
            "Думать, что const делает объект/массив полностью неизменяемым — она запрещает только переприсваивание самой переменной, не мутацию содержимого.",
          ],
          practiceTask:
            "Воспроизведите цикл с var и setTimeout, который выводит одинаковое значение для всех итераций, объясните почему, затем исправьте на let и убедитесь, что вывод стал ожидаемым.",
          resources: {
            docs: [
              { title: "let — MDN JavaScript Reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let" },
            ],
            articles: [
              { title: "The old \"var\" — javascript.info", url: "https://javascript.info/var" },
            ],
          },
        },
      },
      {
        id: "interview-eq-vs-eqeq",
        title: "== vs ===",
        content: {
          title: "== vs === (нестрогое и строгое сравнение)",
          shortExplanation:
            "=== сравнивает значения без приведения типов (строгое равенство), == сначала приводит операнды к одному типу, а затем сравнивает (нестрогое равенство).",
          detailedExplanation:
            "При использовании == JavaScript выполняет неявное приведение типов по не всегда очевидным правилам (например, '' == 0 равно true, null == undefined равно true, но null == 0 равно false) — эти правила исторически считаются одним из самых запутанных мест языка. === не выполняет никакого приведения: если типы операндов разные, результат сразу false, без попытки их сравнить после приведения. Из-за непредсказуемости == общепринятая практика — почти всегда использовать === (и его пару !==), кроме одного устоявшегося исключения: value == null одновременно проверяет и null, и undefined.",
          codeExample:
            "'' == 0;        // true — строка приводится к числу\nnull == undefined; // true — специальное правило именно для этой пары\nnull == 0;      // false — null не приводится к 0 в сравнении\n\n'' === 0;       // false — разные типы, без приведения\nnull === undefined; // false — разные типы",
          interviewQuestion: "Почему в большинстве style guide рекомендуют всегда использовать === вместо ==, и есть ли исключения?",
          interviewAnswerRu:
            "Потому что правила неявного приведения типов в == нелогичны и плохо запоминаются даже опытными разработчиками, что регулярно приводит к трудноуловимым багам (например, случайное сравнение строки с числом). === убирает этот источник неопределённости: если типы разные, сравнение сразу false. Общепринятое исключение — value == null, которое компактно проверяет одновременно null и undefined, что иногда используют намеренно вместо value === null || value === undefined.",
          interviewAnswerEn:
            "Because the implicit type coercion rules in == are inconsistent and hard to remember even for experienced developers, which regularly leads to subtle bugs (like accidentally comparing a string to a number). === removes that source of uncertainty: if the types differ, the comparison is immediately false. A commonly accepted exception is value == null, which compactly checks for both null and undefined at once, sometimes used deliberately instead of value === null || value === undefined.",
          pitfalls: [
            "Полагаться на == 'по привычке' без понимания конкретных правил приведения типов, которые применяются в каждом случае.",
            "Не знать классическое исключение value == null и вместо него писать более длинную и менее читаемую двойную проверку.",
          ],
          practiceTask:
            "Составьте таблицу из 8 пар значений (например, '0' и 0, [] и false, null и undefined) и предскажите результат == и === для каждой, затем проверьте в консоли браузера.",
          resources: {
            docs: [
              { title: "Equality (==) — MDN JavaScript Reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality" },
            ],
            articles: [
              { title: "Comparisons — javascript.info", url: "https://javascript.info/comparison" },
            ],
          },
        },
      },
    ],
  },

  // ---------------------------------------------------------------------
  // HR INTERVIEW
  // ---------------------------------------------------------------------
  {
    id: "hr-interview",
    title: "HR Interview",
    subtopics: [
      {
        id: "hr-interview-all",
        title: "HR Interview",
        content: {
          title: "HR Interview",
          interviewQuestion: "HR Interview — common recruiter-call questions",
          interviewAnswerEn:
            "**Tell me about yourself.**\n" +
            "I'm a Senior Frontend Engineer / Frontend Tech Lead with over 10 years of experience. My main stack is React, TypeScript, Next.js and modern frontend technologies. In recent years, I've worked on complex production platforms. One of my recent projects was a white-label platform where multiple brands used the same frontend codebase. I worked with CMS and back-office systems, payments, authorization, dashboards, performance optimization and API integrations. I'm hands-on, but I also have strong lead experience. I can contribute to architecture, code reviews, mentoring, code quality and delivery. My strongest area is building scalable, maintainable and high-performance frontend systems.\n\n" +
            "**Why this company?**\n" +
            "I'm interested in this company because it is a product with real scale and strong engineering standards. When a platform serves millions of clients and handles critical user flows, frontend quality becomes extremely important. Performance, correctness, clarity and reliability directly affect user trust. I like environments where frontend engineering is not only about building UI, but also about product quality, architecture, performance and ownership.\n\n" +
            "**Why are you looking for a new role?**\n" +
            "My current project is coming to an end, so I'm looking for a new long-term opportunity. It was a good experience, and I'm not leaving because of any negative reason. For my next role, I'm looking for a strong product engineering environment where I can stay hands-on with React and TypeScript, own complex frontend features end to end, and contribute to architecture, performance, code quality and engineering standards.\n\n" +
            "**Why Senior after Lead experience?**\n" +
            "Although I have lead experience, I still see myself as a hands-on engineer. I enjoy architecture, mentoring and improving team standards, but I also want to stay close to the code and own complex frontend features end to end. For me, a strong Senior Engineer role in a product company is a very good fit, because I can contribute both through deep technical work and through engineering maturity.\n\n" +
            "**What are you looking for in your next role?**\n" +
            "I'm looking for a role where I can work on a complex product, solve challenging frontend problems and take ownership of features from idea to production. I'm especially interested in React, TypeScript, frontend architecture, performance, testing and product quality. I also value an environment with strong engineers, clear ownership, high standards and space to improve the codebase.",
        },
      },
    ],
  },

  // ---------------------------------------------------------------------
  // INTERVIEWS — TRADING 212
  // ---------------------------------------------------------------------
  {
    id: "interviews-trading212",
    title: "Interviews — Trading 212",
    subtopics: [
      {
        id: "t212-hr-interview",
        title: "HR Interview",
        content: {
          title: "HR Interview (recruiter conversation)",
          interviewQuestion:
            "Recruiter call script — opening, Motivation, Stack, Expectations",
          interviewAnswerEn:
            "**Opening (\"Tell me about yourself\")**\n" +
            "Sure. I'm a Senior Frontend Engineer with around 10 years of experience, mainly focused on React, TypeScript and modern frontend architecture. In recent years, I worked on complex production platforms, including a white-label platform where multiple brands used the same frontend codebase. I worked with dashboards, payments, authorization, API integrations, performance optimization and shared frontend architecture. I'm still hands-on, but I also have lead experience, so I can contribute to architecture, code reviews, mentoring, code quality and delivery. My strongest area is building scalable, maintainable and high-performance frontend systems.\n\n" +
            "**Core message for the whole call:** I'm hands-on, product-oriented, strong in React and TypeScript, and I care about performance, correctness, ownership and quality.\n\n" +
            "**BLOCK 1 — MOTIVATION**\n\n" +
            "**Why Trading 212?**\n" +
            "I'm interested in Trading 212 because it is a product with real scale and strong engineering standards. In a financial product, frontend is not just UI — performance, correctness, clarity and reliability directly affect user trust. I like environments where engineers take ownership of what they build, work with high standards, and care about product quality from problem definition to production.\n\n" +
            "**Why are you looking for a new role?**\n" +
            "My current project is coming to an end, so I'm looking for a new long-term opportunity. It was a good experience, and I'm not leaving because of any negative reason. For my next role, I'm looking for a strong product engineering environment where I can stay hands-on with React and TypeScript, own complex frontend features end to end, and contribute to architecture, performance, code quality and engineering standards.\n\n" +
            "**BLOCK 2 — STACK**\n\n" +
            "My main stack is React, TypeScript, Next.js, Remix, Redux Toolkit, TanStack Query, REST and GraphQL APIs, Jest, Vitest, React Testing Library and Playwright. I worked on production frontend systems with shared components, dashboards, authorization, payments, SSR, Core Web Vitals optimization, monitoring and CI/CD. I don't have deep production experience with React Native, but I have strong React and TypeScript fundamentals, so I'm comfortable learning it and adapting to a cross-platform frontend stack.\n\n" +
            "**BLOCK 3 — EXPECTATIONS**\n\n" +
            "**Salary expectations**\n" +
            "My expectation depends on the full package, contract type and responsibilities. Based on the role level and market, I would be targeting around X, but I'm flexible and open to discussion if there is a strong mutual fit.\n\n" +
            "**Availability / notice period**\n" +
            "My current project is coming to an end, so I can be available relatively soon. I would need to align the exact start date, but in general I'm flexible.",
        },
      },
      {
        id: "t212-tech",
        title: "Tech",
        content: {
          title: "Tech stack & responsibilities",
          shortExplanation:
            "Фронтенд-платформа Trading 212 охватывает web и mobile в одном Nx + pnpm монорепозитории: TypeScript, React, React Native и React Native Web, с TanStack Query, Zustand, Playwright, Detox и Jest. Около 95% кода переиспользуется между web и mobile — то есть архитектурные решения по разделению платформо-зависимого и платформо-независимого кода критически важны.",
          detailedExplanation:
            "Разберём стек по ролям, а не просто как список названий:\n\n• TypeScript — используется не для 'галочки', а чтобы делать поведение явным и предотвращать баги на этапе компиляции, а не просто подавлять ошибки типов (`as any`, `@ts-ignore`). В интервью важно показывать, что ты используешь типы как инструмент дизайна API, а не как формальность.\n\n• React + React Native + React Native Web — общая модель компонентов на трёх поверхностях. При 95% переиспользования кода ключевой навык — проектировать компоненты и абстракции так, чтобы platform-specific часть была маленькой и изолированной (например, через `.native.ts`/`.web.ts` файлы или platform-adapters), а не размазанной по всей кодовой базе.\n\n• Nx + pnpm монорепо — управление множеством пакетов/приложений с общими библиотеками, границами модулей (module boundaries) и кэшированием сборки/тестов. Важно понимать, зачем нужны явные границы между `feature`, `ui`, `data-access` библиотеками (в духе Nx-рекомендаций) — это перекликается с темой Frontend Architecture (Feature-Sliced Design) в этом же приложении.\n\n• TanStack Query — управление server state, кэширование запросов, инвалидация, синхронизация с backend (см. темы Data Fetching & Cache в этом приложении — TanStack Query, query keys, cache invalidation).\n\n• Zustand — управление client state (UI-state, не связанный напрямую с сервером) — лёгкая альтернатива Redux (см. тему State Management → Zustand vs Redux).\n\n• Playwright, Detox, Jest — три уровня тестирования: Jest — unit-тесты, Playwright — end-to-end на web, Detox — end-to-end на mobile (React Native). Также упоминается visual-regression testing — автоматическое сравнение скриншотов UI, чтобы ловить визуальные регрессии, которые обычный e2e-тест на логику не поймает.\n\nОтветственности из 'What you'll do' явно перекликаются с этим стеком: владение сложными фичами end-to-end на web и mobile; проектирование и эволюция React/React Native систем, общих библиотек и 'durable abstractions' (абстракций, которые не разваливаются при росте кодовой базы); поиск и решение проблем rendering, state-management, bundle size и runtime-производительности; использование TypeScript для предотвращения, а не подавления ошибок; тесная работа с product/backend/QA; поддержание качества через code review и все три уровня тестов; менторство и повышение инженерного стандарта команды.\n\nВажный нюанс из описания вакансии: 'Depth in one frontend ecosystem and sound tool choice matter more than familiarity with every technology listed' — то есть не нужно врать про экспертный уровень во всех восьми технологиях сразу. Гораздо убедительнее — показать реальную глубину в 2-3 смежных инструментах (например, React + TypeScript + один тестовый фреймворк) и объяснить, по какому принципу ты вообще выбираешь инструменты.",
          interviewQuestion:
            "How does your experience map to a cross-platform React / React Native monorepo like Trading 212's, where ~95% of the code is shared between web and mobile?",
          interviewAnswerRu:
            "У меня есть опыт владения production frontend-системами на React и TypeScript, включая проектирование переиспользуемых абстракций и границ между модулями — это напрямую переносится на модель монорепозитория с общими библиотеками. Я умею диагностировать проблемы рендеринга, работы с состоянием, размера бандла и runtime-производительности, и использую TypeScript, чтобы делать поведение явным, а не просто подавлять ошибки типов. У меня есть опыт тестирования на нескольких уровнях — unit, end-to-end и визуальная регрессия — и я понимаю, для чего нужен каждый из них. Я не претендую на экспертность во всех перечисленных инструментах сразу, но у меня есть глубина в конкретной связке (React, TypeScript, современный state management) и понятный принцип выбора инструментов под задачу.",
          interviewAnswerEn:
            "I have hands-on ownership of production frontend systems built with React and TypeScript, including designing reusable abstractions and clear module boundaries — which maps directly onto a monorepo model with shared libraries. I can diagnose rendering, state-management, bundle-size and runtime-performance issues, and I use TypeScript to make behaviour explicit rather than to suppress type errors. I have testing experience across multiple layers — unit, end-to-end and visual-regression — and understand what each layer is actually for. I wouldn't claim expert-level familiarity with every tool on that list, but I do have real depth in one connected toolchain (React, TypeScript, a modern state-management approach) and a clear principle for choosing tools to fit the problem.",
          pitfalls: [
            "Перечислять все инструменты из джоб-дискрипшена как будто одинаково глубоко ими владеешь — обесценивает ответ.",
            "Не уметь объяснить разницу между server state (TanStack Query) и client state (Zustand) и зачем их разделяют.",
            "Игнорировать mobile-контекст (React Native, Detox) при описании опыта, если вакансия явно кросс-платформенная.",
            "Говорить про TypeScript только как про 'автокомплит', не упоминая его роль в предотвращении багов на этапе компиляции.",
          ],
          practiceTask:
            "Подготовьте два конкретных примера: (1) реальная performance-проблема (rendering, bundle или runtime), которую вы диагностировали и исправили, с цифрами до/после; (2) переиспользуемая абстракция или shared-библиотека, которую вы спроектировали и которая пережила рост кодовой базы.",
        },
      },
      {
        id: "t212-design-thinking",
        title: "Design Thinking",
        content: {
          title: "Product & design thinking (Experience Deep Dive)",
          shortExplanation:
            "Этот аспект интервью (обычно раскрывается на этапе Experience Deep Dive) проверяет не синтаксис React, а то, как ты превращаешь сложные требования в простой пользовательский опыт, как выбираешь архитектурные компромиссы и как объясняешь эти решения другим — product-менеджерам, backend-инженерам, QA.",
          detailedExplanation:
            "В описании вакансии это явно сформулировано так: 'Work closely with product, backend engineering and QA to turn complex requirements into simple user experiences' и 'Clear, structured problem-solving and the ability to explain technical decisions and trade-offs'. Это значит, что интервьюера интересует не только 'что ты сделал технически', но и 'как ты думал, прежде чем это сделать' — то есть сам процесс мышления от постановки задачи до готового решения.\n\nХорошая структура для рассказа о сложной фиче — это по сути STAR-фреймворк, адаптированный под frontend-ownership:\n\n1. Situation/Task — какая была бизнес- или продуктовая задача, кто были стейкхолдеры (product, backend, QA), какие были ограничения (сроки, легаси-код, производительность, поддержка нескольких платформ).\n\n2. Architecture & trade-offs — какие варианты решения рассматривались, почему выбран именно этот (например: 'могли сделать общий компонент для web и mobile, но platform-specific edge cases сделали бы абстракцию слишком сложной — разделили на shared core + два тонких platform-adapter'). Явное упоминание alternatives, которые ты отверг, и почему — то, что отличает зрелого инженера от того, кто просто описывает финальный код.\n\n3. Collaboration — как проходило взаимодействие с product (уточнение неоднозначных требований), backend (контракт API, edge cases данных), QA (какие тест-кейсы обсуждались заранее, а не постфактум).\n\n4. Quality & delivery — как поддерживалось качество: code review, какие тесты писались (unit/e2e/visual-regression), как фича раскатывалась (feature flag, поэтапный rollout, мониторинг после релиза).\n\n5. Result — что изменилось измеримо (производительность, конверсия, количество багов, скорость разработки следующих похожих фич благодаря переиспользуемой абстракции).\n\nВажно ещё раз: 'ownership from problem definition through production' — это ключевая формулировка компании про модель работы команд. Рассказывая историю, стоит явно показать, что твоё участие не заканчивалось на pull request, а включало то, как фича вела себя в проде и что было сделано после релиза (мониторинг, фикс edge cases, итерация по фидбеку).\n\nТакже полезно помнить про менторский аспект ('Share knowledge, mentor colleagues and raise the frontend engineering standard') — если в истории был момент, где ты объяснил решение команде, провёл ревью, которое подняло общий стандарт, или задокументировал абстракцию для переиспользования — это отдельный сильный сигнал, который стоит вставить в рассказ.",
          interviewQuestion:
            "Walk me through a complex frontend feature you owned end to end — from problem definition through production.",
          interviewAnswerRu:
            "Я обычно рассказываю такие истории по структуре: сначала — какая была задача и ограничения (стейкхолдеры, легаси-код, сроки), затем — какие варианты архитектуры я рассматривал и почему выбрал конкретный (включая то, что я отверг и почему), дальше — как проходило взаимодействие с product, backend и QA при уточнении требований и edge cases, затем — как поддерживалось качество через код-ревью и несколько уровней тестов (unit, end-to-end, визуальная регрессия), и в конце — что произошло после релиза: как фича вела себя в проде, какие были метрики и что я донастроил по фидбеку. Также я стараюсь показать менторский момент — например, как я объяснил решение команде или задокументировал переиспользуемую абстракцию.",
          interviewAnswerEn:
            "I usually structure these stories the same way: first, the task and constraints (stakeholders, legacy code, timelines), then the architecture options I considered and why I picked the one I did — including what I rejected and why — then how I collaborated with product, backend and QA to clarify requirements and edge cases, then how quality was maintained through code review and multiple layers of testing (unit, end-to-end, visual-regression), and finally what happened after release: how the feature behaved in production, what the metrics showed, and what I adjusted based on feedback. I also try to surface a mentoring moment — for example explaining the decision to the team or documenting a reusable abstraction for others to build on.",
          pitfalls: [
            "Рассказывать только про финальный код, не упоминая рассмотренные и отвергнутые альтернативы.",
            "Останавливать историю на моменте деплоя, не рассказывая, что было после релиза (мониторинг, фидбек, итерации).",
            "Описывать решение чисто технически, не объясняя, как оно упростило пользовательский опыт или решило продуктовую задачу.",
            "Не упоминать совместную работу с product/backend/QA, будто фича была сделана в вакууме.",
          ],
          practiceTask:
            "Возьмите один свой реальный проект и распишите его по 5 пунктам из разбора выше (задача и ограничения; архитектура и альтернативы; сотрудничество; качество и доставка; результат) — это готовый конспект для Experience Deep Dive.",
        },
      },
      {
        id: "t212-technical-challenge",
        title: "Technical Challenge",
        content: {
          title: "Technical Challenge (Experience Deep Dive)",
          interviewQuestion:
            "Describe the most challenging technical problem you faced in frontend development during the last 1–2 years. How did you solve it?",
          interviewAnswerEn:
            "One of the most challenging frontend problems I faced was improving Core Web Vitals on an existing production platform that had already been in development for around a year.\n\n" +
            "When I joined, some key pages were in the red zone, and the average loading experience was around 16 seconds. The issue was complex because there was no single root cause: heavy images, too much client-side JavaScript, hydration issues, layout shifts, CMS-driven content, and brand-specific configuration all contributed to the problem.\n\n" +
            "I started with proper measurement using Core Web Vitals data, Lighthouse, browser profiling, and Datadog RUM. Then I worked incrementally: improved image loading and preloading, reduced unnecessary JavaScript, fixed hydration issues, stabilized layouts, and optimized critical pages.\n\n" +
            "As a result, we moved key metrics from red to green, and the average loading experience improved from around 16 seconds to around 2 seconds.",
        },
      },
    ],
  },
];

export function findSubtopic(subtopicId: string) {
  for (const topic of TOPICS) {
    const subtopic = topic.subtopics.find((s) => s.id === subtopicId);
    if (subtopic) return { topic, subtopic };
  }
  return null;
}

export function getAllSubtopicIds(): string[] {
  return TOPICS.flatMap((topic) => topic.subtopics.map((s) => s.id));
}

/**
 * Строит список вопросов для Quiz mode из interviewQuestion/interviewAnswer*
 * каждой подтемы. Если передан topicIds, берутся только темы из списка.
 */
export function buildQuizItems(topicIds?: string[]): QuizItem[] {
  const topics = topicIds ? TOPICS.filter((t) => topicIds.includes(t.id)) : TOPICS;
  return topics.flatMap((topic) =>
    topic.subtopics.map((subtopic) => ({
      topicId: topic.id,
      topicTitle: topic.title,
      subtopicId: subtopic.id,
      subtopicTitle: subtopic.title,
      question: subtopic.content.interviewQuestion,
      answerRu: subtopic.content.interviewAnswerRu,
      answerEn: subtopic.content.interviewAnswerEn,
    }))
  );
}
