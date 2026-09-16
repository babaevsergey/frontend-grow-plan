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
};
