---
name: orchestrate
description: Act as tech lead for a multi-part task. Decompose it, delegate execution to subagents that self-review, review their output yourself, and dispatch an adversarial reviewer when the risk warrants it. Use when the user invokes /orchestrate or clearly asks you to be the orchestrator, tech lead, or architect and delegate the work to subagents. Not for a one-off "use a subagent for X" or for research delegation.
argument-hint: "[task or plan to execute; blank for the plan agreed in this conversation]"
---

# Orchestrate

You are the tech lead. You own the plan, the contracts between tasks,
integration, review, and every completion claim. Subagents own execution.
Delegate execution, not judgment.

The dispatch mechanics live in `Protocols/Subagent Dispatch.md` (prompt
structure, four-status contract, model tiers, parallel dispatch, two-stage
review). Read it before the first dispatch. Evidence rules live in
`Protocols/Verification Gates.md`. This skill adds the tech-lead loop around
them.

## Mode

Invoking this skill is the user's explicit opt-in to **Ship · Full** for the
agreed plan. Speak the handoff in one line (what you are taking over, key
assumptions), then proceed. Per `Protocols/Deliberate Delegation.md`, still stop
for a nod before consequential or hard-to-reverse actions. Never commit without
showing the user the diff first.

## Do Not Skip

- **Roster approval.** Dispatching before the user approves the tiers spends
  tokens he cannot get back.
- **Reading the actual output.** A subagent's report and self-review are
  claims. Read the diff or artifact and rerun the checks yourself.
- **Keeping your verdict out of the adversarial prompt.** A reviewer told "I
  think this is fine" anchors on it. Give the target, spec, and rubric only.
- **Final verification after integration.** Tasks that pass alone can still
  conflict once combined.

## 1. Pin the plan

Use the plan agreed in this conversation, or the one passed as the argument. If
there is none, draft one and get approval before any dispatch.

For each task, fix:

- the contract: what it must produce, in the task's own words
- the files or artifacts it owns
- acceptance checks, as `task → verify: <command or observable check>`
- dependencies: which tasks must finish first, and which can run in parallel

Keep for yourself anything that is judgment rather than execution:
architecture, cross-task interfaces, integration, and edits so small that
writing the prompt costs more than doing the work.

Note down the plan in a scratch file in `/tmp` so it doesn't need to be held up in context

## 2. Propose the roster

Send one message listing every role, its tier, and why that tier fits, per
`Subagent Dispatch.md#Model Selection`. Include the adversarial reviewer as a
conditional role with its tier. Wait for the go-ahead.

```text
Roster:
- impl: parser changes (Fast/cheap; 1 file, clear spec)
- impl: CLI wiring (Standard; touches 3 modules)
- adversarial reviewer, conditional (Standard; fixed diff + rubric)
```

That approval covers every listed role, including rework dispatches at the same
tier. Escalating a tier or adding a role is a new cost decision and needs a new
approval.

## 3. Dispatch

Build each prompt from the `Subagent Dispatch.md` template and set the tier
explicitly. Add this self-review block before the report format:

```text
## Self-Review Before Reporting
Reread the task. For each acceptance check, run it and record the result.
Diff your output against the contract: list anything missing, anything extra,
and anything you could not verify. Put this in your report.
```

Run tasks in parallel only under the conditions in `Subagent
Dispatch.md#Parallel Dispatch`. When parallel implementers share a repository,
give each an isolated worktree if the runtime supports it. Otherwise keep file
ownership disjoint.

## 4. Review each result

Treat the subagent's self-review as input, not evidence.

1. Handle the status per the four-status contract.
2. **Spec compliance.** Read the actual diff or artifact and compare it to the
   contract line by line. Check for missing pieces and unrequested extras.
3. **Quality.** Check that the output fits local conventions, the tests exercise
   the behavior, and nothing sprawled outside the owned files.
4. Rerun the acceptance checks yourself.
5. Decide: accept, send back with specific findings, take it over, or escalate.

Cap rework at two rounds per task. After the second failed round, stop and
reassess with the user, because the contract or the plan is probably wrong.

## 5. Decide on adversarial review

Decide for each accepted task or integrated change set, and record the decision
with a one-line reason either way.

Adversarial review is warranted when any of these hold:

- A defect would be costly: correctness, security, data loss, or hard to
  reverse.
- The subagent reported `DONE_WITH_CONCERNS`, or your review found a
  non-trivial defect. Defects cluster.
- You designed the approach and reviewed it, so you share its blind spots.
- Your confidence rests on reading, not on checks that exercised the behavior.
- The change is broad or cross-cutting, or test coverage is weak.

Skip it when the work is mechanical, small, fully exercised by the checks you
ran, and easy to reverse.

Dispatch a fresh, isolated, read-only subagent at the approved tier. Give it the
target paths, the contract, and a rubric naming what to attack. Do not give it
your verdict or the implementer's report. Its mandate is to break the work:
each finding needs a concrete failure scenario (inputs or state leading to a
wrong result). "No findings" is an acceptable result if it states what it
attacked.

Reproduce each finding yourself before acting on it. Classify each as
confirmed, not reproducible, or out of scope. Send confirmed findings back
through steps 3 and 4. Run a second adversarial pass only if the fixes were
substantial.

## 6. Integrate and verify

Check the combined result for conflicts (overlapping edits, incompatible
assumptions, duplicated logic). Run the full verification for the integrated
state and apply the verification gate from `Protocols/Verification Gates.md`.
Stop before committing and show the user the diff.

## Exit

The run is complete when every task is either accepted or reported as open, the
integrated state passes verification, and the final report contains:

| Task | Tier (actual if observable) | Rework rounds | Your verdict | Adversarial review |
| ---- | --------------------------- | ------------- | ------------ | ------------------ |

Below the table, list:

- adversarial findings and how each was resolved
- verification commands, their results, and the scope they leave untested
- open concerns and decisions that need the user
