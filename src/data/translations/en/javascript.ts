import type { ContentTranslationMap } from "../types";

export const javascriptEn: ContentTranslationMap = {
  "js-event-loop": {
    title: "Event Loop",
    shortExplanation:
      "The event loop is the mechanism that lets single-threaded JavaScript run asynchronous operations without blocking the main thread.",
    detailedExplanation:
      "JS runs code on a single thread via the call stack. Async operations (timers, network requests, promises) don't run directly on the stack — they're handed off to Web/Node APIs, and their callbacks land in task queues. There are two main queues: the microtask queue (promises, queueMicrotask) and the macrotask queue (setTimeout, setInterval, DOM events). On every iteration, the event loop first empties the call stack, then fully drains the microtask queue, and only then takes one task from the macrotask queue — which is why promises always run before setTimeout(fn, 0). In the browser there's a third, often-forgotten step: between a macrotask and the next iteration, the engine may run a render update (rAF callbacks, layout, paint) if a frame is due — rendering isn't a separate queue, it's a built-in pause inside the loop itself. That's why requestAnimationFrame is neither a microtask nor a regular macrotask, but a callback tied to that render phase, firing once before the next paint. Node.js differs slightly: no rendering phase, but its own extra queues (process.nextTick, setImmediate) that run in a somewhat different order relative to micro/macrotasks than in the browser. Self-perpetuating microtasks are a real practical danger, not just a theoretical one: such code fully blocks rendering and user input, because the browser can't move to the next macrotask (and thus the next paint) until the microtask queue empties. That's why heavy synchronous work inside .then chains is a common cause of a 'frozen' UI, even if each individual .then looks harmless.",
    pitfalls: [
      "Assuming setTimeout(fn, 0) runs 'immediately' — it always runs after the current synchronous code and all microtasks.",
      "Not accounting for endlessly self-scheduling microtasks (e.g. a recursive .then) blocking the macrotask queue and browser rendering.",
    ],
    practiceTask:
      "Write code mixing several console.log, setTimeout, and Promise.then calls, predict the output order before running it, then check yourself.",
  },
  "js-closures": {
    title: "Closures",
    shortExplanation:
      "A closure is a function that 'remembers' the variables from the scope it was created in, even after that scope has formally finished executing.",
    detailedExplanation:
      "Every JS function creates a closure over the lexical environment it was declared in. This enables patterns like function factories, private variables (via the module pattern), and currying. Closures underpin many React concepts — hooks, event handlers, custom hooks all rely on them heavily, which is exactly why bugs like stale closures trace back to this topic. Crucially, a closure captures the variable itself (a reference to its memory cell), not its value at creation time — so if the outer function keeps mutating that variable after the closure is created, the next call to the closure sees the current value, not the original one. The same property underlies manual memoization (a closure over a Map cache inside a function factory) and debounce/throttle, where the closure holds a timer id or last-call timestamp between calls of the wrapped function. Memory-wise, a closure keeps a reference to the entire lexical environment it was created in, not just the variables it actually uses — in older engines this could retain far more memory than it looks like, though modern JS engines partially optimize this via analysis of which variables are actually used. That's why long-lived closures (e.g. in global event handlers that are never removed) are a common source of memory leaks in long-running SPAs.",
    pitfalls: [
      "Creating a closure inside a var loop and getting the same variable value in every callback (the classic var vs let trap).",
      "Not connecting closures to memory leaks — captured variables aren't garbage-collected while the callback that uses them stays alive.",
    ],
    practiceTask:
      "Reproduce the classic bug: a for (var i = 0; ...) loop with setTimeout inside that logs the same i for every iteration, then fix it with let or an IIFE.",
  },
  "js-prototypes": {
    title: "Prototypes",
    shortExplanation:
      "A prototype is an object that another object references and 'borrows' properties and methods from when it can't find them on itself directly.",
    detailedExplanation:
      "Every JS object has an internal [[Prototype]] reference (accessible via Object.getPrototypeOf, or the legacy __proto__) to another object. When you access a property, the engine first looks on the object itself, and if not found, walks up the prototype chain until it finds the property or reaches null. JS classes (class Foo {}) are syntactic sugar over this same prototypal model — a class's methods actually live on Foo.prototype. The chain lookup isn't infinite: it stops either when the property is found, or when the engine reaches Object.prototype and then null — the end of the chain, where [[Prototype]] no longer exists. This differs from simple property enumeration: for...in walks both own and inherited enumerable properties, while Object.hasOwnProperty(key) or the newer Object.hasOwn(obj, key) check for a property on the object itself, ignoring the prototype — a distinction often used to filter out inherited 'noise' when iterating an object. Object.create(proto) lets you explicitly create an object with a given prototype without calling a constructor — a lower-level tool than new, often used for manual inheritance setup (as below) or for creating prototype-less objects (Object.create(null)) when you want to exclude even inherited methods like toString. In practice, very long prototype chains (deep multi-level inheritance) not only make code harder to read but also make looking up a non-existent property slightly slower, since the engine must walk to the very end of the chain before returning undefined.",
    pitfalls: [
      "Confusing class syntax with 'real' classes from other languages — under the hood it's still prototypes.",
      "Modifying built-in prototypes (Array.prototype, Object.prototype) — considered bad practice and can break third-party code.",
    ],
    practiceTask:
      "Implement inheritance without class syntax: set Dog.prototype = Object.create(Animal.prototype) and override speak on Dog.prototype, calling the parent method via Animal.prototype.speak.call(this).",
  },
  "js-this": {
    title: "this",
    shortExplanation:
      "this is a special value inside a function pointing to the object the function was called on, not to where the function was declared.",
    detailedExplanation:
      "The value of this is determined by how a function is called, not where it's declared (except for arrow functions). The main rules: called as an object method (obj.method()) — this is obj; called as a plain function (fn()) — this is undefined in strict mode or the global object otherwise; called via call/apply/bind — this is set explicitly; arrow functions have no this of their own — they take it from the enclosing (lexical) scope they were declared in. That's exactly why arrow functions are so convenient for callbacks inside class methods and React components. In strict mode (on by default in all ES modules and inside classes), calling a function with no explicit owner object gives this === undefined rather than the global object — deliberately, so typos like a forgotten this.value inside a method immediately throw (TypeError) instead of silently corrupting global state. DOM event handlers are a special case: if a callback is passed directly to addEventListener, the engine calls it with this set to the DOM element the event fired on, regardless of how that callback was declared as a plain function — which is sometimes confused with the usual call rules. Class fields declared as arrow functions (handleClick = () => {...}) became such a common React pattern precisely because they create a bound this once, at instance creation, without needing a separate bind in the constructor. Worth remembering the flip side too: arrow methods can't be overridden via the prototype, and they make an instance slightly heavier in memory, since each function is created fresh per object instead of being shared via the prototype like a regular class method.",
    pitfalls: [
      "Passing an object method as a callback (onClick={obj.method}) without bind or a wrapper in class-based React code.",
      "Using a plain function for a callback where this from the enclosing scope is needed — an arrow function fits better there.",
    ],
    practiceTask:
      "Create an object with a method using this, pass that method directly to setTimeout and observe the bug, then fix it three different ways (bind, arrow wrapper, arrow class property).",
  },
  "js-promises-async": {
    title: "Promises & async/await",
    shortExplanation:
      "A Promise is an object representing the future result of an async operation; async/await is syntactic sugar that lets you write async code in a synchronous-looking style.",
    detailedExplanation:
      "A Promise is in one of three states — pending, fulfilled, or rejected — and that state can only change once. An async function always returns a Promise, and await 'pauses' the function until the promise settles, unwrapping its result — the async function itself doesn't block the rest of the code, because it's asynchronous as a whole. Error handling in async/await goes through a plain try/catch, which is often more convenient than a .then/.catch chain. The executor function passed to new Promise((resolve, reject) => {...}) runs synchronously and immediately, at the moment the promise is created — it's not the executor that's asynchronous, but the moment .then/await is used to obtain the result. For parallel operations there's a whole family of static methods: Promise.all rejects entirely on the first error from any promise, Promise.allSettled always waits for all promises and returns each one's status (fulfilled/rejected) without rejecting itself, Promise.race settles on whichever promise finishes first (success or failure), and Promise.any settles on the first successful one, ignoring failures from the rest until at least one succeeds. Choosing between them is a choice of semantics — 'what counts as the combined result' — not just syntax: for instance, loading several independent page widgets in parallel usually calls for allSettled, so one failing doesn't take down the rest. Also worth remembering: await inside a for loop waits for each iteration one at a time — if the operations in the loop are independent, this artificially serializes work that could run in parallel, which is exactly what's usually fixed by switching to Promise.all(items.map(...)).",
    pitfalls: [
      "Forgetting await before a promise inside an async function — the async operation silently 'flies off' into the background.",
      "Using sequential await where operations are independent and could run in parallel via Promise.all.",
    ],
    practiceTask:
      "Rewrite a .then().catch() chain as async/await with try/catch for a function that fetches and parses JSON, preserving the same error handling.",
  },
  "js-call-stack": {
    title: "Call Stack",
    shortExplanation:
      "The call stack is a LIFO (last in, first out) data structure the JS engine uses to track which function is currently running and where to return after it finishes.",
    detailedExplanation:
      "When a function is called, a new frame is created for it and pushed onto the top of the stack; when the function finishes (return or end of body), its frame is popped and execution returns to the caller. Since JS is single-threaded, there's only one stack — deep recursion without a base case overflows it (Maximum call stack size exceeded). The call stack is exactly what ties synchronous code to the event loop: as long as the stack isn't empty, the engine won't pull the next task off the micro/macrotask queues.",
    pitfalls: [
      "Writing recursion with no base case — a guaranteed overflow.",
      "Confusing the call stack (synchronous, single) with the task queues (micro/macrotasks) — these are different mechanisms.",
    ],
  },
  "js-microtasks-vs-macrotasks": {
    title: "Microtasks vs Macrotasks",
    shortExplanation:
      "Microtasks (promises, queueMicrotask) run to completion, down to the last one, right after the current synchronous code and before any macrotask; macrotasks (setTimeout, setInterval, events) run one per loop iteration.",
    detailedExplanation:
      "After every synchronous run (including after each individual macrotask), the engine first drains the entire microtask queue — including any microtasks added by other microtasks during that draining — and only then takes exactly one task off the macrotask queue. This guarantees promises always 'beat' timers, even with a zero delay. Practical consequence: self-perpetuating microtasks (e.g. a .then that schedules another .then) can indefinitely postpone any macrotask and rendering, freezing the browser.",
    pitfalls: [
      "Thinking 'microtask' just means 'a small task' — it's actually a strict category (promises, queueMicrotask), not a measure of work size.",
      "Not noticing that a chain of hundreds of .then calls can noticeably delay rendering.",
    ],
  },
  "js-scope": {
    title: "Scope",
    shortExplanation:
      "Scope determines where a specific variable is accessible in code. JS has global scope, function scope, and block scope (for let/const).",
    detailedExplanation:
      "var has only function scope — the variable is visible throughout the whole function regardless of nested blocks (if, for), while let/const have block scope — visible only inside the {} block they're declared in. Scopes form a chain (the scope chain): when looking up a variable, the engine first checks the current scope, then climbs to the outer one, and so on up to global — this is exactly the mechanism closures are built on. Lexical scope (as opposed to dynamic scope) is determined by where a function is written in the code, not by where it was called from.",
    pitfalls: [
      "Declaring a loop counter with var and being surprised it's still visible after the loop.",
      "Confusing scope (where a variable is statically visible) with a value's lifetime in memory — related but different concepts.",
    ],
  },
  "js-hoisting": {
    title: "Hoisting",
    shortExplanation:
      "Hoisting is JS behavior where variable and function declarations appear to be 'moved' to the top of their scope before the code actually runs.",
    detailedExplanation:
      "var is hoisted and immediately initialized to undefined, so accessing it before the declaration line doesn't throw — it just gives undefined. let/const are technically hoisted too, but remain in the 'temporal dead zone' (TDZ) — accessing them before declaration throws a ReferenceError rather than returning undefined. Function declarations are hoisted whole, body included, so such a function can be called before its textual declaration in the code — unlike a function expression (const fn = function() {}), which behaves like a regular variable.",
    pitfalls: [
      "Relying on var hoisting as a 'feature' — it's almost always a source of bugs, not useful behavior.",
      "Forgetting that a function expression (unlike a declaration) isn't hoisted along with its body.",
    ],
  },
  "js-classes": {
    title: "Classes",
    shortExplanation:
      "A class in JavaScript is syntactic sugar over prototypal inheritance — class methods actually live on Class.prototype, not copied into every instance.",
    detailedExplanation:
      "Unlike regular functions, a class body always runs in strict mode, and calling a class without new throws an error (whereas a regular constructor function can accidentally be called without new). Private fields (#field) are real, syntax-level encapsulation, unlike the underscore naming convention (_field), which is still accessible from outside. extends and super implement inheritance through the same prototype chain: Child.prototype.__proto__ === Parent.prototype, and super() in the constructor is an explicit call to the parent constructor, required before accessing this in the child class.",
    pitfalls: [
      "Forgetting to call super() in a child class's constructor before accessing this.",
      "Treating classes as a 'different' inheritance mechanism from prototypes — under the hood they're the same thing.",
    ],
  },
  "js-shallow-vs-deep-copy": {
    title: "Shallow Copy vs Deep Copy",
    shortExplanation:
      "A shallow copy only copies the top level of an object/array — nested objects remain shared references with the original; a deep copy recursively copies every level, fully detaching the copy from the original.",
    detailedExplanation:
      "Object.assign({}, obj), spread ({...obj}), and Array.prototype.slice/map all do a shallow copy: if obj has a nested object field, it isn't copied — a reference to that same in-memory object is copied instead, so mutating the nested field on the copy affects the original too. structuredClone(obj) is a built-in way (modern browsers and Node) to do a true deep copy without a third-party library, though it can't clone functions or certain special objects (like DOM nodes). Before structuredClone existed, JSON.parse(JSON.stringify(obj)) was often (incorrectly) used for this, which additionally loses undefined, functions, Dates (turns into a string), Maps/Sets, and circular references.",
    pitfalls: [
      "Mutating a nested object after 'copying' via spread and not understanding why the original changed too.",
      "Using JSON.parse/stringify to clone objects containing dates, functions, or Maps/Sets.",
    ],
  },
  "js-null-vs-undefined": {
    title: "null vs undefined",
    shortExplanation:
      "undefined is the value a variable automatically has when nothing was assigned to it; null is a value the developer assigns explicitly to say 'there's deliberately nothing here'.",
    detailedExplanation:
      "undefined shows up on its own: an undeclared argument value, a missing object property, a function with no return. null, on the other hand, is a deliberate signal of an 'empty' value, and the engine itself never sets it automatically (with rare historical exceptions like document.getElementById for a missing element). typeof null historically returns 'object' — a well-known ECMAScript spec bug kept for backward compatibility, while typeof undefined correctly returns 'undefined'. Under loose comparison, null == undefined is true, but null === undefined is false, because they're different types.",
    pitfalls: [
      "Mixing null and undefined interchangeably in the same codebase without a clear convention.",
      "Relying on loose == null to check for 'no value' without understanding it catches both cases at once (sometimes intentional, sometimes a bug).",
    ],
  },
  "js-nan": {
    title: "NaN",
    shortExplanation:
      "NaN is a special numeric value meaning 'the result of a math operation is not a valid number', and it's unique in that it's not even equal to itself.",
    detailedExplanation:
      "NaN shows up from invalid numeric operations: Number('abc'), 0/0, undefined + 1. Its most surprising property: NaN === NaN is false, because per the IEEE 754 spec, NaN isn't equal to anything, including itself. Because of this, checking for NaN should use Number.isNaN(value) (a strict type-and-value check) or the comparison value !== value (the one case in JS where a value isn't equal to itself), never value === NaN, which is always false regardless of value. The legacy global isNaN(value) first coerces its argument to a number, so isNaN('abc') also returns true, even though the string 'abc' is not a number rather than NaN — a common source of bugs.",
    pitfalls: [
      "Using the global isNaN() instead of Number.isNaN() and getting false positives on strings.",
      "Trying to compare against NaN with === instead of Number.isNaN() or value !== value.",
    ],
  },
  "js-coercion": {
    title: "Type Coercion",
    shortExplanation:
      "Coercion is the automatic or explicit conversion of a value from one type to another (e.g. a string to a number), which JS performs very readily thanks to its dynamic typing.",
    detailedExplanation:
      "Implicit coercion happens in operators like + (which chooses between string concatenation and numeric addition depending on operand types), in == comparisons (unlike strict ===), and in if conditions (a value is coerced to boolean per the truthy/falsy rules). The falsy values in JS are exactly 0, '', null, undefined, NaN, and false; everything else, including an empty array [] and an empty object {}, is truthy — which often surprises newcomers. Explicit coercion (String(value), Number(value), Boolean(value), or shorter idioms like +value or !!value) is considered good practice because it makes the developer's intent visible in the code rather than hidden inside the engine's rules.",
    pitfalls: [
      "Relying on implicit coercion in comparisons (==) instead of strict === where types should match.",
      "Forgetting that [] and {} are truthy, and writing conditions like if (emptyArray) expecting false.",
    ],
  },
  "js-map-set-weakmap-weakset": {
    title: "Map / Set / WeakMap / WeakSet",
    shortExplanation:
      "Map stores key-value pairs with keys of any type (unlike a plain object, where keys are always coerced to strings); Set stores unique values; WeakMap/WeakSet are their 'weak' counterparts, which don't prevent the garbage collector from removing the key object.",
    detailedExplanation:
      "In a plain object {}, a key can only be a string or Symbol — a number or object used as a key gets coerced to a string ('[object Object]' for any object, erasing uniqueness). Map solves this: a key can be an object, a function, a DOM node — anything — and insertion order is preserved on iteration. WeakMap/WeakSet only accept objects as keys and don't keep them from being garbage-collected: if the only remaining reference to an object is a key in a WeakMap, the garbage collector can still remove it, and the WeakMap will automatically 'forget' that entry. That's exactly why WeakMap/WeakSet can't be iterated (no .keys()/.forEach() in the usual sense) — their contents can change unpredictably at any moment via garbage collection, and such an API could produce a non-deterministic result.",
    pitfalls: [
      "Using a plain object {} as a Map with dynamic keys and not watching out for prototype keys (__proto__ and similar).",
      "Trying to iterate a WeakMap/WeakSet with a loop — they're deliberately non-iterable.",
    ],
  },
  "js-garbage-collection": {
    title: "Garbage Collection",
    shortExplanation:
      "Garbage collection is V8's (and other engines') automatic mechanism for freeing memory held by objects that no active reference from code can reach anymore.",
    detailedExplanation:
      "The main algorithm is mark-and-sweep: the collector starts from 'roots' (global objects, the call stack, closed-over variables of active functions) and marks everything reachable through the reference chain; everything else is considered garbage and freed. Crucially, reachability, not reference count, determines whether an object gets removed — so two objects referencing each other in a cycle but unreachable from outside will still be correctly collected (unlike simple reference counting, where circular references are a well-known problem). Typical frontend memory-leak sources: event subscriptions never cleaned up (addEventListener without a matching removeEventListener), timers that are never cleared, and closures holding onto large objects longer than needed.",
    pitfalls: [
      "Forgetting to remove subscriptions/timers on component unmount — a classic SPA leak cause.",
      "Assuming it's enough to null out one reference — if the object is still reachable through another path, it won't be collected.",
    ],
  },
  "js-debounce-throttle-concept": {
    title: "Debounce / Throttle: The Difference",
    shortExplanation:
      "Debounce delays calling a function until events stop arriving for a set interval; throttle guarantees a function is called no more than once per set interval, regardless of how often events actually arrive.",
    detailedExplanation:
      "Debounce is useful when only the 'final' call after a burst of events matters — search-as-you-type, for instance: no need to send a request on every keystroke, just once when the user briefly pauses typing. Throttle is useful when events arrive as a continuous stream and you need to cap the response rate without dropping it entirely — a scroll or resize handler, say, where you want to update the UI not on every pixel scrolled, but no more than, say, 10 times a second. Full implementations of both patterns, with a breakdown of how they work internally, live in Live Coding / Practice Tasks (useDebounce, useThrottle).",
    pitfalls: [
      "Using debounce where regular intermediate feedback is needed (the user sees no response at all until they stop).",
      "Using throttle where the final call specifically matters — the last event can be lost without adding a trailing call.",
    ],
  },
  "js-currying": {
    title: "Currying",
    shortExplanation:
      "Currying is a technique for transforming a function that takes multiple arguments into a sequence of functions, each taking one argument and returning the next function.",
    detailedExplanation:
      "A curried add(a)(b)(c), instead of add(a, b, c), lets you create partially applied ('specialized') versions of a function by fixing some arguments ahead of time — add(5), for instance, returns a function that always adds 5 to its argument, handy for passing into map/filter or configuring reusable handlers. Currying is built on ordinary closures: each intermediate function 'remembers' the arguments already passed, in its own lexical environment. In practice, currying is often confused with the broader concept of partial application — currying always turns a function into a chain of single-argument functions, while partial application can fix several arguments at once, with no requirement to go strictly 'one at a time'.",
    pitfalls: [
      "Currying functions with a variable number of arguments (rest parameters) — fn.length doesn't account for them, breaking automatic currying based on fn.length.",
      "Overusing currying where a regular multi-parameter function would read more simply.",
    ],
  },
  "js-memoization-concept": {
    title: "Memoization: Concept and Manual Implementation",
    shortExplanation:
      "Memoization is an optimization where the result of calling a pure function is cached by its arguments, so a repeat call with the same arguments doesn't recompute it.",
    detailedExplanation:
      "Memoization only applies to pure functions — those whose result depends solely on their arguments and has no side effects, otherwise the cached result can become incorrect. The cache key is usually built from serialized arguments (e.g. JSON.stringify(args) for simple values) — for objects and functions as arguments this doesn't work directly, and a WeakMap is often used instead of a plain object cache, so the cache automatically 'forgets' key objects that are no longer used elsewhere. In React, memoization is built in as a first-class primitive via useMemo/useCallback/React.memo — they solve the same 'don't recompute the same thing twice' problem, but applied to component renders rather than arbitrary functions.",
    pitfalls: [
      "Memoizing a function with side effects or a dependency on external mutable state.",
      "Using a plain Map as the cache with no size limit — with a wide variety of arguments, this becomes a memory leak.",
    ],
  },
  "js-recursion": {
    title: "Recursion",
    shortExplanation:
      "Recursion is a technique where a function calls itself to solve a smaller version of the same problem, until it reaches a base case that stops further calls.",
    detailedExplanation:
      "Any correct recursive function needs two parts: a base case (a condition where the function returns a result without recursing further) and a recursive case (a call to itself with a 'reduced' version of the input, moving toward the base case). Recursion feels especially natural for structures that are themselves recursive — trees (the DOM, a component tree, nested categories), linked lists, traversing arbitrarily nested objects. In JavaScript, recursion has a practical limit — the call stack size: very deep recursion (tens of thousands of nested calls) will overflow the stack, and in such cases an iterative solution with an explicit stack/queue is preferable, or (in languages that support it) tail recursion — in JS, tail recursion isn't optimized by engines, despite formally being part of the ES6 spec.",
    pitfalls: [
      "Forgetting or incorrectly defining the base case — infinite recursion until stack overflow.",
      "Using deep recursion to traverse potentially very large structures (e.g. arbitrary JSON from a server) without accounting for the stack limit.",
    ],
  },
};
