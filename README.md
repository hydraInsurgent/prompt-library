# Prompt Library

A CLI-driven prompt library for installing curated packages of Claude Code commands, rules, and scripts into any project.

## What is this?

Instead of copying an entire toolkit into every project, `plib` lets you pick and choose which packages you need. Each package is a self-contained set of slash commands, behavioral rules, and helper scripts that get installed into your project's `.claude/` directory.

## Available Packages

| Package | Description |
|---|---|
| **core-workflow** | Project lifecycle - ideate, plan, execute, test, document, ship |
| **review-suite** | Code, plan, UX, browser, and command reviews with severity-rated findings |
| **debate** | Multi-model AI peer review debates with ChatGPT and Gemini |
| **bug-workflow** | Bug capture, investigation, and targeted fix workflow |
| **utilities** | Parallel worktrees, learning mode, package review, UI specs |

## Quick Start

```bash
# List available packages
node cli/plib.js list

# Install a single package
node cli/plib.js install core-workflow

# Install a full profile (all packages)
node cli/plib.js install --profile development

# Check what's installed in the current project
node cli/plib.js status
```

## Setting Up a Shell Alias

To use `plib` from anywhere:

**Bash / Zsh:**
```bash
echo 'alias plib="node /path/to/prompt-library/cli/plib.js"' >> ~/.bashrc
source ~/.bashrc
```

**PowerShell:**
```powershell
Add-Content $PROFILE 'function plib { node "C:\path\to\prompt-library\cli\plib.js" @args }'
. $PROFILE
```

Or set the `PLIB_HOME` environment variable and add the CLI to your PATH.

## CLI Commands

```
plib list                          List all available packages
plib status                        Show packages installed in this project
plib install <package>[@version]   Install a package into this project
plib install --profile <name>      Install all packages in a profile
plib remove <package>              Remove a package from this project
plib update [package]              Update installed package(s) to latest
plib init                          Scaffold a new package in current directory
```

## How It Works

- **Commands** (`.md` files) are copied to `.claude/commands/`
- **Rules** are assembled into a single `.claude/rules/toolkit.md` with attribution comments per package
- **Scripts** are copied to `scripts/`
- **Templates** (like `CLAUDE.md`) are copied to the project root

When a file already exists, you are prompted to choose:
- **[r]eplace** - overwrite with the package version
- **[s]kip** - keep existing file
- **[n]ame** - save with a package-suffixed filename
- **[a]ppend** - append to the existing file

A `.plib-lock.json` file tracks installed packages and versions.

## Creating Your Own Package

See [PACKAGE-SPEC.md](PACKAGE-SPEC.md) for the full schema reference and [CONTRIBUTING.md](CONTRIBUTING.md) for a walkthrough.
