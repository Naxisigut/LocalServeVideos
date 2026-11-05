---
name: sync-tauri-ui
description: Sync UI changes from the sibling LocalServeTauri app (../LocalServeTauri/src) into this Remotion project's props-driven copy under src/ui (global.css, i18n, icons, SiteCard, SiteDetail, motion, etc.). Use when the user asks to sync / 同步 / 对齐 / 更新 the Tauri UI, says the video UI is out of date with the app, or mentions UI同步.
disable-model-invocation: true
---

# 同步 LocalServeTauri UI

把 `../LocalServeTauri/src`（应用源码，事实来源，**只读**）的 UI 改动搬到本项目 `src/ui/`
（Remotion 用的展示型副本：无 store / 后端 / 计时器，状态和动效全部由 props 驱动）。

## 路径与基线

| 角色 | 路径 |
|------|------|
| 来源 | `../LocalServeTauri`（可用 `LOCALSERVE_TAURI_DIR` 覆盖） |
| 目标 | `src/ui/` |
| 上次同步的 Tauri commit | `.cursor/skills/sync-tauri-ui/last-sync` |

**绝不修改 LocalServeTauri 中的任何文件。**

## 流程

```
- [ ] 1. 运行 status 脚本，确认待同步范围
- [ ] 2. 逐字同步 global.css / icons.tsx / i18n.ts
- [ ] 3. 跟进 video.css 与 motion.ts
- [ ] 4. 按 diff 移植组件改动
- [ ] 5. 补 types / demo 数据 / gallery
- [ ] 6. 校验（lint + Studio）
- [ ] 7. 更新基线
```

### 1. 查看待同步范围

```bash
.cursor/skills/sync-tauri-ui/scripts/status.sh
```

输出包括：基线之后触及 `src` 的提交、改动文件及其对应的 `src/ui` 目标（含 Tauri 未提交改动）、三个逐字文件是否漂移。
逐个查看具体改动：

```bash
git -C ../LocalServeTauri diff <baseline> HEAD -- src/components/SiteCard.tsx
git -C ../LocalServeTauri diff HEAD -- src   # 未提交部分
```

如果 Tauri 有未提交的 UI 改动，先问用户是否也要同步这部分。

### 2. 逐字文件

| Tauri | 本项目 | 规则 |
|-------|--------|------|
| `src/styles/global.css` | `src/ui/styles/global.css` | 直接 `cp`，不做任何修改 |
| `src/icons.tsx` | `src/ui/icons.tsx` | 直接 `cp` |
| `src/i18n.ts` | `src/ui/i18n.ts` | `cp` 后只做两处适配（见下） |

`i18n.ts` 的适配（因为 tsconfig `lib` 是 `es2015`，没有 `Object.hasOwn`）：
1. `import type { Language } from './contracts'` 改为 `from './types'`
2. 在 import 下方加 helper，并把所有 `Object.hasOwn(` 替换为 `hasOwn(`：

```ts
const hasOwn = (target: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(target, key)
```

不要对这些文件运行 prettier 或做格式化。视频专用的覆盖只写在 `video.css`，不要写进 `global.css`。

### 3. video.css 与 motion.ts

对比 `global.css` 的 diff，检查：
- **主题 token**：`:root` 和 dark 媒体查询里的变量有增改时，同步更新 `video.css` 的 `.ls-theme-light` / `.ls-theme-dark`（视频强制主题，不依赖 `prefers-color-scheme`）。
- **hover**：新增或修改的 `:hover` 规则，要在 `video.css` 的 “Scripted hover states” 一节补上对应的 `.ls-window … [data-hover]` 规则，组件里用 `hoverAttr(hover)` 驱动。
- **布局冲突**：`global.css` 的布局变化（例如滚动容器、flex 结构）可能让 `video.css` 里已有的覆盖失效或变得多余，对照 Studio 画面调整。
- **动效**：`.ls-root` 下 transition/animation 全部禁用。新增或修改的 `transition` / `@keyframes` / `use-presence-list` / `use-flip-layout` / `use-modal-motion` 时长与曲线，要同步到 `src/ui/motion.ts` 的常量和 easing，并在组件里用 0–1 progress prop 重现（参考 `SiteStatusBadge` 的 `from` / `progress`）。

### 4. 组件移植

组件不是逐字复制，而是根据 diff 手动移植。文件对应关系以 `status.sh` 的输出为准，主要有：

| Tauri | 本项目 |
|-------|--------|
| `App.tsx` | `AppWindow.tsx` |
| `components/SiteCard.tsx` / `SiteDetail` / `SiteDrawer` / `SiteStatusBadge` / `FileSharePanel` / `FileShareRetryButton` / `QrPopup` | 同名文件 |
| `components/Settings.tsx` + `LanguageSelect` / `ThemeSelect` | `Settings.tsx` |
| `components/LicenseGate.tsx` + `PricingChip` | `License.tsx` |
| `components/Toggle` / `Tooltip` / `DropdownMenu` / `MenuItem` / `ConfirmDialog` | `primitives.tsx` |
| `qr-to-canvas.ts` | `QrCode.tsx` |
| `contracts.ts` | `types.ts`（只保留 UI 渲染用到的字段） |
| `path-display.ts` | `context.tsx` 的 `compactHomePath` |

移植规则：
- DOM 结构、`className`、文案（通过 `useT()` 调用 `t('中文 key')`）、图标与 Tauri 保持一致，这样 `global.css` 才能原样生效。
- 删掉 store、`backend` / `invoke`、事件处理、`useEffect` / `setTimeout` / `Date.now()` / `Math.random()`；需要展示的状态改成 props。
- 交互状态（hover、打开的菜单、tooltip、输入光标）都用 props 表示；tooltip 在窗口内渲染，不 portal 到 body。
- 进出场或状态切换动画用 progress props（0–1），不用 CSS 动画。
- 纯逻辑模块（`site-reconcile`、`log-reconcile`、`*-filter` 等）只有在影响渲染结果时才需要移植。

### 5. 数据与预览

- 新字段：补 `src/ui/types.ts` 和 `src/demo/acme.ts` 中的演示数据。
- 新界面或新状态：在 `src/compositions/UiGallery.tsx` 加 screen，在 `src/Root.tsx` 的 `UI-Gallery` 文件夹注册 Still；动效则加到 `UiMotionDemo`。
- 组件新增了必填 props 时，同步更新所有调用方（compositions 和 `AppWindow`）。

### 6. 校验

```bash
pnpm lint                     # eslint + tsc，只修语法和类型错误，不格式化
.cursor/skills/sync-tauri-ui/scripts/status.sh   # 逐字文件应全部为 same
```

然后用 `pnpm dev` 打开 Studio，检查 `UiSmoke` 以及受影响的 `UI-Gallery` Still（浅色、深色、中文版本都要看）。
如需截图对照：`pnpm exec remotion still Ui-Main out/ui-main.png`。

### 7. 更新基线

用户确认同步结果后：

```bash
.cursor/skills/sync-tauri-ui/scripts/status.sh --mark
```

该命令把当前 Tauri HEAD 写入 `last-sync`，与同步改动放在同一个提交里。如果同步时包含了 Tauri 的未提交改动，要告诉用户：下次运行仍会把这些文件列出来，属于正常情况。
