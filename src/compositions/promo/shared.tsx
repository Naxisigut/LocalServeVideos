import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const easeInOut = Easing.bezier(0.45, 0, 0.2, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export const DISPLAY_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
export const MONO_FONT = "ui-monospace, 'SF Mono', Menlo, monospace";

export const DARK_BACKDROP =
  'radial-gradient(90% 70% at 20% 10%, #1b2440 0%, transparent 60%), radial-gradient(80% 70% at 90% 100%, #2a1830 0%, transparent 60%), #0b0d12';

/** Burned-in subtitle pill; fades with the Sequence it lives in. */
export const Caption: React.FC<{ text: string; durationInFrames: number; dark?: boolean }> = ({
  text,
  durationInFrames,
  dark,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 44 }}>
      <div
        style={{
          opacity: interpolate(
            frame,
            [0, 8, durationInFrames - 8, durationInFrames],
            [0, 1, 1, 0],
            clamp,
          ),
          translate: `0 ${interpolate(frame, [0, 10], [10, 0], { ...clamp, easing: easeOut })}px`,
          padding: '12px 30px',
          borderRadius: 18,
          fontFamily: DISPLAY_FONT,
          fontSize: 56,
          fontWeight: 500,
          letterSpacing: -0.2,
          color: '#fff',
          background: dark ? 'rgba(255,255,255,0.10)' : 'rgba(17,17,17,0.78)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
