# Changelog

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
