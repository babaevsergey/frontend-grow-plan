import type { ContentTranslationMap } from "../types";

export const reactEn: ContentTranslationMap = {
  "react-rendering": {
    title: "Rendering",
    shortExplanation:
      "Rendering is the process where React calls a component function to get a description of what should be on screen (a tree of React elements from JSX). Render itself is just an in-memory computation, not a DOM change — real DOM nodes get updated later, in a separate commit phase.",
    detailedExplanation:
      "A render is triggered by one of three reasons: the component's own state changed, a context it reads changed, or its parent re-rendered (by default React then calls every child too, even without their props changing). During render, React literally calls your component function like any regular JS function. The JSX inside it is sugar over React.createElement(...), so the result is a plain tree of JS objects (the React Element Tree, often called the 'virtual DOM'), not markup. The browser isn't involved yet — it's a pure in-memory computation.\n\nNext comes the reconciliation phase: React compares the new element tree against the tree from the previous render — by node type and key — and computes the minimal set of real changes to apply. If a <button> was in the same spot before and is still a <button> now with different text, React only updates the text node inside it rather than recreating the DOM element from scratch. If the element type changed (say, <button> became <a>), the old DOM node is fully removed and a new one created — along with all state of any child components inside it.\n\nOnly after the change list is computed does React move to the commit phase — this is where, and only where, the actual browser DOM changes, browser layout/paint kicks in, and only after that do effects (useEffect/useLayoutEffect) fire. If diffing found nothing to change (the new element tree is identical to the previous one), commit can be empty: React 'rendered' the component — called the function and diffed it — but never touched a single DOM node.\n\nThis leads to an important practical rule: a component function should be pure with respect to rendering — it shouldn't mutate outside variables, make network requests, or touch the DOM directly in the function body. React doesn't guarantee it calls a component exactly once per update: in React Strict Mode (development only), components are deliberately called twice in a row specifically to surface such side effects hidden in render. Anything that needs to 'really happen' — fetching data, subscribing to an event, manual DOM work — belongs in useEffect, which React runs after commit, not during render itself.\n\nIn practice, this distinction between 'render' and 'commit' is what gets confused most often when optimizing performance. React DevTools Profiler shows renders (how many times the function was called and how long that took), not just actual DOM changes — so a component can show '50 re-renders' in the profiler while never having changed a single pixel on screen. Telling apart 'an extra function call' from 'an extra DOM update' is exactly what the Re-render and Memoization topics dig into further.",
    pitfalls: [
      "Confusing 'render' with 'DOM update' — these are different phases.",
      "Assuming a component render is always expensive — often it's not the function itself but side effects inside it that are costly.",
    ],
    practiceTask:
      "Add a console.log to a component and observe how many times it renders under different actions: clicking a button inside the component, clicking a button in the parent, changing unrelated state.",
  },
  "react-re-render": {
    title: "Re-render",
    shortExplanation:
      "A re-render is a repeat call of a component, triggered by a change in state, props, or context, or by the parent re-rendering.",
    detailedExplanation:
      "React re-renders a component in three main cases: its own state changed, a context it reads changed, or its parent re-rendered (by default all children re-render too, even if their props didn't change). This is normal React behavior, not a bug. It becomes a problem when re-renders happen too often or touch expensive parts of the tree — that's when memo, useMemo, useCallback, or rethinking component composition come into play.",
    pitfalls: [
      "Wrapping everything in memo 'just in case' — this adds the overhead of comparing props.",
      "Forgetting that a new object/array/function in props on every render makes memo useless.",
    ],
    practiceTask:
      "Build a Parent with state and a Child with no props. Wrap Child in React.memo and check via console.log whether it now re-renders when Parent's state changes.",
  },
  "react-custom-hooks": {
    title: "Custom Hooks",
    shortExplanation:
      "A custom hook is a plain function whose name starts with 'use', which reuses state and effect logic across components.",
    detailedExplanation:
      "Custom hooks don't add any new React capability — they just let you extract repeated logic (event subscriptions, localStorage access, debounce) into a separate reusable function. Inside a custom hook you can use any other hooks (useState, useEffect, other custom hooks). The main rule is following the 'Rules of Hooks': call hooks only at the top level of a function and only from React functions (components or other hooks).",
    pitfalls: [
      "Calling hooks inside conditions, loops, or after a return — violates the Rules of Hooks.",
      "Making a hook too 'smart' and tied to one specific component — loses reusability.",
    ],
    practiceTask:
      "Write useLocalStorage(key, initialValue), which reads a value from localStorage on init and syncs it on every change.",
  },
  "react-stale-closure": {
    title: "Stale Closure",
    shortExplanation:
      "A stale closure is a situation where a function (say, inside useEffect or setTimeout) 'remembers' an old value of a variable from a previous render instead of the current one.",
    detailedExplanation:
      "Every render of a component creates new closures for every function inside it, including event handlers and callbacks in useEffect. If such a function is kept around 'for a while' (say, via setTimeout, setInterval, or an event subscription) and the useEffect dependency array is wrong (e.g. empty), the function keeps using the variable values from the render it was created in — even if state has changed since.",
    practiceTask:
      "Reproduce the bug from the example, then fix it two different ways: via useEffect dependencies and via useRef.",
  },
  "react-memoization": {
    title: "Memoization",
    shortExplanation:
      "Memoization is caching the result of a computation or object so it isn't needlessly recreated on every render.",
    detailedExplanation:
      "React has three main memoization tools: useMemo — caches a value (say, an expensive computation's result, or a new object/array), useCallback — caches a function reference, React.memo — caches an entire component's render result based on a props comparison. Memoization doesn't speed up the first render itself — it helps avoid redundant work on subsequent renders when the inputs haven't changed.",
    pitfalls: [
      "Memoizing everything 'for performance' without profiling.",
      "Forgetting a complete dependency list in useMemo/useCallback, getting stale values.",
    ],
    practiceTask:
      "Take a list of 10,000 items, add heavy sorting without useMemo and with useMemo, and compare via React DevTools Profiler.",
  },
  "react-component-lifecycle": {
    title: "Component Lifecycle",
    shortExplanation:
      "A component's lifecycle is the sequence of stages from appearing in the tree (mount) through updates to removal (unmount); in function components it's expressed not as separate methods but as a combination of the render itself and useEffect with different dependency sets.",
    detailedExplanation:
      "In class components, the lifecycle was an explicit set of methods: componentDidMount (after the first render), componentDidUpdate (after each subsequent one), componentWillUnmount (before removal). In function components these three moments are expressed through the same hook: useEffect(fn, []) is equivalent to didMount, useEffect(fn, [dep]) is didUpdate for a specific dependency, and the function returned from useEffect plays the role of willUnmount, running before the next run of the effect or before unmount. The key difference in the functional model: you describe the effect as synchronizing with specific values (dependencies) rather than tying it directly to lifecycle phases — React decides on its own when to 'undo' the previous effect and 'apply' the new one.",
    pitfalls: [
      "Porting class lifecycle-method logic 1-to-1 without rethinking dependencies — often causes extra or missing effect re-runs.",
      "Forgetting a cleanup function where an effect subscribes to something external (WebSocket, addEventListener, a timer).",
    ],
  },
  "react-reconciliation": {
    title: "Reconciliation",
    shortExplanation:
      "Reconciliation is the algorithm React uses to compare the new element tree against the previous one and compute the minimal set of changes that actually need to be applied to the DOM.",
    detailedExplanation:
      "React doesn't compare trees via a full pairwise comparison of every node (which would be O(n^3) and impractical for UI) — instead it uses a heuristic O(n) algorithm based on two assumptions: elements of different types produce different trees (so React fully recreates a subtree when a node's type changes, rather than trying to 'adapt' it), and key helps identify which list items stayed the same between renders even if their order changed. Without a key (or with key={index}), React matches list items by position, which, when an item is inserted/removed in the middle of a list, leads to incorrect matching — state 'slides' onto other items. With a proper stable key (say, a record's id), React correctly understands which DOM node corresponds to which data item, even if the list's order or composition changed.",
    pitfalls: [
      "Using index as key can lead to bugs when a list changes.",
      "Treating reconciliation as just 'a virtual DOM diff algorithm' without understanding it's deliberately heuristic, not a universal exact diff.",
    ],
  },
  "react-fiber": {
    title: "React Fiber",
    shortExplanation:
      "Fiber is React's internal architecture (since version 16) that represents the component tree as a linked list of 'fiber' nodes, letting React interrupt, pause, and resume the render process in pieces rather than run it as one unbroken synchronous pass.",
    detailedExplanation:
      "Before Fiber (React 15 and earlier), rendering the whole tree was a single synchronous recursive function — it couldn't be interrupted, and a large component tree could block the main thread for a noticeable time, causing UI freezes. Fiber turns the component tree into a linked list of nodes with explicit links to a child, the next 'sibling', and the parent — this lets React walk the tree iteratively, frame by frame, and pause at any point to hand control back to the browser (so it can handle user input or paint a frame), then resume from the same spot. Fiber's architecture is exactly what underlies React's concurrent mode: the ability to prioritize different updates (urgent text input matters more than a background list update) and features like useTransition/useDeferredValue, which couldn't physically exist under the old synchronous render model.",
    pitfalls: [
      "Treating Fiber as 'just an optimization' — it's actually a change to the render execution model itself, which opened up a whole class of new capabilities.",
      "Confusing Fiber (the internal work-scheduling mechanism) with the Virtual DOM (the data structure describing the UI) — related, but different things.",
    ],
  },
  "react-batching": {
    title: "Batching",
    shortExplanation:
      "Batching combines multiple setState calls happening within one 'event' into a single re-render instead of one re-render per call.",
    detailedExplanation:
      "Before React 18, batching only worked inside React's own event handlers (onClick, onChange) — if several setState calls happened inside a setTimeout, a promise, or a native event handler, each one caused a separate synchronous re-render. React 18 introduced automatic batching: updates get batched regardless of where they're triggered from — inside promises, timers, native handlers — noticeably cutting the number of unnecessary renders with no changes to component code. If, for some reason, you need to force a synchronous render right after a specific setState (a rare case, usually for measuring the DOM right after an update), flushSync exists for that, explicitly opting a specific update out of batching.",
    pitfalls: [
      "Assuming state has 'already updated' immediately after a setState call within one handler — the update is applied asynchronously after batching, not instantly.",
      "Overusing flushSync where regular batching would be more performant and sufficient.",
    ],
  },
  "react-rules-of-hooks": {
    title: "Rules of Hooks",
    shortExplanation:
      "Two strict rules for using hooks: call them only at the top level of a function component (not inside conditions, loops, or nested functions) and only from React components or other hooks — these rules exist not as a style preference but because React's correctness depends on them.",
    detailedExplanation:
      "React doesn't store hooks by variable name — it matches useState/useEffect/... calls by their call order within a specific render, using an internal linked list. If a hook is conditionally skipped (if (condition) { useState(...) }), the ordinal positions of every subsequent hook in that render shift relative to the previous render, and React ends up associating state with the wrong hook — leading to hard-to-track bugs rather than a compile error. The rule 'call hooks only from components/other hooks' ensures React can actually track which 'place in the tree' a given hook call belongs to — a regular (non-hook) function is invisible to React from this tracking mechanism's perspective. The eslint-plugin-react-hooks ESLint plugin's rules-of-hooks rule is the standard way to catch violations of these rules automatically, before they ship to production as a hard-to-find bug.",
    pitfalls: [
      "Wrapping a hook call in a condition or an early return placed before the hooks.",
      "Ignoring eslint-plugin-react-hooks warnings, treating them as 'just style' rather than protection against real state bugs.",
    ],
  },
  "react-usestate": {
    title: "useState",
    shortExplanation:
      "useState is the base hook for local component state: it returns a pair [value, setter], and calling the setter schedules a re-render with the new value rather than changing the value immediately and synchronously.",
    detailedExplanation:
      "The argument passed to useState is only used on the component's very first render — on subsequent renders React ignores it and returns the current stored state value. If the initial value is computed via an expensive operation, instead of useState(computeExpensive()), pass a function: useState(() => computeExpensive()) — 'lazy initialization', which runs only once, on mount, rather than on every render (even though the result is ignored on repeat renders anyway, computeExpensive() would otherwise be called pointlessly every time). The setter supports a functional form, setValue(prev => prev + 1), which is guaranteed to work off the actual previous value even with several updates in a row within one event — unlike setValue(value + 1), which uses the value captured by the current render's closure and can produce the wrong result when several updates are batched.",
    pitfalls: [
      "Updating state repeatedly via 'value + 1' instead of the functional form, expecting a cumulative effect.",
      "Passing an expensive computation's result directly into useState instead of lazy initialization via a function.",
    ],
  },
  "react-useeffect": {
    title: "useEffect",
    shortExplanation:
      "useEffect synchronizes a component with something external to React (network, subscriptions, timers, direct DOM work) and runs after React has already updated the real DOM (after commit), not during the render itself.",
    detailedExplanation:
      "The dependency array isn't just 'a list of variables that should restart the effect when they change' — it's a declaration of everything the effect actually reads from scope outside itself, within the component: if the effect uses a prop or state, it must be listed as a dependency, otherwise the effect will keep working with the value frozen at the time it was created (a stale closure) rather than the current one. An empty dependency array [] means 'run once on mount and never again', while omitting the array entirely means 'run after every single render' — different, easily confused modes. The cleanup function returned from an effect runs before every subsequent run of that same effect and before unmount — it's required for anything that 'opens' something external (a subscription, a connection, a timer), to avoid accumulating duplicate subscriptions every time the effect re-runs.",
    pitfalls: [
      "Ignoring exhaustive-deps warnings and adding dependencies 'selectively', manually deciding which matter and which don't.",
      "Confusing an empty dependency array [] (run once) with no array at all (run after every render).",
    ],
  },
  "react-uselayouteffect": {
    title: "useLayoutEffect",
    shortExplanation:
      "useLayoutEffect looks like useEffect in signature but runs synchronously right after React updates the DOM, and before the browser gets to paint that frame on screen — used when you need to measure or adjust the DOM before the user sees an intermediate state.",
    detailedExplanation:
      "useEffect runs asynchronously after paint — meaning that if you change the DOM inside the effect (say, positioning a tooltip based on an element's measured size), the user can briefly see the 'wrong' position before the effect gets a chance to fix it (a visual flicker). useLayoutEffect blocks the browser from painting the frame until it finishes — so it's guaranteed to complete before anything becomes visible to the user, at the cost that heavy work inside useLayoutEffect actually delays the screen paint. Typical legitimate uses for useLayoutEffect: measuring a DOM node's size/position via getBoundingClientRect for precise positioning (tooltips, popovers), synchronously correcting scroll position. For the vast majority of effects (requests, subscriptions, logging), the right choice is useEffect, not useLayoutEffect, because blocking paint unnecessarily hurts perceived performance.",
    pitfalls: [
      "Using useLayoutEffect 'just in case' instead of useEffect everywhere — unnecessarily blocks paint and hurts performance.",
      "Doing heavy synchronous computation inside useLayoutEffect — it directly delays the frame appearing on screen.",
    ],
  },
  "react-useref": {
    title: "useRef",
    shortExplanation:
      "useRef creates a mutable container object { current: value } that persists across a component's renders, but, unlike useState, changing current does NOT trigger a re-render.",
    detailedExplanation:
      "useRef is used in two fundamentally different scenarios: as a reference to a real DOM node (passed to a JSX element's ref attribute to get direct DOM access outside React's declarative model — e.g. for .focus() or measuring size), and as a 'mutable box' for an arbitrary value that needs to persist across renders but shouldn't trigger a repaint when it changes (a timer id, a render counter, a prop's previous value for comparison). The key difference from a regular variable inside a component function: a regular variable is recreated fresh on every render and loses its value, while ref.current is the same object, physically surviving every render of the component. Mutating ref.current directly (unlike setState) can be done synchronously at any time — but that's exactly why changing a ref doesn't update what the user sees on screen, unless that change is separately accompanied by a setState call.",
    pitfalls: [
      "Storing a value in a ref that actually needs to be shown in the UI, then being confused that the interface doesn't update when it changes.",
      "Reading/writing ref.current right during render (rather than in an effect or handler) — this breaks render's predictability as a pure function.",
    ],
  },
  "react-usememo": {
    title: "useMemo",
    shortExplanation:
      "useMemo caches an expensive computation's result across renders and only recomputes it when at least one of the listed dependencies has changed.",
    detailedExplanation:
      "Without useMemo, an expensive computation (say, filtering and sorting a large array) would run again on every render of the component, even if the data it depends on hasn't changed — useMemo(() => computeExpensive(data), [data]) guarantees a recompute only when data changes. It's important to understand useMemo is an optimization, not a guarantee: React documents that in rare cases (e.g. to free memory under resource pressure) it may 'forget' a cached value and recompute it even though dependencies haven't changed, so the computation inside useMemo must be pure and free of side effects the rest of the code relies on. useMemo's second major use isn't saving computation per se, but preserving referential equality of an object/array across renders: creating a new props object on every render breaks a child component's React.memo (it always sees 'new' props by reference), and useMemo lets you return the exact same object as long as its logical content hasn't changed.",
    pitfalls: [
      "Wrapping cheap, simple computations in useMemo 'just in case' — useMemo itself isn't free either (comparing dependencies, cache memory).",
      "Forgetting React can drop the useMemo cache in rare cases, and relying on it as a guarantee of a side effect rather than just an optimization.",
    ],
  },
  "react-usecallback": {
    title: "useCallback",
    shortExplanation:
      "useCallback is useMemo's special case specifically for functions: it returns the exact same function reference across renders as long as the listed dependencies haven't changed, instead of creating a new function on every render.",
    detailedExplanation:
      "In JavaScript, every function (...) {...} or (...) => {...} declaration creates a new function object, even if the body is textually identical to the previous one — so a regular handler declared right in the component body will be 'new' by reference on every render. This doesn't matter on its own, but becomes a problem if that function is passed as a prop to a child component wrapped in React.memo — a 'new' function reference makes memo conclude the props changed, and it re-renders the child pointlessly. useCallback(fn, deps) is essentially equivalent to useMemo(() => fn, deps) — it doesn't speed up the function itself, it just keeps its reference stable across renders as long as dependencies haven't changed, which is what actually makes memoizing child components effective.",
    pitfalls: [
      "Wrapping every handler in useCallback 'out of habit', even when it's never passed as a prop to a memoized component.",
      "Forgetting dependencies inside useCallback — a stable reference to a function with a stale closure is just as dangerous as a regular stale closure.",
    ],
  },
  "react-context": {
    title: "Context",
    shortExplanation:
      "Context lets you pass a value through the component tree without explicitly threading it through props at every intermediate level ('prop drilling') — a Provider sets a value at the top, and any component inside can read it via useContext.",
    detailedExplanation:
      "Context solves the problem of passing data needed by many components at different nesting levels (theme, current user, locale) without dragging it through props via every intermediate component that doesn't need the data itself, just to pass it along. A key performance characteristic: when the Context value changes, EVERY component reading that context via useContext re-renders, regardless of which part of the value it actually needs — if a Context holds { user, theme, notifications } as one object, changing notifications re-renders components that only need theme too. That's exactly why Context isn't a substitute for a proper state manager for frequently changing data: for large apps with frequent updates, Zustand/Redux/Jotai are preferred, letting you subscribe to just the specific slice of state you need, or a single large context gets split into several smaller ones, each with its own Provider.",
    pitfalls: [
      "Putting many unrelated, frequently changing values into one Context — any field changing re-renders every consumer.",
      "Using Context as a substitute for a proper state manager for frequently updated data (e.g. form state on every keystroke).",
    ],
  },
  "react-controlled-vs-uncontrolled": {
    title: "Controlled vs Uncontrolled Components",
    shortExplanation:
      "A controlled component stores a field's value in React state, and the DOM element always mirrors exactly that state (value + onChange); an uncontrolled component stores the value in the DOM itself, and React only reads it when needed, usually via a ref.",
    detailedExplanation:
      "In the controlled approach, an input's value always equals the React state value, and onChange updates that state on every change — this gives React full real-time control over the value: you can validate on every keystroke, format input on the fly, sync multiple fields together. In the uncontrolled approach (value isn't set by React; defaultValue and a ref are used instead), the DOM itself holds the current value, and React only reads it at a specific moment — say, on form submit via inputRef.current.value — which removes the overhead of a re-render on every keystroke, but doesn't give real-time validation/formatting without extra handlers. Form libraries like React Hook Form are deliberately built around the uncontrolled approach as their default mode precisely for performance on large forms, adding Controller as an explicit adapter for integrating with controlled UI components (like custom selects or date pickers).",
    pitfalls: [
      "Mixing controlled and uncontrolled on the same field (sometimes passing value, sometimes not) — React correctly warns about this in the console.",
      "Defaulting to the controlled approach for very large forms with no real need for per-keystroke validation — loses performance for no benefit.",
    ],
  },
  "react-error-boundaries": {
    title: "Error Boundaries",
    shortExplanation:
      "An error boundary is a component (must be a class — there's no hook for this) that catches JavaScript errors occurring while rendering its child components and shows fallback UI instead of the whole tree crashing.",
    detailedExplanation:
      "An error boundary is implemented via two special class-component methods: the static getDerivedStateFromError(error), which updates state so the next render shows fallback UI, and componentDidCatch(error, info), used for logging the error (e.g. to Sentry). An error boundary only catches errors during rendering, in lifecycle methods, and in constructors of components BELOW it in the tree — it doesn't catch errors in its own event handlers (onClick and similar throw synchronously and need a regular try/catch), in async code (setTimeout, promises), or in itself. In practice, error boundaries are wrapped around individual independent parts of the UI (a widget, a page section) rather than the whole app at once, so one widget crashing doesn't bring down the entire screen — the rest keeps working.",
    pitfalls: [
      "Expecting an error boundary to catch an error from async code or an event handler — that's outside its responsibility.",
      "Wrapping an error boundary around the entire app as one big block — any widget crashing takes down the whole screen instead of an isolated fragment.",
    ],
  },
  "react-suspense": {
    title: "Suspense",
    shortExplanation:
      "Suspense lets a component 'pause' rendering until the data or code it needs (a lazily loaded component) is ready, and shows fallback UI (usually a spinner or skeleton) instead of an incomplete intermediate state.",
    detailedExplanation:
      "Originally, Suspense supported only one scenario out of the box — code splitting via React.lazy(() => import('./Component')): while the component's module hasn't loaded over the network yet, Suspense shows a fallback, and once it loads, the real component. As the ecosystem evolved (Next.js App Router, React Server Components, data libraries like Relay), Suspense learned to work with data loading too: a component that hasn't received its data yet can 'throw' a promise, and the nearest parent Suspense catches this, shows a fallback, and automatically retries rendering once the promise resolves. Several Suspense boundaries can be nested so different parts of a page show their own fallback independently and load in parallel without blocking each other — especially valuable for SSR streaming, where the server can send the browser already-ready parts of a page without waiting for the slowest ones.",
    pitfalls: [
      "Trying to implement data Suspense manually without a library supporting that contract (throwing a promise) — non-trivial and easy to get wrong.",
      "Wrapping an entire page in one Suspense boundary instead of several nested ones — loses the ability to load different sections independently in parallel.",
    ],
  },
  "react-concurrent-rendering": {
    title: "Concurrent Rendering",
    shortExplanation:
      "Concurrent rendering is a React mode where a render doesn't have to be one unbroken synchronous block: React can start rendering an update, pause it if something more urgent arrives, and either continue later or discard the uncommitted result entirely.",
    detailedExplanation:
      "In synchronous (legacy) mode, any state update renders fully and immediately, blocking the main thread until it finishes — if that update touches a heavy component tree, user input (a keypress, a click) will feel 'frozen' until that render completes. Concurrent mode (enabled via createRoot instead of the legacy ReactDOM.render) lets React work on a render 'in the background' without immediately committing changes to the DOM, and explicitly prioritize: urgent updates (a direct response to user input) are handled immediately, while low-priority ones (say, updating search results as you type) can be interrupted and recomputed if the user keeps typing. Importantly, concurrent rendering is first and foremost a capability enabled by infrastructure (createRoot) and explicitly used via APIs like useTransition/useDeferredValue/Suspense — not automatic behavior that magically speeds up all existing code with no changes.",
    pitfalls: [
      "Expecting an automatic performance boost purely from switching ReactDOM.render to createRoot without using specific concurrent APIs.",
      "Confusing concurrent rendering with multithreading — React still runs on a single JS thread, it just schedules the order and priority of work within it differently.",
    ],
  },
  "react-usetransition": {
    title: "useTransition",
    shortExplanation:
      "useTransition marks a specific state update as 'non-critical' (a transition) — React can delay or interrupt its render in favor of more urgent updates (say, reacting to the next keystroke), keeping the interface responsive.",
    detailedExplanation:
      "The hook returns a pair [isPending, startTransition]: startTransition wraps a setState call that can logically 'wait' (say, updating a large list of search results), and isPending is a boolean that becomes true while that deferred update hasn't been applied yet, handy for showing a lightweight loading indicator without blocking the rest of the UI. The key difference from a simple debounce: a transition doesn't artificially delay execution by time — it lets React start rendering the update immediately in the background, but if a more urgent update comes in (a new keystroke), it interrupts the unfinished transition and starts over with the latest data, instead of just waiting out a fixed pause. Urgent updates (say, the input's own value, which needs the cursor and text to not 'lag') are kept outside startTransition, while heavier things derived from them are wrapped in a transition.",
    pitfalls: [
      "Wrapping an update the user expects instant feedback from (say, a text field's own value) in startTransition — creates a sense of input lag.",
      "Confusing useTransition with useDeferredValue — the former wraps a setState call, the latter works with an already-existing value, delaying its use in a heavy part of the tree.",
    ],
  },
  "react-usedeferredvalue": {
    title: "useDeferredValue",
    shortExplanation:
      "useDeferredValue returns a 'deferred' copy of a value that can briefly lag behind the current one during an intensive update, letting React render the urgent parts of the UI first and the heavy ones with a slight delay.",
    detailedExplanation:
      "Unlike useTransition, which wraps a specific setState call in the component producing the value, useDeferredValue is applied in the component consuming the value, and doesn't need control over where it comes from (handy if the value arrives as a prop from outside rather than local useState). React renders the component with the deferred value twice for one logical update: first with the old (still fast) value, so as not to block urgent input, then, in the background, with the new value — if the user changes input again during that background render, the unfinished attempt is interrupted and restarted with the freshest value. It's worth comparing the useDeferredValue result to the previous one (by reference) to, say, show a visual indication of 'stale' results (reduced opacity) while the background render with the current value hasn't finished yet.",
    pitfalls: [
      "Expecting useDeferredValue to have a predictable fixed delay like debounce — the actual lag depends on render workload and isn't guaranteed.",
      "Using useDeferredValue where the value is produced in the same component and it would be more convenient to just use useTransition around setState.",
    ],
  },
};
