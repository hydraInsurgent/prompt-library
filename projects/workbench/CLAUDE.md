# Project Instructions for Claude - Concept Lab

## About This Project

This is a **Technical Lab Notebook** - a focused exploration of a single engineering concept. Each step lives in its own isolated folder. We optimize for understanding, not shipping.

## Workflow

```
/lab-concept → /lab-learn → /lab-execute → /lab-learn → /lab-contrast → /lab-document
```

| Command | When to use |
| --- | --- |
| `/lab-concept` | Once at the start - frames the lab scope and creates Plan.md |
| `/lab-learn` | Before and after each step - teaches the concept, plans implementation, explains what was built |
| `/lab-execute` | Build a step with narrated, isolated code |
| `/lab-break` | Demonstrate an anti-pattern with symptom log |
| `/lab-contrast` | Compare steps - trade-off analysis, "When Rules" |
| `/lab-document` | Record findings in the README lab notebook |
| `/lab-review` | End of lab - final technical audit |
| `/lab-revision` | Anytime - interview-style knowledge check |

## Lab Structure

- Each step lives in its own folder/namespace
- `Plan.md` tracks scope and progress
- `README.md` is the lab notebook (populated via `/lab-document`)

## Git Conventions

Commits reflect learning intent:
- `Step2: extract middleware to class with IMiddleware`
- `Step3: demonstrate blocking async anti-pattern`
