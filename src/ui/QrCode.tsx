import React, { useMemo } from 'react';
import { Byte, Encoder } from '@nuintun/qrcode';

type Radii = [number, number, number, number];

/** Same rounded-square outline as `fillRoundedSquare` in the app's qr-to-canvas. */
const roundedSquare = (x: number, y: number, size: number, radii: number | Radii) => {
  const [tl, tr, br, bl] =
    typeof radii === 'number' ? [radii, radii, radii, radii] : radii;
  const r = x + size;
  const b = y + size;
  return (
    `M${x + tl} ${y}L${r - tr} ${y}Q${r} ${y} ${r} ${y + tr}` +
    `L${r} ${b - br}Q${r} ${b} ${r - br} ${b}` +
    `L${x + bl} ${b}Q${x} ${b} ${x} ${b - bl}` +
    `L${x} ${y + tl}Q${x} ${y} ${x + tl} ${y}Z`
  );
};

type Props = {
  text: string;
  /** Max edge in CSS px; actual size snaps to whole modules like the app. */
  width?: number;
  margin?: number;
  dark?: string;
  light?: string;
};

/** SVG port of the app's QR renderer (joined round modules, rounded finders). */
export const QrCode: React.FC<Props> = ({
  text,
  width = 280,
  margin = 4,
  dark = '#111111',
  light = '#ffffff',
}) => {
  const { size, darkPath, lightPath, centerPath } = useMemo(() => {
    const encoded = new Encoder({ level: 'M' }).encode(new Byte(text));
    const modules = encoded.size;
    const unit = Math.max(1, Math.floor(width / (modules + margin * 2)));
    const pixelSize = unit * (modules + margin * 2);
    const isDark = (x: number, y: number) =>
      x >= 0 && x < modules && y >= 0 && y < modules && encoded.get(x, y) === 1;
    const radius = unit >= 3 ? unit / 2 : 0;
    const darkParts: string[] = [];
    const lightParts: string[] = [];
    for (let y = 0; y < modules; y++) {
      for (let x = 0; x < modules; x++) {
        const inFinder =
          (x < 7 && y < 7) || (x >= modules - 7 && y < 7) || (x < 7 && y >= modules - 7);
        if (inFinder || !isDark(x, y)) continue;
        const top = isDark(x, y - 1);
        const right = isDark(x + 1, y);
        const bottom = isDark(x, y + 1);
        const left = isDark(x - 1, y);
        darkParts.push(
          roundedSquare((margin + x) * unit, (margin + y) * unit, unit, [
            !top && !left ? radius : 0,
            !top && !right ? radius : 0,
            !bottom && !right ? radius : 0,
            !bottom && !left ? radius : 0,
          ]),
        );
      }
    }
    const finders = [
      [0, 0],
      [modules - 7, 0],
      [0, modules - 7],
    ];
    const centerParts: string[] = [];
    for (const [fx, fy] of finders) {
      const left = (margin + fx) * unit;
      const top = (margin + fy) * unit;
      // Painted in order dark → light → dark to keep the 1:1:3:1:1 finder ratio.
      darkParts.push(roundedSquare(left, top, unit * 7, unit * 2));
      lightParts.push(roundedSquare(left + unit, top + unit, unit * 5, unit * 1.25));
      centerParts.push(roundedSquare(left + unit * 2, top + unit * 2, unit * 3, unit * 0.75));
    }
    return {
      size: pixelSize,
      darkPath: darkParts.join(''),
      lightPath: lightParts.join(''),
      centerPath: centerParts.join(''),
    };
  }, [text, width, margin]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="geometricPrecision"
      style={{ display: 'block' }}
    >
      <rect width={size} height={size} fill={light} />
      <path d={darkPath} fill={dark} />
      <path d={lightPath} fill={light} />
      <path d={centerPath} fill={dark} />
    </svg>
  );
};
