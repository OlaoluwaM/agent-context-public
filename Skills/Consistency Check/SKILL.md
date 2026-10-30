---
name: consistency-check
description: >-
  Check whether a change set fits the surrounding codebase before a commit.
  Use when the user asks for a consistency or cohesion check, asks whether new
  code matches local conventions, or asks "does this fit?" Covers local
  conventions, incomplete cleanup, stale comments, changed-line lint findings,
  required documentation, and whether a deeper review is warranted. Read-only.
argument-hint: "[paths or comparison ref; blank for the working tree against HEAD]"
---

# Consistency Check

Evaluate whether a change set follows the conventions of the rest of the codebase/surrounding code and removes everything made obsolete by the change.

Focus on cohesion and cleanup. Use `code-review` for correctness, regressions, or spec conformance. Recommend that review only when the size or shape of the diff warrants it. This workflow's goal is to ensure that changes/new code is cohesive with the codebase around it. Meaning that it follows the existing patterns, style, idioms, and architecture, and reaches for an existing abstraction before inventing bespoke ones. Any deviation carries a comment explaining why it was necessary.

This is a read-only workflow. Do not edit files or run Git commands that change state. Report findings and let the user decide what to fix.

## 1. Scope

1. From the repository root, capture the requested diff. With no comparison ref, inspect the working tree against `HEAD` with `git diff HEAD`. With one ref, compare that ref with the current working tree. With a complete range, inspect that range. Restrict the diff to paths that the user names. Whenever the working tree is in scope, list and inspect untracked additions with `git ls-files --others --exclude-standard`.
2. Read every applicable `AGENTS.md` or `CLAUDE.md` from the repository root through each changed path. Read any linked style, contribution, architecture, or design documents that govern the changed code.
3. Identify which applicable rules a configured linter already enforces. Do not repeat those rules as manual findings.
4. Measure the diff by changed lines and files. Record whether it adds public interfaces, dependencies across modules, shared state, or control flow, or whether it only removes or rewords existing code. Use the size and shape to decide how far to inspect beyond the changed files and whether to recommend a deeper review. Apply every relevant check below regardless of diff size.

## 2. Mechanical pass, changed lines only

Run each repository-defined linter that covers a changed language and can run without modifying the repository. If the repository defines no suitable linter, use one supplied by an installed language-specific skill. Do not install or introduce a new linter for this check. Report only findings on changed lines.

If no suitable linter is available, state that the mechanical pass was unavailable. Discard false positives and findings that flag an intentional convention used consistently by the surrounding file. Summarize discarded findings and the reason in one line.

## 3. Read the diff against its surroundings

For each hunk, inspect the changed file, direct callers, and existing precedents needed to evaluate the areas below. Expand the search when the change adds shared state, dependencies, or public interfaces. Keep the investigation focused on cohesion and cleanup.

- **Precedent.** Prefer an existing abstraction, component, token, helper, or pattern that fits the change. When none exists, check whether the change uses the standard language or framework idiom. Accept a necessary deviation only when a comment explains why it exists.
- **Comments.** New comments must explain why the code exists, match the voice of the file, and avoid narrating the change or referring to a task, spec, review, or rule.
- **Naming and structure.** New ids, properties, functions, and files must follow the naming, ordering, and structure used by the surrounding code.
- **Obsolete code.** Check whether the change removed every variable, property, flag, function, type, import, export, registration entry, and configuration key used only by removed code. Search the repository for each removed symbol before reporting it as obsolete.
- **Stale comments.** Check the changed file and its callers for comments that still describe behavior removed or changed by the diff. Search for terms associated with the old behavior.
- **Required documentation.** Determine whether repository rules require a related document in the same change, such as a divergence ledger, settings contract, changelog, or documentation page. Report whether the document was updated or why no update is required.
- **Design rules.** When the change affects visible behavior, check it against documented rules for design tokens, layout grids, motion wrappers, and visual style.

## 4. Decide on deeper review

State whether the diff warrants a deeper review, and support the decision with its size and shape:

- Treat this check as sufficient for a small diff that adds no public interfaces, dependencies, shared state, or control flow and consists mainly of removals or wording changes.
- Recommend the review required by the repository when the diff adds public interfaces, dependencies across modules, shared state, control flow, or anything the repository defines as substantial. Name the review. Do not run it unless the user asks.

## Report

Keep the report short and put findings first. For each finding, include:

- the file and line;
- what does not fit;
- what the surrounding code does instead; and
- whether a comment justifies the deviation.

End with these three labeled lines:

- `Discarded lint:` List discarded findings and the reason, or `none`.
- `Required documentation:` State whether required documents were updated, no update was required, or the requirement could not be determined.
- `Deeper review:` State whether another review is warranted, name it when applicable, and give the diff size or shape as the reason.

If there are no findings, say so plainly and still include the three labeled lines.
