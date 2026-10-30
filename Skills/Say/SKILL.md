---
name: say
description: >-
  Set the register of one piece of prose with /say plain, tight, teach, eli5,
  caveman, or a free-text direction such as "like a changelog". Use before or
  with a writing request. For rewriting an existing response use /bro; for
  session-wide compression use /caveman.
argument-hint: "[plain|tight|teach|eli5|caveman|<free-text direction>] [optional: the ask]"
---

# Say

A register director. The user names how the next piece should sound before you
write it, instead of correcting it after. The unit of scope is **one piece of
writing**, never the session. The skill restates in a different manner;
accuracy is untouchable in every register.

## Scope

**A "piece"** is the deliverable the current ask produces: a chat answer, a
summary, a doc, a handoff, a commit body, a PR description, an artifact's
prose. The register governs that piece from first word to delivery, including
revisions explicitly requested for that same piece. A new deliverable starts
back at baseline unless /say is invoked again; unrelated intervening turns do
not inherit the register.

**Baseline applies by default.** Every register is a delta on top of the Output
Style rules (banned patterns, plain technical English, kept words). If the user
explicitly requests a stylistic feature that conflicts with those defaults,
honor that feature for this piece instead of rejecting or silently softening
it. The override is limited to the requested feature and this piece: keep the
rest of the baseline, and do not treat it as permission to override
higher-priority runtime instructions or broaden the task's authorization.

**Untouched, in every register:** code, identifiers, numbers, file paths,
commands, quoted material, and factual content. Register changes how facts are
told, never which facts exist. If a register's compression would drop a fact
the user needs, keep the fact and note the tension instead of silently cutting.

## Registers

### plain
One human talking to another. The preemptive form of /bro.
- Every term of art is either replaced by the everyday word or glossed in
  passing the first time it appears.
- Prefer a concrete example over an abstract statement when both would work.
- Sentence rhythm is spoken: short sentences, contractions, second person
  where natural.
- Length target: whatever a patient colleague would say out loud, no more.

### tight
Dense and spec-like. For invariants, policies, handoffs, reference material.
- State rules and facts; no narrative, no scene-setting, no examples unless
  one is load-bearing.
- Structure carries meaning: lists for parallel items, prose for reasoning,
  nothing decorative.
- Every sentence must survive the question "what breaks if this line is
  deleted?"
- Not caveman: full grammatical sentences, articles intact. Density comes
  from selection, not compression of the words themselves.

### teach
Anchored and unpacked. For explanations the user will learn from.
- Follow the Explaining & Anchoring preference: lead with an anchor from what
  he already knows, then map alignment and divergence at the mechanism level.
- Surface the assumptions and prerequisites the explanation rests on instead
  of letting them ride silently.
- Check the chain: each step must be derivable from the previous one plus the
  anchor; name the step that is a leap of faith if one exists.
- This register directs exposition. It does not open study mode and does not
  replace the Study Mode Gate; if the ask smells like study work, the gate
  still fires first.

### eli5
Radical simplification by analogy. For a first pass at something genuinely
foreign, not for study material he'll be graded on.
- Assume zero domain background. No term of art survives, not even glossed;
  replace each one with the everyday thing it is.
- Build the explanation on one analogy drawn from universal everyday
  experience (not from his technical knowledge; that is teach's anchor), and
  carry the same analogy through rather than switching mid-explanation.
- Analogies lie at the edges. Close with one line naming where this one
  breaks, so the simple model doesn't quietly become the real one.
- If the topic is study work, say so and offer teach or the study gate
  instead; eli5's lossiness is the wrong trade for material he needs to hold
  precisely.
- If the ask specifically wants a picture explainer instead of prose ("as an
  artifact", "as a diagram", "with pictures") — or the deliverable is already
  an artifact — follow `Protocols/ELI5 Artifact.md` instead of the analogy
  form above: same zero-background, one-throughline spirit, delivered as a
  self-contained HTML artifact with big pictures and few words.

### caveman
The /caveman compression, scoped to one piece. Apply the caveman skill's
rules (its "what to compress", "what stays exact", and safety reverts) to
this piece only; do not enter or imply the session mode. The caveman skill
remains the one definition of the style; this preset only borrows it.

### Free text
`/say <anything>` that is not a preset name is an ad-hoc register: "like a
changelog", "for a recruiter who has 20 seconds", "as if to my past self two
months ago", "first-principles, no analogies". Honor it with the same rules:
baseline applies except where an explicitly requested stylistic feature
conflicts with it, and facts stay intact. If the direction is too vague to act
on ("say it better"), ask one clarifying question rather than guessing.

## Delivery check

Before delivering the piece, run one bounded self-check pass (never more):
re-read the piece and answer two questions silently, "which sentence would
fail this register?" and "did the register change any fact?" Fix what those
two questions surface, then deliver. No visible scoring, no commentary about
the register in the output itself.

## Interplay

- **/bro** rewrites what was already said; /say directs what is about to be
  said. After-the-fact correction stays /bro's job.
- **/caveman** (the skill) is a session mode; /say is per-piece. If the
  session mode is active, /say wins for its piece, then the mode resumes.
- **/writing-assistant, /handoff, /adr** and other producing skills: /say
  composes with them; the producing skill owns structure and content, /say
  owns register. Blog prose voice calibration in /writing-assistant outranks
  /say presets; free-text direction still applies.
- **Vault notes**: follow the destination workspace's authorship and formatting rules;
  register changes do not override them.

## Adding a register

A register earns a preset name only after the same free-text direction has
been asked for repeatedly (first-principles is the current candidate on the
bench). Add it as a delta with the same structure as the presets above; keep
the list short enough to remember without reading this file.
