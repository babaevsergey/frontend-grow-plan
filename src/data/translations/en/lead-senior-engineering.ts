import type { ContentTranslationMap } from "../types";

export const leadSeniorEngineeringEn: ContentTranslationMap = {
  "lead-code-review-tech-debt": {
    shortExplanation:
      "A good code review focuses on real risks (correctness, architectural consequences, readability for future developers), not stylistic nitpicks a linter could catch; technical debt is a deliberate or unconscious decision to do something 'faster but worse' now, to be paid for later.",
    detailedExplanation:
      "Effective code review distinguishes severity levels of comments: blocking ones (a bug, a security risk, a breach of architectural boundaries) should be explicitly flagged as such and require a fix before merging, while stylistic preferences ('I'd have named it differently') are better as a non-blocking optional comment — mixing these levels without clear separation turns review into a source of friction and slows delivery without proportional benefit. It's useful to classify technical debt by intentionality and awareness (per Martin Fowler's matrix): deliberate, reasoned debt ('we're doing it simpler now, knowing the cost, and documenting it explicitly, e.g. in a TODO with context') is fundamentally different from unintentional debt (we simply didn't know a better way) — the former is manageable and can be part of a strategy, the latter is only discovered after the fact. As a lead, it's important not just to 'fight tech debt' abstractly but to be able to explicitly assess its cost in concrete terms (does it slow current development, does it create bug risk, does it block a specific future feature) and prioritize it alongside other work, rather than deferring it forever to 'whenever there's time', which never comes on its own.",
    whereUsed:
      "Day-to-day code review practice on a team, retrospectives and sprint planning (allocating time to pay down tech debt), discussing architectural trade-offs with product when deciding 'faster but with debt' versus 'slower but clean'.",
    pitfalls: [
      "Blocking a merge over purely stylistic preferences on the same footing as real bugs — dilutes the priority of genuinely important comments.",
      "Deferring all technical debt 'for later' without explicit prioritization by change frequency and cost of error — 'later' usually doesn't come until the debt is already causing real problems.",
    ],
  },
  "lead-mentoring-estimation-planning": {
    shortExplanation:
      "Mentoring is helping a colleague grow toward independence, not solving tasks for them; estimation is recognizing and communicating uncertainty, not precisely predicting the future; sprint planning is agreeing on a realistic amount of work accounting for uncertainty, not mechanically slotting tasks into a calendar.",
    detailedExplanation:
      "Effective mentoring more often looks like guiding questions ('what have you already tried?', 'what options are there and what are their trade-offs?') rather than immediately solving the problem for the mentee — the goal is for the person to learn to reach similar solutions on their own in the future, rather than depending on the lead for every similar situation; that requires consciously leaving room for low-cost mistakes the mentee can learn from themselves. Task estimation is inherently imprecise for new/unfamiliar code — breaking a large task into smaller, more predictable subtasks (decomposition) reduces uncertainty better than trying to 'guess' an exact number of days for one large, uncertain task as a whole; relative estimation (story points, comparison to already-completed tasks) is often more honest than absolute hours precisely because it explicitly admits: we're estimating complexity/size, not guaranteed time. Sprint planning should explicitly account for a buffer for the unforeseen (bugs, urgent requests, meetings) — a team planning 100% of available time on new tasks with no buffer systematically falls behind and loses trust in its own estimates, whereas realistic planning with an explicit buffer creates predictability, even if it formally 'takes on fewer' tasks per sprint.",
    whereUsed:
      "1:1s with junior developers, retrospectives and sprint planning, estimating large features before starting (usually via decomposition and group estimation, e.g. planning poker).",
    pitfalls: [
      "Solving the task for the mentee instead of asking guiding questions — deprives the person of the chance to learn independence.",
      "Planning a sprint at 100% of available time with no buffer for the unforeseen — systematically undermines the team's predictability and trust in its estimates.",
    ],
  },
  "lead-incident-handling-ownership": {
    shortExplanation:
      "Handling a production incident requires first stopping the damage (mitigating) and only then investigating the root cause — trying to find the 'real' cause in the middle of an active incident prolongs the downtime; production ownership means being accountable for what happens to code after deployment, not just for the fact of having written it.",
    detailedExplanation:
      "The standard incident response sequence: detect (via monitoring/alerts, and ideally before users do), mitigate the immediate damage (roll back the deploy, flip a feature flag to disable the problematic functionality, temporarily reduce load) — and only once the situation is stabilized move to root-cause investigation; mixing these phases (trying to debug the root cause while production is actively 'on fire') usually prolongs the downtime with no benefit. After an incident, a blameless postmortem is valuable — focusing on 'what in the system/process allowed this error to reach production, and how to prevent it structurally' rather than 'who wrote the bug', because a blame-seeking culture discourages people from speaking openly about risks and mistakes in the future, ultimately leading to more hidden problems, not fewer. Production ownership in practice means: the engineer who deployed a change stays engaged until they're confident it's working as expected under real traffic (monitoring metrics/alerts after deployment rather than deploying and immediately switching to another task), and the team as a whole has a clear understanding of who responds to a 3am alert and how, rather than a vague 'someone will handle it'.",
    whereUsed:
      "On-call rotations, incident management for critical production systems, postmortems after serious outages, discussions of quality ownership between the development team and a separate QA/SRE function (if one exists in the organization).",
    pitfalls: [
      "Trying to pin down the exact root cause during an active incident instead of mitigating the damage first.",
      "Running postmortems in a blame-seeking culture — discourages the team from openly reporting risks and potential problems in the future.",
    ],
  },
};
