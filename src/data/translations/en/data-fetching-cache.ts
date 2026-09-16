import type { ContentTranslationMap } from "../types";

export const dataFetchingCacheEn: ContentTranslationMap = {
  "df-server-vs-client-state": {
    title: "Server State vs Client State",
    shortExplanation:
      "Server state is data that actually lives on the server and is only synced to the client; client state is data that exists only in the UI (is a modal open, an input's value).",
    detailedExplanation:
      "This distinction matters because server state has properties regular UI state doesn't: it can go stale, someone else can change it concurrently, and it needs caching, revalidation, loading and error handling. Trying to manage server state the same way as client state (plain useState + useEffect with fetch) leads to duplicated fetching logic, request races, and cache desync. That's why specialized tools are used for server state (TanStack Query, SWR, RTK Query), and Zustand, Redux, useState/useReducer for client state.",
    pitfalls: [
      "Storing server state in Redux/Zustand 'like regular data', manually implementing caching and invalidation.",
      "Not distinguishing 'data loading' (server state) from 'filter form state' (client state) — and mixing them in one place.",
    ],
    practiceTask:
      "Take any component with useState + useEffect + fetch and rewrite it with useQuery, comparing the amount of code and the edge cases handled.",
  },
  "df-browser-cache": {
    title: "Types of Browser Cache",
    shortExplanation:
      "The cache in TanStack/RTK Query is an in-memory cache inside the JS app. But the browser also caches data at several levels below that: HTTP cache (memory/disk cache), the Service Worker Cache API, and the back-forward cache (bfcache) — all of them work independently of state-management libraries.",
    detailedExplanation:
      "The HTTP cache is controlled by response headers: Cache-Control (max-age, no-store, no-cache, immutable) decides whether the response can be reused at all without hitting the network, while ETag/Last-Modified let the browser make a 'cheap' round trip — an If-None-Match/If-Modified-Since request — and get a 304 Not Modified instead of the full response body. The browser physically stores these responses in two places: memory cache (fast, lives as long as the tab/process is open) and disk cache (slower, survives a browser restart). Separately there's Cache Storage (the Cache API) — a programmable cache controlled by a Service Worker: it intercepts fetch events and itself decides whether to serve from cache, go to the network, or do both (stale-while-revalidate at the network level). Finally, the back-forward cache (bfcache) isn't a cache of responses but a cache of the whole live page with all its JS state, which the browser restores on back/forward navigation without a reload. All of these levels operate before a request even reaches fetchFn in TanStack/RTK Query — so even a 'cold' useQuery might never hit the real network if the HTTP cache already served the response.",
    pitfalls: [
      "Confusing the library's staleTime with the server's Cache-Control — these are different, independently configured things at different layers of the stack.",
      "Setting an aggressive Cache-Control: no-store on an API that's already cached client-side by the library — that's just extra network load with no benefit.",
    ],
    practiceTask:
      "Open DevTools → Network on any site, find a request marked 'from disk cache' or '304', and match it against the response's Cache-Control/ETag headers — explain why the browser made that specific decision.",
  },
  "df-tanstack-query": {
    title: "TanStack Query (React Query)",
    shortExplanation:
      "TanStack Query is React Query: as of v4 the library was renamed to reflect support for more than just React — Vue/Solid/Svelte too. The name 'React Query' is still used out of habit and in articles. The library handles server state in React: caching, revalidation, retries, mutations — out of the box.",
    detailedExplanation:
      "The core idea is that every request is identified by a query key, and the library itself decides when data is 'fresh' and doesn't need refetching, versus 'stale' and due for a background update. useQuery is used to read data, useMutation to change data on the server, with the ability to invalidate related queries after a successful mutation.",
    pitfalls: [
      "Setting staleTime: 0 everywhere 'to be safe' and getting extra network requests on every tab refocus.",
      "Forgetting to invalidate related query keys after a mutation — the UI shows stale data.",
    ],
    practiceTask:
      "Build a todo list with useQuery for reading and useMutation for adding a task, with cache invalidation on success.",
  },
  "df-query-keys": {
    title: "Query Keys",
    shortExplanation:
      "A query key is a unique identifier for a request in the cache (usually an array), which the library uses to find, update, and invalidate related data.",
    detailedExplanation:
      "A query key isn't just a 'name' — it's part of the data, and it must include every parameter that affects the result: ['todos', { status: 'done' }] and ['todos', { status: 'all' }] are two different, independently cached queries. If a parameter that affects the request isn't included in the key, the cache will serve wrong (someone else's) data for different parameters.",
    pitfalls: [
      "Forgetting a filter parameter in the query key and getting 'stuck', incorrect data.",
      "Making the key unstable (a new object on every render with no normalization) — the cache stops matching across renders.",
    ],
    practiceTask:
      "Build a status-filtered list where the query key includes the status, and demonstrate that toggling the filter back and forth doesn't trigger extra network requests (data comes from cache).",
  },
  "df-cache-invalidation": {
    title: "Cache Invalidation",
    shortExplanation:
      "Cache invalidation is explicitly marking data as stale, after which the library refetches fresh data.",
    detailedExplanation:
      "After a mutation (create/update/delete on the server), the local cache no longer matches reality. Invalidation solves this: you specify which query keys 'went bad', and the library either refetches them immediately (if they're in use on screen) or marks them stale for next use. This is more reliable than manually computing and splicing new data into the cache (though that approach — 'optimistic update' — also exists and is covered separately).",
    pitfalls: [
      "Invalidating too broad a query key (e.g. the entire cache) — triggers an avalanche of unnecessary requests.",
      "Forgetting to invalidate related but differently-named keys (e.g. ['todos'] and ['todo', id] separately).",
    ],
    practiceTask:
      "Add a delete-task mutation and make sure that afterward both the task list and the 'total tasks' counter update via invalidating the right keys.",
  },
  "df-optimistic-updates": {
    title: "Optimistic Updates",
    shortExplanation:
      "An optimistic update immediately updates the UI before the server confirms the change, so the interface feels instant.",
    detailedExplanation:
      "Instead of waiting for the server's response before updating the screen, the app immediately applies the expected result to the local cache and sends the request in the background. If the request succeeds, nothing needs to change (or it's confirmed with the real server data). If it fails, the change needs to be rolled back to the previous state and, usually, an error message shown.",
    pitfalls: [
      "Forgetting the rollback on error — the UI 'lies' to the user about the outcome.",
      "Not canceling in-flight parallel requests (cancelQueries) — a race overwrites the optimistic change.",
    ],
    practiceTask:
      "Implement toggling a task's 'done' checkbox with an optimistic update, then make mutationFn artificially fail 50% of the time and verify the rollback works.",
  },
  "df-rtk-query": {
    title: "RTK Query",
    shortExplanation:
      "RTK Query is the server-state module inside Redux Toolkit: it solves the same problems as TanStack Query (cache, revalidation, mutations), but data lives in the Redux store and is accessed through regular Redux hooks.",
    detailedExplanation:
      "Unlike TanStack Query, where the cache lives in its own internal QueryClient separate from the rest of the app's state, RTK Query stores its cache right inside the Redux store as a regular slice. The API is described declaratively via createApi: one call generates both a slice reducer and automatically typed hooks (useGetTodosQuery, useAddTodoMutation) for each endpoint. Invalidation in RTK Query is built on tags (tagTypes/providesTags/invalidatesTags) — similar to query keys, but working through an explicit mapping of 'this endpoint provides tag X' / 'this mutation invalidates tag X', rather than array-key prefixes.",
    pitfalls: [
      "Adding RTK Query just for request caching in a project without Redux — that's extra dependency and boilerplate (Provider, store) where TanStack Query is simpler.",
      "Forgetting to symmetrically set up providesTags/invalidatesTags — without that, tag-based auto-invalidation simply won't fire, and the UI will show stale data, same as with no invalidation at all.",
    ],
    practiceTask:
      "Describe the same todo list via createApi (getTodos with providesTags and addTodo with invalidatesTags) and compare the resulting code with the useQuery/useMutation version from the previous topic — what got more declarative, and what got less flexible.",
  },
  "df-comparison-custom-vs-libraries": {
    title: "Custom Hook vs TanStack Query vs RTK Query",
    shortExplanation:
      "Three ways to fetch server data in React: write your own useFetch on useState+useEffect, use TanStack Query, or use RTK Query. The difference isn't whether each one 'works' — all three do — it's how many edge cases are handled out of the box and what price you pay for it (amount of code, dependencies, coupling to Redux).",
    detailedExplanation:
      "A custom hook (useState for data/isLoading/error + useEffect with fetch) is the cheapest option dependency-wise, but every edge case has to be implemented by hand: canceling a stale request when the id changes (otherwise you get a race condition, where a fast second response is overwritten by a slow first one), deduplicating identical parallel requests from different components, caching across screens, retrying on network error, revalidating on tab refocus. In practice, such a hook either grows into half of TanStack Query inside the project, or these edge cases simply go unhandled and live on as bugs. TanStack Query covers all of the above through configuration (staleTime, retry, refetchOnWindowFocus) and doesn't require coupling to any state manager — its cache lives in its own QueryClient. RTK Query solves the same problems but through a different API (createApi, tags instead of query keys) and only really makes sense when the project already uses Redux — then server state and client state end up in one store with one set of devtools, instead of two parallel sources of truth.",
    pitfalls: [
      "Writing 'yet another' custom fetching hook in a project that already has TanStack/RTK Query wired up — now there are two independent caches for similar data, and they drift apart.",
      "Choosing RTK Query 'because it's trendy' without Redux in the project — that's just a heavier way to get what TanStack Query does without a single line of store Provider.",
    ],
    practiceTask:
      "Take the earlier useUserCustom hook and deliberately switch the id twice in quick succession (e.g. by clicking two links) — you'll uncover a race if the cancelled flag is removed. Then swap the hook for useQuery and verify the race is fixed without a single line of manual code for this case.",
  },
};
