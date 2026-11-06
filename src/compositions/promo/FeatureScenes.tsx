import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import appIcon from '../../../assets/brand/app-icon.png';
import {
  ACME_LAN_URL,
  DEMO_HOME_DIR,
  DEMO_LAN_IP,
  acmeDraft,
  acmeLogs,
  acmeSite,
  demoFiles,
  demoSites,
  demoTrial,
  docsSite,
  landingSite,
} from '../../demo/acme';
import { AppWindow } from '../../ui/AppWindow';
import { MacCursor } from '../../ui/MacCursor';
import { MacWindow } from '../../ui/MacWindow';
import { PRESENCE_MS, motionProgress } from '../../ui/motion';
import { QrPopup } from '../../ui/QrPopup';
import { SiteDetail } from '../../ui/SiteDetail';
import { SiteDrawer } from '../../ui/SiteDrawer';
import { MacMenuBar, TrayMenu } from '../../ui/TrayMenu';
import type { Language, Theme } from '../../ui/types';
import { Backdrop } from '../Stage';
import { AcmePage, BrowserFrame, LogPill, PhoneFrame } from './mocks';
import { DISPLAY_FONT, MONO_FONT, clamp, easeInOut, easeOut } from './shared';

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

const typed = (frame: number, full: string, at: number, perChar = 2) =>
  full.slice(0, Math.max(0, Math.min(full.length, Math.floor((frame - at) / perChar))));

const twoSites = [acmeSite, docsSite];
const ACME_QR = { x: 545, y: 279 };
const FILE_URL = `http://${DEMO_LAN_IP}:19800/Demo.mp4`;

/** S7 — deep link + refresh work thanks to SPA fallback. */
export const SpaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSeconds();
  const path = typed(frame, '/dashboard/settings', s(1.6));
  const navigated = frame >= s(2.8);
  const refresh = interpolate(frame, [s(3.4), s(4)], [0, 1], { ...clamp, easing: easeInOut });
  const flash = frame >= s(3.4) && frame < s(3.7) ? 0.35 : 1;
  return (
    <Backdrop theme="light">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <BrowserFrame
          width={1420}
          height={820}
          refreshSpin={refresh}
          url={
            <>
              <span style={{ color: '#999' }}>http://</span>127.0.0.1:5173<span style={{ color: '#4f46e5' }}>{path}</span>
            </>
          }
          style={{
            translate: '0 -30px',
            opacity: fadeIn(frame, 0, 10),
            scale: String(interpolate(frame, [0, s(0.5)], [0.94, 1], { ...clamp, easing: easeOut })),
          }}
        >
          <div style={{ height: '100%', opacity: flash }}>
            <AcmePage view={navigated ? 'settings' : 'overview'} />
          </div>
          <LogPill
            level="access"
            text={acmeLogs[6].message}
            style={{ position: 'absolute', right: 28, bottom: 28, opacity: fadeIn(frame, s(4.1)) }}
          />
        </BrowserFrame>
      </AbsoluteFill>
    </Backdrop>
  );
};

const Node: React.FC<{ title: string; sub: string; accent?: boolean }> = ({ title, sub, accent }) => (
  <div style={{ width: 210, padding: '22px 18px', borderRadius: 18, background: accent ? '#111' : '#fff', color: accent ? '#fff' : '#111', boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 16px 40px rgba(0,0,0,0.12)', textAlign: 'center', fontFamily: DISPLAY_FONT }}>
    <div style={{ fontSize: 24, fontWeight: 700 }}>{title}</div>
    <div style={{ fontSize: 17, fontFamily: MONO_FONT, opacity: 0.7, marginTop: 6 }}>{sub}</div>
  </div>
);

/** S8 — add a `/api` proxy rule; same-origin request flows through LocalServe. */
export const ProxyScene: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const s = useSeconds();
  const ruleAt = s(0.8);
  const rule = acmeDraft.proxyRules[0];
  const draft = {
    ...acmeDraft,
    proxyRules:
      frame >= ruleAt
        ? [
            {
              ...rule,
              prefix: typed(frame, rule.prefix, ruleAt + 4),
              target: typed(frame, rule.target, ruleAt + 16, 1),
              changeOrigin: interpolate(frame, [s(2.4), s(2.6)], [0, 1], clamp),
            },
          ]
        : [],
  };
  const focus = frame < ruleAt + 14 ? ('proxy-prefix-0' as const) : frame < s(2.3) ? ('proxy-target-0' as const) : undefined;

  const flowStart = s(4);
  const go = interpolate(frame, [flowStart, flowStart + s(1.2)], [0, 1], { ...clamp, easing: easeInOut });
  const back = interpolate(frame, [flowStart + s(1.4), flowStart + s(2.4)], [0, 1], { ...clamp, easing: easeInOut });
  const dotX = back > 0 ? 1 - back : go;
  const okAt = flowStart + s(2.5);
  const strike = interpolate(frame, [okAt, okAt + 8], [0, 1], clamp);

  return (
    <Backdrop theme={props.theme}>
      <WindowShot {...props} x={560} y={500} scale={1.15} style={{ opacity: fadeIn(frame, 0, 10) }}>
        <AppWindow
          sites={[acmeSite]}
          files={[]}
          trial={demoTrial}
          overlay={
            <SiteDrawer
              mode="edit"
              runningOnOpen
              draft={draft}
              sections={{ proxy: true }}
              focus={focus}
              caret={Math.floor(frame / 15) % 2 === 0}
              hover={frame >= s(3) ? 'save-start' : frame < ruleAt ? 'add-rule' : undefined}
            />
          }
        />
      </WindowShot>
      <div style={{ position: 'absolute', left: 1040, top: 330, width: 820, opacity: fadeIn(frame, s(3.4)) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <Node title="Browser" sub=":5173/api/me" />
          <Node title="LocalServe" sub="/api → :9083" accent />
          <Node title="Your API" sub="127.0.0.1:9083" />
          <div style={{ position: 'absolute', left: 105, right: 105, top: '50%', height: 3, background: 'repeating-linear-gradient(90deg, #bbb 0 10px, transparent 10px 18px)', zIndex: -1 }} />
          {frame >= flowStart && frame < okAt ? (
            <div style={{ position: 'absolute', top: '50%', left: `calc(105px + ${dotX} * (100% - 210px))`, translate: '-50% -50%', width: 22, height: 22, borderRadius: '50%', background: back > 0 ? '#16a34a' : '#4f46e5', boxShadow: '0 0 18px rgba(79,70,229,0.6)' }} />
          ) : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 56, fontFamily: DISPLAY_FONT, fontSize: 28, fontWeight: 700 }}>
          <span style={{ position: 'relative', padding: '10px 22px', borderRadius: 12, color: '#dc2626', background: 'rgba(220,38,38,0.1)', opacity: 1 - 0.6 * strike }}>
            CORS error
            <span style={{ position: 'absolute', left: 12, right: 12, top: '50%', height: 4, borderRadius: 2, background: '#dc2626', scale: `${strike} 1`, transformOrigin: 'left' }} />
          </span>
          <span style={{ padding: '10px 22px', borderRadius: 12, color: '#fff', background: '#16a34a', opacity: strike, scale: String(interpolate(strike, [0, 1], [0.6, 1])) }}>
            200 OK · same origin
          </span>
        </div>
      </div>
    </Backdrop>
  );
};

/** S9 — Product Docs joins with `docs.ls`; the address bar switches over. */
export const DomainScene: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSeconds();
  const hoverAt = s(1.6);
  const swapAt = s(3);
  const swap = interpolate(frame, [swapAt, swapAt + 10], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Backdrop theme={props.theme}>
      <WindowShot {...props} x={560} y={500} scale={1.15}>
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
      </WindowShot>
      <div style={{ position: 'absolute', left: 1080, top: 300, opacity: fadeIn(frame, s(2.4)) }}>
        <BrowserFrame
          width={760}
          height={420}
          url={
            <span style={{ position: 'relative', display: 'inline-block', width: 400, height: 24 }}>
              <span style={{ position: 'absolute', opacity: 1 - swap, translate: `0 ${-12 * swap}px` }}>http://127.0.0.1:4000</span>
              <span style={{ position: 'absolute', opacity: swap, translate: `0 ${12 * (1 - swap)}px`, fontWeight: 600 }}>http://docs.ls</span>
            </span>
          }
        >
          <div style={{ padding: '30px 36px', fontFamily: DISPLAY_FONT }}>
            <div style={{ fontSize: 15, color: '#4f46e5', fontWeight: 600 }}>PRODUCT DOCS</div>
            <div style={{ fontSize: 34, fontWeight: 700, marginTop: 8 }}>Getting started</div>
            {[92, 80, 86, 60].map((w, i) => (
              <div key={i} style={{ height: 14, width: `${w}%`, borderRadius: 7, background: '#eceef3', marginTop: 18 }} />
            ))}
          </div>
        </BrowserFrame>
        <div style={{ marginTop: 26, display: 'inline-flex', padding: '10px 18px', borderRadius: 12, background: 'rgba(17,17,17,0.82)', color: '#fff', fontFamily: DISPLAY_FONT, fontSize: 20, opacity: fadeIn(frame, s(4.6)) * interpolate(frame, [s(6.6), s(7)], [1, 0], clamp) }}>
          Saving requires administrator approval · hosts managed by LocalServe
        </div>
      </div>
    </Backdrop>
  );
};

/** S10–S11 — LAN QR code, then the same site (and API) on a phone. */
export const PhoneScene: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const s = useSeconds();
  const move = interpolate(frame, [s(0.3), s(1.1)], [0, 1], { ...clamp, easing: easeInOut });
  const click = s(1.4);
  const phoneAt = s(6.5);
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
      <div style={{ position: 'absolute', left: 1420, top: 520, translate: `-50% -50%`, opacity: phone, rotate: `${interpolate(phone, [0, 1], [8, 0])}deg`, marginLeft: interpolate(phone, [0, 1], [500, 0]) }}>
        <PhoneFrame>
          <AcmePage view="overview" mobile />
        </PhoneFrame>
      </div>
      <div style={{ position: 'absolute', left: 150, top: 770, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <LogPill level="access" text={acmeLogs[10].message} style={{ opacity: fadeIn(frame, s(8.2)) }} />
        <LogPill level="proxy" text={acmeLogs[11].message} style={{ opacity: fadeIn(frame, s(8.8)) }} />
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
  const qrAt = s(3);
  const phoneAt = s(4.4);
  const phone = spring({ frame: frame - phoneAt, fps, config: { damping: 16, mass: 0.8 } });
  const progress = interpolate(frame, [phoneAt + 8, phoneAt + s(1.6)], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <Backdrop theme={props.theme}>
      <WindowShot {...props} x={interpolate(phone, [0, 1], [960, 640])} y={500} scale={1.15}>
        <AppWindow
          sites={twoSites}
          files={files}
          trial={demoTrial}
          filePresence={files.reduce<Record<string, { enter: number }>>((acc, f, i) => {
            acc[f.id] = { enter: motionProgress(frame, s(0.3 + i * 0.35), fps, PRESENCE_MS) };
            return acc;
          }, {})}
          fileHoverId={frame >= s(2.2) && frame < qrAt ? files[1].id : undefined}
          overlay={<QrPopup url={FILE_URL} enter={fadeIn(frame, qrAt, 9)} />}
        />
      </WindowShot>
      <div style={{ position: 'absolute', left: 1420, top: 520, translate: '-50% -50%', opacity: phone, marginLeft: interpolate(phone, [0, 1], [500, 0]) }}>
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

/** S13 — three sites + live logs, then the window tucks into the menu bar. */
export const MenuBarScene: React.FC<SceneProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSeconds();
  const detailIn = fadeIn(frame, s(1.6), 9);
  const detailOut = interpolate(frame, [s(4.4), s(4.7)], [1, 0], clamp);
  const tuck = interpolate(frame, [s(5), s(5.7)], [0, 1], { ...clamp, easing: easeInOut });
  const bar = fadeIn(frame, s(5.2), 10);
  const trayOpen = frame >= s(6.3);
  return (
    <Backdrop theme={props.theme}>
      <WindowShot
        {...props}
        x={interpolate(tuck, [0, 1], [960, 1780])}
        y={interpolate(tuck, [0, 1], [520, 20])}
        scale={1.3 * interpolate(tuck, [0, 1], [1, 0.04])}
        style={{ opacity: 1 - interpolate(tuck, [0.6, 1], [0, 1], clamp) }}
      >
        <AppWindow
          sites={demoSites}
          files={demoFiles}
          trial={demoTrial}
          siteStates={{ [landingSite.id]: { presence: { enter: motionProgress(frame, s(0.3), fps, PRESENCE_MS) } } }}
          overlay={<SiteDetail site={acmeSite} logs={acmeLogs} enter={detailIn * detailOut} />}
        />
      </WindowShot>
      <div style={{ position: 'absolute', top: 0, left: 0, scale: '2.4', transformOrigin: '0 0', opacity: bar, translate: `0 ${(1 - bar) * -20}px` }}>
        <MacMenuBar
          theme={props.theme}
          width={800}
          trayActive={trayOpen}
          trayMenu={
            trayOpen ? (
              <TrayMenu
                sites={demoSites}
                language={props.language}
                hover={frame >= s(7.4) ? { kind: 'site', id: acmeSite.id, sub: 'open' } : undefined}
              />
            ) : undefined
          }
        />
      </div>
    </Backdrop>
  );
};

const PILLS = ['7-day free trial · No account', '$9 once · No subscription', 'Up to 3 Macs'];

/** S14 — end card. */
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
