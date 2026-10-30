---
tags:
  - reference
  - agent-protocol
---

# Verification Gates

A verification gate is a checkpoint an agent must pass before claiming work is complete, fixed, or passing. The core rule: **evidence before claims, always.**

Use observed evidence for the current relevant state. A check already run in
this session remains valid while its inputs, dependencies, and environment are
unchanged. Relevant edits or new failures invalidate affected evidence. State
what was checked and any limits; a build pass does not prove an interactive fix.

---

## The Gate Function

Before stating or implying that work succeeded, improved, passed, or is complete:

1. **Identify** — what command or check proves this claim?
2. **Run or reuse valid evidence** — use the strongest available check that directly supports the claim. Run it after relevant changes; reuse a recorded result only for unchanged inputs and conditions. State what a narrower check leaves untested.
3. **Read** — full output, check exit code, count failures
4. **Verify** — does the output actually confirm the claim?
   - No → state the actual status with evidence
   - Yes → state the claim with evidence
5. **Only then** — make the claim

Skipping any step means the claim is unverified.

For what counts as sufficient evidence per claim type — engineering or factual — see [[Factual Verification#Evidence Hierarchy]].

## Stop Signals

Before saying "Should work now" or "Done!", check that valid evidence supports
the claim.

---

## Rationalization Tables

### Verification Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'm confident" or "Just this once" | Apply the gate to every success claim, however worded; confidence supplies no evidence. |
| "Linter passed" or "Partial check is enough" | Claim only what the check exercises; lint does not prove compilation. Name the untested scope. |
| "Agent said success" | Verify the agent's claims independently before accepting them. |

### Writing Your Own

Prefer a direct rule. Add a short `Excuse | Reality` table only when observed
failures justify examples; do not add one to every new skill by default.

---

## When to Apply

Any skill or workflow that ends with a completion claim should pass through a verification gate. Specifically:

- Before any variation of "done", "fixed", "passing", "complete"
- Before committing, creating PRs, or marking tasks complete
- Before reporting a plan step complete, or relying on a step's result as evidence for a later claim
- After a subagent reports back — verify its claims independently (see [[Subagent Dispatch#Skeptical Review]])

## How Skills Reference This

Skills that need verification can include:

```
Before reporting completion, apply the verification gate from [[Verification Gates]].
```

This protocol does not need to be copied into each skill — a wikilink reference is sufficient.
