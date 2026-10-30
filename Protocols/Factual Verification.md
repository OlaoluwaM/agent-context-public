---
tags:
  - reference
  - agent-protocol
---

# Factual Verification

Discipline for verifying factual claims — in notes, research output, or any knowledge artifact. Complements [[Research Framework]] (which covers sourcing and triangulation). This protocol covers what those don't: the per-claim verification gate and the failure modes specific to knowledge work.

---

## The Gate Function for Facts

Before asserting that a claim is accurate:

1. **Isolate the claim** — state it as a standalone proposition
2. **Identify what would verify it** — a source you can retrieve and read this session
3. **Retrieve and read the source** — not from memory, not from training data
4. **Check alignment** — does the source actually support the claim as stated?
   - Yes → the claim is verified. Cite the source.
   - Partially → note what's supported and what isn't
   - No → flag the discrepancy
5. **Only then** — assert accuracy

If you skipped step 3, you formed an opinion, not a verification.

---

## Evidence Hierarchy

Different claim types require different evidence. Stronger evidence types override weaker ones.

| Claim type | Strong evidence | Acceptable | Not sufficient |
|------------|----------------|------------|----------------|
| Protocol/spec behavior | The spec itself (RFC, W3C, ECMA) | Official docs summarizing the spec | Blog posts, training data, "I know this" |
| API behavior | Official docs, tested output | Reputable tutorials citing the version | Stack Overflow answers from 3 years ago |
| Historical fact | Primary sources, encyclopedias | Multiple independent secondary sources | A single blog post |
| Conceptual explanation | Textbooks, original papers, official docs | Widely corroborated explanations | Plausible-sounding reasoning |
| Statistic or number | The original study or dataset | Credible secondary source citing the original | Round numbers with no source ("about 90%") |
| Recency-dependent claim | Live search, official announcements | Recent (< 6 months) credible coverage | Training data alone |
| Consensus/community view | Multiple independent forum threads, surveys | Established reputation (e.g., "React is popular") | One person's opinion presented as consensus |

**When the strong source isn't available:** use Acceptable evidence to verify only when Strong evidence isn't retrievable or the claim's risk doesn't warrant it — and label it as secondary-source verification. If no adequate source can be retrieved this session (blocked, paywalled, unavailable, unreadable), mark the claim **unverified / source-limited**; never silently downgrade to weaker evidence or pass it as verified.

---

## Rationalization Table

| Trap | Required response |
|------|-------------------|
| Confidence, familiarity, plausibility or agreement with the note | Retrieve and read a source supporting the claim; follow the evidence hierarchy above. |
| A similar claim was already checked | Confirm the evidence covers this exact claim, version and relevant conditions. |
| Verification is unavailable or too costly | Mark the claim **unverified / source-limited** rather than silently passing it. |

For personal notes too: imprecise-but-correct is fine; incorrect is not. The
review phase still determines which precision issues to flag.

---

## Evidence Coverage

Judge verification by claim/source alignment, not elapsed time. One retrieved
source can support several claims if its relevant passages support each one.
Reuse evidence read in this session for the same claim and source version while
it remains applicable; retrieve again when the claim, version, or relevant
conditions change. Similar wording alone does not establish coverage.

When reviewing a note with many claims: prioritize. Verify the structural claims (the ones that shape the reader's mental model) thoroughly. Flag claims you didn't have time to verify as unverified rather than implicitly passing them.

---

## Self-Verification

After completing research or writing a summary, apply the gate to your own output — to the substantive, checkable claims that affect correctness, not connective or framing wording:

- For each factual claim in your response, can you point to where you verified it?
- Did you introduce any claims during synthesis that weren't in your sources?
- Did you strengthen any hedged claims ("may" → "does") without evidence for the stronger version?
- Does evidence reused from an earlier turn still support this exact claim,
  source version, and relevant conditions?

---

## Integration with Other Protocols

- **[[Research Framework]]** covers how to find and evaluate sources. This protocol covers how to apply those sources to individual claims.
- **[[Verification Gates]]** covers the engineering equivalent — command output as evidence. This protocol covers factual claims as evidence.
