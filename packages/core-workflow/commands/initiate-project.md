# Initiate Project

Sets up a new project from scratch through a guided conversation.
Each phase produces one confirmed document, written to disk immediately.
By the end you have all five foundation documents and a project ready to build.

This command assumes it is running inside a freshly copied toolkit folder.
The template files already exist with `{{PLACEHOLDER}}` syntax.
Your job is to fill in those placeholders - not to rewrite the templates.

**Documents created (in order):**
1. `docs/product-design.md` - confirmed and written after Phase 2
2. `docs/architecture.md` - confirmed and written after Phase 3
3. `docs/engineering-guidelines.md` - confirmed and written after Phase 4
4. `docs/backlog.md` - written after Phase 4 (no separate confirmation needed)
5. `CLAUDE.md` - confirmed and written after Phase 5

**Your role in each phase:**
- Read the existing template file first - your draft must keep the exact template structure
- Fill in every `{{PLACEHOLDER}}` field applying industry-standard practices for the chosen domain and stack
- If the project does not use a section (e.g. no frontend layer), remove that section entirely rather than filling it with N/A
- Show the completed document to the user - never present a blank form
- Explain briefly why you made each non-obvious recommendation (the user is learning)
- Wait for confirmation or adjustments, then write the file
- Keep each document concise - under 80 lines for v1. Include only patterns that apply to the confirmed stack. The document can grow as the project grows.

---

## Phase 1: Capture the idea

**First, check for an ideation brief:**

```
Read docs/ideation-brief.md (if it exists)
```

If the brief exists and its Decision is "Build":
- Extract: the idea summary, the problem, what already exists, the angle, feasibility notes, stack leanings, and the v1 must-have
- Show the user what you found:

```
I found an ideation brief. Here's what it says:

- **Idea:** [summary]
- **Angle:** [what makes it distinct]
- **v1 must-have:** [the one thing]
- **Stack leanings:** [any early direction, or TBD]

I'll use this as the starting point. Anything you want to change before we proceed?
```

Wait for confirmation. Then skip the three questions below and go directly to Phase 2,
using the brief's content as the input.

**If no brief exists**, ask exactly these three questions - nothing else:

```
Let's set up your project. Three questions to start:

1. What are we building? (2-3 sentences - what it is and what problem it solves)
2. Who is it for? (yourself, a team, a specific type of user)
3. What is the single most important thing it must do in v1?
```

Wait for the answers. Do not ask follow-up questions yet.
Note any tech stack hints or constraints the user mentions in passing - you'll use them in Phase 3.

---

## Phase 2: Product Design

### 2a: Read the template

```
Read docs/product-design.md
```

Understand the template structure. Your draft must keep the same headings and sections.

### 2b: Draft docs/product-design.md

From the Phase 1 answers, fill in every `{{PLACEHOLDER}}` in the template.

**Industry standards to apply:**

- **Problem-first framing.** The product description should lead with the problem being solved, not the features. Features are answers to problems - state the problem first.
- **User profile as a real person.** Describe the user's context, goals, and frustrations - not just "developers" or "small teams". A grounded user profile prevents feature decisions that solve the wrong problem.
- **Principled scope limits.** Current Scope must be explicit about what v1 does NOT do. Scope creep compounds from the first feature - drawing the line early is a product practice, not a limitation.
- **Principles that create constraints.** Product principles are most useful when they rule something out. "Simple" is not a principle. "One action, one screen - never combine" is.
- **Feature descriptions as outcomes.** Describe what the user can do and what the system provides - not implementation steps.

Fill in:
- **PROJECT_NAME**: infer from the description (short, memorable, no acronyms unless obvious)
- **PRODUCT_DESCRIPTION**: 2-4 sentences, problem-first
- **USER_PROFILE**: role, context, goals, specific frustrations this product addresses
- **PRODUCT_PRINCIPLES**: 3-5 principles. For each one you propose that the user did not explicitly state, mark it with `(suggested)` so the user knows it came from you, not them. They can remove or adjust.
- **CURRENT_SCOPE**: bullet list of what v1 includes AND explicitly what it does not
- **FEATURE_DETAILS**: one paragraph or short bullet list per feature, outcome-focused

Before showing the draft, also ask:

```
Before I show this, any features or ideas that came to mind that are NOT in v1?
(These go into the Someday backlog - not forgotten, just not now.)
```

Incorporate the Someday items into the scope split: confirmed v1 items in Current Scope, Someday items noted as explicitly out of v1 scope.

Then show the full draft:

```
Here is the Product Design draft:

---
[full rendered content of docs/product-design.md]
---

A few notes on what I added:
- [explain each (suggested) principle and why you think it fits]
- [explain any scope decisions you made that weren't explicitly stated]

Does this match your vision?
- Confirm to proceed
- Or tell me what to adjust
```

Wait for confirmation or adjustments. Revise and re-show if needed.

### 2c: Write the file

Once confirmed, write `docs/product-design.md` immediately.

```
docs/product-design.md - written.
```

---

## Phase 3: Architecture

### 3a: Ask about tech stack, constraints, and data

Ask:

```
Three questions for the architecture:

1. What tech stack are you thinking? (language, framework, database - or "not sure yet")
2. Any constraints? (e.g. self-hosted, no internet required, no user accounts, CLI only, mobile)
3. What are the core things the system needs to store or track?
   (e.g. "tasks with a title, status, and due date" or "users and their posts")
   Just the essentials - we can expand later.
```

**If the user says "not sure" about the stack**, suggest one based on the product type and explain the trade-off briefly:

| Product type | Suggestion | Why |
|---|---|---|
| CRUD web app (solo/small team) | Next.js full-stack + SQLite or Postgres | One repo, file-based routing, server components for data, no separate API needed until scale requires it |
| CRUD web app (API + separate frontend) | Node/Express + React + Postgres | Clean separation, good for teams or when the API will be consumed by multiple clients |
| Data-heavy or scripting tool | Python + SQLite or Postgres | Strong data libraries, readable syntax, easy to extend |
| CLI tool | Node or Python, local file storage | No server overhead, ships as a single executable |
| Mobile app | React Native + REST backend | Cross-platform, JavaScript if already in the stack |

Frame it as: "Based on what you described, here is what I'd suggest and why - happy to go a different direction."

### 3b: Read the template

```
Read docs/architecture.md
```

Understand the template structure. Your draft must keep the same headings and sections, except: if the project has only one layer (e.g. CLI tool, single-tier app), remove the unused layer section entirely.

### 3c: Draft docs/architecture.md

**Industry standards to apply:**

- **Layered architecture.** Every non-trivial system benefits from separation of presentation, business logic, and data access. Apply the standard pattern for the chosen stack:
  - Node/Express: `routes` -> `controllers` -> `services` -> `repositories` (or `models`)
  - Next.js: `app/` (pages/routes) -> `lib/` (business logic/server actions) -> `db/` (data access)
  - Python/Flask: `blueprints/` -> `services/` -> `models/`
  - .NET: `Controllers/` -> `Services/` -> `Repositories/` + `DTOs/`
  - CLI: `commands/` -> `core/` (business logic) -> `storage/`
- **Single responsibility per module.** Each folder or file has one reason to change.
- **Config in environment variables.** Never hardcode connection strings, API keys, or environment-specific values. Use `.env` (with `.env.example` committed, `.env` gitignored).
- **RESTful conventions** (if building an API): noun-based routes (`/tasks`, not `/getTask`), correct HTTP verbs, consistent status codes.
- **Migration-based schema management.** Database changes go through migration files, never direct schema edits.
- **Repository layout follows the architecture.** The folder structure should mirror the layers.

Fill in:
- **SYSTEM_OVERVIEW**: 2-3 sentences describing the architecture and how layers relate
- **ASCII_DIAGRAM**: use a simple indented hierarchy or table format (Component -> talks to -> Component) rather than box-and-arrow art. Keep it readable.
- **Repository Layout**: actual expected folder structure with one-line descriptions per folder
- **LAYER_1 / LAYER_2**: named by their role (e.g. "API Layer", "Frontend", "CLI"). Remove any layer section the project does not have.
- **LAYER_1_RUNTIME / LAYER_2_RUNTIME**: runtime and default port
- **LAYER_1_STRUCTURE**: folder tree for that layer
- **DATA_MODEL**: build this from the user's answer to question 3 in Step 3a. Use only the fields they mentioned plus obvious system fields (`id`, `createdAt`). Do NOT invent fields the user did not mention. If unsure whether a field is needed, leave it out - it can be added during `/explore`.
- **API_ENDPOINTS**: if the project has an API, list only the endpoints implied by the confirmed v1 features from product-design.md. Mark any endpoint you are not sure about with `(TBD - confirm during /explore)`. Do not generate full CRUD for every entity by default.
- **REQUEST_FLOW**: a simple numbered list showing how a request moves through layers (e.g. "1. Browser sends POST /tasks -> 2. Route validates input -> 3. Service creates task -> 4. Repository writes to DB -> 5. Response returned")
- **PLANNED_FEATURE_1**: anything from Phase 2 Someday list that has architectural implications

Show the draft:

```
Here is the Architecture draft:

---
[full rendered content of docs/architecture.md]
---

[1-2 sentences on the layering pattern chosen and why it fits this project]
[Note any fields or endpoints you left out deliberately and why]

Does this match what you're envisioning?
- Confirm to proceed
- Or tell me what to change
```

Wait for confirmation. Revise if needed.

### 3d: Write the file

Once confirmed, write `docs/architecture.md` immediately.

```
docs/architecture.md - written.
```

---

## Phase 4: Engineering Guidelines

### 4a: Ask one targeted question

```
One question before writing the engineering guidelines:

Any coding patterns you want to enforce or avoid?
(e.g. "always async/await, never callbacks", "no ORMs", "tests next to source files")

If you have no strong opinions yet, I'll apply standard conventions for the stack.
```

### 4b: Read the template

```
Read docs/engineering-guidelines.md
```

Understand the template structure. Remove any sections that don't apply (e.g. "Styling" if there's no frontend, "Response Codes" if there's no API).

### 4c: Draft docs/engineering-guidelines.md

**Industry standards to apply for the confirmed stack only** (do not include conventions for languages/frameworks not in this project):

**Naming conventions** (include only the relevant language):
- JavaScript/TypeScript: `camelCase` for variables and functions, `PascalCase` for classes and components, `UPPER_SNAKE_CASE` for constants, `kebab-case` for file names
- Python: `snake_case` for variables and functions, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants
- C#/.NET: `PascalCase` for classes and public members, `camelCase` for private fields with `_` prefix

**Code quality patterns:**
- Small, focused functions (one function, one job - fits on a screen)
- Descriptive names over comments (name the function what it does)
- No silent failures - errors must be caught, logged, or re-thrown; never swallowed
- No magic numbers or strings - use named constants
- Early returns to reduce nesting (guard clauses at the top)

**Testing standards:**
- Unit tests for business logic (services and utility functions)
- Integration tests for data access (repositories against a real or in-memory database)
- Do not test framework code - test the logic that uses it
- Test names describe behaviour: `it('returns 404 when task does not exist')` not `it('test task')`

**Security baseline:**
- Validate all external input before it reaches business logic
- Never log passwords, tokens, or PII
- Use parameterised queries - never string-concatenate SQL
- Store secrets in environment variables, never in code

Fill in:
- **CORE_PRINCIPLE**: 1 sentence, the most load-bearing architectural constraint for this project
- **LAYER_1_NAME / LAYER_2_NAME**: match the architecture doc
- **LAYER_1_PATTERNS**: bullet list of patterns in use, specific to this stack and layer
- **LAYER_1_FUTURE_PATTERNS**: patterns not needed yet, with a "when to add" note
- **LAYER_2_PATTERNS**: same for layer 2 (remove if single-layer project)
- **STYLING_APPROACH**: if frontend exists - framework, utility classes vs component styles, WCAG 2.1 AA minimum. Remove if no frontend.
- **FEATURE_CHECKLIST**: 5-7 practical items. Include: tests written, input validated, errors handled, no hardcoded config, backlog updated, architecture doc still accurate

Show the draft:

```
Here are the Engineering Guidelines:

---
[full rendered content of docs/engineering-guidelines.md]
---

[1 sentence noting any conventions you applied from the stack defaults]

Does this look right?
- Confirm to proceed
- Or adjust any patterns or checklist items
```

Wait for confirmation. Revise if needed.

### 4d: Write the files

Once confirmed, write both files immediately:

1. `docs/engineering-guidelines.md`
2. `docs/backlog.md` - read the template first, fill in project name, add Someday ideas from Phase 2 to the Someday / Maybe section, leave all tables empty

```
docs/engineering-guidelines.md - written.
docs/backlog.md - written.
```

---

## Phase 5: CLAUDE.md

### 5a: Ask about the developer and project code

```
Two final questions:

1. Tell me about yourself as a developer.
   (experience level, which parts of the stack you're most comfortable with,
   how you prefer explanations - high level or step by step?)

2. Pick a 2-4 letter project code for plan file names.
   (e.g. "TL" for Tasklog -> plans named TL-P1-feature-name.md)
```

### 5b: Read the template

```
Read CLAUDE.md
```

Understand the template structure. Your draft must keep the same headings and the Key Documents section exactly as-is.

### 5c: Draft CLAUDE.md

CLAUDE.md is the AI collaboration contract. It defines how Claude works in this project going forward.
It is written last because it synthesises everything confirmed in the earlier phases.

**What makes a good CLAUDE.md:**
- The project description should be factual and specific - Claude reads this at the start of every session
- The developer profile should be honest about experience level so Claude pitches explanations correctly
- Coding preferences should reflect the engineering guidelines already confirmed - they must be consistent
- The "My Preferences" section captures communication style (e.g. "explain the why, not just the what", "show examples when introducing a pattern")

Fill in:
- **PROJECT_CODE**: the code chosen in 5a
- **PROJECT_DESCRIPTION**: 3-4 sentences summarising the product (from product-design.md, condensed). Include what it is, who it's for, and what makes it distinct.
- **STACK_ITEM_***: one bullet per confirmed tech stack item. Add as many lines as needed. Include runtime versions if known.
- **DEVELOPER_PROFILE**: their experience level, which layers they're confident in vs learning, preferred collaboration style
- **CODING_PREFERENCES**: the patterns from engineering-guidelines.md condensed into a short preference list, plus communication preferences from the developer profile

The Key Documents section is already in the template - do not modify it.

Show the draft:

```
Here is CLAUDE.md - the collaboration contract for this project:

---
[full rendered content of CLAUDE.md]
---

This is what I'll read at the start of every session in this project.
Confirm or adjust anything about the profile, preferences, or project description.
```

Wait for confirmation. Revise if needed.

### 5d: Write the file

Once confirmed, write `CLAUDE.md` immediately. Also create the placeholder directories:

```bash
mkdir -p docs/plans docs/tests
```

Create `docs/plans/.gitkeep` and `docs/tests/.gitkeep` so git tracks the empty directories.

```
CLAUDE.md - written.
docs/plans/ - created.
docs/tests/ - created.
```

---

## Phase 6: Final summary

Output:

```
Project initialised.

  docs/product-design.md        - what it is, who it's for, what v1 does
  docs/architecture.md          - system structure, layers, data model
  docs/engineering-guidelines.md - patterns, conventions, feature checklist
  docs/backlog.md               - ready for work, Someday ideas added
  CLAUDE.md                     - collaboration contract set
  docs/plans/                   - empty, ready for implementation plans
  docs/tests/                   - empty, ready for test coverage tracking

[PROJECT_NAME] is ready to build.

Next: run /start-feature to kick off the first piece of work.
```

---

## Guidelines

<guidelines>

- **Read the template first.** Every phase must start by reading the existing template file. Your draft must preserve the template's heading structure. Fill in placeholders, do not rewrite the document from scratch.
- **Draft first, ask for corrections.** Never show a blank form. Fill in every placeholder from what you know, then ask the user to review.
- **Apply industry standards proactively.** Do not wait for the user to ask for best practices. Apply them in the draft and explain briefly why they are there. The user should leave each phase knowing one thing they might not have known before.
- **Only include what applies.** Do not include Python conventions in a JavaScript project. Do not include API endpoint tables for a CLI tool. Do not include styling sections when there is no frontend. Remove irrelevant template sections entirely.
- **Flag what you invented.** If you propose a product principle, add a field, or suggest an endpoint the user did not ask for, mark it clearly (e.g. `(suggested)` or `(TBD)`). The user must be able to distinguish their decisions from your suggestions.
- **Do not invent data.** Data model fields and API endpoints must come from what the user described or from obvious system requirements (id, timestamps). If you are not sure a field is needed, leave it out. It is easier to add during /explore than to remove after building.
- **One confirmation per phase, one write per phase.** Show the whole document, get a single yes/no, then write the file.
- **Explain your decisions.** After showing a draft, include 1-2 sentences on anything you added that wasn't explicitly stated.
- **Keep it concise.** Each document should be under 80 lines for v1. The project does not exist yet - the documents will grow as the project grows.
- **Backtracking is allowed.** If the user realises during a later phase that an earlier document needs to change, update it in place and note the change. Phases are sequential but not locked.

</guidelines>
