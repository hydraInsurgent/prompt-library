<!-- [daily-builds v1.0.0] -->
# Daily Builds: Concept Lab Rules

## Lab Philosophy

This project is a **Technical Lab Notebook**, not a production project. Optimize for clarity, trade-offs, and system understanding - not feature completion. **Insight > Polish** and **Comparison > Refactoring**.

## Critical Rules

1. **Never auto-fix:** Report issues first. Wait for explicit approval before modifying files.
2. **Preserve Isolation:** Each step lives in its own folder/namespace. Do not modify prior steps or merge implementations together.
3. **Explain Reasoning:** Always narrate what you are doing. Call out trade-offs and framework mechanics.
4. **No Silent Scope Expansion:** Do not add steps to the plan without the user's agreement.
5. **Plan is Append-Only:** Once a step is in `Plan.md`, it cannot be modified or removed. New steps may be appended with the user's agreement.

## Canonical Workflow

```
/lab-concept → /lab-learn → /lab-execute → /lab-learn → /lab-contrast → /lab-document
```

### Per step:
1. `/lab-learn` - Teaches the concept behind this step, plans the implementation
2. `/lab-execute` - Builds the step in isolation with narrated coding
3. `/lab-learn` - Explains what was built and bridges to the next step
4. `/lab-contrast` - Compares with prior steps (optional per step, recommended after several)
5. `/lab-document` - Records findings in the README lab notebook

### Failure steps:
- `/lab-break` -> `/lab-document`

### Lab wrap-up:
- `/lab-review` - Final technical audit across all steps
- `/lab-revision` - Interactive interview-style knowledge check (anytime)

## Adjacent Concepts

If a concept requires exploration of a new layer (e.g., adding OpenTelemetry to a Logging lab), it lives in its own project and requires a new `/lab-concept` framing. Do not expand the current lab's scope.
<!-- [/daily-builds] -->
