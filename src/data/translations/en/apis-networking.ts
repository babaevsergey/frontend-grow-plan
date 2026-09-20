import type { ContentTranslationMap } from "../types";

export const apisNetworkingEn: ContentTranslationMap = {
  "apis-http-semantics": {
    title: "HTTP: Methods, Status Codes, Headers",
    shortExplanation:
      "An HTTP method describes the request's intent (fetch/create/fully replace/partially update/delete), the status code describes the outcome category, and headers carry metadata about the request and response that isn't part of the body itself.",
    detailedExplanation:
      "GET and HEAD must be safe (don't change server state) and idempotent (repeating the call gives the same result); PUT and DELETE are idempotent but not safe (they change state, but a repeated identical call doesn't create a new effect beyond the first); POST is not idempotent by default (two identical POSTs can create two different records) and isn't safe; PATCH is usually not idempotent when it describes a 'delta' change (increment), though it can be idempotent when it describes a field's final value. Status codes are grouped by their first digit: 2xx — success (200 OK, 201 Created, 204 No Content — success with no response body), 3xx — redirect (301 permanent, 302/307 temporary, differing in whether the request method is preserved on the follow-up request), 4xx — client error (400 bad request, 401 unauthenticated, 403 authenticated but no permission, 404 not found, 409 state conflict), 5xx — server error. Headers like Cache-Control, ETag, Authorization, Content-Type aren't part of the response's 'data' — they're protocol-level metadata that you need to be able to read and set explicitly when working with fetch/axios, rather than relying on 'magic' default client behavior.",
    whereUsed:
      "Designing and consuming REST APIs, configuring retries on network errors (only idempotent requests are safe to retry without extra protection), handling responses by status-code category in a shared app API client.",
    pitfalls: [
      "Automatically retrying POST requests without an idempotency key — risk of creating duplicate records on network failures.",
      "Using GET for requests that trigger server-side side effects — violates GET's expected safety (e.g. browser prefetch could accidentally trigger that side effect).",
    ],
  },
  "apis-cors-preflight": {
    title: "CORS & Preflight",
    shortExplanation:
      "CORS (Cross-Origin Resource Sharing) is a browser mechanism that by default blocks JS code on one origin (domain+protocol+port) from reading the response of a request to another origin, unless the server explicitly allows it via headers; preflight is a preliminary OPTIONS request the browser sends to ask permission before 'unsafe' requests.",
    detailedExplanation:
      "The same-origin policy is the browser's default protection: a script on https://app.example.com can't read a fetch response from https://api.other.com unless api.other.com's server explicitly adds an Access-Control-Allow-Origin header permitting that specific origin (or any origin, via *). Important: the browser still sends the actual request regardless (the server receives it and can still perform a side effect) — CORS specifically blocks the client-side JS code from READING the response, not the request from being made at all. A preflight request (an automatic OPTIONS sent ahead of the actual request) is sent by the browser when the request is considered 'non-simple' — not GET/HEAD/POST with a simple Content-Type, or it carries non-standard headers (e.g. Authorization) — the server must respond to OPTIONS with the correct CORS headers allowing the needed method and headers before the browser sends the real request. credentials: 'include' (for sending cookies cross-site) requires Access-Control-Allow-Origin to be a specific domain rather than *, plus Access-Control-Allow-Credentials: true on the server.",
    whereUsed:
      "Any architecture where frontend and backend are served from different domains/ports (an SPA on one domain, an API on another; local dev on localhost:3000 calling an API on localhost:4000).",
    pitfalls: [
      "Assuming CORS fully protects the server from unwanted requests — it's a browser protection on reading the response, not server-side authentication/authorization.",
      "Setting Access-Control-Allow-Origin: * together with credentials: include — the browser flatly forbids this combination per spec.",
    ],
  },
  "apis-retry-timeout-backoff": {
    title: "Retry, Timeout, Exponential Backoff",
    shortExplanation:
      "A timeout limits how long the app is willing to wait for a response before treating the request as failed; retry repeats a failed request; exponential backoff exponentially increases the pause between retries so as not to bombard an already overloaded or temporarily unavailable server with new requests.",
    detailedExplanation:
      "Without a timeout, a request to a hung or very slow server can 'hang' indefinitely, blocking the UI's loading state forever — an AbortController combined with setTimeout lets you explicitly cancel a fetch if no response arrives within a reasonable window. Retrying only makes sense for temporary, likely-transient errors (network failure, 503 Service Unavailable, timeout) — retrying on a 400 Bad Request or 401 Unauthorized is pointless, because the error won't go away from another attempt without changing the request itself. Exponential backoff (a delay of the form base * 2^attempt, usually with random jitter added) solves the 'thundering herd' problem — if hundreds of clients get an error at the same time and all retry at the same fixed interval, they'll simultaneously overload the already-struggling server again; a growing, slightly randomized delay spreads retries out over time. Retry must always have a limit on the number of attempts — an unbounded retry during a prolonged outage becomes its own DoS-like source of load.",
    whereUsed:
      "Integrations with external/third-party APIs, unstable networks (mobile clients), background job queues, any critical mutation where a temporary network hiccup shouldn't permanently lose the user's action.",
    pitfalls: [
      "Retrying non-idempotent requests (POST without an idempotency key) — risk of duplicating the side effect on retry.",
      "Not capping the maximum number of retry attempts — infinite retries during a prolonged outage become a source of excess load themselves.",
    ],
  },
  "apis-polling-websocket-sse": {
    title: "Polling vs WebSocket vs SSE",
    shortExplanation:
      "Polling — the client periodically asks the server itself 'is there anything new'; SSE (Server-Sent Events) — the server keeps one open HTTP connection and pushes events to the client itself, but only in one direction; WebSocket — a fully bidirectional persistent communication channel between client and server.",
    detailedExplanation:
      "Polling (a regular periodic fetch on a timer) is simple to implement and works over plain HTTP with no special infrastructure, but creates constant 'idle' load (most polls bring nothing new) and introduces a delay of up to the poll interval between a real event and the client receiving it. SSE uses a single long-lived HTTP request (the browser's EventSource API), through which the server can push text events to the client at any moment without a new request — this is simpler than WebSocket to implement (plain HTTP, works through most proxies/firewalls with no special config, auto-reconnects on drop), but it's fundamentally one-directional: the client can't send data back over the same channel. WebSocket establishes a separate protocol over TCP after an initial HTTP handshake (Upgrade: websocket) and provides a full bidirectional, low-latency channel in both directions — necessary when the client needs to frequently and quickly send data to the server in real time (chat, collaborative editing, games), not just receive updates.",
    whereUsed:
      "Polling — low-frequency updates where simplicity matters more than latency (checking a long-running background job's status every few seconds). SSE — notifications, live feeds, progress for long-running operations (server -> client). WebSocket — chats, collaborative document editing, real-time games, trading terminals (frequent bidirectional exchange).",
    pitfalls: [
      "Using WebSocket where only a stream of server updates is actually needed (SSE would be simpler with less infrastructure complexity).",
      "Forgetting to handle reconnection and state recovery when a WebSocket connection drops (unlike EventSource, which auto-reconnects out of the box).",
    ],
  },
  "apis-pagination-filtering-sorting": {
    title: "Pagination, Filtering, Sorting",
    shortExplanation:
      "Offset-based pagination (page + page size) is simple but degrades on large datasets and 'drifts' under concurrent data changes; cursor-based pagination (a pointer to the last item seen) is more stable and efficient for large, frequently-changing collections.",
    detailedExplanation:
      "Offset pagination (?page=5&limit=20, which at the DB level means OFFSET 80 LIMIT 20) requires the database to literally skip (scan and discard) the first 80 rows before returning the ones you want — on very large tables this gets progressively slower as the offset grows. It's also unstable under concurrent changes: if someone deletes a record from page 1 between fetching page 1 and page 2, every following record 'shifts', and the same item can either repeat across two pages or vanish from the results entirely. Cursor-based pagination passes a pointer ('cursor') to the last item seen (usually its id or a combination of the sorted fields) instead of a page number — a query like WHERE id > lastSeenId ORDER BY id LIMIT 20 is efficient no matter how 'deep' into the list the user has gone, and is resilient to inserts/deletes in the already-viewed part of the list. Filtering and sorting are typically passed as separate query parameters (?sort=price&order=asc&category=shoes), and it's important that the backend has matching database indexes for any field allowed for sorting/filtering — without an index, sorting a large dataset becomes an expensive operation regardless of the pagination approach.",
    whereUsed:
      "Offset pagination — admin panels and small tables, where the ability to 'jump' directly to page N matters. Cursor-based — infinite-scroll feeds (social networks, product catalogs), large and frequently changing datasets, GraphQL Relay-style connections.",
    pitfalls: [
      "Using offset pagination for very large or frequently changing collections and getting duplicate/missing items that are hard to diagnose.",
      "Allowing sorting on a field with no database index — on large tables such a query becomes disproportionately slow regardless of pagination style.",
    ],
  },
  "apis-n-plus-one-dataloader": {
    title: "N+1, Batching, DataLoader",
    shortExplanation:
      "N+1 is a common performance problem where one request for a list of N records triggers N more separate requests (typically to the DB) for each record's related data, instead of a single batched request for all related data at once.",
    detailedExplanation:
      "A classic example: a request for a list of 50 posts (1 query), then a separate query for each post's author (50 more queries) — 51 total, where two would have sufficed (posts + all needed authors via a single JOIN or a single query with WHERE id IN (...)). This problem shows up especially often in GraphQL, where each field's resolver is written independently and seemingly unaware that 'sibling' records exist in the same list — the author field resolver for each post in the list is called separately, unaware that 49 other identical calls are happening as part of the same client request. DataLoader (a library originally created by Facebook for GraphQL) solves this via batching and caching within a single event-loop tick: instead of immediately querying the DB on every .load(id) call, it accumulates every id requested during that 'tick', then makes a single batched query for all the accumulated ids at once, returning each caller the corresponding result from the shared batch — plus it caches the result within a single request, so a repeated .load(same id) doesn't create a new query at all.",
    whereUsed:
      "GraphQL resolvers with related entities (posts and their authors, orders and their line items), any REST endpoint returning a list with nested related data, ORM code where it's easy to accidentally write a loop with a query inside it.",
    pitfalls: [
      "Writing a loop with an awaited DB query inside it for each list item — the classic source of N+1, easy to miss in code review.",
      "Creating a single DataLoader instance globally for the whole app instead of one per HTTP request — leaks the cache across different users/requests.",
    ],
  },
  "apis-webhooks": {
    title: "Webhook: a callback from server to server",
    shortExplanation:
      "A webhook is a 'reverse API': instead of your app periodically asking a third-party service 'is there anything new?' (polling), the third-party service itself makes an HTTP request to a URL you registered in advance, at the moment something worth reporting happens.",
    detailedExplanation:
      "Technically, a webhook is just a regular HTTP POST request with a body (usually JSON) that the sending service (Stripe, GitHub, Slack, etc.) makes to a publicly reachable endpoint you registered ahead of time in that service's settings. It isn't a separate protocol or a persistent connection (unlike WebSocket) — each event is a one-off, independent request, and no channel exists between events. The real engineering difficulty with webhooks isn't receiving the request itself but reliably handling everything around it: (1) authenticity verification — the server must confirm the request genuinely came from the claimed sender and not from an arbitrary client that discovered the endpoint URL (usually via an HMAC signature in a header, computed with a shared secret); (2) idempotency — the sending service may deliver the same event more than once (e.g. if your server didn't respond 200 OK in time), so the handler must recognize an already-processed event by its unique id and avoid running the side effect twice; (3) a fast response — the handler should return 2xx as quickly as possible (usually within a few seconds), pushing heavy business logic into a background job queue, because most sending services retry the request if they don't get a fast successful response, and eventually mark the webhook as 'undelivered' after enough failed attempts.",
    whereUsed:
      "Payment notifications (Stripe, PayPal), repository events (GitHub/GitLab on push/PR), CRM/marketing platform integrations, any situation where a third-party service needs to tell your backend about something that happened on its side, without your backend having to constantly poll its API.",
    pitfalls: [
      "Not verifying the authenticity/signature of an incoming webhook request — the endpoint becomes open to forged events from anyone who learns the URL.",
      "Running heavy synchronous business logic directly inside the webhook handler instead of responding 2xx quickly and offloading the work to a queue — leads to timeouts and repeated deliveries of the same event from the sender.",
      "Not accounting for the same event potentially arriving more than once (at-least-once delivery) — without checking the event's unique id, a side effect (like a credit) can accidentally run twice.",
    ],
    practiceTask:
      "Design (on paper or in code) a webhook handler for 'order paid': describe how you verify the request's signature, how you ensure idempotency on redelivery, and exactly what's returned to the sender immediately versus what goes into a background queue.",
  },
  "apis-web-worker": {
    title: "Web Worker: a parallel thread for heavy computation",
    shortExplanation:
      "A Web Worker runs JS code on a separate OS thread, fully isolated from the page's main thread (where all regular JS and rendering happen) — this lets you run heavy CPU-bound computation without blocking the UI or causing the interface to freeze.",
    detailedExplanation:
      "JavaScript in the browser is single-threaded by default: any heavy synchronous operation (complex parsing, encryption, image processing, large computations) runs on the same thread as rendering and user input handling — until it finishes, the page can neither repaint nor react to a click. A Web Worker solves this by running a separate JS context on its own OS thread: it has no access to the DOM, window, or document (a deliberate restriction — the DOM isn't thread-safe), and data exchange with the main thread happens asynchronously via message passing (postMessage/onmessage) rather than shared memory with direct access. Data passed between threads via postMessage is cloned by default (the structured clone algorithm) — meaning it's not a shared reference to the same object but a copy; for large binary data (e.g. ArrayBuffer) you can use transferable objects, which transfer ownership without copying, significantly faster for large arrays. A dedicated worker is tied to the single tab/script that created it; a shared worker can be accessed by multiple tabs of the same origin at once.",
    whereUsed:
      "Heavy client-side data processing (parsing large CSV/JSON, image/video processing in the browser), complex computation (encryption, compression, physics simulations), any scenario where synchronous work would take a noticeable amount of time (tens to hundreds of milliseconds or more) and would otherwise freeze the interface.",
    pitfalls: [
      "Expecting an object passed via postMessage to remain a shared reference between threads — by default it's cloned, not passed by reference, which can unexpectedly slow down exchanging large objects if transferable objects aren't used.",
      "Trying to directly access window/document inside worker code — these objects simply don't exist there, and such code will throw when run inside a worker.",
    ],
    practiceTask:
      "Move a heavy synchronous function (e.g. a recursive Fibonacci calculation for a large n) into a separate Web Worker and compare the interface's responsiveness (e.g. CSS animations or reacting to a click) against a version where the same function is called directly on the main thread.",
  },
  "apis-service-worker": {
    title: "Service Worker: a programmable proxy between the app and the network",
    shortExplanation:
      "A Service Worker is a special kind of worker that lives separately from any specific tab, intercepts every network request the page makes (via the fetch event), and decides itself whether to respond from cache, go to the network, or do both — it's the foundation of offline mode, programmable caching, and browser push notifications.",
    detailedExplanation:
      "Unlike a regular Web Worker, which is tied to a single page and dies with it, a Service Worker is registered for the entire origin (domain) and keeps existing in the browser's background regardless of whether a specific tab is open — it has its own lifecycle with install (initial setup, typically where static assets are pre-cached via the Cache API) and activate (the old worker version is replaced by the new one, typically where outdated caches are cleaned up) states. Once activated, a Service Worker intercepts EVERY network request from the pages it controls via the fetch event, and explicitly decides a response strategy: cache-first (check cache first, go to the network only if the cache is empty; good for static assets that rarely change), network-first (try the network first, fall back to cache when offline; suited to frequently updated data), or stale-while-revalidate (immediately return the cached version, but simultaneously hit the network and update the cache for next time). It's precisely this ability to programmatically answer requests even with no network at all that makes PWA offline mode technically possible. The second fundamental use case is push notifications: a Service Worker can receive push events from the server even when the app's tab is completely closed, and show a system notification via the Notification API. An important security/lifecycle detail: a Service Worker only works over HTTPS (except localhost for development) precisely because it's capable of intercepting and forging network traffic — allowing that over plain HTTP would be a serious security hole.\n\nCache invalidation on deploy is a separate, easily overlooked part of the lifecycle. Cache Storage has no built-in TTL or automatic cleanup: if you just keep adding files to a cache under the same name ('static'), after deploying a new version of the app the old cached assets keep being served to the user indefinitely, because the Service Worker has no way of physically knowing something changed on the server. The standard fix is to version CACHE_NAME itself (e.g. 'static-v2' instead of 'static-v1') on every release: the new worker version's install caches assets under the new name without touching the old cache, and activate — an event that only fires once the new worker has fully replaced the old one — iterates over every existing cache name via caches.keys() and deletes any that don't match the current CACHE_NAME. This guarantees that after every release, Cache Storage holds exactly one current version of the assets, rather than accumulating an endless history of versions from past deploys. An important timing detail: by default a new Service Worker enters a 'waiting' state and doesn't activate until every tab running the old version has closed (a safeguard against two incompatible code versions running simultaneously on the same page) — if you need immediate activation right after install, self.skipWaiting() (in install) and clients.claim() (in activate) force the switch to the new version without waiting for tabs to close, at the cost of briefly ending up with a new Service Worker but a not-yet-updated open tab.",
    whereUsed:
      "Progressive Web Apps (offline mode, push notifications), programmable caching of network requests independent of server headers, apps that need to function (at least partially) without a network — maps, readers, field-work tools; versioning CACHE_NAME with cleanup in activate is a mandatory part of any release process that uses a Service Worker.",
    pitfalls: [
      "Not changing CACHE_NAME when deploying a new version of the assets — without a name change, install simply won't touch the existing cache (cache.open with the same name reopens the same cache), and users keep getting the old files indefinitely.",
      "Changing CACHE_NAME but forgetting to clean up old caches in activate — a new cache appears, but the old ones stay hanging around in Cache Storage forever, uselessly taking up space on the user's device.",
      "Using a cache-first strategy for data that needs to be as fresh as possible (e.g. an account balance) — the user sees stale data while believing it's current.",
      "Not accounting for the fact that a Service Worker requires HTTPS in production — code only tested on localhost may unexpectedly fail to register in production without HTTPS.",
    ],
    practiceTask:
      "Register a simple Service Worker that caches the home page and one CSS file on install, implement a cache-first strategy for those assets, then disable the network in DevTools and confirm the page still opens. Then change one of the cached files, bump CACHE_NAME to a new version, deploy (or reload the page), and use the Application → Cache Storage tab in DevTools to confirm the old cache was actually deleted after activate rather than left sitting alongside the new one.",
  },
  "apis-pwa": {
    title: "PWA: a web app installable like a native one",
    shortExplanation:
      "A PWA (Progressive Web App) isn't a separate technology, but a set of web standards (Service Worker + Web App Manifest + HTTPS) that together let a regular site behave like a native app: installable to the home screen, working offline, and receiving push notifications, while remaining an ordinary site with a single codebase.",
    detailedExplanation:
      "PWA has three mandatory technical pillars: (1) the Web App Manifest — a JSON file (manifest.json) describing how the app should look when installed (name, icons of various sizes, theme color, display: 'standalone' to hide the browser UI and look like a native app rather than a browser tab); (2) a Service Worker — provides offline functionality via caching and enables push notifications (see the separate topic); (3) mandatory HTTPS — without it the browser won't offer installation or register a Service Worker. The browser (typically Chrome/Edge on desktop and Android) shows an 'install app' prompt when a site meets the 'installability' criteria — a valid manifest, a registered Service Worker with a fetch handler, HTTPS; once installed, the app icon appears on the home screen/in the OS's app list, and it launches in its own window with no browser address bar, indistinguishable to an ordinary user from a native app in how it launches. An important limitation: a PWA is still technically running inside the browser engine (not a native OS runtime), so access to some native APIs is limited compared to a real native app (some sensors, deep OS integration, listing in certain app stores) — a trade-off made in exchange for a single codebase for both the web and the 'app', instead of separate native development for each platform.",
    whereUsed:
      "Products where a home-screen presence matters without the cost of building separate native iOS/Android apps (media, e-commerce, field-work tools), scenarios with unreliable internet (PWA offline mode via Service Worker), a desire for a single codebase covering both the web and the 'app'.",
    pitfalls: [
      "Forgetting the mandatory fetch handler in the Service Worker — some browsers won't consider the site 'installable' without it, even if the Service Worker is technically registered.",
      "Expecting full parity with a native app's access to device APIs — a PWA is still limited by what the browser engine exposes, and some native capabilities (deep OS integration, some sensors, App Store listing) are unavailable or restricted.",
      "Not testing the install prompt under real conditions (HTTPS, a valid manifest, a registered Service Worker) — on localhost without HTTPS, the browser makes an exception for some checks, masking issues that will show up in production.",
    ],
    practiceTask:
      "Add a manifest.json with icons and display: 'standalone' to a simple site that already has a registered Service Worker, open the site in Chrome on Android or via 'Add to Home Screen' in DevTools → Application, and confirm the app opens in its own window with no browser UI.",
  },
};
