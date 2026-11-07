# LocalServe YouTube 推广视频 — 分镜脚本 v3

> v3 相对 v2 的改动：
>
> - **开头改写**：不再从“build 产物打不开”这种偏开发者的痛点切入，而是从更普遍的需求切入——AI 时代人人都在做只为自己服务的小网页应用，但它们散落在各个文件夹；有的双击 HTML 就能用，有的必须放到本地服务器上才能正常打开（类似 VS Code 的 Live Server 插件做的事）。
> - **前后呼应**：开头埋下的“双击打开一片空白”在 S7 兑现；反向代理（S8）作为独立卖点保留，不再充当开头痛点。
> - **删去“管理与常驻”幕**（多站点 / 日志 / 菜单栏托盘），结尾卡顺延为 S13。
> - **演示数据改为个人小应用**：Budget Tracker / Recipe Box / Reading List / Habit Tracker，路径分散在不同文件夹，与 S2 画面一致。
> - 第 1 幕加长 2s（0–14s），全片约 87s。
>
> 画面文案以 `src/ui/i18n.ts` 英文为准（按钮名、提示语与 App 一致），下文引号内的 UI 文案均已对齐。

## 概览

| 项目 | 规格 |
| --- | --- |
| 片名（工作） | LocalServe — All your little web apps, one home |
| 时长 | ~87 秒（30fps，约 2610 帧） |
| 分辨率 | 1920×1080 横屏；可另切 1080×1920 Shorts 版（见文末） |
| 语言 | 英文旁白 + 英文硬字幕（中文为对照，方便审稿） |
| 受众 | 用 AI 做小工具的 Vibe Coding 用户、独立开发者、海外前端开发者 |
| 风格 | 干净、节奏明快；产品 UI 为 `src/ui/` 组件 + 演示数据，不录真实杂乱桌面 |
| 主线 | AI 帮你做出一堆个人小应用 → 散落各处、有的双击打不开 → 全部收进 LocalServe；以 Budget Tracker 为代表演示建站、正常打开、连接口、手机访问，再扩展到文件分享 |

**一句话卖点：** All your little web apps, one home. No CLI. No cloud. Just your Mac.

**核心事实（避免夸大）：**

- 仅 macOS；无需命令行、无需账号、无需联网即可试用。
- 7 天免费试用，试用判断完全在本机完成。
- 永久许可证，一次性买断、无订阅，最多 3 台 Mac；激活后可永久离线使用。
- 价格：**$9 一次性买断**（演示数据 `USD 9.00` 与正式定价一致）。
- 不要提 HTTPS（暂不支持）、不要提“开机自启”（当前版本尚未提供）。

**演示数据（`src/demo/acme.ts`）：**

| 站点 | 目录 | 端口 / 域名 | 角色 |
| --- | --- | --- | --- |
| Budget Tracker | `~/Projects/budget-tracker/dist` | 5173，`/api` 代理到 `:9083` | 主角：双击打不开的构建产物，SPA 路由，连接口，手机访问 |
| Recipe Box | `~/Downloads/recipe-box` | 4000，`recipes.ls` | 双击就能用的纯 HTML 页面；演示自定义域名 |
| Reading List | `~/Desktop/reading-list` | 8080 | 仅在 S2 画面中出现 |
| Habit Tracker | `~/Documents/ai-tests/habit-tracker` | 3000 | 仅在 S2 画面 / Gallery 错误态中出现 |

---

## 幕结构

| 幕 | 时间 | 内容 |
| --- | --- | --- |
| 1 钩子 / 需求 | 0–14s | AI 让人人都能做小应用；但它们散落各处，有的双击打不开 |
| 2 产品登场 + 建站 | 14–36s | 选文件夹 → 保存并启动 → 打不开的页面正常了，SPA 路由正常 |
| 3 连接接口 | 36–46s | `/api` 反向代理，告别 CORS |
| 4 好记的域名 | 46–54s | `recipes.ls` 自定义域名 |
| 5 局域网与手机 | 54–68s | 二维码 → 手机打开同一站点 |
| 6 文件分享 | 68–76s | 拖入文件，手机扫码下载 |
| 7 CTA | 76–87s | 试用 / 价格 / 下载 |

---

## 分镜 S1–S13

### 第 1 幕 — 钩子 / 需求

> 思路：先用例子让观众认出自己（“我也做过这种小东西”），再点出共同的困境，最后一句话收拢。不讲术语，不出现终端。

#### S1 — “一句话，就有了一个小应用”（0–4s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 浅色背景，左侧是一个简化的 AI 对话气泡，依次出现三条请求：`Make me a budget tracker` / `A recipe box for my family` / `A reading list I can tag`。每条请求发出后，右侧立刻“长出”一张对应的小应用缩略卡（Budget Tracker、Recipe Box、Reading List），随后再快速冒出 Habit Tracker 等几张，铺成一小片。 |
| 动效 | 气泡打字机输出；缩略卡 spring 弹出，间隔逐渐缩短，制造“越做越多”的节奏。 |
| VO | With AI, anyone can build little web apps — just for themselves. |
| 中文 | 有了 AI，每个人都能做出只为自己服务的小网页应用。 |
| 素材 | 对话气泡 mock、小应用缩略卡（新组件，纯色块 + 标题即可，不必真实页面） |

#### S2 — 散落与卡壳（4–11s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 前半（4–7s）：镜头拉远，缩略卡各自飞向不同的文件夹图标，文件夹下标注路径：`~/Projects/budget-tracker/dist`、`~/Downloads/recipe-box`、`~/Desktop/reading-list`、`~/Documents/ai-tests/habit-tracker`。后半（7–11s）：光标依次双击其中两个 `index.html`——Recipe Box 正常打开，卡片角上一个绿勾；Budget Tracker 打开后是一片空白，弹出标签 `Needs a local server`。 |
| 动效 | 卡片沿弧线飞散，落进文件夹后轻微抖动；双击后弹出小浏览器窗口，正常 / 空白形成对比；空白窗口轻微晃动。 |
| VO | But they're scattered all over your Mac. Some open with a double-click — others need a server just to load. |
| 中文 | 可它们散落在 Mac 的各个角落。有的双击就能打开，有的却得放到服务器上才能正常使用。 |

#### S3 — 收拢（11–14s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 所有文件夹和缩略卡被同时吸向画面中央，空白窗口与标签在途中消失；画面清空，中央出现大字。 |
| 字幕（大字） | **All your little apps. One home.** |
| VO | What if they all had one home? |
| 中文 | 如果它们都能有一个家呢？ |

### 第 2 幕 — 产品登场 + 建站

#### S4 — LocalServe 登场（14–18s）

| 字段 | 内容 |
| --- | --- |
| 画面 | App 图标从中央弹出 → 展开为 `MacWindow` 主窗口（空列表态：“No sites yet”）。 |
| 字幕（角标） | No CLI. No cloud. Just your Mac. |
| VO | Meet LocalServe. It turns any folder into a local site — no terminal, no cloud. |
| 中文 | 认识 LocalServe：把任意文件夹变成本地站点，不用命令行，也不用上云。 |
| 组件 | `assets/brand/app-icon.png`、`MacWindow` + `AppWindow`（空状态） |

#### S5 — 新建站点（18–26s）

| 字段 | 内容 |
| --- | --- |
| 画面 | `MacCursor` 点击空状态里的 “Add site” → `SiteDrawer`（标题 “Add site”）弹出；逐字输入名称 `Budget Tracker`；点击 “Choose folder…” 后目录填为 `~/Projects/budget-tracker/dist`，右侧出现绿色勾（`dirCheck="ok"`，UI 只有图标没有文字）；输入端口 `5173`；打开 “Enable LAN access”（为 S10 扫码埋点）。代理规则留到 S8 再加。 |
| 动效 | 抽屉 `enter`；输入框逐字填写 + 光标闪烁；目录绿勾弹出；LAN 开关用数值 `Toggle` 过渡。 |
| VO | Pick the folder, choose a port… |
| 中文 | 选好文件夹，设个端口…… |
| 数据 | `acmeDraft` |

#### S6 — 保存并启动（26–30s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 点击 “Save and start” → 抽屉收起 → `SiteCard` 弹入（`presence.enter`），状态 Starting → **Running**，“Port 5173” 标签展开（`portReveal`）；光标移到“在浏览器打开”按钮，tooltip 显示 `http://127.0.0.1:5173`（卡片本身不显示地址文本）。 |
| VO | …and hit start. That's it. |
| 中文 | 点启动，就这么简单。 |
| 数据 | `acmeSite` |

#### S7 — 打不开的页面，现在能用了（30–36s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 前 1.5s 回闪 S2：`file:///…/budget-tracker/dist/index.html`，页面一片空白，左上角小字 “Before”。随后切回：点击卡片的“在浏览器打开”按钮 → 浏览器窗口打开 Budget Tracker，页面正常；进入 `/settings/categories` 并刷新，依然正常。右下角小日志条：`GET /settings/categories 200 (SPA fallback)`。 |
| VO | Remember the one that only showed a blank page? Now it just works — deep links and refreshes too. |
| 中文 | 还记得那个只显示空白页的应用吗？现在直接能用，深层路由、刷新也不会 404。 |
| 素材 | 浏览器 chrome mock + Budget Tracker 页面（`AcmePage`）；日志行来自 `acmeLogs` l7 |

### 第 3 幕 — 连接接口

#### S8 — 反向代理（36–46s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 左：卡片菜单 “Edit site” → `SiteDrawer`（`mode="edit"` + `runningOnOpen`）展开 “Proxy rules”，点 “Add proxy rule” 填入 `/api → http://127.0.0.1:9083`（“Origin” 开关开启），点 “Save and apply”。右：示意图，浏览器 → `:5173/api/me` → LocalServe → `:9083`，同源请求返回 **200**；一个红色 “CORS error” 标签被划掉。 |
| 动效 | 规则行插入；请求光点沿路径流动；200 绿色徽章弹出。 |
| VO | Need it to talk to an API? Add a proxy rule. Same origin, no CORS headaches. |
| 中文 | 需要连接口？加一条代理规则，同源访问，告别跨域。 |
| 数据 | `acmeSite.proxyRules`、`acmeLogs` l5–l6 |

### 第 4 幕 — 好记的域名

#### S9 — 自定义域名（46–54s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 列表里弹入第二张卡片 Recipe Box（`presence.enter`，此前画面只有 Budget Tracker，避免穿帮）；悬停打开按钮，tooltip 为 `http://recipes.ls`；浏览器地址栏从 `127.0.0.1:4000` 变成 `http://recipes.ls`，页面是菜谱列表。可插一帧抽屉里 “Enable custom domain” 的帮助提示 “Saving requires administrator approval”，一闪而过。 |
| VO | Give every app a name you'll remember. LocalServe manages hosts for you. |
| 中文 | 给每个应用起个好记的域名，hosts 由 LocalServe 帮你托管。 |
| 数据 | `docsSite` |

### 第 5 幕 — 局域网与手机

#### S10 — 扫码（54–61s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 回到 Budget Tracker 卡片，点击二维码按钮（tooltip “Scan to open”）→ `QrPopup`（“LAN access”）弹出，二维码 + `http://192.168.1.24:5173` + “Scan with a phone on the same Wi-Fi”。 |
| VO | Same Wi-Fi? Scan the code. |
| 中文 | 同一个 Wi-Fi？扫一下就行。 |
| 数据 | `ACME_LAN_URL` |

#### S11 — 手机预览（61–68s）

| 字段 | 内容 |
| --- | --- |
| 画面 | iPhone 外框从右侧滑入，打开同一个 Budget Tracker 页面（移动端布局）；Mac 侧日志滚出 `GET / 200 (192.168.1.31 · iPhone)` 与一条 `/api/me` 代理日志。 |
| VO | Your app — and its API — on any device in the room. |
| 中文 | 应用连同接口，在身边任何设备上打开。 |
| 素材 | 手机外框 mock；`acmeLogs` l11–l12 |

### 第 6 幕 — 文件分享

#### S12 — 扫码下载文件（68–76s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 镜头上移到 `FileSharePanel`：`Demo.mp4`、`Specs.pdf` 等文件卡片依次落入；点击 “Show QR code” → 手机扫码后出现下载完成提示。 |
| VO | Need to send a file to your phone? Drop it in. Scan. Done. No cables, no cloud. |
| 中文 | 想把文件传到手机？拖进来，扫一扫，搞定。不用数据线，也不用网盘。 |
| 数据 | `demoFiles` |

### 第 7 幕 — CTA

#### S13 — 结尾卡（76–87s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 背景虚化的 App 窗口（站点列表里是 Budget Tracker、Recipe Box、Reading List，呼应开头“一个家”）；前景 Logo + 三枚价格标签依次出现：**7-day free trial · No account** / **One-time purchase · No subscription** / **Up to 3 Macs**。最后定格：**LocalServe — Download for macOS**，下方放官网链接。 |
| VO | Try it free for seven days — no account needed. Then buy once, and it's yours forever. LocalServe. All your little apps, one home. |
| 中文 | 免费试用 7 天，无需注册。之后一次买断，永久使用。LocalServe，给你的小应用一个家。 |
| 素材 | `assets/brand/logo.png`；`demoSites`；`License` 组件可作为背景参考 |
| 注意 | 第二枚标签可写为 `$9 once · No subscription`。 |

---

## 旁白全文（英文，便于录音 / TTS）

> With AI, anyone can build little web apps — just for themselves.
> But they're scattered all over your Mac. Some open with a double-click — others need a server just to load.
> What if they all had one home?
> Meet LocalServe. It turns any folder into a local site — no terminal, no cloud.
> Pick the folder, choose a port… and hit start. That's it.
> Remember the one that only showed a blank page? Now it just works — deep links and refreshes too.
> Need it to talk to an API? Add a proxy rule. Same origin, no CORS headaches.
> Give every app a name you'll remember. LocalServe manages hosts for you.
> Same Wi-Fi? Scan the code. Your app — and its API — on any device in the room.
> Need to send a file to your phone? Drop it in. Scan. Done. No cables, no cloud.
> Try it free for seven days — no account needed. Then buy once, and it's yours forever.
> LocalServe. All your little apps, one home.

约 175 词，按 ~150 wpm 语速约 70s 纯语音，其余为留白与转场，与 87s 匹配。S1 约 10 词 / 4s、S2 约 19 词 / 7s，均在正常语速内。

---

## 声音设计

- BGM：轻快 lo-fi / 电子，约 110–120 BPM；S1 轻快上扬，S2 后半（空白页）转为低通、略带不安，S3 收拢处做一次 drop。
- 音效：缩略卡弹出（S1）、卡片落进文件夹、双击（S2）、按钮点击、Running 状态“叮”、二维码扫描“哔”、文件下载完成提示音。
- 旁白下 BGM 压到 -18 ~ -20 LUFS 相对电平，结尾卡 BGM 回升。

## 字幕规范

- 底部安全区内硬字幕，单行 ≤ 42 字符，必要时两行。
- S3 和 S13 用大字标题代替普通字幕。
- 同时导出 `.srt`，上传 YouTube 作为 CC 字幕（可加中文、日文翻译轨）。

---

## YouTube 发布物料

**标题（候选）：**

1. All Your AI-Built Web Apps, One Home on Your Mac | LocalServe
2. LocalServe — Turn Any Folder into a Local Website on Mac (No CLI)
3. Preview Your Web Apps on Your Phone in 10 Seconds | LocalServe for macOS

**简介模板：**

```
Built a bunch of little web apps with AI? LocalServe gives them one home on your Mac — every folder becomes a local website, no terminal, no cloud.

✓ Opens apps that show a blank page from a double-click
✓ One-click local sites with SPA fallback
✓ Reverse proxy for your API (no more CORS)
✓ Custom local domains like recipes.ls
✓ Scan a QR code to open it on your phone
✓ Share files to any device on your Wi-Fi

7-day free trial, no account. One-time purchase, up to 3 Macs.
Download: <官网链接>

00:00 Your little apps, scattered everywhere
00:14 Create a site in seconds
00:36 Connect to your API
00:46 Custom local domains
00:54 Open it on your phone
01:08 Share files over Wi-Fi
01:16 Try it free
```

**缩略图思路：** 左侧散落的几个文件夹图标汇入中间的 Mac 窗口（Budget Tracker 卡片 Running 绿点），右侧手机显示同一页面；大字 “ALL YOUR APPS → ONE HOME”。

**标签：** localserve, ai apps, vibe coding, personal web apps, local web server mac, live server alternative, static site server, reverse proxy, cors, spa, mobile preview

---

## 衍生：Shorts 竖版（~30s，可选）

S1+S2 压缩（6s）→ S3 大字（2s）→ S5+S6 压缩（5s）→ S7 前后对比（4s）→ S10+S11（8s）→ S13（5s）。旁白取对应句子，画面使用 1080×1920 构图，App 窗口居上、手机居下。

---

## 实现映射（Remotion）

样片：Composition `PromoSample`（`src/compositions/PromoSample.tsx`）已按 v3 实现完整 S1–S13（0–87s），字幕为硬字幕（56px，单行），暂无 VO / BGM。

| 分镜 | 实现 |
| --- | --- |
| S1–S3 | `promo/HookScenes.tsx` 的 `AppsHookScene`：一个连续场景，同一批小应用卡片从对话中长出 → 飞散到各文件夹 → 双击对比 → 汇聚进 LocalServe 图标。S3 汇聚借鉴 video-shotcraft 镜头卡 `bezier-source-converge-merge`（错峰连线、沿曲线 inOutCubic 汇聚、0.75 拐点三段式缩小、接收脉冲 +12% 与单次涟漪） |
| S4–S6 | `promo/BuildSiteScene.tsx` |
| S7 | `promo/FeatureScenes.tsx` 的 `SpaScene`：前 1.5s `file://` 空白页 + “Before” 标签，随后切到 LocalServe 打开的同一页面 |
| S8–S12 | `promo/FeatureScenes.tsx`（`ProxyScene` `DomainScene` `PhoneScene` `FilesScene`） |
| S13 | `promo/FeatureScenes.tsx` 的 `EndCardScene` |
