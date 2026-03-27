# Prompt Library Product Design

This document describes what plib is today and the principles behind it.
It is a reference point, not a constraint. If a proposed feature or direction
differs from what is written here, that is a signal to have a conversation
and update this document - not to automatically reject the idea.

---

## What plib Is

A CLI tool for installing curated packages of Claude Code commands, rules, and scripts into any project. Instead of copying an entire toolkit into every project, developers pick the packages they need. Each package is self-contained and installs cleanly into `.claude/`.

The library itself is also a curated collection of those packages — a growing set of opinionated workflows for how to work with Claude Code effectively.

---

## The User

A developer who uses Claude Code heavily across multiple projects. They have built up a set of slash commands and behavioral rules they rely on, and they want those workflows available in every project without manual copying or drift. They value consistency, simplicity, and tools that stay out of the way.

---

## Product Principles

- **Zero setup friction.** One command to install a package. No config files to edit manually.
- **No surprises.** The tool copies what it says it copies. Conflicts are surfaced explicitly, never silently overwritten.
- **Self-contained packages.** A package should work on its own. No hidden dependencies between packages.
- **CLI only, no deps.** A single Node.js file with no npm dependencies. Works anywhere Node is installed.
- **Small and focused packages.** Better to have five focused packages than one monolith. Users install what they need.
- **The commands are the product.** plib is the delivery mechanism. The real value is in the quality of the commands and rules inside each package.

---

## Current Scope

- CLI only — no web UI, no GUI
- Local only — packages live in the source directory; no remote registry
- Single user — no auth, no sharing, no collaboration features
- File-based state — `.plib-lock.json` and `.claude/` directory; no database

---

## How Features Currently Work

### Package install
User runs `plib install <name>` from a project root. The CLI reads `registry.json` to find the package path, reads `plib.json` for the manifest, then copies commands to `.claude/commands/`, scripts to `scripts/`, and templates to the project root. Rules are appended to `.claude/rules/toolkit.md` in a tagged section. Conflicts (files that already exist) prompt the user: replace, skip, rename, or append.

### Profile install
A profile is a JSON file in `profiles/` listing package names. `plib install --profile <name>` installs each package in sequence.

### Remove
`plib remove <name>` deletes installed command files, removes the rules section from `toolkit.md`, and updates `.plib-lock.json`.

### Status
`plib status` reads `.plib-lock.json` and prints what's installed with version info.

### Update
`plib update` compares installed versions in `.plib-lock.json` against `registry.json` and re-installs packages where the registry version is newer.
