# LocalServe 产品演示视频 / LocalServe Product Demo Videos

## 简介 / Overview

**中文：**  
本仓库用于制作 LocalServe 产品的演示视频。项目基于 [HyperFrames](https://hyperframes.heygen.com)（HTML → MP4），用普通 HTML/CSS/JS（GSAP）编写组合，再预览并渲染为高质量视频。

**English：**  
This repository creates LocalServe product demo videos with [HyperFrames](https://hyperframes.heygen.com) (HTML → MP4). Compositions are authored in plain HTML/CSS/JS (GSAP), then previewed and rendered locally.

---

## 本机要求 / Prerequisites

- **Node.js** `>= 22`（当前建议 22.x）
- **FFmpeg**（CLI 渲染依赖，macOS 可用 `brew install ffmpeg`）
- **pnpm**（与本仓库脚本一致）

可选：HyperFrames Studio 桌面应用，用于可视化编辑。

---

## 技术栈 / Tech Stack

- **HyperFrames**：HTML 组合、预览、渲染
- **GSAP**：可 seek 的时间轴动画
- **输出**：MP4（默认 1920×1080）

---

## 项目结构 / Project Structure

```
LocalServeVideos/
├── index.html           # 根组合（占位入口）
├── compositions/        # 组合（含 youtube-main.html）
├── docs/                # 分镜与策划文档
├── assets/              # 媒体资源（图片、图标等）
├── scripts/             # 辅助脚本
├── renders/             # 本地渲染输出（已 gitignore）
├── hyperframes.json     # HyperFrames 路径与 registry 配置
├── meta.json            # 项目元数据
├── package.json
└── README.md
```

---

## 快速开始 / Quick Start

### 安装依赖 / Install

```bash
pnpm install
```

### 环境自检 / Doctor

```bash
pnpm run doctor
# or: npx hyperframes doctor
```

### 预览 / Preview

```bash
pnpm dev
# 或: pnpm preview
```

浏览器会打开 HyperFrames Studio。代理/非交互环境可用：

```bash
npx hyperframes preview --background --no-open
```

### 静态检查 / Lint

```bash
pnpm lint
```

更深的浏览器门禁（布局/动效/对比度）：

```bash
pnpm check
```

### 渲染 / Render

```bash
pnpm render
```

首次渲染可能下载 `chrome-headless-shell`（较慢）。可临时用本机 Chrome：

```bash
export HYPERFRAMES_BROWSER_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
pnpm render
```


默认输出：`renders/localserve-placeholder.mp4`（目录与 `*.mp4` 均已忽略）。也可：

```bash
npx hyperframes render --output renders/my-video.mp4
```

---

## 当前状态 / Status

- [x] 配置 HyperFrames 开发环境 / HyperFrames wired up
- [x] 最小可渲染占位组合 / Minimal placeholder composition (`index.html`, 4s)
- [x] YouTube 主片分镜 / Storyboard: `docs/youtube-main-storyboard.md`
- [x] YouTube 主片骨架 (~70s) / Skeleton: `compositions/youtube-main.html`
- [ ] 真素材 + 旁白混音 / Real captures + VO mix
- [ ] 交付级渲染 polish / Delivery-quality polish

### YouTube 主片 / YouTube main

```bash
pnpm run render:youtube-main          # draft → renders/youtube-main-v1.mp4
pnpm run render:youtube-main:looks    # higher quality
```

---

## 许可 / License

内部使用 / Internal use only
