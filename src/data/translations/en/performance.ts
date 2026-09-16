import type { ContentTranslationMap } from "../types";

export const performanceEn: ContentTranslationMap = {
  "perf-core-web-vitals": {
    title: "Core Web Vitals",
    shortExplanation:
      "Core Web Vitals are a set of Google metrics measuring real user experience of page loading and responsiveness: LCP, INP (formerly FID), and CLS.",
    detailedExplanation:
      "LCP (Largest Contentful Paint) — the time the largest visible element (usually a hero image or heading) appears, showing perceived load speed. INP (Interaction to Next Paint) — the delay between a user action and the interface's visual response, showing responsiveness. CLS (Cumulative Layout Shift) — the total 'jumpiness' of the layout during loading (e.g. an image with no set size pushes text down). These metrics affect both real UX and Google search ranking.",
    pitfalls: [
      "Optimizing metrics 'by eye' without measuring via Lighthouse/PageSpeed Insights/real user data (CrUX).",
      "Not setting sizes for images and blocks that depend on async data — this hurts CLS.",
    ],
    practiceTask:
      "Run any of your pages through Lighthouse (in DevTools) and record the LCP, INP/TBT, and CLS values, then make one improvement and measure the difference.",
  },
  "perf-critical-rendering-path": {
    title: "Critical Rendering Path",
    shortExplanation:
      "The Critical Rendering Path is the sequence of browser steps from receiving HTML/CSS/JS to painting pixels on screen.",
    detailedExplanation:
      "Roughly: the browser parses HTML into the DOM, parses CSS into the CSSOM, combines them into the Render Tree, computes Layout (each element's geometry), and does Paint (filling in pixels), then Composite if there are layers. CSS is render-blocking by default — the browser won't show the page until it has received and processed all the CSS in <head>. JS can either block HTML parsing (a plain <script> with no defer/async) or not (defer, async, or scripts at the end of body).",
    pitfalls: [
      "Including large CSS/JS files with no async/defer and no split between critical and non-critical parts.",
      "Not accounting for the fact that a 'blocking' script in the middle of the HTML stops parsing right at that point in the document.",
    ],
    practiceTask:
      "Open the Performance tab in DevTools, reload the page, and find the Parse HTML, Recalculate Style, Layout, and Paint stages on the timeline.",
  },
  "perf-reflow-repaint": {
    title: "Reflow / Repaint",
    shortExplanation:
      "Reflow (layout) is recomputing the geometry and position of elements on the page; repaint is redrawing pixels without changing geometry (e.g. a color change).",
    detailedExplanation:
      "Reflow happens when something affecting elements' size or position changes (width/height, adding/removing a DOM node, a font change) — the browser has to recompute layout for the entire affected subtree, and sometimes the whole page. Repaint is cheaper: only visual properties change (color, background, visibility), geometry stays the same. Reading layout properties (offsetWidth, getBoundingClientRect) right after changing them inside a loop causes 'layout thrashing' — repeated forced recalculation instead of one.",
    pitfalls: [
      "Alternating reads and writes of layout properties in loops over DOM nodes.",
      "Frequently changing inline styles in animations instead of using transform/opacity, which typically avoid reflow.",
    ],
    practiceTask:
      "Reproduce layout thrashing on a list of 200 divs (reading offsetWidth right after a write inside a loop), measure the time with Performance.now(), then rewrite it separating the read/write phases and compare.",
  },
  "perf-bundle-optimization": {
    title: "Bundle Optimization",
    shortExplanation:
      "Bundle optimization is a set of techniques for reducing the JS/CSS size the browser has to download and run before the page becomes interactive.",
    detailedExplanation:
      "Key techniques: code splitting (breaking the bundle into parts loaded on demand — e.g. by route, or via dynamic import), tree shaking (removing unused code at build time, requires ES modules and 'pure' libraries with no top-level side effects), lazy loading heavy components and libraries, and bundle composition analysis (a bundle analyzer) to spot unexpectedly heavy dependencies.",
    pitfalls: [
      "Importing an entire library (import _ from 'lodash') where only one function is needed.",
      "Not checking the actual bundle composition with an analyzer and missing a heavy dependency that snuck in.",
    ],
    practiceTask:
      "Add @next/bundle-analyzer to the project, build it, and find the three heaviest packages in the client bundle.",
  },
  "perf-image-optimization": {
    title: "Image Optimization",
    shortExplanation:
      "Image optimization reduces image size and loads them correctly (format, size for the device, lazy loading), since images are often the heaviest resource on a page.",
    detailedExplanation:
      "Key techniques: using modern formats (WebP, AVIF) with smaller size at the same quality, responsive images (different sizes for different screens via srcset or the built-in next/image), lazy loading images below the fold (loading='lazy'), explicit width/height or aspect-ratio to prevent layout shift, priority loading (preload/priority) for the LCP image. In Next.js, the next/image component handles most of this automatically.",
    pitfalls: [
      "Marking all images on the page as priority — this brings back the problem lazy loading was meant to solve.",
      "Not specifying width/height on next/image, which loses its automatic layout-shift protection.",
    ],
    practiceTask:
      "Replace a plain <img> with next/image on a test page, set priority only on the hero image, leave the rest lazy by default, and compare LCP before/after.",
  },
  "perf-lighthouse-profiling": {
    title: "Lighthouse & Browser Profiling",
    shortExplanation:
      "Lighthouse is an automated page audit (lab data: a single run under controlled conditions) that scores Core Web Vitals and gives specific recommendations; the browser profiler (DevTools' Performance panel) shows what actually happens over time during a specific user interaction.",
    detailedExplanation:
      "Lighthouse gives lab data — reproducible measurements in a controlled environment (fixed network/CPU emulation), useful for comparing 'before/after' an optimization, but it doesn't reflect the spread of real user conditions (a slow phone, a poor network, background tabs) — that's what field data (RUM, Chrome UX Report), collected from real visits, is for. The browser DevTools' Performance panel records a detailed timeline of a specific session: you can see exactly which JS function took how long, where a layout/reflow happened, how long a frame's paint took — it's a tool for diagnosing 'why exactly is this interaction slow', unlike Lighthouse, which gives an overall aggregated score for the whole page. React DevTools Profiler is a more specialized tool specifically for React renders: it shows which components rendered within a commit and how long it took, helping find the specific component responsible for excessive or slow re-renders.",
    whereUsed:
      "Lighthouse — as a CI gate before merging (keeping performance regressions out of production), and in one-off audits before a redesign. The Performance panel and React Profiler — for pinpointing a specific complaint about lag ('the form lags while typing', 'the page takes forever to become interactive').",
    pitfalls: [
      "Relying solely on a single Lighthouse lab run as the full picture of production performance.",
      "Optimizing blindly without profiling — 'by eye' fixes often target the wrong part of the code, not the real bottleneck.",
    ],
  },
  "perf-font-optimization": {
    title: "Font Optimization",
    shortExplanation:
      "Loading web fonts can delay text from showing at all (FOIT — invisible text) or cause a visible 'jump' when a system font is swapped for the loaded one (FOUT/layout shift) — font optimization minimizes both effects.",
    detailedExplanation:
      "font-display: swap shows text in the system font immediately, then swaps it for the loaded web font as soon as it's ready — this eliminates invisible text (FOIT), but can cause a noticeable layout shift if the system font's and web font's metrics (character widths) differ significantly. next/font (Next.js's built-in solution) downloads the font at build time, self-hosts it (eliminating an extra DNS/TLS round trip to Google Fonts or another external host), and generates CSS with size-adjust/fallback metrics that pick a fallback system font whose width most closely matches the target web font — this brings font-swap CLS down to nearly zero. Preloading a critical font (usually the above-the-fold heading font) via <link rel='preload' as='font'> tells the browser to start loading that font earlier, in parallel with other resources, instead of discovering it's needed only after parsing the CSS.",
    whereUsed:
      "Any site with custom web fonts, especially marketing/public pages, where CLS and LCP directly affect perceived speed and Core Web Vitals SEO scores.",
    pitfalls: [
      "Loading a web font from an external host (e.g. directly from the Google Fonts CDN) without self-hosting — adds an extra DNS/TLS round trip before the font even starts loading.",
      "Using font-display: swap without a matched fallback — it eliminates invisible text but creates a noticeable layout shift when the font swaps.",
    ],
  },
  "perf-preload-prefetch": {
    title: "Preload / Prefetch",
    shortExplanation:
      "preload tells the browser to immediately and with high priority load a resource definitely needed on this same page (a font, a critical image, a script); prefetch is a low-priority hint to load a resource likely needed for the NEXT navigation, while the browser is idle.",
    detailedExplanation:
      "<link rel='preload' as='...'> is used for resources critical to the current page that the browser would otherwise discover too late — e.g. a font used in CSS via @font-face is only discovered after parsing the CSS, and preload kicks off its download in parallel with the CSS itself. prefetch, on the other hand, is about the future: <link rel='prefetch'> for a resource on a likely next page (e.g. the JS bundle for a page the user is likely to navigate to via a hovered link) loads it in the background at low priority when the browser isn't busy with more urgent tasks — in Next.js this is built in by default for Link components that come into view. Overusing preload (marking too many resources as critical) is counterproductive: the browser gets competing 'high-priority' requests, which can slow down the genuinely critical ones — priority only makes sense when it's relatively rare and clearly justified.",
    whereUsed:
      "preload — critical fonts, the above-the-fold hero image, a critical inline script. prefetch — links to likely next pages in navigation, especially in SPAs/Next.js with client-side page transitions.",
    pitfalls: [
      "Marking too many resources as preload 'just in case' instead of only the genuinely critical hero image.",
      "Using prefetch for very heavy resources on metered mobile traffic — background loading 'just in case' can be unwelcome for some users.",
    ],
  },
  "perf-virtualization": {
    title: "Virtualization (List Virtualization)",
    shortExplanation:
      "Virtualization renders into the DOM only the elements of a long list/table that are actually visible in the viewport (plus a small buffer), instead of rendering all thousands of items at once — the remaining items are represented only by correctly-sized 'empty' space.",
    detailedExplanation:
      "Rendering thousands of DOM nodes is expensive on its own (element creation, layout, memory), even if the user physically sees only 20-30 of them on screen at a time — virtualization eliminates this excess by tracking scroll position and dynamically rendering only the visible 'slice' of the list, swapping items in and out as the user scrolls. Libraries like react-window/react-virtual/TanStack Virtual compute which item indices fall within the current viewport (with a small buffer above/below for smoothness during fast scrolling), render only those with correct absolute positioning (position: absolute with a computed top), and set the scroll container's total height as if all items were physically present — this creates the illusion of a normal long list while only a small fraction of nodes actually exist in the DOM. Virtualization complicates handling variable-height items (you need to either know each item's height upfront or measure it asynchronously) and makes native Ctrl+F page search harder, because invisible items are physically absent from the DOM rather than merely hidden via CSS.",
    whereUsed:
      "Long lists and tables (thousands of log rows, large chats, infinite feeds, autocompletes with thousands of options), where rendering everything at once noticeably slows down mounting and scrolling.",
    pitfalls: [
      "Virtualizing short lists (dozens of items), where the overhead of virtualization itself outweighs its benefit.",
      "Not accounting for the loss of native page search (Ctrl+F) and accessibility (a screen reader may not see items outside the rendered window) when choosing to virtualize.",
    ],
  },
  "perf-measure-before-optimize": {
    title: "Measure Before You Optimize",
    shortExplanation:
      "Optimizing without measuring first is, at best, wasted time on something that wasn't a bottleneck, and at worst, added code complexity with no real performance gain; the 'measure first' rule must always precede any optimization.",
    detailedExplanation:
      "Intuition about 'what should be slow' is often wrong: developers frequently optimize a component that subjectively looks 'heavy' (lots of lines of code, complex logic), while the real bottleneck turns out to be something inconspicuous — say, synchronous layout thrashing from reading offsetHeight in a loop, or one slow third-party script blocking the main thread. The right process: first gather data (Lighthouse for lab metrics, RUM/Core Web Vitals for field data, the Performance panel or React Profiler for a specific interaction), then use that data to identify the actual bottleneck, make a targeted change, and measure again to confirm a real effect — not just that it 'feels faster'. This same rule guards against premature optimization: memoization, virtualization, lazy loading all add code complexity, and that complexity is worth introducing only where measurement confirmed a real problem, not 'just in case' throughout the whole app.",
    whereUsed:
      "Any performance work — from a specific complaint like 'the form lags' to preparing for a large-scale redesign — should start with a measurement phase, not with 'obvious' assumptions about the cause.",
    pitfalls: [
      "Optimizing 'by eye', without profiling, and spending time on code that wasn't the real problem.",
      "Not verifying the optimization's effect with a follow-up measurement — the change might have no effect, or even make things worse, unnoticed.",
    ],
  },
};
