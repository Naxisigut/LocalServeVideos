import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import appIcon from '../../../assets/brand/app-icon.png';
import { DEMO_HOME_DIR, DEMO_LAN_IP, acmeDraft, acmeSite, demoTrial } from '../../demo/acme';
import { AppWindow } from '../../ui/AppWindow';
import { MacCursor } from '../../ui/MacCursor';
import { MacWindow } from '../../ui/MacWindow';
import { BADGE_MORPH_MS, POWER_MS, PRESENCE_MS, motionProgress } from '../../ui/motion';
import { SiteDrawer, type DrawerField, type DrawerHover, type SiteDraft } from '../../ui/SiteDrawer';
import type { Language, SiteStatus, Theme } from '../../ui/types';
import { Backdrop } from '../Stage';
import { AcmePage, BrowserFrame } from './mocks';
import { QuestionBadge, clamp, easeInOut, easeOut } from './shared';

/** Pointer targets in window coordinates (667×640), measured in Studio. */
const POINTS = {
  rest: { x: 520, y: 590 },
  addSite: { x: 340, y: 497 },
  name: { x: 470, y: 197 },
  picker: { x: 440, y: 243 },
  port: { x: 480, y: 289 },
  lan: { x: 502, y: 335 },
  saveStart: { x: 462, y: 538 },
  open: { x: 517, y: 279 },
};

type Point = { x: number; y: number };
type Move = { at: number; to: Point };

const WINDOW_SCALE = 1.3;
/** Where S3 (`AppsHookScene`) leaves the LocalServe icon, so the cut is seamless. */
const HOOK_ICON = { y: 430, size: 200 };

/** S4–S6 — icon becomes the window, a site is created, started and opened in the browser. */
export const BuildSiteScene: React.FC<{ theme: Theme; language: Language }> = ({
  theme,
  language,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (seconds: number) => Math.round(seconds * fps);

  // S4 — S3's "?" at HOOK_ICON becomes the app icon on "Meet LocalServe", which grows into the window on "It turns…".
  const reveal = interpolate(frame, [s(0.2), s(0.9)], [0, 1], { ...clamp, easing: easeInOut });
  const morph = interpolate(frame, [s(1.6), s(2.4)], [0, 1], { ...clamp, easing: easeInOut });
  const rise = interpolate(morph, [0, 1], [HOOK_ICON.y - 540, -26]);

  // S5 — fill the "New site" drawer.
  const addClick = s(5.2);
  const drawerIn = addClick + 3;
  const nameClick = s(6.6);
  const nameTypeAt = nameClick + 4;
  const pickerClick = s(8.5);
  const portClick = s(9.8);
  const portTypeAt = portClick + 4;
  const lanClick = s(11.1);
  const saveHoverAt = s(11.9);

  // S6 — save and start.
  const saveClick = s(12.2);
  const drawerOut = saveClick + 3;
  const cardAt = drawerOut + 6;
  const runningAt = cardAt + s(0.8);
  const openHoverAt = s(14.4);
  const openClick = s(15);
  const browserIn = interpolate(frame, [openClick + 3, openClick + 15], [0, 1], { ...clamp, easing: easeOut });

  const moves: Move[] = [
    { at: s(4.2), to: POINTS.addSite },
    { at: s(5.9), to: POINTS.name },
    { at: s(7.8), to: POINTS.picker },
    { at: s(9.1), to: POINTS.port },
    { at: s(10.5), to: POINTS.lan },
    { at: s(11.4), to: POINTS.saveStart },
    { at: s(13.6), to: POINTS.open },
  ];
  const cursor = moves.reduce<Point>((from, move) => {
    const t = interpolate(frame, [move.at, move.at + s(0.6)], [0, 1], { ...clamp, easing: easeInOut });
    return { x: from.x + (move.to.x - from.x) * t, y: from.y + (move.to.y - from.y) * t };
  }, POINTS.rest);
  const clicks = [addClick, nameClick, pickerClick, portClick, lanClick, saveClick, openClick];
  const pressed = clicks.some((c) => frame >= c && frame < c + 4);

  const typeInto = (full: string, at: number) =>
    full.slice(0, Math.max(0, Math.min(full.length, Math.floor((frame - at) / 2))));

  const draft: SiteDraft = {
    ...acmeDraft,
    proxyRules: [],
    name: typeInto(acmeDraft.name, nameTypeAt),
    rootDir: frame >= pickerClick + 5 ? acmeDraft.rootDir : '',
    port: typeInto(acmeDraft.port, portTypeAt),
    lan: interpolate(frame, [lanClick + 1, lanClick + 6], [0, 1], clamp),
  };
  const focus: DrawerField | undefined =
    frame >= portClick && frame < lanClick ? 'port' : frame >= nameClick && frame < pickerClick ? 'name' : undefined;
  const drawerHover: DrawerHover | undefined =
    frame >= saveHoverAt ? 'save-start' : frame >= s(8.2) && frame < pickerClick + 5 ? 'picker' : undefined;
  const drawerEnter =
    frame < drawerOut
      ? interpolate(frame, [drawerIn, drawerIn + 8], [0, 1], { ...clamp, easing: easeOut })
      : interpolate(frame, [drawerOut, drawerOut + 7], [1, 0], clamp);

  const status: SiteStatus = frame < runningAt ? 'starting' : 'running';
  const badge =
    frame < runningAt
      ? { badgeFrom: null, badgeProgress: motionProgress(frame, cardAt, fps, BADGE_MORPH_MS) }
      : { badgeFrom: 'starting' as const, badgeProgress: motionProgress(frame, runningAt, fps, BADGE_MORPH_MS) };
  const sites = frame >= cardAt ? [{ ...acmeSite, status }] : [];
  const onOpen = frame >= openHoverAt;

  return (
    <Backdrop theme={theme}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            translate: `0 ${rise}px`,
            scale: String(WINDOW_SCALE * interpolate(morph, [0, 1], [0.25, 1])),
            opacity: morph,
          }}
        >
          <MacWindow
            theme={theme}
            env={{ language, localLanIp: DEMO_LAN_IP, homeDir: DEMO_HOME_DIR }}
          >
            <AppWindow
              sites={sites}
              files={[]}
              trial={demoTrial}
              siteStates={{
                [acmeSite.id]: {
                  presence: { enter: motionProgress(frame, cardAt, fps, PRESENCE_MS) },
                  portReveal: interpolate(frame, [runningAt, runningAt + s(0.4)], [0, 1], {
                    ...clamp,
                    easing: easeInOut,
                  }),
                  ...badge,
                  powerFrom: false,
                  powerProgress: motionProgress(frame, runningAt, fps, POWER_MS),
                  hover: onOpen ? 'open' : undefined,
                  tooltip: onOpen ? 'open' : undefined,
                },
              }}
              overlay={
                <SiteDrawer
                  draft={draft}
                  dirCheck={frame >= pickerClick + 8 ? 'ok' : null}
                  focus={focus}
                  caret={Math.floor(frame / 15) % 2 === 0}
                  hover={drawerHover}
                  enter={drawerEnter}
                />
              }
            />
            {frame >= s(3.6) ? (
              <MacCursor
                x={cursor.x}
                y={cursor.y}
                pressed={pressed}
              />
            ) : null}
          </MacWindow>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        {reveal < 1 ? (
          <QuestionBadge
            size={HOOK_ICON.size}
            style={{
              position: 'absolute',
              translate: `0 ${rise}px`,
              scale: String(interpolate(reveal, [0, 1], [1, 0.92])),
              opacity: 1 - reveal,
              filter: `blur(${reveal * 6}px) drop-shadow(0 24px 50px rgba(20,24,40,0.25))`,
            }}
          />
        ) : null}
        <Img
          src={appIcon}
          style={{
            position: 'absolute',
            width: HOOK_ICON.size,
            height: HOOK_ICON.size,
            translate: `0 ${rise}px`,
            scale: String(interpolate(reveal, [0, 1], [0.92, 1]) * interpolate(morph, [0, 1], [1, 0.5])),
            opacity: reveal * (1 - morph),
            filter: `blur(${(1 - reveal) * 6}px) drop-shadow(0 24px 50px rgba(20,24,40,0.25))`,
          }}
        />
      </AbsoluteFill>
      {browserIn > 0 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', background: `rgba(244,246,251,${0.55 * browserIn})` }}>
          <BrowserFrame
            width={1420}
            height={880}
            url={
              <>
                <span style={{ color: '#999' }}>http://</span>127.0.0.1:5173
              </>
            }
            style={{
              translate: '0 -26px',
              opacity: browserIn,
              scale: String(interpolate(browserIn, [0, 1], [0.6, 1])),
              transformOrigin: '72% 30%',
            }}
          >
            <AcmePage view="overview" />
          </BrowserFrame>
        </AbsoluteFill>
      ) : null}
    </Backdrop>
  );
};
