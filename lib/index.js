// dsh-repo-setup: repo bootstrap guidance for the DeepSeek Harness.
//
// A Cordis plugin registering one read-only tool, `repo_setup_scan`, on the
// `ctx.tools` registry. The tool inspects a project directory (stack markers,
// test setup, docs, git, docker, db hints) and returns a curated setup
// recommendation: which DSH skill plugins to install, which MCP servers to
// mount, and which hygiene files to create. It never modifies anything.
//
// This is the DSH counterpart of Anthropic's claude-code-setup plugin.
//
// @module dsh-repo-setup
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { defineTool } from '@deepseek-ai/dsh-tools'

const name = 'dsh-repo-setup'
const inject = ['tools']

/** Marker files and the stack label they imply. */
const STACK_MARKERS = [
  ['package.json', 'Node.js'],
  ['pnpm-workspace.yaml', 'Node.js (pnpm workspace)'],
  ['pyproject.toml', 'Python (pyproject)'],
  ['requirements.txt', 'Python'],
  ['Cargo.toml', 'Rust'],
  ['go.mod', 'Go'],
  ['pom.xml', 'Java (Maven)'],
  ['build.gradle', 'Java (Gradle)'],
  ['Gemfile', 'Ruby'],
  ['composer.json', 'PHP'],
  ['*.sln', 'dotnet'],
  ['Makefile', 'Make (multi-lang)'],
  ['CMakeLists.txt', 'C/C++ (CMake)'],
  ['Dockerfile', 'Docker'],
  ['docker-compose.yml', 'Docker Compose'],
]

/** Files that indicate a test setup. */
const TEST_MARKERS = ['vitest.config.*', 'jest.config.*', 'pytest.ini', 'tox.ini', 'Cargo.toml', 'go.mod', '*.test.js', '*.spec.ts', 'tests/', 'test/']

/** Presence of a frontend framework among package.json dependencies. */
const FRONTEND_DEPS = ['react', 'vue', 'next', 'nuxt', 'svelte', 'angular', 'solid-js', 'vite', 'astro']

/** Presence of a database hint. */
const DB_HINTS = ['postgres', 'postgresql', 'DATABASE_URL', 'pg', 'mysql', 'mariadb', 'sqlite', 'mongodb', 'redis']

/**
 * Read a small text file, tolerating absence.
 * @param root - directory to look in.
 * @param file - relative file name.
 * @returns file contents or undefined.
 */
async function tryRead(root, file) {
  try {
    return await readFile(join(root, file), 'utf8')
  } catch {
    return undefined
  }
}

/**
 * List top-level entries of a directory, tolerating absence.
 * @param root - directory to scan.
 * @returns entry names (files and dirs), or [].
 */
async function listTop(root) {
  try {
    return await readdir(root, { withFileTypes: true })
  } catch {
    return []
  }
}

/**
 * Run the read-only repo scan.
 * @param root - the project directory to inspect.
 * @returns a markdown report string.
 */
async function scanRepo(root) {
  const entries = await listTop(root)
  const names = new Set(entries.map((e) => e.name))
  const dirs = new Set(entries.filter((e) => e.isDirectory()).map((e) => e.name))
  const files = new Set(entries.filter((e) => e.isFile()).map((e) => e.name))

  const lines = []
  lines.push(`# Repo setup scan: \`${root}\``)
  lines.push('')

  // --- stack ---
  const stacks = STACK_MARKERS.filter(([m]) => names.has(m) || (m.includes('*') && [...names].some((n) => n.endsWith(m.slice(1)))))
    .map(([, label]) => label)
  const pkg = await tryRead(root, 'package.json')
  let deps = {}
  if (pkg) {
    try {
      const parsed = JSON.parse(pkg)
      deps = { ...(parsed.dependencies ?? {}), ...(parsed.devDependencies ?? {}) }
    } catch {
      lines.push('- ⚠️ package.json exists but is not valid JSON.')
    }
  }
  const depNames = Object.keys(deps)
  if (depNames.some((d) => FRONTEND_DEPS.includes(d))) stacks.push('Frontend (web framework detected)')
  if (depNames.includes('vitest') || depNames.includes('jest') || depNames.includes('playwright')) stacks.push('JS test runner detected')
  lines.push(`**Detected stack:** ${stacks.length ? [...new Set(stacks)].join(', ') : 'unknown (no common marker found)'}`)

  // --- hygiene ---
  lines.push('')
  lines.push('## Repo hygiene')
  if (names.has('AGENTS.md') || names.has('CLAUDE.md')) {
    lines.push('- ✅ `AGENTS.md` / `CLAUDE.md` present.')
  } else {
    lines.push('- ❌ No `AGENTS.md` / `CLAUDE.md` — agents start with zero repo conventions. Create one (writing-for-agents skill can draft it).')
  }
  if (names.has('.git')) {
    lines.push('- ✅ Git repository initialized.')
  } else {
    lines.push('- ❌ Not a git repository — run `git init` before starting work.')
  }
  if (dirs.has('.github')) {
    lines.push('- ✅ GitHub Actions directory present.')
  }
  const hasTests =
    depNames.some((d) => ['vitest', 'jest', 'playwright', 'mocha', 'cypress', 'pytest', 'unittest'].includes(d)) ||
    dirs.has('tests') || dirs.has('test') ||
    [...names].some((n) => /\.(test|spec)\./.test(n))
  lines.push(hasTests ? '- ✅ Test setup detected.' : '- ⚠️ No tests detected — consider test-first work (tdd skill).')
  const dbHints = [...new Set([...depNames, (await tryRead(root, '.env.example')) ?? '', (await tryRead(root, '.env')) ?? ''].join('\n').match(/postgres|mysql|mariadb|sqlite|mongodb|redis|DATABASE_URL/g) ?? [])]
  if (dbHints.length) {
    lines.push(`- 🗄️ Database hints: ${dbHints.join(', ')}.`)
  }

  // --- recommendations ---
  lines.push('')
  lines.push('## Recommended installs')
  const installs = []
  installs.push('mattpocock-skills-dsh — grilling / to-spec / to-tickets / tdd / code-review workflow (25 skills)')
  installs.push('superpowers-dsh — brainstorming → plans → TDD → review methodology')
  installs.push('dsh-ponytail — lazy senior dev mode (anti-over-engineering)')
  if (hasTests || stacks.some((s) => s.includes('test'))) installs.push('(tdd skill is included in both packs above)')
  lines.push(`- \`dsh plugin --profile web add mattpocock-skills-dsh\``)
  lines.push(`- \`dsh plugin --profile web add superpowers-dsh\``)
  lines.push(`- \`dsh plugin --profile web add dsh-ponytail-skills\``)
  lines.push(`- \`dsh plugin --profile web add dsh-ecc-skills\`  (ECC skills, 273 curated)`)
  lines.push(`- \`dsh plugin --profile web add mattpocock-skills-dsh-zh\`  (中文技能版,二选一 with the English pack)`)
  lines.push(`- \`dsh plugin --profile web add github:Bleed00/dsh-claude-mem\`  (optional: cross-session memory)`)
  lines.push(`- \`dsh plugin --profile web add github:Nichts0v0/dsh-mcp-manager\`  (to mount the MCP servers below)`)
  if (stacks.some((s) => s.includes('Node') || s.includes('Rust') || s.includes('Python') || s.includes('Go'))) {
    lines.push('')
    lines.push('**MCP servers to mount** (via the DSH MCP manager / Settings → MCP):')
    lines.push('- `context7` (https://mcp.context7.com/mcp) — up-to-date library docs, kills hallucinated APIs')
  }
  if (stacks.some((s) => s.includes('Frontend'))) {
    lines.push('- `playwright` (official Playwright MCP) — browser automation for the UI work')
  }
  if (dbHints.includes('postgres') || dbHints.includes('pg') || dbHints.includes('DATABASE_URL')) {
    lines.push('- `postgres` (crystaldba/postgres-mcp) — schema/query help')
  }
  if (dirs.has('.github')) {
    lines.push('- `github` (official GitHub MCP via GitRuozhi/dsh-github-mcp) — issues/PRs in context')
  }

  // --- summary ---
  lines.push('')
  lines.push('## Notes')
  lines.push('- This scan is read-only: it never modified the repository.')
  lines.push('- Re-run `repo_setup_scan` after the repo changes to refresh recommendations.')
  lines.push('- Full plugin index: https://github.com/Dominic789654/awesome-deepseek-harness')
  return lines.join('\n')
}

/** Register the read-only repo setup scanner. */
function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'repo_setup_scan',
    description: 'Read-only bootstrap scan of a project directory: detects language stack, test setup, docs, git, docker and database hints, ' +
      'then recommends which DSH skill plugins to install (mattpocock-skills-dsh, superpowers-dsh, dsh-ponytail), which MCP servers to ' +
      'mount (context7, playwright, postgres, github), and which hygiene files to create. ' +
      'Use when starting work in a new or unfamiliar repository, or when the user asks what to install / how to set this repo up. ' +
      'Never modifies anything.',
    parameters: {
      path: {
        type: 'string',
        description: 'Project directory to scan. Defaults to the current working directory.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    execute: (args) => scanRepo(args.path ?? process.cwd()),
    timeoutMs: 15000,
  }))
}

export { apply, name, inject }
export default { apply, name, inject }
