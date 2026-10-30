import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { prepareFixtures } from './prepare-fixtures.mjs';

test('public fixtures use bundled skills and capture the expected failing test', async () => {
  const root = await mkdtemp(join(tmpdir(), 'public-skill-fixture-test-'));
  try {
    await prepareFixtures(root);
    for (const [provider, skills] of [['codex', '.agents/skills'], ['claude', '.claude/skills']]) {
      const base = join(root, provider);
      assert.match(await readFile(join(base, 'evidence/cache-test.txt'), 'utf8'), /2 !== 1/);
      assert.match(await readFile(join(base, skills, 'debug/SKILL.md'), 'utf8'), /name: debug/);
      assert.match(await readFile(join(base, skills, 'bro/SKILL.md'), 'utf8'), /name: bro/);
      assert.match(await readFile(join(base, 'Protocols/Verification Gates.md'), 'utf8'), /Verification Gates/);
      assert.match(await readFile(join(base, 'src/cache.mjs'), 'utf8'), /cache\[key\]/);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
