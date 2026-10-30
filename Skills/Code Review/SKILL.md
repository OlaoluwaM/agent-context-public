---
name: code-review
description: Review a branch, PR, commit range, or work-in-progress change set against a resolved fixed point for correctness, repository standards, and spec/scope conformance. Use when the user asks for a code review, PR review, review of changes, or review since a commit or branch. QML-only quality reviews belong to qt-qml-review; this skill remains useful for fixed-point, regression, or spec review. Read-only.
argument-hint: "[fixed point, PR/branch, or spec path]"
---

# Code Review

Review the selected change set from a resolved fixed point to `HEAD`, or through the working tree for a WIP review, on three independent axes:

1. **Correctness and regressions**: Does the change behave correctly and preserve relevant existing behavior?
2. **Repository standards**: Does it follow the applicable repository rules and conventions?
3. **Spec and scope conformance**: Does it implement the requested work, without missing requirements or unrelated expansion?

Repository rules override generic engineering heuristics. Treat generic heuristics as advisory observations only when a repository is silent and there is a concrete impact. Do not report concerns that the repository already enforces mechanically.

This is a read-only workflow. Never modify code under review, apply patches, format files, or create a review artifact unless the user explicitly requests one.

## Completion Criterion

Complete only when the fixed point is resolved; applicable standards and spec sources are resolved or explicitly unavailable; each applicable axis has been reviewed; every reported finding has been verified against the code; and the chat report includes evidence, severity, confidence, and concrete impact. Before reporting completion, apply [[Protocols/Verification Gates|Verification Gates]].

## 1. Establish the Review Target

1. Start from the repository root. Inspect `git status --short`, the current branch, and refs without changing them.
2. Establish the requested scope before reviewing. Distinguish a committed branch or PR review, a working-tree-only review, and a branch plus working-tree review. Ask when the user’s wording makes the choice load-bearing. Do not add changed files outside an explicit user path scope, but inspect callers, dependencies, and standards outside that scope when they are needed to verify an in-scope finding.
3. Prefer an exact fixed point the user explicitly supplied, such as in “review since X,” and resolve it to a commit with `git rev-parse --verify "<ref>^{commit}"`. If the user instead supplied a comparison branch or tag, resolve its merge base with `HEAD` in step 4. Ask when that distinction is unclear and would change the diff.
4. For a working-tree-only review, resolve `HEAD` and state that SHA as the fixed point. For a comparison branch or tag, or when no fixed point was supplied for a committed branch or branch-plus-working-tree review, identify the comparison ref. Prefer the explicit comparison ref; otherwise use `refs/remotes/origin/HEAD`, then a single unambiguous local or remote `main` or `master` candidate. Resolve `git merge-base <comparison-ref> HEAD` and state the resulting SHA as the fixed point.
5. If no default branch is unambiguous, or the user’s requested comparison is unclear or non-ancestral in a way that changes the review, ask before continuing. State the alternatives and the consequence of each.
6. Capture the exact scope once, including the changed-file list and relevant commit list. `<pathspec>` means only paths the user selected; omit `-- <pathspec>` when the user selected the complete requested change set:

   - **Committed branch or PR:** `git diff --find-renames --find-copies <fixed-point>..HEAD -- <pathspec>` and `git log --oneline <fixed-point>..HEAD`.
   - **Working tree only:** `git diff --find-renames --find-copies HEAD -- <pathspec>`, which includes staged and unstaged tracked changes.
   - **Branch plus working tree:** `git diff --find-renames --find-copies <fixed-point> -- <pathspec>`, which compares the working tree with the fixed point and includes committed, staged, and unstaged tracked changes.

   For either working-tree scope, enumerate untracked files with `git ls-files --others --exclude-standard -- <pathspec>`. Review each included untracked file as an addition, using `git diff --no-index /dev/null "<file>"` for evidence (exit status 1 means the files differ). State the untracked-file count and whether any user-selected paths excluded them. Do not silently omit them.

7. Confirm that the selected scope is non-empty. An empty scope is a valid result, not a reason to inspect unrelated code.

Using a merge base for a comparison ref reviews this branch’s changes without including commits unique to the comparison branch. An exact fixed point supplied as “since X” remains exact rather than being converted to a merge base.

## 2. Discover the Evidence

### Spec and scope

Find the spec from the strongest available source, in this order:

1. Material the user supplied, including a named path, issue text, acceptance criteria, or PR description.
2. The current conversation, approved plan, or handoff.
3. Commit messages and local references to an issue, ticket, or PR.
4. Repository documentation, design notes, and task files that match the branch, commits, or changed area.

Do not require an issue tracker or any setup specific to one. If sources conflict, name the conflict and ask when it could change the findings. If no usable spec exists, skip only the Spec and scope axis and say why.

### Repository standards

Read the applicable `AGENTS.md` files first, from repository root through each changed path. Then find relevant contribution, style, architecture, testing, and language-specific instruction documents. Inspect configured linters, formatters, and CI checks enough to identify rules already enforced mechanically.

Apply only rules that govern the changed code. Cite each standards finding with the source path and rule. Skip mechanical restatements, such as a formatting rule that the repository’s configured formatter already catches.

### Mechanical gates

From the applicable instructions, test documentation, package scripts, and CI configuration, identify proportionate non-mutating gates for the selected scope. Run relevant lint, typecheck, build, and focused test commands when practical. Do not run formatters in write mode, fixes, deployments, or generators that change source files. Tests and builds may create disposable outputs in temporary or ignored build directories when they leave reviewed source and user data untouched. Inspect unfamiliar commands first; use a disposable checkout when their writes cannot be bounded safely.

Treat a failed gate as review evidence. Report it once under the axis it supports, with the command and relevant output, rather than manually duplicating the same diagnosis. State every selected gate as passed, failed, unavailable, or skipped with a reason. A skipped gate is not a passing gate.

## 3. Review Each Axis Independently

Keep evidence and findings separate by axis. A finding may appear on more than one axis, but cross-reference it instead of merging, suppressing, or re-ranking it.

### Correctness and regressions

Trace changed control flow, data flow, state transitions, error paths, boundaries, and callers that the diff affects. Compare implementation behavior with nearby tests, contracts, and established behavior. Use the selected mechanical gates and reproduce a claim with an existing focused test, build check, or minimal read-only inspection when practical. Report a regression only when the changed code and relevant behavior support it.

### Repository standards

Compare the diff to the applicable documented rules and local patterns. Prefer direct violations over taste. If generic heuristics expose a concrete risk in a repository that has no governing rule, label the finding advisory and explain why it matters. Do not turn a preference into a standards violation.

### Spec and scope conformance

Map each material requirement to the diff and related tests or documentation. Report missing or partial requirements, incorrect implementations, and scope expansion that creates concrete cost or risk. Cite the relevant spec source for every finding. If no spec was found, omit this axis rather than guessing intent.

## 4. Optional Delegation

For large diffs, optionally assign one reviewer per axis. Before dispatching,
read and follow [[Protocols/Subagent Dispatch|Subagent Dispatch]] for role/tier
approval, model selection, and review; report the tiers that actually ran.

Give each reviewer the resolved diff command, changed-file list, applicable
sources, its single axis, read-only constraint, and four-status report contract.
Verify each report against actual code, reproduce practical correctness claims,
and discard unsupported or duplicate findings.

If delegation is unavailable or declined, review each axis sequentially with
the same evidence and verification standard; this is equally complete.

## 5. Report

Default to chat. Create a file only when the user asks for a review report.

Open with the review mode, resolved fixed point, exact diff scope, tracked/untracked
changed-file counts, standards sources, spec source (or why skipped), and each
selected mechanical gate's status. Use these headings in order:

| Heading / finding IDs | Supporting evidence and impact |
|---|---|
| Correctness and regressions / C1… | Relevant tests/callers; broken, regressed or unsafe behavior |
| Repository standards / S1… | Standards source/rule; maintenance, correctness or team cost |
| Spec and scope conformance / P1… | Spec source; unmet requirement or concrete scope cost |

Use this example template for each axis; Standards severity excludes `critical`:

```markdown
### [C1] Short finding title
- **Evidence:** `path/to/file:42`; applicable supporting locations
- **Severity:** critical | high | medium | low
- **Confidence:** high
- **Impact:** Concrete consequence for this axis.
- **Recommendation:** Concrete next action.
```

Report only high-confidence findings. Suppress medium- and low-confidence suspicions. If an unresolved material question prevents a conclusion, state it as a blocker or request for context, not as a finding. State a clean axis explicitly when no findings remain after verification.

For a QML-only quality review, use `qt-qml-review`. When a fixed-point, correctness/regression, or spec review includes material QML changes, offer `qt-qml-review` as an additional specialized, read-only pass. Do not invoke it automatically or repeat its detailed QML checklist here.
