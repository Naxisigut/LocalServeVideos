# Remotion Scaffold (HyperFrames → Remotion) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace HyperFrames with a Remotion blank scaffold in `LocalServeVideos`, copy LocalServeTauri UI CSS/components (stubs, no Tauri edits), and prove Studio preview shows a product UI shell.

**Architecture:** Scaffold Remotion blank template into a temp folder (because `create-video --yes` refuses an existing git repo), merge files into this repo, delete HyperFrames artifacts, then add `src/ui/` (copied CSS + presentational shell + one site card) fed by `src/demo/acme.ts`. Composition `UiSmoke` at 1920×1080 renders that shell for Studio.

**Tech Stack:** Remotion 4.x, React 19, TypeScript, pnpm, Node ≥22. UI styles from LocalServeTauri `global.css` (copied). No `@tauri-apps/*`.

## Global Constraints

- Do **not** modify `/Users/sdj_mac_air/Desktop/repos/LocalServeTauri` (or any Tauri path).
- UI code must be **copied** into Videos; no `file:` / workspace import of Tauri.
- This phase is **scaffold-only**: Studio + UI smoke shell. No full S1–S10, no VO/captions pipeline.
- Prefer **pnpm** (repo already uses it). Pin Remotion packages with exact versions as the template does.
- Keep `docs/youtube-main-storyboard.md` and `assets/brand/`.
- Work on the existing Mac checkout; do not use Cursor Cloud Agent unless the user explicitly agrees.
- Spec: `docs/superpowers/specs/2026-11-02-remotion-migration-design.md`.

## File map (after completion)

| Path | Responsibility |
| --- | --- |
| `package.json` | Remotion scripts/deps; no `hyperframes` |
| `remotion.config.ts` | Remotion config from blank template |
| `tsconfig.json` | TS config from template (adjust if needed) |
| `src/index.ts` | `registerRoot` entry |
| `src/Root.tsx` | Registers `UiSmoke` composition |
| `src/compositions/UiSmoke.tsx` | 1920×1080 smoke composition |
| `src/demo/acme.ts` | Demo site + LAN URL constants |
| `src/ui/styles/global.css` | Copied Tauri global CSS |
| `src/ui/types.ts` | Minimal `SiteStatus` / `SiteView` types for video |
| `src/ui/AppShell.tsx` | Titlebar + content shell using Tauri class names |
| `src/ui/SiteCardSmoke.tsx` | Presentational site card (Tauri markup/classes, no Tauri hooks) |
| `src/ui/icons.tsx` | Minimal SVG icons needed by the smoke card |
| `README.md` / `AGENTS.md` | Remotion workflow |
| Removed | `hyperframes.json`, HyperFrames `index.html`, `compositions/youtube-main.html`, HyperFrames-era `assets/ui/*` mocks (except keep `assets/brand`) |

---

### Task 1: Strip HyperFrames and prepare clean tree

**Files:**
- Delete: `hyperframes.json`, `index.html` (HyperFrames entry), `compositions/youtube-main.html`, `compositions/components/` (if empty/unused), `meta.json` (if HyperFrames-only), `assets/ui/localserve-ui.css`, `assets/ui/qr-lan.png`, `assets/ui/README.md`, `assets/ui/preview-frames/` (local previews)
- Keep: `docs/`, `assets/brand/`, `AGENTS.md`, `README.md`, `.gitignore`, `.git/`

**Interfaces:**
- Consumes: none
- Produces: repo without HyperFrames source entrypoints; `package.json` may be briefly broken until Task 2

- [ ] **Step 1: Confirm Tauri path exists and will not be touched**

Run:

```bash
test -d /Users/sdj_mac_air/Desktop/repos/LocalServeTauri && echo "tauri ok"
pwd  # must be LocalServeVideos
```

Expected: `tauri ok`; cwd under `LocalServeVideos`.

- [ ] **Step 2: Remove HyperFrames entrypoints and old HTML UI mocks**

```bash
cd /Users/sdj_mac_air/Desktop/repos/LocalServeVideos
rm -f hyperframes.json index.html meta.json
rm -f compositions/youtube-main.html
rm -rf compositions/components
rm -f assets/ui/localserve-ui.css assets/ui/qr-lan.png assets/ui/README.md
rm -rf assets/ui/preview-frames
mkdir -p assets/ui
printf '' > assets/ui/.gitkeep
```

- [ ] **Step 3: Commit strip**

```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
chore: remove HyperFrames entrypoints for Remotion migration

Keep storyboard and brand assets; UI mocks move to Remotion src.
EOF
)"
```

---

### Task 2: Merge Remotion blank template into this repo

**Files:**
- Create (from template merge): `src/index.ts`, `src/Root.tsx`, `src/Composition.tsx` (temporary; replaced later), `remotion.config.ts`, ESLint/Prettier files the template ships
- Replace: `package.json`, lockfile, `tsconfig.json` as template provides (preserve `"name": "localserve-videos"` and `engines.node`)
- Modify `.gitignore`: keep existing video ignores; add Remotion `out/` if not present

**Interfaces:**
- Consumes: clean tree from Task 1
- Produces: Studio runnable with default composition

**Note:** `npx create-video@latest --yes --blank <dir>` **fails inside an existing git repo**. Scaffold in a sibling temp directory, then copy.

- [ ] **Step 1: Scaffold blank template outside the git repo**

```bash
rm -rf /tmp/localserve-remotion-blank
npx create-video@latest --yes --blank /tmp/localserve-remotion-blank
```

Expected: project created without interactive prompts.

- [ ] **Step 2: Copy template files into LocalServeVideos**

```bash
REPO=/Users/sdj_mac_air/Desktop/repos/LocalServeVideos
TMP=/tmp/localserve-remotion-blank
ls -la "$TMP"
cp -R "$TMP/src" "$REPO/"
cp "$TMP/remotion.config.ts" "$REPO/" 2>/dev/null || true
cp "$TMP/tsconfig.json" "$REPO/"
cp "$TMP/package.json" "$REPO/package.json"
for f in eslint.config.mjs eslint.config.js .prettierrc .prettierrc.js .prettierignore; do
  [ -f "$TMP/$f" ] && cp "$TMP/$f" "$REPO/$f"
done
```

Edit `package.json` so name stays `localserve-videos`, `private: true`, `engines.node` is `>=22`. Keep template scripts (`dev` / Studio).

- [ ] **Step 3: Install with pnpm**

```bash
cd /Users/sdj_mac_air/Desktop/repos/LocalServeVideos
rm -rf node_modules pnpm-lock.yaml package-lock.json
pnpm install
```

Expected: install succeeds; `remotion` and `@remotion/cli` present.

- [ ] **Step 4: Smoke-start Studio once (then stop)**

```bash
cd /Users/sdj_mac_air/Desktop/repos/LocalServeVideos
pnpm exec remotion studio --port 3456
```

Expected: Studio serves without crash. Stop after confirming localhost URL. Entry is usually `src/index.ts`.

- [ ] **Step 5: Commit Remotion scaffold**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: scaffold Remotion blank template

Replace HyperFrames tooling with Remotion Studio entrypoints.
EOF
)"
```

---

### Task 3: Demo data + minimal UI types

**Files:**
- Create: `src/demo/acme.ts`
- Create: `src/ui/types.ts`

**Interfaces:**
- Consumes: none
- Produces: `acmeSite: SiteView`, `ACME_LAN_URL: string`; types `SiteStatus`, `ProxyRule`, `SiteView`

- [ ] **Step 1: Add `src/ui/types.ts`**

```ts
export type SiteStatus = 'stopped' | 'starting' | 'running' | 'error';

export interface ProxyRule {
  id: string;
  prefix: string;
  target: string;
  changeOrigin: boolean;
  rewritePath: boolean;
  enabled: boolean;
}

/** Video-side site view (subset aligned with LocalServeTauri contracts). */
export interface SiteView {
  id: string;
  name: string;
  rootDir: string;
  port: number;
  host: string;
  domains: string[];
  spaFallback: boolean;
  https: boolean;
  proxyRules: ProxyRule[];
  autoStart: boolean;
  appendCors: boolean;
  status: SiteStatus;
  statusMessage?: string;
  startedAt?: number;
}
```

- [ ] **Step 2: Add `src/demo/acme.ts`**

```ts
import type { SiteView } from '../ui/types';

export const ACME_LAN_URL = 'http://192.168.1.24:5173';

export const acmeSite: SiteView = {
  id: 'demo-acme',
  name: 'Acme Dashboard',
  rootDir: '~/Projects/acme/dist',
  port: 5173,
  host: '127.0.0.1',
  domains: [],
  spaFallback: true,
  https: false,
  proxyRules: [
    {
      id: 'rule-api',
      prefix: '/api',
      target: 'http://127.0.0.1:9083',
      changeOrigin: true,
      rewritePath: false,
      enabled: true,
    },
  ],
  autoStart: false,
  appendCors: false,
  status: 'running',
  startedAt: Date.now(),
};
```

- [ ] **Step 3: Commit**

```bash
git add src/demo/acme.ts src/ui/types.ts
git commit -m "feat: add Acme demo data and video SiteView types"
```

---

### Task 4: Copy Tauri CSS + presentational AppShell / SiteCardSmoke

**Files:**
- Create: `src/ui/styles/global.css` (copy from Tauri)
- Create: `src/ui/icons.tsx`, `src/ui/AppShell.tsx`, `src/ui/SiteCardSmoke.tsx`
- Create: `src/compositions/UiSmoke.tsx`
- Modify: `src/Root.tsx`; delete unused template `src/Composition.tsx` if nothing imports it

**Interfaces:**
- Consumes: `acmeSite`; `SiteView`
- Produces: `AppShell`, `SiteCardSmoke`, composition id `UiSmoke`

**Important:** Do not import from the Tauri repo. Copy bytes. Smoke card is presentational only (buttons inert).

- [ ] **Step 1: Copy CSS**

```bash
mkdir -p src/ui/styles
cp /Users/sdj_mac_air/Desktop/repos/LocalServeTauri/src/styles/global.css \
  /Users/sdj_mac_air/Desktop/repos/LocalServeVideos/src/ui/styles/global.css
```

- [ ] **Step 2: Add minimal `src/ui/icons.tsx`**

Include `PlayIcon`, `StopIcon`, `MoreIcon`, `QrCodeIcon` as simple `currentColor` SVGs.

```tsx
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const PlayIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden {...props}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const StopIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden {...props}>
    <path d="M6 6h12v12H6z" />
  </svg>
);

export const MoreIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden {...props}>
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

export const QrCodeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden {...props}>
    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm10 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2z" />
  </svg>
);
```

- [ ] **Step 3: Add `src/ui/SiteCardSmoke.tsx`**

Use Tauri class names. If CSS expects different inner classes, open Tauri `SiteCard.tsx` and match markup **exactly**.

```tsx
import React from 'react';
import type { SiteView } from './types';
import { MoreIcon, QrCodeIcon, StopIcon } from './icons';

const STATUS_TEXT: Record<SiteView['status'], string> = {
  running: 'Running',
  stopped: 'Stopped',
  error: 'Error',
  starting: 'Starting',
};

export const SiteCardSmoke: React.FC<{ site: SiteView }> = ({ site }) => {
  return (
    <div className="site-card" data-status={site.status}>
      <div className="site-card-left">
        <div className="site-card-title-row">
          <span className="site-name">{site.name}</span>
          <span className="status-badge">{STATUS_TEXT[site.status]}</span>
        </div>
        <div className="site-path">{site.rootDir}</div>
      </div>
      <div className="site-card-right">
        <div className="site-card-port-wrap is-visible">
          <span className="site-card-port">
            Port <span className="site-card-port-value">{site.port}</span>
          </span>
        </div>
        <div className="site-card-tools">
          <button type="button" className="btn-icon" aria-label="QR" tabIndex={-1}>
            <QrCodeIcon />
          </button>
          <button type="button" className="btn-icon btn-action-stop" aria-label="Stop" tabIndex={-1}>
            <StopIcon />
          </button>
          <button type="button" className="btn-icon" aria-label="More" tabIndex={-1}>
            <MoreIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Add `src/ui/AppShell.tsx`**

```tsx
import React from 'react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app" style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}>
      <div className="titlebar">
        <div className="titlebar-drag" />
        <span className="titlebar-label">LocalServe</span>
        <div className="titlebar-actions" />
      </div>
      <div className="content-area">
        <section className="sites-section">
          <div className="section-head">
            <div className="section-head-left">
              <div className="section-head-title-line">
                <span className="section-title">Sites</span>
              </div>
            </div>
          </div>
          {children}
        </section>
      </div>
    </div>
  );
};
```

- [ ] **Step 5: Add composition + register in Root**

`src/compositions/UiSmoke.tsx`:

```tsx
import React from 'react';
import { AbsoluteFill } from 'remotion';
import '../ui/styles/global.css';
import { AppShell } from '../ui/AppShell';
import { SiteCardSmoke } from '../ui/SiteCardSmoke';
import { acmeSite } from '../demo/acme';

export const UiSmoke: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: '#0b0f14',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
      }}
    >
      <div style={{ width: 720, maxWidth: '100%' }}>
        <AppShell>
          <SiteCardSmoke site={acmeSite} />
        </AppShell>
      </div>
    </AbsoluteFill>
  );
};
```

`src/Root.tsx`:

```tsx
import React from 'react';
import { Composition } from 'remotion';
import { UiSmoke } from './compositions/UiSmoke';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="UiSmoke"
        component={UiSmoke}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

Ensure `src/index.ts` still registers this root. Delete unused template `src/Composition.tsx` if nothing imports it.

- [ ] **Step 6: Typecheck / list compositions**

```bash
pnpm exec tsc --noEmit
pnpm exec remotion compositions src/index.ts
```

Expected: lists `UiSmoke` 1920x1080. Open Studio and confirm Acme card + LocalServe titlebar.

- [ ] **Step 7: Commit**

```bash
git add src/ui src/compositions src/Root.tsx src/index.ts
git add -u
git commit -m "$(cat <<'EOF'
feat: UiSmoke composition with copied LocalServe shell

Presentational site card + global.css copy; Tauri repo untouched.
EOF
)"
```

---

### Task 5: Docs pass (README + AGENTS)

**Files:**
- Modify: `README.md`, `AGENTS.md`

**Interfaces:**
- Consumes: Remotion scripts; composition id `UiSmoke`
- Produces: accurate local workflow docs

- [ ] **Step 1: Rewrite README essentials**

Must include: Remotion stack; `pnpm install`; Studio command → open `UiSmoke`; UI copied from Tauri (do not edit Tauri here); storyboard path; links to `docs/superpowers/` spec and plan.

- [ ] **Step 2: Update AGENTS.md**

Replace HyperFrames-first instructions with Remotion Studio / `UiSmoke` / copy-UI rule / no-Tauri-edits / scaffold scope.

- [ ] **Step 3: Commit**

```bash
git add README.md AGENTS.md
git commit -m "docs: Remotion workflow and UiSmoke scaffold notes"
```

---

### Task 6: Final verification checklist

**Files:** none (read-only checks)

- [ ] **Step 1: Run verification commands**

```bash
cd /Users/sdj_mac_air/Desktop/repos/LocalServeVideos
test ! -f hyperframes.json && echo "no hyperframes.json"
rg -n "hyperframes" package.json || echo "no hyperframes dep"
test -f src/ui/styles/global.css && echo "css ok"
pnpm exec remotion compositions src/index.ts
```

Expected: no `hyperframes.json`; no hyperframes dependency; css present; `UiSmoke` listed.

- [ ] **Step 2: Confirm Tauri untouched**

```bash
cd /Users/sdj_mac_air/Desktop/repos/LocalServeTauri && git status --porcelain
```

Expected: empty of our edits (report any unrelated user changes; do not revert them).

- [ ] **Step 3: Done criteria**

Studio opens; `UiSmoke` shows LocalServe shell + Acme Running card styled by copied CSS; Tauri not modified by us; HyperFrames entrypoints gone.

---

## Spec coverage (self-review)

| Spec item | Task |
| --- | --- |
| Full replace HyperFrames | 1, 2 |
| Official blank template approach | 2 (temp dir merge) |
| Copy UI, do not change Tauri | 4, 6 |
| Demo Acme data | 3 |
| Scaffold + preview only | 4, 6 |
| Keep storyboard + brand | 1 (keep), 5 (docs) |
| Update README/AGENTS | 5 |

No TBD placeholders. Exact composition id: `UiSmoke`. Exact demo module: `src/demo/acme.ts`.
