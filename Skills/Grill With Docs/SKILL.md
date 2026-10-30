---
name: grill-with-docs
description: Codebase-grounded grilling that offers a repository-local decision record, sharpens domain terminology, and proposes glossary updates or qualifying ADRs. Use when the user wants to stress-test a plan against their codebase's language and documented decisions.
argument-hint: "[the plan to grill against the project's domain model]"
---

# Grill With Docs

This is the codebase-aware version of `grill-me`. It anchors the shared interview procedure to the project's code, glossary, and recorded decisions.

Before beginning, read and follow `Protocols/Grilling.md` under the agent-context root. It is the canonical interview procedure for both grilling skills. This skill adds repository grounding and documentation to that procedure.

## Domain awareness

During codebase exploration, also find the project's documentation.

### File structure

First find the repository's existing glossary or terminology document and ADR
directory. Reuse those owners and their formats. If no glossary exists, the
default to propose for a single domain context is a root `CONTEXT.md`:

```
/
├── CONTEXT.md
├── docs/adrs/        ← see the `adr` skill for the directory convention
└── src/
```

If a `CONTEXT-MAP.md` exists at the root, the repository has multiple contexts. The map points to each context's `CONTEXT.md`. Infer which context owns the current topic. Ask when the evidence does not resolve it.

Create files only when there is confirmed content to write. If no glossary
exists, confirm its location and create it when the first term resolves. An
existing glossary under another name does not require a new `CONTEXT.md`. Below,
`CONTEXT.md` also means that resolved existing glossary.

## During the session

- **Challenge against the glossary.** When the user uses a term that conflicts with `CONTEXT.md`, call it out immediately: "Your glossary defines 'cancellation' as X. You seem to mean Y. Which is it?"
- **Sharpen fuzzy language.** When a term is vague or overloaded, propose a precise canonical term: "You're saying 'account.' Do you mean the Customer or the User? Those are different things."
- **Cross-reference with code.** When the user states how something works, check whether the code agrees. Surface contradictions: "Your code cancels entire Orders. You said partial cancellation is possible. Which is correct?"
- **Propose CONTEXT.md updates explicitly.** When a term resolves, draft the exact glossary entry and ask whether to write it to the relevant `CONTEXT.md`. Only edit after explicit confirmation for that entry, unless the user has already opted into batch capture for the session. Preserve an existing glossary's format; for a new glossary use [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md). `CONTEXT.md` is a glossary and nothing else: no specs, no scratch notes, no implementation decisions.

## Decision record

After the user confirms the outcome, store the distilled decision record in the target repository. Use agent-context only when agent-context is itself the subject:

- Prefer updating an existing plan, specification, or decision record that already owns the topic.
- Otherwise follow the repository's existing documentation convention.
- If no convention resolves the location, propose an exact path and wait for approval. Do not invent a directory structure silently.

Use the paper-trail structure in `Protocols/Grilling.md`. Show the proposed path before writing. Keep this record separate from `CONTEXT.md`, which remains a glossary, and from ADRs, which capture only qualifying architectural decisions.

## Decisions worth recording

When a grilled decision is **hard to reverse, surprising without context, and the result of a real trade-off**, offer to record it as an ADR. Use the `adr` skill, which owns the format, numbering, and directory convention. If any of the three conditions is missing, skip it.

## When you're done

Report where the decision record was written or deliberately deferred, which terms got sharpened, which `CONTEXT.md` updates were written or deferred, and any decisions flagged for an ADR.
