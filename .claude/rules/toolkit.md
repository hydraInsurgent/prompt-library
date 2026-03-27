<!-- [core-workflow v1.0.0] -->
# Core Workflow Rules

## How We Work Together

### CRITICAL RULES

<rules>

1. **Never auto-fix** - Report issues first, wait for my approval before editing files
2. **Ask questions** - If something is unclear, ask before assuming
3. **Explain simply** - Use plain English, avoid jargon
4. **Show your work** - Tell me what you're doing and why
5. **Use the Skill tool for slash commands** - Never manually replicate /ideate, /initiate-project, /start-feature, /explore, /create-plan, /execute, /unit-test, /document, or /ship. Always invoke them via the Skill tool so the template is followed.
6. **No em dashes or en dashes** - Never use em dashes or en dashes in any output (conversation, file writes, file edits). Use regular hyphens or rewrite the sentence.
7. **Teach the why** - When explaining, focus on *why* things work so the user can solve similar problems independently next time.

</rules>

### Our Workflow

<procedure>

#### Project setup (once, before first feature)
0. `/ideate` - (optional) Explore and validate the idea before committing to a project
0. `/initiate-project` - Create all foundation docs (product design, architecture, guidelines, CLAUDE.md)

#### Feature workflow
1. `/start-feature` - Classify the work, create tracking issue and branch
2. `/explore` - Understand the problem, ask clarifying questions, read project docs, analyze codebase
3. `/create-plan` - Create a step-by-step implementation plan
4. `/execute` - Build it, updating the plan as we go
5. `/unit-test` - Write and run unit tests for what was built
6. `/document` - Update documentation
7. `/ship` - Close tracking issue, merge branch, tag version, create release

</procedure>

### Subagent Strategy

<guidelines>

- **Use subagents for research and exploration** freely - no need to ask
- **One focused task per subagent** - don't bundle unrelated work
- **Don't duplicate work** - if a subagent is researching something, don't also do it yourself
- **Parallelize independent plan steps** - tell the user what each parallel task will do and wait for approval before starting

</guidelines>

---

## Git Workflow

<guidelines>

### When to Branch
- New features that might break things
- Experimental changes you're not sure about
- When collaborating with others

### When to Work on Main
- Documentation updates
- Small fixes
- Cleanup work

### When to Commit
- After completing a logical unit of work
- Before switching to a different task
- When you want a checkpoint you can return to

### When to Push
- After commits you want to keep (backup)
- When you're done for the day
- Before asking for feedback

### Commit Messages
- Start with a verb: "Add", "Fix", "Update", "Remove", "Refactor"
- Keep the first line under 50 characters
- Describe what changed, not how

**Examples:**
- `Add git workflow guidance to CLAUDE.md`
- `Remove Next.js web app (out of scope for v1)`
- `Fix broken reference in ask-gpt command`

**Simple rule:** For solo learning projects, working on main is fine. Branch when you want to experiment safely.

### Worktree Workflow

When running multiple Claude Code sessions in parallel (via Cursor windows or Remote Control spawn mode), each session should use its own Git worktree. This prevents branch conflicts between sessions.

- **Setup:** Use `/worktree` to create an isolated session before starting the feature workflow
- **Branch naming:** When an issue is identified, rename the worktree branch to `worktree-<issue-number>-<short-label>` (e.g., `worktree-58-branch-conflicts`)
- **How it works:** `/explore` auto-renames the branch when an issue comes up. `/create-plan` does the same as a fallback if `/explore` was skipped.
- **Cleanup:** `/document` handles end-of-session cleanup - creates a PR, then offers to delete the worktree folder. The branch stays alive until the PR is merged.
- **Key concept:** A worktree is just a folder on disk. Deleting it does not delete the branch or PR. You can always re-create a worktree from the same branch if you need to make fixes.
- **End of session:** Worktree sessions end with `/document` (creates the PR), not `/ship`. The `/ship` command is for feature branches with an issue number in the branch name. Worktree branches use a different naming convention (`worktree-<N>-<label>`) and are merged via PR.

</guidelines>

---

## Command-Specific Rules

**When Running /unit-test:**
- Check for test infrastructure first - set it up if missing (ask before creating anything)
- Show the list of test targets and wait for confirmation before writing tests
- Do not move past Step 6 if tests are failing - diagnose first

---

## Remember

<rules>

- I'm learning - explain what you do
- Report first, fix later
- Ask if unsure
- After non-trivial corrections (changed the plan, fixed a recurring mistake, or corrected a wrong assumption), update `LESSONS.md`

</rules>
<!-- [/core-workflow] -->

<!-- [bug-workflow v1.0.0] -->
# Bug Workflow Rules

## CRITICAL RULES

<rules>

1. **Use the Skill tool for slash commands** - Never manually replicate /create-issue, /pair-debug, or /fix. Always invoke them via the Skill tool so the template is followed.

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
<!-- [/bug-workflow] -->
