# Concept Framing: Scope & Plan

When `/lab-concept` is invoked, conduct a focused interview to define the lab scope. Do not generate `Plan.md` until the framing is explicitly agreed upon.

No code is written during this command.

---

## Stage 1 — Three Pillars

Ask the following, one section at a time. Do not assume answers.

### 1. What are we exploring?

- What is the concept and what precise engineering question are we answering?
- What must be included? What is intentionally excluded?
- What similar concepts should NOT bleed into this lab?

Push for technical precision. Do not proceed until scope is clear.

### 2. What steps do you want to build?

- Do you already know the steps or variations you want? If so, list them.
- If not, that's fine - we can start with just Step 1 and discover the rest via `/lab-learn` as we go.
- Which (if any) are failure/anti-pattern demonstrations?

For each question, provide **2-3 categorized suggestions** (e.g., Basic, Advanced, Failure).

Capture only explicitly agreed steps. Do not invent additional ones.

### 3. How do they coexist?

- How should steps be isolated? (Separate folders? Namespaces? Projects?)
- Should old steps ever be modified? (Default: no)

Confirm isolation rules.

---

## Stage 2 — The Agreement Gate

Present a consolidated "Lab Contract" summarizing all agreed points.

- **DO NOT** generate `Plan.md` yet.
- Explicitly ask: "Does this summary capture your intent?"
- Make adjustments if needed.

---

## Stage 3 — Plan.md Generation

Only after explicit approval, generate `Plan.md`. If the user defined all steps upfront, include them all. If they want to discover steps progressively, include only Step 1 - the rest will be appended by `/lab-learn` as the lab progresses.

```markdown
# [Concept Name] - Learning Lab

**Overall Progress:** `0%`

## Objective
[Short summary of what we are exploring and why]

**In-Scope:** [Agreed boundaries]
**Out-of-Scope:** [Specifically excluded topics]

## Steps
- [ ] **Step 1:** [Brief Description]
- [ ] **Step 2:** [Brief Description]
- [ ] **Step 3:** [Brief Description] (Failure Mode)

## Critical Decisions
- [choice] - [brief rationale]

## Tasks

- [ ] **Step 1: [Name]**
  - [ ] [Thing to explore or implement]
  - [ ] [Another concrete sub-task]
  - [ ] Isolation: [folder/namespace strategy]

- [ ] **Step 2: [Name]**
  - [ ] [Thing to explore]
  - [ ] [Sub-task]
  - [ ] Isolation: separate from Step 1; build alongside without merging

- [ ] **Step 3: [Name - Failure]**
  - [ ] Anti-pattern to demonstrate
  - [ ] How the failure manifests
  - [ ] Symptom log - what a developer would see

- [ ] **Lab Wrap-up**
  - [ ] Final audit (/lab-review)
  - [ ] Finalize README (/lab-document)
```

Adjust the number of steps and sub-tasks to match the agreed-upon list.

After generating, suggest: "Run `/lab-learn` to start learning about Step 1 before building it."

---

## Strict Constraints

During `/lab-concept`:
- Do not implement code.
- Do not expand scope beyond what the user agrees to.
- Do not introduce new steps unless the user suggests them.
- Do not generate Plan.md prematurely.

## Plan Rules

The plan is **append-only**. Existing steps cannot be modified or removed after generation. New steps may be appended with the user's agreement without re-running `/lab-concept`.
