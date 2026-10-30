# Public edition boundary

This is a selected public snapshot of a private agent-context system. It has
an independent repository identity and does not include the source repository's
Git history, branches, tags, remotes, or commit metadata.

## Exported material

The snapshot includes fourteen stable skills and their required protocols,
portable example preferences, a skills-only installer, and the small Debug/bro
evaluation suite. `Evals/` was extracted from the private repository's evaluation
directory. It is not an export of that repository's complete evaluation system.

The source uses a larger set of study, note-review, job-search, and writing
workflows. Those workflows, the larger repeatability runner, optional third-party
review integrations, and runtime usage reports are outside this edition.

## Deliberate exclusions

- Personal profile, memory, decisions, contact details, and job-search records.
- Session notes, handoffs, assessment histories, source-review caches, and logs.
- Model responses, run manifests, usage reports, local authentication, and secrets.
- Editor state, machine-specific settings, private runtime helpers, and vendor
  submodules.
- Private Git history and remote configuration.

## Changes from the working system

- Personal names, private project examples, and note-workspace assumptions were
  removed or generalized in exported instructions.
- Global preferences and the delegation overview were rewritten as portable
  examples, without personal background or historical decisions.
- The installer exposes skills only. It does not install the working system's
  global preferences, command shims, cleanup rules, or third-party packs.
- Evaluation fixture paths were updated for `Evals/`. Model identifiers are
  supplied by the operator, not inherited from the private setup.
- Unexported usage and evaluation scripts were removed from the npm manifest.
- Upstream attribution is retained. The short bro instruction was reworded for
  this edition while preserving its rewrite-only purpose. The ELI5 visual
  protocol was written afresh, with the borrowed prompt omitted because its
  upstream license metadata conflicts.

## Maintaining this edition

Update it by reviewing specific source files. Do not copy the private tree, its
`.git` directory, or its generated evaluation outputs into this repository.
Keep project examples synthetic. Re-run the local checks after changing a skill
or fixture; re-run an affected live evaluation only when its cost is authorized.

The structural check catches known excluded paths and common accidental private
references. It is a bounded check, not a guarantee that arbitrary future content
is safe to publish. Review the complete staged diff before every publication.
