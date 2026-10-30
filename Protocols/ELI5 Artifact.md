---
tags:
  - reference
  - agent-protocol
---

# ELI5 Artifact

Use this protocol when [[Skills/Say/SKILL|Say]] requests a visual explanation
for a beginner. Choose a question the reader should be able to answer after
viewing the result, then make the diagram answer that question.

## Build the explanation

1. Pick the relevant objects and relationships. Label them in familiar
   language. Explain any necessary technical label beside the object.
2. Arrange the objects to show the mechanism: a sequence for events, layers
   for containment, or connected nodes for relationships. Use one arrangement
   consistently throughout the explanation.
3. Include a concrete example that the reader can follow through the diagram.
   Keep supporting text near the part it describes.
4. State what the picture leaves out, especially where a simplified analogy
   could lead the reader to a wrong conclusion.
5. Deliver a local HTML file unless the user requested another supported
   format. Bundle its styles and graphics so the file opens without downloads.
   Add interaction only when it helps answer the reader's question.
6. Inspect the result in a browser when available. Check that the labels are
   readable, the layout fits, and any controls work. Report when visual checks
   could not be performed. Publishing requires authorization for the destination.

## Provenance

The visual-explanation workflow was inspired by Thariq Shihipar's
[eli5 skill](https://github.com/anthropics/claude-plugins-community/blob/main/eli5/skills/eli5/SKILL.md).
This public edition replaces the earlier adaptation with newly written
instructions and does not reproduce that prompt. The upstream repository and
plugin manifest name different licenses; this file makes no claim about which
license governs the upstream prompt.
