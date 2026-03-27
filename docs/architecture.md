# Prompt Library Architecture

This document describes the current system structure.
It is the primary reference for any AI assistant or contributor working in this repo.

---

## System Overview

`plib` is a CLI tool that installs curated packages of Claude Code commands, rules, and scripts into a target project's `.claude/` directory. There is no server, no database, and no network dependency — everything is file I/O.

```
prompt-library/ (source)         target-project/ (install destination)
├── cli/plib.js                  ├── .claude/
├── packages/                    │   ├── commands/    ← commands copied here
│   ├── core-workflow/           │   ├── agents/      ← agents copied here
│   ├── review-suite/            │   └── rules/
│   ├── debate/                  │       └── toolkit.md  ← rules assembled here
│   ├── bug-workflow/            ├── scripts/         ← scripts copied here
│   ├── utilities/               ├── <templates>      ← templates copied to root
│   ├── daily-builds/            └── .plib-lock.json  ← tracks installs
│   └── agents/
│       ├── plib.json
│       ├── source/     ← embedded agency-agents repo (.git included)
│       └── my-agents/  ← user custom agents
├── profiles/
├── registry.json
└── docs/
```

---

## Repository Layout

```
prompt-library/
├── cli/plib.js              The CLI tool (single file, no deps)
├── packages/                All packages live here
│   ├── core-workflow/       Project lifecycle commands
│   ├── review-suite/        Code and design review commands
│   ├── debate/              Multi-model AI debate commands + scripts
│   ├── bug-workflow/        Bug tracking and fix commands
│   ├── utilities/           Worktree, learning, packaging commands
│   └── daily-builds/        Concept labs - structured exploration
├── profiles/                Curated package bundles (JSON)
├── registry.json            Index of all packages (name, version, path)
├── PACKAGE-SPEC.md          Schema reference for package authors
├── CONTRIBUTING.md          Step-by-step authoring guide
├── scripts/                 Shell setup scripts (setup.ps1, setup.sh)
└── docs/
    ├── architecture.md      This file
    ├── product-design.md    What plib is and who it's for
    ├── engineering-guidelines.md  Patterns and conventions
    ├── backlog.md           Active work, planned features, bugs
    └── plans/               Implementation plans (PL-P#-name.md)
```

---

## Package Structure

Each package under `packages/` follows this layout:

```
packages/<name>/
├── plib.json        Manifest: name, version, description, commands[], rules, scripts[]
├── commands/        Markdown slash command files
├── rules.md         Behavioral rules for AI assistants
├── scripts/         Optional helper scripts
└── templates/       Optional files copied to project root on install
```

**Agent catalog packages** use a different layout and a special `"type": "agent-catalog"` field in `plib.json`. They do not have commands, rules, or scripts. Instead, the install flow is interactive:

```
packages/agents/
├── plib.json        Manifest: name, version, type: "agent-catalog"
├── source/          Embedded agency-agents repo (git clone, .git included for syncing)
│   ├── <category>/  One folder per agent type (e.g. engineering/, marketing/)
│   │   └── *.md    Agent prompt files
│   └── ...
└── my-agents/       User-managed custom agents (same structure as source/)
    └── <category>/
        └── *.md
```

Running `plib install agents` launches an interactive numbered selector: pick a category, pick agents. Selected files are copied to `.claude/agents/` in the target project. To sync upstream agent updates, `cd packages/agents/source && git pull`.

---

## CLI (`cli/plib.js`)

Single-file Node.js script, zero npm dependencies. Uses only built-ins: `fs`, `path`, `readline`.

**Commands:**
| Command | What it does |
|---------|-------------|
| `plib list` | Reads `registry.json`, prints all packages |
| `plib install <pkg>` | Copies commands, rules, scripts from package into target `.claude/` |
| `plib install --profile <name>` | Installs all packages in a profile |
| `plib remove <pkg>` | Removes installed files, strips rules section from `toolkit.md` |
| `plib status` | Reads `.plib-lock.json`, shows what's installed |
| `plib update` | Re-installs packages that have a newer version in registry |

---

## Data Model

**`registry.json`** — discovery layer; read by `plib list`
```json
[{ "name": "core-workflow", "version": "1.0.0", "path": "packages/core-workflow", "description": "..." }]
```

**`plib.json`** — per-package manifest
```json
{
  "name": "core-workflow",
  "version": "1.0.0",
  "description": "...",
  "commands": ["create-plan.md", "execute.md"],
  "rules": "rules.md",
  "scripts": [],
  "templates": []
}
```

**`.plib-lock.json`** — written to target project; tracks installed state
```json
{
  "installed": {
    "core-workflow": { "version": "1.0.0", "installedAt": "..." },
    "agents": { "version": "1.0.0", "installedAt": "...", "files": ["engineering-ai-engineer.md"] }
  }
}
```
Agent-catalog entries carry an extra `files[]` array listing which agent files were installed. Standard package entries are unaffected.

**`.claude/rules/toolkit.md`** — assembled rules file; sections tagged per package
```
<!-- [core-workflow v1.0.0] -->
... rules content ...
<!-- [/core-workflow] -->
```

---

## Known Architectural Limitations

| Issue | Description |
|-------|-------------|
| No cross-package deps | Packages cannot declare dependencies on other packages |
| No remote registry | Packages are only installable from the local source directory |
| No version pinning | Lock file stores installed version but `plib update` always goes to latest |
