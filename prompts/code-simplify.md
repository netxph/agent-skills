---
description: Simplify changed code without changing behavior
argument-hint: "[path, commit range, or scope]"
---

Load and follow the unqualified `code-simplification` skill, then use the unqualified `code-review-and-quality` skill for the final check.

Simplification scope:

$ARGUMENTS

Use the specified scope, or recent changes when none is given. Read the repository's agent instructions and conventions. Understand purpose, callers, edge cases, and test coverage before editing.

Look for avoidable nesting, long mixed-responsibility functions, nested ternaries, vague names, duplication, dead code, and abstractions that do not earn their complexity. Apply small behavior-preserving changes and run focused tests after each. If a change breaks a test, revert or reconsider it rather than changing expected behavior.

Finish by running the relevant full test suite and build/type/lint checks, inspecting the diff for accidental scope expansion, and reporting what became simpler and how behavior was verified.
