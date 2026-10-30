---
name: debug
description: Systematic debugging methodology. Use when the user asks to debug a bug, failure, performance problem, or unexpected behavior. Find the root cause before applying fixes.
argument-hint: "[description of the problem]"
---

# Systematic Debugging

Root cause first. Build a tight, red-capable feedback loop around the user's exact symptom, then use it to test evidence-backed hypotheses.

## When to Use

Use for bugs, test and build failures, unexpected behavior, performance problems, and integration issues. Scale the work to the signal already available.

## Do Not Skip

- Redact secrets and PII before showing commands, outputs, logs, traces, or captured artifacts. Keep credentials in environment variables and replace sensitive values with `<REDACTED>`.
- Inspect the actual runtime evidence before proposing a fix. Read error messages and stack traces completely, including paths, line numbers, and error codes.
- Do not invent a cause when the environment cannot reproduce the symptom. State the evidence limit and request the missing access or a redacted artifact.

## 1. Inspect evidence and build the feedback loop

Start with the actual runtime evidence. Read the existing logs, stack traces, CI or build output, metrics, core dumps, and captured traces that expose the failure. Surface load-bearing assumptions and ask early questions when the user's report leaves the symptom, environment, or trigger unclear.

The loop is the central mechanism. Identify the user's exact symptom and create one concrete command, test, script, or structured human-in-the-loop procedure that exercises the real path and asserts that symptom.

Use the narrowest seam that still exercises the exact symptom. Prefer an existing failing test, then a focused CLI or HTTP invocation, browser or trace replay, a minimal harness, or a structured HITL procedure. A command that only exits successfully is not red-capable unless that is the user's exact symptom.

If a precise failing command already gives a tight signal, keep the loop and use one hypothesis plus a minimal reproduction. Do not impose the hard-bug workflow on an obvious build or test failure. For a hard, intermittent, performance, or first-hypothesis-resistant bug, reproduce and minimise before testing, then prepare 3 to 5 ranked, falsifiable hypotheses.

Run the loop once before moving on. It must be:

- Red-capable: it can go red on the reported symptom and green after the correct fix.
- Tight: it is fast, focused, unattended where possible, and has a sharp assertion.
- Reproducible: deterministic when possible. For a nondeterministic bug, measure the failure rate and raise it with repeated runs, stress, or a narrower timing window instead of requiring a clean repro.

If no loop can be built, stop fixes and root-cause claims. List the attempts and state what evidence is missing. Request access to the reproducing environment, a redacted capture such as a log, trace, HAR, core dump, or screen recording with timestamps, or permission for temporary production instrumentation. You may list ranked possibilities only as unverified leads, each tied to observed evidence and labeled as such. Do not present a lead as a supported cause.

## 2. Reproduce, minimise, and investigate

Use the loop result from Step 1 if the relevant state is unchanged; otherwise
rerun it. Confirm that it produces the user's exact failure mode. Capture the relevant symptom in redacted form so later checks can compare against it.

For hard bugs, shrink the scenario one input, caller, configuration, dependency, or step at a time. Rerun after each cut. Every remaining element must be load-bearing. For a direct failing command, the command itself may be the minimal reproduction.

Then inspect the surrounding evidence:

1. Check recent diffs, commits, dependency changes, configuration, and environment differences.
2. Find a working example in the same codebase and compare the relevant differences.
3. Trace the bad value or event backward to its source across component boundaries. Fix the source, not only the symptom.

## 3. Form and test hypotheses

For a direct failure, state one specific hypothesis: “X is the root cause because Y.” Test it with the smallest one-variable probe.

For a hard bug, state 3 to 5 ranked hypotheses before testing them. Each must be falsifiable and include its prediction: “If X is the cause, changing Y will make the symptom disappear or changing Z will make it worse.” Show the ranked list to the user before testing when practical, then continue if the user is unavailable.

Map every probe to one hypothesis. Prefer a debugger or REPL inspection, then targeted logs at boundaries that distinguish the predictions. Never log everything. Tag temporary logs with a unique prefix such as `[DEBUG-a4f2]`, so cleanup can find every occurrence. Redact their values before showing them.

For performance problems, use a separate measurement path: establish a baseline, profile or bisect to locate the regression, and measure before and after each change. Do not use broad logging as a substitute for performance evidence.

## 4. Fix and lock down the behavior

Where a correct observable seam exists, turn the minimised reproduction into a failing regression test before applying the fix. The seam must exercise the real bug pattern and call chain. If no correct seam exists, document that limitation instead of adding a shallow test that gives false confidence.

Apply one fix that addresses the supported root cause. Rerun the regression test and the original feedback loop. Check relevant surrounding tests and confirm that the user's exact symptom is gone.

## The 3-Fix Escalation Rule

After three failed fix attempts in section 4, stop changing code and reassess the architecture, hypothesis, reproduction, environment, and dependencies with the user. A failed hypothesis probe does not count as a fix attempt. Ask for clarification or new evidence before trying another fix.

## Cleanup and verification

Before declaring success:

- Remove every uniquely tagged instrumentation line and throwaway harness. Search for the tag to verify cleanup.
- Verify the original feedback loop and regression test after the final relevant
  change, including instrumentation cleanup. Reuse Step 4 results when the state
  remains unchanged; state the documented absence of a correct seam if applicable.
- State the supported root cause and the evidence limit. Do not claim more than the loop and tests prove.
- Apply the verification gate from `Protocols/Verification Gates.md`: use valid evidence for the final relevant state, read the full output and exit status, and report only what it confirms.
