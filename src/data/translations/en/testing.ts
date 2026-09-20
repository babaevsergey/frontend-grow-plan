import type { ContentTranslationMap } from "../types";

export const testingEn: ContentTranslationMap = {
  "testing-pyramid": {
    title: "Testing Pyramid (Unit / Integration / E2E)",
    shortExplanation:
      "The testing pyramid describes a recommended ratio of test types: lots of fast unit tests at the bottom, fewer integration tests in the middle, and even fewer slow e2e tests at the top.",
    detailedExplanation:
      "Unit tests check one small unit of code (a function, a hook) in isolation — the fastest and cheapest, but they don't guarantee the parts of the system work correctly together. Integration tests check the interaction of several units (e.g. a component + a hook + a store) — slower, but closer to real usage. E2E tests (Cypress, Playwright) check the entire user journey in a real (or near-real) browser — the slowest and most fragile, but give the strongest confidence a feature actually works. The 'pyramid' is advice not to invert this ratio: don't try to cover everything with e2e tests alone.",
    pitfalls: [
      "Writing unit tests that duplicate the implementation 1-to-1 (checking internal details rather than behavior) — they break on any refactor.",
      "Having no e2e test at all for a critical path (say, checkout) — a bug can pass every unit test and still break production.",
    ],
    practiceTask:
      "Take one feature in your app and map out which tests for it would be unit, which integration, and which are best left only at the e2e level.",
  },
  "testing-rtl": {
    title: "React Testing Library",
    shortExplanation:
      "React Testing Library (RTL) is a library for testing React components built on the principle 'test the way a real person uses the component'.",
    detailedExplanation:
      "Unlike Enzyme (which let you inspect a component's internal state and structure), RTL deliberately gives no easy access to implementation details: elements are found by what the user sees and hears — text, role, aria attributes — not by CSS classes or internal method names. This makes tests resilient to internal implementation refactors (swapping useState for useReducer shouldn't break tests if the external behavior hasn't changed) and pushes you toward writing more accessible UI, because tests use the same element-finding approach as a screen reader.",
    pitfalls: [
      "Using getByTestId as the primary way to find elements instead of getByRole/getByLabelText — the test stops checking accessibility.",
      "Testing a component's internal state directly instead of checking what's visible and accessible to the user on screen.",
    ],
    practiceTask:
      "Write a test for a login form that finds fields via getByLabelText, the button via getByRole, and checks that an error message appears via findByText.",
  },
  "testing-mocks": {
    title: "Mocking & Stubs",
    shortExplanation:
      "Mocks and stubs are 'stand-in' versions of real dependencies (APIs, modules, timers) used in tests to isolate the code under test from the outside world.",
    detailedExplanation:
      "A test shouldn't depend on a real network request, a real database, or a real timer — that makes tests slow, unstable (flaky due to network), and hard to use for covering edge cases (e.g. 'what if the server returns 500'). A mock is a function/module that mimics a real dependency's behavior and lets you check whether it was called and with what arguments. A stub is a simplified version that just returns a predefined value, without tracking calls. For network requests, MSW (Mock Service Worker) is often used, which intercepts fetch/XHR at the network level rather than swapping out application code.",
    pitfalls: [
      "Mocking too deep (a module's internal implementation details) instead of the entry point to an external dependency — the test breaks on a refactor that doesn't change behavior.",
      "Forgetting to reset mocks between tests (jest.clearAllMocks()) — one test's result leaks into the next.",
    ],
    practiceTask:
      "Set up MSW to intercept one GET request in your app, and write a test that checks both the successful response and an error (500) response for the same component.",
  },
  "testing-snapshot": {
    title: "Snapshot Testing",
    shortExplanation:
      "A snapshot test saves a 'snapshot' of a component's output (usually serialized DOM) to a file, and on subsequent runs compares the current output against the saved one, flagging any differences.",
    detailedExplanation:
      "Snapshot tests are useful for a quick check that the output structure hasn't changed by accident, but they have a well-known weakness: developers often update the snapshot 'blindly' (jest --updateSnapshot) when a test fails, without checking whether the change was intentional — as a result, the snapshot stops actually guaranteeing anything. Snapshots work best for small, stable, rarely-changing structures (say, serializing a config), and worse for large UI components, where any cosmetic markup change fails the test with no real benefit.",
    pitfalls: [
      "Making huge snapshots of entire pages — any cosmetic change fails the test, and the diff becomes impossible to read meaningfully.",
      "Updating snapshots automatically in CI or 'blindly' without reading what actually changed and whether it was intentional.",
    ],
    practiceTask:
      "Write a snapshot test for a small reusable component (e.g. Badge or Tag), then deliberately change one of its styles and read the snapshot diff before updating it.",
  },
  "testing-hooks": {
    title: "Testing Custom Hooks",
    shortExplanation:
      "Testing custom hooks checks their behavior (returned values, reaction to changes) without needing to render a specific UI component that uses them.",
    detailedExplanation:
      "A custom hook can't be called directly as a regular function in a test — the Rules of Hooks require a React environment. That's what renderHook from @testing-library/react is for: it 'mounts' the hook into a test wrapper component and gives access to its return value via result.current, plus a rerender function for simulating prop changes and act for wrapping async state updates.",
    pitfalls: [
      "Forgetting to wrap state-changing calls in act() — the test can produce warnings or a stale result.current.",
      "Testing a custom hook only through a full render of its consumer component, when renderHook would give a simpler, faster test.",
    ],
    practiceTask:
      "Write a test for useDebounce (or useLocalStorage) from the Practice Tasks section using renderHook, checking both the initial value and behavior after input changes.",
  },
  "testing-jest-vitest-playwright": {
    title: "Jest vs Vitest vs Playwright",
    shortExplanation:
      "Jest and Vitest are test runners for unit/integration tests (running JS code in a Node-like environment with DOM emulation); Playwright is a tool for E2E tests that drives a real browser and checks the app the way an actual user would see it.",
    detailedExplanation:
      "Jest has historically been the most common test runner for React, but it doesn't understand ESM natively and requires code transformation (via Babel or ts-jest), which noticeably slows down test runs on large projects. Vitest is designed specifically for Vite and the modern ESM stack — it reuses the project's already-configured Vite setup (path aliases, plugins), runs tests significantly faster thanks to native ESM and the same architecture as the dev server, and offers an API nearly identical to Jest's (describe/it/expect), making migration relatively easy. Both tools use jsdom or happy-dom — a DOM emulation in Node.js, not an actual browser — so they can't catch problems specific to real rendering (real CSS computation, real element sizes, real browser API behavior). Playwright is a fundamentally different class of tool: it drives an actual Chromium/Firefox/WebKit instance, clicks, types text, and checks visual/network aspects the way they really happen in a browser, and is specifically built for E2E scenarios (a full user journey across several pages), not for fast isolated unit tests of individual functions/components.",
    whereUsed:
      "Jest/Vitest — unit tests for utilities and hooks, integration tests for components with React Testing Library. Playwright — critical end-to-end user flows (signup, checkout, payment), cross-browser checks, visual regression via built-in screenshot comparisons.",
    pitfalls: [
      "Trying to test complex user scenarios (multiple pages, real navigation) via jsdom tests instead of E2E — jsdom doesn't reproduce real browser behavior.",
      "Covering every small function with Playwright E2E tests instead of unit tests — E2E tests are much slower and more expensive to maintain at that granularity.",
    ],
  },
  "testing-flaky-tests": {
    title: "Flaky Tests",
    shortExplanation:
      "A flaky test is one that sometimes fails and sometimes passes with no code changes between runs — usually because of a hidden dependency on timing, execution order, or a real network, rather than an actual bug in the code under test.",
    detailedExplanation:
      "Common causes of flakiness: hardcoded delays (await sleep(1000) instead of waiting for a specific condition) — the test either waits too long 'just in case' (slow) or sometimes doesn't wait long enough for the real event (fails); leftover state between tests (a mock not reset in afterEach, or a shared instance used by several tests that run in an unpredictable order); real network requests instead of mocked ones (the test depends on an external service's availability and speed, which it doesn't control); race conditions in the test's own async code (several promises whose resolution order isn't guaranteed). The fix differs per cause: replace fixed delays with explicit waiting for a condition (waitFor from Testing Library, which polls a condition until it's true or times out, instead of guessing a specific millisecond count), explicitly isolate state between tests (beforeEach/afterEach with a full mock reset), mock everything external (network, time, randomness) instead of relying on the real environment. Ignoring flaky tests (just retrying them in CI until they pass) isn't a fix, it's masking the problem: the team gradually stops trusting a red test status at all, which defeats the whole point of testing.",
    whereUsed:
      "Diagnosing CI pipelines with unstable test runs, reviewing tests involving async code before merging, any tests interacting with real time, the network, or shared state between tests.",
    pitfalls: [
      "Using fixed setTimeout delays in tests instead of explicitly waiting for a specific condition.",
      "Setting up automatic retries for flaky tests in CI 'so they don't get in the way' instead of investigating and fixing the real cause of the instability.",
    ],
  },
  "testing-what-to-test": {
    title: "What to Test and What Not To",
    shortExplanation:
      "Worth testing: behavior the user sees, and business logic where bugs are costly. Not worth testing: implementation details (internal state, specific internal function names) — such tests break on refactors even when actual behavior hasn't changed.",
    detailedExplanation:
      "The principle behind React Testing Library ('the more your test resembles the way a real user uses the app, the more confidence it gives you') is to test through what the user sees and does (find text on screen, click a button, check that a message appeared), not through access to a component's internal implementation (don't directly check an internal useState's value or a specific private method call). Tests tied to implementation details give a false sense of safety: they fail en masse on purely cosmetic refactors (renaming an internal variable, restructuring components with no change to visible behavior), creating noise that trains people to ignore red tests, instead of failing exactly when behavior that matters to the user actually changes. Not everything deserves equal coverage: critical business logic (price calculation, access rights, payment validation) deserves thorough tests of many edge cases, while trivial prop-drilling or simple presentational markup with no logic doesn't justify a separate test just for the sake of 'having a test'. 100% code coverage isn't a goal in itself or a guarantee of quality: you can have 100% line coverage while checking zero real user scenarios, if the tests call functions but never assert anything meaningful about the result.",
    whereUsed:
      "Shaping a testing strategy at project kickoff, reviewing tests in a PR ('does this test check behavior or implementation?'), prioritizing which parts of the codebase deserve deeper edge-case coverage.",
    pitfalls: [
      "Writing tests that access a component's internal state or private methods directly instead of checking visible behavior.",
      "Chasing code-coverage percentage as a goal in itself instead of meaningfully checking real user scenarios and edge cases.",
    ],
  },
};
