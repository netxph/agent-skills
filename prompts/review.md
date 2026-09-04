---
description: Review current changes across correctness, readability, architecture, security, and performance
argument-hint: "[path, commit range, or review focus]"
---

Load and follow the unqualified `code-review-and-quality` skill. Load the unqualified `security-and-hardening` and `performance-optimization` skills for those review axes.

Review target:

$ARGUMENTS

Use the specified target, or the staged changes/recent commits when none is given. Inspect the applicable spec under `.pi/plans/`, repository instructions, source, tests, and actual diff.

Review five axes:

1. Correctness — spec compliance, edge cases, error paths, and test adequacy.
2. Readability — names, control flow, organization, and unnecessary complexity.
3. Architecture — existing patterns, boundaries, coupling, and abstraction level.
4. Security — validation, secrets, authentication/authorization, dependencies, and unsafe data handling.
5. Performance — unbounded work, N+1 access, hot paths, allocations, and regressions.

Report only evidence-backed findings, categorized as Critical, Important, or Suggestion. Every finding must include a precise `file:line`, impact, and smallest safe fix. Separate blockers from non-blocking advice and state explicitly when no issues are found. Do not edit files unless the user asks for fixes.
