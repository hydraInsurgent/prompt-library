# Package Specification

This document defines the schemas used by the `plib` prompt library CLI.

## plib.json (per package)

Every package directory must contain a `plib.json` at its root.

```json
{
  "name": "package-name",
  "version": "1.0.0",
  "description": "Short description of what this package provides",
  "commands": ["command-a.md", "command-b.md"],
  "rules": "rules.md",
  "scripts": ["helper.js"],
  "templates": ["CLAUDE.md"],
  "npmDependencies": {
    "some-package": "^1.0.0"
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Unique package identifier, kebab-case |
| `version` | string | yes | Semver version (e.g. `1.0.0`) |
| `description` | string | yes | One-line description shown in `plib list` |
| `commands` | string[] | no | Markdown files copied to `.claude/commands/` |
| `rules` | string | no | Single markdown file whose contents are assembled into `.claude/rules/toolkit.md` |
| `scripts` | string[] | no | Files copied to `scripts/` in the target project |
| `templates` | string[] | no | Files copied to the project root (e.g. `CLAUDE.md`) or `docs/` subdirectories |
| `npmDependencies` | object | no | npm packages required at runtime. The CLI will print an `npm install` command for the user |

### Conventions

- `commands` are always flat `.md` files - no subdirectories. Filenames must be unique across all installed packages.
- `rules` is a single file. On install, its contents are wrapped in attribution comments and appended to the assembled `toolkit.md`.
- `scripts` are copied to the project's `scripts/` directory.
- `templates` support path prefixes: `"docs/architecture.md"` copies to `docs/architecture.md` in the target.

## registry.json (repo root)

Index of all available packages. Kept at the prompt-library repo root.

```json
{
  "version": "1",
  "packages": [
    {
      "name": "core-workflow",
      "version": "1.0.0",
      "description": "Project lifecycle commands - ideate, plan, execute, test, document, ship",
      "path": "packages/core-workflow"
    }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `version` | string | Schema version of the registry format |
| `packages[].name` | string | Must match the package's `plib.json` name |
| `packages[].version` | string | Must match the package's `plib.json` version |
| `packages[].description` | string | Short description |
| `packages[].path` | string | Relative path from repo root to the package directory |

## Profile format (profiles/*.json)

A profile is a curated set of packages for a specific project type.

```json
{
  "name": "development",
  "description": "Full software development lifecycle",
  "packages": ["core-workflow", "review-suite", "debate", "bug-workflow", "utilities"]
}
```

| Field | Type | Description |
|---|---|---|
| `name` | string | Profile identifier |
| `description` | string | What this profile is for |
| `packages` | string[] | Package names to install (order matters - installed sequentially) |

## .plib-lock.json (target project)

Written to the target project root on install. Tracks what is installed.

```json
{
  "source": "/path/to/prompt-library",
  "installed": {
    "core-workflow": {
      "version": "1.0.0",
      "installedAt": "2026-03-21"
    }
  }
}
```

| Field | Type | Description |
|---|---|---|
| `source` | string | Absolute path to the prompt-library repo used for this install |
| `installed` | object | Map of package name to install metadata |
| `installed[name].version` | string | Version that was installed |
| `installed[name].installedAt` | string | ISO date of installation |
