# LocalServe YouTube Main Video — Storyboard

## Overview

| Item | Spec |
| --- | --- |
| Working title | LocalServe YouTube main (structure A) |
| Length | ~70 seconds |
| Resolution | 1920×1080 (landscape) |
| Language | English VO + English burned-in captions |
| Audience | Overseas developers / indie makers |
| Narrative | Structure A — one complete local workflow |
| Proxy segment | Kept short (~8s, S6) |
| Composition | `compositions/youtube-main.html` |
| Audio (v1) | None yet — captions stand in for VO; do not claim audio exists |

**One-liner:** You built a frontend. LocalServe turns the folder into a local site, proxies your API, and lets you scan to preview on your phone — no CLI, no cloud.

---

## Act timeline

| Act | Range | Focus |
| --- | --- | --- |
| 1 Opening / pain | 0–10s | Build done, but local run is messy |
| 2 One-click site | 10–30s | Drop folder → start → SPA works |
| 3 Reverse proxy | 30–38s | `/api` → localhost, no CORS (~8s) |
| 4 LAN QR | 38–55s | Same Wi‑Fi phone preview |
| 5 CTA | 55–70s | Menu bar + pricing / download |

---

## Shot list S1–S10

### S1 — Pain: build done, now what?

| Field | Content |
| --- | --- |
| Shot | S1 |
| Time | 0–4s |
| Visual | Terminal after a successful build; `dist/` highlighted. Brief flash of CORS / 404 error chips. |
| VO | You built it. Now… how do you actually run it locally? |
| Caption | You built it. Now… how do you actually run it locally? |
| Assets | Terminal screenshot or HTML mock of build output; CORS/404 badges |

### S2 — Pain stack

| Field | Content |
| --- | --- |
| Shot | S2 |
| Time | 4–10s |
| Visual | Stacking pain cards: `npx serve`, edit hosts, phone can’t open the site. |
| VO | Serve, proxy, hosts, phone preview—too many moving pieces. |
| Caption | No CLI. No cloud. Just your Mac. |
| Assets | Icons/cards for serve / hosts / phone fail |

### S3 — LocalServe appears

| Field | Content |
| --- | --- |
| Shot | S3 |
| Time | 10–16s |
| Visual | LocalServe app window lights up (product UI mock or real capture). |
| VO | LocalServe turns any folder into a local site. |
| Caption | LocalServe turns any folder into a local site. |
| Assets | LocalServe window chrome / logo / brand colors |

### S4 — Drop folder → start

| Field | Content |
| --- | --- |
| Shot | S4 |
| Time | 16–24s |
| Visual | Drag `dist` into the app → choose port → hit Start → status **Running**. |
| VO | Drop your build folder. Hit start. |
| Caption | Drop your build folder. Hit start. |
| Assets | Drag-drop cursor, folder badge, port field, Running pill |

### S5 — SPA routes work

| Field | Content |
| --- | --- |
| Shot | S5 |
| Time | 24–30s |
| Visual | Browser opens the local URL; navigate / refresh a deep SPA route — no 404. |
| VO | Open it in your browser—SPA routes just work. |
| Caption | Open it in your browser—SPA routes just work. |
| Assets | Browser chrome mock; SPA page; “no 404” cue |

### S6 — Reverse proxy (short)

| Field | Content |
| --- | --- |
| Shot | S6 |
| Time | 30–38s (~8s) |
| Visual | Add rule `/api` → `127.0.0.1:9083`; same-origin request returns **200**. |
| VO | Need an API? Add a reverse proxy—no more CORS. |
| Caption | Need an API? Add a reverse proxy—no more CORS. |
| Assets | Proxy rule row UI; network panel 200; strike-through CORS |

### S7 — QR + LAN URL

| Field | Content |
| --- | --- |
| Shot | S7 |
| Time | 38–48s |
| Visual | App shows QR code + LAN URL (e.g. `http://192.168.x.x:port`). |
| VO | Same Wi‑Fi? Scan to open it on your phone. |
| Caption | Same Wi‑Fi? Scan to open it on your phone. |
| Assets | QR placeholder, LAN URL string |

### S8 — Phone preview

| Field | Content |
| --- | --- |
| Shot | S8 |
| Time | 48–55s |
| Visual | Phone frame opens the same site on the LAN. |
| VO | Preview on any device on your network. |
| Caption | Preview on any device on your network. |
| Assets | Phone bezel mock; mobile site screenshot |

### S9 — Menu bar persistence

| Field | Content |
| --- | --- |
| Shot | S9 |
| Time | 55–62s |
| Visual | Close the main window; tray / menu bar icon still shows LocalServe running. |
| VO | It stays in your menu bar, ready when you are. |
| Caption | It stays in your menu bar, ready when you are. |
| Assets | macOS menu bar strip; LocalServe tray icon |

### S10 — CTA

| Field | Content |
| --- | --- |
| Shot | S10 |
| Time | 62–70s |
| Visual | End card: **$9 one-time · 7-day free trial · up to 3 Macs**. Final line: **Download LocalServe**. |
| VO | Seven days free—no account. Then nine dollars, yours forever. |
| Caption | Seven days free—no account. Then nine dollars, yours forever. |
| End slate | Download LocalServe |
| Assets | Logo, price chips, download CTA treatment |

---

## Caption / VO notes (v1)

- Burn English captions for every shot (bottom safe area).
- S2 on-screen caption is the short line **No CLI. No cloud. Just your Mac.**; VO remains the longer line.
- v1 skeleton may ship **without** recorded VO/BGM; captions visualize the script until audio is added.
- Do not imply audio exists in the rendered file until VO is mixed.

---

## Asset checklist (for next pass)

- [ ] Real LocalServe window / tray screenshots (light or dark)
- [ ] Sample `dist` folder + SPA deep-link demo
- [ ] Proxy rule + DevTools 200 response stills
- [ ] QR + real LAN URL (or anonymized)
- [ ] Phone preview capture
- [ ] English VO take (or TTS) aligned to S1–S10
- [ ] Optional soft BGM under VO
- [ ] Logo / wordmark SVG or PNG

---

## Implementation pointer

- HyperFrames composition: `compositions/youtube-main.html`
- Render: `pnpm run render:youtube-main`
- Output (local, gitignored): `renders/youtube-main-v1.mp4`
