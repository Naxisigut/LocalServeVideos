import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { MacCursor } from '../../ui/MacCursor';
import { Backdrop } from '../Stage';
import { BrowserFrame } from './mocks';
import { DISPLAY_FONT, MONO_FONT, QuestionBadge, clamp, easeInOut, easeOut } from './shared';

type Pt = { x: number; y: number };

type App = {
  name: string;
  hue: string;
  path: string;
  prompt?: string;
  /** S1b grid slot (scale 1). */
  grid: Pt;
  /** S2 resting place (scale SCATTER_SCALE). */
  dest: Pt;
  tilt: number;
  popAt: number;
};

const ACCENT = '#4f46e5';
const GREEN = '#16a34a';
const RED = '#dc2626';
const TILE_W = 320;
const TILE_H = 220;
const SCATTER_SCALE = 0.6;
const CENTER: Pt = { x: 960, y: 430 };
const ICON_SIZE = 200;
const POPUP_AT: Pt = { x: 960, y: 520 };

/** Total length of the hook (S1–S3) in frames. */
export const APPS_HOOK_FRAMES = 510;

// S1a — chat. S1b cuts to the apps, popping in faster and faster.
const CHAT_END = 105;
const PROMPT_AT = [8, 38, 68];
const REPLY_DELAY = 20;

const APPS: App[] = [
  { name: 'Budget Tracker', hue: ACCENT, path: '~/Projects/budget-tracker/dist', prompt: 'Make me a budget tracker', grid: { x: 610, y: 400 }, dest: { x: 380, y: 330 }, tilt: -3, popAt: 110 },
  { name: 'Recipe Box', hue: '#ea580c', path: '~/Downloads/recipe-box', prompt: 'A recipe box for my family', grid: { x: 960, y: 400 }, dest: { x: 1540, y: 330 }, tilt: 3, popAt: 120 },
  { name: 'Reading List', hue: '#0891b2', path: '~/Desktop/reading-list', prompt: 'A reading list I can tag', grid: { x: 1310, y: 400 }, dest: { x: 960, y: 250 }, tilt: 2, popAt: 128 },
  { name: 'Habit Tracker', hue: GREEN, path: '~/Documents/ai-tests/habit-tracker', grid: { x: 610, y: 660 }, dest: { x: 520, y: 720 }, tilt: 2, popAt: 134 },
  { name: 'Trip Planner', hue: '#db2777', path: '~/Downloads/trip-planner-v2', grid: { x: 960, y: 660 }, dest: { x: 1400, y: 720 }, tilt: -3, popAt: 138 },
  { name: 'Plant Log', hue: '#ca8a04', path: '~/Desktop/untitled-folder-3', grid: { x: 1310, y: 660 }, dest: { x: 960, y: 560 }, tilt: -2, popAt: 141 },
];

// S2 — scatter, then open the two apps one after the other.
const FLY_AT = 186;
const FLY_DELAYS = [0, 8, 14, 19, 23, 26];
const FLY_LEN = 24;
const FOCUS_AT = 250;
const RECIPE_CLICK = 272;
const RECIPE_OPEN = RECIPE_CLICK + 8;
const RECIPE_LOADED = RECIPE_OPEN + 32;
const RECIPE_CLOSE = 348;
const BUDGET_CLICK = 368;
const BUDGET_OPEN = BUDGET_CLICK + 8;
const BUDGET_FAIL = BUDGET_OPEN + 14;

// S3 — converge into LocalServe (bezier-source-converge-merge timing ratios).
const CLOSE_AT = 416;
const BADGE_AT = 420;
const CONV_FROM = 426;
const CONV_TO = 460;
const PULSE_AT = 454;
const HEADLINE_AT = 456;

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

/** S1a — a chat with an AI assistant; each request gets a "built it" reply.
 * Every bubble is always laid out (hidden until its cue) so the card keeps a fixed height. */
const ChatScene: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      position: 'absolute',
      left: 960,
      top: 470,
      translate: '-50% -50%',
      width: 980,
      padding: '30px 40px 40px',
      borderRadius: 32,
      background: 'rgba(255,255,255,0.9)',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 30px 80px rgba(20,24,40,0.14)',
      fontFamily: DISPLAY_FONT,
      opacity: interpolate(frame, [0, 8], [0, 1], clamp),
      scale: String(interpolate(frame, [0, 12], [0.97, 1], { ...clamp, easing: easeOut })),
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, fontWeight: 600, color: '#666' }}>
      <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #ec4899)' }} />
      AI assistant
    </div>
    {APPS.slice(0, 3).map((app, i) => {
      const at = PROMPT_AT[i];
      if (!app.prompt) return null;
      const chars = Math.max(0, Math.min(app.prompt.length, Math.floor((frame - at) * 1.5)));
      const typing = frame >= at && chars < app.prompt.length;
      const replyAt = at + Math.ceil(app.prompt.length / 1.5) + REPLY_DELAY - 12;
      return (
        <React.Fragment key={app.name}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
            <div
              style={{
                padding: '16px 26px',
                borderRadius: '26px 26px 6px 26px',
                background: '#111',
                color: '#fff',
                fontSize: 36,
                fontWeight: 500,
                opacity: interpolate(frame, [at, at + 5], [0, 1], clamp),
                translate: `0 ${interpolate(frame, [at, at + 8], [14, 0], { ...clamp, easing: easeOut })}px`,
              }}
            >
              {app.prompt.slice(0, chars) || '\u200b'}
              {typing ? <span style={{ opacity: 0.6 }}>▍</span> : null}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 22px',
                  borderRadius: '24px 24px 24px 6px',
                  background: '#eef0f5',
                  color: '#222',
                  fontSize: 32,
                  fontWeight: 500,
                  opacity: interpolate(frame, [replyAt, replyAt + 8], [0, 1], clamp),
                  translate: `0 ${interpolate(frame, [replyAt, replyAt + 12], [18, 0], { ...clamp, easing: easeOut })}px`,
                }}
              >
                <span style={{ width: 22, height: 22, borderRadius: 6, background: app.hue }} />
                Done — {app.name} is ready.
              </div>
            </div>
        </React.Fragment>
      );
    })}
  </div>
);

const Spinner: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={84} height={84} viewBox="0 0 84 84" style={{ rotate: `${frame * 14}deg` }}>
    <circle cx={42} cy={42} r={34} fill="none" stroke="#e5e7ee" strokeWidth={8} />
    <path d="M42 8a34 34 0 0 1 34 34" fill="none" stroke="#9aa0ae" strokeWidth={8} strokeLinecap="round" />
  </svg>
);

/** Green check that pops and draws itself. */
const CheckBadge: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  const pop = spring({ frame: frame - at, fps: 30, config: { damping: 11, mass: 0.6 } });
  const draw = interpolate(frame, [at + 4, at + 14], [0, 1], { ...clamp, easing: easeOut });
  return (
    <svg width={170} height={170} viewBox="0 0 170 170" style={{ scale: String(pop), filter: 'drop-shadow(0 18px 36px rgba(22,163,74,0.35))' }}>
      <circle cx={85} cy={85} r={80} fill={GREEN} />
      <path d="M50 88l24 24 48-52" fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
    </svg>
  );
};

/** One browser window that grows out of a tile on double-click and shrinks back into it. */
const Popup: React.FC<{
  frame: number;
  openAt: number;
  closeAt: number;
  from: Pt;
  url: string;
  shake?: number;
  children: React.ReactNode;
}> = ({ frame, openAt, closeAt, from, url, shake = 0, children }) => {
  const open =
    interpolate(frame, [openAt, openAt + 10], [0, 1], { ...clamp, easing: easeOut }) *
    interpolate(frame, [closeAt, closeAt + 10], [1, 0], { ...clamp, easing: easeInOut });
  if (open <= 0) return null;
  const at = lerpPt(from, POPUP_AT, open);
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x + shake,
        top: at.y,
        translate: '-50% -50%',
        scale: String(lerp(0.15, 1, open)),
        opacity: Math.min(1, open * 2),
        zIndex: 20,
      }}
    >
      <BrowserFrame width={820} height={500} url={<span style={{ color: '#666' }}>{url}</span>}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY_FONT }}>
          {children}
        </div>
      </BrowserFrame>
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
    const toRecipe = interpolate(frame, [FOCUS_AT + 2, RECIPE_CLICK - 2], [0, 1], { ...clamp, easing: easeInOut });
    const toBudget = interpolate(frame, [RECIPE_CLOSE, BUDGET_CLICK - 2], [0, 1], { ...clamp, easing: easeInOut });
    return lerpPt(lerpPt(start, APPS[1].dest, toRecipe), APPS[0].dest, toBudget);
  })();
  const pressed = [RECIPE_CLICK, RECIPE_CLICK + 5, BUDGET_CLICK, BUDGET_CLICK + 5].some((c) => frame >= c && frame < c + 3);
  const cursorOpacity =
    interpolate(frame, [FOCUS_AT, FOCUS_AT + 6], [0, 1], clamp) * interpolate(frame, [CLOSE_AT, CLOSE_AT + 6], [1, 0], clamp);

  const shakeT = frame - BUDGET_FAIL;
  const shake = shakeT > 0 && shakeT < 16 ? Math.sin(shakeT * 1.6) * 10 * (1 - shakeT / 16) : 0;
  const failPop = spring({ frame: frame - BUDGET_FAIL, fps, config: { damping: 12, mass: 0.6 } });

  if (frame < CHAT_END) {
    return (
      <Backdrop theme="light">
        <ChatScene frame={frame} />
      </Backdrop>
    );
  }

  return (
    <Backdrop theme="light">
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

      <Popup frame={frame} openAt={RECIPE_OPEN} closeAt={RECIPE_CLOSE} from={APPS[1].dest} url="file:///…/Downloads/recipe-box/index.html">
        {frame < RECIPE_LOADED ? (
          <Spinner frame={frame} />
        ) : (
          <>
            <div style={{ position: 'absolute', inset: 0, padding: '30px 40px', opacity: 0.35 }}>
              <div style={{ fontSize: 18, color: '#ea580c', fontWeight: 700, letterSpacing: 1 }}>RECIPE BOX</div>
              <div style={{ fontSize: 40, fontWeight: 700, marginTop: 6, color: '#111' }}>Grandma&apos;s lasagna</div>
              {[90, 76, 84, 58, 70].map((w) => (
                <div key={w} style={{ height: 15, width: `${w}%`, borderRadius: 8, background: '#e6e8ee', marginTop: 20 }} />
              ))}
            </div>
            <CheckBadge frame={frame} at={RECIPE_LOADED} />
          </>
        )}
      </Popup>
      <Popup frame={frame} openAt={BUDGET_OPEN} closeAt={CLOSE_AT} from={APPS[0].dest} url="file:///…/budget-tracker/dist/index.html" shake={shake}>
        {frame >= BUDGET_FAIL ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, scale: String(lerp(0.7, 1, failPop)), opacity: Math.min(1, failPop * 2) }}>
            <svg width={110} height={110} viewBox="0 0 110 110">
              <circle cx={55} cy={55} r={52} fill={`${RED}18`} />
              <path d="M38 38l34 34M72 38L38 72" stroke={RED} strokeWidth={11} strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: 54, fontWeight: 800, color: RED, letterSpacing: -1 }}>Needs a local server</div>
          </div>
        ) : null}
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
          <QuestionBadge
            size={ICON_SIZE}
            style={{
              position: 'absolute',
              left: CENTER.x,
              top: CENTER.y,
              translate: '-50% -50%',
              scale: String(lerp(0.7, 1, badgeIn) * pulse),
              opacity: badgeIn,
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
          opacity: interpolate(frame, [APPS_HOOK_FRAMES - 10, APPS_HOOK_FRAMES - 2], [1, 0], clamp),
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
