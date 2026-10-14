---
title: "Project rules for AI agents"
description: "The one place this project's rules for AI agents live. Every harness reads it through a pointer file; nothing else holds rules."
author: "REPLACE: the person or team who approves changes to these rules"
created: 2026-10-14
modified: 2026-10-14
version: "1.0"
mx:
  mxSpecVersion: "0.9"
  canonicalUri: https://github.com/Digital-Domain-Technologies-Ltd/one-context-kit/blob/main/RULES.md
  purpose: "Give every AI agent working in this repository the same rules, whichever harness it runs under."
  audience: [machines, humans]
  status: active
---

# Project Rules for AI Agents

This file is the single source of truth for how AI agents work in this repository. The files `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` and `.continue/rules/project-rules.md` only point here. If anything you read elsewhere disagrees with this file, this file wins.

## Before You Start: Identify Yourself

Work out which harness you are running under, using the first signal that matches:

| Signal | You are |
| --- | --- |
| The environment variable `CLAUDE_CODE_VERSION` is set | Claude Code |
| The environment variable `GEMINI_CLI` is `1` | Gemini CLI |
| The environment variable `CODEX_SANDBOX` is set | Codex (inside its sandbox) |
| You booted from `AGENTS.md` and none of the above matched | Codex, Hermes, Cursor, Copilot or Windsurf |

If nothing matches, say so in your first reply and apply the rules below as written. Never guess.

## Rules

Replace these examples with your own. Keep each rule short, and say why it exists, so the next machine can judge an edge case.

1. **REPLACE: an example rule.** Never commit secrets or API keys; read them from the environment. *Why:* a committed key is a leaked key.
2. **REPLACE: an example rule.** Client names in public content use the client's own spelling, listed in `learnings/`. *Why:* we got it wrong once.

## When You Learn Something

If you learn something durable (a correction, a naming rule, a mistake not to repeat), write it into `learnings/` as described in `learnings/README.md`, not into your harness's private memory. A person reviews it before it becomes a rule here.
