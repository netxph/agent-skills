# Implementation Plan: Pi Package Compatibility

## Overview

Add a Pi package layer without modifying upstream files. Independent implementation lanes use isolated worktrees and produce mergeable commits.

## Architecture Decisions

- Keep upstream integrations untouched; add `package.json`, `prompts/`, one Pi orchestration skill/persona, validation, and documentation.
- Treat `pi-subagents` as optional: use it when available and fall back to direct execution.
- Store every Pi spec and planning artifact under `.pi/plans/`.

## Task List

### Phase 1: Package
- [x] Task 1: Add the Pi manifest and dependency-free resource validator.

### Phase 2: Commands
- [x] Task 2: Add Pi-native lifecycle prompt templates using `.pi/plans/`.

### Phase 3: Orchestration and Documentation
- [x] Task 3: Add the task-fit specialist persona, orchestration skill, and Pi setup guide.

### Checkpoint: Complete
- [x] New package validation passes.
- [x] Existing repository validation passes.
- [x] `pi install .` succeeds with an isolated home.
- [x] `git diff` contains additive files only.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Pi prompt syntax diverges from Claude commands | Medium | Use Pi's documented Markdown template syntax and `$ARGUMENTS`. |
| `pi-subagents` is absent | Low | Document optional integration and direct parent fallback. |
| Parallel writers conflict | Medium | Assign disjoint files and isolated worktrees. |

## Open Questions

None.
