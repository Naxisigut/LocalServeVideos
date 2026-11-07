import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import appIcon from '../../../assets/brand/app-icon.png';
import { MacCursor } from '../../ui/MacCursor';
import { Backdrop } from '../Stage';
import { BrowserFrame } from './mocks';
import { DISPLAY_FONT, MONO_FONT, clamp, easeInOut, easeOut } from './shared';

type Pt = { x: number; y: number };

type App = {
  name: string;
  hue: string;
  path: string;
  prompt?: string;
  /** S1 grid slot (scale 1). */
  grid: Pt;
  /** S2 resting place (scale SCATTER_SCALE). */
  dest: Pt;
  tilt: number;
  popAt: number;
};

const ACCENT = '#4f46e5';
const TILE_W = 320;
const TILE_H = 220;
const SCATTER_SCALE = 0.6;
const CENTER: Pt = { x: 960, y: 430 };
const ICON_SIZE = 200;

// Pops accelerate (32 → 30 → 10 → 7 → 5 frames apart), then a short rest before S2.
const APPS: App[] = [
  { name: 'Budget Tracker', hue: ACCENT, path: '~/Projects/budget-tracker/dist', prompt: 'Make me a budget tracker', grid: { x: 1020, y: 400 }, dest: { x: 380, y: 330 }, tilt: -3, popAt: 32 },
  { name: 'Recipe Box', hue: '#ea580c', path: '~/Downloads/recipe-box', prompt: 'A recipe box for my family', grid: { x: 1370, y: 400 }, dest: { x: 1540, y: 330 }, tilt: 3, popAt: 64 },
  { name: 'Reading List', hue: '#0891b2', path: '~/Desktop/reading-list', prompt: 'A reading list I can tag', grid: { x: 1720, y: 400 }, dest: { x: 960, y: 250 }, tilt: 2, popAt: 94 },
  { name: 'Habit Tracker', hue: '#16a34a', path: '~/Documents/ai-tests/habit-tracker', grid: { x: 1020, y: 660 }, dest: { x: 520, y: 720 }, tilt: 2, popAt: 104 },
  { name: 'Trip Planner', hue: '#db2777', path: '~/Downloads/trip-planner-v2', grid: { x: 1370, y: 660 }, dest: { x: 1400, y: 720 }, tilt: -3, popAt: 111 },
  { name: 'Plant Log', hue: '#ca8a04', path: '~/Desktop/untitled-folder-3', grid: { x: 1720, y: 660 }, dest: { x: 960, y: 560 }, tilt: -2, popAt: 116 },
];

const PROMPT_AT = [6, 38, 70];

// S2 — scatter, then double-click two of them.
const PANEL_OUT = 118;
const FLY_AT = 126;
const FLY_DELAYS = [0, 8, 14, 19, 23, 26];
const FLY_LEN = 24;
const FOCUS_AT = 194;
const RECIPE_CLICK = 216;
const RECIPE_OPEN = RECIPE_CLICK + 8;
const BUDGET_CLICK = 266;
const BUDGET_OPEN = BUDGET_CLICK + 8;
const BLANK_TAG = 290;

// S3 — converge into LocalServe (bezier-source-converge-merge timing ratios).
const CLOSE_AT = 324;
const BADGE_AT = 328;
const CONV_FROM = 334;
const CONV_TO = 368;
const PULSE_AT = 362;
const HEADLINE_AT = 364;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutBack = (t: number) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;

const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => lerpPt(lerpPt(a, c, t), lerpPt(c, b, t), t);
const cubic = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const v = 1 - t;
  return {
    x: v * v * v * p0.x + 3 * v * v * t * p1.x + 3 * v * t * t * p2.x + t * t * t * p3.x,
    y: v * v * v * p0.y + 3 * v * v * t * p1.y + 3 * v * t * t * p2.y + t * t * t * p3.y,
  };
};

/** Control points for a tile's path into the icon; alternating bows give distinct entry angles. */
const convergeCurve = (from: Pt, i: number): [Pt, Pt, Pt, Pt] => {
  const dx = CENTER.x - from.x;
  const dy = CENTER.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const bow = 0.22 * dist * (i % 2 === 0 ? 1 : -1);
  const n = { x: (-dy / dist) * bow, y: (dx / dist) * bow };
  const p1 = lerpPt(from, CENTER, 0.3);
  const p2 = lerpPt(from, CENTER, 0.75);
  return [from, { x: p1.x + n.x, y: p1.y + n.y }, { x: p2.x + n.x * 0.3, y: p2.y + n.y * 0.3 }, CENTER];
};

const AppTile: React.FC<{ app: App }> = ({ app }) => (
  <div
    style={{
      width: TILE_W,
      height: TILE_H,
      borderRadius: 22,
      overflow: 'hidden',
      background: '#fff',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 18px 44px rgba(20,24,40,0.16)',
      fontFamily: DISPLAY_FONT,
    }}
  >
    <div style={{ height: 32, display: 'flex', alignItems: 'center', gap: 7, padding: '0 14px', background: `${app.hue}1a` }}>
      {[0, 1, 2].map((k) => (
        <span key={k} style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(0,0,0,0.14)' }} />
      ))}
    </div>
    <div style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 42, height: 42, borderRadius: 12, background: app.hue, flexShrink: 0 }} />
        <span style={{ fontSize: 28, fontWeight: 700, color: '#111', letterSpacing: -0.5 }}>{app.name}</span>
      </div>
      {[88, 70].map((w) => (
        <div key={w} style={{ height: 12, width: `${w}%`, borderRadius: 6, background: '#eef0f4', marginTop: 16 }} />
      ))}
      <div style={{ height: 12, width: '42%', borderRadius: 6, background: `${app.hue}55`, marginTop: 16 }} />
    </div>
  </div>
);

const FolderGlyph: React.FC = () => (
  <svg width={30} height={24} viewBox="0 0 30 24" style={{ flexShrink: 0 }}>
    <path d="M2 5a3 3 0 0 1 3-3h6l3 3h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#7cb3f5" />
    <path d="M2 9h26v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#5a9bea" />
  </svg>
);

const ChatPanel: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      position: 'absolute',
      left: 130,
      top: 300,
      width: 680,
      padding: '26px 30px 34px',
      borderRadius: 28,
      background: 'rgba(255,255,255,0.86)',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 30px 80px rgba(20,24,40,0.14)',
      fontFamily: DISPLAY_FONT,
      opacity: interpolate(frame, [0, 8], [0, 1], clamp) * interpolate(frame, [PANEL_OUT, PANEL_OUT + 14], [1, 0], clamp),
      translate: `${interpolate(frame, [PANEL_OUT, PANEL_OUT + 14], [0, -90], { ...clamp, easing: easeInOut })}px 0`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 600, color: '#666' }}>
      <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #ec4899)' }} />
      AI assistant
    </div>
    {APPS.slice(0, 3).map((app, i) => {
      const at = PROMPT_AT[i];
      if (frame < at || !app.prompt) return null;
      const chars = Math.min(app.prompt.length, Math.floor((frame - at) * 1.5));
      const typing = chars < app.prompt.length;
      return (
        <div key={app.name} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
          <div
            style={{
              padding: '16px 24px',
              borderRadius: '24px 24px 6px 24px',
              background: '#111',
              color: '#fff',
              fontSize: 32,
              fontWeight: 500,
              opacity: interpolate(frame, [at, at + 5], [0, 1], clamp),
              translate: `0 ${interpolate(frame, [at, at + 8], [14, 0], { ...clamp, easing: easeOut })}px`,
            }}
          >
            {app.prompt.slice(0, chars)}
            {typing ? <span style={{ opacity: 0.6 }}>▍</span> : null}
          </div>
        </div>
      );
    })}
  </div>
);

const Pill: React.FC<{ ok: boolean; children: React.ReactNode }> = ({ ok, children }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 24px',
      borderRadius: 999,
      fontFamily: DISPLAY_FONT,
      fontSize: 32,
      fontWeight: 700,
      color: '#fff',
      background: ok ? '#16a34a' : '#dc2626',
      boxShadow: '0 14px 34px rgba(0,0,0,0.18)',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

/** A browser window that grows out of a tile on double-click and shrinks back at S3. */
const Popup: React.FC<{
  frame: number;
  openAt: number;
  from: Pt;
  to: Pt;
  url: string;
  shake?: number;
  children: React.ReactNode;
  tag: React.ReactNode;
  tagAt: number;
}> = ({ frame, openAt, from, to, url, shake = 0, children, tag, tagAt }) => {
  const open =
    interpolate(frame, [openAt, openAt + 10], [0, 1], { ...clamp, easing: easeOut }) *
    interpolate(frame, [CLOSE_AT, CLOSE_AT + 8], [1, 0], { ...clamp, easing: easeInOut });
  if (open <= 0) return null;
  const at = lerpPt(from, to, open);
  const tagPop = spring({ frame: frame - tagAt, fps: 30, config: { damping: 13, mass: 0.6 } });
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x + shake,
        top: at.y,
        translate: '-50% -50%',
        scale: String(lerp(0.2, 1, open)),
        opacity: Math.min(1, open * 2),
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 22,
      }}
    >
      <BrowserFrame width={580} height={330} url={<span style={{ color: '#666' }}>{url}</span>}>
        {children}
      </BrowserFrame>
      <div style={{ height: 60, opacity: frame >= tagAt ? 1 : 0, scale: String(lerp(0.6, 1, tagPop)) }}>{tag}</div>
    </div>
  );
};

/** S1–S3 — AI makes little apps; they scatter across folders; LocalServe gathers them. */
export const AppsHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const conv = easeInOutCubic(interpolate(frame, [CONV_FROM, CONV_TO], [0, 1], clamp));
  const focusDim =
    interpolate(frame, [FOCUS_AT, FOCUS_AT + 10], [0, 1], clamp) * interpolate(frame, [CLOSE_AT, CLOSE_AT + 8], [1, 0], clamp);

  const badgeIn = interpolate(frame, [BADGE_AT, BADGE_AT + 12], [0, 1], { ...clamp, easing: easeOut });
  const pulse =
    1 +
    0.12 * easeOutBack(interpolate(frame, [PULSE_AT, PULSE_AT + 8], [0, 1], clamp)) -
    0.12 * interpolate(frame, [PULSE_AT + 8, PULSE_AT + 16], [0, 1], { ...clamp, easing: easeOut });
  const ripple = interpolate(frame, [PULSE_AT + 2, PULSE_AT + 20], [0, 1], { ...clamp, easing: easeOut });

  const cursorPos = (() => {
    const start = { x: 1100, y: 940 };
    const recipe = APPS[1].dest;
    const budget = APPS[0].dest;
    const toRecipe = interpolate(frame, [FOCUS_AT + 2, RECIPE_CLICK - 2], [0, 1], { ...clamp, easing: easeInOut });
    const toBudget = interpolate(frame, [RECIPE_CLICK + 28, BUDGET_CLICK - 2], [0, 1], { ...clamp, easing: easeInOut });
    return lerpPt(lerpPt(start, recipe, toRecipe), budget, toBudget);
  })();
  const pressed = [RECIPE_CLICK, RECIPE_CLICK + 5, BUDGET_CLICK, BUDGET_CLICK + 5].some((c) => frame >= c && frame < c + 3);
  const cursorOpacity =
    interpolate(frame, [FOCUS_AT, FOCUS_AT + 6], [0, 1], clamp) * interpolate(frame, [CLOSE_AT, CLOSE_AT + 6], [1, 0], clamp);

  const shakeT = frame - BLANK_TAG;
  const shake = shakeT > 0 && shakeT < 16 ? Math.sin(shakeT * 1.6) * 8 * (1 - shakeT / 16) : 0;

  return (
    <Backdrop theme="light">
      {frame < PANEL_OUT + 14 ? <ChatPanel frame={frame} /> : null}

      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {APPS.map((app, i) => {
          const [p0, p1, p2, p3] = convergeCurve(app.dest, i);
          const drawFrom = BADGE_AT + i * 2;
          const draw = interpolate(frame, [drawFrom, drawFrom + 14], [0, 1], { ...clamp, easing: easeOut });
          if (draw <= 0 || conv >= 1) return null;
          return (
            <path
              key={app.name}
              d={`M ${p0.x},${p0.y} C ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
              pathLength={1}
              fill="none"
              stroke={ACCENT}
              strokeOpacity={0.3}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="1 1"
              strokeDashoffset={conv > 0 ? -conv : 1 - draw}
            />
          );
        })}
      </svg>

      {APPS.map((app, i) => {
        if (frame < app.popAt) return null;
        const pop = spring({ frame: frame - app.popAt, fps, config: { damping: 14, mass: 0.6 } });

        const flyAt = FLY_AT + FLY_DELAYS[i];
        const fly = interpolate(frame, [flyAt, flyAt + FLY_LEN], [0, 1], { ...clamp, easing: easeInOut });
        const landed = frame - (flyAt + FLY_LEN);
        const bounce = interpolate(landed, [0, 4, 10], [1, 1.05, 1], clamp);
        const arcCtrl = { x: (app.grid.x + app.dest.x) / 2, y: Math.min(app.grid.y, app.dest.y) - 160 };
        let pos = quad(app.grid, arcCtrl, app.dest, fly);
        let scale = lerp(1, SCATTER_SCALE, fly) * bounce * lerp(0.6, 1, pop);
        let tilt = app.tilt * fly;

        if (conv > 0) {
          const [p0, p1, p2, p3] = convergeCurve(app.dest, i);
          pos = cubic(p0, p1, p2, p3, conv);
          scale = conv < 0.75 ? lerp(SCATTER_SCALE, 0.22, conv / 0.75) : lerp(0.22, 0, (conv - 0.75) / 0.25);
          tilt = app.tilt * (1 - conv);
        }
        if (scale <= 0.001) return null;

        const focused = i <= 1;
        const opacity = interpolate(pop, [0, 0.4], [0, 1], clamp) * (focused ? 1 : 1 - 0.6 * focusDim);
        const labelOpacity =
          interpolate(landed, [0, 8], [0, 1], clamp) * interpolate(frame, [CONV_FROM - 6, CONV_FROM + 2], [1, 0], clamp);

        return (
          <React.Fragment key={app.name}>
            <div
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                translate: '-50% -50%',
                scale: String(scale),
                rotate: `${tilt}deg`,
                opacity,
                zIndex: 10 + i,
              }}
            >
              <AppTile app={app} />
            </div>
            {labelOpacity > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: app.dest.x,
                  top: app.dest.y + (TILE_H * SCATTER_SCALE) / 2 + 16,
                  translate: '-50% 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: MONO_FONT,
                  fontSize: 30,
                  color: '#444',
                  whiteSpace: 'nowrap',
                  opacity: labelOpacity * (focused ? 1 : 1 - 0.6 * focusDim),
                  zIndex: 10 + i,
                }}
              >
                <FolderGlyph />
                {app.path}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      <Popup
        frame={frame}
        openAt={RECIPE_OPEN}
        from={APPS[1].dest}
        to={{ x: 1380, y: 690 }}
        url="file:///…/Downloads/recipe-box/index.html"
        tagAt={RECIPE_OPEN + 12}
        tag={<Pill ok>✓ Opens with a double-click</Pill>}
      >
        <div style={{ padding: '26px 30px', fontFamily: DISPLAY_FONT }}>
          <div style={{ fontSize: 16, color: '#ea580c', fontWeight: 700, letterSpacing: 1 }}>RECIPE BOX</div>
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 6, color: '#111' }}>Grandma&apos;s lasagna</div>
          {[90, 76, 84, 58].map((w) => (
            <div key={w} style={{ height: 13, width: `${w}%`, borderRadius: 7, background: '#eceef3', marginTop: 16 }} />
          ))}
        </div>
      </Popup>
      <Popup
        frame={frame}
        openAt={BUDGET_OPEN}
        from={APPS[0].dest}
        to={{ x: 540, y: 690 }}
        url="file:///…/budget-tracker/dist/index.html"
        shake={shake}
        tagAt={BLANK_TAG}
        tag={<Pill ok={false}>Blank page · Needs a local server</Pill>}
      >
        <div style={{ height: '100%', background: '#fff' }} />
      </Popup>

      {cursorOpacity > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: cursorOpacity, zIndex: 30 }}>
          <MacCursor x={cursorPos.x} y={cursorPos.y} scale={1.7} pressed={pressed} />
        </div>
      ) : null}

      {badgeIn > 0 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: CENTER.x,
              top: CENTER.y,
              width: ICON_SIZE,
              height: ICON_SIZE,
              translate: '-50% -50%',
              borderRadius: '24%',
              border: `3px solid ${ACCENT}`,
              scale: String(lerp(1, 1.7, ripple)),
              opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.5 : 0,
              zIndex: 40,
            }}
          />
          <Img
            src={appIcon}
            style={{
              position: 'absolute',
              left: CENTER.x,
              top: CENTER.y,
              width: ICON_SIZE,
              height: ICON_SIZE,
              translate: '-50% -50%',
              scale: String(lerp(0.7, 1, badgeIn) * pulse),
              opacity: badgeIn,
              filter: 'drop-shadow(0 24px 50px rgba(20,24,40,0.25))',
              zIndex: 41,
            }}
          />
        </>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 640,
          height: 140,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 26,
          fontFamily: DISPLAY_FONT,
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: -3,
          zIndex: 42,
        }}
      >
        {[
          { text: 'All your little apps.', at: HEADLINE_AT, color: '#111' },
          { text: 'One home.', at: HEADLINE_AT + 10, color: ACCENT },
        ].map((part) => (
          <span
            key={part.text}
            style={{
              color: part.color,
              opacity: interpolate(frame, [part.at, part.at + 8], [0, 1], clamp),
              translate: `0 ${interpolate(frame, [part.at, part.at + 14], [32, 0], { ...clamp, easing: easeOut })}px`,
            }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </Backdrop>
  );
};
