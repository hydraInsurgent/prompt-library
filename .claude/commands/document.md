# Update Documentation Task

You are updating documentation after code changes.

## Primary Documentation Files

- **CLAUDE.md** - Project-specific instructions: tech stack, preferences, team info (user-owned)
- **README.md** - Project overview for humans
- **LESSONS.md** - Learning log: what worked, what didn't, mistakes to avoid (user-owned)
- **CHANGELOG.md** - User-facing changes: new features, breaking changes (update if it exists)
- **`.claude/rules/toolkit.md`** - Toolkit workflow rules (toolkit-owned, **do not edit** - overwritten on update)

Keep README.md and CLAUDE.md consistent with each other. Never edit `toolkit.md`.

## 1. Identify Changes
- Check git diff or recent commits for modified files
- Identify which features/modules were changed
- Note any new files, deleted files, or renamed files

## 2. Verify Current Implementation
**CRITICAL**: DO NOT trust existing documentation. Read the actual code.

For each changed file:
- Read the current implementation
- Understand actual behavior (not documented behavior)
- Note any discrepancies with existing docs

## 3. Update Relevant Documentation

**What goes where:**
- **README.md** - New features, changed behavior, setup instructions, new commands
- **CLAUDE.md** - Project description, tech stack, team info, coding preferences
- **CHANGELOG.md** - User-facing changes: new features, breaking changes, fixes (if the file exists)
- **LESSONS.md** - Prompt the user: "Did you learn anything this session worth logging?"

### Trigger-based doc updates

After identifying what changed, check each trigger below and update the relevant doc if it applies.

**`docs/architecture.md` - update if any of these are true:**
- A new API endpoint was added or removed
- A new component was added or an existing one's responsibility changed
- The database schema changed (new column, new table, renamed field)
- A new folder or layer was introduced in the codebase
- How Server Components and Client Components are split changed (if applicable)

**`docs/engineering-guidelines.md` - update if any of these are true:**
- A pattern was introduced that wasn't in the codebase before (e.g. first service layer, first use of a new library)
- A known deviation in the deviations table was resolved - remove it from the table
- A guideline was intentionally broken and a new one replaces it - update the relevant section

**`docs/product-design.md` - update if any of these are true:**
- The feature adds a new capability that changes what the product does
- The current scope section no longer accurately describes the product
- A feature rule changed (e.g. a field that was informational now does something)
- The user profile changed (e.g. the app now supports more than one user)

If none of these triggers apply, these three docs do not need updating.

## 4. Documentation Style Rules

✅ **Concise** - Sacrifice grammar for brevity
✅ **Practical** - Examples over theory
✅ **Accurate** - Code verified, not assumed
✅ **Current** - Matches actual implementation
✅ **Right file** - Put info where it belongs (see Section 3)

❌ No enterprise fluff
❌ No outdated information
❌ No assumptions without verification
❌ Don't edit `toolkit.md` - it's auto-managed

## 5. Ask if Uncertain

If you're unsure about intent behind a change or user-facing impact, **ask the user** - don't guess.

## 6. GitHub Integration

<procedure>

After documentation is updated, check if on a feature branch:

```bash
git branch --show-current
```

If the branch contains an issue number (e.g. `feature/task-completion-#8`), extract it.
Add a comment to the tracking issue noting what was documented:

```bash
gh issue comment [N] --body "Documentation updated:
- [file name] - [one line on what changed]
- [file name] - [one line on what changed]

Ready for /ship."
```

This is the last update to the tracking issue before it gets closed by `/ship`.

If not on a feature branch, skip this section entirely.

</procedure>

## 7. Worktree Cleanup

<procedure>

Detect if you're in a worktree: compare `git rev-parse --git-dir` with `git rev-parse --git-common-dir`. If they differ, you're in a worktree.

**If NOT in a worktree** - skip this section entirely.

**If in a worktree:**

Walk the user through each step one at a time, confirming before proceeding to the next.

1. Run `git status`. If there are uncommitted changes, ask the user whether to commit them before proceeding. Follow the commit message conventions in toolkit.md (start with a verb, under 50 characters). Do not continue with uncommitted work.
2. Push the branch to the remote.
3. If the branch name does not match `worktree-<number>-<label>`, ask the user: "Your branch still has its default name. Want to rename it before creating the PR?" Follow the worktree naming convention in toolkit.md if they say yes.
4. Draft a PR title and body summarizing the branch's changes. Show it to the user for review, then create the PR:
   ```
   gh pr create --base main --title "..." --body "..."
   ```
5. Show the user the PR URL.
6. Ask the user: "Want me to delete this worktree? The branch and PR will stay - only the local folder is removed."
7. If they say yes, run `git worktree remove <worktree-root-path>` from outside the worktree directory. If removal fails due to untracked files (build artifacts, .env.local, etc.), let the user know they can clean up manually or use `--force`.
8. The branch stays alive on GitHub until the PR is merged or closed. To re-create the worktree later if fixes are needed: `git worktree add <path> <branch-name>`.

</procedure>
