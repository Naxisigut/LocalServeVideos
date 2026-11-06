import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DARK_BACKDROP, DISPLAY_FONT, MONO_FONT, clamp, easeInOut, easeOut } from './shared';

const COMMAND = 'pnpm build';

type OutputLine = { text: React.ReactNode; color?: string };

const Dist: React.FC<{ glow: number; children: React.ReactNode }> = ({ glow, children }) => (
  <span
    style={{
      color: '#7cc4ff',
      borderRadius: 4,
      padding: '0 2px',
      background: `rgba(124,196,255,${0.28 * glow})`,
      boxShadow: `0 0 ${18 * glow}px rgba(124,196,255,${0.5 * glow})`,
    }}
  >
    {children}
  </span>
);

/** S1 — `pnpm build` finishes, then the camera pushes in on `dist/`. */
export const TerminalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (seconds: number) => Math.round(seconds * fps);

  const typeStart = s(0.3);
  const typed = Math.max(0, Math.min(COMMAND.length, Math.floor((frame - typeStart) / 2)));
  const outputStart = typeStart + COMMAND.length * 2 + s(0.3);
  const glow = interpolate(frame, [s(3), s(3.3)], [0, 1], clamp);

  const lines: OutputLine[] = [
    { text: '> acme-dashboard@1.0.0 build', color: '#8b93a7' },
    { text: '> vite build', color: '#8b93a7' },
    { text: 'vite v6.0.3 building for production...', color: '#c8cede' },
    { text: '✓ 142 modules transformed.', color: '#5fd38d' },
    {
      text: (
        <>
          <Dist glow={glow}>dist/</Dist>index.html{'                 '}0.46 kB
        </>
      ),
    },
    {
      text: (
        <>
          <Dist glow={glow}>dist/</Dist>assets/index-9c1d.css{'     '}18.02 kB
        </>
      ),
    },
    {
      text: (
        <>
          <Dist glow={glow}>dist/</Dist>assets/index-3f2a.js{'     '}142.10 kB
        </>
      ),
    },
    { text: '✓ built in 2.1s', color: '#5fd38d' },
  ];

  return (
    <AbsoluteFill style={{ background: DARK_BACKDROP, alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: 1180,
          height: 620,
          borderRadius: 16,
          overflow: 'hidden',
          background: '#14161c',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 40px 120px rgba(0,0,0,0.6)',
          opacity: interpolate(frame, [0, s(0.3)], [0, 1], clamp),
          scale: interpolate(frame, [s(2.9), s(4)], [1, 1.32], { ...clamp, easing: easeInOut }),
          transformOrigin: '30% 72%',
        }}
      >
        <div
          style={{
            height: 46,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '0 18px',
            background: '#1c1f27',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{ width: 13, height: 13, borderRadius: '50%', background: c }} />
          ))}
          <span
            style={{
              flex: 1,
              textAlign: 'center',
              marginRight: 70,
              fontFamily: DISPLAY_FONT,
              fontSize: 15,
              color: '#8b93a7',
            }}
          >
            acme — zsh
          </span>
        </div>
        <div
          style={{
            padding: '26px 34px',
            fontFamily: MONO_FONT,
            fontSize: 25,
            lineHeight: 1.62,
            color: '#e6e9f2',
            whiteSpace: 'pre',
          }}
        >
          <div>
            <span style={{ color: '#5fd38d' }}>~/Projects/acme</span>
            <span style={{ color: '#c792ea' }}> ❯ </span>
            {COMMAND.slice(0, typed)}
            {typed < COMMAND.length || frame < outputStart ? (
              <span
                style={{
                  display: 'inline-block',
                  width: 13,
                  height: 28,
                  verticalAlign: 'text-bottom',
                  background: '#e6e9f2',
                  opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                }}
              />
            ) : null}
          </div>
          {lines.map((line, i) => {
            const at = outputStart + i * 4;
            if (frame < at) return null;
            return (
              <div key={i} style={{ color: line.color }}>
                {line.text}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

type Pain = {
  x: number;
  y: number;
  rotate: number;
  render: () => React.ReactNode;
};

const cardShell: React.CSSProperties = {
  position: 'absolute',
  borderRadius: 16,
  boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.55)',
  overflow: 'hidden',
};

const PAINS: Pain[] = [
  {
    x: -470,
    y: -200,
    rotate: -6,
    render: () => (
      <div style={{ ...cardShell, width: 520, padding: '22px 26px', background: '#14161c', fontFamily: MONO_FONT, fontSize: 22, lineHeight: 1.6, color: '#e6e9f2', translate: '-50% -50%' }}>
        <div><span style={{ color: '#c792ea' }}>$</span> npx serve dist</div>
        <div style={{ color: '#5fd38d' }}>Serving! http://localhost:3000</div>
        <div style={{ color: '#8b93a7' }}># …and keep this terminal open</div>
      </div>
    ),
  },
  {
    x: 420,
    y: -230,
    rotate: 5,
    render: () => (
      <div style={{ ...cardShell, width: 560, padding: '22px 26px', background: '#2a1215', fontFamily: MONO_FONT, fontSize: 20, lineHeight: 1.55, color: '#ffb4b4', translate: '-50% -50%' }}>
        <div style={{ color: '#ff6b6b', fontWeight: 700, fontSize: 24 }}>✕ CORS error</div>
        <div>Access to fetch at &apos;localhost:9083/api/me&apos;</div>
        <div>has been blocked by CORS policy</div>
      </div>
    ),
  },
  {
    x: -380,
    y: 170,
    rotate: 4,
    render: () => (
      <div style={{ ...cardShell, width: 480, background: '#f4f5f8', translate: '-50% -50%' }}>
        <div style={{ height: 40, background: '#e4e6ec', display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: DISPLAY_FONT, fontSize: 16, color: '#555' }}>
          localhost:3000/dashboard/settings
        </div>
        <div style={{ padding: '26px 28px', fontFamily: DISPLAY_FONT }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: '#111', letterSpacing: -1 }}>404</div>
          <div style={{ fontSize: 22, color: '#666' }}>Not Found — after a refresh</div>
        </div>
      </div>
    ),
  },
  {
    x: 380,
    y: 200,
    rotate: -4,
    render: () => (
      <div style={{ ...cardShell, width: 500, padding: '22px 26px', background: '#14161c', fontFamily: MONO_FONT, fontSize: 22, lineHeight: 1.6, color: '#e6e9f2', translate: '-50% -50%' }}>
        <div><span style={{ color: '#c792ea' }}>$</span> sudo vim /etc/hosts</div>
        <div style={{ color: '#8b93a7' }}>Password:</div>
        <div>127.0.0.1  acme.local</div>
      </div>
    ),
  },
  {
    x: 0,
    y: -10,
    rotate: -2,
    render: () => (
      <div style={{ ...cardShell, width: 260, height: 500, borderRadius: 44, background: '#1a1a1a', padding: 12, translate: '-50% -50%' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 34, background: '#d9dbe0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: DISPLAY_FONT, textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#333' }}>Safari Can&apos;t Connect to the Server</div>
          <div style={{ fontSize: 16, color: '#666' }}>localhost:3000</div>
        </div>
      </div>
    ),
  },
];

/** S2 pain cards slam in and stack; S3 sucks them away and lands the headline. */
export const PainsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (seconds: number) => Math.round(seconds * fps);

  const lastLanding = 12 * (PAINS.length - 1) + 10;
  const shakeT = frame - lastLanding;
  const shake = shakeT > 0 && shakeT < 22 ? Math.sin(shakeT * 1.9) * 10 * (1 - shakeT / 22) : 0;

  const collapseAt = s(5);
  const collapse = interpolate(frame, [collapseAt, collapseAt + 14], [0, 1], {
    ...clamp,
    easing: easeInOut,
  });

  const words = ['No CLI.', 'No cloud.', 'Just your Mac.'];
  const headlineAt = collapseAt + 10;

  return (
    <AbsoluteFill style={{ background: DARK_BACKDROP }}>
      <AbsoluteFill style={{ translate: `${shake}px ${shake * 0.4}px` }}>
        {PAINS.map((pain, i) => {
          const land = spring({ frame: frame - i * 12, fps, config: { damping: 14, mass: 0.7 } });
          if (frame < i * 12) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 960 + pain.x * (1 - collapse),
                top: 540 + pain.y * (1 - collapse),
                zIndex: i,
                opacity: interpolate(land, [0, 0.4], [0, 1], clamp) * (1 - collapse),
                scale: String(interpolate(land, [0, 1], [1.5, 1]) * (1 - 0.8 * collapse)),
                rotate: `${pain.rotate * land + 40 * collapse * (i % 2 === 0 ? 1 : -1)}deg`,
              }}
            >
              {pain.render()}
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 28,
          fontFamily: DISPLAY_FONT,
          fontSize: 104,
          fontWeight: 800,
          letterSpacing: -3,
          color: '#fff',
        }}
      >
        {words.map((word, i) => {
          const at = headlineAt + i * 9;
          return (
            <span
              key={word}
              style={{
                opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
                translate: `0 ${interpolate(frame, [at, at + 14], [40, 0], { ...clamp, easing: easeOut })}px`,
                color: i === 2 ? '#7cc4ff' : '#fff',
              }}
            >
              {word}
            </span>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
