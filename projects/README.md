# Projects Registry

This folder is the consumer registry for plib. Each tracked consumer project gets a subfolder here containing a description, a manifest of subscribed packages, snapshots of `CLAUDE.md` and `toolkit.md`, and any project-specific commands as `overrides/`. Drift between a project and the library is visible here without filesystem scans.

## Tiers

- **Formal consumer** - has `.plib-lock.json` in its repo. Receives library updates via `plib install`. Drift surfaced by `plib detect-drift`.
- **External / read-only** - someone else's repo. Snapshot kept here for reference and idea-mining; never written back to. Manifest carries `external: true`.

## How to populate a snapshot

Run from the library repo:

```
plib snapshot /path/to/project        # creates or refreshes projects/<name>/
plib detect-drift /path/to/project    # updates manifest's modified[] list
```

Naming convention for `projects/<name>/`:
- Projects under `Depth Projects/` keep their plain folder name (canonical).
- Same-named projects elsewhere take a parent-context prefix to avoid collision (e.g. `cursor-tasklog`, `old-tasklog`).

## Catalog of projects to snapshot

These are the projects identified by the 2026-05 deep scan. Snapshots will be populated during the library-sync initiative ([issue #2](https://github.com/hydraInsurgent/prompt-library/issues/2)).

### Mine (formal consumers, post-conversion)

| Snapshot name | Path | Notes |
|---|---|---|
| `tasklog` | `Depth Projects/Tasklog` | Self-hosted todo app. Has new `/guides`, `/learnings`, modified `/document` worth upstreaming to the new `docs-workflow` package. |
| `tasklog-business` | `Depth Projects/Tasklog Business` | Multi-user version. Last touched 2026-04-29. |
| `doppel` | `Depth Projects/doppel` | AI chatbot widget. 17 commands matching the standard toolkit shape. |
| `dotnetarium` | `Depth Projects/Dotnetarium` | C#/.NET study system. 13 cmds extract into new `dotnetarium` package. `explore.md` collides with core-workflow. |
| `patternarium` | `Depth Projects/Patternarium` | DSA tutor. 14 cmds extract into new `patternarium` package. `review.md` is generic, may need rename. |
| `carrerkit` | `Depth Projects/CarrerKit` | Resume + job-application tracking. 4 domain cmds. |
| `phonectl` | `Depth Projects/phonectl` | Already a formal consumer (`core-workflow@1.0.0`, 2026-05). Will need both `core-workflow@2` + `docs-workflow@1` after Phase 3. |
| `threadpuller` | `Depth Projects/Threadpuller` | Already a formal consumer (`core-workflow@1.0.0`, 2026-05). Same migration as phonectl. |
| `album-to-movies` | `Collaboration/album-to-movies` | Photo albums to videos (Veo 3). Stuck at v0.001. 13 cmds. |
| `foliosite` | `Codex/FolioSite` | Portfolio site. No `.claude/`. Snapshot is description-only. |
| `logging-lab` | `Daily Builds/experiments/ai/Logging` | .NET logging concept lab. `concept.md`/`contrast.md` rename to `lab-` versions on conversion. |
| `workbench` | `Daily Builds/workbench` | First plib consumer. `daily-builds@1.0.0` already installed. Lock file `source` references Windows path; refresh on next install. |

### External / scan-only

| Snapshot name | Path | Notes |
|---|---|---|
| `cursor-templater-resume` | `Collaboration/Cursor Templater/Resume` | Friend's repo. 21 commands including `/analyze-jd`, `/tailor-resume`, `/ats-check`. Manifest will mark `external: true`. Never write back. |

### Cleanup candidates (Phase 6 prompt-before-act)

Surfaced by the scan; user decides per-item before any move/delete.

| Path | Reason |
|---|---|
| `Cursor/Tasklog` | Older Tasklog copy with friend-style `dev-lead-gemini.md`/`dev-lead-gpt.md`. Mine ideas, then prompt for cleanup. |
| `Depth Projects/Remote Claude` | Dead idea (Anthropic shipped remote control first). |
| `Depth Projects/old/Tasklog` (+ `.zip`) | Superseded by current Tasklog. |
| `Depth Projects/Testing` | User: "junk". |
| `Depth Projects/build` | Possibly stray build output. |
| `Depth Projects/VS Code Extensions` | Status unknown. |
| `Collaboration/Cursor Templater/daily-build` | No README, unclear status. |
| `Collaboration/Cursor Templater/daily-build-old` | "-old" suffix; superseded. |
| `Collaboration/Cursor Templater/New folder` | Default folder name, likely empty. |
| `Codex/FolioSite/hydraInsurgent.github.io` | Nested github.io inside FolioSite. |
| `Website/Github Site/hydraInsurgent.github.io` | Possible duplicate of the above. |
| `Website/Personal Website` | Inside the "stale folders" Website tree. |

### Ignored (never tracked)

- `Antigravity/` - user said ignore
- `Depth Projects/claudecodeui` - third-party
- `Depth Projects/Sources` - external source repos for Dotnetarium
- `Exploration/AI-Tools` - third-party experiments
- `Daily Builds/apis/dotnet/E-CommerceAPI` - daily-build sandbox; reconsider if it grows

## Lineage

Each tracked project's prompts evolved **separately from a common parent**, not from one canonical source. The likely common parent is `Prompt Library/llm-workflow-toolkit/` (last touched 2026-03-15, 27 commands) - the predecessor to this `prompt-library` package format.

Implication for sync: don't treat one project as "ahead" of another. They're parallel branches. When upstreaming, pick the best ideas from each branch rather than picking a winner.

## Sync log

Append an entry each time we upstream changes from a project or push library updates out.

<!-- Format:
### YYYY-MM-DD - <project> -> <package> vX.Y.Z
- What was upstreamed / pushed
- Why
-->

## Candidate packages

Domain commands seen in projects that don't yet warrant their own package; tracked here in case a future project validates them.

See [`candidate-packages.md`](candidate-packages.md) (created when the first candidate is logged).
