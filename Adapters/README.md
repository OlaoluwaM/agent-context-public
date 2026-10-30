# Runtime adapters — Public Edition

The public installer creates discovery links to the same `Skills/` sources:

| Provider | Skill directory under the selected target root |
| --- | --- |
| Codex | `.codex/skills/<skill-name>` |
| Claude Code | `.claude/skills/<skill-name>` |

These are global-profile adapters. Use `--target-root` for an isolated target
instead of altering your actual home. Default mode is `--check`, which writes
nothing. `--apply` creates missing directories and symlinks after checking every
target for conflicts. Existing matching links are left in place; conflicting
files or links stop installation before any link is created.

```sh
python3 Scripts/agent-context-setup --check --provider codex
python3 Scripts/agent-context-setup --apply --provider claude
```

No global `AGENTS.md`, `CLAUDE.md`, authentication file, model setting, or existing
skill is overwritten. This intentionally differs from the private repository's
broader setup procedure. Inspect and import the example preferences manually
if you want them. The public edition does not include the private runtime's
command wrappers, usage parsers, or cleanup migrations.

Resolve supporting `Protocols/` and `Context/` references from this repository's
root. A skill symlink points into `Skills/`, so following its real path identifies
that root. Respect the current project's instructions when using any skill.
