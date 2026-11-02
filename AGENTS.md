# Remotion Composition Project (LocalServeVideos)

This folder is a [Remotion](https://www.remotion.dev/) video project: React + TypeScript compositions previewed in Remotion Studio and rendered to video. It is **not** HyperFrames.

## Skills — read these first

**Invoke the relevant Remotion skill before writing or changing compositions.**

- `remotion-best-practices` — router for Remotion work; start here
- `remotion-create` — scaffolding a composition / project
- `remotion-studio` — Studio preview workflow
- `remotion-docs` — look up Remotion APIs / current docs
- `remotion-render` — exporting MP4 / stills

Do **not** follow HyperFrames (`/hyperframes*`, GSAP `window.__timelines`, `data-start` HTML clips) for this repo.

## Commands

```bash
pnpm install     # install deps
pnpm dev         # Remotion Studio (foreground)
pnpm lint        # eslint src && tsc
pnpm build       # remotion bundle
pnpm upgrade     # remotion upgrade
```

Studio Composition to open for the scaffold smoke test: **`UiSmoke`**.

## Project structure (agents)

- `src/index.ts` — `registerRoot`
- `src/Root.tsx` — registers `UiSmoke`, `UiMotionDemo`, and the `UI-Gallery` stills
- `src/compositions/` — `UiSmoke` (main window), `UiMotionDemo` (frame-driven interaction demo), `UiGallery` (one still per screen), `Stage` (backdrop + scaling)
- `src/demo/acme.ts` — demo fixtures (sites, files, logs, license, drafts)
- `src/ui/` — presentational copies of the Tauri UI, all state via props:
  - `MacWindow` (667×640 window, traffic lights, forced `light`/`dark` theme, language env)
  - `AppWindow` (titlebar, file share, sites, status bar, `overlay` slot, toasts)
  - `SiteCard`, `FileSharePanel`, `SiteDrawer`, `SiteDetail`, `QrPopup`/`QrCode`, `Settings`, `License`, `TrayMenu` (macOS menu bar + tray), `MacCursor`, `primitives`
  - `styles/global.css` is a verbatim copy of Tauri — put video-only overrides in `styles/video.css`
  - `i18n.ts` / `icons.tsx` copied from Tauri
- Motion: CSS transitions/keyframes are disabled under `.ls-root`; animate via props (`enter`, `portReveal`, `actionBar`, numeric `Toggle`) and `data-hover` (scripted hover)
- `assets/brand/` — brand images
- `docs/youtube-main-storyboard.md` — full film storyboard (later)
- Spec: `docs/superpowers/specs/2026-11-02-remotion-migration-design.md`
- Plan: `docs/superpowers/plans/2026-11-02-remotion-scaffold.md`

## Hard rules

1. **Do not edit LocalServeTauri** from this repo. UI is a **copy** under `src/ui/`; change the copy/stubs here only.
2. **Scope:** UI component library + gallery/demo compositions. Do not rebuild full S1–S10, VO, or captions unless the user explicitly expands scope.
3. Prefer **pnpm**. Keep Remotion packages version-aligned (`remotion`, `@remotion/cli`, etc.).
4. Compositions must be deterministic (no `Date.now()`, `Math.random()`, or network fetches in the render path).
5. After UI/composition changes, run `pnpm lint` and open Studio on `UiSmoke` before claiming done.

## Documentation

- Remotion: https://www.remotion.dev/docs
- Use Remotion skills / `remotion-docs` rather than guessing APIs
