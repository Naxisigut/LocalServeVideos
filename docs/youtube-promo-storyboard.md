# LocalServe YouTube 推广视频 — 分镜脚本 v9

> v9 相对 v8 的改动：
>
> - **S10–S11 缩短为 6.9s**，S12 提前到 59.4s，去掉 VO 结束后的空等。
> - **S12 缩短为 5.4s**，动画节奏对齐 “Pick. Scan. Done.”：文件 0.3s 起依次落入，2s 弹出二维码，2.5s 手机滑入，约 3.4s 下载完成。
> - **S13 提前到 64.8s**；VO 拆为两句 “Try it free for seven days — no account needed.” / “Then buy once, and it's yours forever.”（vo17 / vo18，原 vo18 顺延为 vo19）。全片约 74s（vo19 提前到 70.4s，紧接 vo18）。
>
> v8 相对 v7 的改动：
>
> - **S8 经 LocalServe 的一段**：蓝 / 绿圆点到达图标边缘后，直接瞬移到图标另一侧边缘继续前进；移动速度与红色 Response 相同；绿勾出现后留约 0.75s 气口再切镜。S8 缩短为 10.5s。
> - **S9 缩短为 5.5s**，去掉 VO 结束后的空等。S9 起各镜头整体提前 4s；全片约 79.5s。
>
> v7 相对 v6 的改动：
>
> - **S5 去掉 “Enable LAN access”**，表单只填名称、文件夹、端口。
> - **点击 “Add site” 移到 S4 结尾**：“Pick the folder” 开口时，新建站点弹窗已经打开。
> - S5 缩短为 4s，S6 起各镜头整体提前 2.5s；全片约 83.5s。
>
> v6 相对 v5 的改动：
>
> - **S8 前新增 S7 “进阶引入”**（3s，占用原 S7 的空号）：画面中央大字 “Need more?” 由轻微模糊变清晰出现，再以柔和的模糊溶解 morph 变为两行 “Here are a few / **power features.**”（第二行强调色）。S8 起各镜头整体后移 3s。
> - 全片约 86s。
>
> v5 相对 v4 的改动：
>
> - **S6、S7 合并**：S6 结尾点击“在浏览器打开”，直接展开正常页面，不再闪回空白页，字幕顺带提一句。
> - **进阶部分去掉连接词**：只保留第一句 “Need more?”，之后不再用 “Next” / “One more thing”。
> - **章节标签重做**：去掉 “POWER FEATURE” 字样，改为“图标 + 功能名”标题，下方细进度条随镜头推进。
> - **S8 重画**：左右对称；标题去掉 ✕ / ✓；红色 ✕ 直接落在虚线正中，不要竖杠；文案 “Blocked by CORS”；两侧不显示 IP；按 CORS 的实际机制，请求先到达服务器，被拦的是**从右往左**返回的响应；经 LocalServe 的一段同样按“请求向右、响应向左”演示，圆点连续穿过中间图标、不分两段；节点标签为 “app” / “remote server”，中间图标下方为 “Proxy rule”，不加顶部 Without / With 标签；紫色连接线两端与节点、图标间距一致。
> - **S9** 去掉 “Saving requires administrator approval” 提示。
> - **App 窗口与浏览器 / 手机纵向居中对齐**（S9、S10–S11、S12）。
> - 全片约 83s。
>
> v4 相对 v3 的改动：
>
> - **S1 拆成两个镜头**：先是 AI 对话（每条请求都有“做好了”的回复），再切到小应用卡片陆续出现。
> - **S2 改为一前一后两个窗口**：Recipe Box 打开 → 加载 → 中间绿勾 → 缩回；Budget Tracker 打开 → 窗口中间红字 “Needs a local server”。文案改为 “Some pages just open and work. / Others only load through a local server.”
> - **S7 只讲“现在能用了”**，不再展示深层路由与刷新。
> - **第 3 幕起标明“进阶功能”**：字幕用 “Need more? Here are a few power features.” 开场，后续每个功能用 “Next: …” / “One more thing: …” 过渡；画面左上角加章节标签（POWER FEATURE 1–3 / BONUS）。
> - **S8 改为前后对比示意图**：先演示网页直连接口被浏览器拦下，再演示中间加入 LocalServe 后请求顺利通过；节点用浏览器窗口、App 图标、服务器机柜三种不同图形，不再是三个方块。
> - **第 5 幕压缩到 8s**（原 14s，中间等待过长）。
> - 全片约 85s。
>
> v3 改动（保留）：开头从“AI 时代人人都在做个人小网页应用，但它们散落各处、有的必须放到本地服务器上才能用”切入；删去“管理与常驻”幕；演示数据改为个人小应用。
>
> 画面文案以 `src/ui/i18n.ts` 英文为准（按钮名、提示语与 App 一致），下文引号内的 UI 文案均已对齐。

## 概览

| 项目 | 规格 |
| --- | --- |
| 片名（工作） | LocalServe — All your little web apps, one home |
| 时长 | ~74 秒（30fps，2220 帧） |
| 分辨率 | 1920×1080 横屏；可另切 1080×1920 Shorts 版（见文末） |
| 语言 | 英文旁白 + 英文硬字幕（中文为对照，方便审稿） |
| 受众 | 用 AI 做小工具的 Vibe Coding 用户、独立开发者、海外前端开发者 |
| 风格 | 干净、节奏明快；产品 UI 为 `src/ui/` 组件 + 演示数据，不录真实杂乱桌面 |
| 主线 | AI 帮你做出一堆个人小应用 → 散落各处、有的打不开 → 全部收进 LocalServe → 基础用法（建站、打开）→ 进阶功能（接口代理、域名、手机、文件分享） |

**一句话卖点：** All your little web apps, one home. No CLI. No cloud. Just your Mac.

**核心事实（避免夸大）：**

- 仅 macOS；无需命令行、无需账号、无需联网即可试用。
- 7 天免费试用，试用判断完全在本机完成。
- 永久许可证，一次性买断、无订阅，最多 3 台 Mac；激活后可永久离线使用。
- 价格：**$9 一次性买断**（演示数据 `USD 9.00` 与正式定价一致）。
- 不要提 HTTPS（暂不支持）、不要提“开机自启”（当前版本尚未提供）。

**演示数据（**`src/demo/acme.ts`**）：**

| 站点 | 目录 | 端口 / 域名 | 角色 |
| --- | --- | --- | --- |
| Budget Tracker | `~/Projects/budget-tracker/dist` | 5173，`/api` 代理到 `:9083` | 主角：需要本地服务器的构建产物，连接口，手机访问 |
| Recipe Box | `~/Downloads/recipe-box` | 4000，`recipes.ls` | 双击就能用的纯 HTML 页面；演示自定义域名 |
| Reading List | `~/Desktop/reading-list` | 8080 | S1 / S2 画面 |
| Habit Tracker | `~/Documents/ai-tests/habit-tracker` | 3000 | S2 画面 / Gallery 错误态 |

S1–S2 另有 Trip Planner、Plant Log 两张纯装饰卡片，不进入 App 数据。

---

## 幕结构

| 幕 | 时间 | 内容 |
| --- | --- | --- |
| 1 钩子 / 需求 | 0–17s | AI 让人人都能做小应用；但它们散落各处，有的必须靠本地服务器才能打开 |
| 2 产品登场 + 基础用法 | 17–33.5s | 选文件夹 → 保存并启动 → 点开就是正常页面 |
| 3 进阶 1：接口代理 | 33.5–47s | 引入大字（S7）→ 直连被拦 vs 经 LocalServe 通过（S8） |
| 4 进阶 2：好记的域名 | 47–52.5s | `recipes.ls` 自定义域名 |
| 5 进阶 3：手机访问 | 52.5–59.4s | 二维码 → 手机打开同一站点 |
| 6 附加：文件分享 | 59.4–64.8s | 拖入文件，手机扫码下载 |
| 7 CTA | 64.8–74s | 试用 / 价格 / 下载 |

---

## 分镜 S1–S13（原 S7 已并入 S6，S7 改为进阶引入）

### 第 1 幕 — 钩子 / 需求

> 思路：先用例子让观众认出自己（“我也做过这种小东西”），再点出共同的困境，最后一句话收拢。不讲术语，不出现终端。

#### S1a — AI 对话（0–3.5s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 画面中央一个 AI 对话框。三条请求依次打出：`Make me a budget tracker` / `A recipe box for my family` / `A reading list I can tag`；每条之后 AI 回复一行 “Done — Budget Tracker is ready.”（带该应用的颜色方块）。 |
| 动效 | 打字机输出；回复气泡淡入上浮。 |
| VO | With AI, anyone can build little web apps — |
| 中文 | 有了 AI，每个人都能做出小网页应用—— |

#### S1b — 小应用出现（3.5–6s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 硬切到新画面：6 张小应用卡片（Budget Tracker、Recipe Box、Reading List、Habit Tracker、Trip Planner、Plant Log）在画面中央 3×2 依次弹出，间隔越来越短，落定后停 1 秒。 |
| VO | — just for themselves. |
| 中文 | ——只为自己服务的那种。 |

#### S2 — 散落，有的能用、有的不能（6–14s）

| 字段 | 内容 |
| --- | --- |
| 画面 | ① 6–8.3s：卡片沿弧线飞散到各自的文件夹，下方标注路径（`~/Projects/budget-tracker/dist`、`~/Downloads/recipe-box` 等）。② 8.3–12.2s：其他卡片变淡，光标双击 Recipe Box → 浏览器窗口从卡片里放大到画面中央 → 转一下加载圈 → 页面出现，中间弹出绿色对勾 → 停一下 → 窗口缩回卡片。③ 12.2–14s：光标双击 Budget Tracker → 窗口再次放大 → 中间出现红色 ✕ 和 “Needs a local server”，窗口轻微晃动。 |
| 动效 | 飞散错峰加速；窗口从卡片位置放大、缩回卡片位置；绿勾弹出后自绘；红字弹出 + 左右轻晃。 |
| VO | But they're scattered all over your Mac. Some pages just open and work. Others only load through a local server. |
| 中文 | 可它们散落在 Mac 的各个角落。有些网页直接打开就能用，另一些却必须通过本地服务器才能访问。 |

#### S3 — 收拢（14–17s）

| 字段 | 内容 |
| --- | --- |
| 画面 | Budget Tracker 窗口缩回；中央出现一个与 App 图标同尺寸的**问号图标**（此时还不揭晓 LocalServe），各卡片沿曲线被吸进问号图标，图标轻弹一下、放出一圈涟漪；下方大字落定，切镜前大字淡出，问号图标原地保留接 S4。 |
| 字幕（大字） | **All your little apps. One home.**（底部同时显示 VO 字幕） |
| VO | What if they all had one home? |
| 中文 | 如果它们都能有一个家呢？ |

### 第 2 幕 — 产品登场 + 基础用法

#### S4 — LocalServe 登场（17–21s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 承接 S3 留下的问号图标（同位置、同大小）。① “Meet LocalServe.” 时：问号模糊淡出，LocalServe App 图标在原位由模糊变清晰地替换它。② “It turns any folder…” 时：App 图标展开为 `MacWindow` 主窗口（空列表态：“No sites yet”）。③ “…no terminal, no cloud.” 时：光标点击 “Add site”，`SiteDrawer` 弹出，赶在 S5 开始前打开完毕。 |
| VO | Meet LocalServe. It turns any folder into a local site — no terminal, no cloud. |
| 中文 | 认识 LocalServe：把任意文件夹变成本地站点，不用命令行，也不用上云。 |

#### S5 — 新建站点（22.5–26.5s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 开场时 `SiteDrawer` 已打开（S4 结尾已点过 “Add site”）；输入名称 `Budget Tracker`；“Choose folder…” 选 `~/Projects/budget-tracker/dist`（绿勾）；端口 `5173`。不打开 “Enable LAN access”。 |
| VO | Pick the folder, choose a port… |
| 中文 | 选好文件夹，设个端口…… |

#### S6 — 保存、启动并打开（26.5–33.5s，原 S6 + S7 合并）

| 字段 | 内容 |
| --- | --- |
| 画面 | 点击 “Save and start” → `SiteCard` 弹入，Starting → **Running**；光标点击“在浏览器打开”按钮 → 浏览器窗口从按钮处放大展开，`http://127.0.0.1:5173` 上 Budget Tracker 正常显示（不再闪回空白页）。 |
| VO | …and hit start. That's it. That blank page from before? Now it just works. |
| 中文 | 点启动，就这么简单。之前那个空白页？现在直接能用了。 |

### 第 3 幕 — 进阶 1：接口代理

> 从这里开始是进阶功能。S7 用一张大字卡引入，之后左上角章节标题（图标 + 功能名 + 随镜头推进的进度条）依次为 API proxy / Custom domains / Open on your phone / File sharing。只在 S7 用 “Need more?” 引入，之后不再用 “Next” 等连接词。

#### S7 — 进阶引入（33.5–36.5s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 浅色背景（与 S8 同款），无章节标题、无底部字幕。① 0–0.6s：画面中央大字 **Need more?** 从轻微模糊（≤8px）淡入变清晰，并从 94% 轻微放大到 100%。② 1–1.7s：文字 morph——旧文字轻微放大、模糊淡出，新文字从轻微模糊中淡入，变为两行 **Here are a few** / **power features.**，第二行为强调色，不加下划线。③ 2.7–3s：整体上移淡出，接 S8。 |
| VO | Need more? Here are a few power features. |
| 中文 | 还想要更多？来看几个进阶功能。 |

#### S8 — 直连被拦 vs 经 LocalServe 通过（36.5–47s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 左右对称（两节点距中心等距、等高）：左为浏览器窗口（Budget Tracker 页面，蒙着 “Loading data…”），下方 “app”；右为服务器机柜，下方 “remote server”；两侧不显示 IP，顶部不加 Without / With 标签（章节标题 “API proxy” 已说明主题）。① 灰色虚线连接两侧，蓝色请求 `GET /api/me` 从应用到达服务器（指示灯闪一下）；红色 “Response” 从服务器**向左**返回，到虚线正中淡出，红色 ✕ 弹出，下方 “Blocked by CORS”，页面变为 “Couldn't load data”。② ✕ 与虚线淡出，LocalServe 图标弹入中间，下方 “Proxy rule”；两段紫色实线从两侧画出，线端与 app、服务器、中间图标保持**相同间距**；蓝色请求从应用快速滑到图标左边缘，**瞬移**到图标右边缘继续滑向服务器；绿色 “Response” 同样**向左**返回，到图标右边缘瞬移至左边缘再回到应用（速度与红色 Response 相同）；页面蒙层消失，浏览器窗口正中弹出绿色圆形对勾（与 S2 同款，对勾自绘），不另加文字标签。 |
| VO | When your local site calls a remote server directly, it usually gets blocked by CORS. Add a proxy rule in LocalServe, and it goes through. |
| 中文 | 本地网页直接调用远程服务器，通常会被 CORS 拦下；在 LocalServe 里加一条代理规则，就能顺利通过。 |

### 第 4 幕 — 进阶 2：好记的域名

#### S9 — 自定义域名（47–52.5s）

| 字段  | 内容                                                                                                                         |
| --- | -------------------------------------------------------------------------------------------------------------------------- |
| 画面  | 列表弹入第二张卡片 Recipe Box；悬停打开按钮，tooltip `http://recipes.ls`；右侧浏览器（与 App 窗口纵向居中对齐）地址栏从 `127.0.0.1:4000` 变成 `http://recipes.ls`。 |
| VO  | You can give each site a memorable domain name. LocalServe manages hosts for you.                                          |
| 中文  | 给每个应用起个好记的名字，hosts 由 LocalServe 帮你托管。                                                                                      |

### 第 5 幕 — 进阶 3：手机访问

#### S10–S11 — 扫码 → 手机打开（52.5–59.4s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 点击 Budget Tracker 的二维码按钮 → `QrPopup` 弹出（约 1s 处）；约 2.8s 手机从右侧滑入（与 App 窗口纵向居中对齐），显示同一个页面；随后一条 iPhone 访问日志（不显示 API 代理日志）。 |
| VO | You can also open your sites on any device by scanning the QR code, as long as it's on the same Wi‑Fi. |
| 中文 | 扫一下二维码，同一 Wi‑Fi 下的任何设备都能打开你的应用。 |

### 第 6 幕 — 附加：文件分享

#### S12 — 扫码下载文件（59.4–64.8s）

| 字段 | 内容 |
| --- | --- |
| 画面 | `FileSharePanel` 文件依次落入；点击 “Show QR code”（约 2s）→ 手机扫码（约 2.5s）后下载完成（约 3.4s），对齐 “Pick. Scan. Done.”。 |
| VO | Same goes for file sharing. Pick. Scan. Done. No cables, no cloud. |
| 中文 | 文件分享也一样。选好，扫一扫，搞定。不用数据线，也不用网盘。 |

### 第 7 幕 — CTA

#### S13 — 结尾卡（64.8–74s）

| 字段 | 内容 |
| --- | --- |
| 画面 | 背景虚化的 App 窗口（Budget Tracker、Recipe Box、Reading List）；Logo + 三枚标签：**7-day free trial · No account** / **$9 once · No subscription** / **Up to 3 Macs**；最后 **Download for macOS**。 |
| VO | ① Try it free for seven days — no account needed.（vo17）② Then buy once, and it's yours forever.（vo18）③ LocalServe. All your little apps, one home.（vo19） |
| 中文 | 免费试用 7 天，无需注册。之后一次买断，永久使用。LocalServe，给你的小应用一个家。 |

---

## 旁白全文（英文，便于录音 / TTS）

> With AI, anyone can build little web apps — just for themselves.
> But they're scattered all over your Mac. Some pages just open and work. Others only load through a local server.
> What if they all had one home?
> Meet LocalServe. It turns any folder into a local site — no terminal, no cloud.
> Pick the folder, choose a port… and hit start. That's it.
> That blank page from before? Now it just works.
> Need more? Here are a few power features.
> When your local site calls a remote server directly, it usually gets blocked by CORS. Add a proxy rule in LocalServe, and it goes through.
> You can give each site a memorable domain name. LocalServe manages hosts for you.
> You can also open your sites on any device by scanning the QR code, as long as it's on the same Wi‑Fi.
> Same goes for file sharing. Pick. Scan. Done. No cables, no cloud.
> Try it free for seven days — no account needed.
> Then buy once, and it's yours forever.
> LocalServe. All your little apps, one home.

约 180 词，按 ~150 wpm 约 72s 纯语音，与 79.5s 匹配。

---

## 声音设计

- BGM：轻快 lo-fi / 电子，约 110–120 BPM；S2 后半（红字）转为低通、略带不安，S3 收拢处做一次 drop；S8 进入进阶部分时可加一个小转场音。
- 音效：对话回复（S1a）、卡片弹出（S1b）、飞散落地、双击、绿勾、红字（S2）、文字 morph（S7）、请求被拦（S8）、Running 状态、扫码、下载完成。
- 旁白下 BGM 压到 -18 ~ -20 LUFS 相对电平，结尾卡 BGM 回升。

## 字幕规范

- 底部安全区内硬字幕，56px，单行（≤ 50 字符）。
- S7 用大字标题代替普通字幕；S3 的大字与 VO 不同，仍保留底部字幕。
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

✓ Opens apps that only work through a local server
✓ One-click local sites
✓ Reverse proxy for your API (no more CORS)
✓ Custom local domains like recipes.ls
✓ Scan a QR code to open it on your phone
✓ Share files to any device on your Wi-Fi

7-day free trial, no account. One-time purchase, up to 3 Macs.
Download: <官网链接>

00:00 Your little apps, scattered everywhere
00:17 Create a site in seconds
00:33 API proxy
00:47 Custom domains
00:52 Open it on your phone
01:00 Share files over Wi-Fi
01:08 Try it free
```

**缩略图思路：** 左侧散落的几个文件夹图标汇入中间的 Mac 窗口（Budget Tracker 卡片 Running 绿点），右侧手机显示同一页面；大字 “ALL YOUR APPS → ONE HOME”。

**标签：** localserve, ai apps, vibe coding, personal web apps, local web server mac, live server alternative, static site server, reverse proxy, cors, spa, mobile preview

---

## 衍生：Shorts 竖版（~30s，可选）

S1a+S1b 压缩（4s）→ S2 双击对比（5s）→ S3 大字（2s）→ S5+S6 压缩（含点开正常页面，8s）→ S10–S11（6s）→ S13（5s）。画面使用 1080×1920 构图，App 窗口居上、手机居下。

---

## 实现映射（Remotion）

样片：Composition `PromoSample`（`src/compositions/PromoSample.tsx`）已按 v9 实现（0–74s），硬字幕 + 章节标题 + 临时 VO（macOS `say` 生成，用于卡节奏），暂无 BGM / 音效。

| 分镜 | 实现 |
| --- | --- |
| S1–S3 | `promo/HookScenes.tsx` 的 `AppsHookScene`（S1a 对话单独成画面，S1b 起同一批卡片连续出现、飞散、双击、汇聚）。S3 汇聚借鉴 video-shotcraft 镜头卡 `bezier-source-converge-merge` |
| S4–S6 | `promo/BuildSiteScene.tsx`（结尾点击打开，浏览器展开正常页面） |
| S7 | `promo/PowerIntroScene.tsx`（逐帧模糊 + 透明度 + 缩放的溶解式文字 morph） |
| S8 | `promo/ProxyScene.tsx` |
| S9–S12 | `promo/FeatureScenes.tsx`（`DomainScene` `PhoneScene` `FilesScene`） |
| S13 | `promo/FeatureScenes.tsx` 的 `EndCardScene` |
| 章节标签 / 字幕 | `promo/shared.tsx` 的 `SectionTag` / `Caption`，时间表在 `PromoSample.tsx` |
| VO | 分句与起始时间在 `promo/voiceover.ts`；`node scripts/gen-temp-vo.mjs [voice] [rate]` 生成 `public/voiceover/promo/*.wav` 并报告超出槽位的句子；正式配音按同名文件替换即可 |
