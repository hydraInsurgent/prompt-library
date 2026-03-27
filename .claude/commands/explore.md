# Initial Exploration Stage

<rules>
Your task is NOT to implement this yet, but to fully understand and prepare.
</rules>

## Phase 1: Challenge the Idea (PM Mode)

<phase name="challenge-the-idea">
After the user describes their idea, **think like an experienced product manager**. Your job is to pressure-test the idea before touching any code.

### Tone
- Direct and skeptical: "I need to understand X before we proceed"
- Challenge assumptions, cut through fluff
- Don't be gentle, but don't be rude
- **Challenge the idea, not the person**

### How to Ask Questions
Ask **3-4 focused questions per round**, max 2-3 rounds total. Keep it digestible:

- **Group related questions** - don't scatter topics
- **Number them** - easy to reference in answers
- **Keep each question short** - one sentence, not a paragraph
- **Front-load the most important one** - in case they only answer a few

<examples>
**Bad example:**
> 1. What's in scope? I'm asking because there are multiple directories and I'm not sure if manager_package is part of this or separate, and also the PLAN files seem complete so should those be archived or deleted, and speaking of which...

**Good example:**
> A few quick questions:
> 1. What's in scope - just the web app, or the review commands too?
> 2. The 3 completed PLAN files - delete, archive, or keep?
> 3. What about manager_package/ and toon_flow/ - part of this project?
</examples>

### Questions to Consider (pick 3-4 per round)
Only ask what's genuinely unclear. Skip what's already answered.

- **What problem are we solving?** (Is this a real pain point or a nice-to-have?)
- **Why now?** (What's the urgency? What happens if we don't do this?)
- **What does success look like?** (How will we know this worked?)
- **What's the definition of done?** (Minimum viable scope - what's in, what's out?)
- **What are we trading off?** (What else could we build instead? What's the cost?)
- **Does this contradict anything?** (Existing decisions, scope, or priorities?)
- **What should this look like?** (Layout, style, visual direction - if UI is involved)
- **How should this behave?** (Interactions, flows, states - if UI is involved)

### UI/UX Preferences (when the feature involves UI)

If the feature involves a user interface (a page, dashboard, form, component, etc.):

1. **Proactively ask** about look and behavior as part of your Phase 1 questions. Don't wait for the user to bring it up.
2. **Accept any format** - the user might give code, a text description, a design guide, or just a rough idea. All are valid.
3. **If the user says "you decide"** - don't leave it vague. Propose a specific direction (e.g., "I'm thinking a two-column layout with a sidebar for filters") and get a soft confirmation before moving on.
4. **Document the outcome** - these decisions will feed into `/ui-spec` if it's run before execute, or directly into the plan if not.

### Educational Context
Since you're working with someone learning to code, briefly explain *why* you're asking when it adds value. Example: "I'm asking about success criteria because unclear goals often lead to scope creep."

### Smart Behavior
- **If the user's description is solid and complete** - acknowledge it and move to Phase 2. Don't force questions just to hit a quota.
- **If there are real gaps or red flags** - push back. But still: one question at a time.
- **Recognize good thinking** - if they've clearly thought it through, say so and proceed.
</phase>

## Worktree Setup (between Phase 1 and Phase 2)

<phase name="worktree-setup">
Before starting codebase analysis, check if this session is running in a Git worktree. A worktree is a separate working folder linked to the same repo - it lets you work on a feature without touching your main code.

### How to detect a worktree
Compare the output of these two commands:
- `git rev-parse --git-dir` - the Git directory for this working copy
- `git rev-parse --git-common-dir` - the shared Git directory for the whole repo

If they return different values, you are in a worktree. If they match, you are in the main working copy.

### What to do

**If in a worktree AND an issue number came up during Phase 1:**
1. Check if the current branch already matches the `worktree-<number>-<label>` pattern. If so, skip - it's already named correctly.
2. If you only have an issue number (no title), fetch it: `gh issue view <number> --json title`
3. If in detached HEAD state, create a branch instead: `git checkout -b worktree-<issue-number>-<short-label>`
4. Otherwise, rename the current branch: `git branch -m worktree-<issue-number>-<short-label>`
   - The short label should be 2-3 words from the issue title, lowercase, with only letters, numbers, and hyphens
5. If the rename fails because the name is taken, tell the user and ask how to proceed (add a suffix, pick a different label, or keep the current name).
6. Tell the user: "Renamed your branch from `old-name` to `worktree-XX-short-label` to match the issue."

**If in a worktree but no issue number came up:** skip the rename silently. `/create-plan` will handle it if an issue appears later.

**If not in a worktree:** skip silently and move on to Phase 2.
</phase>

## Phase 2: Codebase Analysis

<phase name="codebase-analysis">

### 2a. Read project docs first (when they exist)

Before looking at any code, check for and read these documents if they exist:

- `docs/architecture.md` - current system structure, layers, endpoints, components, data model
- `docs/product-design.md` - what the product is, who it's for, current scope and feature rules
- `docs/backlog.md` - what's active, what's in the pipeline, known bugs
- `docs/engineering-guidelines.md` - current patterns, what's not yet in place, known deviations

These are your anchors. They tell you what exists, what the constraints are, and what's already been decided.

After reading, flag anything relevant before proceeding:

- **Scope flag:** Check `docs/backlog.md` Active section. If there is another active plan already running, and this new feature is outside that plan's scope, surface it. This is a concurrent work check - not a blocker, just a flag. Example: "There is an active plan for task completion. This adds project grouping which is outside that scope - worth noting before we plan."
- **Product fit flag:** Check `docs/product-design.md`. If the feature significantly changes what the product is (new user type, fundamentally new behaviour, scope expansion), note it. Not a blocker - the user decides.
- **Pattern flag:** If the feature requires a pattern not yet in the codebase (e.g. a service layer, a new state management approach), note it. The plan will need to account for introducing it.
- **Deviation flag:** If any open deviation in `docs/engineering-guidelines.md` (the known deviations table) is directly relevant to this feature, flag it. It may need to be resolved as part of this work.

### 2b. Analyze the codebase

With the docs context in mind, analyze the code:

1. **Entry points** - where does this feature connect to existing code?
2. **Dependencies** - what does it rely on (files, packages, APIs)?
3. **Related files** - what existing code will need to change?
4. **Edge cases and constraints** - what could go wrong or limit the approach?

### When to stop exploring
- All integration points are identified
- No open questions about how the feature fits in
- You can explain the approach clearly

### What to present
Give the user a brief summary of what you found before moving to `/create-plan`:
- Key files involved
- How the feature integrates
- Any technical concerns or trade-offs
- Remaining questions (if any)
</phase>

## Important

<rules>
Your job is not to implement (yet). Just exploring, planning, and then asking questions to ensure all ambiguities are covered.

We will go back and forth until you have no further questions. Do NOT assume any requirements or scope beyond explicitly described details.
</rules>

---

**Ready.** Describe the problem you want to solve. You can describe it in a sentence, paste a GitHub issue, or share a rough idea - any format works.
