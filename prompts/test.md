---
description: Run test-driven development for a feature or a Prove-It regression test for a bug
argument-hint: "<behavior or bug to test>"
---

Load and follow the unqualified `test-driven-development` skill.

Target behavior or bug:

$ARGUMENTS

First discover the repository's stack, test conventions, focused command, and full-suite command.

For new behavior: write a test expressing the expected outcome, run it and confirm RED for the intended reason, implement only enough for GREEN, then refactor with tests green.

For a bug, use the Prove-It pattern: add a regression test that reproduces it, run and capture the expected failure, implement the fix, show that the same test passes, then run the full suite for regressions. Never weaken or skip a test to get green.

For browser-facing behavior, also load and follow the unqualified `browser-testing-with-devtools` skill and use an available browser/DevTools integration for runtime verification. Report tests added or changed, RED/GREEN evidence, full-suite results, and any untested risk.
