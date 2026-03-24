# Lab Notebook: Documentation Update

When `/lab-document` is called, update the root `README.md`. If the file does not exist, initialize it using the Lab Notebook template below.

---

## Before Writing Documentation

1. Read the actual source files for the variation being documented. Do not describe mechanics or outcomes from memory or assumption - verify by reading the code.
2. If writing about a framework mechanic (e.g., "The Mechanic" section), only state behaviors that are observable in the code or its output. If you are generalizing beyond what was built, say so explicitly.
3. README entries become the persistent record of this lab. Inaccuracies here will mislead the user in future `/lab-revision` sessions. Verify before writing.

---

## 1. Initialization (If README.md is missing)

Create `README.md` with this structure:

```markdown
# [Concept Name] - Technical Lab Notebook

## The Core Question
[Insert the "Why" from the /lab-concept phase]

## Project Structure
- **Isolation Strategy:** [e.g., Folder-per-variation]
- **Core Abstractions:** [e.g., ILogger, ILoggerFactory]

## Lab Variations
[This section will be populated incrementally by the Variation Entries below]
```

---

## 2. Variation Entry (Mandatory Structure)

For every completed variation, append a new entry to the **Lab Variations** section:

### [Variation Name]
- **Location:** `[Link to folder/files]`
- **The Mechanic:** Explain the underlying framework logic in 2-3 sentences.
- **Implementation Note:** How we isolated this variation specifically.
- **The Outcome:** Describe the observable behavior (console output, debugger state, etc.).
- **Mini-Snippet:** Use a high-impact code snippet (max 10 lines) to show the key moment.

## 3. The Insight Engine (Trade-offs)

Distill the learning into a scannable comparison:

- **Pros:** What became simpler or more powerful?
- **Cons:** What was sacrificed (Performance, readability, config complexity)?
- **The "When" Rule:** Write a one-sentence rule for when to use this approach.
- **What this Unlocks:** Summary from the `/lab-contrast` phase.

## 4. Failure Entries

For variations created via `/lab-break`, use this structure:

### [Variation Name] (Failure Mode)
- **Anti-Pattern:** Name the mistake being demonstrated.
- **The Symptom:** What a developer would see in a real system.
- **The Lesson:** One-sentence takeaway.
- **Compare With:** Reference the variation that does it correctly.

## 5. Maintenance & Progress

- **Table of Contents:** If the lab is large, add/update navigation links at the top.
- **Plan.md Update:** Mark the `/lab-document` task as done. Recalculate and update the **Overall Progress** percentage.

---

## Smart Behavior

- **Scannability:** Use bold text for key terms.
- **Tone:** Technical, objective, and insightful - writing for "Future You."
- **Append only:** If the README already exists, do not overwrite it. Append the new variation to the end of the "Lab Variations" section.

## Ask if Uncertain

If you are unsure about intent behind a change, **ask the user** - do not guess.
