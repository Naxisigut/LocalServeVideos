import type React from 'react';
import { Easing } from 'remotion';

/*
 * Frame-driven stand-ins for the app's CSS transitions/keyframes (disabled
 * under `.ls-root`). Every motion prop is a linear 0–1 progress over the
 * durations below; components apply the app's easings themselves.
 * Durations and curves mirror LocalServeTauri `global.css`.
 */

/** Presence enter + sibling FLIP (`--presence-enter-ms`, `FLIP_MS`). */
export const PRESENCE_MS = 480;
/** `--presence-leave-ms`; status capsule shrink, inside `PRESENCE_MS`. */
const PRESENCE_LEAVE_MS = 400;
/** `--presence-exit-ms`; list items clear the slot before the FLIP finishes. */
const PRESENCE_EXIT_MS = 190;
/** Site status capsule width/color morph. */
export const BADGE_MORPH_MS = 560;
/** Site start/stop icon swap. */
export const POWER_MS = 420;
/** File-share retry button state change (180ms check delay + 420ms draw). */
export const RETRY_MS = 600;
/** File-share retry button leave (`share-retry-leave`). */
export const RETRY_LEAVE_MS = 340;
/** Retry ring spin period (`share-retry-spin`). */
export const RETRY_SPIN_MS = 1100;
/** Toast pop-in (`toastIn`). */
export const TOAST_MS = 200;

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const easeStandard = Easing.bezier(0.2, 0, 0, 1);
export const easePop = Easing.bezier(0.34, 1.4, 0.64, 1);
export const easeAccelerate = Easing.bezier(0.4, 0, 1, 1);
export const easeCss = Easing.bezier(0.25, 0.1, 0.25, 1);
/** `--presence-exit-ease` (`cubic-bezier(0.2, 0, 0.2, 1)`). */
export const easeExit = Easing.bezier(0.2, 0, 0.2, 1);

/** Linear progress of a motion lasting `ms` that starts at `startFrame`. */
export const motionProgress = (frame: number, startFrame: number, fps: number, ms: number) =>
  clamp01((frame - startFrame) / ((ms / 1000) * fps));

/** Progress of a sub-animation (`delay`/`duration` in ms) inside a motion of `total` ms. */
export const segment = (t: number, total: number, delay: number, duration: number) =>
  clamp01((clamp01(t) * total - delay) / duration);

/** `color-mix` from `from` to `to`; `p` is already eased. */
export const mixColor = (from: string, to: string, p: number) =>
  p >= 1 ? to : p <= 0 ? from : `color-mix(in oklab, ${to} ${(p * 100).toFixed(2)}%, ${from})`;

/** List item joining (`enter`) or leaving (`leave`); both progress over `PRESENCE_MS`. */
export type Presence = { enter: number } | { leave: number };

/**
 * `data-presence` for the app's stacking CSS. Enter drops the attribute once
 * finished (`backwards` fill) so a leftover transform does not trap dropdowns.
 */
export const presenceAttr = (
  presence: Presence | undefined,
): { 'data-presence'?: 'enter' | 'leave' } => {
  if (!presence) return {};
  if ('enter' in presence) {
    return clamp01(presence.enter) < 1 ? { 'data-presence': 'enter' } : {};
  }
  return { 'data-presence': 'leave' };
};

/**
 * Scale from / back into the center.
 * `list` leave is `presence-exit` (dissolve to 0.86); `badge` leave is `presence-leave` (shrink to 0).
 */
export const presenceStyle = (
  presence: Presence | undefined,
  mode: 'list' | 'badge' = 'list',
): React.CSSProperties => {
  if (!presence) return {};
  if ('enter' in presence) {
    const t = clamp01(presence.enter);
    if (t >= 1) return {};
    const s = easePop(t);
    return { opacity: clamp01(s), transform: `scale(${s})` };
  }
  if (mode === 'badge') {
    const s = 1 - easeAccelerate(segment(presence.leave, PRESENCE_MS, 0, PRESENCE_LEAVE_MS));
    return { opacity: s, transform: `scale(${s})`, pointerEvents: 'none' };
  }
  const p = easeExit(segment(presence.leave, PRESENCE_MS, 0, PRESENCE_EXIT_MS));
  return {
    opacity: 1 - p,
    transform: `scale(${1 - 0.14 * p})`,
    pointerEvents: 'none',
    zIndex: 0,
  };
};

/**
 * Slots the following siblings are displaced by (negative = toward the list
 * start). Entering items push siblings in; leaving items stay in flow while
 * siblings slide over them, matching the app's FLIP.
 */
export const presenceShift = (presence: Presence | undefined): number => {
  if (!presence) return 0;
  return 'enter' in presence
    ? -(1 - easeStandard(clamp01(presence.enter)))
    : -easeStandard(clamp01(presence.leave));
};

/**
 * `translate` for a sibling displaced by `slots`. Assumes uniformly sized items
 * (site cards, 96px share cards) so one slot is the item's own size + gap.
 */
export const slotTranslate = (
  slots: number,
  axis: 'x' | 'y',
  gap: number,
): React.CSSProperties => {
  if (Math.abs(slots) < 1e-4) return {};
  const offset = `calc(${slots.toFixed(4)} * (100% + ${gap}px))`;
  return { translate: axis === 'y' ? `0 ${offset}` : `${offset} 0` };
};

/** Running sum of `presenceShift` before each index. */
export const cumulativeShifts = (presences: (Presence | undefined)[]): number[] => {
  let acc = 0;
  return presences.map((presence) => {
    const current = acc;
    acc += presenceShift(presence);
    return current;
  });
};
