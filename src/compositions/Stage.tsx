import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { Theme } from '../ui/types';

const BACKDROPS: Record<Theme, string> = {
  light:
    'radial-gradient(120% 90% at 15% 10%, #dfe9ff 0%, transparent 55%), radial-gradient(90% 80% at 90% 90%, #ffe3f1 0%, transparent 60%), linear-gradient(160deg, #f4f6fb 0%, #e9ecf4 100%)',
  dark:
    'radial-gradient(120% 90% at 15% 10%, #1d2a4a 0%, transparent 55%), radial-gradient(90% 80% at 90% 90%, #3a1f3a 0%, transparent 60%), linear-gradient(160deg, #0f1218 0%, #0a0c10 100%)',
};

export const Backdrop: React.FC<{ theme: Theme; children?: React.ReactNode }> = ({
  theme,
  children,
}) => <AbsoluteFill style={{ background: BACKDROPS[theme] }}>{children}</AbsoluteFill>;

/** Soft desktop backdrop with content centered and scaled for 1080p. */
export const Stage: React.FC<{
  theme: Theme;
  scale?: number;
  children: React.ReactNode;
}> = ({ theme, scale = 1.4, children }) => (
  <AbsoluteFill style={{ background: BACKDROPS[theme] }}>
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ scale: String(scale) }}>{children}</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
