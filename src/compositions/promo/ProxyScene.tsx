import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import appIcon from '../../../assets/brand/app-icon.png';
import { Backdrop } from '../Stage';
import { AcmePage, BrowserFrame } from './mocks';
import { DISPLAY_FONT, MONO_FONT, clamp, easeInOut, easeOut } from './shared';

const ACCENT = '#4f46e5';
const GREEN = '#16a34a';
const RED = '#dc2626';

// Both nodes sit 540px from the center with the same visual height, so the diagram is symmetric.
const LINE_Y = 520;
const NODE_H = 320;
const BROWSER = { x: 960 - 540, w: 480 };
const SERVER = { x: 960 + 540, w: 420 };
const HUB = { x: 960, size: 170 };
const BROWSER_EDGE = BROWSER.x + BROWSER.w / 2;
const SERVER_EDGE = SERVER.x - SERVER.w / 2;
// app-icon.png has a 50/512 transparent margin, so its visible edge sits inside HUB.size.
const HUB_HALF = (HUB.size * 206) / 512;
const LINE_GAP = 18;
const LINE_START = BROWSER_EDGE + LINE_GAP;
const LINE_END = SERVER_EDGE - LINE_GAP;
const LABEL_TOP = LINE_Y + NODE_H / 2 + 28;

// Part A — direct: the request reaches the API, but the browser blocks the response on the way back.
const REQ_A = 24;
const RESP_A = 58;
const BLOCK_AT = 90;
const RESET_AT = 150;
// Part B — through LocalServe.
const HUB_AT = 160;
const RULE_AT = 178;
const GO = 190;
// Packets through the hub match the blocked response's speed (server edge → center).
const SPEED = (SERVER_EDGE - HUB.x) / (BLOCK_AT - 4 - RESP_A);
// Each leg runs between a node and the hub's near edge; the packet then jumps to the hub's far edge.
const BROWSER_LEG = Math.round((HUB.x - HUB_HALF - BROWSER_EDGE) / SPEED);
const SERVER_LEG = Math.round((SERVER_EDGE - HUB.x - HUB_HALF) / SPEED);
const HIT = GO + BROWSER_LEG + SERVER_LEG;
const BACK = HIT + 4;
const LOADED_AT = BACK + SERVER_LEG + BROWSER_LEG;

const fade = (frame: number, at: number, len = 10) => interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: easeOut });
const travel = (frame: number, from: number, len: number) => interpolate(frame, [from, from + len], [0, 1], { ...clamp, easing: easeInOut });

const ServerRack: React.FC<{ flash: number }> = ({ flash }) => (
  <svg width={SERVER.w} height={NODE_H} viewBox={`0 0 ${SERVER.w} ${NODE_H}`} style={{ filter: 'drop-shadow(0 24px 40px rgba(20,24,40,0.25))' }}>
    {[0, 1, 2].map((u) => {
      const y = u * 112;
      return (
        <g key={u}>
          <rect x={0} y={y} width={SERVER.w} height={96} rx={18} fill="#1f2430" />
          <circle cx={42} cy={y + 48} r={11} fill="#22c55e" opacity={0.55 + 0.45 * flash} />
          <circle cx={76} cy={y + 48} r={11} fill="#38bdf8" opacity={0.4 + 0.6 * flash * (u === 1 ? 1 : 0.4)} />
          {[0, 1, 2].map((k) => (
            <rect key={k} x={118} y={y + 27 + k * 17} width={270} height={8} rx={4} fill="#3a4152" />
          ))}
        </g>
      );
    })}
  </svg>
);

const NodeLabel: React.FC<{ x: number; title: string; opacity: number }> = ({ x, title, opacity }) => (
  <div style={{ position: 'absolute', left: x, top: LABEL_TOP, translate: '-50% 0', fontFamily: DISPLAY_FONT, fontSize: 40, fontWeight: 800, color: '#111', letterSpacing: -0.5, whiteSpace: 'nowrap', opacity }}>
    {title}
  </div>
);

const Packet: React.FC<{ x: number; color: string; label: string; opacity?: number }> = ({ x, color, label, opacity = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: LINE_Y, translate: '-50% -50%', opacity, zIndex: 8 }}>
    <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, boxShadow: `0 0 0 6px ${color}33, 0 0 24px ${color}aa` }} />
    <div style={{ position: 'absolute', bottom: 40, left: '50%', translate: '-50% 0', padding: '6px 14px', borderRadius: 10, background: '#111', color: '#fff', fontFamily: MONO_FONT, fontSize: 26, whiteSpace: 'nowrap' }}>
      {label}
    </div>
  </div>
);

/** Moves a packet across [from → to] between frames [at, at + len]. */
const along = (frame: number, at: number, len: number, from: number, to: number) => from + (to - from) * travel(frame, at, len);

/** Moves a packet from `from` to the hub, then continues from the hub's opposite edge to `to`. */
const viaHub = (frame: number, at: number, from: number, to: number) => {
  const dir = Math.sign(to - from);
  const [first, second] = dir > 0 ? [BROWSER_LEG, SERVER_LEG] : [SERVER_LEG, BROWSER_LEG];
  return frame < at + first
    ? along(frame, at, first, from, HUB.x - dir * HUB_HALF)
    : along(frame, at + first, second, HUB.x + dir * HUB_HALF, to);
};

/** S8 — the browser blocks the API's response when called directly; through a LocalServe proxy rule it gets through. */
export const ProxyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodesIn = fade(frame, 0, 12);
  const partA = 1 - fade(frame, RESET_AT, 14);
  const blocked = frame >= BLOCK_AT && frame < RESET_AT + 14;
  const xPop = spring({ frame: frame - BLOCK_AT, fps, config: { damping: 11, mass: 0.6 } });

  const hubPop = spring({ frame: frame - HUB_AT, fps, config: { damping: 12, mass: 0.6 } });
  const segDraw = travel(frame, HUB_AT + 6, 18);
  const loaded = fade(frame, LOADED_AT, 10);
  const okPop = spring({ frame: frame - LOADED_AT, fps, config: { damping: 11, mass: 0.6 } });
  const okDraw = fade(frame, LOADED_AT + 4, 10);
  const serverFlash =
    interpolate(frame, [RESP_A - 6, RESP_A - 2, RESP_A + 10], [0, 1, 0], clamp) + interpolate(frame, [HIT, HIT + 4, HIT + 16], [0, 1, 0], clamp);

  let packet: React.ReactNode = null;
  if (frame >= REQ_A && frame < RESP_A - 2) {
    packet = <Packet x={along(frame, REQ_A, RESP_A - 2 - REQ_A, BROWSER_EDGE, SERVER_EDGE)} color={ACCENT} label="GET /api/me" />;
  } else if (frame >= RESP_A && frame < BLOCK_AT) {
    packet = (
      <Packet
        x={along(frame, RESP_A, BLOCK_AT - 4 - RESP_A, SERVER_EDGE, HUB.x)}
        color={RED}
        label="Response"
        opacity={1 - fade(frame, BLOCK_AT - 4, 4)}
      />
    );
  } else if (frame >= GO && frame < HIT) {
    packet = <Packet x={viaHub(frame, GO, BROWSER_EDGE, SERVER_EDGE)} color={ACCENT} label="GET /api/me" />;
  } else if (frame >= BACK && frame < LOADED_AT) {
    packet = <Packet x={viaHub(frame, BACK, SERVER_EDGE, BROWSER_EDGE)} color={GREEN} label="Response" />;
  }

  const veil = frame < LOADED_AT ? 1 : 1 - loaded;

  return (
    <Backdrop theme="light">
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <line x1={LINE_START} y1={LINE_Y} x2={LINE_END} y2={LINE_Y} stroke="#b6bac6" strokeWidth={4} strokeDasharray="12 10" opacity={nodesIn * partA} />
        {[
          [LINE_START, HUB.x - HUB_HALF - LINE_GAP],
          [HUB.x + HUB_HALF + LINE_GAP, LINE_END],
        ].map(([a, b]) =>
          segDraw <= 0 ? null : (
            <line key={a} x1={a} y1={LINE_Y} x2={a + (b - a) * segDraw} y2={LINE_Y} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={5} strokeLinecap="round" />
          ),
        )}
      </svg>

      {frame >= BLOCK_AT ? (
        <>
          <div style={{ position: 'absolute', left: HUB.x, top: LINE_Y, translate: '-50% -50%', width: 88, height: 88, borderRadius: '50%', background: RED, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 800, fontFamily: DISPLAY_FONT, boxShadow: '0 0 0 10px rgba(220,38,38,0.15), 0 12px 30px rgba(220,38,38,0.35)', scale: String(xPop), opacity: partA, zIndex: 6 }}>
            ✕
          </div>
          <div style={{ position: 'absolute', left: HUB.x, top: LINE_Y + 76, translate: '-50% 0', fontFamily: DISPLAY_FONT, fontSize: 40, fontWeight: 800, color: RED, whiteSpace: 'nowrap', opacity: fade(frame, BLOCK_AT + 4) * partA }}>
            Blocked by CORS
          </div>
        </>
      ) : null}

      <div style={{ position: 'absolute', left: BROWSER.x, top: LINE_Y, translate: '-50% -50%', opacity: nodesIn }}>
        <BrowserFrame width={BROWSER.w} height={NODE_H} url={null}>
          <div style={{ width: 1100, height: 610, scale: String(BROWSER.w / 1100), transformOrigin: '0 0' }}>
            <AcmePage view="overview" />
          </div>
          {veil > 0 ? (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', opacity: veil, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY_FONT, fontSize: 32, fontWeight: 700, color: blocked ? RED : '#888' }}>
              {blocked ? 'Couldn’t load data' : 'Loading data…'}
            </div>
          ) : null}
          {frame >= LOADED_AT ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={120} height={120} viewBox="0 0 170 170" style={{ scale: String(okPop), filter: 'drop-shadow(0 14px 28px rgba(22,163,74,0.35))' }}>
                <circle cx={85} cy={85} r={80} fill={GREEN} />
                <path d="M50 88l24 24 48-52" fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - okDraw} />
              </svg>
            </div>
          ) : null}
        </BrowserFrame>
      </div>
      <NodeLabel x={BROWSER.x} title="app" opacity={nodesIn} />

      <div style={{ position: 'absolute', left: SERVER.x, top: LINE_Y, translate: '-50% -50%', opacity: nodesIn }}>
        <ServerRack flash={Math.min(1, serverFlash)} />
      </div>
      <NodeLabel x={SERVER.x} title="remote server" opacity={nodesIn} />

      {frame >= HUB_AT ? (
        <AbsoluteFill style={{ zIndex: 7 }}>
          <Img
            src={appIcon}
            style={{ position: 'absolute', left: HUB.x, top: LINE_Y, width: HUB.size, height: HUB.size, translate: '-50% -50%', scale: String(hubPop), filter: 'drop-shadow(0 20px 40px rgba(20,24,40,0.25))' }}
          />
          <div style={{ position: 'absolute', left: HUB.x, top: LINE_Y + HUB.size / 2 + 26, translate: '-50% 0', textAlign: 'center', fontFamily: DISPLAY_FONT, opacity: fade(frame, RULE_AT), whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#666' }}>Proxy rule</div>
          </div>
        </AbsoluteFill>
      ) : null}

      {packet}
    </Backdrop>
  );
};
