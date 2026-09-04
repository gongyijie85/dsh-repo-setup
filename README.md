# dsh-repo-setup

[![npm version](https://img.shields.io/npm/v/dsh-repo-setup)](https://www.npmjs.com/package/dsh-repo-setup)
[![GitHub release](https://img.shields.io/github/v/release/gongyijie85/dsh-repo-setup)](https://github.com/gongyijie85/dsh-repo-setup/releases)
[![CI](https://github.com/gongyijie85/dsh-repo-setup/actions/workflows/ci.yml/badge.svg)](https://github.com/gongyijie85/dsh-repo-setup/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-0.1.1--rc.2%2B-4d6bfe)](https://github.com/gongyijie85/dsh-repo-setup)
[![-仓库体检](https://img.shields.io/badge/-仓库体检-4d6bfe)]() [![-只读扫描](https://img.shields.io/badge/-只读扫描-4d6bfe)]() [![-推荐安装](https://img.shields.io/badge/-推荐安装-4d6bfe)]() [![-MCP](https://img.shields.io/badge/-MCP-4d6bfe)]()

<div align="center">

[English](README.en.md) | **简体中文**

</div>

仓库体检引导插件 —— Anthropic **claude-code-setup** 的 DeepSeek Harness 版。

注册一个**只读**工具 `repo_setup_scan`:扫描项目目录的语言栈、测试设置、
文档、git、Docker 与数据库线索,然后给出设置建议:该装哪些 DSH 技能插件、
该挂哪些 MCP 服务器、该补哪些卫生文件。**绝不修改任何东西。**

## 安装

**支持的 DSH 版本**：`>=0.1.1-rc.2`（已在上线版本验证，兼容更高版本）。

```sh
# npm
dsh plugin --profile web add dsh-repo-setup

# GitHub
dsh plugin --profile web add github:gongyijie85/dsh-repo-setup

# 本地开发
dsh plugin --profile web add D:\plugins\dsh-repo-setup
```

装完重启 profile(`dsh web`),模型会在进入新/陌生仓库时自动调用
`repo_setup_scan`(也可在对话里直接要求"扫描这个仓库怎么配置")。

## 工具:repo_setup_scan

| 参数 | 说明 |
| --- | --- |
| `path` | 要扫描的项目目录;缺省为当前工作目录 |

输出 Markdown 报告:

- **Detected stack** — package.json / pyproject.toml / Cargo.toml / go.mod /
  Dockerfile 等标记识别的技术栈(含前端框架与测试运行器探测)
- **Repo hygiene** — AGENTS.md 缺失、git 未初始化、无测试、数据库线索
- **Recommended installs** — 一键命令:
  - `mattpocock-skills-dsh`(grilling/to-spec/to-tickets/tdd/code-review 工作流)
  - `mattpocock-skills-dsh-zh`(中文技能版,与英文版二选一)
  - `superpowers-dsh`(规划→TDD→评审方法论)
  - `dsh-ponytail-skills`(防过度工程)
  - `dsh-ecc-skills`(ECC 273 技能:模式/编排/垂直领域)
  - `dsh-claude-mem`(可选:跨会话记忆)
  - `dsh-mcp-manager`(挂载下方 MCP 用)
  - MCP:context7(库文档)、playwright(前端)、postgres、github(按检测结果)

## 工作原理

- **Bundle 层** —— `cordis.patch.yml` 在 dsh-base 层插入插件行。
- **工具** —— `lib/index.js` 用 `@deepseek-ai/dsh-tools` 的 `defineTool` 注册
  `repo_setup_scan`,只读探测(读有限个已知文件 + 顶层目录列表),不做任何写入。
- **零运行时依赖** —— 除 harness 注入的 `@deepseek-ai/dsh-tools` peer 依赖外
  只用 Node 内置模块。

## 开发验证

```sh
node --check lib/index.js
# 功能冒烟(伪 ctx 注册 + 直接调 scanRepo 逻辑见 scripts/verify-tool.mjs)
node scripts/verify-tool.mjs
```

## 许可证

MIT。见 [LICENSE](LICENSE)。
