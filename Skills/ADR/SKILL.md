---
name: adr
description: Write an Architectural Decision Record using the local Nygard-inspired convention — imperative title, context/decision/consequences structure
---

# ADR Skill

Guide for writing Architectural Decision Records (ADRs) using the local Nygard-inspired convention. Use this whenever documenting a non-trivial architectural or design decision in a project.

## When to use

- The user is about to document a decision that will shape how something is built.
- The user asks to "write an ADR", "record this decision", "capture this architecturally", or similar.
- A conversation has arrived at a meaningful architectural decision (especially one with trade-offs worth preserving) and should be persisted so it doesn't get lost.

## Location and filename

1. ADRs live in `docs/adrs/` by default. If the project uses a different directory (`docs/adr/`, `docs/architecture-decisions/`, etc.), match the existing convention.
2. Filename: `NNNN-imperative-title-in-kebab-case.md`
   - `NNNN` is a zero-padded four-digit sequence number (0001, 0002, ...).
   - The title in the filename is the same imperative phrase as the H1 title, kebab-cased.
   - Example: `0004-use-database-transactions-for-order-updates.md`
3. Numbers are assigned in order of creation and are stable identifiers. **Do not renumber existing ADRs** once they are referenced by number elsewhere (other ADRs, memory files, commit messages, etc.), unless explicitly asked. Renumbering is a multi-file refactor with cascading reference updates.

## Title form

ADR titles are **imperative statements of the decision** under this local convention. They name the action being taken, not the topic.

- Good: "Use Database Transactions for Order Updates", "Ship as a Progressive Web App", "Store Audit Events Separately".
- Avoid: noun-phrase topic labels like "Order Updates", "Audit Events", "Mobile Strategy". These name the area, not the decision.

Use title case for H1 headings.

## Structure

```markdown
# ADR NNNN: Imperative Title Describing the Decision

- **Status:** Accepted
- **Date:** YYYY-MM-DD

## Context

The forces at play. What problem is being solved, what constraints apply, what options were considered. Keep it focused on what a future reader needs to understand _why_ this decision made sense at the time. A few paragraphs.

## Decision

The actual decision, stated directly. Declarative prose ("X is the approach", "the system will use Y") is fine — classic Nygard uses "we will..." but declarative is acceptable as long as the decision is unambiguous. Include enough specificity that someone can act on it without re-reading the Context.

## Consequences

**Positive**

- Concrete benefits, not vague platitudes.
- Each bullet names a real consequence tied to the decision.

**Negative / trade-offs**

- The honest downsides. A healthy ADR has real negatives here.
- If you can't list any, you probably haven't thought hard enough about the decision.

**Data/product implications** (optional, include if any)

- Cross-cutting implications for the data model, API surface, UI, or operational posture.

## Related

- ADR NNNN — one-line description of how it relates.
- ADR NNNN — ...
```

## Status values

- **Proposed** — under discussion, not yet decided.
- **Accepted** — decision is active.
- **Deprecated** — no longer the approach, but not replaced by a specific new ADR.
- **Superseded by ADR NNNN** — replaced; link to the new ADR explicitly.

**Choosing a status for a new ADR:** default to `Accepted` — by the time you're recording a decision, it's normally settled (see _Before writing_). Use `Proposed` only when the user explicitly wants the ADR circulated for a decision _before_ committing (an ADR up for review — not a hypothetical). If it's neither settled nor a deliberate proposal, don't write the ADR yet.

Once an ADR is Accepted, don't edit the Decision prose materially — if the decision changes, write a new ADR that supersedes the old one and update the old one's Status to `Superseded by ADR NNNN`. Small corrections (typos, clarifications) are fine.

## Cross-references

- Always reference other ADRs by **number** (`ADR 0001`), not by filename. Filenames may change; numbers are stable.
- Include a `## Related` section at the end when the ADR is meaningfully connected to others. One line per related ADR explaining the relationship.

## Backfilled ADRs

If documenting a decision that was made before this ADR is being written (e.g., retrofitting records for decisions already implemented), note it explicitly:

```markdown
- **Date:** YYYY-MM-DD (backfilled)
```

Don't invent a fake past date. Use the date the ADR was written, with the `(backfilled)` note.

## Consequences-section discipline

A well-written ADR earns its Consequences section. If yours has only positives, you either haven't thought honestly about the trade-offs or the decision didn't need an ADR. If it has only negatives, reconsider whether you actually want to make the decision. The point of the Consequences section is to preserve _what you knew and accepted_ at the time — so future readers understand the trade space.

## Self-check before saving

A complete ADR has:

- [ ] Imperative title naming the decision, not the topic (see _Title form_) — title case in the H1, kebab-case in the filename.
- [ ] `Status` chosen per the rule in _Status values_.
- [ ] ISO `Date` (`(backfilled)` if the decision predates the record).
- [ ] **Context**: the forces, constraints, and options considered. Should be self-contained enough to understand the rationale without external context.
- [ ] **Decision**: declarative and specific enough to act on without re-reading Context. Should be unambiguous about what the decision is.
- [ ] **Consequences** with at least one genuine negative (see _Consequences-section discipline_). Although, if no negatives exist, consider whether an ADR is warranted at all.
- [ ] `## Related` links by number where connected ADRs exist.

## Do Not Skip

- Do not write an ADR for an unstable or hypothetical decision. Confirm the
  decision is real enough to record.
- Do not invent certainty. If the decision depends on assumptions, write them in
  the Context section.
- Do not write only benefits. If the trade-offs are not clear, stop and ask
  rather than producing a one-sided record.
- Again, do not renumber existing ADRs. Sequence numbers are stable identifiers.

## Before writing

- Establish that the decision is settled or an explicitly requested proposal.
  A decision already confirmed in this conversation needs no second approval.
- Check `docs/adrs/` (or the project's ADR directory) for the next available sequence number.
- If no ADR directory or explicit destination resolves the location, confirm it
  before creating one. Reuse a location already specified or approved.
- If a memory pointer would help, follow Global Preferences' Saving Preferences:
  propose it and wait unless the user explicitly requested the memory update.
