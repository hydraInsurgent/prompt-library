# Contributing

## Creating a New Package

1. Create a directory under `packages/`:
   ```bash
   plib init
   # or manually: mkdir packages/my-package
   ```

2. Add your command files to `commands/`:
   ```
   packages/my-package/
   ├── plib.json
   ├── commands/
   │   ├── my-command.md
   │   └── another-command.md
   └── rules.md
   ```

3. Edit `plib.json`:
   ```json
   {
     "name": "my-package",
     "version": "1.0.0",
     "description": "Short description shown in plib list",
     "commands": ["my-command.md", "another-command.md"],
     "rules": "rules.md"
   }
   ```

4. Write `rules.md` with any behavioral rules specific to your commands.

5. Register the package in `registry.json` at the repo root:
   ```json
   {
     "name": "my-package",
     "version": "1.0.0",
     "description": "Short description",
     "path": "packages/my-package"
   }
   ```

6. Test it:
   ```bash
   mkdir /tmp/test-project && cd /tmp/test-project
   node /path/to/prompt-library/cli/plib.js install my-package
   ```

## Package Schema

See [PACKAGE-SPEC.md](PACKAGE-SPEC.md) for the full schema reference.

## Key Conventions

- Command filenames must be unique across all packages (they share `.claude/commands/`)
- Each package's `rules.md` is wrapped in attribution comments when assembled into `toolkit.md`
- Keep `plib.json` version in sync with `registry.json`
- Bump the version when you change command behavior

## Common Mistakes

These have caused real bugs. Check before shipping a new package:

### plib.json field types

| Field | Correct | Wrong | What happens |
|---|---|---|---|
| `commands` | `["cmd.md", "other.md"]` | `["cmd", "other"]` | CLI can't find files - "command file not found" warnings |
| `rules` | `"rules.md"` | `true` | CLI crashes with `ERR_INVALID_ARG_TYPE` on `path.join` |
| `scripts` | `["helper.js"]` | `"helper.js"` | CLI skips scripts (expects array) |
| `templates` | `["CLAUDE.md"]` | `"CLAUDE.md"` | CLI skips templates (expects array) |

### File naming
- Commands **must** include the `.md` extension in plib.json: `"my-command.md"` not `"my-command"`
- Command filenames must be unique across ALL packages. Check existing packages before naming.
- Use kebab-case for everything: `lab-learn.md` not `labLearn.md` or `lab_learn.md`

### Version sync
- `plib.json` version and `registry.json` version for the same package **must** match
- After bumping a version in plib.json, update registry.json in the same commit

### Rules content
- `rules.md` must be a standalone file, not a boolean flag
- Rules should contain behavioral instructions for Claude, not documentation for humans
- Do not duplicate rules content in `templates/CLAUDE.md` - rules go in rules.md, project overview goes in CLAUDE.md

### Testing
- Always test with `plib install <package>` in a throwaway directory before committing
- Verify: commands copied, rules assembled into toolkit.md, templates copied, no warnings or crashes
