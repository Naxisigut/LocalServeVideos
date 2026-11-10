import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Backdrop } from '../Stage';
import { DISPLAY_FONT, clamp, easeInOut, easeOut } from './shared';

const ACCENT = '#4f46e5';

const IN_END = 18;
const MORPH = 30;
const MORPH_END = 52;
const OUT = 80;

/** Soft blur dissolve for one side of the morph; `p` is how present the text is (0–1). */
const morphStyle = (p: number, grow: number): React.CSSProperties => ({
  opacity: interpolate(p, [0.3, 1], [0, 1], { ...clamp, easing: easeInOut }),
  filter: p >= 1 ? 'none' : `blur(${8 * (1 - p)}px)`,
  scale: String(1 + grow * (1 - p)),
});

const Line: React.FC<{ style: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', ...style }}>{children}</AbsoluteFill>
);

/** S7 — "Need more?" sharpens in, then dissolves into "Here are a few power features." */
export const PowerIntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const intro = interpolate(frame, [0, IN_END], [0, 1], { ...clamp, easing: easeOut });
  const morph = interpolate(frame, [MORPH, MORPH_END], [0, 1], { ...clamp, easing: easeInOut });
  const out = interpolate(frame, [OUT, OUT + 10], [0, 1], { ...clamp, easing: easeInOut });

  return (
    <Backdrop theme="light">
      <AbsoluteFill
        style={{
          fontFamily: DISPLAY_FONT,
          fontWeight: 800,
          color: '#111',
          opacity: 1 - out,
          translate: `0 ${-24 * out}px`,
        }}
      >
        {morph < 1 ? (
          <Line style={{ fontSize: 140, letterSpacing: -4, ...morphStyle(intro * (1 - morph), morph > 0 ? 0.06 : -0.06) }}>Need more?</Line>
        ) : null}
        {morph > 0 ? (
          <Line style={{ fontSize: 112, letterSpacing: -3, lineHeight: 1.12, ...morphStyle(morph, -0.06) }}>
            <span>Here are a few</span>
            <span style={{ color: ACCENT }}>power features.</span>
          </Line>
        ) : null}
      </AbsoluteFill>
    </Backdrop>
  );
};
