import type { ContentTranslationMap } from "../types";

export const frontendArchitectureEn: ContentTranslationMap = {
  "arch-feature-sliced": {
    title: "Feature-Sliced Design (FSD)",
    shortExplanation:
      "Feature-Sliced Design is a methodology for organizing frontend code by layers (app, pages, widgets, features, entities, shared) and by feature within layers, rather than by a file's technical type.",
    detailedExplanation:
      "Classic 'by type' organization (all components in components/, all state in store/, all hooks in hooks/) scales poorly: understanding one feature means jumping across dozens of folders. FSD groups code around business meaning: each layer can't import from layers above it (entities doesn't know about features, features doesn't know about widgets), and within a layer, code is split into independent 'slices' (e.g. features/add-to-cart, features/auth). This makes ownership boundaries explicit and makes deleting/moving a whole feature easier.",
    pitfalls: [
      "Adopting an FSD structure for a small project where simple organization by feature without strict layers would suffice — unnecessary ceremony.",
      "Breaking the 'bottom-up' import rule 'just this once', opening the door to gradual boundary decay.",
    ],
    practiceTask:
      "Take an existing component from your project and determine which FSD layer (shared/entities/features/widgets) it would belong to, and why.",
  },
  "arch-layered": {
    title: "Separation of UI and Business Logic",
    shortExplanation:
      "Separating UI from business logic means components are responsible only for display and interaction, while computations, rules, and data handling are extracted into separate functions/hooks.",
    detailedExplanation:
      "A component that mixes JSX, API calls, validation, and complex computations is hard to test and reuse: testing a business rule means rendering the entire component. Extracting logic into custom hooks (useCartTotal, useAuthStatus) or pure functions (calculateDiscount, validateOrder) lets you test it independently of the UI and reuse it across different presentation components (e.g. the same logic for a desktop and mobile version of a page).",
    pitfalls: [
      "Splitting logic and UI 'for the sake of it' where the component is already simple — unnecessary abstraction.",
      "Leaving complex business-rule branching right in JSX (ternaries nested in ternaries) instead of extracting a named function.",
    ],
    practiceTask:
      "Find a component in your project with a computation inline in JSX (not in a separate function/hook) and extract that computation into a separate, tested function.",
  },
  "arch-monorepo": {
    title: "Monorepos",
    shortExplanation:
      "A monorepo is a single git repository housing several related packages or apps (e.g. a site, an admin panel, and a shared component library).",
    detailedExplanation:
      "A monorepo solves the problem of reusing code across several apps owned by one team: a shared UI kit, types, and utilities live in a separate package within the same repository and are linked locally (workspace), with no npm publishing or manual versioning. Tools like Turborepo, Nx, or pnpm workspaces add build caching and run tasks only for changed packages. The price is more complex CI/CD and build tooling setup, plus a risk of excessive coupling between 'independent' packages.",
    pitfalls: [
      "Setting up a monorepo for a single standalone app with no real need for reuse across multiple projects.",
      "Not configuring build caching (Turborepo/Nx) — CI starts rebuilding literally everything on any small change.",
    ],
    practiceTask:
      "Describe (as a folder tree) a monorepo structure for a project consisting of a site, an admin panel, and a shared component library, noting which packages depend on which.",
  },
  "arch-turborepo-vs-nx": {
    title: "Turborepo vs Nx",
    shortExplanation:
      "Turborepo and Nx both speed up monorepo work by caching task results and running only the packages affected by a change, but Nx additionally offers ready-made generators, framework-specific plugins, and a dependency graph out of the box, whereas Turborepo is a more minimalist tool focused almost entirely on task orchestration and caching.",
    detailedExplanation:
      "Both tools solve the same basic monorepo problem: without them, any CI command (say, npm run build) rebuilds literally everything, even if only one file in one package changed — that's slow and doesn't scale to dozens of packages. Both build a dependency graph between packages (who depends on whom), run tasks in the correct topological order (build the library first, then the apps that depend on it), and cache each task's result by a hash of its input files — if the hash hasn't changed, the task simply pulls the result from cache (local or remote) instead of re-running. Turborepo is deliberately minimalist: a single config (turbo.json) describing which tasks depend on which and what to cache, while the actual build/test/lint stay as regular npm/pnpm scripts per package — Turborepo doesn't impose its own project structure or build tools. Nx has historically been more 'batteries included': code generators (nx generate scaffolds a new component/library from a template), plugins with ready-made presets for specific frameworks (React, Angular, Next.js), built-in dependency graph visualization (nx graph), and stricter module-boundary rules between packages (module boundaries, enforceable via the linter) — this gives more out-of-the-box infrastructure for large organizations, but also a more pronounced 'own way' you have to work within. In practice, the choice often comes down to this: Turborepo suits a team that wants a lightweight tool on top of an already-existing project structure and their own npm scripts; Nx pays off more for large organizations that need shared generators, enforced module boundaries, and ready-made framework integration from day one.",
    whereUsed:
      "Monorepos with several apps and shared packages (UI kit, utilities, types), CI pipelines where it matters not to rebuild the whole project on every small change, large organizations with dozens of teams that need shared project-structure standards (more often solved via Nx).",
    pitfalls: [
      "Not configuring a task's outputs/inputs precisely — if the tool doesn't know which files actually affect the result, the cache can either go stale needlessly often or, worse, serve a stale result when a genuinely relevant file wasn't accounted for in the hash.",
      "Relying only on a local cache with no remote cache configured — then every new CI runner or new developer gets no benefit from results someone else already computed.",
    ],
    practiceTask:
      "Configure turbo.json (or nx.json) for a monorepo of three packages (one shared library and two apps depending on it) so that building one app doesn't rebuild the library if its code hasn't changed.",
  },
  "arch-design-system": {
    title: "Design Systems",
    shortExplanation:
      "A design system is a set of reusable UI components, tokens (colors, spacing, typography), and usage rules, shared across all of a company's products.",
    detailedExplanation:
      "A design system solves two problems at once: visual consistency across the product (one button, one spacing scale, one color palette everywhere) and faster development (not reinventing Button/Modal/Input in every new feature). Technically, it's usually a separate package of UI components built on design tokens (variables for color/spacing/fonts), versioned independently from product apps and documented, often via Storybook.",
    pitfalls: [
      "Building a full design system for a single small product with no reuse prospects — excessive overhead.",
      "Letting product teams 'work around' the design system with one-off hardcodes 'just this once' — over time the system loses its purpose.",
    ],
    practiceTask:
      "List 5 hardcoded color/spacing values from any of your projects and turn them into named tokens accessed via variables.",
  },
  "arch-composition": {
    title: "Composition over Inheritance",
    shortExplanation:
      "In React, reusing behavior across components is achieved via composition (passing components as props/children), not class inheritance.",
    detailedExplanation:
      "React was designed around composition from the start: instead of creating a BaseModal and having ConfirmModal, InfoModal, etc. inherit from it, React convention is to pass variable parts as children or as specialized props (e.g. <Modal footer={<Button />} />). This gives more flexibility than inheritance: a component can be 'assembled' from different pieces in different parts of the app with no new classes and no fragile inheritance hierarchy where a base-class change risks breaking every subclass.",
    pitfalls: [
      "Trying to build component inheritance hierarchies (class ConfirmModal extends Modal) where composition would solve the problem more simply.",
      "Overusing children/render props where a simple boolean prop would do — needlessly complicates the component's API.",
    ],
    practiceTask:
      "Take two similar components with partially shared structure (e.g. two different modal dialogs) and merge them into one via composition (children/props) instead of copying code.",
  },
  "arch-component-boundaries": {
    title: "Component Boundaries & Shared Layer",
    shortExplanation:
      "Component boundaries are a deliberate decision about where one component's responsibility ends and another's begins; the shared layer is common code (UI kit, utilities, hooks) used by several features at once, belonging to none of them.",
    detailedExplanation:
      "A poorly drawn boundary usually looks like a component that simultaneously knows a specific feature's business logic and reusable UI details — for example, an 'Add to cart' button that makes an API call inside itself and contains a product card's markup, instead of being a generic button that receives onClick from outside. A practical rule: if code is needed unchanged by two or more independent features, it's a candidate for the shared layer; if it's specific to one feature, it should live inside that feature, even if it could technically be 'generalized'. Premature generalization (moving something used exactly once into shared) is just as much an architectural mistake as its opposite (duplicating something that genuinely needs to be shared) — just less immediately visible; it adds a layer of indirection with no real benefit.",
    whereUsed:
      "Designing a shared layer (packages/ui in a monorepo, the shared/ folder in a feature-sliced structure) matters in any medium-to-large project where several teams or features use the same buttons, inputs, modals, and auth hooks.",
    pitfalls: [
      "Pulling a component used right now in exactly one place into shared 'for the future' — premature generalization complicates code with no current benefit.",
      "Letting a shared component gradually accumulate logic specific to one feature via conditional props (isCartVariant, showOrderBadge) — a sign the boundary was drawn wrong.",
    ],
  },
  "arch-config-driven-ui": {
    title: "Config-Driven UI",
    shortExplanation:
      "Config-driven UI is an approach where the interface's structure and behavior (a form's set of fields, a table's columns, a wizard's steps) are described by a declarative data config, rather than hardcoded into JSX anew every time.",
    detailedExplanation:
      "Instead of writing a separate form component for each entity (UserForm, ProductForm, OrderForm) with almost identical structure (label, input, validation, error), you can describe fields as a configuration array ({ name, label, type, validation }) and one generic FormRenderer component that walks the config and renders the needed fields. This is especially valuable when the configuration needs to change without a frontend rebuild — for instance, coming from the backend (an admin panel can add new form fields with no frontend release) or depending on the user's permissions (different roles see a different set of table columns). The flip side: an overly generic UI config engine trying to describe literally any possible interface shape via JSON quickly becomes more complex and less readable than just writing a specific JSX component for the specific case — config-driven UI is justified where there are genuinely many similar-but-not-identical screens, not as a universal default principle.",
    whereUsed:
      "Admin panels with dozens of similar CRUD forms and tables, report builders, configurable dashboards, forms whose structure depends on the user's role or comes from the backend.",
    pitfalls: [
      "Building a generic config engine 'for every possible case' before at least 3-4 genuinely similar screens exist.",
      "Hiding complex conditional logic inside the config instead of explicit code — a config full of if/else loses the main benefit of being declarative.",
    ],
  },
  "arch-state-ownership": {
    title: "State Ownership",
    shortExplanation:
      "State ownership is the question of which component (or app layer) is responsible for a specific piece of state: where it should 'live', who is allowed to change it, and who merely reads a value derived from it.",
    detailedExplanation:
      "The classic React rule is 'lift state up' exactly to the common ancestor that genuinely needs it to coordinate several children, and no higher: state lifted too high 'just in case' forces a larger part of the tree to re-render than necessary, while state kept too local prevents other components that genuinely need it from reaching it without prop drilling. A separate ownership question is the difference between the 'single source of truth' and values derived from it: if two components show recomputed versions of the same state, only one component/store should actually own it, and the rest should receive the derived value (via a selector or derived state), rather than duplicating and manually syncing copies. At larger scale (feature-sliced, modular architecture), ownership extends to the feature level too: a specific feature should be the only place where its own state changes, and other features that need that data should read it through a public interface, rather than reaching directly into another feature's internal store.",
    whereUsed:
      "Any medium-sized-or-larger application where several components/features display related data — a cart, authentication, filters applied simultaneously to several widgets on a page.",
    pitfalls: [
      "Duplicating the same state across several independent useState calls instead of a single owner — the copies inevitably drift apart over time.",
      "Lifting state all the way to the top of the tree 'just in case', even though it's genuinely only needed by two neighboring components.",
    ],
  },
  "arch-url-state": {
    title: "URL State",
    shortExplanation:
      "URL state is a part of the app's state (the current pagination page, applied filters, the open tab, the selected record's id) that's stored not in React memory but right in the address bar — in the path or query parameters.",
    detailedExplanation:
      "Storing state in the URL gives you, for free, things that are hard to replicate with plain useState: the page can be refreshed (F5) without losing filters, the link can be copied and sent to a colleague with the screen's state preserved, the browser's back/forward buttons naturally work as navigation through the history of applied filters. In the Next.js App Router, URL state is read and updated via useSearchParams (reading query parameters), usePathname (the current path), and router.push/replace with a new query — push adds an entry to the browser history (the back button will work), while replace overwrites the current entry with no new one added (useful for 'minor' changes like debounced search, where you don't want a separate history entry per keystroke). Not every bit of screen state belongs in the URL: transient state that doesn't affect 'what to show on refresh or when sharing the link' (whether a specific dropdown is open, whether something is hovered) should stay in plain React state rather than cluttering the address bar.",
    whereUsed:
      "Pages with lists and filters (catalogs, sortable/paginated tables), multi-tab screens, modals that should be directly openable via a link (e.g. /products?modal=share).",
    pitfalls: [
      "Storing overly minor UI details in the URL (e.g. hover state) — the address bar becomes unreadable and changes on every mouse move.",
      "Not storing genuinely important filters/pagination in the URL — the user loses them on refresh or can't share a link to the exact view of the data they want.",
    ],
  },
  "arch-trade-offs": {
    title: "Architecture Trade-offs",
    shortExplanation:
      "Any architectural decision isn't a choice of the 'correct' option in a vacuum, but a trade of one set of costs for another: strictness vs development speed, reusability vs simplicity, flexibility vs predictability.",
    detailedExplanation:
      "Feature-sliced or modular architecture reduces coupling between features and eases parallel work by multiple teams, but adds overhead in the form of layers (public module interfaces, more files, more levels of imports) — for a small project with one developer, that's pure cost with no offsetting benefit. Config-driven UI speeds up adding new similar screens, but complicates debugging a specific case (logic gets 'smeared' across the config and a generic renderer instead of living in one explicit component). Moving state into a global store simplifies access from different parts of the tree, but increases coupling between components, which now implicitly depend on shared state rather than only on their own props. A senior engineer's job isn't to learn the 'one true' architecture, but to be able to explicitly name what costs a given decision is paying, and consciously decide whether they're justified by this particular project's scale and stage right now.",
    whereUsed:
      "Discussing architectural decisions in code review, RFC/ADR documents, design sessions before starting a large feature or refactor.",
    pitfalls: [
      "Discussing architectural decisions in terms of 'right/wrong' instead of explicitly listing exactly what each option costs.",
      "Copying an architectural decision from another (usually larger) project without accounting for the fact that a trade-off justified there might not be justified by the current project's scale.",
    ],
  },
};
