import React from 'react';

/** macOS arrow pointer; position it with absolute left/top from the composition. */
export const MacCursor: React.FC<{ x: number; y: number; scale?: number; pressed?: boolean }> = ({
  x,
  y,
  scale = 1,
  pressed,
}) => (
  <svg
    width={22}
    height={30}
    viewBox="0 0 22 30"
    style={{
      position: 'absolute',
      left: x,
      top: y,
      zIndex: 1000,
      pointerEvents: 'none',
      transformOrigin: '2px 2px',
      transform: `scale(${scale * (pressed ? 0.88 : 1)})`,
      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))',
    }}
  >
    <path
      d="M2 2v22.5l5.6-5.3 3.6 8.4 3.6-1.5-3.5-8.2H19L2 2z"
      fill="#000"
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);
