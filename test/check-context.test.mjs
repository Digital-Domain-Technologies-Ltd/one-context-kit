import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkContext } from '../scripts/check-context.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fixture(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'one-context-'));
  for (const [rel, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), body);
  }
  return dir;
}

const config = {
  canonical: 'RULES.md',
  maxPointerLines: 5,
  pointers: [
    { harness: 'Codex', path: 'AGENTS.md' },
    { harness: 'Continue', path: '.continue/rules/p.md' },
  ],
};

const failures = (results) => results.filter((r) => !r.ok).map((r) => r.msg);

test('the kit as shipped passes its own check', () => {
  const shipped = JSON.parse(fs.readFileSync(path.join(KIT, 'context.config.json'), 'utf8'));
  assert.deepEqual(failures(checkContext(KIT, shipped)), []);
});

test('correct pointers pass', () => {
  const dir = fixture({
    'RULES.md': '# Rules\n',
    'AGENTS.md': 'Read `RULES.md`.\n',
    '.continue/rules/p.md': 'Read `../../RULES.md`.\n',
  });
  assert.deepEqual(failures(checkContext(dir, config)), []);
});

test('a pointer whose path does not resolve from its own folder fails', () => {
  const dir = fixture({
    'RULES.md': '# Rules\n',
    'AGENTS.md': 'Read `RULES.md`.\n',
    '.continue/rules/p.md': 'Read `../RULES.md`.\n',
  });
  const f = failures(checkContext(dir, config));
  assert.equal(f.length, 1);
  assert.match(f[0], /Continue/);
});

test('a missing pointer fails', () => {
  const dir = fixture({ 'RULES.md': '# Rules\n', 'AGENTS.md': 'Read `RULES.md`.\n' });
  assert.match(failures(checkContext(dir, config))[0], /missing/);
});

test('a pointer that grows rules of its own fails', () => {
  const dir = fixture({
    'RULES.md': '# Rules\n',
    'AGENTS.md': 'Read `RULES.md`.\n- rule one\n- rule two\n- rule three\n- rule four\n- rule five\n',
    '.continue/rules/p.md': 'Read `../../RULES.md`.\n',
  });
  assert.match(failures(checkContext(dir, config))[0], /stays a pointer/);
});

test('a missing rules file fails', () => {
  const dir = fixture({ 'AGENTS.md': 'Read `RULES.md`.\n', '.continue/rules/p.md': 'Read `../../RULES.md`.\n' });
  assert.ok(failures(checkContext(dir, config)).some((m) => /rules file RULES\.md exists/.test(m)));
});
