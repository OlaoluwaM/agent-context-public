# Agent Context — Public Edition

**This is the public edition of a private, actively used agent-context repository.**
It contains selected reusable workflows and synthetic evaluations. It is a
separate snapshot with its own Git history, not a mirror of personal context,
working sessions, or agent conversations.

The project makes recurring collaboration with coding agents explicit: how to
investigate failures, review changes, challenge a design, verify a result, and
hand work to another session. Skills describe the task; protocols hold shared
rules; adapters expose the same files to different agent runtimes.

The private workflow was used during a migration to NixOS. That is an example
of use, not a controlled measurement of productivity or correctness. This
edition does not include the operating-system configuration or migration logs.

## What is included

- `Skills/`: fourteen workflows for debugging, review, design, coordination,
  handoffs, and writing. Each `SKILL.md` declares its own name and purpose.
- `Protocols/`: shared verification, research, delegation, and design-interview
  procedures.
- `Context/`: a portable example preference set. These files contain no personal
  profile or memory.
- `Adapters/` and `Scripts/agent-context-setup`: optional skill discovery links
  for Codex and Claude Code. Setup does not replace global agent configuration.
- `Evals/`: synthetic skill-routing and behavior checks for Debug and bro,
  plus tests of the assertions themselves.

See [the edition boundary](PUBLIC_EDITION.md) for exclusions and changes made
while preparing this snapshot. The evaluations cover a selected subset of the
skills; their presence does not establish that every skill has been evaluated.

## Try a workflow

Read a skill directly, or make it available through your agent runtime. For
example, the Debug workflow starts from an observed failure, builds a focused
reproduction, and checks a proposed fix against the original symptom. Code
Review keeps findings tied to a fixed commit or working-tree scope.

To discover the catalog without a separate manual index:

```sh
rg '^name:|^description:' Skills -g SKILL.md
```

Supporting paths and wikilinks in the skills resolve relative to this repository.
Project instructions and the user's current request take precedence over these
example defaults. Skills that mention an optional specialist should use it only
when it is installed; report missing coverage otherwise.

## Setup

Requires Python 3. The installer previews changes by default:

```sh
python3 Scripts/agent-context-setup --check
python3 Scripts/agent-context-setup --apply --provider codex
```

Select `--provider claude` for Claude Code or `--provider all` for both. Existing
files and links owned by another installation are reported as conflicts; the
installer does not overwrite them. An existing private edition may already own
the same skill names. Use a disposable target for a safe preview:

```sh
python3 Scripts/agent-context-setup --check --target-root /tmp/agent-context-demo
```

See [Adapters](Adapters/README.md) before applying links to a real profile.
No installation step runs a model, changes login state, or installs global
preferences. Read and adapt `Context/Global Preferences.md` before importing it.

## Local checks

The basic checks need Python 3 and Node.js 22.22 or newer:

```sh
python3 Scripts/agent-context-check
python3 -m unittest discover -s Tests -v
node --test Evals/assertions/behavior.test.cjs Evals/scripts/prepare-fixtures.test.mjs
```

The included Nix flake supplies Python and Node for x86_64 and ARM64 Linux:

```sh
nix develop
```

For provider configuration validation and optional model evaluations, follow
[Evals/README.md](Evals/README.md). A live evaluation requires explicit model
selection and your own authenticated runtime or API credentials. It can consume
paid usage. Local assertion tests do not launch models.

## Evidence limits

The synthetic suite checks routing, response structure, evidence use, and scope
on a small cache example. It does not prove production reliability, universal
instruction following, security isolation, or improvements from using agents.
Public-edition results must be generated from this edition; results from the
private repository are not carried over as claims about this snapshot.

## License

Original material is licensed under [MIT](LICENSE). Adapted material keeps
its upstream notices and applicable terms. See [NOTICE](NOTICE) and
[third-party attribution](THIRD_PARTY.md).
