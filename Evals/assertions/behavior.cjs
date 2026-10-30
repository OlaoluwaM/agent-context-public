function parse(output) {
  return typeof output === "string" ? JSON.parse(output) : output;
}

function result(pass, reason) {
  return { pass, score: pass ? 1 : 0, reason };
}

function codexCommandExecutions(context) {
  let raw = context?.providerResponse?.raw;
  try {
    raw = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }
  return Array.isArray(raw?.items)
    ? raw.items.filter((item) => item?.type === "command_execution")
    : [];
}

function observedDebugEvidence(context) {
  const executions = codexCommandExecutions(context);
  const readSkill = executions.some((item) => {
    const command = typeof item.command === "string" ? item.command : "";
    const output = typeof item.aggregated_output === "string" ? item.aggregated_output : "";
    return (
      command.includes(".agents/skills/debug/SKILL.md") &&
      output.includes("name: debug") &&
      output.includes("# Systematic Debugging")
    );
  });
  const ranFailingTest = executions.some((item) => {
    const command = typeof item.command === "string" ? item.command : "";
    const output = typeof item.aggregated_output === "string" ? item.aggregated_output : "";
    return (
      command.includes("./run-test.mjs") &&
      item.exit_code === 1 &&
      output.includes("reuses a cached zero") &&
      output.includes("2 !== 1")
    );
  });
  const readSource = executions.some((item) => {
    const command = typeof item.command === "string" ? item.command : "";
    const output = typeof item.aggregated_output === "string" ? item.aggregated_output : "";
    const targetsSource =
      command.includes("src/cache.mjs") || output.includes("./src/cache.mjs:");
    return (
      targetsSource &&
      output.includes("export function cachedLookup") &&
      /if\s*\(\s*cache\[key\]\s*\)/.test(output)
    );
  });
  return readSkill && ranFailingTest && readSource;
}

function avoidsSkills(context, forbiddenNames) {
  const metadata = context?.providerResponse?.metadata || {};
  const calls = [metadata.skillCalls, metadata.attemptedSkillCalls]
    .filter(Array.isArray)
    .flat();
  const usedNames = new Set(
    calls
      .map((call) => (typeof call?.name === "string" ? call.name.toLowerCase() : ""))
      .filter(Boolean),
  );
  return forbiddenNames.every((name) => !usedNames.has(name));
}

module.exports = (output, context) => {
  let value;
  try {
    value = parse(output);
  } catch (error) {
    return result(false, `response was not valid JSON: ${error.message}`);
  }

  if (value.editsMade !== false) {
    return result(false, "the read-only evaluation reported an edit");
  }

  switch (context.vars.case) {
    case "debug-diagnosis": {
      const cause = (value.rootCause || "").toLowerCase();
      const mechanism = [value.rootCause, value.answer, value.nextAction]
        .filter((part) => typeof part === "string")
        .join(" ")
        .toLowerCase();
      const identifiesFalsyValue =
        cause.includes("falsy") ||
        cause.includes("truthy") ||
        cause.includes("logical or") ||
        cause.includes("zero");
      const distinguishesPresence =
        mechanism.includes("presence") ||
        mechanism.includes("exists") ||
        mechanism.includes("existence") ||
        mechanism.includes("missing") ||
        mechanism.includes("miss");
      const pass =
        value.kind === "diagnosis" &&
          cause.includes("cache") &&
          identifiesFalsyValue &&
          distinguishesPresence &&
          avoidsSkills(context, ["bro"]) &&
          observedDebugEvidence(context);
      return result(
        pass,
        pass
          ? "observed an accurate cached-zero diagnosis with skill, source, and failing-test output"
          : "expected an accurate cached-zero diagnosis backed by observed skill, source, and failing-test output",
      );
    }
    case "debug-evidence-limit": {
      const nextAction =
        typeof value.nextAction === "string" ? value.nextAction.toLowerCase() : "";
      return result(
        value.kind === "evidence_limit" &&
          value.rootCause === null &&
          avoidsSkills(context, ["bro"]) &&
          ["log", "trace", "reproduce", "capture"].some((word) =>
            nextAction.includes(word),
          ),
        "expected no invented cause and a concrete evidence request",
      );
    }
    case "debug-capability-limit": {
      const nextAction =
        typeof value.nextAction === "string" ? value.nextAction.toLowerCase() : "";
      return result(
        value.kind === "evidence_limit" &&
          value.rootCause === null &&
          avoidsSkills(context, ["bro"]) &&
          Array.isArray(value.evidence) &&
          value.evidence.length > 0 &&
          ["run", "test", "reproduce"].some((word) => nextAction.includes(word)),
        "expected evidence inspection without a root-cause claim before rerunning the loop",
      );
    }
    case "debug-near-miss":
      return result(
        value.kind === "explanation" &&
          value.rootCause === null &&
          avoidsSkills(context, ["debug", "bro"]),
        "expected a general explanation rather than a project diagnosis",
      );
    case "bro-explicit": {
      const answer = typeof value.answer === "string" ? value.answer.toLowerCase() : "";
      const jargon = ["falsy", "sentinel", "writeback"];
      const preservesMeaning =
        answer.includes("cache") &&
        (answer.includes("zero") || /\b0\b/.test(answer)) &&
        ["again", "twice", "repeat", "recompute", "extra"].some((word) =>
          answer.includes(word),
        );
      return result(
        value.kind === "rewrite" &&
          answer.length > 0 &&
          answer.length <= 180 &&
          avoidsSkills(context, ["debug"]) &&
          preservesMeaning &&
          jargon.every((word) => !answer.includes(word)),
        "expected a short plain rewrite that preserves the repeated cache work",
      );
    }
    case "bro-near-miss":
      return result(
        value.kind === "status_update" &&
          typeof value.answer === "string" &&
          value.answer.length > 0 &&
          avoidsSkills(context, ["bro"]),
        "expected new prose rather than a rewrite of a previous message",
      );
    default:
      return result(false, `unknown behavior case: ${context.vars.case}`);
  }
};
