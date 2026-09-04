# Pi Compatibility Tasks

- [x] Add `package.json` and `scripts/validate-pi-package.js`.
  - Acceptance: Pi resources are explicitly declared and validation checks every declared resource.
  - Verify: `node scripts/validate-pi-package.js`.
- [x] Add nine Pi-native files under `prompts/`.
  - Acceptance: lifecycle commands load unqualified skills and spec-driven commands use `.pi/plans/`.
  - Verify: package validator passes.
- [x] Add the Pi orchestration skill, task-fit persona, and `docs/pi-setup.md`.
  - Acceptance: delegation selects an appropriate persona, parallelizes independent work, and isolates compound feature writers in worktrees.
  - Verify: package validator and manual frontmatter inspection pass.
- [x] Run complete verification.
  - Acceptance: existing validation and isolated `pi install .` pass; only new files appear in the diff.
  - Verify: `npm test` and isolated installation smoke test.
