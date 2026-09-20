import type { ContentTranslationMap } from "../types";

export const frontendSystemDesignEn: ContentTranslationMap = {
  "fsd-large-react-app": {
    title: "Large React application architecture",
    shortExplanation:
      "At scale (dozens of developers, hundreds of screens), the main architectural question isn't 'which library to pick' but how to split the app into independent modules so teams can work in parallel without stepping on each other, and changing one feature doesn't require understanding the whole app.",
    detailedExplanation:
      "A typical approach is feature-sliced or modular structure: code is grouped not by technical file type (all hooks in one folder, all components in another) but by business feature (orders/, catalog/, checkout/), each with its own internal ui/model/api and an explicit public interface (usually index.ts, re-exporting only what's needed externally). Boundaries between features are enforced by linter rules (e.g. eslint-plugin-boundaries) that physically forbid importing from another feature's internal files bypassing its public interface — without that rule, feature isolation quickly erodes through direct 'workaround' imports, and the system reverts to its old coupling. The shared layer — reusable UI kit, utilities, common hooks — is split out separately and must not contain any specific feature's business logic (see Component Boundaries & Shared Layer). At the build-infrastructure level, large apps often move to a monorepo with several independently buildable packages, letting teams deploy and version their parts independently, and tools like Turborepo/Nx cache and parallelize builds/tests only for packages that actually changed.",
    whereUsed:
      "Products with multiple independent frontend teams, long-lived apps (2+ years) where accumulated coupling without clear boundaries becomes the main drag on development speed.",
    pitfalls: [
      "Introducing a feature-sliced structure without linter rules that physically forbid bypassing the public interface — a convention without an enforcement tool quickly breaks down under deadlines.",
      "Copying a complex modular structure from a larger project into a small app — the overhead doesn't pay off at that scale.",
    ],
  },
  "fsd-large-tables-pagination": {
    title: "Dashboard: large tables and server-side pagination",
    shortExplanation:
      "A table with tens of thousands of rows can neither render entirely in the DOM (virtualization) nor be filtered/sorted client-side only (the database must do that) — a large dashboard's architecture is built around the server returning only the needed page of already filtered and sorted data.",
    detailedExplanation:
      "Client-side filtering/sorting/pagination only works while the entire dataset is already loaded in the browser — for tens of thousands of records that means either an unacceptably large initial load or outright impossibility (data doesn't fit in memory or exceeds API limits). The server-side approach moves filters, sorting, and pagination into the request's query parameters (?filter[status]=active&sort=-createdAt&cursor=...), and the client only renders what actually arrived for one page — this requires syncing filter state with the URL (so a page refresh or shared link preserves the current data view, see URL State) and correctly invalidating the TanStack/RTK Query cache whenever any request parameter changes (usually solved by including all parameters in the query key). Virtualization (see separate topic) is additionally needed even for a single 'page' of data if that page itself contains several hundred rows — server-side and client-side virtualization solve different, complementary problems: the server limits the volume of transferred data, virtualization limits the number of DOM nodes rendered from data already received.",
    whereUsed:
      "Admin panels with large tables of orders/users/logs, monitoring dashboards with constantly growing datasets, any B2B interface with filtering across dozens of parameters.",
    pitfalls: [
      "Loading the entire dataset and filtering client-side 'for simplicity' — works on a demo with 50 records and completely breaks down in production with 50,000.",
      "Not including all active filters in the state manager's query key — the cache will serve stale data from a previous request that doesn't match the current filters.",
    ],
  },
  "fsd-realtime-permissions-slow-backend": {
    title: "Real-time updates, access permissions, slow backend",
    shortExplanation:
      "Three complications commonly seen in system design for the same dashboard: data must update in real time for other users, different roles must see a different set of data/actions, and part of the backend is objectively slow and shouldn't block the whole screen.",
    detailedExplanation:
      "Real-time updates are usually implemented via WebSocket/SSE (see separate topic), but integrating with the state manager's cache requires a decision: a 'record changed' event received over the socket should either surgically update that specific record in the TanStack/RTK Query cache (queryClient.setQueryData) or simply invalidate the relevant query key, triggering a controlled refetch — mutating local React state directly, bypassing the unified cache, quickly creates desync between 'live' socket data and regular REST data for the same resource. Access permissions on the frontend are a UX convenience (hiding unavailable actions/data), not the only layer of protection — a screen shouldn't just visually hide the 'Delete' button by role, relying solely on client-side checks: the server must independently verify permissions on every request, because client code is entirely under the user's control and can be bypassed. A slow backend endpoint (e.g. generating a complex report) shouldn't block rendering the rest of the screen — solutions include Suspense streaming (see the Next.js Streaming topic) for SSR pages, separate independent queries for fast and slow parts of the screen (rather than one combined request for all the data at once), and an explicit 'this part is still loading' indicator instead of one blocking full-page spinner.",
    whereUsed:
      "Monitoring and collaboration dashboards (multiple users viewing the same data simultaneously), apps with a role-based access model (admin/manager/regular user), screens depending on slow aggregating backend endpoints (reports, analytics).",
    pitfalls: [
      "Relying only on client-side permission checks without a duplicate check on the server on every request.",
      "Mutating local React state directly from real-time events, bypassing the state manager's unified cache — creates two independent, desyncing sources of truth for the same data.",
    ],
  },
  "fsd-observability-audit-logging": {
    shortExplanation:
      "Frontend observability is the ability to understand what's actually happening to users in production (errors, performance, anomalous behavior) without waiting for them to contact support; audit logging is recording significant user actions for later incident review and compliance requirements.",
    detailedExplanation:
      "Three main sources of frontend observability: error tracking (Sentry and similar — automatically catch unhandled exceptions and React error boundary events, with context: which user, which app version, which actions preceded the error), Real User Monitoring/RUM (real Core Web Vitals and load times collected from actual visits by real users, not from lab-run Lighthouse), and structured logging of key business events (not console.log, but sending events to a centralized system with enough context to investigate). An audit log differs from ordinary error logging in purpose: it doesn't record 'what broke' but 'who did what' — who changed permissions, who deleted a record, who approved a transaction — usually with immutable (append-only) entries and sufficient context (who, when, exactly what changed, from which IP/session), which is critical for compliance requirements (fintech, healthcare) and after-the-fact incident review. An important architectural choice is not to log sensitive data (passwords, full card numbers, tokens) even for debugging purposes, and to decide in advance which events are actually needed for future review rather than logging 'everything', which creates noise, slows down finding the relevant event, and inflates storage costs.",
    whereUsed:
      "Any production app with real users needs at least error tracking and RUM; audit logging is mandatory wherever there are regulatory requirements (fintech, healthcare, HR systems) or where traceability of sensitive actions matters (permission changes, financial operations).",
    pitfalls: [
      "Logging sensitive data (passwords, tokens, full card numbers) even for debugging purposes — a direct violation of security and often compliance requirements.",
      "Logging 'everything' without weighing event importance — creates noise that makes it harder to find the truly significant event during incident review, and inflates log storage costs.",
    ],
  },
};
