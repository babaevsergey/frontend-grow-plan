import type { ContentTranslationMap } from "../types";

export const nextjsSsrEn: ContentTranslationMap = {
  "nextjs-ssr-basics": {
    title: "SSR (Server-Side Rendering)",
    shortExplanation:
      "SSR renders React components into HTML on the server on every request, not just in the browser.",
    detailedExplanation:
      "With SSR the server executes React code, generates ready-made HTML, and sends it to the browser, which shows content immediately without a 'blank screen'. After JS loads on the client, hydration happens — React 'attaches' to the already-existing HTML, adding interactivity. SSR improves First Contentful Paint and SEO, but adds server load and requires the page's data to be available at request time.",
    pitfalls: [
      "Thinking SSR automatically solves all performance problems — with poor architecture the server can become a bottleneck.",
      "Forgetting that an SSR page isn't interactive until hydration finishes on the client.",
    ],
    practiceTask:
      "Compare the Network tab in DevTools for the same page rendered via SSR and via pure CSR (e.g. a 'use client' page with useEffect + fetch).",
  },
  "nextjs-server-components": {
    title: "Server Components",
    shortExplanation:
      "Server Components are components that run only on the server, never end up in the client's JS bundle, and can access data directly.",
    detailedExplanation:
      "In the Next.js App Router, all components are Server Components by default unless explicitly marked 'use client'. They can be async, query a DB or external API directly without a separate API endpoint, and their code (including heavy libraries they use) is never sent to the browser — reducing the client bundle size. Limitation: Server Components can't use state hooks (useState, useEffect) or browser APIs, because they don't run in the browser.",
    pitfalls: [
      "Trying to use useState/useEffect in a Server Component — this is a compile error.",
      "Not realizing 'use client' in a file makes its entire import subtree client-side by default (unless components are explicitly split).",
    ],
    practiceTask:
      "Build a Server Component page that fetches data 'on the server' and a child interactive component with 'use client' inside it, passing the data as props.",
  },
  "nextjs-client-components": {
    title: "Client Components",
    shortExplanation:
      "Client Components have the 'use client' directive at the top of the file, run in the browser, and can use state, effects, and events.",
    detailedExplanation:
      "A Client Component is needed wherever interactivity is required: event handlers (onClick, onChange), state (useState, useReducer), effects (useEffect), browser APIs (window, localStorage), or third-party libraries built for client-side execution (most stateful UI libraries). 'use client' is a boundary: it marks not just the file itself but everything it imports as part of the client bundle.",
    pitfalls: [
      "Putting 'use client' at the very top of the tree 'just in case', turning the whole app into CSR.",
      "Passing non-serializable functions or data (e.g. DB class instances) into a Client Component.",
    ],
    practiceTask:
      "Take the page from the previous example and extract the interactive 'Add to favorites' button into a separate small Client Component, keeping the rest of the page server-rendered.",
  },
  "nextjs-hydration": {
    title: "Hydration",
    shortExplanation:
      "Hydration is the process where React 'brings to life' HTML already rendered on the server, attaching event handlers and internal state.",
    detailedExplanation:
      "After the browser receives ready-made HTML from SSR, it loads the React JS bundle, which re-'renders' the same component tree but doesn't create new DOM nodes — it attaches to the existing ones and wires up event handlers. If the client render result doesn't match what was on the server (e.g. from using Date.now() or window directly during render), a hydration mismatch occurs — a warning or error about mismatched markup.",
    pitfalls: [
      "Using time-/random-/browser-dependent data directly in the render of a server component.",
      "Ignoring hydration mismatch warnings in the console — they point to a real bug.",
    ],
    practiceTask:
      "Deliberately trigger a hydration mismatch (e.g. via new Date() in render) and study the browser console warning, then fix it with useEffect.",
  },
  "nextjs-caching": {
    title: "Next.js Caching",
    shortExplanation:
      "Next.js caches data and rendering at several levels (fetch cache, Full Route Cache, Router Cache) to avoid recomputing the same thing on every request.",
    detailedExplanation:
      "The App Router has several independent cache layers: the Data Cache — a server-side cache of fetch() results (controllable via the cache and revalidate options); the Full Route Cache — a cache of rendered HTML/RSC payload for static routes; the Router Cache — a client-side cache of already-visited routes so navigation between them is instant. Each layer can be configured and invalidated separately, which gives flexibility but requires understanding which specific cache is 'blocking' fresh data from showing up.",
    pitfalls: [
      "Not realizing that fetch in Next.js is cached by default differently from a plain browser fetch.",
      "Forgetting to call revalidatePath/revalidateTag after mutating data on the server (e.g. in a Server Action).",
    ],
    practiceTask:
      "Build a page with fetch(url, { next: { revalidate: 10 } }) and observe how often the data updates on repeat visits at intervals shorter and longer than 10 seconds.",
  },
  "nextjs-csr-ssg-isr": {
    title: "CSR vs SSG vs ISR",
    shortExplanation:
      "CSR renders the whole page in the browser after JS loads; SSG generates static HTML once at build time; ISR is a hybrid: static HTML like SSG, but able to periodically regenerate without a full site rebuild.",
    detailedExplanation:
      "CSR (Client-Side Rendering) sends the browser an almost empty HTML shell and the whole JS bundle, and real content appears only after JS loads and runs — this gives maximum interactivity once loaded but the worst of the four approaches for LCP and SEO without extra measures (crawlers need to execute JS, which isn't always reliable). SSG (Static Site Generation) generates HTML for each page once, at build time — the result can be served from a CDN instantly, with no server or database call at all, giving the best performance and SEO, but the data is frozen at build time and won't update without rebuilding the whole site. ISR (Incremental Static Regeneration) solves this inflexibility: the page stays static (like SSG) but is tagged with a revalidation window (revalidate: 60) — once that time passes, the very next request to the page gets the old cached version (no delay for that user), while Next.js regenerates the page in the background, and all subsequent requests get the updated version — so there's no need to rebuild the whole site just to refresh one page with rarely-changing data.",
    whereUsed:
      "CSR — for highly interactive private screens (admin panels, logged-in dashboards) where SEO doesn't matter. SSG — for content that rarely changes (marketing pages, docs, blog). ISR — for content that changes but not instantly (product catalog, news feed), where you need a balance between data freshness and static performance.",
    pitfalls: [
      "Using CSR for pages where SEO and a fast first paint matter (landing pages, public catalog) — content isn't available to crawlers until JS runs.",
      "Setting too short a revalidate for ISR on expensive-to-generate pages — this effectively turns ISR into SSR in terms of server load, with no real savings.",
    ],
  },
  "nextjs-route-handlers-server-actions": {
    title: "Route Handlers & Server Actions",
    shortExplanation:
      "Route Handlers (a route.ts file inside app/) are a way to build a classic REST-like API endpoint inside Next.js; Server Actions are functions marked 'use server' that can be called directly from client code (including form submission) as an ordinary async function, with no manual endpoint or fetch call needed.",
    detailedExplanation:
      "A Route Handler is a route.ts file with exported GET/POST/PUT/DELETE functions handling HTTP requests to a specific path — essentially a regular backend endpoint living right inside the Next.js app's structure, useful for a full REST API, webhooks, and integrations with third-party services. A Server Action is a fundamentally different model: a function marked 'use server' is compiled into a hidden endpoint automatically, and can be passed directly into a form's action attribute (<form action={createUser}>) or called from a client component like a regular async function — Next.js serializes the arguments, makes the network request under the hood, and deserializes the result, removing the need to hand-write fetch and an API route for every simple mutation. Server Actions are especially convenient for forms because they work even without client-side JavaScript enabled (the form actually submits as a normal HTML submit if JS hasn't loaded yet) — that's progressive enhancement, which Route Handlers alone don't provide.",
    whereUsed:
      "Route Handlers — for full REST endpoints, webhooks from external services (Stripe, GitHub), integrations that other clients call. Server Actions — for mutations triggered by forms and user actions within the app itself (create/update a record, like, add to cart).",
    pitfalls: [
      "Using a Server Action where a full public REST endpoint for external consumers is actually needed — Server Actions aren't meant to be a stable public API contract.",
      "Forgetting that code inside 'use server' runs on the server and has access to secrets/DB — not validating input as strictly as a regular public API.",
    ],
  },
  "nextjs-middleware": {
    title: "Middleware",
    shortExplanation:
      "Middleware in Next.js — code (a middleware.ts file at the project root) that runs before a request reaches a specific page or Route Handler, and can redirect, rewrite the URL, add headers, or block the request.",
    detailedExplanation:
      "Middleware runs on the edge runtime (a lightweight execution environment, geographically closer to the user, with a narrower set of available Node.js APIs) and fires for every request matching the configured matcher — making it a good place for cross-cutting logic applied to many routes at once: checking auth before access to protected pages (redirect to /login if there's no valid token in a cookie), A/B testing (rewriting the URL to a different page variant for some users), localization (redirecting to the right language prefix based on the Accept-Language header), adding security headers to all responses. Important constraint: middleware shouldn't run heavy logic (DB calls, complex computation) — it adds latency to every request it applies to, and the trimmed-down edge runtime doesn't support some regular Node.js APIs (no full filesystem access, some native modules).",
    whereUsed:
      "Auth checks before protected sections, geo/language-based redirects, A/B testing via URL rewriting, adding security headers (CSP, X-Frame-Options) to all responses at once.",
    pitfalls: [
      "Configuring the matcher too broadly (e.g. catching static assets) and adding unnecessary latency to all site traffic.",
      "Trying to use Node.js APIs in middleware that aren't available in the edge runtime, and getting an unexpected build or runtime error.",
    ],
  },
  "nextjs-metadata-seo": {
    title: "Metadata API & SEO",
    shortExplanation:
      "The Metadata API in the App Router is a declarative way to set a page's title, description, Open Graph, and other SEO tags via an exported metadata object (static) or a generateMetadata function (dynamic, based on page data), instead of manually inserting tags into <head>.",
    detailedExplanation:
      "For static pages (a landing page, an 'About us' page) it's enough to export export const metadata = { title: '...', description: '...' } — Next.js inserts the corresponding tags into <head> itself. For dynamic pages where title/description depend on loaded data (a product page whose title should contain that specific product's name), you use export async function generateMetadata({ params }) — an async function that can await data loading and build metadata from it, and Next.js is smart enough not to make the same data request twice if both generateMetadata and the page component itself request the same data (React deduplicates identical fetch calls within a single server render). Besides title/description, the Metadata API supports Open Graph and Twitter Card tags (for previews when sharing on social media/messengers), canonical URL (important for pages with duplicate content under different URLs), and robots directives (controlling indexing of a specific page).",
    whereUsed:
      "Any publicly indexed pages (catalog, blog articles, landing pages) where search ranking and correct link-sharing previews on social media and messengers matter.",
    pitfalls: [
      "Setting a static title/description via a plain <title> inside the page's JSX instead of the Metadata API — this doesn't work as reliably with the App Router and streaming render.",
      "Forgetting generateMetadata for dynamic pages and leaving the same title for every product/article — a missed SEO opportunity.",
    ],
  },
  "nextjs-streaming-suspense": {
    title: "Streaming & Suspense in Next.js",
    shortExplanation:
      "Streaming lets the server send page HTML in pieces, as it becomes ready, instead of waiting for absolutely all data for every section of the page to load before sending anything to the browser.",
    detailedExplanation:
      "Without streaming, an SSR page with several independent data blocks (header, main content, a slow recommendations widget) has to wait for the slowest of them before the server even starts sending HTML — the user stares at a blank screen the whole time. Streaming in the App Router works by wrapping slow parts of the page in <Suspense fallback={<Skeleton />}>: the server immediately sends HTML for the fast parts and a fallback instead of the slow ones, and as soon as the slow data becomes ready, the server appends that section's finished HTML into the already-open HTTP response stream, and the browser swaps the fallback for real content with no JS request at all — it's the same connection, the response just arrives in several sequential chunks. This is especially valuable for pages where one slow external service (e.g. reviews from a third-party API) shouldn't block showing the rest of the already-ready part of the page to the user.",
    whereUsed:
      "Pages where one section (reviews, recommendations, analytics from a third-party service) is noticeably slower than the rest and shouldn't block showing the main content.",
    pitfalls: [
      "Wrapping in Suspense/streaming a section whose data is SEO-critical content that needs to be in the initial HTML right away.",
      "Not showing a meaningful skeleton/fallback for a streaming section — the user sees an abrupt layout 'jump' when content loads in (similar to layout shift).",
    ],
  },
};
