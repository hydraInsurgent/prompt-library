# The Failure Lab: Anti-Pattern Demonstration

When `/lab-break` is called, intentionally implement a common mistake or anti-pattern related to the current concept. The goal is to **understand failure** so you can recognize and avoid it in real systems.

---

## Before Starting

1. Read all existing variation source files to understand what has been built so far. Anti-pattern suggestions must be grounded in the actual code and framework being used, not generic patterns.
2. When describing symptoms in the Symptom Log, only describe behaviors you can verify. If you are unsure whether a failure manifests as a silent drop, an exception, or a hang for the specific framework version in use, say so and ask the user to run it and report what they see.
3. Do not fabricate error messages or stack traces. Describe the *type* of failure (e.g., "you would see a timeout or hang") rather than inventing specific error text you are not certain of.

---

## 1. Anti-Pattern Selection

If the user specifies an anti-pattern, use it. If not, **suggest 2-3 relevant anti-patterns** based on the concept being explored and the variations already implemented. For each suggestion, give a one-line description of what goes wrong and why it's worth demonstrating.

Once an anti-pattern is agreed on, clarify:

- **What is the anti-pattern?** Name it clearly (e.g., "Blocking async call on main thread", "Storing secrets in config without encryption", "Circular dependency injection").
- **Why do developers fall into this?** Explain the reasonable-sounding logic that leads to this mistake.
- **How common is this?** Is this a beginner trap, or do experienced developers hit it too?

## 2. Implementation

Build the broken version in isolation:

- **Isolation:** Use its own folder/namespace, clearly labeled as a failure variation (e.g., `Var5_Failure_BlockingAsync/`).
- **Minimal reproduction:** Write the smallest amount of code that triggers the failure.
- **Make it runnable:** The user must be able to run this and *see* the failure happen.

## 3. The Symptom Log

Describe how a developer would experience this failure in a real system:

- **What they would see:** Error messages, stack traces, unexpected behavior, or silent failures.
- **What they would NOT see:** Hidden side effects that make debugging harder (e.g., "The app appears to work but silently drops log entries under load").
- **How long it takes to notice:** Does this fail immediately, or is it a time bomb?

## 4. The Fix Connection

- **Do NOT implement the fix.** This is a failure lab, not a fix lab.
- **Point to the contrast:** Reference which variation demonstrates the correct approach (e.g., "Compare with Var 2 which uses the async pipeline correctly").
- **The lesson:** Summarize in one sentence what this failure teaches (e.g., "Never call `.Result` on a Task inside a request handler - it blocks the thread pool and causes deadlocks under load").

---

## 5. Post-Execution Status

1. Update `Plan.md`: Mark the failure variation as done.
2. Update **Overall Progress** percentage.
3. **Next Step:** Propose moving to `/lab-document` to record the failure and its lesson in the README.
