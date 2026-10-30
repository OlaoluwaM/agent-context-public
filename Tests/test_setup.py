import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parent.parent


class SetupTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='agent-context-setup-test-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'repo'
        self.target = Path(self.temp.name) / 'profile'
        (self.root / 'Scripts').mkdir(parents=True)
        shutil.copy2(ROOT / 'Scripts/agent-context-setup', self.root / 'Scripts/agent-context-setup')
        for folder, name in [('Debug', 'debug'), ('Handoff', 'handoff')]:
            path = self.root / 'Skills' / folder
            path.mkdir(parents=True)
            (path / 'SKILL.md').write_text(f'---\nname: {name}\ndescription: Example\n---\n')

    def run_setup(self, *args):
        return subprocess.run([sys.executable, str(self.root / 'Scripts/agent-context-setup'),
                               '--target-root', str(self.target), *args],
                              text=True, capture_output=True)

    def test_default_preview_does_not_write(self):
        result = self.run_setup()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('would create:', result.stdout)
        self.assertFalse(self.target.exists())

    def test_apply_is_idempotent_and_provider_scoped(self):
        for _ in range(2):
            result = self.run_setup('--apply', '--provider', 'codex')
            self.assertEqual(result.returncode, 0, result.stderr)
        link = self.target / '.codex/skills/debug'
        self.assertEqual(os.readlink(link), str(self.root / 'Skills/Debug'))
        self.assertFalse((self.target / '.claude').exists())
        self.assertFalse((self.target / '.codex/AGENTS.md').exists())
        self.assertIn('0 new links', result.stdout)

    def test_conflicting_file_blocks_all_writes(self):
        conflict = self.target / '.claude/skills/handoff'
        conflict.parent.mkdir(parents=True)
        conflict.write_text('existing user content')
        result = self.run_setup('--apply')
        self.assertEqual(result.returncode, 1)
        self.assertEqual(conflict.read_text(), 'existing user content')
        self.assertFalse((self.target / '.codex').exists())
        self.assertFalse((conflict.parent / 'debug').exists())

    def test_dangling_symlink_is_not_replaced(self):
        conflict = self.target / '.codex/skills/debug'
        conflict.parent.mkdir(parents=True)
        conflict.symlink_to(self.target / 'missing-private-checkout')
        result = self.run_setup('--apply')
        self.assertEqual(result.returncode, 1)
        self.assertTrue(conflict.is_symlink())
        self.assertFalse((self.target / '.claude').exists())

    def test_nondirectory_parent_blocks_writes(self):
        self.target.mkdir()
        (self.target / '.codex').write_text('existing file')
        result = self.run_setup('--apply')
        self.assertEqual(result.returncode, 1)
        self.assertFalse((self.target / '.claude').exists())

    def test_duplicate_or_invalid_names_block_writes(self):
        p = self.root / 'Skills/Handoff/SKILL.md'
        for name in ('debug', '../escape'):
            p.write_text(f'---\nname: {name}\ndescription: Example\n---\n')
            result = self.run_setup('--apply')
            self.assertEqual(result.returncode, 1)
            self.assertFalse(self.target.exists())


if __name__ == '__main__':
    unittest.main()
