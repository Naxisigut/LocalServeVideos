import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import appIcon from '../../../assets/brand/app-icon.png';
import {
  ACME_LAN_URL,
  DEMO_HOME_DIR,
  DEMO_LAN_IP,
  acmeLogs,
  acmeSite,
  demoFiles,
  demoSites,
  demoTrial,
  docsSite,
} from '../../demo/acme';
import { AppWindow } from '../../ui/AppWindow';
import { MacCursor } from '../../ui/MacCursor';
import { APP_WINDOW_HEIGHT, MacWindow } from '../../ui/MacWindow';
import { PRESENCE_MS, motionProgress } from '../../ui/motion';
import { QrPopup } from '../../ui/QrPopup';
import type { Language, Theme } from '../../ui/types';
import { Backdrop } from '../Stage';
import { AcmePage, BrowserFrame, LogPill, PhoneFrame, RecipePage } from './mocks';
import { DISPLAY_FONT, clamp, easeInOut, easeOut } from './shared';

type SceneProps = { theme: Theme; language: Language };

const useSeconds = () => {
  const { fps } = useVideoConfig();
  return (seconds: number) => Math.round(seconds * fps);
};

/** A LocalServe window centered at (x, y) on the 1920×1080 canvas. */
const WindowShot: React.FC<
  SceneProps & { x: number; y: number; scale: number; style?: React.CSSProperties; children: React.ReactNode }
> = ({ theme, language, x, y, scale, style, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(scale), ...style }}>
    <MacWindow theme={theme} env={{ language, localLanIp: DEMO_LAN_IP, homeDir: DEMO_HOME_DIR }}>
      {children}
    </MacWindow>
  </div>
);

const fadeIn = (frame: number, at: number, len = 12) =>
  interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: easeOut });

const twoSites = [acmeSite, docsSite];
const ACME_QR = { x: 545, y: 279 };
const FILE_URL = `http://${DEMO_LAN_IP}:19800/Demo.mp4`;

/** Window coordinates (667×640) of the second card's open button. */
const DOCS_OPEN = { x: 517, y: 369 };
const DOMAIN_WINDOW = { x: 960, y: 500, scale: 1.15 };

/** S9 — Recipe Box joins with `recipes.ls`; clicking open pops a browser on the custom domain. */
export const DomainScene: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSeconds();
  const move = interpolate(frame, [s(0.9), s(1.5)], [0, 1], { ...clamp, easing: easeInOut });
  const hoverAt = s(1.5);
  const click = s(2.1);
  const browserIn = interpolate(frame, [click + 3, click + 15], [0, 1], { ...clamp, easing: easeOut });
  const markAt = s(3);
  const mark = interpolate(frame, [markAt, markAt + 12], [0, 1], { ...clamp, easing: easeInOut });
  const pulse = interpolate(frame, [markAt + 6, markAt + 24], [0, 1], clamp);
  const tag = fadeIn(frame, s(3.5));
  return (
    <Backdrop theme={props.theme}>
      <WindowShot {...props} x={DOMAIN_WINDOW.x} y={DOMAIN_WINDOW.y} scale={DOMAIN_WINDOW.scale}>
        <AppWindow
          sites={twoSites}
          files={[]}
          trial={demoTrial}
          siteStates={{
            [docsSite.id]: {
              presence: { enter: motionProgress(frame, s(0.3), fps, PRESENCE_MS) },
              hover: frame >= hoverAt ? 'open' : undefined,
              tooltip: frame >= hoverAt ? 'open' : undefined,
            },
          }}
        />
        <MacCursor
          x={interpolate(move, [0, 1], [520, DOCS_OPEN.x])}
          y={interpolate(move, [0, 1], [590, DOCS_OPEN.y])}
          pressed={frame >= click && frame < click + 4}
        />
      </WindowShot>
      {browserIn > 0 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', background: `rgba(244,246,251,${0.55 * browserIn})` }}>
          <BrowserFrame
            width={1180}
            height={APP_WINDOW_HEIGHT * DOMAIN_WINDOW.scale}
            url={
              <span
                style={{
                  position: 'relative',
                  padding: '1px 10px',
                  marginLeft: -10,
                  fontSize: 22,
                  borderRadius: 7,
                  backgroundImage: 'linear-gradient(rgba(79,70,229,0.14), rgba(79,70,229,0.14))',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: `${mark * 100}% 100%`,
                  boxShadow: `0 0 0 ${2 + pulse * 10}px rgba(79,70,229,${0.45 * (1 - pulse) * mark})`,
                }}
              >
                <span style={{ color: '#999' }}>http://</span>
                <span style={{ color: mark > 0.5 ? '#4f46e5' : '#333', fontWeight: 700 }}>
                  recipes.ls
                </span>
              </span>
            }
            style={{
              translate: '0 -40px',
              opacity: browserIn,
              scale: String(interpolate(browserIn, [0, 1], [1.06, 1])),
            }}
          >
            <RecipePage />
            <div
              style={{
                position: 'absolute',
                left: 134,
                top: 16,
                opacity: tag,
                translate: `0 ${(1 - tag) * -10}px`,
                padding: '8px 16px',
                borderRadius: 999,
                background: '#4f46e5',
                color: '#fff',
                fontSize: 20,
                fontWeight: 700,
                boxShadow: '0 10px 24px rgba(79,70,229,0.35)',
              }}
            >
              <span style={{ position: 'absolute', left: 34, top: -7, width: 14, height: 14, background: '#4f46e5', rotate: '45deg' }} />
              The domain name set by yourself
            </div>
          </BrowserFrame>
        </AbsoluteFill>
      ) : null}
    </Backdrop>
  );
};

/** S10–S11 — LAN QR code, then the same site on a phone; 6.9s. */
export const PhoneScene: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const s = useSeconds();
  const move = interpolate(frame, [s(0.2), s(0.9)], [0, 1], { ...clamp, easing: easeInOut });
  const click = s(1.1);
  const phoneAt = s(2.8);
  const phone = spring({ frame: frame - phoneAt, fps: 30, config: { damping: 16, mass: 0.8 } });
  return (
    <Backdrop theme={props.theme}>
      <WindowShot {...props} x={interpolate(phone, [0, 1], [960, 640])} y={500} scale={1.15}>
        <AppWindow
          sites={twoSites}
          files={[]}
          trial={demoTrial}
          siteStates={{
            [acmeSite.id]: {
              hover: move >= 1 && frame < click + 6 ? 'qr' : undefined,
              tooltip: move >= 1 && frame < click ? 'qr' : undefined,
            },
          }}
          overlay={<QrPopup url={ACME_LAN_URL} enter={fadeIn(frame, click + 2, 9)} />}
        />
        <MacCursor
          x={interpolate(move, [0, 1], [460, ACME_QR.x])}
          y={interpolate(move, [0, 1], [520, ACME_QR.y])}
          pressed={frame >= click && frame < click + 4}
        />
      </WindowShot>
      <div style={{ position: 'absolute', left: 1420, top: 500, translate: `-50% -50%`, opacity: phone, rotate: `${interpolate(phone, [0, 1], [8, 0])}deg`, marginLeft: interpolate(phone, [0, 1], [500, 0]) }}>
        <PhoneFrame>
          <AcmePage view="overview" mobile />
        </PhoneFrame>
      </div>
      <div style={{ position: 'absolute', left: 150, top: 770, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <LogPill level="access" text={acmeLogs[10].message} style={{ opacity: fadeIn(frame, s(4)) }} />
      </div>
    </Backdrop>
  );
};

/** S12 — drop files in, scan, the phone downloads. */
export const FilesScene: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSeconds();
  const files = demoFiles.slice(0, 3);
  const qrAt = s(2);
  const phoneAt = s(2.5);
  const phone = spring({ frame: frame - phoneAt, fps, config: { damping: 16, mass: 0.8 } });
  const progress = interpolate(frame, [phoneAt + 6, phoneAt + s(0.9)], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Backdrop theme={props.theme}>
      <WindowShot {...props} x={interpolate(phone, [0, 1], [960, 640])} y={500} scale={1.15}>
        <AppWindow
          sites={twoSites}
          files={files}
          trial={demoTrial}
          filePresence={files.reduce<Record<string, { enter: number }>>((acc, f, i) => {
            acc[f.id] = { enter: motionProgress(frame, s(0.3 + i * 0.3), fps, PRESENCE_MS) };
            return acc;
          }, {})}
          fileHoverId={frame >= s(1.5) && frame < qrAt ? files[1].id : undefined}
          overlay={<QrPopup url={FILE_URL} enter={fadeIn(frame, qrAt, 9)} />}
        />
      </WindowShot>
      <div style={{ position: 'absolute', left: 1420, top: 500, translate: '-50% -50%', opacity: phone, marginLeft: interpolate(phone, [0, 1], [500, 0]) }}>
        <PhoneFrame>
          <div style={{ height: '100%', background: '#f2f3f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 30 }}>
            <div style={{ width: 110, height: 130, borderRadius: 16, background: '#fff', boxShadow: '0 0 0 1px #e3e4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#7c3aed' }}>MP4</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Demo.mp4</div>
            <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#dcdee6', overflow: 'hidden' }}>
              <div style={{ width: `${progress * 100}%`, height: '100%', background: '#16a34a' }} />
            </div>
            <div style={{ fontSize: 19, color: progress >= 1 ? '#16a34a' : '#777', fontWeight: 600 }}>
              {progress >= 1 ? '✓ Downloaded' : 'Downloading…'}
            </div>
          </div>
        </PhoneFrame>
      </div>
    </Backdrop>
  );
};

const PILLS = ['7-day free trial · No account', '$9 once · No subscription', 'Up to 3 Macs'];

/** S13 — end card. */
export const EndCardScene: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSeconds();
  const icon = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  return (
    <Backdrop theme={props.theme}>
      <WindowShot {...props} x={960} y={540} scale={1.5} style={{ filter: 'blur(18px)', opacity: 0.45 }}>
        <AppWindow sites={demoSites} files={demoFiles} />
      </WindowShot>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 26, fontFamily: DISPLAY_FONT, translate: '0 -40px' }}>
        <Img src={appIcon} style={{ width: 170, height: 170, scale: String(icon), filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.25))' }} />
        <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -3, color: '#111', opacity: fadeIn(frame, s(0.4)) }}>LocalServe</div>
        <div style={{ display: 'flex', gap: 18 }}>
          {PILLS.map((pill, i) => {
            const at = s(1.2 + i * 0.7);
            return (
              <div key={pill} style={{ padding: '14px 26px', borderRadius: 999, background: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 12px 30px rgba(0,0,0,0.1)', fontSize: 28, fontWeight: 600, color: '#111', opacity: fadeIn(frame, at), translate: `0 ${(1 - fadeIn(frame, at)) * 20}px` }}>
                {pill}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, padding: '18px 40px', borderRadius: 16, background: '#111', color: '#fff', fontSize: 32, fontWeight: 700, opacity: fadeIn(frame, s(4.6)) }}>
          Download for macOS
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};
