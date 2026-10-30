---
name: handoff
description: Compact the current conversation into a handoff document so a fresh agent (or a fresh session after compaction) can pick up the work cleanly. Use when the user invokes /handoff, is about to run out of context, or wants to continue work in a new session.
argument-hint: "What will the next session focus on?"
---

# Handoff

Write a handoff document summarising the current conversation so a fresh agent can continue the work without re-deriving everything.

## Where it goes

Save to the operating system's temporary directory (use `$TMPDIR` when set, otherwise `/tmp`), **not** the current workspace and **not** the vault. A handoff is session plumbing, not a durable artifact — it shouldn't end up tracked in a repo or filed in the personal notes workspace.

Use a deterministic, findable filename:

```text
agent-handoff-YYYYMMDD-HHMMSS[-short-topic].md
```

Create and reserve the path mechanically with the platform's local clock. Do
not read, transcribe, or convert the timestamp yourself:

Run this with an available Python 3 interpreter (`python3` or `python`):

```python
from datetime import datetime
import os
from pathlib import Path
import time

handoff_dir = Path(os.environ.get("TMPDIR") or "/tmp").resolve(strict=True)
topic = "short-topic"  # Or use "" when no topic helps discovery.
topic_suffix = f"-{topic}" if topic else ""

for attempt in range(3):
    handoff_path = handoff_dir / (
        f"agent-handoff-{datetime.now():%Y%m%d-%H%M%S}{topic_suffix}.md"
    )
    try:
        fd = os.open(handoff_path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        if attempt == 2:
            raise RuntimeError("Cannot create handoff after 3 filename collisions")
        time.sleep(1)
    else:
        os.close(fd)
        print(handoff_path)
        break
```

Replace `short-topic` before running the command, or set `topic = ""`. Keep
the slug short and exclude secrets or personal data. Copy the printed path
exactly when writing and reporting the handoff; do not construct another path.
In the final response, print that exact absolute path.

## What to include

- **Goal** — what the work is ultimately trying to achieve.
- **Mode and authority** — current Learn/Ship and Guide/Pair/Full setting, explicit
  approvals already given, their scope, and any actions still awaiting approval.
- **Workspace** — repository path, branch and relevant commit SHAs, worktree
  changes and their ownership. Label stale or unverified state; do not imply
  that an old check covers a later edit.
- **State** — what's been done, what's in progress, what's left. If a first step
  already landed and was verified (a failing repro, a passing edit), say so
  explicitly: an approach that survived contact with the code is worth more to
  the next agent than a plan that hasn't.
- **Evidence trail** — what was read and the load-bearing takeaway from each
  source, as `path:line` pointers or URLs. Conclusions should arrive with their
  grounding, not as bare claims the next agent has to re-verify.
- **Dead ends** — approaches tried or considered and ruled out, with the reason,
  so the next agent doesn't re-explore them.
- **Key decisions and constraints** — the non-obvious choices made and why, so the next agent doesn't relitigate them.
- **Next steps as a checklist** — the remaining work as a short todo list
  (aim for ≤7 items), each item paired with how to verify it's done. A checklist
  with validation steps steers the next agent long after prose intent has
  scrolled out of attention.
- **Open questions / blockers** — anything unresolved.
- **Suggested skills** — a short section naming the skills the next agent should invoke for the next steps (e.g. `debug`, `grill-with-docs`, `adr`).

## Discipline

- **Don't duplicate existing artifacts.** If something is already captured in a PRD, plan, ADR, issue, commit, or diff, reference it by path or URL instead of pasting it.
- **Redact secrets.** Strip API keys, passwords, tokens, and personal information before writing.
- **Tailor to the next session.** If the user passed arguments, treat them as a description of what the next session will focus on and weight the document toward that.

Keep it tight — a handoff that's as long as the conversation it summarises has failed.
