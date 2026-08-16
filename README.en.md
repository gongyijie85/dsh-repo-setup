# dsh-repo-setup

[![npm version](https://img.shields.io/npm/v/dsh-repo-setup)](https://www.npmjs.com/package/dsh-repo-setup)
[![GitHub release](https://img.shields.io/github/v/release/gongyijie85/dsh-repo-setup)](https://github.com/gongyijie85/dsh-repo-setup/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Repo bootstrap guidance for the **DeepSeek Harness (DSH)** — the counterpart of
Anthropic's **claude-code-setup**.

Registers one **read-only** tool, `repo_setup_scan`: it inspects a project
directory (language stack, test setup, docs, git, Docker and database hints)
and returns setup recommendations — which DSH skill plugins to install, which
MCP servers to mount, which hygiene files to create. **It never modifies
anything.**

## Install

```sh
# npm
dsh plugin --profile web add dsh-repo-setup

# GitHub
dsh plugin --profile web add github:gongyijie85/dsh-repo-setup

# Local folder (development)
dsh plugin --profile web add D:\plugins\dsh-repo-setup
```

Restart the profile (`dsh web`). The model then calls `repo_setup_scan`
automatically when entering a new or unfamiliar repository (or just ask:
"scan this repo and tell me how to set it up").

## Tool: repo_setup_scan

| Parameter | Description |
| --- | --- |
| `path` | Project directory to scan. Defaults to the current working directory. |

Outputs a Markdown report:

- **Detected stack** — stack markers (package.json / pyproject.toml /
  Cargo.toml / go.mod / Dockerfile, ...) including frontend frameworks and
  test runners
- **Repo hygiene** — missing AGENTS.md, git not initialized, no tests,
  database hints
- **Recommended installs** — one-command installs:
  - `mattpocock-skills-dsh` (grilling / to-spec / to-tickets / tdd /
    code-review workflow)
  - `superpowers-dsh` (planning → TDD → review methodology)
  - `dsh-ponytail-skills` (anti-over-engineering)
  - `dsh-claude-mem` (optional: cross-session memory)
  - `dsh-mcp-manager` (to mount the MCP servers below)
  - MCP servers: context7 (library docs), playwright (frontend), postgres,
    github (depending on what the scan detects)

## How it works

- **Bundle layer** — `cordis.patch.yml` inserts a plugin row over the dsh-base
  layer.
- **Tool** — `lib/index.js` registers `repo_setup_scan` with `defineTool`
  from `@deepseek-ai/dsh-tools`; the scan is read-only (a bounded set of known
  files + top-level directory listing), with no writes at all.
- **Zero runtime dependencies** — Node built-ins plus the harness-injected
  `@deepseek-ai/dsh-tools` peer dependency.

## Development / verification

```sh
node --check lib/index.js
node scripts/verify-tool.mjs   # fake-ctx registration + scan against real dirs
```

## License

MIT. See [LICENSE](LICENSE).
