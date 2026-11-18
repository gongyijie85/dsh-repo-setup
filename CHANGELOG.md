# Changelog

## [0.1.9] - 2026-11-17

### Changed

- 桌面已从 0.2.1 线升级到 `0.2.2-rc.3`（nightly），冒烟通过后补声明：`dshReleases["0.2.2-rc.3"] = "compatible"`，`engines.dsh` 维持 `>=0.1.0-rc.6 <0.3.0`。
- `repo_setup_scan` 在本机宿主活体可用（本会话工具目录内可见，且在临时 profile 里真实执行成功），工具注册与执行路径未变。
- **修复 `scripts/verify-tool.mjs` 的发布门禁**：仓库目录没有 `node_modules` 时 `@deepseek-ai/dsh-tools` 无法解析，`prepublishOnly` 会直接失败。现在改为明确输出 `SKIP:` 并成功退出（在 profile / 完整检出里仍照常执行），使 `npm publish` 在任意目录可用。
- `dsh.plugin.json` 版本号同步到 0.1.9。
- 0.2.2-rc.1 / rc.2 未单独声明（未在对应构建上冒烟）。

## [0.1.8] - 2026-11-05

### Changed

- 声明对齐 DSH 0.2.1 线：`engines.dsh` 由 `>=0.1.0-rc.6` 收紧为 `>=0.1.0-rc.6 <0.3.0`；`dsh.plugin.json` 同步补上限并把版本号从 0.1.5 对齐到当前版本。
- `dshReleases` 补 `0.2.0-rc.1` / `0.2.1-rc.2` / `0.2.1-rc.3` / `0.2.1-rc.4` / `0.2.1-rc.5`（均 `compatible`）；此前未发布的同批声明改动一并在本版纳入。
- README 的"支持的 DSH 版本"同步为 `>=0.1.0-rc.6 <0.3.0`。
- 0.2.2-rc.1 暂不声明：该线 cordis 4.0 → 4.1、schemastery 3.18 → 3.19，待桌面升级后冒烟再补。

## [0.1.5] - 2026-09-10

### Changed

- **工具注册显式绑定 fiber 生命周期**：`ctx.tools.register(defineTool({...}))` 改为 `ctx.effect(() => ctx.tools.register(defineTool({...})))`，与官方插件约定一致（重载/卸载时随 fiber 释放，避免重复注册与悬挂注册）。
## [0.1.4] - 2026-09-10

### Changed

- 新增 `peerDependencies`：`@deepseek-ai/dsh-tools ">=0.0.1-rc.1 <0.2.0"` 与 `@deepseek-ai/cordis "^4.0.1"`（显式声明宿主契约；`repo_setup_scan` 依赖 dsh-tools 的工具定义路径）。
- `dsh.compatibility.dshReleases` 由 17 键补至 20 键：新增 `0.1.5-alpha.2` / `0.1.5-rc.1` / `0.1.5-rc.2`（均 `compatible`），适配 0.1.5 线宿主；`engines.dsh` 维持 `>=0.1.0-rc.6`。
- README 的"支持的 DSH 版本"由 `>=0.1.1-rc.2` 更正为 `>=0.1.0-rc.6`（与 manifest 一致）。

> 0.1.2 / 0.1.3 未在本文件留条目，本次一并记录当前状态。

## [0.1.1] - 2026-08-16

### Changed

- 新增完整英文 README(`README.en.md`),随 npm 包分发;中文 README 顶部加语言切换链接。
- README 增加徽章(npm / GitHub release / license)与英文简介。
- `repo_setup_scan` 推荐列表改用 npm 包名安装(`mattpocock-skills-dsh`、
  `superpowers-dsh`、`dsh-ponytail-skills`),并补充 `dsh-claude-mem` 与
  `dsh-mcp-manager` 推荐。

## [0.1.0] - 2026-08-16

首个发布版:Anthropic claude-code-setup 的 DeepSeek Harness 对应插件。

### Added

- 只读工具 `repo_setup_scan`(`@deepseek-ai/dsh-tools` 的 `defineTool` 注册):
  - 技术栈识别(Node.js / Python / Rust / Go / Docker / 前端框架 / 测试运行器)
  - 仓库卫生检查(AGENTS.md、git、测试、数据库线索)
  - 一键安装推荐(技能插件 + MCP 服务器)
  - 绝不修改任何文件
- Cordis bundle 插件:`cordis.patch.yml` + `lib/index.js`(零运行时依赖,
  仅 `@deepseek-ai/dsh-tools` peer 依赖)
- 验证脚本 `scripts/verify-tool.mjs`(伪 ctx 注册 + 真实目录扫描冒烟测试)

### License

MIT。
