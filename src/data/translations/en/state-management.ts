import type { ContentTranslationMap } from "../types";

export const stateManagementEn: ContentTranslationMap = {
  "state-zustand-vs-redux": {
    title: "Zustand vs Redux vs Context",
    shortExplanation:
      "These are three different tools for the same job — splitting and reusing state across components — but with different boilerplate costs and different performance.",
    detailedExplanation:
      "The Context API is built into React and works well for rarely-changing data (theme, locale, current user), but under frequent updates it re-renders every consumer component, because Context has no way to subscribe a component to only part of the value. Redux gives you a strict, predictable architecture (a single state, actions, reducers, DevTools with time-travel), but requires a lot of boilerplate even for simple cases. Zustand is a minimalist library: state and actions are described in one place with no actions/reducers, and components subscribe to only the piece of state they need via a selector, giving targeted re-renders with no explicit memoization.",
    pitfalls: [
      "Putting frequently-changing data into the same Context as rarely-changing data — every consumer suffers unnecessary re-renders.",
      "Choosing Redux 'by default' for a small project where Zustand or even useState would suffice, and spending time on boilerplate.",
    ],
    practiceTask:
      "Implement the same counter state via Context and via Zustand, and compare the amount of code and the number of re-renders in child components not subscribed to that state.",
  },
  "state-normalization": {
    title: "Normalizing State",
    shortExplanation:
      "Normalization means storing data as flat structures by id (like in a database), rather than as nested trees, to avoid duplication and simplify updates.",
    detailedExplanation:
      "If you store data as nested arrays of objects (say, a list of posts, each with an array of comments that embed the author), the same value (the user's data) can end up duplicated in multiple places — and an update requires syncing every copy. A normalized structure stores entities flatly: { posts: { byId: {...}, allIds: [...] }, comments: { byId: {...} }, users: { byId: {...} } }, with relationships expressed via id references. This resembles tables in a relational database and makes updating one entity instant everywhere it's used.",
    pitfalls: [
      "Normalizing data that's never updated or reused in multiple places — needless complexity with no benefit.",
      "Forgetting to remove relationships (e.g. commentIds) when deleting an entity, leaving 'broken' references to nonexistent ids.",
    ],
    practiceTask:
      "Take a nested JSON of posts and comments and write a normalize() function that turns it into a flat byId/allIds structure for each entity.",
  },
  "state-derived-state": {
    title: "Derived State",
    shortExplanation:
      "Derived state is a value that can be computed from existing state, rather than stored as a separate independent state variable.",
    detailedExplanation:
      "A common mistake is storing a value in state that's actually a function of other state values (e.g. filteredList as its own useState, even though it could be computed from items and filter on every render). This leads to desync bugs: forget to update the derived value when the source changes, and you have a bug. The right approach is computing derived values right in the component body (wrapped in useMemo if the computation is expensive), rather than duplicating them in separate state.",
    pitfalls: [
      "Syncing derived state via useEffect instead of a plain computation during render — a source of hard-to-track desync bugs.",
      "Forgetting useMemo for genuinely expensive derived computations, causing them to recompute on every unrelated render.",
    ],
    practiceTask:
      "Find a useEffect in any of your components that syncs one state to another, and rewrite it as a plain computation (with useMemo if needed).",
  },
  "state-local-vs-global": {
    title: "Local vs Global State",
    shortExplanation:
      "Local state lives inside one component and isn't needed anywhere else; global state is used by many unrelated components across different parts of the tree.",
    detailedExplanation:
      "The main principle is that state should live as close as possible to where it's used (co-location), and only move up the tree (lifting state up) or into a global store when it's genuinely needed by several components that are far apart. Prematurely pushing everything into a global store (Redux/Zustand) complicates the code, adds unnecessary coupling, and can trigger unnecessary re-renders in places unrelated to the change.",
    pitfalls: [
      "Dumping all state into the global store 'just in case' — complicates debugging and adds unnecessary coupling between parts of the app.",
      "Threading props through too many levels (prop drilling) for too long instead of admitting the state is genuinely global.",
    ],
    practiceTask:
      "Take one Zustand store from your project and check each field: is it really needed by several unrelated components, or could it be local useState instead?",
  },
  "state-form-state": {
    title: "Form State",
    shortExplanation:
      "Form state — field values, validation errors, touched/dirty flags, and submission status — is usually managed separately from the rest of the app's state because of its unique demands.",
    detailedExplanation:
      "Forms update very often (on every keystroke), require validation (at the field and whole-form level), need to distinguish 'field not touched yet' from 'touched but invalid', and often contain nested and array-like structures (a list of phone numbers, dynamic fields). Because of these demands, dedicated libraries (React Hook Form, Formik) are often used for forms instead of storing form state in a shared store (Zustand/Redux) — this minimizes re-renders (React Hook Form, for instance, doesn't re-render the component on every keystroke at all, using uncontrolled inputs and refs).",
    pitfalls: [
      "Storing every form field in its own useState — quickly becomes unmanageable as the form grows.",
      "Confusing 'invalid' with 'not yet touched by the user' — showing errors on a freshly opened, empty form.",
    ],
    practiceTask:
      "Implement a simple login form (email + password) with validation via React Hook Form (or manually with useState + a custom validation function) and correct touched/errors handling.",
  },
  "state-jotai-vs-mobx": {
    title: "Jotai, MobX, and Choosing Between State Managers",
    shortExplanation:
      "Jotai is an atomic state manager where state is built from small independent 'atoms', and a component subscribes only to the atoms it needs; MobX is a reactive state manager where you can mutate state directly, and subscription and re-rendering happen automatically via proxy objects.",
    detailedExplanation:
      "Redux/Zustand use a single (or a few) store with explicit actions/setters and immutable updates — state is always replaced with a new object, never mutated. Jotai flips the model: instead of one big state object, there are many small independent atoms (const countAtom = atom(0)), and a component subscribes to exactly that atom via useAtom(countAtom) — re-render only happens when that specific atom changes, which removes the need to hand-write selectors for 'subscribe to only the needed slice', the way Context requires. MobX, in turn, is built around mutability and proxies: store.count++ works literally as a direct mutation of a JS object, and MobX uses a Proxy to track exactly which observable fields a given component reads, automatically re-rendering only the components that actually read the changed field — thanks to this the code often looks simpler (no reducers, no action creators), but it takes some getting used to a less predictable, more 'magical' change model compared to the explicit, immutable Redux approach.",
    whereUsed:
      "Jotai — where fine-grained subscription is needed without writing separate selectors (many independent pieces of UI state). MobX — in projects where the team prefers an object-oriented, mutable style (e.g. migrating from an Angular/OOP background) and is comfortable with a less strict, more 'magical' reactivity model in exchange for simpler syntax.",
    pitfalls: [
      "Mixing MobX's mutable style with regular React patterns that expect immutability (e.g. some React.memo optimizations rely on referential equality, which works differently under MobX).",
      "Choosing Jotai/MobX 'because it's newer/more interesting' with no real need for their specific strengths — for most teams Zustand/Redux Toolkit remain the more predictable default choice.",
    ],
  },
  "state-stale-time-vs-cache-time": {
    title: "staleTime vs cacheTime (gcTime)",
    shortExplanation:
      "staleTime is how long data in TanStack Query's cache is considered 'fresh' and doesn't need a refetch on a new access; cacheTime (renamed gcTime in v5) is how long unused data is kept in memory at all before the cache garbage collector removes it.",
    detailedExplanation:
      "While data is 'fresh' (within staleTime), TanStack Query makes no network request at all when a new component mounts with the same query key — it just instantly returns the cached value. Once staleTime elapses, the data is considered 'stale' but isn't removed — it keeps rendering (stale-while-revalidate) until a fresh response arrives in the background. gcTime (formerly cacheTime) is a completely separate setting: it's counted from the moment a query key has no active subscribers left (every component using that query has unmounted), and determines how long the data still sits in memory 'just in case' the user comes back to that screen, before the query is fully removed by the cache's garbage collector. By default staleTime is 0 (data is considered stale immediately, and every new component mount triggers a background refetch), while gcTime defaults to 5 minutes.",
    whereUsed:
      "Configuring staleTime matters for data that rarely changes (reference data, a user profile) — a large staleTime cuts down on unnecessary requests; configuring gcTime matters for screens the user frequently switches between (tabs), so the cache isn't lost too quickly.",
    pitfalls: [
      "Confusing staleTime (when a refetch is needed) with gcTime (when data is removed from memory entirely) — these are different, independent mechanisms.",
      "Setting staleTime: 0 everywhere by default without considering that for rarely-changing data this creates constant unnecessary background requests.",
    ],
  },
  "state-request-deduplication": {
    title: "Request Deduplication",
    shortExplanation:
      "Request deduplication is a mechanism where several simultaneous requests for the same data (the same query key) are merged into a single real network request instead of each component making its own independent fetch.",
    detailedExplanation:
      "Without deduplication, if five different components on the same page independently call fetchUser(id) for the same id (e.g. each via its own useEffect + useState), the browser sends five identical network requests almost simultaneously — the server takes unnecessary load, and the client wastes bandwidth. TanStack Query, RTK Query, and similar libraries solve this at the query-key level: if several components request the same key at the same time while the first request is still in flight, the rest don't create a new fetch — they simply 'subscribe' to the already-flying request's result and receive the same response. This differs from caching itself (which saves repeat requests for already-fetched data) — deduplication solves the problem of parallel, simultaneous requests for data that hasn't arrived yet, before the first response even comes back.",
    whereUsed:
      "Pages with many independent widgets reading the same data (dashboards, feeds with repeated user cards), where without deduplication it's easy to accidentally trigger dozens of duplicate requests on first load.",
    pitfalls: [
      "Writing a custom fetch hook with no deduplication in a project where the same resource is requested by several independent widgets on a page at once.",
      "Assuming deduplication also solves long-term caching — these are different mechanisms: deduplication is about simultaneous requests, cache and staleTime are about repeat requests over time.",
    ],
  },
};
