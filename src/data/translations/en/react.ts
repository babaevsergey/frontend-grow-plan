import type { ContentTranslationMap } from "../types";

export const reactEn: ContentTranslationMap = {
  "react-what-is-react": {
    title: "What is React: features, advantages, 'reactivity'",
    shortExplanation:
      "React is a library (not a framework) for building user interfaces, based on the idea of describing UI as a function of state: you declaratively describe how the screen should look given some state, rather than imperatively listing the DOM operations needed to move from one state to another.",
    detailedExplanation:
      "The key features usually listed in an interview: declarativeness (a component describes 'what to show', not 'exactly how to change the DOM' — see the Rendering topic), a component-based approach (UI is assembled from independent, reusable components with their own state and logic), the Virtual DOM and efficient reconciliation of changes instead of direct real-DOM manipulation, a one-directional data flow (data flows down via props, events flow up via callbacks, making the flow predictable), and JSX as a declarative syntax for describing an element tree right inside JS. React is deliberately called a library, not a framework: it's only responsible for the presentation layer (UI) and doesn't mandate a solution for routing, networking, or global state — those are handled by separate libraries (React Router, TanStack Query, Zustand/Redux) that can be swapped independently of React.\n\nA separate subtle question is 'is React reactive?' in the strict sense of 'reactive programming' (like, say, RxJS, or Signals in some frameworks, where the system automatically tracks dependencies at the level of individual values and surgically updates only what actually changed). React is historically built differently: it isn't reactive in that narrow sense, but rather 're-renders on demand' — when state/props/context change, React re-calls the entire component function and determines the real changes by diffing trees, rather than through a fine-grained subscription system tracking specific values. That's exactly why React has memoization (useMemo/useCallback/memo) as a tool for fighting unnecessary recalculations — in a genuinely 'reactive' system (fine-grained reactivity, like Solid.js or Vue 3's Proxy-based reactivity), that kind of manual memoization is mostly unnecessary, because the system itself tracks exactly which parts of the UI depend on a changed value.",
    whereUsed:
      "Answering the general 'tell me about React' question at the start of a technical interview, discussing the choice of React versus other libraries/frameworks, talking about architectural principles (library vs framework) when choosing a stack for a new project.",
    pitfalls: [
      "Calling React a 'framework' in an interview with no clarification — formally it's a presentation-layer library, and the distinction matters for understanding why routing/state management/networking are separate, independently chosen libraries.",
      "Conflating 'React is reactive because it re-renders the UI when data changes' with the precise term 'reactive programming' (fine-grained reactivity) — these are different levels of abstraction, and it's worth showing you see the difference.",
    ],
  },
  "react-whats-new-18-19": {
    shortExplanation:
      "React 18 (2022) added concurrent rendering and automatic batching; React 19 (2024) focuses on simplifying working with async data and forms (Actions, use()) and removes boilerplate that previously required third-party libraries.",
    detailedExplanation:
      "React 18 — the main theme is concurrent rendering, i.e. React's ability to interrupt, pause, and prioritize rendering (architecturally made possible by Fiber, see the separate topic). Practical APIs built on this foundation: useTransition and useDeferredValue (marking updates as 'non-urgent', see the separate topics), automatic batching of state updates regardless of where they're triggered from (see the Batching topic — previously batching only worked inside React's own event handlers), the new Suspense for data loading (not just code splitting), and a new root API, createRoot, replacing the deprecated ReactDOM.render.\n\nReact 19 — focused on simplifying everyday patterns: use() — a hook that can be called conditionally, reading promises and context directly during render (see the separate topic); Actions and related hooks (useActionState, useFormStatus, useOptimistic) — built-in support for async form handlers with automatic pending/error state management, with no need to hand-write isSubmitting/try-catch for every form; ref as a regular prop on function components (without wrapping in forwardRef in most cases); improved support for metadata tags (title, meta, link) directly inside components without third-party libraries like react-helmet; more precise hydration error messages. Overall, React 19 doesn't change React's mental model — it removes boilerplate from scenarios that previously required third-party libraries or hand-rolled wrappers.",
    whereUsed:
      "Planning a project's migration to a new major React version, discussing stack currency in an interview, choosing between manually managing form state and the new Actions API.",
    pitfalls: [
      "Listing React 18/19 features without understanding what does (or doesn't) architecturally connect them — interviews value understanding the relationships between features, not a bare list.",
      "Assuming React 19 is 'revolutionary' the way React 18 was — in fact it's primarily a simplification of existing patterns, not a change to the fundamental rendering model.",
    ],
  },
  "react-jsx": {
    title: "JSX: how it differs from HTML and how it compiles",
    shortExplanation:
      "JSX is a JavaScript syntax extension that visually resembles HTML but compiles into regular function calls (React.createElement, or, in newer versions, the automatic JSX runtime) — meaning JSX isn't executed by the browser directly, but transformed into JS at build time (Babel/SWC/TypeScript).",
    detailedExplanation:
      "The main differences between JSX and HTML: attributes are named in camelCase (className instead of class, onClick instead of onclick, tabIndex instead of tabindex) — because ultimately they're just properties of a JS props object, not string HTML attributes; JS expressions are inserted via curly braces {expression} rather than a separate template language; JSX must return exactly one root element (or a fragment <>...</>) — unlike HTML markup, where several sibling nodes can exist at the top level; every tag must be explicitly closed, including self-closing ones (<img />, <br />), whereas in HTML this is often optional; style takes a JS object with camelCase properties, not a string ({ backgroundColor: 'red' }, not 'background-color: red'). Compilation: JSX like <div className=\"box\">{title}</div> is translated into a call to React.createElement('div', { className: 'box' }, title), whose result is a plain JS object (a React Element) — {type: 'div', props: { className: 'box', children: title }}, not a DOM node and not an HTML string. Since React 17/newer bundler versions, the automatic JSX runtime is used — the compiler automatically imports special jsx/jsxs functions from react/jsx-runtime instead of React.createElement, removing the need to write import React from 'react' in every file using JSX, but the essence of the transformation (JSX -> function call -> plain JS object) stays the same. To insert deliberately trusted raw HTML (e.g. sanitized HTML from a backend), there's dangerouslySetInnerHTML={{ __html: htmlString }} — a name deliberately made awkward, as a reminder that arbitrary unsanitized HTML here is a direct path to XSS (see the XSS/CSRF/CORS topic).",
    whereUsed:
      "Every React component technically uses JSX (or its alternative — direct createElement calls, rarely hand-written), understanding the compilation matters when debugging build errors, configuring Babel/SWC, and explaining why React doesn't need a separate template language.",
    pitfalls: [
      "Writing class instead of className, or for instead of htmlFor, out of HTML habit — in JSX these are just named JS props, not string HTML attributes.",
      "Using dangerouslySetInnerHTML with unsanitized user input — a direct path to an XSS vulnerability.",
    ],
  },
  "react-class-vs-functional": {
    title: "Class vs functional component",
    shortExplanation:
      "A class component is an ES6 class extending React.Component, with state in this.state and lifecycle methods; a functional component is a regular JS function receiving props and returning JSX, where state and side effects are plugged in via hooks. Since 2019 (React 16.8, the introduction of hooks), functional components are the recommended standard, and class components remain only in legacy code.",
    detailedExplanation:
      "In class components, state lives in a single this.state object, updated via this.setState (which shallow-merges into current state), and lifecycle logic is split across identically named methods (componentDidMount, componentDidUpdate, componentWillUnmount) — meaning related logic (say, a subscription and its own unsubscription) is forced apart into different class methods rather than living together in one place. Functional components with hooks solve exactly this problem: useEffect combines a subscription and its cleanup in one block of code, and several independent useState calls instead of one this.state avoid mixing logically unrelated pieces of state into a single object. Another practical reason for moving to functional components is logic reuse: classes relied on HOCs or render props to share stateful logic between components (both add wrapper layers to the component tree and complicate debugging in React DevTools), whereas a custom hook is just a regular function, with no change at all to the component tree's structure. this in class components was also a constant source of bugs (methods passed as callbacks lost their this context without an explicit .bind() or arrow-function class fields) — functional components have no such problem at all, because there's no this. React has no official plans to remove class components, but all new functionality (Suspense for data, use(), Actions) is designed primarily for functional components and hooks.",
    whereUsed:
      "Maintaining legacy codebases written before 2019 (class components remain valid and supported by React to this day), discussing the history of React API evolution in an interview, migrating old code to hooks.",
    pitfalls: [
      "Mixing direct this.state reads with an immediate asynchronous read of this.state right after setState, expecting the already-updated value — setState in classes is also asynchronous and can be batched.",
      "Writing new code with class components in 2026 with no good reason — the entire modern ecosystem (hooks from data/form libraries, Suspense patterns) is designed primarily around functional components.",
    ],
  },
  "react-element-vs-component": {
    title: "Element vs Component vs Container",
    shortExplanation:
      "A React Element is a plain, immutable JS object describing 'what should be on screen' (the result of JSX/createElement); a Component is a function or class that takes props and produces elements; a 'container' isn't part of the React API — it's an architectural pattern of splitting a component into a 'smart' part (the container, working with data/state) and a 'dumb' (presentational) part that only displays what it was given.",
    detailedExplanation:
      "A React Element is a lightweight, immutable object of the form { type, props } that doesn't 'do' anything by itself: it holds no state, has no methods, and doesn't directly correspond to a DOM node — it's just a description React uses when building and diffing trees (see Reconciliation). A Component is what produces elements: either a function React calls with props that returns elements, or a class with a render() method. There's an important distinction between an element and a component: <Button /> in JSX is a call to React.createElement(Button, {}), whose result is an ELEMENT (a plain object), not an immediate call to the Button function — the component function is actually called later, when React renders that element in the tree. The 'container/presentational' pattern isn't part of the React API — it's an architectural convention that predates the widespread use of hooks and state-management libraries with their own data-subscription hooks: a container component fetches/computes data (via an API call, a store, context) and passes it down as props into a presentational component, which only handles markup and doesn't know where the data came from. Today this pattern is largely replaced by custom hooks (useOrders() instead of an OrdersContainer), which give the same separation of concerns without an extra wrapper component in the tree.",
    whereUsed:
      "Understanding React's internal workings matters for debugging (why JSX 'isn't called immediately'), architecturally separating data and presentation — today more often via custom hooks than explicit container components, though the underlying separation-of-concerns principle remains relevant.",
    pitfalls: [
      "Confusing 'element' and 'component' as synonyms in an interview — an element is data (a description object), a component is the function/class that produces that data.",
      "Treating container/presentational as a mandatory React API pattern — it's an architectural convention, not a built-in mechanism, and custom hooks more often replace it in modern code.",
    ],
  },
  "react-hoc": {
    title: "Higher-Order Components (HOC)",
    shortExplanation:
      "A HOC (higher-order component) is a function that takes a component and returns a new component with extra logic/props — a pattern for reusing stateful logic between components before hooks existed; Inheritance Inversion is a less common HOC technique where the wrapper inherits from the passed component rather than wrapping it via composition.",
    detailedExplanation:
      "A HOC follows the convention withSomething(Component) -> NewComponent: the HOC itself doesn't modify the original component and doesn't use inheritance in the usual (composition-based) variant — it returns a new wrapper component that renders the passed component, adding extra props or wrapping it in additional logic (say, subscribing to context, an auth check, handling loading). A classic example from older React-Redux versions is connect(mapStateToProps)(MyComponent). Problems with HOCs, which are why hooks became the preferred way to reuse logic: 'wrapper hell' — stacking several HOCs (withAuth(withTheme(withData(Component)))) piles several levels of wrapping onto the component tree in React DevTools, complicating debugging; an unclear prop source — looking at a component wrapped in a HOC, it isn't always obvious where a given prop came from (it could have come from the parent or been injected by one of the HOCs); and prop name collisions when using several HOCs. Inheritance Inversion is a rarer, less recommended technique where the HOC component inherits from the passed component (class Enhanced extends WrappedComponent) instead of wrapping it via composition — giving access to the wrapped component's this.render() and letting you manipulate the render result (say, conditionally returning different JSX), but it breaks the wrapped component's encapsulation and is considered outdated/rarely justified even within the class paradigm. In modern React, both patterns are largely displaced by custom hooks, which provide the same logic reuse without adding wrapper components to the tree.",
    whereUsed:
      "Maintaining legacy code (React-Redux's connect(), older libraries predating widespread hook adoption), understanding the history of logic-reuse pattern evolution in React for an interview, rare cases where a component-level (rather than hook-level) wrapper is genuinely needed (say, some error boundary HOCs, since error boundaries still can't be implemented as a hook).",
    pitfalls: [
      "Wrapping a component in several HOCs in a row without necessity, creating a deep 'wrapper' hierarchy that's hard to read in React DevTools.",
      "Using Inheritance Inversion in new code — an outdated, fragile technique that breaks the wrapped component's encapsulation; composition or a custom hook is almost always the better choice.",
    ],
  },
  "react-prop-drilling": {
    title: "Prop Drilling",
    shortExplanation:
      "Prop Drilling is a situation where data is passed as props through several intermediate components that don't need the data themselves — they only need it to pass it further down the tree to the component that actually needs it.",
    detailedExplanation:
      "The problem isn't passing props itself (that's a normal, predictable data-flow mechanism in React), but that every intermediate component is forced to 'know about' a prop that has nothing to do with it — this increases coupling (any change to the shape of the passed data requires touching every intermediate component's signature) and clutters their API with unrelated, unclear props. The problem grows proportionally with tree depth: if the target component sits 5-6 levels deeper than the data source, the prop has to be threaded through every intermediate level. Three main solutions, each with its own trade-off: (1) the Context API — good for data genuinely needed by a wide range of different components at different levels (theme, current user, locale), but not for frequently changing data due to re-render characteristics (see the Context topic); (2) component composition (passing children or a render prop down the whole chain instead of data) — a component closer to the data wraps the intermediate components as children, so those intermediate components never see the prop at all because they aren't structurally involved in passing it; (3) moving shared state into a separate state manager (Zustand, Redux, Jotai), letting a specific deeply nested component subscribe directly to the slice of state it needs, bypassing the component tree entirely.",
    whereUsed:
      "Refactoring components with deep nesting and many 'pass-through' props, designing a component tree during feature architecture, choosing between Context/composition/an external state manager for a specific data-passing case.",
    pitfalls: [
      "Reaching for Context at the first sign of prop drilling without first considering simpler composition, in cases where intermediate components don't use the passed value at all.",
      "Using Context for frequently changing data instead of a state manager with targeted subscriptions, causing unnecessary re-renders across every context consumer.",
    ],
  },
  "react-lifting-state-up": {
    title: "Lifting State Up and data flow",
    shortExplanation:
      "Lifting State Up is a pattern where state needed by several sibling components is stored not in one of them, but in their closest common ancestor, which passes it down as props and gets changes back via callbacks — it's the only way to sync two 'sibling' components in React, which has no direct communication channel between siblings.",
    detailedExplanation:
      "React doesn't let one component directly read or change another component's state, even a sibling in the tree — the only official communication channel is props down and callbacks up. If two (or more) components need to stay in sync (say, two inputs reflecting the same temperature value in different units, or a list and its search box), the state is lifted into their common ancestor: the ancestor holds the state in useState, passes it down to children as a prop for display, and passes a setter function (or a wrapper around it) as a prop for changes — this is the 'inverse data flow' (data flows down as props, changes flow up via callbacks), which looks like an exception to strictly one-directional data flow but actually remains one-directional: an update always happens by calling a function received from the parent, never by directly mutating someone else's state. 'Two-way data binding' in some other frameworks (Angular with ngModel, Vue with v-model) is implemented as built-in syntax automatically syncing a value and its source in both directions without explicit programmer code — React deliberately has no built-in two-way binding and requires explicitly writing both value and onChange for every controlled field (see Controlled vs Uncontrolled Components) — a deliberate architectural choice favoring data-flow predictability (it's always clear where a value came from and exactly how it changes) at the cost of more boilerplate per field.",
    whereUsed:
      "Syncing several form fields reflecting the same data in different forms, coordinating a filter and a results list in sibling components, any situation where two 'sibling' components need to see the same state.",
    pitfalls: [
      "Trying to directly change a sibling component's state instead of lifting the state into a common ancestor — React physically has no direct mechanism for that.",
      "Confusing 'inverse data flow via callbacks' with a violation of one-directionality — data still flows in one direction (down, as props); only the change function itself is also passed as a prop from above.",
    ],
  },
  "react-conditional-rendering": {
    title: "Conditional Rendering",
    shortExplanation:
      "Conditional rendering is just regular JS constructs (if, the ternary operator, &&) used inside or before JSX to decide which JSX to return, or whether to show an element at all — React has no special dedicated syntax for conditions, unlike the template languages of some other frameworks (e.g. v-if in Vue).",
    detailedExplanation:
      "The main techniques and their nuances: a plain if/else before return — the most explicit and readable way to choose between two fundamentally different UI variants, especially with more than two branches; the ternary operator condition ? <A /> : <B /> — compact inside JSX for a simple two-way choice, but nested ternaries quickly become unreadable; the logical && (condition && <Element />) — the idiomatic way to 'show or not show' one element, but with a well-known trap: if condition is a number (say, count && <Badge />, where count is 0), the JSX renders not nothing, but literally the text '0' on screen, because 0 is falsy, yet React renders falsy numbers as their string representation (unlike false/null/undefined, which don't render at all); an early return null inside the component itself — convenient when the entire component shouldn't render under a certain condition, not just part of it. General principle: a JSX expression can return null, undefined, or false to render nothing (all three equally produce no DOM nodes), but not 0 or an empty string — both of these falsy values React displays as-is.",
    whereUsed:
      "Showing/hiding UI elements based on state (loading, error, empty list, permissions), choosing one of several markup variants by data type, any component with several visual states.",
    pitfalls: [
      "Using && with a numeric condition that could be 0, without an explicit boolean coercion.",
      "Nesting several ternary operators inside JSX to save lines — sharply hurts readability compared to a plain if/else before return, or extracting the logic into a separate variable/function.",
    ],
  },
  "react-lazy-code-splitting": {
    title: "React.lazy: lazy component loading (code splitting)",
    shortExplanation:
      "React.lazy(() => import('./Component')) defers loading a component's JS code until it's actually needed for render, instead of bundling it into the main bundle loaded immediately at app startup — reducing the initial JS bundle size and speeding up the first page load.",
    detailedExplanation:
      "Without code splitting, the entire app's JavaScript (including rarely visited pages, modals, admin panels opened by 1% of users) ends up in one large bundle, loaded and parsed on the first visit, even if the user never opens 90% of that code. React.lazy paired with dynamic import() (standard ES module syntax that a bundler — Webpack/Vite/Turbopack — recognizes as a bundle-splitting point) defers the network fetch for a component's code until the first render where it's actually used — the bundler automatically extracts such a component into a separate chunk file. React.lazy must be used inside a <Suspense fallback={...}> boundary, because the first render of a lazy component before its module finishes loading technically 'suspends' the render via the same throw-promise mechanism as Suspense for data (see the separate topic) — without a Suspense wrapper, React throws an error. Typical bundle-splitting points: code for individual routes (the profile page isn't needed until the user navigates there), heavy rarely-used widgets (a complex date picker, a WYSIWYG editor, a large charting library), and modals/dialogs that don't open immediately on page load.",
    whereUsed:
      "Splitting an SPA's bundle by route (React Router supports lazy-loading pages), heavy rarely-used widgets (editors, charts, maps), modals and dialogs, any scenario where a significant portion of JS isn't needed by most users on their first visit.",
    pitfalls: [
      "Forgetting to wrap a lazy component in Suspense — the app crashes with an error on the first attempt to render it before the module finishes loading.",
      "Splitting the bundle too finely (one lazy per tiny component) — a large number of separate network requests for small chunk files can end up less efficient than one slightly larger, sensibly grouped chunk.",
    ],
  },
  "react-strict-mode": {
    title: "StrictMode: surfacing hidden problems",
    shortExplanation:
      "<StrictMode> is a wrapper component that renders no visible UI itself and enables extra checks and warnings ONLY in development mode — chiefly, a deliberate double-invocation of component functions and some hooks, to surface side effects hidden in render ahead of time.",
    detailedExplanation:
      "StrictMode doesn't change app behavior in the production build at all — all of its checks are fully disabled in the production build and have no effect on end users; their sole purpose is to show the developer, ahead of time during development, problems that would otherwise only surface under a specific combination of concurrent-rendering conditions in production. The main practical check is a double call of the component render function, the useState initializer function (if a function rather than a value is passed), and some other callbacks: if a component is genuinely pure with respect to render, calling it again with the same props/state simply changes nothing and is invisible to the user — but if the component body hides a side effect (mutating an external variable, a network request outside useEffect), the double call makes that problem visible (say, a counter incrementing by 2 instead of 1) already during development, rather than only under a specific combination of concurrent features in production months later. Since React 18, StrictMode additionally deliberately mounts, unmounts, and remounts every component on its first mount in development (firing effects, then their cleanup functions, then the effects again) — this emulates what would happen when reusing a previously cached component tree (say, offscreen rendering for future concurrent features) and exposes effects with no correct cleanup function. StrictMode can be applied locally to part of the tree (wrapping just one component/section) rather than necessarily the whole app at once — handy for gradually migrating a large legacy codebase.",
    whereUsed:
      "Mandatory practice in the development environment for any new React app, gradually migrating legacy code (StrictMode can be enabled tree-section by tree-section), surfacing missing useEffect cleanup functions before the bug shows up in production.",
    pitfalls: [
      "Treating StrictMode warnings as 'React bugs' instead of looking for the real impurity in your own component code that StrictMode is precisely surfacing.",
      "Disabling StrictMode after hitting a double effect invocation in development instead of adding the missing cleanup function — that treats the symptom (hides the warning) rather than the actual problem.",
    ],
  },
  "react-useid": {
    shortExplanation:
      "useId generates a unique string identifier that's stable between server and client — specifically for linking form elements via accessibility attributes (id/htmlFor, aria-describedby), not for React key or as a database key.",
    detailedExplanation:
      "Linking a <label> to an <input> via id/htmlFor, or describing a field via aria-describedby, requires a unique id, but a hardcoded string ('email-input') breaks if the component is used twice on the same page — both instances get the same id, breaking accessibility and semantics. useId solves exactly this: it generates an id unique across the whole tree, and identical on every render of the same component instance. The critically important property this hook was added to React 18 for is that an id generated by useId matches between server rendering (SSR) and subsequent client hydration: if something like Math.random() or an incrementing counter were used instead, the server and client would almost certainly generate different values (hydration order and server render order aren't guaranteed to be identical in every detail), leading to a hydration mismatch warning. useId is specifically NOT meant to be used as a React key in lists (that needs a stable id derived from the data itself, see the Reconciliation topic) and shouldn't be used as a database primary key or other business identifier — it's a purely DOM/accessibility tool.",
    whereUsed:
      "Linking label/input and other form-element pairs via id, when a component might be used multiple times on a page, ARIA attributes (aria-describedby, aria-labelledby), any situation needing a unique DOM id specifically for accessibility, not as a business identifier.",
    pitfalls: [
      "Using useId as a React key in a list — a different task: a key must be a stable identifier of the data itself, not a DOM/accessibility label.",
      "Using a useId result as a business identifier (say, sending it to the server as a record id) — the value is deliberately opaque and meant only for linking DOM elements within a single render.",
    ],
  },
  "react-usesyncexternalstore": {
    shortExplanation:
      "useSyncExternalStore is a low-level hook for safely subscribing a component to an external (non-React) source of state — a browser API, a hand-rolled store, an older state-manager version — that's guaranteed to work correctly with React 18+'s concurrent rendering, unlike manually subscribing to an external store via useState+useEffect.",
    detailedExplanation:
      "Before React 18, a common pattern for subscribing to an external store was: useState for a local copy of the value, plus useEffect subscribing to the store and updating that state on change. With the arrival of concurrent rendering, this pattern became potentially unsafe: React might render a component with one store value, pause the render (a concurrent feature like useTransition), and by the time the render resumes or commits, the external store may have already changed — meaning different parts of one logical UI update could end up reflecting different, time-inconsistent values of the same store ('tearing'). useSyncExternalStore(subscribe, getSnapshot) solves this at React's own level: React guarantees the value obtained via getSnapshot stays consistent throughout a given render, even if the render is interrupted and resumed, and will synchronously re-render the component if needed when it detects the snapshot went stale between calls. In practice, most React developers never call this hook directly — it's used as a building block INSIDE state-management libraries (Zustand, Redux, and Jotai use it under the hood to implement their own subscription hooks like useStore), not as an everyday application-code API.",
    whereUsed:
      "The internal implementation of subscription hooks in state-management libraries (Zustand and Redux use it under the hood), subscribing a component directly to browser APIs outside React (media queries, network status, geolocation), building your own small state-management library.",
    pitfalls: [
      "Calling useSyncExternalStore directly in application code without a real need — in the vast majority of cases, a ready-made hook from a state-management library already using it under the hood is sufficient.",
      "Forgetting that getSnapshot must return the same value (by ===) when nothing changed — returning a new object/array on every call causes an infinite re-render loop.",
    ],
  },
  "react-useinsertioneffect": {
    shortExplanation:
      "useInsertionEffect is a narrowly specialized hook that fires earlier than useLayoutEffect, before React has even read the DOM's layout — its sole purpose is inserting CSS rules from CSS-in-JS libraries before the browser computes layout, avoiding unnecessary style recalculation from dynamically inserted <style> tags.",
    detailedExplanation:
      "Effect firing order during commit: useInsertionEffect -> DOM changes are applied -> useLayoutEffect (can synchronously read/change layout before the browser paints the frame) -> the browser paints the frame -> useEffect (after painting). The problem useInsertionEffect specifically solves: CSS-in-JS libraries (styled-components, Emotion, and similar) dynamically insert <style> tags with generated class names during component render. Doing this in useLayoutEffect could mean the new styles are inserted after the browser has already partially computed layout for the already-applied DOM changes, forcing the browser to recompute styles and layout again (an extra reflow) — noticeably hurting performance on a large tree of styled components. useInsertionEffect is guaranteed to fire before React moves on to reading/changing layout DOM in useLayoutEffect, so styles inserted at that point are accounted for by the browser in one layout computation pass, with no extra recalculation. An important limitation: DOM node refs aren't yet available inside useInsertionEffect (the DOM mutations have already happened, but it isn't guaranteed safe to read their layout) — the hook is meant EXCLUSIVELY for inserting styles, not regular effect logic. The React docs explicitly note that the vast majority of application developers will never need this hook directly — it exists as an API for CSS-in-JS library authors.",
    whereUsed:
      "Almost exclusively the internal implementation of CSS-in-JS libraries (styled-components, Emotion, vanilla-extract with runtime insertion) — regular application code almost never calls this hook directly.",
    pitfalls: [
      "Using useInsertionEffect for regular application effect logic — the hook is deliberately limited in capability (no DOM ref access) and meant exclusively for library style insertion.",
      "Mixing up the firing order of the three effects (useInsertionEffect -> useLayoutEffect -> useEffect) — getting the order wrong in an interview explanation immediately signals a shallow understanding of the topic.",
    ],
  },
  "react-shadow-vs-virtual-dom": {
    title: "Shadow DOM vs Virtual DOM: different technologies, different jobs",
    shortExplanation:
      "The Virtual DOM is a JS-library-level concept (React and others) for efficiently computing and applying real DOM updates; Shadow DOM is a native browser API for encapsulating markup and styles inside a component (usually a web component), fully isolating its CSS from the rest of the page. These solve fundamentally different problems and aren't alternatives to one another.",
    detailedExplanation:
      "The Virtual DOM (see the separate topic) isn't a browser technology — it's a pattern implemented in JS: a library builds a lightweight tree of plain objects describing the desired UI, diffs it against the previous one, and applies only the necessary changes to the real DOM — the sole purpose of this mechanism is UI update performance and predictability. Shadow DOM is part of the Web Components specification, built into the browser itself: an element can have a 'shadow root', whose markup and styles are fully isolated from the main document — CSS rules from outside don't leak into the shadow root, and vice versa — solving the problem of style encapsulation (say, a third-party widget won't be broken by, or break, the host page's global styles). React does NOT use Shadow DOM by default — React component styles are global on the page by default (unless separate techniques are applied: CSS Modules, CSS-in-JS with unique generated class names, BEM conventions), and isolation in React is achieved through build-time/naming tooling rather than a native browser mechanism. Both mechanisms CAN be used together: a React component can technically render content into a native web component's shadow root, but that's a separate capability, not something the Virtual DOM 'does' on its own or that's included in React by default.",
    whereUsed:
      "Explaining, in an interview, the confusion between two similarly named but completely different technologies, evaluating a project's style-encapsulation strategy (CSS Modules/CSS-in-JS vs native Shadow DOM via Web Components), integrating React with Custom Elements that use Shadow DOM.",
    pitfalls: [
      "Treating Shadow DOM and Virtual DOM as competing or interchangeable technologies — they solve different problems and in practice often operate at completely different layers of the stack.",
      "Believing React 'uses Shadow DOM for optimization' — a common misconception caused by the similar names; React doesn't use Shadow DOM by default at all.",
    ],
  },
  "react-router-basics": {
    title: "React Router: how it differs from regular routing",
    shortExplanation:
      "React Router implements client-side routing: a 'page' change happens without a full browser document reload — JS intercepts the navigation, changes the URL via the History API, and swaps the rendered React subtree, whereas classic (server-side) routing means a fresh HTTP request and a full page reload on every navigation.",
    detailedExplanation:
      "With regular (server-side, MPA) routing, following a link is a full new HTTP GET request: the browser completely unloads the current document, including all in-memory JS state, and loads, parses, and renders a new HTML document from scratch. React Router (and client-side routing in general) intercepts link clicks, calls history.pushState (changing the address-bar URL without reloading the page), and renders the corresponding React subtree based on the new path — with no network request for new HTML and no loss of the JS app's state (an open modal, store data, scroll outside the navigated area can all be preserved). The price is having to solve, yourself, problems the server would otherwise solve 'for free' in an MPA: a route's code either has to be included in the main bundle or explicitly lazy-loaded (see React.lazy), and the initial app load (before JS has run and React Router has taken over) needs a separate solution if a fast first content render matters (see the SSR/SSG topics in the Next.js section).\n\nHook evolution across major versions: React Router v5 introduced the first hooks — useHistory (imperative navigation), useLocation (current path/query), useParams (dynamic URL segments, e.g. /users/:id), useRouteMatch. React Router v6 substantially reworked the API: useHistory was replaced by useNavigate (a single function for forward/back/replace navigation), useRouteMatch was dropped in favor of simpler nested <Routes>, and useSearchParams was added for convenient query-string handling as controlled state. React Router v7 (effectively merged with Remix) added hooks integrated with server-side data and forms in the Remix style — useLoaderData (data loaded before a route renders, on the server or client), useActionData (the result of processing a form via an action), useNavigation (the current navigation state — idle/loading/submitting) — bringing React Router's model closer to server-side data-loading patterns similar to Next.js Route Handlers and Server Actions (see the corresponding topics).",
    whereUsed:
      "Any SPA built on plain React (not Next.js, which has file-based routing built in), migrating between React Router versions, explaining client-side vs server-side routing in an interview, passing data between pages via route parameters, the query string, or location state.",
    pitfalls: [
      "Forgetting that client-side routing without SSR/SSG means an empty initial HTML document until JS runs — critical for SEO and first content render unless mitigated by server-side rendering.",
      "Using deprecated React Router v5 hooks (useHistory, useRouteMatch) in new v6+ code — the API changed substantially, and old patterns either don't work or don't let you benefit from the new version's improvements.",
    ],
  },
  "react-reselect": {
    title: "Reselect: memoized selectors for a store",
    shortExplanation:
      "Reselect is a library for creating memoized 'selectors' (functions computing derived data from a store, e.g. Redux) — a selector only recomputes if the specific parts of the store it depends on actually changed, not on every store change.",
    detailedExplanation:
      "The problem Reselect solves: without memoization, a selector function computing, say, a filtered and sorted list of tasks from the entire store will recompute on EVERY store update (even if a completely unrelated part of the state changed), and — worse — when used with React (via useSelector) each such recomputation typically creates a new array/object by reference, so components comparing the selector's result by reference (as React.memo or useSelector do by default) conclude the data changed and re-render unnecessarily, even when the result's content is identical to before. createSelector from Reselect creates a memoized function: it takes several 'input' selectors (usually simple functions reading a specific slice of the store) and one 'result' function, which only recomputes if at least one input selector's result changed (by ===) compared to the previous call — if all inputs are the same, Reselect returns the previous call's cached result by the same reference, without re-running the result function or creating a new object. This matters especially for expensive computations (complex filtering/sorting/aggregation of large lists) and for preventing a cascade of unnecessary re-renders across components subscribed to the selector via useSelector.",
    whereUsed:
      "Redux apps with derived data — filtered/sorted/aggregated lists computed from the raw store, any scenario where a selector inside useSelector creates a new array/object on every call, causing unnecessary re-renders in subscribed components.",
    pitfalls: [
      "Creating a new selector inside a component's body on every render (e.g. useSelector((state) => createSelector(...)(state))) — this destroys the entire point of memoization, because the selector's cache only lives as long as the selector function itself does.",
      "Wrapping cheap, trivial computations (e.g. simply reading a field) in createSelector — the memoization overhead itself may not pay off where recomputing is already practically free.",
    ],
  },
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
  "react-flushsync": {
    title: "flushSync: forcing a synchronous render",
    shortExplanation:
      "flushSync is a function from react-dom that forces React to immediately and synchronously apply state updates to the real DOM inside the passed callback, instead of batching them and deferring until the next cycle — used sparingly, when code right after the call needs the already-updated DOM.",
    detailedExplanation:
      "By default (since automatic batching in React 18), every setState call triggered within one event handler gets merged into a single render that's applied to the DOM asynchronously — regular code right after a setState call can't assume the document already reflects the new state. flushSync(callback) explicitly opts out of that behavior: React synchronously and immediately performs the render and commit for every state update inside the passed function before flushSync returns control — meaning right after the call, it's safe to read the up-to-date DOM (say, its dimensions via getBoundingClientRect or scrollHeight). This is a narrow escape hatch, not an everyday tool: every flushSync call forces a full synchronous render and commit, losing all the benefits of batching (merging several updates into one pass) for that specific update — frequent or unjustified use noticeably hurts performance, because React can no longer merge adjacent state changes. A typical legitimate scenario: programmatically scrolling a list to a just-added item — if you simply call setState and immediately scrollIntoView, the DOM hasn't updated yet (the element doesn't physically exist in the tree yet), and the scroll either fails or lands at the old position; wrapping the setState in flushSync guarantees the new DOM node already exists by the time scrollIntoView is called.",
    pitfalls: [
      "Wrapping every state update in flushSync 'just in case' — negates the benefits of automatic batching and noticeably slows the app down under frequent updates.",
      "Using flushSync where properly structuring an effect (useEffect/useLayoutEffect) reacting to the state change would suffice, instead of imperatively forcing synchronicity.",
    ],
    practiceTask:
      "Build a list with an 'Add item' button that auto-scrolls to the new item after adding it: first without flushSync (confirm the scroll sometimes lands in the wrong place or doesn't happen at all), then wrap the setState in flushSync and confirm the scroll now reliably lands on the new item.",
  },
  "react-rules-of-hooks": {
    title: "Rules of Hooks",
    shortExplanation:
      "Two strict rules for using hooks: call them only at the top level of a function component (not inside conditions, loops, or nested functions) and only from React components or other hooks — these rules exist not as a style preference but because React's correctness depends on them. The one deliberate exception to the first rule is the new use() hook (React 19), specifically designed so it can be called conditionally.",
    detailedExplanation:
      "React doesn't store hooks by variable name — it matches useState/useEffect/... calls by their call order within a specific render, using an internal linked list. If a hook is conditionally skipped (if (condition) { useState(...) }), the ordinal positions of every subsequent hook in that render shift relative to the previous render, and React ends up associating state with the wrong hook — leading to hard-to-track bugs rather than a compile error. The rule 'call hooks only from components/other hooks' ensures React can actually track which 'place in the tree' a given hook call belongs to — a regular (non-hook) function is invisible to React from this tracking mechanism's perspective. The eslint-plugin-react-hooks ESLint plugin's rules-of-hooks rule is the standard way to catch violations of these rules automatically, before they ship to production as a hard-to-find bug.\n\nAn important clarification introduced in React 19: the 'top level only' rule isn't absolute for every single hook without exception — use() (see the separate topic) is deliberately designed so it can legally be called inside if, loops, and after an early return, because it doesn't store its own state across renders by call order — it either reads context directly or suspends the component via Suspense when reading a promise. This doesn't repeal the rule for every other hook — use() is the one narrow, specifically documented exception, not a signal that 'all hooks can go in an if now'.",
    pitfalls: [
      "Wrapping a hook call in a condition or an early return placed before the hooks.",
      "Ignoring eslint-plugin-react-hooks warnings, treating them as 'just style' rather than protection against real state bugs.",
      "Assuming that because use() can be called conditionally, other hooks (useState, useContext, useEffect) can be too — it's the one deliberate exception, not a repeal of the rule in general.",
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
  "react-use-hook": {
    title: "use() — the hook you can call inside if and loops",
    shortExplanation:
      "use() is a new React 19 API for reading a promise's or a context's value directly during render; unlike every other hook, use() can be called inside if, loops, and after an early return, because it doesn't rely on a call's ordinal position across renders.",
    detailedExplanation:
      "All 'classic' hooks (useState, useEffect, useMemo, etc.) must be called at the top level of a component in the exact same order on every render — that's how React matches a given hook's state to its 'slot' in the internal linked list (see the Rules of Hooks topic). use() works fundamentally differently: it doesn't store its own state across renders and doesn't depend on call order — instead, on each call, React either immediately returns the already-resolved value of the context/promise, or (if the promise hasn't settled yet) suspends the component's render via Suspense until it resolves. It's precisely this lack of dependence on a 'call number' that makes calling use() conditionally legal — calling it inside if (condition) { use(promise) } is safe because on any given render React simply reads the current value at that point in execution, rather than matching it against a slot in the previous render's hook list. use() has two main use cases: reading a promise (the component suspends via the nearest Suspense boundary until the promise resolves — replacing some patterns that used to require useEffect + useState) and reading React Context (a full alternative to useContext, but one that can be called conditionally and inside loops, which was explicitly forbidden for useContext).",
    pitfalls: [
      "Assuming that because use() can be called conditionally, other hooks (useState, useEffect, useMemo) now can be too — the top-level rule for them hasn't gone anywhere; use() is a deliberate, narrow exception.",
      "Passing use() a promise that's recreated on every render (e.g. inline in JSX with no memoization) — this causes an infinite render-suspend loop; the promise needs to be created outside the component or memoized/cached (e.g. via a data library or a resource specifically designed for Suspense).",
    ],
    practiceTask:
      "Write a component that receives a promise of user data and a boolean showProfile prop, and inside if (!showProfile) return null calls use(userPromise) for the rest of the render — confirm it works without ESLint warnings, unlike an equivalent attempt with useState in place of use().",
  },
};
