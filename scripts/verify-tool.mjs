// verify-tool.mjs — functional smoke test for the dsh-repo-setup tool,
// without booting a DSH profile.
//
// Fakes the ctx.tools.register surface, captures the tool descriptor built by
// defineTool, then executes it against real directories and checks the report.
//
// 注意：lib/index.js 会 import 宿主包 @deepseek-ai/dsh-tools。仓库目录通常没有
// node_modules（依赖由安装它的 DSH profile 提供），此时这里明确 SKIP 而不是
// 把「环境缺少宿主包」伪装成通过；在 profile / 完整检出里运行会照常执行。
let apply
try {
  ;({ apply } = await import('../lib/index.js'))
} catch (error) {
  if (error?.code === 'ERR_MODULE_NOT_FOUND') {
    console.log('SKIP: 无法解析宿主包（仓库目录无 node_modules，且当前不在 DSH profile 内）；请在 profile/完整检出中运行，或先安装依赖。')
    process.exit(0)
  }
  throw error
}

let captured
const disposeFns = []
const ctx = {
  // 官方 ctx.effect(fn) 绑定 fiber 生命周期并返回释放句柄；stub 执行回调并记录句柄。
  effect(fn) {
    const dispose = fn()
    if (typeof dispose === 'function') disposeFns.push(dispose)
    return () => { for (const d of disposeFns) d() }
  },
  tools: {
    register(descriptor) {
      captured = descriptor
    }
  }
}

apply(ctx)
if (!captured) {
  console.error('FAIL: tool was not registered')
  process.exit(1)
}
console.log(`registered tool: ${captured.name}`)
if (captured.name !== 'repo_setup_scan') {
  console.error(`FAIL: unexpected tool name ${captured.name}`)
  process.exit(1)
}

const cases = [
  { label: 'node project (mattpocock-skills-dsh)', path: 'D:\\plugins\\mattpocock-skills-dsh' },
  { label: 'python project (Qwen-MM-Plugins)', path: 'D:\\plugins\\Qwen-MM-Plugins' },
  { label: 'non-existent dir', path: 'D:\\plugins\\definitely-not-a-dir-xyz' },
]

let failures = 0
for (const c of cases) {
  console.log(`\n=== ${c.label} ===`)
  let report
  try {
    report = await captured.execute({ path: c.path })
  } catch (err) {
    console.error(`FAIL: execute threw: ${err.message}`)
    failures++
    continue
  }
  if (typeof report !== 'string' || report.length < 50) {
    console.error('FAIL: report is not a substantial string')
    failures++
    continue
  }
  console.log(report.split('\n').slice(0, 12).join('\n'))
  console.log(`... (${report.length} chars)`)
  if (report.includes('undefined') || report.includes('NaN')) {
    console.error('FAIL: report contains undefined/NaN')
    failures++
  }
}

if (failures) {
  console.error(`\nFAIL: ${failures} problem(s)`)
  process.exit(1)
}
console.log('\nOK: tool registers, executes and renders on real and missing directories')
