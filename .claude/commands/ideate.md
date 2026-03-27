# Ideate

Explores a raw idea before committing to building it.
Use this when you have a thought but are not sure if it is worth a full project,
what already exists, or how to approach it technically.

By the end you have a decision (build / refine / shelve) and, if building,
a brief that `/initiate-project` reads as its starting input.

**This command does not create a project.** It creates one file:
- `docs/ideation-brief.md` - research findings, feasibility analysis, and decision

---

## Phase 1: Capture the raw idea

Ask one question only:

```
What's the idea? Describe it however you want - a sentence, a paragraph, a rant.
Don't worry about structure. Just tell me what you're thinking about.
```

Wait for the answer. Accept anything - a vague concept, a complaint about an existing tool,
a "what if" question. The user does not need to have a clear product vision yet.

After receiving the idea, summarise it back in 2-3 sentences to confirm understanding:

```
Here's what I'm hearing:

[your summary - what the core idea is and what problem it seems to address]

Is that roughly right, or should I adjust my understanding?
```

Wait for confirmation before moving on.

---

## Phase 2: Research existing solutions

Use web search to find what already exists in this space. Look for:
- Direct competitors (tools/products that solve this exact problem)
- Adjacent solutions (tools that solve a related problem, or partially solve this one)
- Open source projects in this space
- Common approaches people use today (even manual/workaround solutions)

Present findings as a structured summary:

```
Here's what I found:

**Direct solutions:**
- [Name] - [what it does, pricing/model, notable strength or weakness]
- [Name] - [...]

**Adjacent / partial solutions:**
- [Name] - [what it does, what gap it leaves]

**How people solve this today without a dedicated tool:**
- [common workaround or manual approach]

**What none of these do:**
- [the gap your idea could fill, if one exists]
```

Then ask:

```
Given what's out there, what's your reaction?
- "Mine would be different because..." → tell me how
- "I didn't know about [X], let me think" → take your time
- "This changes my idea" → tell me the new direction
```

Wait for the user's response. This is a conversation, not a form.

---

## Phase 3: Feasibility check

Based on the idea (refined or original) and what exists, assess feasibility across three dimensions.
Use your knowledge of the technical landscape. Be honest - the point is to surface problems early.

```
Feasibility check:

**Technical complexity:**
[Low / Medium / High] - [why. What are the hard parts? Any unknowns?]

**Effort to reach a usable v1:**
[Small (days) / Medium (1-2 weeks) / Large (weeks+)] - [what determines this]

**Key risks:**
- [risk 1 - e.g. "depends on an API that may not exist or may be rate-limited"]
- [risk 2 - e.g. "requires real-time sync, which adds significant complexity"]

**Stack considerations:**
[If you can already see that certain tech choices would make this easier or harder,
mention them. e.g. "This is a natural fit for a CLI tool" or "You'll need a backend
for the sync feature, which rules out a pure frontend approach."]
```

Then ask:

```
Any of these risks change your thinking? Or are they acceptable?
```

Wait for the user's response.

---

## Phase 4: Sharpen the angle

This is the creative phase. Help the user find what makes their version worth building
despite what already exists. Ask exactly these questions:

```
Three questions to sharpen the idea:

1. If this existed exactly as you imagine it, what would make you choose it
   over [the closest existing solution from Phase 2]?
2. What is the ONE thing it must do well to be worth using?
3. Who would care about this besides you?
```

Wait for answers. If the user struggles with question 3, that's fine - "just me" is a valid answer
for a personal project.

---

## Phase 5: Decision

Based on everything discussed, present a clear recommendation with reasoning:

```
Here's where I think we are:

**The idea:** [refined summary from the full conversation]
**The angle:** [what makes it distinct - from Phase 4]
**The hard part:** [biggest technical or product risk]
**Effort to v1:** [estimate from Phase 3]

My recommendation: [Build / Refine / Shelve]

[1-2 sentences explaining why]
```

Definitions:
- **Build** - the idea is clear enough, feasible, and has an angle. Ready for `/initiate-project`.
- **Refine** - promising but needs more thinking. Specific gaps identified. Suggest what to think about and come back.
- **Shelve** - not feasible, already well-solved, or the user lost conviction. No shame in this. Note the idea in case it becomes relevant later.

Ask the user:

```
What's your call? Build, refine, or shelve?
```

Wait for the decision.

---

## Phase 6: Write the brief

**If the decision is Build:**

Write `docs/ideation-brief.md`:

```markdown
# Ideation Brief

## The Idea
[2-3 sentence refined summary]

## The Problem
[What problem this solves, who has it, how they cope today]

## What Already Exists
[Top 2-3 existing solutions and the gap they leave]

## Our Angle
[What makes this version worth building - from Phase 4]

## Feasibility
- **Complexity:** [Low/Medium/High]
- **Effort to v1:** [Small/Medium/Large]
- **Key risks:** [bullet list]
- **Stack leanings:** [any early tech direction, or "TBD"]

## v1 Must-Have
[The ONE thing from Phase 4 question 2]

## Decision
Build. Proceed to /initiate-project.
```

Then output:

```
docs/ideation-brief.md - written.

Next: run /initiate-project.
It will read the brief and use it as the starting point instead of asking from scratch.
```

**If the decision is Refine:**

Write the same file but with `Decision: Refine` and a "What to think about" section
listing the open questions. Output:

```
docs/ideation-brief.md - written.

Come back when you've thought through the open questions.
Run /ideate again and I'll pick up where we left off.
```

**If the decision is Shelve:**

Write the same file but with `Decision: Shelved` and the reason. Output:

```
docs/ideation-brief.md - written.

The idea is documented in case it becomes relevant later.
No further action needed.
```

---

## Guidelines

<guidelines>

- **This is a conversation, not a form.** Let the user ramble, change their mind, go on tangents. Your job is to extract signal and reflect it back clearly.
- **Be honest about feasibility.** Do not hype an idea to make the user feel good. If something is hard, say it's hard. If something already exists and is good, say so. The user benefits more from a cancelled idea than a failed project.
- **Research before opining.** Use web search in Phase 2. Do not guess what exists from training data alone - the landscape changes fast.
- **Do not design the product.** This is ideation, not product design. Do not suggest features, propose architectures, or pick tech stacks. Surface information and ask questions. The user decides.
- **The brief is the only artifact.** Do not create any other files. Do not set up folders, initialize repos, or create templates. That is `/initiate-project`'s job.
- **Short phases, real pauses.** Each phase should be a short exchange, not a wall of text. Ask your question, wait for the answer, then move on.

</guidelines>
