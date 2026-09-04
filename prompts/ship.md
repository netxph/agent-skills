---
description: Run parallel pre-launch reviews and synthesize a go/no-go decision with rollback
argument-hint: "[release target or commit range]"
---

Load and follow the unqualified `shipping-and-launch` skill. The parent session remains the orchestrator, evidence arbiter, and final decision-maker.

Release scope:

$ARGUMENTS

Inspect the target diff and applicable `.pi/plans/` specification. When the `subagent` tool is available, first call `subagent({ action: "list", capabilities: true })`. From its executable capability records, choose job-fit personas for code quality, security, and test coverage; do not assume fixed names or select restricted/unavailable runners.

Launch the selected reviewers in **one** `subagent` call with `async: true` and one `workflowScript`. Use `runs.all([...])` so the independent reviews run in parallel. Give each a distinct, self-contained task, `context: "fresh"`, the exact repo/ref/scope, and read-only authority. Each must inspect the real files and diff and return evidence-backed severity plus `file:line` references. Reviewers must not edit or delegate. If fewer than three suitable personas are executable, run the available reviews in that workflow and have the parent perform the missing axes directly.

If `subagent` is unavailable or no suitable executable persona exists, perform all review axes directly in the parent and label this as the direct-parent fallback.

After results return, the parent deduplicates and validates findings, then directly checks accessibility, infrastructure, documentation, observability, migrations, environment/configuration, feature flags, and repository-required tests/build/lint/type gates.

Return:

```markdown
## Ship Decision: GO | NO-GO
### Blockers
### Recommended fixes
### Acknowledged risks
### Rollback plan
- Trigger conditions
- Exact rollback procedure
- Recovery time objective
### Specialist reports
```

Any Critical/High security issue or failing required gate defaults to NO-GO unless the user explicitly accepts the risk. A rollback plan is mandatory for GO.
