#!/usr/bin/env node

// plib - Prompt Library CLI
// No external dependencies - Node.js built-ins only

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ---------------------------------------------------------------------------
// ANSI color helpers
// ---------------------------------------------------------------------------

const color = {
  cyan:    (s) => `\x1b[36m${s}\x1b[0m`,
  yellow:  (s) => `\x1b[33m${s}\x1b[0m`,
  green:   (s) => `\x1b[32m${s}\x1b[0m`,
  red:     (s) => `\x1b[31m${s}\x1b[0m`,
  dim:     (s) => `\x1b[2m${s}\x1b[0m`,
  bold:    (s) => `\x1b[1m${s}\x1b[0m`,
};

// ---------------------------------------------------------------------------
// Source path resolution
// ---------------------------------------------------------------------------

function resolveSourcePath() {
  if (process.env.PLIB_HOME) {
    const p = path.resolve(process.env.PLIB_HOME);
    if (!fs.existsSync(p)) {
      console.error(color.red(`Error: PLIB_HOME is set to "${p}" but that directory does not exist.`));
      process.exit(1);
    }
    return p;
  }
  return path.resolve(__dirname, '..');
}

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function readJSON(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

// ---------------------------------------------------------------------------
// Conflict resolution
// ---------------------------------------------------------------------------

/**
 * Prompt the user for conflict resolution.
 * Returns one of: 'replace', 'skip', 'rename', 'append'
 */
function askConflict(filePath) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const relPath = path.relative(process.cwd(), filePath);
    rl.question(
      `  ${color.yellow('Conflict:')} ${relPath} already exists\n` +
      `  [${color.bold('r')}]eplace / [${color.bold('s')}]kip / [${color.bold('n')}]ame / [${color.bold('a')}]ppend > `,
      (answer) => {
        rl.close();
        const key = (answer || '').trim().toLowerCase();
        const map = { r: 'replace', s: 'skip', n: 'rename', a: 'append' };
        resolve(map[key] || 'skip');
      }
    );
  });
}

/**
 * Copy a file with conflict resolution.
 * Returns true if the file was written, false if skipped.
 */
async function copyFileWithConflict(src, dest, packageName) {
  if (fs.existsSync(dest)) {
    const action = await askConflict(dest);
    switch (action) {
      case 'skip':
        return false;
      case 'replace':
        copyFile(src, dest);
        return true;
      case 'rename': {
        const ext = path.extname(dest);
        const base = path.basename(dest, ext);
        const dir = path.dirname(dest);
        const renamed = path.join(dir, `${base}-${packageName}${ext}`);
        copyFile(src, renamed);
        console.log(color.dim(`    → saved as ${path.relative(process.cwd(), renamed)}`));
        return true;
      }
      case 'append': {
        const existing = fs.readFileSync(dest, 'utf-8');
        const incoming = fs.readFileSync(src, 'utf-8');
        const separator = `\n\n<!-- appended from ${packageName} -->\n\n`;
        fs.writeFileSync(dest, existing.trimEnd() + separator + incoming, 'utf-8');
        return true;
      }
      default:
        return false;
    }
  }
  // No conflict - just copy
  copyFile(src, dest);
  return true;
}

/** Compute Levenshtein distance between two strings (for "did you mean?" suggestions). */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/** Suggest similar package names from the registry. */
function suggestSimilar(name, packages, maxDistance = 3) {
  return packages
    .map((p) => ({ name: p.name, dist: levenshtein(name, p.name) }))
    .filter((p) => p.dist <= maxDistance)
    .sort((a, b) => a.dist - b.dist)
    .map((p) => p.name);
}

// ---------------------------------------------------------------------------
// Registry helpers
// ---------------------------------------------------------------------------

function loadRegistry(sourcePath) {
  const registryPath = path.join(sourcePath, 'registry.json');
  if (!fs.existsSync(registryPath)) {
    console.error(color.red('Error: registry.json not found.'));
    console.error(`Looked in: ${sourcePath}`);
    console.error(color.dim('Set the PLIB_HOME environment variable to point to your prompt-library repo.'));
    process.exit(1);
  }
  try {
    return readJSON(registryPath);
  } catch (e) {
    console.error(color.red(`Error: Failed to parse registry.json: ${e.message}`));
    process.exit(1);
  }
}

function findPackage(registry, packageName) {
  return registry.packages.find((p) => p.name === packageName) || null;
}

// ---------------------------------------------------------------------------
// Lock file helpers
// ---------------------------------------------------------------------------

const LOCK_FILE = '.plib-lock.json';

function loadLockFile(cwd) {
  const lockPath = path.join(cwd, LOCK_FILE);
  if (!fs.existsSync(lockPath)) return null;
  try {
    return readJSON(lockPath);
  } catch (e) {
    console.warn(color.yellow(`Warning: ${LOCK_FILE} is malformed (${e.message}). It will be recreated.`));
    return { source: '', installed: {} };
  }
}

function saveLockFile(cwd, lockData) {
  writeJSON(path.join(cwd, LOCK_FILE), lockData);
}

function deleteLockFile(cwd) {
  const lockPath = path.join(cwd, LOCK_FILE);
  if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
}

// ---------------------------------------------------------------------------
// Rules assembly helpers
// ---------------------------------------------------------------------------

const RULES_DIR = '.claude/rules';
const TOOLKIT_FILE = 'toolkit.md';

function rulesFilePath(cwd) {
  return path.join(cwd, RULES_DIR, TOOLKIT_FILE);
}

/** Build an attributed rules section for a package. */
function wrapRulesSection(packageName, version, rulesContent) {
  return `<!-- [${packageName} v${version}] -->\n${rulesContent.trimEnd()}\n<!-- [/${packageName}] -->`;
}

/** Read existing toolkit.md and return its content, or empty string. */
function readToolkit(cwd) {
  const fp = rulesFilePath(cwd);
  if (!fs.existsSync(fp)) return '';
  return fs.readFileSync(fp, 'utf-8');
}

/** Remove a package's section from toolkit.md content. */
function removeSectionFromToolkit(content, packageName) {
  const startTag = `<!-- [${packageName} v`;
  const endTag = `<!-- [/${packageName}] -->`;
  const lines = content.split('\n');
  const result = [];
  let skipping = false;
  for (const line of lines) {
    if (!skipping && line.startsWith(startTag)) {
      skipping = true;
      continue;
    }
    if (skipping && line.trim() === endTag) {
      skipping = false;
      continue;
    }
    if (!skipping) {
      result.push(line);
    }
  }
  // Trim leading/trailing blank lines left by removal
  let text = result.join('\n');
  // Collapse multiple blank lines into at most two
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

/** Write the toolkit.md file (creates directories as needed). */
function writeToolkit(cwd, content) {
  const fp = rulesFilePath(cwd);
  if (!content || !content.trim()) {
    // If empty, remove the file
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    return;
  }
  ensureDir(path.dirname(fp));
  fs.writeFileSync(fp, content.trim() + '\n', 'utf-8');
}

// ---------------------------------------------------------------------------
// Command: list
// ---------------------------------------------------------------------------

function cmdList() {
  const sourcePath = resolveSourcePath();
  const registry = loadRegistry(sourcePath);

  if (registry.packages.length === 0) {
    console.log(color.dim('No packages registered yet.'));
    return;
  }

  // Compute column widths
  const nameWidth = Math.max(...registry.packages.map((p) => p.name.length), 4);
  const verWidth = Math.max(...registry.packages.map((p) => p.version.length), 7);

  console.log(color.bold('Available packages:\n'));
  console.log(
    `  ${color.dim('Name'.padEnd(nameWidth))}  ${color.dim('Version'.padEnd(verWidth))}  ${color.dim('Description')}`
  );
  console.log(`  ${'─'.repeat(nameWidth)}  ${'─'.repeat(verWidth)}  ${'─'.repeat(40)}`);

  for (const pkg of registry.packages) {
    console.log(
      `  ${color.cyan(pkg.name.padEnd(nameWidth))}  ${color.yellow(pkg.version.padEnd(verWidth))}  ${pkg.description}`
    );
  }

  console.log(color.dim(`\n  ${registry.packages.length} package(s) available`));
}

// ---------------------------------------------------------------------------
// Command: status
// ---------------------------------------------------------------------------

function cmdStatus() {
  const cwd = process.cwd();
  const lock = loadLockFile(cwd);

  if (!lock) {
    console.log(color.dim('No packages installed in this project.'));
    return;
  }

  const entries = Object.entries(lock.installed || {});
  if (entries.length === 0) {
    console.log(color.dim('No packages installed in this project.'));
    return;
  }

  const nameWidth = Math.max(...entries.map(([name]) => name.length), 4);
  const verWidth = Math.max(...entries.map(([, info]) => info.version.length), 7);

  console.log(color.bold('Installed packages:\n'));
  console.log(
    `  ${color.dim('Name'.padEnd(nameWidth))}  ${color.dim('Version'.padEnd(verWidth))}  ${color.dim('Installed')}`
  );
  console.log(`  ${'─'.repeat(nameWidth)}  ${'─'.repeat(verWidth)}  ${'─'.repeat(12)}`);

  for (const [name, info] of entries) {
    console.log(
      `  ${color.cyan(name.padEnd(nameWidth))}  ${color.yellow(info.version.padEnd(verWidth))}  ${info.installedAt}`
    );
  }

  console.log(color.dim(`\n  Source: ${lock.source}`));
}

// ---------------------------------------------------------------------------
// Command: install <package>
// ---------------------------------------------------------------------------

async function installPackage(packageName, sourcePath, registry, cwd) {
  const entry = findPackage(registry, packageName);
  if (!entry) {
    console.error(color.red(`Error: Package "${packageName}" not found in registry.`));
    const suggestions = suggestSimilar(packageName, registry.packages);
    if (suggestions.length > 0) {
      console.error(`Did you mean: ${suggestions.map((s) => color.cyan(s)).join(', ')}?`);
    }
    process.exit(1);
  }

  // Read package's plib.json
  const pkgDir = path.join(sourcePath, entry.path);
  const plibJsonPath = path.join(pkgDir, 'plib.json');
  if (!fs.existsSync(plibJsonPath)) {
    console.error(color.red(`Error: Package "${packageName}" is missing plib.json at ${plibJsonPath}`));
    process.exit(1);
  }

  const pkgMeta = readJSON(plibJsonPath);
  const summary = { commands: 0, scripts: 0, templates: 0, rules: false };

  // --- Copy commands ---
  if (pkgMeta.commands && pkgMeta.commands.length > 0) {
    const destDir = path.join(cwd, '.claude', 'commands');
    for (const cmd of pkgMeta.commands) {
      const src = path.join(pkgDir, 'commands', cmd);
      const dest = path.join(destDir, cmd);
      if (fs.existsSync(src)) {
        const written = await copyFileWithConflict(src, dest, pkgMeta.name);
        if (written) summary.commands++;
      } else {
        console.warn(color.yellow(`  Warning: command file not found: ${src}`));
      }
    }
  }

  // --- Copy scripts ---
  if (pkgMeta.scripts && pkgMeta.scripts.length > 0) {
    const destDir = path.join(cwd, 'scripts');
    for (const script of pkgMeta.scripts) {
      const src = path.join(pkgDir, 'scripts', script);
      const dest = path.join(destDir, script);
      if (fs.existsSync(src)) {
        const written = await copyFileWithConflict(src, dest, pkgMeta.name);
        if (written) summary.scripts++;
      } else {
        console.warn(color.yellow(`  Warning: script file not found: ${src}`));
      }
    }
  }

  // --- Copy templates ---
  if (pkgMeta.templates && pkgMeta.templates.length > 0) {
    for (const tpl of pkgMeta.templates) {
      const src = path.join(pkgDir, 'templates', tpl);
      const dest = path.join(cwd, tpl);
      if (fs.existsSync(src)) {
        const written = await copyFileWithConflict(src, dest, pkgMeta.name);
        if (written) summary.templates++;
      } else {
        console.warn(color.yellow(`  Warning: template file not found: ${src}`));
      }
    }
  }

  // --- Assemble rules ---
  if (pkgMeta.rules) {
    const rulesPath = path.join(pkgDir, pkgMeta.rules);
    if (fs.existsSync(rulesPath)) {
      const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
      let toolkit = readToolkit(cwd);

      // Remove existing section for this package (in case of re-install)
      const cleanedToolkit = removeSectionFromToolkit(toolkit, pkgMeta.name);

      // If toolkit.md exists with content from OTHER packages, prompt for conflict
      if (cleanedToolkit.trim() && toolkit.trim()) {
        const section = wrapRulesSection(pkgMeta.name, pkgMeta.version, rulesContent);
        const action = await askConflict(rulesFilePath(cwd));
        switch (action) {
          case 'skip':
            break;
          case 'replace':
            writeToolkit(cwd, section);
            summary.rules = true;
            break;
          case 'rename': {
            // Write this package's rules as a separate file
            const altPath = path.join(cwd, RULES_DIR, `toolkit-${pkgMeta.name}.md`);
            ensureDir(path.dirname(altPath));
            fs.writeFileSync(altPath, section + '\n', 'utf-8');
            console.log(color.dim(`    → saved as ${path.relative(cwd, altPath)}`));
            summary.rules = true;
            break;
          }
          case 'append':
          default:
            // Append is the natural default for rules
            writeToolkit(cwd, cleanedToolkit.trim() + '\n\n' + section);
            summary.rules = true;
            break;
        }
      } else {
        // No conflict - first rules or re-install
        const section = wrapRulesSection(pkgMeta.name, pkgMeta.version, rulesContent);
        if (cleanedToolkit.trim()) {
          writeToolkit(cwd, cleanedToolkit.trim() + '\n\n' + section);
        } else {
          writeToolkit(cwd, section);
        }
        summary.rules = true;
      }
    } else {
      console.warn(color.yellow(`  Warning: rules file not found: ${rulesPath}`));
    }
  }

  // --- Update lock file ---
  let lock = loadLockFile(cwd) || { source: sourcePath, installed: {} };
  lock.source = sourcePath;
  lock.installed[pkgMeta.name] = {
    version: pkgMeta.version,
    installedAt: new Date().toISOString().slice(0, 10),
  };
  saveLockFile(cwd, lock);

  // --- Print summary ---
  const parts = [];
  if (summary.commands > 0)  parts.push(`${summary.commands} command(s)`);
  if (summary.scripts > 0)   parts.push(`${summary.scripts} script(s)`);
  if (summary.templates > 0) parts.push(`${summary.templates} template(s)`);
  if (summary.rules)         parts.push('rules');

  console.log(
    `  ${color.green('✓')} ${color.cyan(pkgMeta.name)} ${color.yellow('v' + pkgMeta.version)} — installed ${parts.join(', ')}`
  );

  // --- Print npm install hint ---
  if (pkgMeta.npmDependencies && Object.keys(pkgMeta.npmDependencies).length > 0) {
    const deps = Object.entries(pkgMeta.npmDependencies)
      .map(([name, ver]) => `${name}@${ver}`)
      .join(' ');
    console.log(`\n  ${color.yellow('npm dependencies required:')}`);
    console.log(`  ${color.bold(`npm install ${deps}`)}`);
  }
}

async function cmdInstall(args) {
  const sourcePath = resolveSourcePath();
  const registry = loadRegistry(sourcePath);
  const cwd = process.cwd();

  // Check for --profile flag
  const profileIdx = args.indexOf('--profile');
  if (profileIdx !== -1) {
    const profileName = args[profileIdx + 1];
    if (!profileName) {
      console.error(color.red('Error: --profile requires a profile name.'));
      console.error('Usage: plib install --profile <name>');
      process.exit(1);
    }
    return cmdInstallProfile(profileName, sourcePath, registry, cwd);
  }

  // Single package install (supports name@version pinning)
  const rawName = args[0];
  if (!rawName) {
    console.error(color.red('Error: No package name specified.'));
    console.error('Usage: plib install <package>[@version]');
    console.error('       plib install --profile <name>');
    process.exit(1);
  }

  // Parse version pin: "review-suite@1.0.0"
  let packageName = rawName;
  let pinnedVersion = null;
  if (rawName.includes('@')) {
    const atIdx = rawName.indexOf('@');
    packageName = rawName.slice(0, atIdx);
    pinnedVersion = rawName.slice(atIdx + 1);
  }

  // Validate pinned version matches registry
  if (pinnedVersion) {
    const entry = findPackage(registry, packageName);
    if (entry && entry.version !== pinnedVersion) {
      console.error(color.red(`Error: Requested ${packageName}@${pinnedVersion} but registry has v${entry.version}.`));
      console.error(color.dim('Version pinning currently checks against the local registry. The requested version must match.'));
      process.exit(1);
    }
  }

  console.log(color.bold(`Installing ${color.cyan(packageName)}${pinnedVersion ? color.yellow('@' + pinnedVersion) : ''}...\n`));
  await installPackage(packageName, sourcePath, registry, cwd);
  console.log(color.dim('\nDone.'));
}

async function cmdInstallProfile(profileName, sourcePath, registry, cwd) {
  const profilePath = path.join(sourcePath, 'profiles', `${profileName}.json`);
  if (!fs.existsSync(profilePath)) {
    console.error(color.red(`Error: Profile "${profileName}" not found.`));
    console.error(`Looked for: ${profilePath}`);

    // List available profiles
    const profileDir = path.join(sourcePath, 'profiles');
    if (fs.existsSync(profileDir)) {
      const files = fs.readdirSync(profileDir).filter((f) => f.endsWith('.json'));
      if (files.length > 0) {
        console.error(`Available profiles: ${files.map((f) => color.cyan(f.replace('.json', ''))).join(', ')}`);
      }
    }
    process.exit(1);
  }

  const profile = readJSON(profilePath);
  console.log(color.bold(`Installing profile "${color.cyan(profile.name)}"...`));
  console.log(color.dim(`  ${profile.description}\n`));

  for (const packageName of profile.packages) {
    await installPackage(packageName, sourcePath, registry, cwd);
  }

  console.log(color.dim(`\n  ${profile.packages.length} package(s) installed from profile "${profile.name}".`));
}

// ---------------------------------------------------------------------------
// Command: remove <package>
// ---------------------------------------------------------------------------

function cmdRemove(args) {
  const packageName = args[0];
  if (!packageName) {
    console.error(color.red('Error: No package name specified.'));
    console.error('Usage: plib remove <package>');
    process.exit(1);
  }

  const cwd = process.cwd();
  const lock = loadLockFile(cwd);

  if (!lock || !lock.installed || !lock.installed[packageName]) {
    console.error(color.red(`Error: Package "${packageName}" is not installed in this project.`));
    if (lock && lock.installed) {
      const installed = Object.keys(lock.installed);
      if (installed.length > 0) {
        console.error(`Installed packages: ${installed.map((n) => color.cyan(n)).join(', ')}`);
      }
    }
    process.exit(1);
  }

  // We need the plib.json to know which files to remove
  const sourcePath = lock.source || resolveSourcePath();
  const registry = loadRegistry(sourcePath);
  const entry = findPackage(registry, packageName);

  if (!entry) {
    console.error(color.red(`Error: Package "${packageName}" not found in registry. Cannot determine files to remove.`));
    console.error(color.dim('You may need to manually clean up files for this package.'));
    // Still remove from lock file
    delete lock.installed[packageName];
    if (Object.keys(lock.installed).length === 0) {
      deleteLockFile(cwd);
    } else {
      saveLockFile(cwd, lock);
    }
    process.exit(1);
  }

  const pkgDir = path.join(sourcePath, entry.path);
  const plibJsonPath = path.join(pkgDir, 'plib.json');
  if (!fs.existsSync(plibJsonPath)) {
    console.error(color.red(`Error: Package plib.json not found at ${plibJsonPath}`));
    process.exit(1);
  }

  const pkgMeta = readJSON(plibJsonPath);
  const summary = { commands: 0, scripts: 0, templates: 0, rules: false };

  console.log(color.bold(`Removing ${color.cyan(packageName)}...\n`));

  // --- Remove commands ---
  if (pkgMeta.commands && pkgMeta.commands.length > 0) {
    for (const cmd of pkgMeta.commands) {
      const fp = path.join(cwd, '.claude', 'commands', cmd);
      if (fs.existsSync(fp)) {
        fs.unlinkSync(fp);
        summary.commands++;
      }
    }
  }

  // --- Remove scripts ---
  if (pkgMeta.scripts && pkgMeta.scripts.length > 0) {
    for (const script of pkgMeta.scripts) {
      const fp = path.join(cwd, 'scripts', script);
      if (fs.existsSync(fp)) {
        fs.unlinkSync(fp);
        summary.scripts++;
      }
    }
  }

  // --- Remove templates ---
  if (pkgMeta.templates && pkgMeta.templates.length > 0) {
    for (const tpl of pkgMeta.templates) {
      const fp = path.join(cwd, tpl);
      if (fs.existsSync(fp)) {
        fs.unlinkSync(fp);
        summary.templates++;
      }
    }
  }

  // --- Remove rules section from toolkit.md ---
  if (pkgMeta.rules) {
    let toolkit = readToolkit(cwd);
    if (toolkit) {
      toolkit = removeSectionFromToolkit(toolkit, pkgMeta.name);
      writeToolkit(cwd, toolkit);
      summary.rules = true;
    }
  }

  // --- Update lock file ---
  delete lock.installed[packageName];
  if (Object.keys(lock.installed).length === 0) {
    deleteLockFile(cwd);
    console.log(color.dim('  No packages remain — removed .plib-lock.json'));
  } else {
    saveLockFile(cwd, lock);
  }

  // --- Print summary ---
  const parts = [];
  if (summary.commands > 0)  parts.push(`${summary.commands} command(s)`);
  if (summary.scripts > 0)   parts.push(`${summary.scripts} script(s)`);
  if (summary.templates > 0) parts.push(`${summary.templates} template(s)`);
  if (summary.rules)         parts.push('rules');

  console.log(
    `  ${color.green('✓')} ${color.cyan(packageName)} — removed ${parts.length > 0 ? parts.join(', ') : 'package entry'}`
  );
  console.log(color.dim('\nDone.'));
}

// ---------------------------------------------------------------------------
// Command: update [package]
// ---------------------------------------------------------------------------

async function cmdUpdate(args) {
  const cwd = process.cwd();
  const lock = loadLockFile(cwd);

  if (!lock || !lock.installed || Object.keys(lock.installed).length === 0) {
    console.error(color.red('No packages installed in this project.'));
    process.exit(1);
  }

  const sourcePath = resolveSourcePath();
  const registry = loadRegistry(sourcePath);

  // If a specific package is named, update just that one
  const packageName = args[0];
  const toUpdate = packageName
    ? [packageName]
    : Object.keys(lock.installed);

  if (packageName && !lock.installed[packageName]) {
    console.error(color.red(`Package "${packageName}" is not installed.`));
    const installed = Object.keys(lock.installed);
    if (installed.length > 0) {
      console.error(`Installed: ${installed.map((n) => color.cyan(n)).join(', ')}`);
    }
    process.exit(1);
  }

  console.log(color.bold(`Updating ${toUpdate.length} package(s)...\n`));

  for (const name of toUpdate) {
    const entry = findPackage(registry, name);
    if (!entry) {
      console.warn(color.yellow(`  Skipping "${name}" — not found in registry.`));
      continue;
    }
    const currentVer = lock.installed[name].version;
    if (currentVer === entry.version) {
      console.log(`  ${color.dim(name)} ${color.dim('v' + currentVer)} — already up to date`);
      continue;
    }
    console.log(`  ${color.cyan(name)} ${color.yellow(currentVer + ' → ' + entry.version)}`);
    await installPackage(name, sourcePath, registry, cwd);
  }

  console.log(color.dim('\nDone.'));
}

// ---------------------------------------------------------------------------
// Command: init
// ---------------------------------------------------------------------------

function cmdInit() {
  const cwd = process.cwd();
  const plibJsonPath = path.join(cwd, 'plib.json');

  if (fs.existsSync(plibJsonPath)) {
    console.error(color.yellow('plib.json already exists in this directory.'));
    process.exit(1);
  }

  const dirName = path.basename(cwd);
  const scaffold = {
    name: dirName,
    version: '1.0.0',
    description: '',
    commands: [],
    rules: 'rules.md',
  };

  writeJSON(plibJsonPath, scaffold);
  ensureDir(path.join(cwd, 'commands'));
  fs.writeFileSync(path.join(cwd, 'rules.md'), '# Rules\n\n<!-- Add package-specific rules here -->\n', 'utf-8');

  console.log(color.green('Initialized new package scaffold:'));
  console.log(`  ${color.dim('plib.json')}     — package manifest`);
  console.log(`  ${color.dim('commands/')}     — place your .md command files here`);
  console.log(`  ${color.dim('rules.md')}      — package rules (assembled into toolkit.md on install)`);
  console.log(color.dim(`\nEdit plib.json to set the name, description, and list your command files.`));
}

// ---------------------------------------------------------------------------
// Command: help
// ---------------------------------------------------------------------------

function cmdHelp() {
  console.log(`
${color.bold('plib')} — Prompt Library CLI

${color.bold('Usage:')}
  plib list                          List all available packages
  plib status                        Show packages installed in this project
  plib install <package>[@version]   Install a package into this project
  plib install --profile <name>      Install all packages in a profile
  plib remove <package>              Remove a package from this project
  plib update [package]              Update installed package(s) to latest
  plib init                          Scaffold a new package in current directory

${color.bold('Options:')}
  --help, -h                         Show this help message

${color.bold('Environment:')}
  PLIB_HOME                          Path to the prompt-library repo
                                     (defaults to the CLI script's parent directory)
`);
}

// ---------------------------------------------------------------------------
// Main: argument parsing and routing
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    cmdHelp();
    return;
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  switch (command) {
    case 'list':
      cmdList();
      break;
    case 'status':
      cmdStatus();
      break;
    case 'install':
      await cmdInstall(commandArgs);
      break;
    case 'remove':
      cmdRemove(commandArgs);
      break;
    case 'update':
      await cmdUpdate(commandArgs);
      break;
    case 'init':
      cmdInit();
      break;
    default:
      console.error(color.red(`Unknown command: "${command}"`));
      console.error('Run "plib --help" to see available commands.');
      process.exit(1);
  }
}

main();
