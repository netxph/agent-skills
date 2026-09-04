---
name: pi-agent-orchestration
description: Coordinates task-fit Pi subagents while preserving parent authority and safe workspace ownership. Use when a task has independent research, implementation, validation, or review lanes that materially benefit from delegated execution.
---

# Pi Agent Orchestration

## Overview

Delegate only when a focused child improves evidence, isolation, or review quality. The parent remains responsible for scope, routing, decisions, synthesis, acceptance, Git integration, and the final response.

## When to Use

Use this skill when work has one or more of these properties:

- independent research or review angles can run concurrently;
- a compound feature has separable mutation lanes that need isolated worktrees;
- a fresh-context specialist can validate an implementation more reliably;
- a long-running, bounded task can execute asynchronously without surrendering parent control.

Do not delegate a tiny, tightly coupled, or context-sensitive task when the parent can complete it more safely and cheaply. If `pi-subagents` is absent, its tool is unavailable, or delegation adds no material value, work directly in the parent.

## Process

### 1. Discover capabilities before execution

Before **any** delegated execution, call:

```text
subagent({ action: "list", capabilities: true })
```

Treat this result as the routing source of truth for the current session.

- Select only agents reported as executable and not disabled or restricted by the current capability ceiling.
- For an external CLI agent, require `runner.available: true`. Passive availability does not prove authentication or launch success, so preserve a direct-parent fallback for preflight or launch failure.
- Match the agent's persona, tools, runner capabilities, and available skills to the job. Do not choose an agent merely because its name sounds plausible.
- Select and pass the relevant discovered skill for each job when one fits. Do not force a skill onto an unrelated task.
- Never hard-code a model. Model and thinking choices belong to user or project profiles and runtime configuration.
- If no eligible task-fit agent exists, keep the work in the parent.

### 2. Keep or delegate the work deliberately

State why delegation is useful before launching it. Valid reasons include isolated execution, independent evidence, a specialized perspective, or meaningful wall-clock savings.

Keep these responsibilities in the parent:

- interpret user intent and authority;
- approve scope and architecture decisions;
- define lane boundaries and resolve overlaps;
- accept or reject reviewer findings;
- integrate commits or patches and publish results.

A child receives a bounded assignment, not ownership of the overall outcome. Stop and return control to the parent when a new product, architecture, security, or scope decision is required.

### 3. Build the dependency and ownership plan

Create a lane board before coordinated work:

```text
Lane | agent/persona | skill | cwd/ref | authority | claimed files or contract | dependencies | validation | output | stop condition
```

Apply these rules:

1. Parallelize only lanes with no ordering dependency and no shared mutable state.
2. Keep dependent work sequential; a consumer starts only after its prerequisite output has been checked.
3. Allow only one writer in a given cwd or worktree at a time.
4. Read-only agents may share a checkout only when their commands cannot mutate source, generate files, or change repository state.
5. Do not split a single source seam or decision across competing writers.

For coordinated work, issue **exactly one top-level `subagent` call containing one `workflowScript`, with `async: true`**. Put all coordinated sequencing and fanout inside that script:

- use `runs.all(...)` only for independent lanes;
- use awaited `runs.run(...)` calls for dependent stages;
- do not launch sibling top-level workflows for stages of the same coordinated job;
- children do not spawn or orchestrate other children.

For one bounded handoff that is not coordinated work, a direct single-child call is sufficient after capability discovery.

### 4. Send cold-start-complete packets

Every child task must stand alone. Include all of the following:

- **Role:** the explicit perspective or execution role to adopt.
- **Objective:** one concrete outcome.
- **Repository:** exact repository, cwd, and base ref or commit.
- **Authority:** allowed actions, edit boundary, and prohibited files or decisions.
- **Skill:** the relevant skill to apply, or an explicit statement that none fits.
- **Context:** relevant files, contracts, prior evidence, constraints, and dependency outputs.
- **Acceptance criteria:** observable conditions for success.
- **Validation:** exact checks to run or evidence to inspect.
- **Output:** required report, patch, commit, or artifact shape and destination.
- **Stop conditions:** when to stop, avoid edits, or escalate to the parent.

Do not rely on parent conversation history, an issue number, or a broad file glob as the packet.

### 5. Isolate compound feature writers

For compound feature work with multiple mutation lanes, use pi-subagents-managed Git worktrees by setting `worktree: true` on each writing workflow item and selecting an explicit clean `baseRef` when needed.

- Give each mutation lane a distinct managed worktree and one writer.
- Keep lane claims disjoint and include the exact worktree/cwd in its packet.
- Never run concurrent writers in the source checkout or the same managed worktree.
- Preserve each lane's patch, commit, handoff manifest, validation evidence, and worktree ownership until the parent has reviewed the handoff.
- The parent, not a child, decides whether and how to integrate lane output.
- Keep dependent mutations serial in one ownership lane, or integrate an approved prerequisite before starting its dependent lane.

Use a single writer in the existing checkout when mutation cannot be separated safely. Worktrees are isolation, not permission to manufacture parallelism.

### 6. Require fresh read-only validation and review

Every implementation candidate must receive validation or review from a fresh-context agent that did not author the change.

The validation/review packet must:

- grant read-only authority and prohibit source edits, generated files, commits, and repository-state changes;
- identify the exact worktree, commit, diff, patch, or handoff manifest to inspect;
- select a task-fit reviewer persona and relevant review or test skill;
- require direct inspection and reproducible evidence with file and line references when applicable;
- return pass/fail, findings by severity, commands and results, residual risks, and a recommendation.

The parent dispositions every finding. Accepted fixes return to the sole writer for that cwd/worktree, after which the affected validation/review gate runs again in fresh context. A child receipt or clean review is evidence, not final acceptance.

### 7. Close the workflow in the parent

Before reporting completion, the parent must:

1. verify every lane is complete or explicitly blocked;
2. inspect changed files and direct validation evidence;
3. confirm no cwd/worktree had concurrent writers;
4. confirm every mutation lane received fresh read-only validation/review;
5. integrate only approved output;
6. report residual risks and clean up managed worktrees only after their handoffs are durable and no run owns them.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I know which agent is installed." | Runtime availability and capability ceilings change. Run the required capability listing first. |
| "More agents means a better answer." | Unnecessary commissions add cost, coordination risk, and duplicated work. Delegate only for material value. |
| "These writers probably will not touch the same files." | Probability is not ownership. Use one writer per cwd/worktree and explicit claims. |
| "Everything is faster in parallel." | Dependent stages run with stale assumptions when parallelized. Keep them sequential. |
| "The author already ran tests." | Author validation is not independent review. Require a fresh read-only agent. |
| "A strong child can decide the architecture." | The parent and user retain decision authority; children stop at unapproved choices. |

## Red Flags

- Delegated execution occurred before the capability listing.
- A disabled, restricted, non-executable, or unavailable external runner was selected.
- A generic agent was selected without matching persona, tools, and skill to the task.
- Coordinated work uses multiple top-level calls or a synchronous `workflowScript`.
- Dependent lanes are inside `runs.all(...)`.
- Multiple writers share a checkout or worktree.
- A compound feature writer is not in a managed worktree.
- A child packet depends on unstated parent history.
- The implementation author performs the only final review.
- A child integrates, publishes, or makes an unapproved scope decision.

## Verification

- [ ] `subagent({ action: "list", capabilities: true })` ran before delegated execution.
- [ ] Every selected agent was executable, non-disabled, and non-restricted; every external CLI runner had `runner.available: true`.
- [ ] Every job used a fitting persona and relevant available skill without hard-coded models.
- [ ] Delegation had a stated material benefit, or the parent used the direct-work fallback.
- [ ] Every child received a cold-start-complete packet.
- [ ] Coordinated work used exactly one top-level async `workflowScript`.
- [ ] Only independent lanes ran in parallel; dependencies ran sequentially.
- [ ] Every cwd/worktree had at most one writer.
- [ ] Compound feature mutation lanes used managed Git worktrees.
- [ ] Fresh read-only agents validated/reviewed every mutation candidate.
- [ ] The parent inspected evidence, dispositioned findings, retained decision authority, and reported risks.
