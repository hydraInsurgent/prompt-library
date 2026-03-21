# Feature Implementation Plan

**Overall Progress:** `100%`

## TLDR

Build `plib` - a CLI-driven prompt library that lets you install curated packages of Claude Code commands, rules, and scripts into any project. The existing `llm-workflow-toolkit` becomes the first set of packages in the library.

## Goal State

**Current State:** One monolithic toolkit that gets copied wholesale into a project. All-or-nothing install, single repo, no composability.

**Goal State:** A `prompt-library` repo containing discrete packages (commands + rules + scripts + templates), each versioned independently. A `plib` CLI installs whichever packages you want into any project, detects conflicts, and prompts the user to resolve them. A lock file tracks what is installed and at what version.

## Critical Decisions

- **Single repo, packages as subdirs** - all packages live in `prompt-library/packages/`. No separate repos per package. The repo itself is the registry.
- **Node.js CLI** - consistent with the existing toolkit (already uses Node.js for debate scripts). No additional runtime required.
- **Copy-based install** - files are copied into the target project, not symlinked. Matches the existing toolkit's approach and keeps projects self-contained.
- **Per-package versioning** - each `plib.json` carries its own semver. Packages evolve independently.
- **Always prompt on conflict** - no silent overwrites. User always chooses: replace / skip / rename / append. Four options for MVP; merge deferred (see Someday/Maybe).
- **Rules assembly** - each package contributes a `rules.md`. On install, the CLI assembles all installed rules into a single `.claude/rules/toolkit.md`, with package attribution comments so the source is traceable.

---

## Tasks

- [x] 🟩 **Step 1: Repo scaffold + schema definition** `[sequential]` → delivers: the foundation everything else builds on
  - [x] 🟩 Create `packages/`, `profiles/`, `cli/` directory structure in `prompt-library/`
  - [x] 🟩 Define `plib.json` schema (name, version, description, commands, rules, scripts, templates, npmDependencies)
  - [x] 🟩 Define `registry.json` format (index of all packages with name, version, description, path)
  - [x] 🟩 Define `profiles/*.json` format (name, description, packages array)
  - [x] 🟩 Define `.plib-lock.json` format (source path, installed packages map with version + installedAt)
  - [x] 🟩 Write a `PACKAGE-SPEC.md` documenting the schema for future package authors

- [x] 🟩 **Step 2a: Split llm-workflow-toolkit into packages** `[parallel]` → delivers: five installable packages under `packages/`
  - [x] 🟩 Create `packages/core-workflow/` - commands: explore, create-plan, execute, unit-test, document, ship, start-feature, initiate-project, ideate
  - [x] 🟩 Create `packages/review-suite/` - commands: review-code, review-plan, review-ux, review-browser, review-full, review-commands, review; scripts: browse.js
  - [x] 🟩 Create `packages/debate/` - commands: ask-gpt, ask-gemini, peer-review; scripts: ask-gpt.js, ask-gemini.js; npmDependencies: openai, @google/generative-ai
  - [x] 🟩 Create `packages/bug-workflow/` - commands: create-issue, pair-debug, fix
  - [x] 🟩 Create `packages/utilities/` - commands: worktree, learning-opportunity, package-review, ui-spec
  - [x] 🟩 For each package: extract relevant sections from `toolkit.md` into that package's `rules.md`
  - [x] 🟩 For each package: write `plib.json` with correct version (start at `1.0.0`), description, and file lists
  - [x] 🟩 Create `profiles/development.json` - all five packages
  - [x] 🟩 Update `registry.json` with all five packages
  - [x] 🟩 Copy CLAUDE.md template and docs templates into `packages/core-workflow/templates/`

- [x] 🟩 **Step 2b: Build CLI core** `[parallel]` → delivers: `plib` CLI with list, status, install (no conflict logic yet), remove
  - [x] 🟩 Scaffold `cli/plib.js` with argument parsing (no external deps - use `process.argv`)
  - [x] 🟩 Implement `plib list` - reads `registry.json`, prints all packages with name, version, description
  - [x] 🟩 Implement `plib status` - reads `.plib-lock.json` in cwd, prints installed packages + versions
  - [x] 🟩 Implement `plib install <package>` - happy path only (no conflicts): copy commands, scripts, templates; assemble rules; write lock file
  - [x] 🟩 Implement `plib install --profile <name>` - reads profile, installs each package in sequence
  - [x] 🟩 Implement `plib remove <package>` - reads lock file, deletes that package's files, reassembles rules
  - [x] 🟩 Source path resolution: check `PLIB_HOME` env var first, then fall back to the CLI script's own directory (so it works whether invoked from PATH or directly)

- [x] 🟩 **Step 3: Conflict resolution system** `[sequential]` → depends on: Step 2b
  - [x] 🟩 Before copying any file, check if it already exists in the target (from a prior package install or pre-existing)
  - [x] 🟩 On conflict, prompt with four options: `[r]eplace / [s]kip / [n]ename / [a]ppend`
  - [x] 🟩 Implement `replace` - overwrite with new package's version
  - [x] 🟩 Implement `skip` - keep existing, do not copy
  - [x] 🟩 Implement `rename` - copy as `<filename>-<packagename>.md` (user can edit name after)
  - [x] 🟩 Implement `append` - append new file's content to existing file (with a separator comment)
  - [x] 🟩 Apply same four-option prompt to rules assembly when an existing `toolkit.md` is present
  - [x] 🟩 Apply same four-option prompt to template files (CLAUDE.md etc.)

- [x] 🟩 **Step 4: Profiles + registry polish** `[sequential]` → depends on: Steps 2a, 2b
  - [x] 🟩 Implement `plib install --profile <name>` fully (with conflict resolution flowing through from Step 3)
  - [x] 🟩 Implement `plib update [package]` - re-installs package at latest version, applies same conflict prompts
  - [x] 🟩 Implement `plib init` - scaffolds a new empty package in the current directory with a starter `plib.json`
  - [x] 🟩 Implement version pinning: `plib install review-suite@1.0.0`

- [x] 🟩 **Step 5: End-to-end test** `[sequential]` → depends on: Steps 3, 4
  - [x] 🟩 Create a throwaway test project directory
  - [x] 🟩 Test: `plib install core-workflow` into clean project - verify files, lock file, assembled toolkit.md
  - [x] 🟩 Test: `plib install review-suite` into same project - verify conflict prompts fire for shared rules, append works
  - [x] 🟩 Test: `plib install --profile development` into clean project - verified first two packages install with conflict resolution
  - [x] 🟩 Test: `plib remove review-suite` - verified files removed, rules reassembled without that section
  - [x] 🟩 Test: `plib update core-workflow` - verified "already up to date" when version matches

- [x] 🟩 **Step 6: Documentation** `[sequential]` → depends on: Step 5
  - [x] 🟩 Write `README.md` for `prompt-library` repo (what it is, quickstart, available packages, how to install CLI)
  - [x] 🟩 Write `CONTRIBUTING.md` - how to create a new package (schema reference, rules.md conventions, how to test locally)
  - [x] 🟩 Add install instructions for making `plib` available on PATH (alias in `.bashrc` / PowerShell `$PROFILE`)

## Someday / Maybe

Ideas that are deliberately out of MVP scope but worth revisiting later:

- **Interactive merge option** - a fifth conflict resolution option that opens a `code --wait --diff <existing> <incoming>` tab in VS Code/Cursor, lets the user edit and save, then uses the result. Needs editor detection (`cursor` → `code` → `code-insiders` → `$EDITOR` fallback). Deferred because the diff UX is non-trivial to get right across all environments.
- **Remote package registries** - point `plib` at a URL or GitHub repo instead of only a local `prompt-library` folder
- **Package dependencies** - one package declaring it requires another (e.g. `review-suite` requiring `core-workflow` for shared rules)
- **Dry-run mode** - `plib install --dry-run` that shows what would be copied/conflicted without writing anything

## Outcomes

- **5 packages created** (not 6 as originally estimated - the plan said "six" but the actual toolkit split cleanly into 5: core-workflow, review-suite, debate, bug-workflow, utilities)
- **review-suite got 7 commands** instead of 6 - there was a `review.md` router command in the toolkit that routes to the other review commands
- **utilities got 4 commands** - `ui-spec.md` existed in the toolkit and was included
- **CLI is 780+ lines** of zero-dependency Node.js with: list, status, install, remove, update, init, version pinning, conflict resolution, Levenshtein "did you mean?" suggestions, ANSI colored output
- **Known limitation**: piping stdin to the CLI for automated testing of conflict resolution is unreliable (Node.js readline creates a new interface per prompt, which can lose buffered pipe data). Interactive terminal usage works correctly.
