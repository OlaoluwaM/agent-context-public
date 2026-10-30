import { spawnSync } from "node:child_process";
import { cp, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const evalRoot = resolve(scriptDir, "..");
const repositoryRoot = resolve(evalRoot, "..");

const skills = [
  ["Debug", "debug"],
  ["bro", "bro"],
];

async function prepareProvider(fixtureRoot, provider, skillRoot) {
  const target = join(fixtureRoot, provider);
  await mkdir(join(target, skillRoot), { recursive: true });
  await cp(join(evalRoot, "fixtures", "cache-bug"), target, { recursive: true });
  await writeFile(
    join(target, "run-test.mjs"),
    `#!${process.execPath}\nimport "./test/cache.test.mjs";\n`,
    { mode: 0o755 },
  );

  const test = spawnSync(join(target, "run-test.mjs"), [], {
    cwd: target,
    encoding: "utf8",
  });
  if (test.status !== 1 || !`${test.stdout}${test.stderr}`.includes("2 !== 1")) {
    throw new Error("cache fixture did not fail with the expected 2 !== 1 signal");
  }
  await mkdir(join(target, "evidence"), { recursive: true });
  await writeFile(
    join(target, "evidence", "cache-test.txt"),
    `${test.stdout}${test.stderr}`,
  );

  for (const [sourceName, targetName] of skills) {
    await cp(
      join(repositoryRoot, "Skills", sourceName),
      join(target, skillRoot, targetName),
      { recursive: true },
    );
  }

  await mkdir(join(target, "Protocols"), { recursive: true });
  await cp(
    join(repositoryRoot, "Protocols", "Verification Gates.md"),
    join(target, "Protocols", "Verification Gates.md"),
  );
  await cp(
    join(repositoryRoot, "Protocols", "Factual Verification.md"),
    join(target, "Protocols", "Factual Verification.md"),
  );
}

export async function prepareFixtures(fixtureRoot) {
  await prepareProvider(fixtureRoot, "codex", ".agents/skills");
  await prepareProvider(fixtureRoot, "claude", ".claude/skills");
  await mkdir(join(fixtureRoot, "codex-home"), { recursive: true });
  await mkdir(join(evalRoot, ".work", "results"), { recursive: true });
}
