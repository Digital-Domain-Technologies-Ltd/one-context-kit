#!/usr/bin/env node
// check-context: holds every harness pointer to the one rules file.
//
// For each pointer listed in context.config.json it checks that:
//   1. the pointer exists where its harness reads it;
//   2. it names the rules file by a path that resolves, from the pointer's own
//      folder, to that file;
//   3. it stays short (maxPointerLines), because a pointer that grows is
//      collecting rules of its own, and two copies of a rule drift apart.
// It also checks that the rules file itself exists.
//
// Zero dependencies. Exit 0 when every check passes, 1 when any fails.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HELP = `check-context - check that every AI harness pointer resolves to the one rules file.

Usage: node scripts/check-context.mjs [--root <dir>] [--config <file>]

  --root    repository root to check (default: the current directory)
  --config  config file, relative to the root (default: context.config.json)

Exit 0 when every check passes, 1 when any fails.`;

/**
 * Check every pointer under `root` against `config`.
 * @returns {{ ok: boolean, msg: string }[]}
 */
export function checkContext(root, config) {
  const results = [];
  const canonical = path.resolve(root, config.canonical);
  results.push({
    ok: fs.existsSync(canonical),
    msg: `rules file ${config.canonical} exists`,
  });

  const name = path.basename(config.canonical).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const mention = new RegExp(`[\\w./-]*${name}`, 'g');
  const maxLines = config.maxPointerLines ?? 30;

  for (const { harness, path: rel } of config.pointers) {
    const abs = path.resolve(root, rel);
    if (!fs.existsSync(abs)) {
      results.push({ ok: false, msg: `${harness}: ${rel} is missing, so the harness reads nothing` });
      continue;
    }
    const text = fs.readFileSync(abs, 'utf8');
    const named = [...text.matchAll(mention)].map((m) => m[0]);
    const resolves = named.some((ref) => path.resolve(path.dirname(abs), ref) === canonical);
    results.push({
      ok: resolves,
      msg: `${harness}: ${rel} points at ${config.canonical}${resolves ? '' : ` (no path in it resolves there; found: ${named.join(', ') || 'none'})`}`,
    });
    const lines = text.split('\n').filter((l) => l.trim()).length;
    results.push({
      ok: lines <= maxLines,
      msg: `${harness}: ${rel} stays a pointer (${lines} non-blank lines, limit ${maxLines})`,
    });
  }
  return results;
}

function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(HELP);
    return 0;
  }
  const arg = (flag) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const root = path.resolve(arg('--root') ?? process.cwd());
  const configPath = path.resolve(root, arg('--config') ?? 'context.config.json');
  if (!fs.existsSync(configPath)) {
    console.error(`check-context: no config at ${configPath}`);
    return 1;
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const results = checkContext(root, config);
  for (const r of results) console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} ${r.msg}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `\ncheck-context: ${failed} failure(s)` : '\ncheck-context: clean');
  return failed ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
