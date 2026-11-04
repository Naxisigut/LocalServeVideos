import React, { useLayoutEffect, useRef } from 'react';
import { useT } from './context';
import {
  BADGE_MORPH_MS,
  PRESENCE_MS,
  clamp01,
  easeCss,
  easeStandard,
  mixColor,
  presenceStyle,
  segment,
} from './motion';
import { Tooltip } from './primitives';

export type SiteBadgeKind = 'running' | 'starting' | 'failure';

const BADGE_TEXT: Record<SiteBadgeKind, string> = {
  running: '运行中',
  starting: '启动中',
  failure: '异常',
};

const TONE: Record<SiteBadgeKind, string> = {
  running: 'green',
  starting: 'blue',
  failure: 'red',
};

type Props = {
  kind: SiteBadgeKind | null;
  /** Previous kind; with `progress` < 1 the capsule enters, leaves or morphs from it. */
  from?: SiteBadgeKind | null;
  /** 0–1 over `BADGE_MORPH_MS`. */
  progress?: number;
  /** Failure reason shown in the tooltip. */
  reason?: string | null;
  tooltip?: boolean;
};

/** Same capsule as the app's SiteStatusBadge, with its motion driven by props. */
export const SiteStatusBadge: React.FC<Props> = ({
  kind,
  from = kind,
  progress = 1,
  reason,
  tooltip,
}) => {
  const t = useT();
  const badgeRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  const p = clamp01(progress);
  const settled = p >= 1 || from === kind;
  const presence = segment(p, BADGE_MORPH_MS, 0, PRESENCE_MS);
  const rendered = settled ? kind : (kind ?? from);
  const morphFrom = !settled && from && kind ? from : null;
  const widthP = easeStandard(p);

  useLayoutEffect(() => {
    const badge = badgeRef.current;
    if (!badge) return;
    const content = contentRef.current;
    const ghost = ghostRef.current;
    if (morphFrom && content && ghost) {
      const width = ghost.offsetWidth + (content.offsetWidth - ghost.offsetWidth) * widthP;
      badge.style.width = `${width}px`;
    } else {
      badge.style.removeProperty('width');
    }
  });

  if (!rendered) return null;

  const failure = rendered === 'failure';
  const motion = settled
    ? {}
    : from === null
      ? presenceStyle({ enter: presence })
      : kind === null
        ? presenceStyle({ leave: presence })
        : {};
  const c = easeCss(p);
  const tone = (k: SiteBadgeKind, suffix = '') => `var(--status-${TONE[k]}${suffix})`;
  const colors: React.CSSProperties = morphFrom
    ? {
        background: mixColor(tone(morphFrom, '-bg'), tone(rendered, '-bg'), c),
        color: mixColor(tone(morphFrom), tone(rendered), c),
      }
    : {};

  return (
    <Tooltip label={failure ? (reason ?? '') : ''} wrap visible={tooltip}>
      <span
        ref={badgeRef}
        className={`status-badge site-status-badge status-${rendered}`}
        style={{ ...motion, ...colors }}
      >
        <span ref={contentRef} className="site-status-badge-content">
          <span
            className="status-dot"
            style={morphFrom ? { background: colors.color } : undefined}
          />
          {t(BADGE_TEXT[rendered])}
        </span>
        {morphFrom ? (
          <span
            ref={ghostRef}
            className="site-status-badge-content"
            style={{ position: 'absolute', visibility: 'hidden' }}
            aria-hidden="true"
          >
            <span className="status-dot" />
            {t(BADGE_TEXT[morphFrom])}
          </span>
        ) : null}
      </span>
    </Tooltip>
  );
};
