# Lab Review: Technical Audit

When `/lab-review` is called, perform a comprehensive review of the current lab state. Be thorough but concise.

## CRITICAL RULES

1. **REPORT ONLY** - Do NOT make any changes or edits to files
2. **Wait for approval** - Only fix things after explicit permission
3. **Explain reasoning** - Use plain, clear language

---

## Review Scope

Focus on the lab-specific concerns:

### Variation Integrity
- Does each variation live in proper isolation (own folder/namespace)?
- Are previous variations untouched by later work?
- Can each variation be run independently?

### Concept Accuracy
- Does the implementation correctly demonstrate the claimed mechanic?
- Are the trade-offs documented in `/lab-contrast` actually reflected in the code?
- Would the "When Rule" hold up in a real project?

### Code Quality
- **Error Handling** - Appropriate for a learning lab (not over-engineered, but not swallowing errors)
- **Naming** - Do names communicate the concept being demonstrated?
- **Configuration** - No config leakage between variations
- **Dependencies** - Only what is needed for the concept

### Learning Value
- Is the "Discovery Narrative" clear in the implementation?
- Could someone reading this code understand the concept without external docs?
- Are anti-pattern demonstrations (from `/lab-break`) clearly labeled as intentional failures?

---

## Output Format

### Looks Good
- [Item 1]
- [Item 2]

### Issues Found
- **[Severity]** [File/Location] - [Issue description]
  - Fix: [Suggested fix]

### Summary
- Variations reviewed: X
- Critical issues: X
- Warnings: X

## Severity Levels
- **CRITICAL** - Incorrect concept demonstration, broken isolation
- **HIGH** - Misleading trade-off analysis, missing failure symptoms
- **MEDIUM** - Code quality, unclear naming
- **LOW** - Style, minor improvements

---

## REMEMBER: Report issues only. Do NOT edit any files until approved.
