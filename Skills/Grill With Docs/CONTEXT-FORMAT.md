# CONTEXT.md Format

`CONTEXT.md` is a **glossary** — the project's canonical language for the concepts in its domain. It is not a spec, a scratchpad, or a home for implementation decisions (those go in ADRs — see the `adr` skill).

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term.}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Be opinionated.** When multiple words exist for the same concept, pick the best one and list the rest under `_Avoid_`.
- **Keep definitions tight.** One or two sentences. Define what it *is*, not what it *does*.
- **Only terms with a domain-specific meaning or naming decision.** A common
  word such as Order can belong when the project defines it precisely. Generic
  programming definitions do not belong merely because the project uses them.
- **Group under subheadings** when natural clusters emerge; a flat list is fine when all terms belong to one cohesive area.

## Single vs multi-context repos

**Single context (most repos):** one `CONTEXT.md` at the repo root.

**Multiple contexts:** a `CONTEXT-MAP.md` at the root lists the contexts, where each lives, and how they relate:

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md) — receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md) — generates invoices and processes payments

## Relationships

- **Ordering → Billing**: Ordering emits `OrderPlaced` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

Inferring which structure applies:

- If `CONTEXT-MAP.md` exists, read it to find the contexts.
- If only a root `CONTEXT.md` exists, single context.
- If neither exists, search for a glossary under another name and reuse its
  format. Only if none exists, confirm the location and create the proposed
  glossary when the first term resolves.
