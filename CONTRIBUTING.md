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
