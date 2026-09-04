# Spec: Pi Package Compatibility

## Objective

Make this fork installable with `pi install .` while preserving upstream files unchanged. Pi users receive the repository's skills, Pi-native lifecycle prompts, compatible personas, and optional `pi-subagents` orchestration.

## Tech Stack

- Pi package manifest (`package.json`)
- Markdown skills, prompts, personas, and documentation
- Node.js validation using only built-in modules

## Commands

- Install: `pi install .`
- Validate: `npm test`
- Inspect: `pi list`

## Project Structure

- `skills/` — existing upstream skills plus additive Pi orchestration skill
- `agents/` — existing personas plus an additive general specialist persona
- `prompts/` — Pi-native lifecycle commands
- `.pi/plans/` — all specification and planning artifacts
- `scripts/` — existing validation scripts plus an additive Pi package validator
- `docs/` — existing integration guides plus an additive Pi setup guide

## Code Style

Use declarative JSON, concise Markdown, and dependency-free Node.js scripts consistent with the repository's existing validation scripts.

## Testing Strategy

Validate the manifest, declared resources, required frontmatter, Pi-specific plan paths, and installation with an isolated temporary home directory. Existing validation scripts must continue to pass.

## Boundaries

- Always: make additive changes only; preserve existing files; keep the parent responsible for orchestration decisions; use one writer per checkout or worktree.
- Ask first: adding runtime dependencies, changing upstream files, publishing, or merging.
- Never: overwrite existing Claude/Gemini/Antigravity/Codex integrations; run concurrent writers in one checkout; store spec-driven artifacts outside `.pi/plans/` in Pi workflows.

## Success Criteria

- `pi install .` succeeds from the repository root.
- Pi discovers all existing skills and the Pi lifecycle prompt templates.
- Pi-native `/spec`, `/plan`, and `/build` consistently use `.pi/plans/`.
- `pi-subagents`, when installed, discovers task-appropriate package personas and can orchestrate independent lanes in parallel.
- Compound feature implementation uses isolated Git worktrees with one writer per worktree.
- Operation remains usable without `pi-subagents` through direct parent execution.
- No pre-existing tracked file is modified.

## Open Questions

None.
