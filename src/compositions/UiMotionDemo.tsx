import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  ACME_LAN_URL,
  DEMO_HOME_DIR,
  DEMO_LAN_IP,
  acmeSite,
  demoFiles,
  demoSites,
  demoTrial,
  landingSite,
} from '../demo/acme';
import { AppWindow } from '../ui/AppWindow';
import { MacCursor } from '../ui/MacCursor';
import { MacWindow } from '../ui/MacWindow';
import { QrPopup } from '../ui/QrPopup';
import type { Language, SiteStatus, Theme } from '../ui/types';
import { Stage } from './Stage';

export type UiMotionDemoProps = {
  theme: Theme;
  language: Language;
};

/** Pointer targets in window coordinates (667×640), measured in Studio. */
const POINTS = {
  rest: { x: 470, y: 600 },
  landingStart: { x: 609, y: 452 },
  acmeQr: { x: 540, y: 271 },
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

/**
 * Start "Landing Page" → port chip slides in → open Acme's LAN QR code.
 * Every state is derived from the frame; nothing relies on CSS motion.
 */
export const UiMotionDemo: React.FC<UiMotionDemoProps> = ({ theme, language }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (seconds: number) => Math.round(seconds * fps);

  const moveToStart = interpolate(frame, [s(0.6), s(1.5)], [0, 1], { ...clamp, easing: ease });
  const moveToQr = interpolate(frame, [s(3.2), s(4.1)], [0, 1], { ...clamp, easing: ease });
  const cursorX =
    POINTS.rest.x +
    (POINTS.landingStart.x - POINTS.rest.x) * moveToStart +
    (POINTS.acmeQr.x - POINTS.landingStart.x) * moveToQr;
  const cursorY =
    POINTS.rest.y +
    (POINTS.landingStart.y - POINTS.rest.y) * moveToStart +
    (POINTS.acmeQr.y - POINTS.landingStart.y) * moveToQr;

  const startClick = s(1.8);
  const qrClick = s(4.6);
  const pressed =
    (frame >= startClick && frame < startClick + 4) || (frame >= qrClick && frame < qrClick + 4);

  const landingStatus: SiteStatus =
    frame < startClick + 2 ? 'stopped' : frame < s(2.6) ? 'starting' : 'running';
  const sites = demoSites.map((site) =>
    site.id === landingSite.id ? { ...site, status: landingStatus } : site,
  );

  const onStart = moveToStart >= 1 && moveToQr <= 0;
  const onQr = moveToQr >= 1;

  return (
    <Stage theme={theme}>
      <MacWindow
        theme={theme}
        env={{ language, localLanIp: DEMO_LAN_IP, homeDir: DEMO_HOME_DIR }}
        style={{
          opacity: interpolate(frame, [0, s(0.4)], [0, 1], clamp),
          translate: `0 ${interpolate(frame, [0, s(0.5)], [24, 0], { ...clamp, easing: ease })}px`,
        }}
      >
        <AppWindow
          sites={sites}
          files={demoFiles}
          trial={demoTrial}
          siteStates={{
            [landingSite.id]: {
              hover: onStart && landingStatus === 'stopped' ? 'start' : undefined,
              portReveal: interpolate(frame, [s(2.6), s(3)], [0, 1], { ...clamp, easing: ease }),
            },
            [acmeSite.id]: {
              hover: onQr ? 'qr' : undefined,
              tooltip: onQr && frame < qrClick ? 'qr' : undefined,
            },
          }}
          overlay={
            <QrPopup
              url={ACME_LAN_URL}
              enter={interpolate(frame, [qrClick + 2, qrClick + s(0.3)], [0, 1], {
                ...clamp,
                easing: Easing.bezier(0.2, 0.8, 0.2, 1),
              })}
            />
          }
        />
        <MacCursor x={cursorX} y={cursorY} pressed={pressed} />
      </MacWindow>
    </Stage>
  );
};
