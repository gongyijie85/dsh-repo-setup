# Changelog

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
