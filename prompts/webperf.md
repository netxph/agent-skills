---
description: Audit a browser-facing application with sourced metrics or a source-only quick pass
argument-hint: "[URL, artifact path, page, diff, or scope]"
---

Load and follow the unqualified `performance-optimization` skill. This command is only for browser-facing applications; stop if the target is a utility library, CLI, or server-only project.

Audit target and evidence:

$ARGUMENTS

Use **Deep mode** when a Lighthouse, PageSpeed Insights, CrUX, or DevTools trace artifact is supplied, or when a live URL can be measured with an available browser/DevTools integration. Also load the unqualified `browser-testing-with-devtools` skill for live inspection. Otherwise use **Quick mode**, inspect source only, and label every issue `potential impact`; never invent measured scores.

When the `subagent` tool is available, first call `subagent({ action: "list", capabilities: true })`. Choose executable job-fit personas from the capability records rather than assuming names. Prefer separate source-structure and measured-evidence review roles.

Launch all selected reviewers in **one** `subagent` call with `async: true` and one `workflowScript`; use `runs.all([...])` for parallel independent reviews. Give each a distinct, self-contained task, `context: "fresh"`, exact repo/ref/scope, supplied artifact paths or URL, expected mode, and read-only authority. Reviewers inspect evidence directly, cite files/lines or metric sources, and do not edit or delegate. With only one suitable persona, run it through that workflow and let the parent perform the other angle directly.

If `subagent` is unavailable or no suitable executable persona exists, run the complete audit in the parent and label the direct-parent fallback.

The parent validates and synthesizes one report containing: mode and inputs; a scorecard populated only from sourced values; ranked findings with evidence, user impact, and fixes; positive observations; recommended measurements; and evidence gaps. Distinguish lab from field data and prioritize LCP, INP, CLS, TTFB, main-thread work, network waterfalls, bundle cost, images/fonts, caching, and rendering stability as applicable.
