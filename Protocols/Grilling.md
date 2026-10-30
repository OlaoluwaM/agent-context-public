---
tags:
  - reference
  - agent-protocol
---

# Grilling

Pressure-test a concrete plan or design until the user and agent share a
precise understanding of it. The skills that invoke this protocol own the
grounding and persistence rules around the interview.

## Frame the target

Before the first question, state:

- the plan or decision being tested;
- the known constraints;
- what the session must settle to succeed.

If the target is ambiguous or the framing itself is disputed, resolve that
first. Confirm the problem before building its decision tree.

## Work the decision tree

Maintain an internal decision tree. Each answer can settle a branch, expose a
contradiction, or create downstream questions. The **frontier** is the set of
questions whose prerequisites are already settled.

- Ask one question at a time. Choose the frontier question with the greatest
  effect on downstream scope, behaviour, architecture, or acceptance criteria.
- Give a recommended answer and name its main trade-off. The user owns the
  decision and can reject the recommendation.
- Keep questions short and concrete. Use explicit options when they clarify a
  real choice.
- Probe fuzzy answers with a concrete scenario or edge case.
- Follow dependencies before opening unrelated branches.

After each answer, update an internal decision ledger. Do not recap it after
every turn. Surface it when a new answer contradicts an earlier one or changes
the remaining tree.

## Separate facts, assumptions, and decisions

- **Facts are the agent's responsibility.** Inspect the available code, docs,
  history, tools, or other evidence instead of asking the user to recite what
  can be discovered.
- **Assumptions must be visible.** Verify them when practical. Otherwise ask the
  user to accept, reject, or defer them.
- **Decisions belong to the user.** Recommend strongly, but do not convert a
  recommendation into consent.

## Prune deliberately

Pursue every load-bearing branch and prune the rest. A branch is load-bearing
when its answer could change scope, observable behaviour, architecture,
acceptance criteria, a hard-to-reverse choice, or another unresolved decision.

## Completion gate

The grilling is complete when:

- every load-bearing branch is settled or explicitly deferred;
- accepted assumptions are named;
- no unresolved contradiction remains;
- the plan has clear success conditions.

Present a draft outcome with:

1. **Subject**: the plan or decision being tested.
2. **Settled decisions**: each decision and its reason.
3. **Accepted assumptions**: anything proceeding without current proof.
4. **Deferred decisions**: what remains open and what would trigger it.
5. **Residual risks**: credible ways the plan could still fail.
6. **Evidence**: files, history, commands, or sources that shaped the outcome.
7. **Recommended next action**: the immediate step and its success check.

Ask the user to confirm or correct the outcome. Do not act on the plan or
persist the outcome until the user confirms the shared understanding.

## Paper trail

Persist only the confirmed, distilled decision record. Never save the
transcript. Use the completion-gate structure above, and reference existing
plans, ADRs, specifications, and evidence instead of copying them.

The invoking skill decides where the record belongs and must show the proposed
path before writing it.
