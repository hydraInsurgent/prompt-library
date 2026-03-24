# daily-builds

Structured learning through concept exploration. Build isolated implementations of the same concept step by step, compare trade-offs, and develop practical judgment about when to use each approach.

## What is this?

A set of Claude Code slash commands that guide you through a disciplined learning workflow. Each "lab" focuses on a single engineering concept (e.g., Middleware, Logging, Auth). You build implementations step by step, compare trade-offs, and document what you learn.

## The Workflow

```
/lab-concept → /lab-learn → /lab-execute → /lab-learn → /lab-contrast → /lab-document
```

1. **`/lab-concept`** - Frame the lab once: what are we exploring, what steps, how do they coexist
2. **`/lab-learn`** - Before building: teaches the concept behind the step and plans the implementation
3. **`/lab-execute`** - Build the step with narrated, isolated code
4. **`/lab-learn`** - After building: walks through the code, explains what was built and why
5. **`/lab-contrast`** - Compare steps: trade-off matrices, "When Rules"
6. **`/lab-document`** - Record findings in the README lab notebook

Repeat steps 2-6 for each step. Steps can be planned upfront or discovered progressively via `/lab-learn`.

## All Commands

| Command | Purpose |
|---|---|
| `/lab-concept` | Frame a new lab - define scope, steps, and isolation strategy |
| `/lab-learn` | Teach, plan, and explain - works before, after, or between steps |
| `/lab-execute` | Build a step with narrated, isolated code |
| `/lab-break` | Demonstrate an anti-pattern with symptom log |
| `/lab-contrast` | Compare steps - trade-off analysis, capability unlocks |
| `/lab-document` | Record findings in the README lab notebook |
| `/lab-review` | Final technical audit across all steps |
| `/lab-revision` | Interview-style knowledge check |

## Key Principles

- **Steps are isolated.** Each lives in its own folder/namespace. Previous steps are never modified.
- **Plan is append-only.** New steps can be added, but existing ones are not changed.
- **Narrated coding.** Claude explains what each piece does and why, not just dumps code.
- **Grounded analysis.** Claude reads actual source files before making claims. Uncertainty is stated explicitly.
- **Learn before and after.** `/lab-learn` teaches the concept before you build, then explains what was built after.

## What gets installed

- 9 slash commands in `.claude/commands/`
- Rules in `.claude/rules/toolkit.md` (lab philosophy, workflow, critical rules)
- `CLAUDE.md` template at project root (project overview for Claude)

## Pairs well with

Install via `plib install --profile learning` to get daily-builds + review-suite + debate for the full learning stack. The debate package adds `/ask-gpt` and `/ask-gemini` for external peer review of your lab work.

---

## Future Plans

### daily-tutorials package (separate package, not yet built)

The daily-builds workflow keeps each step isolated in its own folder. A separate `daily-tutorials` package would go further: **progressive refactoring** where each step modifies and evolves the same codebase, similar to how .NET tutorials or framework walkthroughs work.

| | daily-builds | daily-tutorials (not yet built) |
|---|---|---|
| Steps | Isolated in separate folders | Same codebase evolving |
| Code relationship | Never modify prior steps | Refactor and build on prior code |
| Value | Compare approaches side-by-side | Learn through iterative improvement |

**Why a separate package:** The isolation rule ("never modify prior steps") is enforced in `rules.md`. A tutorial mode that wants refactoring would conflict at the enforcement layer.

**When to build:** After real usage of daily-builds reveals whether isolation is a genuine friction point for learning.

### Other ideas

- **Lab templates** - pre-built Plan.md templates for common concepts (Middleware, Auth, Async, DI) with suggested step lists
- **Cross-lab contrast** - compare approaches across different concept labs
- **Export to blog** - generate a tutorial-style blog post from the README lab notebook
