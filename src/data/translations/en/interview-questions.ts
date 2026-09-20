import type { ContentTranslationMap } from "../types";

export const interviewQuestionsEn: ContentTranslationMap = {
  "interview-virtual-dom": {
    shortExplanation:
      "The Virtual DOM is a lightweight in-memory JS representation of the real DOM that React uses to compute the minimal set of changes before touching the actual DOM.",
    detailedExplanation:
      "Direct manipulation of the real DOM (via document.createElement, appendChild, etc.) is expensive because each change can trigger layout/paint. Instead, on every render React builds a new tree of virtual objects (plain JS objects describing 'what should be there'), compares it to the previous tree (diffing/reconciliation), and applies only the actual differences to the real DOM in a single batch. That doesn't mean the Virtual DOM is always faster than direct manipulation in every individual case — its real advantage is that it provides a predictable update model and automatically batches changes, without forcing the developer to manually optimize every DOM update.",
    pitfalls: [
      "Repeating the phrase 'the Virtual DOM is faster' in an interview without understanding what its real advantage actually is.",
      "Not knowing that modern React (Fiber) can interrupt and prioritize rendering precisely thanks to the intermediate virtual DOM representation.",
    ],
    practiceTask:
      "Explain in your own words (aloud or in writing) the three concrete steps that happen between calling setState and the screen updating in React.",
  },
  "interview-event-delegation": {
    title: "Event Delegation",
    shortExplanation:
      "Event delegation is a technique where a single handler is attached to a common parent instead of every child element individually, relying on event bubbling.",
    detailedExplanation:
      "Most DOM events (click, input, etc.) bubble from the target element up the tree to document. This lets you attach a single handler to a parent container (e.g. <ul>) and, inside it, determine which exact child element (event.target) was clicked, instead of attaching a separate handler to every <li>. React uses this idea internally: instead of attaching a native handler to every DOM node with onClick, React attaches a single handler to the app's root and figures out itself which component should receive the event (in current React versions the handler is attached to the root container, not to document).",
    pitfalls: [
      "Forgetting that not all events bubble (e.g. focus/blur don't bubble in their normal form, though there are focusin/focusout, which do bubble).",
      "Checking event.target without accounting for the click possibly landing on an element nested inside the <li> (e.g. an icon) rather than the <li> itself — closest() is needed instead of a strict tagName comparison.",
    ],
    practiceTask:
      "Implement a to-do list where deleting an item by clicking its 'x' icon is handled by a single delegated handler on the parent <ul>, using event.target.closest().",
  },
  "interview-rest-vs-graphql": {
    shortExplanation:
      "REST organizes an API around fixed endpoints and resources with a predetermined response shape; GraphQL gives the client a single endpoint where the client itself describes exactly which data fields it needs.",
    detailedExplanation:
      "In REST, fetching, say, a post with its author and comments often requires either several requests (/posts/1, /posts/1/comments, /users/5) or a special endpoint designed specifically for that screen (which scales poorly across many different screens). GraphQL solves this with a single request in which the client explicitly lists the needed fields of nested entities, and the server returns exactly as much data as requested — no more (solving over-fetching) and no less (solving under-fetching, which would otherwise require an extra request). The price of this flexibility is more complex client-side caching setup (in REST, caching by URL is simple; in GraphQL you need special libraries like Apollo Client, or TanStack Query on top of GraphQL requests) and the potential for a client to request something too expensive for the server to compute.",
    pitfalls: [
      "Assuming GraphQL is 'always better' than REST — for simple CRUD APIs with a small number of screens, REST is often simpler and sufficient.",
      "Not thinking about caching in GraphQL — without a library like Apollo Client/a normalized cache, it's easy to end up with many repeated requests for the same data.",
    ],
    practiceTask:
      "Describe (as a list of endpoints and a single GraphQL query) the same scenario 'fetch a post with its author and last 3 comments' via REST and via GraphQL, comparing the number of requests.",
  },
  "interview-var-let-const": {
    shortExplanation:
      "var has function scope and is hoisted with an undefined initialization; let and const have block scope and sit in the 'temporal dead zone' until their declaration.",
    detailedExplanation:
      "var is visible throughout the entire function it's declared in (ignoring inner {} blocks), and its declaration is automatically 'hoisted' to the top of the function, which is why accessing the variable before its declaration line doesn't throw an error but gives undefined. let and const are only visible inside the {} block they're declared in, and although they're technically also 'hoisted', accessing them before declaration throws a ReferenceError (this zone is called the temporal dead zone). const additionally forbids reassigning the variable itself (but doesn't forbid mutating the contents of the object/array it references).",
    pitfalls: [
      "Using var out of habit in new code — it's almost always better to use let/const because of their more predictable block scoping.",
      "Thinking const makes an object/array fully immutable — it only forbids reassigning the variable itself, not mutating its contents.",
    ],
    practiceTask:
      "Reproduce a loop with var and setTimeout that prints the same value for every iteration, explain why, then fix it with let and confirm the output is now as expected.",
  },
  "interview-eq-vs-eqeq": {
    title: "== vs === (loose and strict comparison)",
    shortExplanation:
      "=== compares values without type coercion (strict equality), == first coerces the operands to a common type and then compares (loose equality).",
    detailedExplanation:
      "When using ==, JavaScript performs implicit type coercion following rules that aren't always obvious (e.g. '' == 0 is true, null == undefined is true, but null == 0 is false) — these rules are historically considered one of the most confusing corners of the language. === performs no coercion at all: if the operands' types differ, the result is immediately false, with no attempt to compare them after coercion. Because of =='s unpredictability, common practice is to almost always use === (and its counterpart !==), with one well-established exception: value == null checks for both null and undefined at once.",
    pitfalls: [
      "Relying on == 'out of habit' without understanding the specific coercion rules that apply in each case.",
      "Not knowing the classic value == null exception and writing a longer, less readable double check instead.",
    ],
    practiceTask:
      "Build a table of 8 value pairs (e.g. '0' and 0, [] and false, null and undefined) and predict the result of == and === for each, then verify in the browser console.",
  },
};
