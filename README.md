# One Context Kit

If you run more than one AI harness, each one builds up its own idea of how your work is done, and those ideas drift apart. This kit is the smallest working version of the fix we use. One rules file belongs to no harness. Each tool gets a short pointer in the place it already reads, and a check fails the moment one stops pointing.

## What's in It

| File | What it does |
| --- | --- |
| `RULES.md` | The only place your rules live. Edit this one. |
| `AGENTS.md` | Pointer for Codex, Hermes Agent, Cursor, GitHub Copilot and Windsurf, which all read it. |
| `CLAUDE.md` | Pointer for Claude Code. |
| `GEMINI.md` | Pointer for Gemini CLI. |
| `.continue/rules/project-rules.md` | Pointer for Continue. |
| `learnings/` | Where an agent writes something it learned, for a person to review. |
| `scripts/check-context.mjs` | Fails when a pointer is missing, doesn't resolve to `RULES.md`, or grows rules of its own. |
| `context.config.json` | The list of pointers the check holds. Add a line when you add a harness. |

Each pointer holds no rules, only a line sending the agent to `RULES.md`. That matters more than it looks: several of these tools read more than one of the files, so a rule written into two of them becomes two rules, and when they disagree you can't tell which one the agent will follow.

## Using It

1. Copy the files into your repository, or start a new one from this.
2. Replace the example rules in `RULES.md` with yours, and name an owner.
3. Run the check: `node scripts/check-context.mjs`. It needs Node 18 or later and nothing else.
4. Keep the check in CI. The included GitHub workflow runs it on every push.

Adding a harness: find where it reads project instructions in its own documentation, put a short pointer there, and add the path to `context.config.json`. If the harness already reads `AGENTS.md`, you may not need a new file at all.

Hosted tools that can't read a repository get a pasted copy of `RULES.md` in their instructions box. Treat that copy as generated: regenerate it from `RULES.md` and never edit it in place.

## What It Doesn't Do

It doesn't write learnings back for you. An agent can write into `learnings/` if you ask it to, but no harness does that on its own here, and a person decides what becomes a rule. It also can't verify a hosted tool's pasted copy, because the script only sees the repository.

## Where Each Harness Reads

The pointer locations come from each vendor's documentation: [Codex](https://developers.openai.com/codex/guides/agents-md), [Hermes Agent](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files), [Cursor](https://cursor.com/docs/context/rules), [GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions), [Windsurf](https://docs.windsurf.com/windsurf/cascade/memories), [Continue](https://docs.continue.dev/customize/deep-dives/rules) and [Gemini CLI](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md). Tools change where they look, so check these when a pointer stops working.

## Licence

MIT. From [CogNovaMX](https://mx.allabout.network), where we run this pattern across our own repositories.
