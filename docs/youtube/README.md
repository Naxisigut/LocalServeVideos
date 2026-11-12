# LocalServe YouTube 发布包

按下面清单上传即可。可复制的原文在同目录：`title.txt`、`description.txt`、`tags.txt`、`pinned-comment.txt`、`captions/`。

## 上传文件

| 用途 | 文件 | 说明 |
| --- | --- | --- |
| **成片（推荐）** | `out/PromoSample-hq.mp4` | 4K / 30fps / 74s，H.264 + AAC |
| 备选 1080p | `out/PromoSample.mp4` | 码率偏低，优先用 HQ |
| 自定义缩略图 | `out/youtube/thumbnail.png` | 1280×720，565KB；同目录也有 `.jpg` |
| 英文字幕 | `docs/youtube/captions/promo-en.srt` | 成片已烧录英文字幕；此轨用于搜索 / 无障碍 |
| 中文字幕 | `docs/youtube/captions/promo-zh.srt` | 作为翻译轨上传 |

官网：https://localserve.lccrundev.click/  
安装包：https://github.com/Naxisigut/LocalServeRelease/releases （当前 v1.0.5）  
文档：https://localserve.lccrundev.click/guide.html

## YouTube Studio 设置

| 字段 | 填法 |
| --- | --- |
| 标题 | `docs/youtube/title.txt`（61 字，不超过 100） |
| 简介 | 整段粘贴 `description.txt`。章节已满足：首条 `00:00`、至少 3 条、每段 ≥ 10s |
| 标签 | 粘贴 `tags.txt` |
| 播放列表 | 新建 `LocalServe` |
| 观众 | **不是面向儿童** |
| 类别 | Science & Technology |
| 语言 | English（字幕可再加 Chinese） |
| 改动内容 / 合成内容 | 否（产品动画，非仿真真人） |
| 付费推广 | 否 |
| 评论 | 开启 |
| 许可 | 标准 YouTube 许可 |
| 可见性 | 建议先 **不公开** 自查一遍，再改为公开 |
| 结束画面 | 从 **1:04** 到片尾（约 10s）。加「订阅」；若已加入 YPP，再加官网链接 |
| 信息卡片 | 没有其他成片可先不加。YPP 才能加外链卡 |
| 默认字幕 | 中文轨设为可选；英文字幕不要默认打开，避免和烧录字幕叠两层 |

## 标题备选

1. All Your AI-Built Web Apps, One Home on Your Mac | LocalServe ← **主推**
2. LocalServe — Turn Any Folder into a Local Website on Mac (No CLI)
3. Preview Your Web Apps on Your Phone in 10 Seconds | LocalServe for macOS

## 发布后

1. 置顶评论：粘贴 `pinned-comment.txt`
2. 片尾结束画面确认没有挡住 Download 按钮太死（订阅放角落）
3. 社区帖（可选）：官网 + 7 天试用 + 本视频链接
4. 前几小时回复评论

## 不要写进简介的内容

- 不要提 HTTPS（暂不支持）
- 不要把价格写成订阅
- 不要承诺 Windows / Linux
- 下载请链到官网或 Releases 页，不要链某个 `.dmg` 文件名（版本会变）

## 发布前自检

- [ ] 成片声音正常（旁白 + BGM），没有爆音
- [ ] 片尾 Download / 价格 / 3 Macs 与官网一致（$9、7 天试用、3 台设备）
- [ ] 简介第一条链接是 https://localserve.lccrundev.click/
- [ ] 自定义缩略图已上传，手机预览能读清 ONE HOME
- [ ] 中文字幕已上传
- [ ] 当前旁白若仍是系统 TTS，确认可以接受再公开；要换配音，替换 `public/voiceover/promo/*.wav` 后重渲
