# The Insight Engine: Variation Comparison & Capability Analysis

When `/lab-contrast` is invoked, analyze how the current variation shifts the "Power vs. Complexity" curve of the system. Focus on both solved problems and **newly unlocked capabilities**. Do not write new code or make project changes.

---

## Before Generating Any Analysis

1. Read the actual source files for **both** the current variation and the variation(s) being compared. Do not build trade-off matrices from assumptions about what the code does based on variation names or Plan.md descriptions alone.
2. Read `README.md` for any previously documented trade-offs and "When Rules" to ensure consistency.
3. Every claim in the trade-off matrix and "When Rule" must be traceable to something observable in the code or its output. If a claim is based on general knowledge rather than what was actually built, label it explicitly (e.g., "In general, this pattern also enables X - though we did not implement that here").

---

## 1. Capability Expansion

Identify exactly what we can do *now* that was impossible or impractical in the previous variation.

- **New Superpowers:** What does this unlock? (e.g., "We can now change log levels without restarting the app," or "We can now query logs as data objects rather than searching strings.")
- **Operational Shift:** How does this change the developer's day-to-day workflow?

## 2. The Trade-off Matrix

Construct a scannable comparison table. Focus on "Costs vs. Capabilities."

| Feature / Metric | Variation [Previous] | Variation [Current] |
| :--- | :--- | :--- |
| **New Capability** | [Limited to X] | [Unlocks Y & Z] |
| **Architectural Cost** | [Minimal] | [High Abstraction/New Dep] |
| **Flexibility** | [Hardcoded] | [Highly Dynamic] |

## 3. Dimensional Analysis

- **Cognitive Load:** Does the new approach require the developer to understand more "magic" or boilerplate?
- **Surface Area:** Did we increase the number of moving parts (dependencies, config files, interfaces)?
- **The "Weight" of the Feature:** Is the added power worth the extra complexity for a small project?

## 4. The "Evolution" Narrative

Describe the progression across variations.

- *Example:* "In Var 1, we learned the syntax. In Var 2, we did not just 'fix' Var 1; we **unlocked the ability** to route logs to different destinations based on their importance."

## 5. The "When" Rule

Build practical judgment:

- **When does this approach make sense?** (Project size, team, requirements)
- **When is it a "smell"?** (Over-engineering, unnecessary abstraction for the problem at hand)
- Write a one-sentence rule for when to use this approach.

---

## 6. Post-Contrast

- **Synthesize for README:** Prepare a "What this Unlocks" summary for the next `/lab-document` call.
- **Highlight Modern Patterns:** Call out if the approach aligns with industry standards (e.g., Cloud-Native, 12-Factor App).

---

## Smart Behavior

- **Focus on the "Why":** Explain why someone would choose to pay the "complexity tax" to get these new features.
- **No code changes.** This is pure analysis.
