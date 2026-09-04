# Capability Map: Pi Compatibility

| Module id | Responsibility | Depends on |
|---|---|---|
| pi-package | Declare installable Pi resources and validate the package | — |
| pi-prompts | Provide Pi-native lifecycle commands and `.pi/plans/` conventions | pi-package |
| pi-orchestration | Integrate task-fit personas, parallel delegation, and worktree isolation | pi-package, pi-prompts |
| pi-docs | Explain installation, commands, plans, and optional subagents | pi-package, pi-prompts, pi-orchestration |

Build order: pi-package → pi-prompts → pi-orchestration → pi-docs
