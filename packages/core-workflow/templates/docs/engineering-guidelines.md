# {{PROJECT_NAME}} Engineering Guidelines

This document describes how the codebase is currently structured and why.
It is not a rulebook - it is context. When something deviates from these patterns,
that is worth a conversation, not necessarily a blocker.

Read `docs/architecture.md` first to understand the system structure.

---

## Core Principle

<!-- e.g. "Every state change goes through the service layer. UI never writes to the DB directly." -->
{{CORE_PRINCIPLE}}

---

## {{LAYER_1_NAME}}

<!-- e.g. "Backend", "API", "Server" -->

### Current Patterns

<!-- Bullet list of patterns in use: e.g. "- REST endpoints in routes/, validated with Zod before hitting the service layer" -->
{{LAYER_1_PATTERNS}}

### Patterns Not Yet In Use - and When to Consider Them

<!-- Bullet list with when-to-add notes: e.g. "- Request queuing: add if background jobs are needed" -->
{{LAYER_1_FUTURE_PATTERNS}}

### Response Codes (if applicable)

| Situation | Code |
|-----------|------|
| Success with data | 200 OK |
| Created | 201 Created |
| Success, nothing to return | 204 No Content |
| Invalid input | 400 Bad Request |
| Not found | 404 Not Found |

---

## {{LAYER_2_NAME}}

<!-- e.g. "Frontend", "UI", "Client" -->

### Current Patterns

<!-- Bullet list: e.g. "- React components in src/components/, co-located with their test files" -->
{{LAYER_2_PATTERNS}}

### Styling (if frontend)

<!-- e.g. "Tailwind utility classes. No custom CSS unless Tailwind cannot achieve the effect." -->
{{STYLING_APPROACH}}

---

## Known Deviations

These are open issues - areas where the current code does not yet match the patterns above.
They are tracked rather than hidden so they can be addressed deliberately.

| Issue | What's Not Yet In Place |
|-------|------------------------|
| - | None identified yet |

---

## When Adding a Feature

A useful checklist - not a gate:

<!-- Bullet list of things to verify: e.g.
- "- Does it follow the service layer pattern?"
- "- Are new endpoints validated with Zod?"
- "- Are there unit tests for the new service methods?"
- "- Is the backlog updated?"
-->
{{FEATURE_CHECKLIST}}
