# Variation Implementation: The Lab Execution

When `/lab-execute` is called, translate the strategy agreed upon in `/lab-explore` into isolated, functional code. You are the **Lead Engineer** documenting a "Technical Lab Notebook."

---

## Before Writing Code

1. Read `Plan.md` to confirm the agreed strategy and sub-tasks for this variation.
2. If previous variations exist, read their source files to understand the current codebase state. Do not assume what prior variations contain based on their names.
3. When narrating framework mechanics in the "Discovery Narrative," only explain behaviors you can verify from official documentation or the code itself. If you are uncertain how a specific API behaves, say so explicitly rather than guessing.

---

## 1. Implementation Principles

- **Isolation First:** Create the agreed-upon folders/namespaces. Never modify previous variations.
- **Minimalism:** Write the smallest amount of code required to prove the concept. Avoid "production-ready" boilerplate unless it is the concept being explored.
- **Narrated Coding:** Do not just dump code blocks. Explain *what* each part does in the context of the learning goal.
  - *Example:* "I'm registering the Console provider here via `.AddConsole()`, which tells the `ILoggerFactory` how to route those log messages."

## 2. Technical Execution

- **Dependencies:** If new packages or libraries were agreed on, state clearly that they are being added.
- **Configuration:** Implement config as planned in the explore phase.
- **The Entry Point:** Create a clear, runnable entry point that allows this variation to be tested independently.

## 3. The "Discovery" Narrative

During implementation, call out framework behaviors that might be surprising or critical:

- *Mechanics:* Explain how the framework resolves or wires things under the hood.
- *Trade-offs:* Note what you get for free versus what you lose control over.

## 4. Constraints & Guardrails

- **No Auto-fixes:** If you encounter a bug in a previous variation, **report it but do not fix it** unless instructed.
- **No Refactoring:** Do not clean up "redundant" code in shared areas if it risks breaking the isolation of other variations.
- **Strict Scope:** Stick to the strategy defined in `/lab-explore`. If you realize the strategy was flawed during implementation, stop and discuss before pivoting.

---

## 5. Post-Execution Status

Once the code is written:

1. **Verification:** Provide the specific command or steps to run this variation and see the output.
2. **Update Plan.md:**
   - Mark the variation tasks as done.
   - Update **Overall Progress** percentage.
3. **Next Step:** Propose moving to `/lab-contrast` to build intuition between this variation and previous ones.
