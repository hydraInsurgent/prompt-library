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
// Comment syntax by file extension
// ---------------------------------------------------------------------------

const COMMENT_STYLES = {
  // Markdown / HTML
  '.md':   { start: '<!-- ', end: ' -->' },
  '.html': { start: '<!-- ', end: ' -->' },
  '.xml':  { start: '<!-- ', end: ' -->' },
  '.svg':  { start: '<!-- ', end: ' -->' },
  // JavaScript / TypeScript / C-style
  '.js':   { start: '// ', end: '' },
  '.ts':   { start: '// ', end: '' },
  '.jsx':  { start: '// ', end: '' },
  '.tsx':  { start: '// ', end: '' },
  '.mjs':  { start: '// ', end: '' },
  '.cjs':  { start: '// ', end: '' },
  '.css':  { start: '/* ', end: ' */' },
  '.scss': { start: '/* ', end: ' */' },
  '.less': { start: '/* ', end: ' */' },
  '.json': { start: '// ', end: '' },
  '.java': { start: '// ', end: '' },
  '.c':    { start: '// ', end: '' },
  '.h':    { start: '// ', end: '' },
  '.cpp':  { start: '// ', end: '' },
  '.cs':   { start: '// ', end: '' },
  '.go':   { start: '// ', end: '' },
  '.rs':   { start: '// ', end: '' },
  '.swift':{ start: '// ', end: '' },
  '.kt':   { start: '// ', end: '' },
  // Shell / scripting
  '.sh':   { start: '# ', end: '' },
  '.bash': { start: '# ', end: '' },
  '.zsh':  { start: '# ', end: '' },
  '.ps1':  { start: '# ', end: '' },
  '.py':   { start: '# ', end: '' },
  '.rb':   { start: '# ', end: '' },
  '.yml':  { start: '# ', end: '' },
  '.yaml': { start: '# ', end: '' },
  '.toml': { start: '# ', end: '' },
  // SQL
  '.sql':  { start: '-- ', end: '' },
};

/** Get comment syntax for a file, based on its extension. Falls back to # style. */
function getCommentStyle(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return COMMENT_STYLES[ext] || { start: '# ', end: '' };
}

/** Wrap text in the correct comment syntax for a given file. */
function makeComment(filePath, text) {
  const style = getCommentStyle(filePath);
  return `${style.start}${text}${style.end}`;
}

// ---------------------------------------------------------------------------
// Conflict resolution
// ---------------------------------------------------------------------------

// Tracks the user's "apply to all" choice. null means ask each time.
let conflictApplyAll = null;

/**
 * Prompt the user for conflict resolution.
 * Returns one of: 'replace', 'skip', 'rename', 'append'
 */
function askConflict(filePath) {
  // If user previously chose "apply to all", use that choice
  if (conflictApplyAll) {
    const relPath = path.relative(process.cwd(), filePath);
    console.log(`  ${color.yellow('Conflict:')} ${relPath} already exists → ${color.dim(conflictApplyAll + ' (all)')}`);
    return Promise.resolve(conflictApplyAll);
  }

  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const relPath = path.relative(process.cwd(), filePath);
    rl.question(
      `  ${color.yellow('Conflict:')} ${relPath} already exists\n` +
      `  [${color.bold('r')}]eplace / [${color.bold('s')}]kip / [${color.bold('n')}]ame / [${color.bold('a')}]ppend / apply [${color.bold('R')}] [${color.bold('S')}] [${color.bold('A')}] to all > `,
      (answer) => {
        rl.close();
        const raw = (answer || '').trim();
        // Uppercase = apply to all remaining conflicts
        const allMap = { R: 'replace', S: 'skip', A: 'append' };
        if (allMap[raw]) {
          conflictApplyAll = allMap[raw];
          console.log(color.dim(`    → applying "${conflictApplyAll}" to all remaining conflicts`));
          resolve(conflictApplyAll);
          return;
        }
        const key = raw.toLowerCase();
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
        const comment = makeComment(dest, `appended from ${packageName}`);
        const separator = `\n\n${comment}\n\n`;
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
// Agent catalog helpers
// ---------------------------------------------------------------------------

/**
 * Parse YAML frontmatter from a markdown file.
 * Handles quoted and unquoted values. Returns {} if no frontmatter found.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) result[key] = val;
  }
  return result;
}

/**
 * Scan a single category directory and return a category object, or null if empty.
 * @param {string} categoryDir - Absolute path to the category folder
 * @param {string} categoryName - Display name (folder name)
 * @param {boolean} isCustom - True for my-agents entries (shown first, tagged [custom])
 */
function scanCategory(categoryDir, categoryName, isCustom) {
  if (!fs.existsSync(categoryDir)) return null;
  const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith('.md'));
  if (files.length === 0) return null;

  const agents = files.map((filename) => {
    const raw = fs.readFileSync(path.join(categoryDir, filename), 'utf-8');
    const meta = parseFrontmatter(raw);
    return {
      filename,
      name: meta.name || filename.replace('.md', ''),
      description: meta.description || '',
      emoji: meta.emoji || '',
      category: categoryName,
      sourcePath: path.join(categoryDir, filename),
      isCustom,
    };
  });

  return { name: categoryName, agents, isCustom };
}

/**
 * Scan the full agent catalog from a package directory.
 * Reads my-agents/ (custom) first, then source/ categories alphabetically.
 * Skips the scripts/ folder and any dot-folders inside source/.
 * @param {string} pkgDir - Absolute path to the agents package directory
 * @returns {Array} Array of category objects: { name, agents[], isCustom }
 */
function scanAgentCatalog(pkgDir) {
  const categories = [];

  // my-agents/ - user custom agents, shown first
  const myAgentsDir = path.join(pkgDir, 'my-agents');
  if (fs.existsSync(myAgentsDir)) {
    const entries = fs.readdirSync(myAgentsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const cat = scanCategory(path.join(myAgentsDir, entry.name), entry.name, true);
      if (cat) categories.push(cat);
    }
  }

  // source/ - embedded agency-agents repo
  const sourceDir = path.join(pkgDir, 'source');
  if (fs.existsSync(sourceDir)) {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    const sorted = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'scripts')
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of sorted) {
      const cat = scanCategory(path.join(sourceDir, entry.name), entry.name, false);
      if (cat) categories.push(cat);
    }
  }

  return categories;
}

/**
 * Parse a selection string like "1,3,5-7" into an array of 0-based indices.
 * Invalid entries and out-of-range numbers are silently ignored.
 */
function parseSelection(input, max) {
  const indices = new Set();
  for (const part of input.split(',')) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [a, b] = trimmed.split('-').map((s) => parseInt(s.trim(), 10));
      if (!isNaN(a) && !isNaN(b)) {
        for (let i = Math.max(1, a); i <= Math.min(max, b); i++) indices.add(i - 1);
      }
    } else {
      const n = parseInt(trimmed, 10);
      if (!isNaN(n) && n >= 1 && n <= max) indices.add(n - 1);
    }
  }
  return [...indices].sort((a, b) => a - b);
}

/**
 * Prompt the user to select a category from the catalog.
 * Custom categories are shown with a [custom] tag.
 * Returns the chosen category object.
 */
function promptCategorySelect(categories) {
  return new Promise((resolve) => {
    console.log(color.bold('\nAgent Categories:\n'));
    const numWidth = String(categories.length).length;
    const nameWidth = Math.max(...categories.map((c) => c.name.length));
    categories.forEach((cat, i) => {
      const tag = cat.isCustom ? color.green(' [custom]') : '';
      const count = color.dim(cat.agents.length + ' agent' + (cat.agents.length === 1 ? '' : 's'));
      console.log(
        `  ${color.cyan((i + 1).toString().padStart(numWidth))}  ${cat.name.padEnd(nameWidth)}  ${count}${tag}`
      );
    });
    console.log();

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`Select category (1-${categories.length}): `, (answer) => {
      rl.close();
      const n = parseInt(answer.trim(), 10);
      if (isNaN(n) || n < 1 || n > categories.length) {
        console.error(color.red('Invalid selection.'));
        process.exit(1);
      }
      resolve(categories[n - 1]);
    });
  });
}

/**
 * Prompt the user to select agents within a category.
 * Supports comma/range selection (e.g. "1,3,5-7") or "all" (requires confirmation).
 * Returns an array of selected agent objects.
 */
function promptAgentSelect(agents, categoryName) {
  return new Promise((resolve) => {
    console.log(color.bold(`\n${categoryName}:\n`));
    const numWidth = String(agents.length).length;
    const nameWidth = Math.max(...agents.map((a) => a.name.length));
    agents.forEach((agent, i) => {
      const emoji = agent.emoji ? agent.emoji + ' ' : '';
      const truncDesc = agent.description.length > 55
        ? agent.description.slice(0, 52) + '...'
        : agent.description;
      const desc = truncDesc ? color.dim('  ' + truncDesc) : '';
      console.log(
        `  ${color.cyan((i + 1).toString().padStart(numWidth))}  ${emoji}${agent.name.padEnd(nameWidth)}${desc}`
      );
    });
    console.log();

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`Select agents (e.g. 1,3,5-7 or 'all'): `, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();

      if (trimmed === 'all') {
        // Require explicit confirmation before installing all
        const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl2.question(
          `  Confirm: install all ${color.yellow(agents.length)} agents from "${categoryName}"? [y/N]: `,
          (confirm) => {
            rl2.close();
            if (confirm.trim().toLowerCase() === 'y') {
              resolve(agents);
            } else {
              console.log(color.dim('  Cancelled.'));
              resolve([]);
            }
          }
        );
        return;
      }

      const indices = parseSelection(trimmed, agents.length);
      if (indices.length === 0) {
        console.error(color.red('No valid selections.'));
        process.exit(1);
      }
      resolve(indices.map((i) => agents[i]));
    });
  });
}

/**
 * Install agents from the catalog into .claude/agents/ in the target project.
 * When directAgentName is provided, skips the interactive selector.
 * Tracks installed filenames in the lock file under installed.agents.files[].
 *
 * TODO: per-tool destination config - .claude/agents/ is hardcoded for Claude Code.
 * In future, a tool config could route agents to Cursor (.cursor/rules/), Codex, etc.
 *
 * @param {object} pkgMeta - Parsed plib.json for the agents package
 * @param {string} pkgDir  - Absolute path to the agents package directory
 * @param {string} cwd     - Target project directory
 * @param {string|null} directAgentName - Filename to install directly, or null for selector
 */
async function cmdInstallAgents(pkgMeta, pkgDir, cwd, directAgentName) {
  const destDir = path.join(cwd, '.claude', 'agents');
  const categories = scanAgentCatalog(pkgDir);

  if (categories.length === 0) {
    console.error(color.red('No agents found in catalog.'));
    console.error(color.dim(`Looked in: ${pkgDir}`));
    process.exit(1);
  }

  let toInstall = [];

  if (directAgentName) {
    // Direct install - search all categories for the named file
    const name = directAgentName.endsWith('.md') ? directAgentName : directAgentName + '.md';
    for (const cat of categories) {
      const found = cat.agents.find((a) => a.filename === name);
      if (found) { toInstall = [found]; break; }
    }
    if (toInstall.length === 0) {
      console.error(color.red(`Agent "${directAgentName}" not found in catalog.`));
      process.exit(1);
    }
  } else {
    // Interactive flow: pick category, then pick agents
    const category = await promptCategorySelect(categories);
    toInstall = await promptAgentSelect(category.agents, category.name);
  }

  if (toInstall.length === 0) {
    console.log(color.dim('\nNo agents selected.'));
    return;
  }

  console.log();
  const installedFiles = [];
  for (const agent of toInstall) {
    const dest = path.join(destDir, agent.filename);
    const written = await copyFileWithConflict(agent.sourcePath, dest, 'agents');
    if (written) {
      console.log(`  ${color.green('✓')} ${agent.filename}`);
      installedFiles.push(agent.filename);
    }
  }

  if (installedFiles.length === 0) {
    console.log(color.dim('\nNo agents installed (all skipped).'));
    return;
  }

  // Update lock file - merge with any previously installed agent files
  const sourcePath = resolveSourcePath();
  let lock = loadLockFile(cwd) || { source: sourcePath, installed: {} };
  lock.source = sourcePath;
  const prev = lock.installed['agents'] || { version: pkgMeta.version, files: [] };
  const fileSet = new Set(prev.files || []);
  for (const f of installedFiles) fileSet.add(f);
  lock.installed['agents'] = {
    version: pkgMeta.version,
    installedAt: new Date().toISOString().slice(0, 10),
    files: [...fileSet].sort(),
  };
  saveLockFile(cwd, lock);

  console.log(color.dim(`\n${installedFiles.length} agent(s) installed to .claude/agents/`));
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

async function installPackage(packageName, sourcePath, registry, cwd, extraArgs = []) {
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

  // --- Agent catalog: delegate to interactive installer ---
  if (pkgMeta.type === 'agent-catalog') {
    await cmdInstallAgents(pkgMeta, pkgDir, cwd, extraArgs[0] || null);
    return;
  }

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
      const section = wrapRulesSection(pkgMeta.name, pkgMeta.version, rulesContent);
      let toolkit = readToolkit(cwd);

      // Remove any existing section for this package (in case of re-install)
      const cleanedToolkit = removeSectionFromToolkit(toolkit, pkgMeta.name);

      if (cleanedToolkit.trim()) {
        // toolkit.md has content from OTHER packages - prompt for conflict
        const action = await askConflict(rulesFilePath(cwd));
        switch (action) {
          case 'skip':
            break;
          case 'replace':
            writeToolkit(cwd, section);
            summary.rules = true;
            break;
          case 'rename': {
            const altPath = path.join(cwd, RULES_DIR, `toolkit-${pkgMeta.name}.md`);
            ensureDir(path.dirname(altPath));
            fs.writeFileSync(altPath, section + '\n', 'utf-8');
            console.log(color.dim(`    → saved as ${path.relative(cwd, altPath)}`));
            summary.rules = true;
            break;
          }
          case 'append':
            writeToolkit(cwd, cleanedToolkit.trim() + '\n\n' + section);
            summary.rules = true;
            break;
          default:
            break;
        }
      } else {
        // No conflict - first package or re-install of the only package
        writeToolkit(cwd, section);
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
  // Reset apply-all choice for each install invocation
  conflictApplyAll = null;

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
  // Pass remaining args (after the package name) so agent-catalog can receive a direct agent name
  await installPackage(packageName, sourcePath, registry, cwd, args.slice(1));
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

  // --- Agent catalog: remove only the tracked agent files ---
  if (pkgMeta.type === 'agent-catalog') {
    const installedFiles = (lock.installed[packageName] || {}).files || [];
    const agentDestDir = path.join(cwd, '.claude', 'agents');
    let removed = 0;

    console.log(color.bold(`Removing ${color.cyan(packageName)}...\n`));

    for (const filename of installedFiles) {
      const fp = path.join(agentDestDir, filename);
      if (fs.existsSync(fp)) {
        fs.unlinkSync(fp);
        console.log(`  ${color.green('✓')} removed ${filename}`);
        removed++;
      }
    }

    delete lock.installed[packageName];
    if (Object.keys(lock.installed).length === 0) {
      deleteLockFile(cwd);
      console.log(color.dim('  No packages remain — removed .plib-lock.json'));
    } else {
      saveLockFile(cwd, lock);
    }

    console.log(
      `\n  ${color.green('✓')} ${color.cyan(packageName)} — removed ${removed} agent file(s)`
    );
    console.log(color.dim('\nDone.'));
    return;
  }

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
