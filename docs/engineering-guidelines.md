# Prompt Library Engineering Guidelines

This document describes how the codebase is currently structured and why.
It is not a rulebook - it is context. When something deviates from these patterns,
that is worth a conversation, not necessarily a blocker.

Read `docs/architecture.md` first to understand the system structure.

---

## Core Principle

The CLI is a thin file-copying tool. All meaningful logic lives in the packages themselves (the markdown commands and rules). Keep `cli/plib.js` simple — it should read manifests, copy files, and handle conflicts. It should not grow into a framework.

---

## CLI (`cli/plib.js`)

### Current Patterns

- Single file, zero npm dependencies — only `fs`, `path`, `readline` from Node built-ins
- All subcommands implemented as functions in the same file
- `registry.json` is the only source of truth for package discovery — never scan `packages/` directly
- Conflict resolution prompts the user with four options: replace, skip, rename, append
- Comment syntax for append separators is file-extension-aware (`.js` → `//`, `.md` → `<!-- -->`, `.py` → `#`, etc.)
- Rules sections in `toolkit.md` are tagged: `<!-- [name vX.Y.Z] -->` ... `<!-- [/name] -->` for clean assembly and removal

### Patterns Not Yet In Use

- Dry-run mode (`--dry-run`): add if users want to preview what will be installed before committing
- Batch conflict resolution (`--force`, `--skip-all`): add if interactive prompts become friction for power users
- Remote registry: add if packages need to be distributed beyond a local clone

---

## Packages

### Current Patterns

- Each package is fully self-contained under `packages/<name>/`
- `plib.json` manifest lists commands with `.md` extension, rules as a string path, scripts as an array
- `version` in `plib.json` must exactly match `version` in `registry.json` — they are kept in sync manually
- Commands are markdown files copied verbatim — do not modify content during packaging
- Rules are plain markdown assembled into `toolkit.md` with tagged sections

### When Adding a Package

- Read `PACKAGE-SPEC.md` for the full schema
- Read `CONTRIBUTING.md` for the step-by-step guide and common mistakes
- Test with `plib install <package>` in a throwaway directory before committing
- Bump version in both `plib.json` and `registry.json` when releasing changes

---

## Known Deviations

| Issue | What's Not Yet In Place |
|-------|------------------------|
| No automated tests | CLI behavior is tested manually; no test suite exists yet |
| Manual version sync | `plib.json` and `registry.json` versions must be kept in sync by hand |

---

## When Adding a Feature to the CLI

- Does it require an npm dependency? If yes, reconsider — find a built-in approach
- Does it change conflict resolution behavior? Update the prompt flow carefully; silent overwrites are never acceptable
- Does it change the lock file schema? Ensure backward compatibility with existing `.plib-lock.json` files
- Update `registry.json` if adding/renaming/removing a package
- Update `PACKAGE-SPEC.md` if changing the manifest schema
