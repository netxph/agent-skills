---
description: Start spec-driven development and save Pi planning artifacts under .pi/plans
argument-hint: "<feature or project idea>"
---

Load and follow the unqualified `spec-driven-development` skill. The parent session owns clarification, scope decisions, and approval gates.

Use this request as the starting point:

$ARGUMENTS

Before writing code, surface assumptions and clarify the objective, target users, acceptance criteria, stack constraints, testing strategy, and Always/Ask first/Never boundaries. Inspect the repository before asking anything the code can answer.

For one capability, write the reviewed specification to `.pi/plans/SPEC.md`. Cover objective, commands, project structure, code style, testing strategy, boundaries, success criteria, and open questions.

If the request contains several independently testable capabilities:

1. Propose stable kebab-case module ids, dependency direction, and build order.
2. Save the approved map as `.pi/plans/capability-map.md`.
3. After map approval, write each module specification in dependency order as `.pi/plans/SPEC-<module>.md`.
4. Keep interfaces in the provider module's specification.

Do not write specification or capability-map artifacts anywhere except `.pi/plans/`. Wait for explicit human approval at each skill gate; do not implement code.
