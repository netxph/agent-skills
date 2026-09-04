---
description: Define, check, guard, or ratchet the project's measurable quality bar
argument-hint: "[check|guard|ratchet]"
---

Load and follow the unqualified `constraint-driven-development` skill.

Mode: `$ARGUMENTS`. With no argument, configure this repository's constraints.

## Configure

1. Inspect the stack, tests, lint, coverage, CI, and agent instructions. Report the detected setup in two lines; do not ask what can be read.
2. Ask at most four questions, one at a time, each with a best guess and usable default: dimensions beyond the floor; block versus warn; target numbers versus today's ratchet; and maximum task-end duration.
3. Write root `CONSTRAINTS.md` with the floor, every enforced number and reason, exact command, measured-only baselines, and owner/expiry for exceptions.
4. Install the de facto checker for each selected dimension and add reproducible `check:fast`, `check:task`, and `check:full` commands using the project's native task runner. Always run gitleaks with `--redact`. Drop browser-only checks if no runnable URL exists.
5. Place checks by cost and scope expensive checks to the diff.
6. Add the skill's instruction to the repository's applicable agent-guidance file so agents read `CONSTRAINTS.md` and never weaken it to pass.
7. Run the configured constraints and resolve invalid gates now.

## Subcommands

- `check`: run the current constraints against this branch and report evidence.
- `guard`: inspect the diff for lowered thresholds, skipped/deleted/weakened tests, suppressions, stubs, and unapproved exceptions.
- `ratchet`: measure current values and record them as floors that cannot regress.
