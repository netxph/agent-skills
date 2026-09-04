---
description: Implement the next planned task, or all approved tasks with auto
argument-hint: "[auto|all]"
---

Load and follow the unqualified `incremental-implementation` and `test-driven-development` skills.

Interpret `$ARGUMENTS`: `auto` or `all` selects autonomous mode; anything else selects one-task mode. Discover specs, plans, and task state only under `.pi/plans/`. The only plan and checklist are `.pi/plans/plan.md` and `.pi/plans/todo.md`; never discover or create a plan elsewhere.

## One-task mode

Require `.pi/plans/plan.md` and `.pi/plans/todo.md`; if either is absent, stop and direct the user to `/plan`. Take the next unchecked task in dependency order. Read its acceptance criteria and the applicable `.pi/plans/SPEC.md` or `.pi/plans/SPEC-<module>.md`, then run one complete slice: failing test (RED), minimum implementation (GREEN), focused tests, full regression suite, build/type/lint checks required by the repository, descriptive commit, and checklist update. Stop after that task.

## Autonomous mode

1. Require an approved spec in `.pi/plans/`: either `SPEC.md`, or `capability-map.md` plus the applicable module specs. Otherwise stop and direct the user to `/spec`.
2. Require a clean baseline apart from expected files under `.pi/plans/`; never absorb unrelated work.
3. If `.pi/plans/plan.md` or `.pi/plans/todo.md` is missing, load and follow the unqualified `planning-and-task-breakdown` skill to create only those files from the approved spec.
4. Present the full plan and wait for an unambiguous approval. This is the single normal gate. If this run generated the plan, commit both planning files as one preparatory commit after approval.
5. Execute every task in dependency order using the same RED → GREEN → regression → build loop. Stage explicit files only, make one rollback-friendly commit per task, and update `.pi/plans/todo.md`.
6. Stop for ambiguous requirements, failing verification without an obvious fix, or irreversible/high-risk changes. Load and follow the unqualified `debugging-and-error-recovery` or `doubt-driven-development` skill as appropriate.

If a compound feature is delegated across writers, each writer must use a separate isolated Git worktree, with exactly one writer per worktree. Keep dependent tasks sequential; the parent owns shared contracts, review, and integration.

Finish with tasks completed, tests added, commits made, and anything blocked or skipped.
