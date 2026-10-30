const assert = require("node:assert/strict");
const test = require("node:test");

const checkBehavior = require("./behavior.cjs");

function check(caseName, value, providerResponse = {}) {
  return checkBehavior(JSON.stringify(value), {
    vars: { case: caseName },
    providerResponse,
  });
}

const observedDebugRaw = JSON.stringify({
  finalResponse: "omitted from trace checks",
  items: [
    {
      type: "command_execution",
      command:
        "/bin/zsh -lc \"sed -n '1,240p' .agents/skills/debug/SKILL.md && ./run-test.mjs\"",
      aggregated_output:
        "---\nname: debug\n---\n# Systematic Debugging\n" +
        "✖ reuses a cached zero\n2 !== 1\n",
      exit_code: 1,
      status: "failed",
    },
    {
      type: "command_execution",
      command: "/bin/zsh -lc \"rg -n cache --glob '*.mjs' .\"",
      aggregated_output:
        "./src/cache.mjs:1:export function cachedLookup(cache, key, compute) {\n" +
        "./src/cache.mjs:2:  if (cache[key]) {\n",
      exit_code: 0,
      status: "completed",
    },
  ],
});

const base = {
  kind: "rewrite",
  answer: "The cache sees zero and does the same work again.",
  rootCause: null,
  evidence: [],
  nextAction: null,
  editsMade: false,
};

test("bro rewrite preserves the cache behavior", () => {
  assert.equal(check("bro-explicit", base).pass, true);
});

test("bro rewrite rejects unrelated plain text", () => {
  assert.equal(check("bro-explicit", { ...base, answer: "Hello." }).pass, false);
});

test("near miss rejects a forbidden attempted skill call", () => {
  const status = {
    ...base,
    kind: "status_update",
    answer: "The cache test fails, and diagnosis is next.",
  };
  assert.equal(
    check("bro-near-miss", status, {
      metadata: { attemptedSkillCalls: [{ name: "bro", source: "heuristic" }] },
    }).pass,
    false,
  );
  assert.equal(
    check("bro-near-miss", status, {
      metadata: { skillCalls: [{ name: "bro", source: "native" }] },
    }).pass,
    false,
  );
});

test("debug diagnosis accepts the captured Codex command-output shape", () => {
  const diagnosis = {
    ...base,
    kind: "diagnosis",
    answer: "The cache treats zero as a miss. Check key presence instead.",
    rootCause: "Cached zero is falsy, so the second lookup calls compute again.",
    evidence: ["Ran ./run-test.mjs once."],
  };
  assert.equal(
    check("debug-diagnosis", diagnosis, { raw: observedDebugRaw }).pass,
    true,
  );
  assert.equal(
    check("debug-diagnosis", { ...diagnosis, rootCause: "Zero is involved." }, {
      raw: observedDebugRaw,
    }).pass,
    false,
  );
});

test("debug diagnosis rejects self-reported evidence without a provider trace", () => {
  const diagnosis = {
    ...base,
    kind: "diagnosis",
    answer: "The cache treats zero as a miss. Check key presence instead.",
    rootCause: "Cached zero is falsy, so the second lookup calls compute again.",
    evidence: ["I read the skill, source, and failing test output."],
  };
  assert.equal(check("debug-diagnosis", diagnosis).pass, false);
  assert.equal(
    check("debug-diagnosis", diagnosis, { raw: "not JSON" }).pass,
    false,
  );
});

test("debug diagnosis rejects commands whose outputs contain no evidence", () => {
  const diagnosis = {
    ...base,
    kind: "diagnosis",
    answer: "The cache treats zero as a miss. Check key presence instead.",
    rootCause: "Cached zero is falsy, so the second lookup calls compute again.",
  };
  const noOutput = JSON.stringify({
    items: [
      {
        type: "command_execution",
        command:
          "cat .agents/skills/debug/SKILL.md src/cache.mjs; ./run-test.mjs",
        aggregated_output: "",
        exit_code: 1,
      },
    ],
  });
  assert.equal(check("debug-diagnosis", diagnosis, { raw: noOutput }).pass, false);
});

test("evidence limit requires a concrete request and no root cause", () => {
  const limited = {
    ...base,
    kind: "evidence_limit",
    answer: "I cannot diagnose this yet.",
    nextAction: "Provide a redacted timeout trace from one failed request.",
  };
  assert.equal(check("debug-evidence-limit", limited).pass, true);
  assert.equal(
    check("debug-evidence-limit", { ...limited, rootCause: "The database is slow." })
      .pass,
    false,
  );
});

test("capability limit preserves inspected evidence without claiming a cause", () => {
  const limited = {
    ...base,
    kind: "evidence_limit",
    answer: "The files suggest a likely mechanism, but I cannot rerun the loop.",
    evidence: ["The captured test output contains 2 !== 1."],
    nextAction: "Run the focused cache test in a shell-enabled fixture.",
  };
  assert.equal(check("debug-capability-limit", limited).pass, true);
  assert.equal(
    check("debug-capability-limit", { ...limited, rootCause: "The check is wrong." })
      .pass,
    false,
  );
});
