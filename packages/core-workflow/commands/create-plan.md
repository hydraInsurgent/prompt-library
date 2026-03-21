# Plan Creation Stage

Based on our full exchange, produce a markdown plan document.

## Worktree Check

<procedure>

**Fallback branch rename** - `/explore` is the primary place this happens, but if the user skipped it or didn't have an issue number yet, handle it here before generating the plan.

1. Detect if you're in a worktree: compare `git rev-parse --git-dir` with `git rev-parse --git-common-dir`. If they differ, you're in a worktree.
2. Check if the current branch name does NOT already match the `worktree-<number>-<label>` pattern.
3. If both are true AND an issue is referenced in the conversation, rename the branch following the worktree naming convention in toolkit.md.
4. Tell the user: "Renamed your branch from `old-name` to `worktree-XX-short-label` to match the issue."
5. If not in a worktree, or the branch is already renamed, skip silently.

</procedure>

## Plan File Naming

<rules>

Plans are named `[PROJECT-CODE]-P[N]-[slug].md` where:
- `PROJECT-CODE` is the short code from `CLAUDE.md` (field: `<!-- PROJECT-CODE: XX -->`)
- `N` is the GitHub issue number this plan belongs to
- `slug` is a short kebab-case description of the feature

**Examples:**
```
TL-P9-task-completion.md
APP-P12-filter-and-pagination.md
MB-P5-code-cleanup.md
```

Get the issue number from the current branch name (branch contains `#N`).
If no branch issue number is available, ask the user for the issue number before creating the file.

If no project code is defined in `CLAUDE.md`, use the plain `P[N]-[slug].md` format.

Save to `docs/plans/[filename].md`. Create the `docs/plans/` directory if it doesn't exist.

</rules>

## Requirements for the Plan

<rules>

- Include clear, minimal, concise steps
- Track the status of each step using these emojis:
  - 🟩 Done
  - 🟨 In Progress
  - 🟥 To Do
- Include dynamic tracking of overall progress percentage (at top)
- Do NOT add extra scope or unnecessary complexity beyond explicitly clarified details
- Steps should be modular, elegant, minimal, and integrate seamlessly within the existing codebase

</rules>

## Execution Order Tags (for plans with 3+ steps)

<conditions>

**Do not skip this.** For plans with 3 or more steps:

- Tag each step `[parallel]` or `[sequential]`
- `[parallel]` steps: add `→ delivers: [what this step produces]`
- `[sequential]` steps: add `→ depends on: Step N`
- Parallel steps must be independent in both **files AND environment** (dependencies, services, migrations, env vars)
- If all steps are sequential, still tag them - the tags confirm you thought about execution order

For plans with fewer than 3 steps, skip the tags.

</conditions>

## Markdown Template

<template>

```
# Feature Implementation Plan

**Overall Progress:** `0%`

## TLDR
Short summary of what we're building and why.

## Goal State (optional - include for features with 3+ steps)
**Current State:** Where things are now.
**Goal State:** Where we want to end up.

## Critical Decisions
Key architectural/implementation choices made during exploration:
- Decision 1: [choice] - [brief rationale]
- Decision 2: [choice] - [brief rationale]

<!-- GUIDELINES CHECK: If this plan introduces a pattern not yet in docs/engineering-guidelines.md
     (e.g. first use of a service layer, new state management, new library), add it here as
     a decision. If it resolves a known deviation from the deviations table, note that too.
     If it expands product scope beyond docs/product-design.md, flag it explicitly. -->

## Tasks
<!-- For 3+ steps: tag each step [parallel] or [sequential]. See "Execution Order Tags" above. -->

- [ ] 🟥 **Step 1: [Name]** `[parallel]` → delivers: [what this step produces]
  - [ ] 🟥 Subtask 1
  - [ ] 🟥 Subtask 2

- [ ] 🟥 **Step 2: [Name]** `[parallel]` → delivers: [what this step produces]
  - [ ] 🟥 Subtask 1
  - [ ] 🟥 Subtask 2

- [ ] 🟥 **Step 3: [Name]** `[sequential]` → depends on: Steps 1, 2
  - [ ] 🟥 Subtask 1
  - [ ] 🟥 Subtask 2

## Outcomes
<!-- Fill in after execution: decision-relevant deltas only. What changed vs. planned? Key decisions made? Assumptions invalidated? -->
```

</template>

<rules>

Again, it's still not time to build yet. Just write the clear plan document. No extra complexity or extra scope beyond what we discussed.

If your plan includes UI work, consider running `/ui-spec` before `/execute` to set design guardrails (colors, fonts, accessibility rules).

</rules>

## Backlog Update

<procedure>

After writing the plan file, update `docs/backlog.md` Active section.
Find the row for this issue (it will have `(pending)` in the Plan file column) and replace it with the real filename:

```
| [PROJECT-CODE-P[N]-slug.md] | #[N] | [branch-name] | In Progress |
```

If `docs/backlog.md` does not exist or has no Active row for this issue, skip silently.

</procedure>

## GitHub Integration

<procedure>

After writing the plan file, check if on a feature branch:

```bash
git branch --show-current
```

If the branch contains an issue number (e.g. `feature/task-completion-#8`), extract it.
Then update the tracking issue's Plan section with the path to the plan file:

```bash
gh issue edit [N] --body "## What we're building
[existing description - do not change]

## Scope
[existing scope - do not change]

## Plan
docs/plans/[plan-filename].md

## Outcome
To be filled when shipped."
```

Then tell the user:

```
Plan linked to issue #N.
Next: run /ui-spec if this includes UI work, then /execute to build it.
```

If not on a feature branch, skip this section entirely.

</procedure>
