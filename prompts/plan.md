---
description: Turn an approved Pi specification into an ordered, verifiable implementation plan
argument-hint: "[module-id or planning focus]"
---

Load and follow the unqualified `planning-and-task-breakdown` skill. The parent session owns plan decisions and approval.

Planning focus:

$ARGUMENTS

Read only specifications under `.pi/plans/`: use `.pi/plans/SPEC.md` for a single capability, or `.pi/plans/capability-map.md` and the selected `.pi/plans/SPEC-<module>.md` for compound work. If no applicable approved specification exists there, stop and direct the user to `/spec`; do not infer one from other files.

Stay read-only with respect to product code. Inspect relevant source, tests, and project instructions, then:

1. Map dependencies and risks.
2. Slice work vertically into small tasks, normally no more than five files each.
3. Give every task explicit acceptance criteria, verification commands, dependencies, and likely files.
4. Add checkpoints every two or three tasks and identify safe parallelism versus required sequencing.
5. Present the plan for human review.

Save the implementation plan only to `.pi/plans/plan.md` and its checklist only to `.pi/plans/todo.md`. If either contains unchecked work for a different effort, stop and ask before overwriting it. Do not create planning artifacts elsewhere.
