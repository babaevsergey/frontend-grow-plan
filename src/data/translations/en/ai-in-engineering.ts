import type { ContentTranslationMap } from "../types";

export const aiInEngineeringEn: ContentTranslationMap = {
  "ai-effective-usage": {
    title: "How to use AI tools effectively (ChatGPT / Claude / Codex)",
    shortExplanation:
      "An AI assistant is most useful as a multiplier for tasks where you can quickly and confidently verify the result (generating code against a clear spec, refactoring with an understood rule, explaining unfamiliar code) — and least reliable where correctness is hard to verify yourself (nuanced business logic requiring context the model doesn't have.",
    detailedExplanation:
      "The quality of the result heavily depends on prompt quality: specific context (which framework, version, constraints, what was already tried and why it didn't work) yields a dramatically better result than a generic question with no context — the model can't guess a project's implicit constraints unless they're stated explicitly. AI is especially effective for tasks whose results are quickly verifiable: generating boilerplate, proposing several implementation options for a known pattern, explaining an unfamiliar library or someone else's code, finding a similar bug from a description of symptoms — in these cases an incorrect result is easy to spot by reading or running it. The less reliable zone is domain-specific business logic depending on context that's absent from the prompt (the team's internal conventions, the history of decisions, non-obvious product constraints) — here the model can give a plausible-looking but substantively wrong answer, harder to distinguish from a correct one without the developer's own deep domain understanding. A productive working style is an iterative dialogue (clarifying, showing an error, asking for a specific decision to be explained) rather than one attempt to get a finished solution in full, with an explicit division of roles: AI proposes, the developer decides, verifies, and takes responsibility for what ends up in the codebase.",
    whereUsed:
      "Day-to-day development: writing tests from a behavior description, refactoring by a clear rule, explaining undocumented legacy code, a first draft implementation of a known pattern, reviewing your own PR before sending it to teammates.",
    pitfalls: [
      "Accepting generated code without reading and understanding it just because it 'looks right' and compiles.",
      "Asking AI to solve a task with missing context (internal conventions, product constraints) and expecting the result to account for things the model couldn't have known.",
    ],
  },
  "ai-code-review-refactoring-legacy": {
    title: "AI for code review, refactoring, and legacy code",
    shortExplanation:
      "An AI assistant is useful as a 'first line' of code review (catching obvious problems before sending to teammates) and as a tool for quickly understanding unfamiliar legacy code without documentation, but it doesn't replace a human review that understands business context and architectural consequences.",
    detailedExplanation:
      "For code review, AI is good at catching mechanical problems: inconsistent naming, potential null-reference errors, obvious edge cases not handled in the code, missing error handling — this frees up the human reviewer's time for more important questions (architectural consequences, alignment with business requirements, design trade-offs) that require context the model doesn't have. For refactoring, AI is effective where the rule is clear and mechanical (rename by a pattern, extract repeated code into a function, update outdated syntax to new) — but for deeper structural refactoring, it's important to independently verify that the proposed change hasn't broken a non-obvious dependency that's hard to notice without a full understanding of the system. For undocumented legacy code, AI is especially valuable as a way to quickly get a working hypothesis about what an unclear piece of code does and why it might have been written that way — but such a hypothesis must be verified against the system's actual behavior (tests, logs, discussion with the author if available), not accepted as fact just because the explanation sounds convincing.",
    whereUsed:
      "An initial code-review pass before sending to teammates, working with inherited undocumented code during a project handover, mechanical refactoring against a clear template (renames, extracting functions, updating syntax).",
    pitfalls: [
      "Accepting AI's explanation of what legacy code does as final fact without verifying it against the system's actual behavior.",
      "Relying on AI review as a replacement for human review rather than as an additional first line catching mechanical problems.",
    ],
  },
  "ai-risks-hallucinations-ownership": {
    title: "AI risks: hallucinations, security, accountability",
    shortExplanation:
      "A hallucination is a confidently worded but factually wrong answer from the model (a nonexistent API method, a made-up detail of a library's behavior); accountability for code that ends up in production, regardless of who or what generated it, rests with the developer, not the tool.",
    detailedExplanation:
      "A model can 'hallucinate' with complete confidence in tone — suggesting a call to a nonexistent API method, describing library behavior that doesn't actually exist, or giving a plausible but incorrect explanation of a mechanism — and syntactic correctness of generated code doesn't guarantee its semantic correctness. A particular security risk is accepting generated code with a vulnerability (e.g. concatenating user input directly into a SQL query instead of a parameterized query, or missing sanitization before writing to innerHTML) without critical review, because the code looks like it works under superficial testing but contains a hidden vulnerability that doesn't surface in the normal usage scenario. The ownership principle: regardless of who or what wrote the code — the developer themselves, a colleague, or AI — accountability for its correctness, security, and production consequences rests with the developer who signed off on the PR (by the fact of merging it), not the tool that generated it; 'AI wrote that' isn't a valid excuse in an incident postmortem. Reviewing generated code should mean more than reading it and thinking 'looks reasonable' — it should include actual verification: running tests, checking edge cases, and for critical spots, specific attention to security (input validation, access permissions, error handling).",
    whereUsed:
      "Any use of AI-generated code in production must go through the same verification process (tests, review, security checks) as human-written code — especially critical for code handling user input, authentication, or financial operations.",
    pitfalls: [
      "Accepting generated code that handles user input or authentication without a dedicated vulnerability check.",
      "Using 'AI generated this' as an excuse in a postmortem instead of analyzing why the verification process failed to catch the problem before production.",
    ],
  },
  "ai-explaining-usage-interview": {
    title: "How to talk about your AI usage in an interview",
    shortExplanation:
      "A good answer about AI usage in an interview doesn't demonstrate the mere fact of using a tool (that's now an expected norm) but a mature understanding of where AI provides real value, where it creates risk, and how you personally verify and take responsibility for the result.",
    detailedExplanation:
      "Interviewers for senior/lead positions usually don't ask 'do you use AI' as a yes/no question — they want to gauge the quality of your judgment about when AI is useful versus risky, and whether you can describe that with concrete examples rather than generic phrases like 'AI speeds up my work'. A strong answer typically includes: a specific example of a task where AI genuinely helped (not abstractly, but with details — what exactly was done, what prompt, what result), explicit mention of how you verified the result before it landed in the codebase, and awareness of limits — an example of a situation where you consciously didn't rely on AI, or where its suggestion turned out to be wrong and you caught it. It's worth avoiding two extremes: presenting AI as 'magic that solves everything' (creates the impression you don't critically evaluate its output) and fully denying using it in 2026 (sounds implausible and as if you're out of touch with current industry practice) — an honest, specific, balanced answer with real examples sounds more convincing than either extreme.",
    whereUsed:
      "A direct interview question 'how do you use AI in your work', as well as a natural addition to questions about productivity, code quality, or code review — anywhere a concrete example fits naturally.",
    pitfalls: [
      "Answering with generic phrases ('AI speeds up development') without a single concrete example with details.",
      "Presenting AI usage as fully autonomous, without mentioning your own verification and accountability for the result.",
    ],
  },
};
