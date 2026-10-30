# Agent Context — Public Edition

This repository is a selected, public edition of a private agent-context system.
Read `README.md` and `PUBLIC_EDITION.md` before changing its scope.

## Working here

- Keep source skills in `Skills/<name>/SKILL.md` and shared procedures in
  `Protocols/`. Discover skills from their metadata.
- Keep personal context, conversations, real user fixtures, credentials, and
  model outputs out of version control.
- Treat `Context/` as an example configuration, not an instruction to overwrite
  a contributor's existing global preferences.
- Preserve attribution and license notices when adapting external material.
- Use small, reviewable changes. Match existing code and avoid new dependencies
  when the standard library or installed tools suffice.
- Review findings should concern practical visible failures, durable bad state,
  or tests that hide real bugs. Report theoretical concerns without changing code.
- Do not launch live evaluations, delegate to paid agents, publish, or modify
  global runtime settings without authorization for that action.

## Checks

```sh
python3 Scripts/agent-context-check
python3 -m unittest discover -s Tests -v
node --test Evals/assertions/behavior.test.cjs Evals/scripts/prepare-fixtures.test.mjs
```

Provider configuration validation is documented in `Evals/README.md`. Local
tests prove their stated fixtures and assertions only. Do not represent them as
live model evaluations or reuse results from the private edition.

Any sessions created while working here belong in an ignored local directory
or the operating system's temporary directory. Do not commit them.
