import { spawnSync } from "node:child_process";
import { constants } from "node:fs";
import { access, mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { prepareFixtures } from "./prepare-fixtures.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const evalRoot = resolve(scriptDir, "..");
const fixtureRoot = await mkdtemp(join(tmpdir(), "agent-context-skill-evals-"));
const promptfoo = join(evalRoot, "node_modules", ".bin", "promptfoo");
const action = process.argv[2];
const workspaceBin = join(evalRoot, "node_modules", ".bin");

const commands = {
  validate: [
    "validate",
    "-c",
    "promptfooconfig.codex.yaml",
    "-c",
    "promptfooconfig.claude.yaml",
  ],
  codex: [
    "eval",
    "-c",
    "promptfooconfig.codex.yaml",
    "--no-cache",
    "--max-concurrency",
    "1",
    "-o",
    ".work/results/codex.json",
  ],
  claude: [
    "eval",
    "-c",
    "promptfooconfig.claude.yaml",
    "--no-cache",
    "--max-concurrency",
    "1",
    "-o",
    ".work/results/claude.json",
  ],
  "codex-smoke": [
    "eval",
    "-c",
    "promptfooconfig.codex.yaml",
    "--no-cache",
    "--max-concurrency",
    "1",
    "--filter-first-n",
    "1",
    "-o",
    ".work/results/codex-smoke.json",
  ],
};

const timeouts = {
  validate: 30000,
  codex: 300000,
  claude: 300000,
  "codex-smoke": 90000,
};

if (!commands[action]) {
  throw new Error(`unknown eval action: ${action || "(missing)"}`);
}

const codexHome = process.env.AGENT_CONTEXT_EVAL_CODEX_HOME || join(fixtureRoot, "codex-home");

async function resolveHostExecutable(name, override) {
  const candidates = override
    ? [resolve(override)]
    : (process.env.PATH || "")
        .split(delimiter)
        .filter(Boolean)
        .filter((entry) => resolve(entry) !== workspaceBin)
        .map((entry) => join(resolve(entry), name));

  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK);
      if ((await stat(candidate)).isFile()) {
        return candidate;
      }
    } catch {
      // Continue to the next PATH entry.
    }
  }

  const source = override ? `override ${override}` : "host PATH outside node_modules/.bin";
  throw new Error(`could not find executable ${name} from ${source}`);
}

async function hasCodexAuthentication() {
  if (process.env.OPENAI_API_KEY || process.env.CODEX_API_KEY) {
    return true;
  }
  try {
    await access(join(codexHome, "auth.json"));
    return true;
  } catch {
    return false;
  }
}

try {
  await prepareFixtures(fixtureRoot);
  // Validation checks configuration only; it must not require authenticated CLIs.
  // A live run resolves only its selected provider and requires an explicit model.
  const modelVariable = action.startsWith("codex")
    ? "SKILL_EVAL_CODEX_MODEL"
    : "SKILL_EVAL_CLAUDE_MODEL";
  if (action !== "validate" && !process.env[modelVariable]) {
    throw new Error(`Set ${modelVariable} to a model available to your account`);
  }
  const codexExecutable = action.startsWith("codex")
    ? await resolveHostExecutable("codex", process.env.AGENT_CONTEXT_EVAL_CODEX_BIN)
    : "codex";
  const claudeExecutable = action === "claude"
    ? await resolveHostExecutable("claude", process.env.AGENT_CONTEXT_EVAL_CLAUDE_BIN)
    : "claude";
  if (action.startsWith("codex") && !(await hasCodexAuthentication())) {
    console.error(
      "Codex eval needs OPENAI_API_KEY, CODEX_API_KEY, or an isolated " +
        "AGENT_CONTEXT_EVAL_CODEX_HOME containing auth.json",
    );
    process.exitCode = 2;
  } else {
    const run = spawnSync(promptfoo, commands[action], {
      cwd: evalRoot,
      env: {
        ...process.env,
        PROMPTFOO_CONFIG_DIR: join(evalRoot, ".promptfoo"),
        PROMPTFOO_LOG_DIR: join(evalRoot, ".promptfoo", "logs"),
        SKILL_EVAL_ROOT: fixtureRoot,
        SKILL_EVAL_CODEX_HOME: codexHome,
        SKILL_EVAL_CODEX_MODEL: process.env.SKILL_EVAL_CODEX_MODEL || "configure-before-running",
        SKILL_EVAL_CLAUDE_MODEL: process.env.SKILL_EVAL_CLAUDE_MODEL || "configure-before-running",
        SKILL_EVAL_CODEX_BIN: codexExecutable,
        SKILL_EVAL_CLAUDE_BIN: claudeExecutable,
      },
      stdio: "inherit",
      timeout: timeouts[action],
      killSignal: "SIGTERM",
    });
    if (run.error) {
      throw run.error;
    }
    process.exitCode = run.status ?? 1;
  }
} finally {
  if (process.env.KEEP_SKILL_EVAL_FIXTURES === "1") {
    console.error(`Kept disposable fixtures in ${fixtureRoot}`);
  } else {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
}
