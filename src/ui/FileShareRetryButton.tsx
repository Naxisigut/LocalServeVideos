import React, { useLayoutEffect, useRef } from 'react';
import { useT } from './context';
import {
  RETRY_MS,
  RETRY_SPIN_MS,
  clamp01,
  easeAccelerate,
  easeCss,
  easePop,
  easeStandard,
  mixColor,
  segment,
} from './motion';
import { Tooltip, hoverAttr } from './primitives';

export type RetryState = 'error' | 'retrying' | 'success';

export type FileShareRetryProps = {
  state: RetryState;
  /** Previous state; animates into `state` with `progress`. */
  from?: RetryState;
  /** 0–1 over `RETRY_MS`. */
  progress?: number;
  /** Milliseconds since retrying began; drives the ring spin. */
  spinMs?: number;
  /** 0–1 over `RETRY_LEAVE_MS`: shrink away after success. */
  leave?: number;
  /** Untranslated failure reason (backend message) for the error tooltip. */
  reason?: string | null;
  hover?: boolean;
  tooltip?: boolean;
};

const TONE: Record<RetryState, string> = {
  error: 'red',
  retrying: 'blue',
  success: 'green',
};

const ICON_WIDTH = 11;
/** `.share-retry-content` horizontal padding outside the retrying state. */
const PAD_X = 3.5;

/** Same markup as the app's FileShareRetryButton, with its motion driven by props. */
export const FileShareRetryButton: React.FC<FileShareRetryProps> = ({
  state,
  from = state,
  progress = 1,
  spinMs = 0,
  leave = 0,
  reason,
  hover,
  tooltip,
}) => {
  const t = useT();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  const p = clamp01(progress);
  const moving = p < 1 && from !== state;
  const prev = moving ? from : state;
  const text = state === 'retrying' ? t('重试中') : '';
  const widthP = easeStandard(segment(p, RETRY_MS, 0, 420));

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const content = contentRef.current;
    if (!button || !content) return;
    const target = content.offsetWidth;
    const ghost = ghostRef.current;
    const start = moving && ghost ? ghost.offsetWidth : target;
    button.style.width = `${start + (target - start) * widthP}px`;
  });

  const amount = (s: RetryState, on: number) =>
    state === s ? (prev === s ? 1 : on) : prev === s ? 1 - on : 0;

  // Alert: pops in with `--retry-pop`, shrinks out faster.
  const alertIn = state === 'error';
  const alertOpacity = amount(
    'error',
    easeCss(segment(p, RETRY_MS, 0, alertIn ? 280 : 240)),
  );
  const alertScale =
    0.3 +
    0.7 *
      amount(
        'error',
        alertIn
          ? easePop(segment(p, RETRY_MS, 0, 420))
          : easeStandard(segment(p, RETRY_MS, 0, 300)),
      );
  const ringDash = 68 * amount('retrying', easeStandard(segment(p, RETRY_MS, 0, 520)));
  const ringOpacity = amount('retrying', easeCss(segment(p, RETRY_MS, 0, 280)));
  const checkOpacity = amount('success', easeCss(segment(p, RETRY_MS, 0, 180)));
  const checkDraw = amount('success', easeStandard(segment(p, RETRY_MS, 180, 420)));
  const tint = easeCss(segment(p, RETRY_MS, 0, 420));
  const tone = (s: RetryState, suffix = '') => `var(--status-${TONE[s]}${suffix})`;
  const spin = state === 'retrying' || prev === 'retrying' ? (spinMs / RETRY_SPIN_MS) * 360 : 0;
  const textOpacity = easeCss(segment(p, RETRY_MS, 0, 320));
  const gone = easeAccelerate(clamp01(leave));

  const label =
    state === 'retrying'
      ? t('正在重新启动文件分享…')
      : state === 'success'
        ? t('文件分享已恢复')
        : t('{reason}\n点击重试', { reason: t(reason ?? '文件分享启动失败') });

  return (
    <Tooltip label={label} wrap placement="below" align="end" visible={tooltip}>
      <button
        ref={buttonRef}
        type="button"
        tabIndex={-1}
        className="share-retry-btn"
        data-state={state}
        style={{
          ...(moving
            ? {
                background: mixColor(tone(prev, '-bg'), tone(state, '-bg'), tint),
                color: mixColor(tone(prev), tone(state), tint),
              }
            : {}),
          ...(gone > 0 ? { opacity: 1 - gone, transform: `scale(${1 - gone})` } : {}),
        }}
        {...hoverAttr(hover)}
      >
        <span ref={contentRef} className="share-retry-content">
          <svg
            className="share-retry-icon"
            width={ICON_WIDTH}
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <g className="share-retry-ring" style={{ transform: `rotate(${spin}deg)` }}>
              <circle
                cx="12"
                cy="12"
                r="9.5"
                pathLength="100"
                style={{ strokeDasharray: `${ringDash} ${100 - ringDash}`, opacity: ringOpacity }}
              />
            </g>
            <g
              className="share-retry-alert"
              style={{ opacity: alertOpacity, transform: `scale(${alertScale})` }}
            >
              <path d="M9.9 5.2a2.1 2.1 0 0 1 4.2 0l-.85 9.1a1.25 1.25 0 0 1-2.5 0Z" />
              <circle cx="12" cy="19.3" r="1.9" />
            </g>
            <polyline
              className="share-retry-check"
              points="5 12.5 10 17.5 19 7"
              pathLength="1"
              style={{ strokeDashoffset: 1 - checkDraw, opacity: checkOpacity }}
            />
          </svg>
          {text ? (
            <span
              className="share-retry-text"
              style={moving ? { opacity: textOpacity } : undefined}
            >
              {text}
            </span>
          ) : null}
        </span>
        {moving ? (
          <span
            ref={ghostRef}
            className="share-retry-content"
            style={{
              position: 'absolute',
              visibility: 'hidden',
              paddingRight: prev === 'retrying' ? 8 : PAD_X,
            }}
            aria-hidden="true"
          >
            <span style={{ width: ICON_WIDTH, flexShrink: 0 }} />
            {prev === 'retrying' ? <span>{t('重试中')}</span> : null}
          </span>
        ) : null}
      </button>
    </Tooltip>
  );
};
