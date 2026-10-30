---
tags:
  - reference
  - agent-protocol
---

# Subagent Dispatch

Patterns for dispatching, reviewing, and integrating subagent work. Reference this protocol from any skill that spawns subagents.

---

## Core Principles

- Give subagents **constructed context**. Use an explicit no-history or no-fork
  setting where supported; some runtimes inherit history by default. If isolation
  is unavailable, disclose that limit and do not call the review blind.
- Treat subagent reports with skepticism by default. Verify claims independently.
- Preserve your own context for coordination — delegate execution, not judgment.

---

## The Four-Status Contract

Require subagents to report one of four statuses. This forces them to categorize their own confidence rather than burying doubts in prose.

| Status | Meaning | Your response |
|--------|---------|---------------|
| **DONE** | Work complete, no concerns | Proceed to review |
| **DONE_WITH_CONCERNS** | Work complete, but the subagent flagged doubts | Read concerns before review and categorize each: **blocking** (correctness, scope, security) → address before integrating; **non-blocking risk** (maintainability, tech debt) → note and decide explicitly; **informational** ("this file is getting large") → note and proceed. |
| **NEEDS_CONTEXT** | Subagent needs information that wasn't provided | Provide the missing context and re-dispatch |
| **BLOCKED** | Subagent cannot complete the task | Assess the blocker (see escalation below) |

### Handling BLOCKED

1. If it's a context problem → provide more context, re-dispatch
2. If the task requires more reasoning → re-dispatch with a more capable model
3. If the task is too large → break it into smaller pieces
4. If the plan itself is wrong → escalate to the human

Never force the same subagent to retry without changing something.

---

## Skeptical Review

When reviewing subagent output, start from the assumption that the report may be incomplete, inaccurate, or optimistic.

**Do not:**
- Take the subagent's word for what it implemented
- Trust claims about completeness
- Accept its interpretation of requirements without checking

**Do:**
- Read the actual output (code, diff, artifact)
- Compare against the original spec or task description line by line
- Check for missing pieces the subagent claimed to handle
- Check for extra work that wasn't requested
- Apply the verification gate from [[Verification Gates]] before accepting

---

## Prompt Structure

A good subagent prompt is self-contained, focused, and explicit about what to return.

### Required elements

1. **Task description** — paste the full task/spec; don't make the subagent infer requirements from another file (it may still inspect code/artifacts needed to do the work)
2. **Context** — where this fits, what came before, architectural constraints
3. **Permission to ask questions** — "If anything is unclear, ask before proceeding"
4. **Permission to escalate** — "It is always OK to stop and say this is too hard"
5. **Report format** — status (using the four-status contract), what was done, what was tested, files changed, concerns

### Example template

This example shows how an orchestrator can structure a prompt for a subagent.

```
You are implementing: [task name]

## Task

[Full task/spec text — paste it; don't require the subagent to infer requirements from a file. It may still read code/artifacts needed to do the work.]

## Context

[Where this fits, dependencies, constraints]

## Before You Begin

If anything about the requirements, approach, or assumptions is unclear — ask now.
If at any point you're in over your head, stop and report BLOCKED or NEEDS_CONTEXT.

## Your Job

[Specific instructions]

## Report Format

When done, report:
- **Status:** DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
- What you did (or attempted, if blocked)
- What you verified and results
- Files changed
- Concerns (if any)
```

---

## Model Selection

Use the least powerful model that can handle each role.

| Task type | Signal | Model tier |
|-----------|--------|------------|
| Mechanical implementation | Isolated scope, clear spec, 1–2 files | Fast/cheap |
| Integration and judgment | Multi-file coordination, pattern matching | Standard |
| Code architecture, system design, codebase review | Broad codebase understanding, design decisions | Most capable |

This last row is about work that genuinely needs to hold a whole system in view. A
narrow, well-specified review task with a written rubric and a fixed target — a single
document, a single file, a checklist pass — is *Standard* work even though the word
"review" appears in it. Match the tier to the breadth of judgment required, not to the
label on the task.

**Always set the tier explicitly when dispatching.** Leaving it unset does not select a
balanced default — harnesses generally fall back to the dispatching agent's own model,
which is typically the *Most capable* tier. The table above then has no effect and the
cost intent can be lost silently. Some runtimes record actual model identifiers
in messages or turn metadata; inspect them when available instead of assuming
the requested model ran. Otherwise report the requested tier and the evidence limit.

Treat "use the default model" as a phrasing to avoid in any skill or protocol. It reads
as an instruction to omit the setting, while describing an outcome that omitting it will
not produce. Name the tier instead.

For the same reason, **state the tier each subagent ran at when reporting its results**,
so a wrong tier is visible rather than invisible.

### Propose the tier before dispatching

Cost and capability are a live trade, not a one-time setting. Before spawning a subagent,
**say which tier you intend to use and why, and get a go-ahead.** Do not dispatch and
report the tier afterwards — by then the tokens are spent.

State it in one line: the role, the tier, and the reason that tier fits. If several
subagents are going out together, list them and their tiers before dispatching any.

This is deliberate friction. A subagent is the single largest discretionary spend in a
session, it is invisible while it runs, and an over-tiered dispatch cannot be undone —
so a one-line check beats an irreversible charge against the session's budget. The habit
also extends how long a session stays usable before hitting limits.

Exceptions, kept narrow:

- **Re-dispatch at an already-agreed tier** for the same task needs no new confirmation.
- **Escalation** (see Handling BLOCKED) does — moving up a tier is a new cost decision.
- **Non-interactive or autonomous runs** cannot ask: choose the lowest tier that can
  do the job, and record the tier and reasoning in the final report.

---

## Two-Stage Review

All implementation or review artifacts get both checks unless the task is explicitly exploratory or read-only. Run them in order:

1. **Spec compliance** — does the output match what was requested? Nothing missing, nothing extra.
2. **Quality** — is the output well-built? Clean, tested, maintainable.

Never reverse the order. Quality review on spec-noncompliant work wastes effort.

---

## Parallel Dispatch

When multiple subagent tasks are independent (no shared state, no sequential dependencies):

- Dispatch one subagent per problem domain
- Give each a focused scope and clear constraints
- After all return, check for conflicts before integrating — changed-file overlap, incompatible assumptions, duplicated logic, behavioral contradiction
- Run full verification after integration

**Don't parallelize when:**
- Failures might be related (fixing one could fix others)
- Subagents would edit the same files
- You need to understand full system state first

---

## The Planning Heuristic

When writing plans or task descriptions for subagents, write for **a skilled developer with zero codebase context, questionable taste, and an aversion to testing.** If the plan works for that reader, it works for a subagent.

Supply owned file paths, the task contract, relevant local patterns, constraints,
and observable acceptance checks. Include exact commands when they matter. Let
the implementer choose routine code details; a complete prewritten solution is
not required. Give independent reviewers the target and rubric without your verdict.
