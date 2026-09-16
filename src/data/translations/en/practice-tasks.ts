import type { ContentTranslationMap } from "../types";

export const practiceTasksEn: ContentTranslationMap = {
  "practice-use-debounce": {
    title: "useDebounce",
    shortExplanation:
      "Debounce delays a function's execution until a given pause with no new calls has passed — useful for search-as-you-type.",
    detailedExplanation:
      "A classic task for understanding timers and hooks. useDebounce(value, delay) should return a 'delayed' version of the value: every time value changes, a new timer for delay milliseconds starts, and the previous timer is canceled. Only once the user has stopped typing for delay milliseconds does the hook return the new value — this reduces the number of network requests during search-as-you-type.",
    pitfalls: [
      "Forgetting to clear the previous timer (clearTimeout) — leftover delayed calls pile up.",
      "Debouncing the event handler itself instead of the value — complicates testing and reuse.",
    ],
    practiceTask:
      "Build a search field that only 'requests' (e.g. console.log) 400ms after the user stops typing.",
  },
  "practice-use-throttle": {
    title: "useThrottle",
    shortExplanation:
      "Throttle guarantees a function is called at most once per given interval, regardless of how often events fire.",
    detailedExplanation:
      "Useful for events that fire very frequently (scroll, resize, mousemove) where handling every single event is expensive, but fully deferring the reaction (as debounce does) is undesirable — the user needs feedback 'along the way', just not on every pixel. The implementation typically stores 'the last call happened at time X' and ignores new calls until the interval has passed.",
    pitfalls: [
      "Using throttle where debounce is actually needed (e.g. for a search input) — the UI ends up making extra requests.",
      "Forgetting about the 'last' skipped call at the end of an event burst — sometimes the final value needs to be guaranteed to be processed.",
    ],
    practiceTask:
      "Build an article read-progress indicator that updates on scroll no more often than once every 100ms.",
  },
  "practice-use-local-storage": {
    title: "useLocalStorage",
    shortExplanation:
      "A hook that syncs React state with localStorage: reads the value on init and saves it on every change.",
    detailedExplanation:
      "This task checks understanding of side effects, serialization (JSON.stringify/parse), and error handling (localStorage may be unavailable, the value could be corrupted JSON). A good implementation lazily reads the initial value (via a function in useState, not on every render), safely handles JSON.parse, and wraps the setter to update both state and localStorage together.",
    pitfalls: [
      "Not wrapping JSON.parse in try/catch — corrupted data in localStorage will crash the app.",
      "Reading localStorage without checking typeof window !== 'undefined' in an SSR environment (Next.js).",
    ],
    practiceTask:
      "Use useLocalStorage to persist the selected theme (light/dark) and verify the value survives a page reload.",
  },
  "practice-use-fetch": {
    title: "useFetch",
    shortExplanation:
      "A simple hook for fetching server data with loading/error/data states — a learning-scale analog of what libraries like TanStack Query solve.",
    detailedExplanation:
      "This task helps you understand what any data-fetching library is 'made of': you need to track three states (loading, error, data), correctly handle request cancellation on unmount or url change (via AbortController), and avoid race conditions — if the url changes before the first response arrives, the stale response must be ignored.",
    pitfalls: [
      "Not canceling the previous request when the url changes — a race condition can show stale data as current.",
      "Forgetting to check err.name === 'AbortError', causing a canceled request to be mistakenly shown as a real error.",
    ],
    practiceTask:
      "Build a search input that calls useFetch(`/api/search?q=${query}`) on every query change, and verify that rapid retyping doesn't cause old results to 'flash'.",
  },
  "practice-promise-all": {
    title: "Promise.all",
    shortExplanation:
      "Promise.all runs several promises in parallel and waits for all of them to settle — if even one rejects, the whole Promise.all rejects immediately.",
    detailedExplanation:
      "This is one of the basic tasks for understanding async in JS. It's important to understand the difference from sequential await in a loop: await in a loop runs requests one after another (slower if they're independent), while Promise.all launches them all at once and waits for the slowest. Also worth knowing is Promise.allSettled — an analog that doesn't 'fail' on the first error but returns each promise's outcome (fulfilled or rejected).",
    pitfalls: [
      "Using await in a loop for independent requests, losing parallelism for no reason.",
      "Not handling partial failure — if a result is needed per request individually, Promise.all isn't the right tool.",
    ],
    practiceTask:
      "Write a function that loads three users' data in parallel by id via Promise.all, and separately a version via Promise.allSettled that doesn't fail if one id is invalid.",
  },
  "practice-deep-clone": {
    title: "deepClone",
    shortExplanation:
      "Deep cloning creates a fully independent copy of an object/array, including all nested structures, rather than just a top-level copy.",
    detailedExplanation:
      "A regular assignment ({ ...obj } or Object.assign) copies only the top level (shallow copy) — nested objects and arrays remain shared references between the original and the copy. The deepClone task checks the ability to recursively traverse a data structure, handle arrays, objects, and primitives separately, and (in harder versions) special types like Date, Map, Set, plus circular references.",
    pitfalls: [
      "Not handling circular references — the recursion runs forever or crashes with a stack overflow.",
      "Not distinguishing arrays from objects when creating the result — the structure's type gets lost.",
    ],
    practiceTask:
      "Extend the deepClone from the example so it specially handles Date values (cloning as a new Date instead of a plain object).",
  },
  "practice-group-by": {
    title: "groupBy",
    shortExplanation:
      "groupBy groups array elements into an object by a key computed from each element — e.g. a list of orders grouped by status.",
    detailedExplanation:
      "A classic task for working with reduce and types (generics). The function takes an array and a function that gets a key for each element, and returns an object where each key is one of the values and the value is an array of elements with that key. Practically useful for preparing data for a UI: grouping tasks by status, orders by date, products by category.",
    pitfalls: [
      "Not constraining K to string | number — TypeScript won't let you use an arbitrary type as an object key.",
      "Mutating the source array instead of building a new grouping object.",
    ],
    practiceTask:
      "Group a list of users by the first letter of their name and by age group (e.g. '18-25', '26-35') using a single groupBy function.",
  },
  "practice-memoize": {
    title: "memoize",
    shortExplanation:
      "memoize is a higher-order function that caches another function's result by its arguments, so the same thing isn't computed twice.",
    detailedExplanation:
      "A simple implementation keeps a Map where the key is the serialized arguments (e.g. JSON.stringify(args)) and the value is the call's result. On a repeat call with the same arguments, the function isn't re-executed — the cached result is returned immediately. Limitations of the simple approach: serializing arguments via JSON.stringify doesn't work for functions, Map/Set, or circular structures, and the cache grows unbounded with no eviction strategy (LRU, etc.).",
    pitfalls: [
      "Memoizing functions with side effects or non-deterministic results — the cache returns the wrong result.",
      "Not bounding the cache's size — with many unique arguments, memory usage grows into a leak.",
    ],
    practiceTask:
      "Measure the execution time of an expensive recursive function (e.g. naive Fibonacci) before and after memoize on repeated identical calls.",
  },
  "practice-sum-curried": {
    title: "sum(...args) / curried sum",
    shortExplanation:
      "A classic task on rest parameters, closures, and (in the harder version) currying: the function must support both sum(1, 2, 3) and sum(1)(2)(3), returning a number only on explicit coercion to a primitive or a call with no arguments.",
    detailedExplanation:
      "The simple version — sum(...args) — is trivial via rest parameters and reduce. The harder version (a curried sum supporting sum(1)(2)(3)) requires every call to return a function that either takes the next argument, or (when called with no arguments or via valueOf/toString) returns the accumulated sum — this needs a closure holding the running total between calls, and overriding valueOf so that sum(1)(2)(3) + 0 or console.log(String(sum(1)(2)(3))) works correctly.",
    pitfalls: [
      "Forgetting that without overriding valueOf/toString, the curried sum's result stays a function rather than a number under regular output.",
      "Not resetting the accumulated total between independent sum(...) call chains — each call to sum(a) must start a fresh closure.",
    ],
    practiceTask:
      "Implement a sum function that works both as sum(1, 2, 3) === 6 and as sum(1)(2)(3) === 6 (under explicit coercion to a number).",
  },
  "practice-accumulate-closure": {
    title: "accumulate() via Closure",
    shortExplanation:
      "A closures task: a factory function creates an 'accumulator' that, on every call, adds a new value to internal state and returns the current sum (or an array of all values) — the state lives in the outer function's variable, not directly accessible from outside.",
    detailedExplanation:
      "The key idea is closure: the inner function 'remembers' a variable from the outer function even after the outer function has finished running, and that variable has no global scope — the only way to change it is to call the returned function itself. This is a classic way to implement private state in JS without classes or modules — each call to the factory (makeAccumulator()) creates an independent set of variables in its own closure, so two different accumulators don't share state.",
    pitfalls: [
      "Expecting every call to makeAccumulator() to share one common state — in reality, each call creates an independent closure.",
      "Confusing a closure with copying a value — the total variable isn't copied into the function, it's 'remembered by reference' to a specific execution context.",
    ],
    practiceTask:
      "Implement makeAccumulator(), which returns a function; each call to that function with a number adds it to the internal sum and returns the running total.",
  },
  "practice-implement-promise-all": {
    title: "Implement Promise.all from Scratch",
    shortExplanation:
      "A classic advanced task: write a myPromiseAll(promises) function that behaves like the built-in Promise.all — resolving with an array of results in the original order as soon as all promises resolve, and rejecting immediately if even one of them fails.",
    detailedExplanation:
      "The main challenge is preserving the result order even though promises may resolve in any order: the solution is to preallocate a results array of the right length and write each result at its original index (via .then closing over index), rather than just pushing to the array as responses arrive. You need to manually track the count of already-resolved promises (a counter) and call the outer promise's resolve() only once the counter matches the total number of passed promises — not on the first resolved element. Rejection must happen immediately on the first error (calling the outer promise's reject()), without waiting for the rest — just like the original Promise.all. Worth thinking through separately: the empty-array edge case (should resolve immediately with an empty array) and the fact that array elements aren't required to be promises — plain values need to be wrapped in Promise.resolve or simply treated as already-ready results.",
    pitfalls: [
      "Writing results via results.push(value) instead of by index — breaks the guaranteed result order.",
      "Forgetting to handle an empty input array as a separate edge case, for which the promise should resolve immediately with an empty array.",
    ],
    practiceTask:
      "Implement myPromiseAll(promises) without using the built-in Promise.all, preserving result order and rejecting immediately on the first error.",
  },
  "practice-unique": {
    title: "unique(array)",
    shortExplanation:
      "A task on removing duplicates from an array of primitives — the shortest solution is new Set(array), but you should also be able to explain the filter + indexOf alternative for cases where Set isn't available or a custom comparison is needed.",
    detailedExplanation:
      "new Set(array) works because a Set only stores unique values by SameValueZero comparison (similar to ===, but NaN is considered equal to itself) — wrapping it as [...new Set(array)] gives an O(n) solution with no manual loop. The alternative array.filter((item, index) => array.indexOf(item) === index) also works, but is O(n²), since indexOf re-scans the array linearly on every filter iteration — noticeably slower on large arrays. The Set-based solution only works directly for primitives; uniqueness of objects by some field needs separate logic (see uniqueBy) — comparing objects via Set/=== compares references, not content.",
    pitfalls: [
      "Using new Set() directly for object uniqueness by a field — Set compares objects by reference, not content.",
      "Not accounting for the complexity difference (O(n) vs O(n²)) when choosing a solution for potentially large arrays.",
    ],
    practiceTask:
      "Implement a unique(array) function that removes duplicate primitives from an array, and discuss the complexity of your solution.",
  },
  "practice-flatten-array": {
    title: "flatten(array)",
    shortExplanation:
      "A task on recursively 'flattening' an arbitrarily nested array into a flat array — the built-in array.flat(Infinity) solves it in one line, but you should be able to write a recursive implementation from scratch, since that's often explicitly required.",
    detailedExplanation:
      "Recursive approach: for each array element, check whether it's an array (Array.isArray) — if so, recursively 'flatten' it and add the result via spread or concat; if not, add the element as is. An iterative alternative without recursion uses a stack: push elements onto the stack, and while it's not empty, pop an element — if it's an array, unpack its elements back onto the stack; if not, add it to the result (note that order when using a stack may require reversing the result or using a queue instead of a stack to preserve the original order). Worth explicitly clarifying the flattening depth in an interview: 'one level' (like array.flat(1)) is a fundamentally simpler task than 'fully, to any depth' (array.flat(Infinity)).",
    pitfalls: [
      "Not accounting for result order when using a stack instead of a queue — you can accidentally end up with elements in reverse order.",
      "Not clarifying the required flattening depth in the interview (one level vs fully) — these are fundamentally different difficulty tasks.",
    ],
    practiceTask:
      "Implement flatten(array), recursively flattening an arbitrarily nested array into a flat array, without using array.flat().",
  },
  "practice-flatten-object": {
    title: "flattenObject(obj)",
    shortExplanation:
      "A task on recursively 'flattening' a nested object into a flat object, where nested field keys are joined with a separator (e.g. a dot) — { a: { b: 1 } } becomes { 'a.b': 1 }.",
    detailedExplanation:
      "Recursive traversal: for each object key, check whether the value is an object (and not an array/not null — typeof value === 'object' && value !== null && !Array.isArray(value)) — if so, recursively flatten that nested value, passing an accumulated key prefix (parent path + current key + separator); if not, write the value directly under the full composite key into the result object. Important edge cases worth discussing in an interview: how to handle arrays inside the object (flatten their elements by index as 'a.0', 'a.1', or leave the array as a single value with no further processing), how to handle null (typeof null === 'object', so an explicit null check is needed, otherwise the recursion would try to traverse null as an object and crash), and what to do about key collisions in the composed keys (unlikely, but theoretically possible if the source keys already contain dots).",
    pitfalls: [
      "Forgetting the null check and trying to recursively traverse null values as objects.",
      "Not agreeing in advance on how to treat arrays inside the object (flatten by index or keep as a single value) — both are valid, but give different results.",
    ],
    practiceTask:
      "Implement flattenObject(obj), flattening an arbitrarily nested object into a flat object with dot-joined composite keys.",
  },
  "practice-event-emitter": {
    title: "EventEmitter",
    shortExplanation:
      "A classic task on implementing the Observer pattern: a class with on(event, handler) to subscribe, off(event, handler) to unsubscribe, and emit(event, ...args) to call all handlers subscribed to an event with the given arguments.",
    detailedExplanation:
      "Internal state is an object or Map where the key is the event name and the value is an array (or Set) of handlers subscribed to that event; on() adds a handler to the corresponding array (creating it if the event fires for the first time), emit() finds the handler array by event name and calls each of them with the given arguments via forEach, off() removes a specific handler from the array (via filter or splice at the index found via indexOf). A useful extension is a once(event, handler) method that subscribes a handler which automatically unsubscribes itself after the first call (usually implemented via a wrapper that calls off() before invoking the original handler). Worth explicitly discussing edge cases: what happens on emit() for an event nobody is subscribed to (should simply do nothing, not throw), and what if off() is called with a handler that was never subscribed (also shouldn't throw).",
    pitfalls: [
      "Subscribing the original handler directly in once() instead of via a wrapper — then unsubscribing via off() won't work correctly.",
      "Not treating emit() for an event with no subscribers as a no-op — calling forEach on undefined without a guard check will throw.",
    ],
    practiceTask:
      "Implement an EventEmitter class with on, off, emit, and (optionally) once methods, without using Node.js's built-in EventEmitter.",
  },
  "practice-unique-by-count-by": {
    title: "uniqueBy / countBy",
    shortExplanation:
      "uniqueBy(array, keyFn) removes duplicate objects by the value returned from keyFn (e.g. by id) rather than by reference; countBy(array, keyFn) groups elements by a key and returns an object with the count of elements in each group — both tasks are solved via a Map/accumulator object in a single reduce pass.",
    detailedExplanation:
      "uniqueBy can't be solved with new Set() directly (Set compares objects by reference), so a Map is used, where the key is keyFn(item)'s result and the value is the object itself; walking the array once and writing into the Map automatically keeps only the last (or first, if a has-check is done before writing) objects with a unique key, after which the Map's values are converted back into an array via Array.from(map.values()). countBy is solved similarly via reduce with an accumulator object: for each element the group key is computed via keyFn, and that key's counter is incremented by 1 (initialized to zero if the key appears for the first time) — the result demonstrates the same 'grouping via a normalized key' idea underlying groupBy, but accumulates a count instead of elements.",
    pitfalls: [
      "Using Set instead of Map for uniqueBy when full objects, not just their keys, need to be returned.",
      "Forgetting to initialize the counter to zero on a key's first appearance in countBy — accessing a nonexistent object key gives undefined, not 0, and undefined + 1 gives NaN.",
    ],
    practiceTask:
      "Implement uniqueBy(array, keyFn) and countBy(array, keyFn) without using lodash or other third-party libraries.",
  },
  "practice-tree-traversal": {
    title: "Tree Traversal",
    shortExplanation:
      "A classic task on traversing a tree structure (e.g. a category or comment tree with nested children) — either depth-first (DFS, recursively or via an explicit stack) or breadth-first (BFS, via a queue), to collect all nodes into a flat list or find a specific node.",
    detailedExplanation:
      "DFS (depth-first traversal) is most often implemented recursively: visit the current node, then recursively traverse each of its children — a simple, short solution, but with very deep trees there's a risk of call-stack overflow; an iterative DFS version via an explicit stack solves this, but requires more care with ordering (children are usually pushed onto the stack in reverse order to preserve a 'left to right' traversal order). BFS (breadth-first traversal) fundamentally requires a queue rather than a stack: nodes are popped from the front of the queue, and their children are pushed to the back — this gives a 'level by level' traversal (all level-1 nodes first, then all level-2 nodes), unlike DFS, which first goes all the way down one branch. The choice between DFS and BFS depends on the task: DFS is more natural for 'find a path to a node' or 'sum across all nodes' type tasks, BFS for 'find the nearest matching node' or 'traverse level by level' type tasks (e.g. for a UI where display order by nesting level matters).",
    pitfalls: [
      "Using a stack (push/pop) instead of a queue (push/shift) for BFS — this effectively turns the traversal into DFS, not BFS.",
      "Not accounting for the risk of call-stack overflow with recursive DFS on very deeply nested trees — such cases need an iterative version with an explicit stack.",
    ],
    practiceTask:
      "Implement dfs(tree) and bfs(tree) functions for a tree with arbitrarily nested children, returning an array of node ids in the corresponding traversal order.",
  },
  "practice-async-retry": {
    title: "Async Retry with Backoff",
    shortExplanation:
      "A wrapper function retry(fn, options) that repeatedly calls an async function on failure up to N times, with a delay between attempts (usually growing exponentially — exponential backoff), before finally rejecting the promise.",
    detailedExplanation:
      "A basic implementation is a recursive or looped wrapper: call fn(), return the result on success; on failure, if attempts remain, wait for a delay and try again with a decremented attempt counter, otherwise finally reject with the last error received. Exponential backoff means the delay between attempts grows (usually doubles) with each subsequent attempt (e.g. 100ms, 200ms, 400ms) — this reduces load on an unstable service/network compared to a fixed delay, and is often supplemented with 'jitter' (a small random deviation from the computed delay) to avoid many clients retrying at exactly the same millisecond (thundering herd). An important edge case to discuss: not all errors deserve the same retry treatment — a temporary network error or a 503 is worth retrying, while a 400 Bad Request (a client error in the request itself) isn't, since retrying with the same data gives the same error — a quality retry implementation should accept a predicate function deciding whether a specific error is worth retrying.",
    pitfalls: [
      "Retrying any error indiscriminately, including client errors (e.g. 400), for which retrying with the same data definitely won't help.",
      "Using a fixed delay with no exponential growth and no jitter — can worsen load on an already-unstable service.",
    ],
    practiceTask:
      "Implement retry(fn, { retries, delayMs }) with exponential backoff, retrying an async call to fn on failure a given number of times.",
  },
  "practice-concurrency-limiter": {
    title: "Concurrency Limiter",
    shortExplanation:
      "A function runWithLimit(tasks, limit) that runs an array of async tasks with a cap on how many run at once — e.g. out of 100 tasks with a limit of 5, at most 5 run at any given moment, and the next task starts as soon as a 'slot' frees up.",
    detailedExplanation:
      "The naive approach (running all tasks via Promise.all) doesn't work when there are many tasks and an external resource (a server, a rate-limited API, a file system) can't handle that many concurrent requests — a genuinely bounded worker pool is needed. The classic implementation: keep a counter of active tasks and a queue of pending ones, plus a next() function that starts the next queued task if the current active count is below the limit; each running task, on completion (success or error), decrements the active counter and calls next() again so the freed 'slot' is immediately picked up by the next queued task — this creates a continuous pipeline where at most limit tasks are ever active at once. It's important to collect results in the order of the original task array (similar to the ordering problem in implementing Promise.all), not in the order of actual completion, if the caller cares about result order.",
    pitfalls: [
      "Trying to implement the limit by manually splitting into 'chunks' of limit tasks with a sequential Promise.all per chunk — this performs worse than a worker pool, since a slow task in a chunk blocks the start of the entire next chunk, even if other 'slots' freed up earlier.",
      "Forgetting to preserve results in the order of the original task array, if the calling code cares about order and not just the fact that all tasks completed.",
    ],
    practiceTask:
      "Implement runWithLimit(tasks, limit), running an array of async tasks with the number running concurrently capped at limit.",
  },
};
