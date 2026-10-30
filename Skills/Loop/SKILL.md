---
name: loop
description: >-
  Repeat a user-defined sequence of operations until an explicit end condition
  is met or the agent judges further iterations unlikely to add meaningful
  value. Use when the user invokes /loop or asks to repeat a workflow until
  diminishing returns. Not for writing programming loops or scheduled tasks.
---

# Loop

Run the chosen operations repeatedly, carrying results forward and judging
whether another iteration is worthwhile. Keep the workflow small and adapt
the stopping judgment to the work.

## Set up

Ask together for anything not already supplied:

- What should the loop work on, and which operations should repeat, in what
  order?
- Is there an explicit end condition? None is fine; diminishing returns is
  always a stopping condition.

Wait for missing setup information before starting. Reuse answers and
authorization already given in the conversation; do not repeat answered
questions. Resolve ambiguity about the target or operations before acting.

Briefly state the sequence, the explicit end condition if any, and what
meaningful progress would look like for this work. Derive that judgment
yourself from the task; do not make the user define a diminishing-returns
threshold. Check whether the end condition is already satisfied.

The loop preserves the scope, permissions, and interaction requirements of
its operations. Repeating a workflow does not authorize additional actions.

## Iterate

1. Run the operations in order, using the current result as the starting point.
   Apply any relevant skills and their required checks.
2. Assess the result against the goal and previous iterations. Use evidence
   suited to the task, such as check results, substantive defects resolved,
   new supported findings, or improvements against a writing brief. Activity
   and changed wording alone do not establish progress.
3. Stop if the explicit end condition is met. Otherwise, judge whether the
   likely value of another iteration warrants its effort. Continue while
   meaningful gains remain plausible; stop at diminishing returns.

Keep a brief running account of the iteration, what changed or was learned,
and why to continue or stop. Carry this state through any handoff or context
compaction so the loop resumes from its latest result.

## Judge diminishing returns

Use the loop's own evidence, with no universal score, fixed iteration count,
or mandatory number of unproductive passes. Repeated findings, increasingly
cosmetic changes, or cycling between equivalent alternatives can justify
stopping. An unproductive pass can also expose a useful new approach; assess
that possibility before concluding the loop has run its course.

Do not invent changes to keep the loop running. Preserve useful results and
identify regressions instead of assuming the latest version is better.
Missing access, failed tools, or a required user decision are blockers, not
evidence of diminishing returns. If interrupted or constrained by a runtime
or user-supplied limit, report that reason and the remaining work accurately.

## Finish

Return the result with a short account of the iterations and evidence for
stopping. Distinguish an end condition met, diminishing returns, a blocker,
and an interruption or limit. State any unmet objective or unresolved issue;
stopping at diminishing returns does not establish completion.
