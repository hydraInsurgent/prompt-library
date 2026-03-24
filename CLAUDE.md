# Project Instructions for Claude

<!-- PROJECT-CODE: PL -->

## About This Project

Prompt Library (`plib`) - a CLI tool that manages installable packages of Claude Code commands, rules, and scripts. Packages are installed by copying files into a target project's `.claude/` directory.

**Tech Stack:**
- Node.js (zero external dependencies for the CLI)
- Markdown-based slash commands and rules
- JSON for configuration (registry, profiles, lock files, package manifests)

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
│   └── daily-builds/        Concept labs - structured learning through exploration
├── profiles/                Curated package bundles
├── registry.json            Index of all packages (name, version, path)
├── PACKAGE-SPEC.md          Schema reference for package authors
├── scripts/                 Shell setup scripts (setup.ps1, setup.sh)
└── docs/plans/              Implementation plans
```

Each package contains: `plib.json` (manifest), `commands/` (markdown files), `rules.md`, and optionally `scripts/` and `templates/`.

## How Packages Work

- Install copies files into the target project: commands to `.claude/commands/`, scripts to `scripts/`, templates to project root
- Rules from all installed packages are assembled into a single `.claude/rules/toolkit.md` with tagged sections (`<!-- [pkg v1.0.0] -->`)
- `.plib-lock.json` in the target project tracks what's installed and at what version
- Conflicts prompt the user: replace, skip, rename, or append

## Git Commit Conventions

**When modifying a package:**
```
<package-name>: <what changed>
```
Examples:
- `debate: add timeout option to ask-gpt command`
- `core-workflow: update execute.md parallel agent rules`
- `review-suite: fix browse.js screenshot path on Windows`

**When modifying the CLI:**
```
cli: <what changed>
```

**When modifying project-level files** (registry, profiles, docs, specs):
```
<what changed>
```

**When bumping a package version:**
- Update `version` in the package's `plib.json`
- Update `version` for that package in `registry.json` (must stay in sync)
- Commit as: `<package-name>: bump to vX.Y.Z`

**When freezing a version** (future - versioned directories):
- Commit as: `<package-name>: freeze vX.Y.Z, start vX.Y.Z development`

## Engineering Patterns

- **CLI has zero npm dependencies.** Uses only Node.js built-ins (fs, path, readline). Keep it that way.
- **Packages are self-contained.** A package should not reference files from another package. No cross-package dependencies (yet).
- **registry.json is the discovery layer.** `plib list` reads only this file. Package versions in registry.json must match the corresponding `plib.json`.
- **Comment syntax is file-aware.** When appending to files during conflict resolution, separators use the native comment style for that file extension (.js gets `//`, .md gets `<!-- -->`, .py gets `#`, etc.).
- **Rules use tagged sections.** Each package's rules in `toolkit.md` are wrapped in `<!-- [name vX.Y.Z] -->` / `<!-- [/name] -->` for clean assembly and removal.

## Before Creating or Modifying a Package

**Always read these files first:**
- `PACKAGE-SPEC.md` - schema reference for `plib.json`, `registry.json`, profiles, and lock files
- `CONTRIBUTING.md` - step-by-step guide and **Common Mistakes** section with real bugs to avoid

**Critical gotchas:**
- Commands in `plib.json` must include `.md` extension: `"lab-learn.md"` not `"lab-learn"`
- Rules field must be a string path: `"rules.md"` not `true`
- Version in `plib.json` and `registry.json` must match
- Test with `plib install <package>` in a throwaway directory before committing

## Preferences

- Keep the CLI concise. Avoid adding frameworks or abstractions.
- Markdown commands are copied verbatim from the source toolkit. Do not modify their content during packaging - they should match the original.
- When in doubt about scope, keep packages small and focused rather than bundling unrelated commands.
