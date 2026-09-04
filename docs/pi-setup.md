# Pi Setup

This guide installs Agent Skills as a Pi package. The package adds skills, prompt templates, and agent persona definitions without replacing the repository's integrations for other coding agents.

## Requirements

- Pi installed and available as `pi`
- Git when using worktree-based delegated implementation
- Optional: [`pi-subagents`](https://www.npmjs.com/package/pi-subagents) for delegated persona execution and managed worktrees

The package remains usable without `pi-subagents`: Pi can load the skills and prompts, and the parent agent performs work directly.

## Install

From this repository's root, run:

```bash
pi install .
```

This records the local package source in your user Pi settings. To install it only for the current project, use:

```bash
pi install . --local
```

Check configured packages with:

```bash
pi list
```

Restart Pi after installation so package resources are discovered in a fresh session. When Pi asks whether to trust project-local resources, inspect the checkout and approve it only if appropriate.

## Prompt templates

The package provides these Pi prompt templates:

| Prompt | Purpose |
|---|---|
| `/spec` | Clarify a change and write a structured specification before implementation. |
| `/plan` | Turn the approved specification into dependency-ordered, verifiable tasks. |
| `/build` | Implement the next planned slice; `/build auto` executes an approved plan in dependency order. |
| `/test` | Apply the repository's testing workflow and report evidence. |
| `/review` | Review a change for concrete correctness and quality findings. |
| `/ship` | Run release-readiness checks and produce a go/no-go decision. |
| `/constraints` | Establish, check, guard, or ratchet the project's quality constraints. |
| `/code-simplify` | Simplify the requested or recently changed code without changing behavior. |
| `/webperf` | Audit web performance and Core Web Vitals. |

Pass additional instructions after a prompt name where applicable. For example:

```text
/spec Add resumable uploads to the media service
/build auto
/constraints check
```

Prompt templates select the relevant Agent Skills workflows. They do not bypass project instructions, approval boundaries, or validation requirements.

## Pi planning files

Pi-native specification and planning prompts keep their durable artifacts under `.pi/plans/`:

```text
.pi/
└── plans/
    ├── SPEC.md             # approved objective, constraints, and success criteria
    ├── capability-map.md   # optional modules, dependencies, and build order
    ├── plan.md             # implementation phases and task definitions
    └── todo.md             # concise task status and verification checklist
```

- `/spec` creates or updates `.pi/plans/SPEC.md` and uses `capability-map.md` when independently testable modules need an explicit dependency order.
- `/plan` reads the spec and writes `.pi/plans/plan.md` plus `.pi/plans/todo.md`.
- `/build` reads those artifacts and updates task status as implementation progresses.

Do not silently overwrite an unrelated plan with unfinished tasks. Review and commit planning artifacts according to the target repository's policy.

## Optional pi-subagents integration

Install pi-subagents separately if you want task-fit delegation:

```bash
pi install npm:pi-subagents
```

It is optional, not a runtime dependency of Agent Skills. When it is absent, when the `subagent` tool is unavailable, or when delegation would not materially improve evidence, isolation, review quality, or elapsed time, the parent agent follows the selected skill directly.

When pi-subagents is available, the `pi-agent-orchestration` skill governs delegation. It requires capability discovery before execution:

```text
subagent({ action: "list", capabilities: true })
```

The parent selects only executable, non-disabled, non-restricted agents. External CLI agents are eligible only when their capability row reports `runner.available: true`; launch preflight may still fail because passive discovery does not verify authentication or compatibility.

The parent then:

- chooses a persona and relevant skill that fit each job;
- sends each child a cold-start packet with role, objective, repository/cwd/ref, authority, context, skill, acceptance criteria, validation, output, and stop conditions;
- keeps dependent stages sequential and parallelizes only independent lanes;
- uses exactly one top-level asynchronous `workflowScript` for a coordinated job;
- retains authority for decisions, finding disposition, integration, publication, and final acceptance;
- falls back to direct work when no eligible agent fits or delegation adds no value.

Agent and model routing remain deployment policy. The package does not hard-code models.

## Persona discovery

The package's persona files live in `agents/`. With pi-subagents loaded, package personas appear in the capability listing alongside built-in, user, and project agents. `agent-skills-specialist` is a flexible persona for a single bounded analysis, implementation, validation, or documentation assignment.

The specialist accepts a dispatch only when it explicitly includes:

- role and objective;
- repository/cwd/ref and authority boundary;
- relevant skill;
- acceptance criteria and validation;
- required output;
- stop and escalation conditions.

It does not orchestrate other personas. User or project definitions and settings may override package agent behavior according to pi-subagents precedence. Always route from the live capability listing rather than assuming a persona is enabled.

## Worktrees and writer safety

For compound features with multiple independent mutation lanes, use pi-subagents-managed Git worktrees. A coordinated workflow sets `worktree: true` on each writing lane and uses a clean base ref. pi-subagents creates isolated worktrees, captures lane handoffs and patches, and manages their lifecycle.

Follow these safety rules:

1. Use one writer per cwd or worktree.
2. Never run concurrent writers in the source checkout or the same worktree.
3. Give each mutation lane disjoint file or contract ownership.
4. Keep dependent mutations sequential even if worktrees are available.
5. Require a fresh-context, read-only validation/review pass against each candidate.
6. Let the parent inspect and integrate approved patches or commits.
7. Keep worktrees until handoffs are durable and no active run owns them; then clean them up through the owning workflow.

A simple task should use one writer in the current checkout. Worktree overhead is justified only when mutation lanes are truly independent or isolation materially reduces risk.

## Remove or uninstall

Use the same source string and scope used during installation.

For the user-level local install shown above:

```bash
pi remove .
```

`uninstall` is an alias:

```bash
pi uninstall .
```

For a project-local install:

```bash
pi remove . --local
```

If you installed from another source, such as a Git URL, pass that exact source instead of `.`. Removing Agent Skills does not remove the optional pi-subagents package. Remove it separately if desired:

```bash
pi remove npm:pi-subagents
```

Run `pi list` afterward and restart Pi to confirm the resources are no longer loaded.

## Troubleshooting

- **Prompts or skills are missing:** run `pi list`, confirm the recorded source points to this checkout, and restart Pi.
- **Persona is missing:** confirm pi-subagents is installed, then run the capabilities listing; disabled, shadowed, or restricted agents may not be executable.
- **External CLI agent will not start:** require `runner.available: true`, then check that runner's authentication and launch prerequisites.
- **Worktree launch fails:** ensure the repository is Git-backed, the source checkout is clean, the base ref resolves, and no existing run owns the target lane.
- **Delegation is unavailable:** continue in the parent. Skills and prompt templates do not require pi-subagents.
