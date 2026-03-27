# Feature Implementation Plan: Agents Package

**Overall Progress:** `100%`

## TLDR

Add a new `agents` package to plib that embeds the agency-agents MIT repo and exposes an
interactive CLI selector. Running `plib install agents` lets users browse categories and
pick individual agent prompt files to install into `.claude/agents/`. User-managed custom
agents in `my-agents/` appear first. Conflict resolution, lock file tracking, and remove
all work the same way as existing packages.

## Goal State

**Current State:** plib installs commands, rules, and scripts. No concept of AI agents.
No interactive selector - installs are defined statically by `plib.json` manifests.

**Goal State:** `plib install agents` launches a numbered selector (pick category, pick
agents). Selected `.md` files land in `.claude/agents/`. Lock file tracks which agent
files are installed. `plib remove agents` removes only those files.

## Critical Decisions

- **Embed full agency-agents clone** - copy entire repo (`.git` included) to
  `packages/agents/source/` so `git pull` syncs upstream updates later.
- **New `type: "agent-catalog"` field** - optional field in `plib.json`; absence means
  standard package behaviour (zero breaking change).
- **Lock file `files[]` array** - agent-catalog entries add `"files": []` to track
  installed agent filenames. Existing lock entries without this field are unaffected.
- **`.claude/agents/` destination** - hardcoded for now; per-tool config is a future
  backlog item.
- **"All" only at agent level** - no bulk install of all 152 agents; "all" within a
  single category requires explicit confirmation.
- **`my-agents/` shown first** - user custom categories appear above source categories
  in the selector, tagged `[custom]`.
- **Product scope expansion** - plib now installs a fourth artifact type (agents).
  `docs/product-design.md` and `docs/architecture.md` need updating to reflect this.

## Tasks

- [x] 🟩 **Step 1: Embed agency-agents source** `[parallel]` → delivers: agent files at `packages/agents/source/`
  - [x] 🟩 Copy full agency-agents repo from `D:/Personal/Code/Exploration/AI-Tools/agency-agents` into `packages/agents/source/` (include `.git`)
  - [x] 🟩 Create `packages/agents/my-agents/` with a `.gitkeep` so the folder is tracked
  - [x] 🟩 Create `packages/agents/rules.md` (empty - required by spec convention)

- [x] 🟩 **Step 2: Create package manifest** `[parallel]` → delivers: registered `agents` package
  - [x] 🟩 Create `packages/agents/plib.json` with `"type": "agent-catalog"`, no commands/rules/scripts fields
  - [x] 🟩 Add `agents` entry to `registry.json`

- [x] 🟩 **Step 3: Add agent-catalog CLI logic** `[sequential]` → depends on: Steps 1, 2
  - [x] 🟩 Add `parseFrontmatter(content)` - regex-based YAML frontmatter parser (name, description, emoji)
  - [x] 🟩 Add `scanAgentCatalog(pkgDir)` - reads `my-agents/` (custom, shown first) then `source/` categories; skips `scripts/` and dot-folders
  - [x] 🟩 Add `parseSelection(input, max)` - parses `1,3,5-7` strings into 0-based index arrays
  - [x] 🟩 Add `promptCategorySelect(categories)` - numbered list, returns chosen category object
  - [x] 🟩 Add `promptAgentSelect(agents, categoryName)` - numbered list with emoji + description, `all` requires confirmation, returns selected agent objects
  - [x] 🟩 Add `cmdInstallAgents(pkgMeta, pkgDir, cwd, directAgentName)` - orchestrates full flow; direct install bypasses selector
  - [x] 🟩 Extend `installPackage(packageName, sourcePath, registry, cwd, extraArgs=[])` - detect `type: "agent-catalog"`, route to `cmdInstallAgents`; pass `commandArgs.slice(1)` from `cmdInstall`
  - [x] 🟩 Extend `cmdRemove` - detect `agent-catalog` type, remove only files in `lock.installed.agents.files[]`
  - [x] 🟩 Add `// TODO: per-tool destination config` comment at agent install destination line

- [x] 🟩 **Step 4: Update documentation** `[sequential]` → depends on: Step 2
  - [x] 🟩 `docs/architecture.md` - add `.claude/agents/` to install destinations diagram; add `agent-catalog` to package types
  - [x] 🟩 `docs/product-design.md` - update "commands, rules, and scripts" references to include agents
  - [x] 🟩 `PACKAGE-SPEC.md` - document the optional `type` field and `agent-catalog` behaviour
  - [x] 🟩 `docs/backlog.md` - add future item: per-tool destinations + `plib install agent` / `plib install command` subcommand split

## Outcomes

- **Step 1 deviation:** Initial `cp -r` of the outer `agency-agents/` dir copied the wrong level - user manually corrected by placing `source/` and `my-agents/` directly under `packages/agents/`. Structure confirmed correct.
- **`args.slice(1)` scope:** In `cmdInstall`, extra args are sliced from the full `args` array (after the package name). If the package name contains `@version`, only args beyond position 0 are passed - this is correct since version pinning is on args[0].
- **`rules.md` is kept minimal:** Agent-catalog packages have nothing to contribute to `toolkit.md`. The file exists only to satisfy the convention that packages have a `rules.md`; it contains a comment explaining this.
