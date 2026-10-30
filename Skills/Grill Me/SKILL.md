---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, then offer to capture the confirmed outcome in agent-context. Use when the user wants to stress-test a plan, get grilled on a design, or says "grill me".
argument-hint: "[the plan or design to grill]"
---

# Grill Me

Pressure-test a plan or design by interviewing the user until you both reach genuine shared understanding. This is the **convergent** counterpart to `brainstorm`. Use `brainstorm` to explore an open idea space without answers. Use `grill-me` once there's a concrete plan that needs to survive scrutiny.

Before beginning, read and follow `Protocols/Grilling.md` under the agent-context root. It is the canonical interview procedure for both grilling skills.

## Grounding

Ground the interview in the conversation and referenced artifacts. Inspect available evidence before asking the user for facts.

## Paper trail

After the user confirms the outcome, propose an exact path under `Sessions/` in the agent-context hub:

- If a matching project or topic directory already exists, place a dated decision record there.
- Otherwise propose one dated Markdown file at the `Sessions/` root. Do not create a directory for a single file.
- If an existing artifact already owns the decision, propose updating it instead of creating a duplicate.

Show the proposed path and wait for approval before writing. Capture the distilled outcome using the paper-trail rules in `Protocols/Grilling.md`. Never save the transcript.

When the plan belongs to a project, offer to record a decision with the `adr` skill only when it is hard to reverse, surprising without context, and the result of a real trade-off.
