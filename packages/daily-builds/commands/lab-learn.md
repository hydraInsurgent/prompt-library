# Learn: Teach, Plan, and Explain

`/lab-learn` is the teaching command. It works at every stage of the lab:

| When called | What it does |
| --- | --- |
| No `Plan.md` exists | Teaches the concept from scratch, proposes Step 1, creates the plan |
| Before a step is executed | Teaches what this step is about, plans the implementation approach |
| After a step is executed | Walks through the actual code, explains what was built and why |

---

## Context 1: Starting a New Lab (No Plan.md)

### 1. Calibration

Ask two things:

- **What do you want to learn?** Get the concept name and what sparked the interest.
- **What do you already know?** Let the user explain in their own words. Do not offer levels like "beginner/intermediate" - calibrate from their explanation.

### 2. Teach the Fundamentals

Before any planning or code, explain the concept:

- **What it is** - plain language, no jargon-first definitions
- **Why it exists** - what problem does it solve? What was life like before this concept?
- **Where it sits** - how does it relate to things the user already knows?

Keep this concise. The goal is enough understanding to make Step 1 meaningful, not a textbook chapter.

### 3. Propose Step 1

Suggest the simplest possible implementation:

- Describe what we will build in one sentence
- Explain what the user will learn from building it
- Propose isolation strategy (folder name, namespace)

Create `Plan.md`:

```markdown
# [Concept Name] - Learning Lab

**Overall Progress:** `0%`

## Objective
[What we are learning and why]

## Steps

- [ ] **Step 1: [Name]** - [What this teaches]
  - [ ] [Sub-task]
  - [ ] Isolation: [folder/namespace]
```

Ask: "Ready to build this? Run `/lab-execute` when you are."

---

## Context 2: Before a Step is Executed

The user is about to build a step (either from Plan.md or newly proposed). Teach and plan.

### 1. Calibration

If the user specifies a step (e.g., `/lab-learn Step 3`), use that. Otherwise, identify the next unfinished step from `Plan.md`.

Check what the user already knows about this specific topic. If they understand it well, keep teaching brief and focus on planning. If they don't, teach first.

### 2. Teach the Concept Behind This Step

- **What is this about?** Explain the specific mechanic or pattern this step explores.
- **Why does it matter?** What problem does it solve that the previous step couldn't?
- **What to watch for:** Key behaviors or gotchas the user should notice during implementation.

Ground this in the prior steps. Reference actual code from earlier steps: "In Step 1, you had to hardcode X - this step removes that constraint by..."

### 3. Plan the Implementation

- **Approach:** Suggest a minimalist implementation that focuses on the concept.
- **Isolation:** Confirm folder/namespace and how config avoids leaking into prior steps.
- **Dependencies:** Identify anything new that needs to be added.
- Ask 2-3 targeted questions if the approach has decision points.

If proposing a new step (not already in Plan.md), append it to the plan.

Ask: "Ready to build this? Run `/lab-execute` when you are."

---

## Context 3: After a Step is Executed

The user just finished building a step. Explain what was built.

### 1. Read the Code First

Read the actual source files for the completed step. Do not explain from memory or assumption.

### 2. Walk Through What Was Built

- **What you built:** Summarize the implementation in 2-3 sentences grounded in the actual code.
- **How it works:** Walk through the key code flow. Reference specific files and lines.
- **The insight:** What is the one key thing this step reveals about the concept? Frame it as a discovery.
- **Real-world connection:** When would you see this pattern in a production codebase?

### 3. Surface Questions

- Point out anything that might be surprising or non-obvious in the implementation.
- If there are behaviors the user should verify by running the code, suggest specific things to try.

### 4. Bridge to Next Step

- What limitation or question does the current step expose?
- Propose the next step if one isn't already in Plan.md.
- Ask: "Want me to teach what the next step is about? Run `/lab-learn` again."

---

## When the Concept is Covered

After enough steps that the core concept is well understood:

1. Say so explicitly: "I think we've covered the core of [concept]."
2. Suggest optional extensions (failure mode via `/lab-break`, advanced variation, adjacent concept).
3. Recommend running `/lab-contrast` across all steps to see the full progression.
4. Recommend `/lab-revision` to test retention.

Do not invent additional steps to fill space. Stop when the concept is genuinely covered.

---

## Grounding Rules

- **Before explaining any step:** Read its source files. Do not describe code you have not read.
- **Before proposing a next step:** Read all prior steps' source files. Base the proposal on what was actually built, not assumptions.
- **When teaching mechanics:** Only state behaviors you can verify. If uncertain about a framework detail, say so explicitly.
- **Do not repeat fundamentals** on subsequent invocations. Each call teaches the *next layer*, building on prior understanding.
- **Do not front-load the journey.** Each step is proposed only after the previous one is understood.
