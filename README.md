# LocalServe 产品演示视频 / LocalServe Product Demo Videos

## 简介 / Overview

**中文：**  
本仓库用于制作 LocalServe 产品的演示视频。项目基于 [Remotion](https://www.remotion.dev/)（React → 视频），用 React / TypeScript 编写组合，在 Remotion Studio 预览，并可渲染为 MP4。产品界面样式与组件从 **LocalServeTauri** 复制到本仓 `src/ui/`，**不要在本仓库改 Tauri 源码**。

**English：**  
This repository creates LocalServe product demo videos with [Remotion](https://www.remotion.dev/) (React → video). Compositions are authored in React/TypeScript, previewed in Remotion Studio, and rendered to MP4. Product UI CSS/components are **copied** from LocalServeTauri into `src/ui/` — **do not edit the Tauri repo from here**.

---

## 本机要求 / Prerequisites

- **Node.js** `>= 22`（建议 22.x）
- **pnpm**（与本仓库脚本一致）
- 可选：**FFmpeg**（本地渲染 MP4 时需要）

---

## 技术栈 / Tech Stack

- **Remotion 4.x**：组合、Studio 预览、渲染
- **React 19** + **TypeScript**
- **输出目标**：1920×1080（当前脚手架）

---

## 项目结构 / Project Structure

```
LocalServeVideos/
├── src/
│   ├── index.ts                 # registerRoot 入口
│   ├── Root.tsx                 # 注册 Composition（含 UiSmoke）
│   ├── compositions/UiSmoke.tsx # UI 冒烟预览组合
│   ├── demo/acme.ts             # Acme 演示数据
│   └── ui/                      # 从 Tauri 复制的壳/卡片/样式（stubs）
├── assets/brand/                # 品牌图
├── docs/
│   ├── youtube-main-storyboard.md
│   └── superpowers/
│       ├── specs/2026-11-02-remotion-migration-design.md
│       └── plans/2026-11-02-remotion-scaffold.md
├── remotion.config.ts
├── package.json
├── AGENTS.md
└── README.md
```

---

## 快速开始 / Quick Start

### 安装依赖 / Install

```bash
pnpm install
```

### 预览 / Remotion Studio

```bash
pnpm dev
```

打开 Studio 后选择 Composition：**`UiSmoke`**（1920×1080，约 3s @ 30fps），确认标题栏 + Acme 站点卡片空壳显示正常。

### 静态检查 / Lint

```bash
pnpm lint
```

### 打包 / Bundle（可选）

```bash
pnpm build
```

完整片渲染与旁白管线不在本阶段范围；需要时再加 `remotion render` 脚本。

---

## 当前状态 / Status

- [x] 移除 HyperFrames / HyperFrames removed
- [x] Remotion blank 脚手架 / Remotion blank scaffold
- [x] Acme demo 数据 + `SiteView` 类型 / Demo data + types
- [x] `UiSmoke`：复制 UI 壳 + 站点卡片冒烟 / UI smoke shell
- [x] YouTube 主片分镜保留 / Storyboard kept: `docs/youtube-main-storyboard.md`
- [ ] 完整 S1–S10 主片 / Full main film
- [ ] 旁白 / 字幕 / VO & captions
- [ ] 交付级渲染 polish / Delivery-quality polish

### 设计与计划 / Spec & plan

- Spec: [`docs/superpowers/specs/2026-11-02-remotion-migration-design.md`](docs/superpowers/specs/2026-11-02-remotion-migration-design.md)
- Plan: [`docs/superpowers/plans/2026-11-02-remotion-scaffold.md`](docs/superpowers/plans/2026-11-02-remotion-scaffold.md)

---

## UI 复制约定 / UI copy rule

- 界面代码在本仓 `src/ui/`（及 `src/demo/`），来自 LocalServeTauri 的**副本**，可按视频需要改 stubs。
- **禁止**修改 `/Users/sdj_mac_air/Desktop/repos/LocalServeTauri`（或任何 Tauri 路径）来服务本视频仓。
- 不要用 `file:` / workspace 直接 import Tauri 包。

---

## 许可 / License

内部使用 / Internal use only
