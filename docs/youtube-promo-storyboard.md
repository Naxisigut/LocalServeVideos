# LocalServe YouTube 推广视频 — 分镜脚本 v2

> 与 `youtube-main-storyboard.md`（70s，结构 A）的区别：v2 覆盖完整卖点（站点 / SPA / 反代 / 自定义域名 / 局域网扫码 / 文件分享 / 菜单栏 / 授权），时长约 95 秒，作为 YouTube 主推广片。

## 概览

| 项目 | 规格 |
| --- | --- |
| 片名（工作） | LocalServe — Turn any folder into a local site |
| 时长 | ~95 秒（30fps，约 2850 帧） |
| 分辨率 | 1920×1080 横屏；可另切 1080×1920 Shorts 版（见文末） |
| 语言 | 英文旁白 + 英文硬字幕（中文为对照，方便审稿） |
| 受众 | 海外前端开发者、独立开发者、Vibe Coding 爱好者 |
| 风格 | 干净、节奏明快；产品 UI 为 `src/ui/` 组件 + Acme 演示数据，不录真实杂乱桌面 |
| 主线 | 一个项目 Acme Dashboard 从 `dist/` 到“手机上能用”，再扩展到多站点 / 文件分享 |

**一句话卖点：** No CLI. No cloud. Just your Mac. — 把任意文件夹变成本地站点，反代接口，扫码在手机上打开。

**核心事实（避免夸大）：**

- 仅 macOS；无需命令行、无需账号、无需联网即可试用。
- 7 天免费试用，试用判断完全在本机完成。
- 永久许可证，一次性买断、无订阅，最多 3 台 Mac；激活后可永久离线使用。
- 价格：**待定**（演示数据为 `USD 19.00`，旧分镜写 `$9`，以 Dodo 实际定价为准再出片）。
- 不要提 HTTPS（暂不支持）、不要提“开机自启”（当前版本尚未提供）。

---

## 幕结构

| 幕 | 时间 | 内容 |
| --- | --- | --- |
| 1 钩子 / 痛点 | 0–12s | 项目 build 完了，本地跑起来却一团乱 |
| 2 产品登场 + 建站 | 12–34s | 拖入文件夹 → 保存并启动 → SPA 路由正常 |
| 3 前后端联调 | 34–44s | `/api` 反向代理，告别 CORS |
| 4 好记的域名 | 44–52s | `docs.ls` 自定义域名 |
| 5 局域网与手机 | 52–66s | 二维码 → 手机打开同一站点 |
| 6 文件分享 | 66–74s | 拖入文件，手机扫码下载 |
| 7 管理与常驻 | 74–84s | 多站点、日志、菜单栏托盘 |
| 8 CTA | 84–95s | 试用 / 价格 / 下载 |

---

## 分镜 S1–S14

### 第 1 幕 — 钩子 / 痛点

#### S1 — “Build 成功，然后呢？”（0–4s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 黑底终端，`pnpm build` 跑完，绿色 `✓ built in 2.1s`，`dist/` 高亮闪一下。 |
| 动效 | 打字机输出；结尾镜头轻推进到 `dist/`。 |
| VO | You built it. Now how do you actually *run* it? |
| 中文 | 项目打包好了，然后怎么在本地跑起来？ |
| 素材 | 终端 mock（新组件，简单即可） |

#### S2 — 痛点堆叠（4–9s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 卡片依次砸进画面并堆叠：`npx serve` / `CORS error` / `404 on refresh` / `sudo vim /etc/hosts` / 手机打不开的灰屏。 |
| 动效 | 每张卡片 spring 入场，间隔 ~12 帧，略带抖动；最后一张落地后整体轻微晃动。 |
| VO | Static servers, CORS, broken routes, hosts files, phone testing… |
| 字幕 | 同 VO |
| 中文 | 静态服务、跨域、刷新 404、改 hosts、手机预览…… |

#### S3 — 转折（9–12s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 卡片堆被一刀切掉/吸走，画面清空，中央出现大字。 |
| 字幕（大字） | **No CLI. No cloud. Just your Mac.** |
| VO | What if it was just… one app? |
| 中文 | 如果这些只需要一个应用呢？ |

### 第 2 幕 — 产品登场 + 建站

#### S4 — LocalServe 登场（12–16s）

| 字段 | 内容 |
| --- | --- |
| 画面 | App 图标从中央弹出 → 展开为 `MacWindow` 主窗口（空列表态：“No sites yet”）。 |
| VO | Meet LocalServe. It turns any folder into a local site. |
| 中文 | 认识 LocalServe：把任意文件夹变成本地站点。 |
| 组件 | `assets/brand/app-icon.png`、`MacWindow` + `AppWindow`（空状态） |

#### S5 — 新建站点（16–24s）

| 字段 | 内容 |
| --- | --- |
| 画面 | `MacCursor` 点击 “New site” → `SiteDrawer` 滑入；填入名称 `Acme Dashboard`、目录 `~/Projects/acme/dist`、端口 `5173`；出现 “Folder validation passed”。 |
| 动效 | 抽屉 `enter`；输入框逐字填写；目录校验绿勾弹出。 |
| VO | Pick your build folder, choose a port… |
| 中文 | 选好打包目录，设个端口…… |
| 数据 | `acmeDraft` |

#### S6 — 保存并启动（24–28s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 点击 “Save and start” → 抽屉收起 → `SiteCard` 出现，状态 Starting → **Running**，访问地址 `http://127.0.0.1:5173` 显现（`portReveal`）。 |
| VO | …and hit start. That's it. |
| 中文 | 点启动，就这么简单。 |
| 数据 | `acmeSite` |

#### S7 — SPA 路由正常（28–34s）

| 字段 | 内容 |
| --- | --- |
| 画面 | Cmd-点击地址 → 浏览器窗口 mock 打开 Acme Dashboard；进入 `/dashboard/settings` 并刷新，页面正常。右下角小日志条：`GET /dashboard/settings 200 (SPA fallback)`。 |
| VO | Deep links and refreshes just work — SPA fallback is built in. |
| 中文 | 深层路由、刷新都不会 404，内置 SPA 回退。 |
| 素材 | 浏览器 chrome mock + Acme 页面（新组件）；日志行来自 `acmeLogs` l7 |

### 第 3 幕 — 前后端联调

#### S8 — 反向代理（34–44s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 左：`SiteDrawer` 代理规则行 `/api → http://127.0.0.1:9083`（Change origin 开启）。右：示意图，浏览器 → `:5173/api/me` → LocalServe → `:9083`，同源请求返回 **200**；一个红色 “CORS error” 标签被划掉。 |
| 动效 | 规则行插入；请求光点沿路径流动；200 绿色徽章弹出。 |
| VO | Got a backend? Add a proxy rule. Same origin, no CORS headaches. |
| 中文 | 有后端接口？加一条代理规则，同源访问，告别跨域。 |
| 数据 | `acmeSite.proxyRules`、`acmeLogs` l5–l6 |

### 第 4 幕 — 好记的域名

#### S9 — 自定义域名（44–52s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 切到 Product Docs 站点卡片，显示域名 `docs.ls`；浏览器地址栏从 `127.0.0.1:4000` 变成 `http://docs.ls`。角标提示 “Administrator approval required when saving”，一闪而过。 |
| VO | Give every project a name you'll remember. LocalServe manages hosts for you. |
| 中文 | 给每个项目起个好记的域名，hosts 由 LocalServe 帮你托管。 |
| 数据 | `docsSite` |

### 第 5 幕 — 局域网与手机

#### S10 — 扫码（52–59s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 回到 Acme 卡片，点击 LAN 地址 → `QrPopup` 弹出，二维码 + `http://192.168.1.24:5173` + “Connect your phone and Mac to the same Wi-Fi, then scan”。 |
| VO | Same Wi-Fi? Scan the code. |
| 中文 | 同一个 Wi-Fi？扫一下就行。 |
| 数据 | `ACME_LAN_URL` |

#### S11 — 手机预览（59–66s）

| 字段 | 内容 |
| --- | --- |
| 画面 | iPhone 外框从右侧滑入，打开同一个 Acme 页面（移动端布局）；Mac 侧日志滚出 `GET / 200 (192.168.1.31 · iPhone)` 与一条 `/api/me` 代理日志。 |
| VO | Your site — and your API — on any device in the room. |
| 中文 | 站点连同接口，在身边任何设备上打开。 |
| 素材 | 手机外框 mock（新组件）；`acmeLogs` l11–l12 |

### 第 6 幕 — 文件分享

#### S12 — 扫码下载文件（66–74s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 镜头上移到 `FileSharePanel`：`Demo.mp4`、`Specs.pdf` 等文件卡片依次落入；点击 “Show QR code” → 手机扫码后出现下载完成提示。 |
| VO | Need to send a file to your phone? Drop it in. Scan. Done. No cables, no cloud. |
| 中文 | 想把文件传到手机？拖进来，扫一扫，搞定。不用数据线，也不用网盘。 |
| 数据 | `demoFiles` |

### 第 7 幕 — 管理与常驻

#### S13 — 多站点 + 菜单栏（74–84s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 前半（74–79s）：主窗口站点列表扩展为 3 个站点，状态栏 “Files: 5 · Sites: 3 · Running: 2”；快速闪过 `SiteDetail` 日志面板。后半（79–84s）：关闭窗口 → 窗口缩进菜单栏 → `TrayMenu` 展开，站点仍在运行。 |
| VO | Run all your projects side by side, with live logs. Close the window — it keeps serving from your menu bar. |
| 中文 | 多个项目同时运行，实时日志一目了然。关掉窗口，它仍在菜单栏里持续服务。 |
| 数据 | `demoSites`、`acmeLogs`、`demoSettings.minimizeToTrayOnClose` |

### 第 8 幕 — CTA

#### S14 — 结尾卡（84–95s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 背景虚化的 App 窗口；前景 Logo + 三枚价格标签依次出现：**7-day free trial · No account** / **One-time purchase · No subscription** / **Up to 3 Macs**。最后定格：**LocalServe — Download for macOS**，下方放官网链接。 |
| VO | Try it free for seven days — no account needed. Then buy once, and it's yours forever. LocalServe. Your folder, live in seconds. |
| 中文 | 免费试用 7 天，无需注册。之后一次买断，永久使用。LocalServe，让文件夹秒变站点。 |
| 素材 | `assets/brand/logo.png`；`License` 组件可作为背景参考 |
| 注意 | 价格数字确认后再加到第二枚标签（如 `$XX once`）。 |

---

## 旁白全文（英文，便于录音 / TTS）

> You built it. Now how do you actually run it?
> Static servers, CORS, broken routes, hosts files, phone testing…
> What if it was just… one app?
> Meet LocalServe. It turns any folder into a local site.
> Pick your build folder, choose a port… and hit start. That's it.
> Deep links and refreshes just work — SPA fallback is built in.
> Got a backend? Add a proxy rule. Same origin, no CORS headaches.
> Give every project a name you'll remember. LocalServe manages hosts for you.
> Same Wi-Fi? Scan the code. Your site — and your API — on any device in the room.
> Need to send a file to your phone? Drop it in. Scan. Done. No cables, no cloud.
> Run all your projects side by side, with live logs. Close the window — it keeps serving from your menu bar.
> Try it free for seven days — no account needed. Then buy once, and it's yours forever.
> LocalServe. Your folder, live in seconds.

约 175 词，按 ~150 wpm 语速约 70s 纯语音，其余为留白与转场，与 95s 匹配。

---

## 声音设计

- BGM：轻快 lo-fi / 电子，约 110–120 BPM；S3 转折处做一次 drop（前 9s 偏紧张、低通）。
- 音效：卡片落地（S2）、按钮点击、Running 状态“叮”、二维码扫描“哔”、文件下载完成提示音。
- 旁白下 BGM 压到 -18 ~ -20 LUFS 相对电平，结尾卡 BGM 回升。

## 字幕规范

- 底部安全区内硬字幕，单行 ≤ 42 字符，必要时两行。
- S3 和 S14 用大字标题代替普通字幕。
- 同时导出 `.srt`，上传 YouTube 作为 CC 字幕（可加中文、日文翻译轨）。

---

## YouTube 发布物料

**标题（候选）：**

1. LocalServe — Turn Any Folder into a Local Website on Mac (No CLI)
2. Preview Your Frontend on Your Phone in 10 Seconds | LocalServe for macOS
3. Stop Fighting CORS & `npx serve` — Meet LocalServe

**简介模板：**

```
LocalServe turns any folder into a local website on your Mac — no terminal, no cloud.

✓ One-click local sites with SPA fallback
✓ Reverse proxy for your API (no more CORS)
✓ Custom local domains like app.ls
✓ Scan a QR code to open it on your phone
✓ Share files to any device on your Wi-Fi
✓ Lives in your menu bar

7-day free trial, no account. One-time purchase, up to 3 Macs.
Download: <官网链接>

00:00 The problem
00:12 Create a site in seconds
00:34 Reverse proxy your API
00:44 Custom local domains
00:52 Preview on your phone
01:06 Share files over Wi-Fi
01:14 Multiple sites & menu bar
01:24 Try it free
```

**缩略图思路：** 左侧 Mac 窗口（Acme 卡片 Running 绿点），右侧手机显示同一页面，中间一个大二维码；大字 “FOLDER → WEBSITE”。

**标签：** localserve, local web server mac, static site server, reverse proxy, cors, spa, vite preview, mobile preview, vibe coding

---

## 衍生：Shorts 竖版（~30s，可选）

S1（2s）→ S3 大字（2s）→ S5+S6 压缩（6s）→ S10+S11（10s）→ S12（5s）→ S14（5s）。旁白取对应句子，画面使用 1080×1920 构图，App 窗口居上、手机居下。

---

## 实现映射（Remotion）

| 分镜 | 现有组件 / 数据 | 需新增 |
| --- | --- | --- |
| S1–S3 | — | 终端 mock、痛点卡片、大字标题 |
| S4–S6 | `MacWindow` `AppWindow` `SiteDrawer` `SiteCard` `MacCursor`；`acmeDraft` `acmeSite` | — |
| S7 | `acmeLogs` | 浏览器窗口 mock、Acme 页面 |
| S8 | `SiteDrawer` 代理规则 | 请求流向示意图 |
| S9 | `SiteCard`；`docsSite` | 浏览器地址栏动画 |
| S10–S11 | `QrPopup` `QrCode`；`ACME_LAN_URL` | 手机外框 + 移动端页面 |
| S12 | `FileSharePanel`；`demoFiles` | 手机下载提示 |
| S13 | `SiteDetail` `TrayMenu`；`demoSites` | 窗口收进菜单栏的过渡 |
| S14 | `assets/brand/logo.png` | 结尾卡 |
