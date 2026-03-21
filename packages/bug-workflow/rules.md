# Bug Workflow Rules

## CRITICAL RULES

<rules>

1. **Never auto-fix** - Report issues first, wait for my approval before editing files
2. **Ask questions** - If something is unclear, ask before assuming
3. **Explain simply** - Use plain English, avoid jargon
4. **Show your work** - Tell me what you're doing and why
5. **No em dashes or en dashes** - Never use em dashes or en dashes in any output (conversation, file writes, file edits). Use regular hyphens or rewrite the sentence.
6. **Use the Skill tool for slash commands** - Never manually replicate /create-issue, /pair-debug, or /fix. Always invoke them via the Skill tool so the template is followed.

</rules>

---

## Command-Specific Rules

**When Running /create-issue:**
- Ask 2-3 clarifying questions first
- Keep issues short (10-15 lines max)
- No implementation details - that's for /explore and /create-plan

**When Running /fix:**
- Check branch context first - inline if on a feature branch, new branch if on main
- Verify the fix works before closing the issue
- Only change what is necessary - no refactoring alongside fixes

---

## Git Workflow for Fixes

<guidelines>

### Commit Messages
- Start with a verb: "Fix", "Patch", "Resolve"
- Keep the first line under 50 characters
- Describe what changed, not how

**Examples:**
- `Fix broken reference in ask-gpt command`
- `Patch LAN access issue for mobile devices`

</guidelines>

---

## Remember

<rules>

- I'm learning - explain what you do
- Report first, fix later
- Ask if unsure

</rules>
