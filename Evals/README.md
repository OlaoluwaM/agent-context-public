# Skill evaluations — Public Edition

This directory exports the small Debug/bro suite from the private agent-context
system. It includes synthetic inputs, assertion code, and provider configuration.
It does not include real conversations, prior run outputs, credentials, usage
reports, or the larger private repeatability and review suites.

## What is checked

- Whether an agent invokes the intended skill or avoids an unrelated one.
- Whether it grounds a diagnosis in source and observed test output.
- Whether it acknowledges missing evidence or a missing execution capability.
- Whether a rewrite preserves the small fixture's meaning.

Codex cases include an executable cache fixture. The Claude suite provides
read-only file tools and a captured failing test; it checks that the agent
reports the missing shell capability. That suite does not prove a complete
debugging feedback loop. Assertions inspect responses and trace metadata; they
are bounded mechanical checks, not a general semantic judge.

The cache fixture intentionally contains a bug. Running its test directly is
expected to fail with `2 !== 1`. The fixture-preparation control verifies that
failure before allowing a provider run.

## Free local controls

Requires Node.js 22.22 or newer. From this directory:

```sh
node --test assertions/behavior.test.cjs scripts/prepare-fixtures.test.mjs
```

These tests run no agents and need no provider credentials. They check the
graders and fixture setup. They do not establish how a current model behaves.

## Install and validate provider configuration

```sh
npm ci --ignore-scripts
npm run eval:validate
```

The lockfile pins the evaluation dependencies. Installation uses network access
when packages are not cached, but disables dependency lifecycle scripts.
Configuration validation uses placeholder model names when none are supplied;
it does not check account access, model availability, authentication, or CLI
compatibility, and it does not launch a model.

## Optional live evaluations

Choose model identifiers available to your account. The example values below
are placeholders, not valid model names:

```sh
SKILL_EVAL_CODEX_MODEL='your-codex-model' npm run eval:smoke:codex
SKILL_EVAL_CODEX_MODEL='your-codex-model' npm run eval:codex
SKILL_EVAL_CLAUDE_MODEL='your-claude-model' npm run eval:claude
```

Live runs consume account or API resources. They are never part of the default
local checks. Codex requires the host `codex` executable and an `OPENAI_API_KEY`,
`CODEX_API_KEY`, or a dedicated authenticated directory selected with
`AGENT_CONTEXT_EVAL_CODEX_HOME`. No credential file is distributed or copied from
your normal profile by this runner. Claude requires the host `claude` executable
and its normal authentication. Configure authentication separately using the
runtime's documentation.

Executable overrides are `AGENT_CONTEXT_EVAL_CODEX_BIN` and
`AGENT_CONTEXT_EVAL_CLAUDE_BIN`. Only the selected live provider needs its CLI.
Both configurations disable result sharing and response caching. Runs are
sequential; the wrapper limits a smoke run to 90 seconds and a full provider run
to five minutes. Claude additionally has an eight-turn and $0.25 per-case limit.
Review your provider's charging and timeout behavior before running a suite.

Each run gets a unique temporary fixture containing copied public skills and
synthetic source/test files. The wrapper removes that fixture when it finishes,
unless `KEEP_SKILL_EVAL_FIXTURES=1` is set for inspection. Generated provider
state, traces, and results remain under ignored `.promptfoo/` and `.work/`.
Do not commit them: they can contain runtime details even with synthetic inputs.

## Interpretation

Report the edition revision, model and CLI versions, cases run, and observed
failures when comparing live runs. A passing structural assertion does not
prove that every judgment in an answer is correct. Inspect raw responses before
making broader claims. Historical private-edition results do not establish
behavior for these adapted files.
