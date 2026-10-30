---
name: simple-english
description: >-
  Write clear technical prose guided by ASD-STE100 while preserving meaning
  and the reader's level of knowledge. Use when the user invokes /simple-english
  or asks to simplify technical prose, or when standing instructions load it
  as the default prose guidance.
  Editing his writing still requires an explicit request.
---

> Public-edition adaptation: runtime and personal-context guidance has been made portable; upstream attribution is retained.

# Simple English

Write so the intended reader can follow the meaning on the first read.

Locally adapted from [AminBlg/SimpleEnglish](https://github.com/AminBlg/SimpleEnglish/blob/main/skills/simple-english/SKILL.md),
reviewed at v2.0.2 on 2026-09-10.

Use [ASD-STE100 Simplified Technical English](https://www.asd-ste100.org/about_STE.html)
as the guiding reference for word choice, grammar, sentence structure, and
style. Its emphasis on recognizable words, consistent meanings, and clear
technical terminology informs the default guidance below. Apply that guidance
to everyday prose while preserving meaning and the requested register.

## Scope

Apply this guidance to prose you author or are explicitly asked to rewrite,
within the scope allowed by the standing instructions. Their style preferences
and exemptions take precedence over this skill's defaults.

This skill governs phrasing. The active task or producing skill owns content,
structure, verification, and interaction. An explicit register request, such
as `/say`, overrides the relevant defaults for that piece.

## Draft or rewrite

1. Identify the reader and purpose from the request. Explain an unfamiliar
   term briefly at first use; keep established terminology without repeatedly
   defining it.
2. Preserve meaning. Keep facts, numbers, conditions, exceptions, uncertainty,
   and levels of obligation intact. Never turn “may” into certainty or
   “should” into “must” to simplify a sentence. Preserve literal code,
   identifiers, commands, paths, and quoted text.
3. Use familiar words and direct verbs. Prefer active voice when the actor is
   known. Choose the tense that accurately describes the event; do not invent
   an actor or change timing to satisfy a style rule.
4. Keep terminology consistent where the meaning is the same. Preserve
   distinctions such as validation versus verification when they matter.
5. For instructions, put the condition before the action. Give each step one
   main action. Put a warning before the action that creates the risk, and
   name the consequence.
6. For explanations, develop one main point per paragraph and make causal
   links explicit. Split sentences that bury a condition or combine several
   ideas. For documentation, use 20 words per instruction sentence and 25 per
   descriptive sentence as editing targets, not limits that justify losing
   meaning or breaking natural flow.
7. Keep complete grammar and a natural spoken register. Use the formatting
   that makes the content easiest to follow. Match length
   to the task; there is no fixed sentence cap for chat replies.

## Check before delivery

Read the result once for meaning and clarity. Fix ambiguous actors, buried
conditions, unexplained terms, inconsistent wording, and sentences that are
hard to follow. Check that simplification preserved facts, uncertainty,
obligations, and literal material. Deliver when those checks pass; do not
append a style audit unless requested.

## Exact STE requests

ASD-STE100 guides the default style. An explicit compliance request adds a
check against the standard's full requirements, including its vocabulary rules.
Merely mentioning the standard does not request that additional check.
For a compliance pass, retrieve and name the official issue used, then check
against that text. If it is unavailable, state that compliance is unverified.
Do not treat this adaptation or upstream's summaries as the standard.
