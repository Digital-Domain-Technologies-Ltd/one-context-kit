# Learnings

When an agent learns something worth keeping, it writes one file here instead of saving it to its harness's private memory. Every harness reads the same folder, so the learning reaches all of them on the next pull.

Name the file after the learning, for example `client-name-spelling.md`, and start it like this:

```markdown
---
title: "Acme is spelled ACME in public content"
learnedBy: "the harness and person involved, for example Codex with Sam"
date: 2026-01-15
status: proposed
---

What happened, what the rule should be, and why.
```

A person reviews each proposed learning. If it holds, they move the rule into `RULES.md` and set `status: adopted`; if not, they set `status: rejected` and say why. Keep rejected learnings: they stop the same mistake being proposed again.
