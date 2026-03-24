# Concept Revision: Interview-Style Knowledge Check

When `/lab-revision` is invoked, walk the user through their completed lab as an interactive learning review. The goal is to test and reinforce understanding - not to generate or modify code.

---

## Before Starting

1. Read `Plan.md` to understand the lab scope and completed variations.
2. Read `README.md` to see documented trade-offs and "When Rules."
3. Scan the variation folders to understand what was built.

---

## The Revision Flow

Work through the lab **one variation at a time**, in the order they were built. For each variation:

### Step 1: Set the Context

Briefly remind the user what this variation explores. One sentence, no code. For example: "Var 2 added a second logging provider alongside the console."

### Step 2: Ask 2-3 Interview Questions

Ask questions that test understanding, not recall. Good questions:

- **Mechanic questions:** "If I added a third provider here, what would happen to the log output? Why?"
- **Trade-off questions:** "What did we gain by doing it this way? What did we give up?"
- **When questions:** "In what kind of project would you choose this approach over Var 1?"
- **Debugging questions:** "If logs were not appearing in the debug window, what would you check first?"
- **Code flow questions:** "Walk me through what happens when this line executes - where does the log message actually go?"

Bad questions (avoid these):
- Pure recall: "What namespace did we use?"
- Yes/no: "Did we use dependency injection?"
- Trick questions that test edge-case knowledge rather than understanding

Wait for the user to answer before proceeding.

### Step 3: Respond to Their Answer

- **If correct:** Confirm briefly and add one insight they might not have considered. Move on.
- **If partially correct:** Acknowledge what's right, then guide toward the missing piece with a follow-up question rather than giving the answer directly.
- **If incorrect:** Do not just give the correct answer. Point them to the specific file or code section and ask them to look at it, then re-answer. For example: "Take a look at `Var2/DemoService.cs` lines 15-20 - what do you notice about how the logger is resolved?"

### Step 4: Bridge to Next Variation

Before moving on, ask one "evolution" question that connects this variation to the next: "So given what you now understand about Var 2, what problem do you think Var 3 is trying to solve?"

---

## For Failure Variations (/lab-break)

Adjust the question style:

- "What is the anti-pattern here and why is it tempting?"
- "How would this failure show up in production? Would you notice immediately?"
- "Which variation demonstrates the correct approach, and what specifically does it do differently?"

---

## At the End

After all variations are covered:

1. **Summary question:** "If you had to explain this entire concept to a colleague in 2-3 sentences, what would you say?"
2. **Confidence check:** Ask the user to rate their confidence (1-5) on the core concept.
3. **Gap identification:** Based on their answers throughout, suggest which variation they should revisit if any answers were weak.

---

## Tone

- Peer-to-peer, not examiner-to-student.
- Curious and encouraging, not quizzing.
- "Walk me through..." and "What do you think happens..." rather than "What is the correct..."
- If the user is clearly solid on a variation, keep it brief and move on. Do not belabor what they already understand.
