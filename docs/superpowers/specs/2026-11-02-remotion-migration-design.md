# LocalServeVideos → Remotion 迁移设计

日期：2026-11-02  
仓库：LocalServeVideos  
状态：已确认（scaffold-only）

## 目标

把产品演示视频栈从 HyperFrames（HTML→MP4）整仓换成 Remotion（React），以便与 LocalServeTauri 的 React 前端对齐。本阶段只搭脚手架并验证 Studio 预览；不重做完整 youtube-main 分镜，不加配音。

## 已确认决策

| 项 | 选择 |
| --- | --- |
| 产品界面来源 | 从 LocalServeTauri **复制** UI 代码进 Videos；**不改动** Tauri 仓库 |
| HyperFrames | **整仓替换**（删除依赖与相关脚手架） |
| 脚手架方式 | Remotion 官方模板整仓重置（方案 A） |
| 本阶段完成线 | 脚手架 + 能 preview；界面可为空壳但需证明复制组件可渲染 |

## 架构

- 仓库仍为 `LocalServeVideos`，技术栈改为 Remotion + React + TypeScript。
- 移除 HyperFrames：`hyperframes` 依赖、`hyperframes.json`、`compositions/*.html`、`index.html`（若仅服务 HyperFrames）、相关 npm scripts、`.hyperframes/` 工作目录（gitignore / 本地）。
- 采用标准 Remotion 布局，例如：
  - `src/Root.tsx` — 注册 compositions
  - `src/compositions/` — 占位 composition（如 `HelloLocalServe`）
  - `src/ui/` — 从 Tauri 复制的组件与样式
  - `src/demo/` — 演示假数据
  - `remotion.config.ts`
- 保留：`docs/youtube-main-storyboard.md`、`assets/brand/`（及仍需要的静态资源）。
- 旧 HTML UI mock（`assets/ui/` 中的 HyperFrames 时代文件）可删除；渲染产物 `renders/*.mp4` 可删或本地保留，不作为脚手架验收依赖。

## 组件与数据

- 从 LocalServeTauri **复制**（非 import 对方源码）：
  - `src/styles/global.css`（或等价样式）
  - 片子会用到的壳与组件：窗口壳、`SiteCard`、`SiteDrawer`、`QrPopup` 等
- Tauri 专用依赖（`@tauri-apps/api`、真实 store、i18n 后端等）在 Videos 侧换成 **stub / 假数据**，保证 Remotion 纯前端可跑。
- `src/demo/acme.ts`（或同类）：Acme Dashboard、路径、端口、代理规则、LAN URL 等演示数据。
- 占位 Composition 内至少挂载 1–2 个复制过来的 UI 组件，证明 CSS + React 链路通。

## 脚本与验收

脚本（名称可按官方模板微调）：

- `studio` / `preview`：打开 Remotion Studio
- 可选 `render`：占位渲染命令

验收标准：

1. `pnpm install`（或模板约定的包管理器）成功  
2. Studio 可启动  
3. 预览中能看到复制过来的 UI 空壳（至少一屏产品界面组件）

## 明确不做（本阶段）

- 完整 S1–S10 时间轴重做与出片  
- 英文 VO / TTS / 字幕制作  
- 修改 LocalServeTauri 任何文件  
- 默认使用 Cursor 云端 agent（需另征得同意）

## 文档与仓库卫生

- 更新 `README.md`、`AGENTS.md`：说明栈为 Remotion，工作流改为 Studio / render  
- 本文件落在 `docs/superpowers/specs/`  
- 提交信息简洁说明「迁移设计：HyperFrames → Remotion（scaffold-only）」

## 后续（不在本阶段）

- 按故事板用 Remotion 重做 youtube-main  
- 配音与字幕  
- looks 级渲染与发布流程
