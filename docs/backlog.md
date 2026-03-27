# Prompt Library Backlog

This is the single source of truth for all planned, in-progress, and recently completed work.

It is updated by the workflow commands:
- `/create-issue` adds items to the Bug backlog
- `/start-feature` moves an item to Active
- `/ship` moves an item to Closed
- Feature backlog items are added manually

**Scope check rule:**
When a new request comes in, check the Active section first.
- If there is an active plan: anything outside that plan's stated scope goes to backlog, not into the active branch.
- If there is no active plan: new items go directly to the appropriate backlog section.

---

## Active

What is currently being planned or built:

| Plan file | Issue | Branch | Status |
|-----------|-------|--------|--------|
| - | - | - | - |

---

## Feature Backlog

Future features - not yet started.

| # | Title | Priority | Notes |
|---|-------|----------|-------|
| - | Automated test suite for CLI | Medium | Manual testing only right now |
| - | Remote registry support | Low | Install packages from a URL, not just local path |
| - | Cross-package dependency declarations | Low | Packages declaring deps on other packages |
| - | Dry-run mode (`--force`, `--skip-all`) | Low | Batch conflict resolution flags |

---

## Bug Backlog

Known bugs not yet fixed.

| # | Title | Priority | Notes |
|---|-------|----------|-------|
| - | - | - | - |

---

## Closed

Recently completed work (keep last 10):

| # | Title | Type | Closed |
|---|-------|------|--------|
| - | daily-builds package + lab commands | Feature | 2026-03 |
| - | CLI conflict resolution + apply-to-all | Feature | 2026-03 |
| - | plib CLI + 5 installable packages | Feature | 2026-03 |

---

## Someday / Maybe

Untracked ideas - not estimated, not prioritized, not committed to.

- VS Code extension for browsing/installing packages without the terminal
- Package versioning with frozen version directories
- `plib publish` to share packages to a remote registry
- Auto-update check when running `plib install`
