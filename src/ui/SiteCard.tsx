import React from 'react';
import { compactHomePath, useT, useUiEnv } from './context';
import {
  ExternalLinkIcon,
  FolderIcon,
  MoreIcon,
  PlayIcon,
  QrCodeIcon,
  RefreshIcon,
  StopIcon,
  TrashIcon,
} from './icons';
import { POWER_MS, clamp01, easeCss, easeStandard, mixColor, segment } from './motion';
import { DropdownMenu, MenuDivider, MenuItem, Tooltip, hoverAttr } from './primitives';
import { SiteStatusBadge, type SiteBadgeKind } from './SiteStatusBadge';
import type { SiteStatus, SiteView } from './types';

const STATUS_BADGE: Partial<Record<SiteStatus, SiteBadgeKind>> = {
  running: 'running',
  starting: 'starting',
};

export type SiteCardControl = 'card' | 'badge' | 'open' | 'qr' | 'more' | 'stop' | 'start';

export type SiteMenuItem = 'detail' | 'edit' | 'restart' | 'export' | 'reveal' | 'delete';

/** Failure text the card keeps on screen (the app hides failures already shown in a toast). */
export const siteFailure = (site: SiteView, failureSeen?: boolean): string | null =>
  site.status === 'error' && site.statusMessage && !failureSeen ? site.statusMessage : null;

type Props = {
  site: SiteView;
  /** Scripted pointer hover on a control. */
  hover?: SiteCardControl;
  /** Control whose tooltip is showing. */
  tooltip?: Exclude<SiteCardControl, 'card'>;
  menuOpen?: boolean;
  menuHover?: SiteMenuItem;
  /** 0–1 reveal of the "Port" chip; defaults to running ? 1 : 0. */
  portReveal?: number;
  /** The failure was already reported by a toast, so no "异常" capsule. */
  failureSeen?: boolean;
  /** Capsule kind before the current status; animates with `badgeProgress`. */
  badgeFrom?: SiteBadgeKind | null;
  /** 0–1 over `BADGE_MORPH_MS`. */
  badgeProgress?: number;
  /** Whether the site was running before; animates the icon swap with `powerProgress`. */
  powerFrom?: boolean;
  /** 0–1 over `POWER_MS`. */
  powerProgress?: number;
  style?: React.CSSProperties;
};

export const SiteCard: React.FC<Props> = ({
  site,
  hover,
  tooltip,
  menuOpen,
  menuHover,
  portReveal,
  failureSeen,
  badgeFrom,
  badgeProgress,
  powerFrom,
  powerProgress = 1,
  style,
}) => {
  const t = useT();
  const { homeDir, localLanIp } = useUiEnv();
  const running = site.status === 'running';
  const starting = site.status === 'starting';
  const failure = siteFailure(site, failureSeen);
  const reveal = portReveal ?? (running ? 1 : 0);
  const lanAvailable = site.host === '0.0.0.0' && !!localLanIp;
  const qrDisabled = !running || !lanAvailable;
  const qrLabel = lanAvailable ? t('扫码访问') : t('局域网地址不可用');
  const browserUrl = site.domains[0]
    ? `http://${site.domains[0]}`
    : `http://127.0.0.1:${site.port}`;

  return (
    <div
      className="site-card"
      data-status={site.status}
      style={style}
      {...hoverAttr(hover === 'card')}
    >
      <div className="site-card-left">
        <div className="site-card-title-row">
          <span className="site-name">{site.name}</span>
          <SiteStatusBadge
            kind={failure ? 'failure' : (STATUS_BADGE[site.status] ?? null)}
            from={badgeFrom}
            progress={badgeProgress}
            reason={failure ? t(failure) : null}
            tooltip={tooltip === 'badge'}
          />
        </div>

        <div className="path-row">
          <span className="path-icon" aria-hidden="true">
            <FolderIcon />
          </span>
          <span className="path-text">{compactHomePath(site.rootDir, homeDir)}</span>
        </div>
      </div>

      <div className="site-card-right">
        <div className="site-card-tools">
          <div
            className="site-card-port-wrap"
            style={{ width: 'max-content', maxWidth: reveal * 140, opacity: reveal }}
          >
            <div className="site-card-port">
              <span>{t('端口')}</span>
              <span className="site-card-port-value">{site.port}</span>
            </div>
          </div>
          <Tooltip label={browserUrl} align="end" visible={tooltip === 'open'}>
            <button
              type="button"
              tabIndex={-1}
              className="btn-icon"
              disabled={!running}
              {...hoverAttr(hover === 'open')}
            >
              <ExternalLinkIcon />
            </button>
          </Tooltip>
          <Tooltip label={qrLabel} visible={tooltip === 'qr'}>
            <button
              type="button"
              tabIndex={-1}
              className="btn-icon"
              disabled={qrDisabled}
              {...hoverAttr(hover === 'qr')}
            >
              <QrCodeIcon />
            </button>
          </Tooltip>
          <div className="site-card-menu">
            <Tooltip label={t('更多操作')} visible={tooltip === 'more' && !menuOpen}>
              <button
                type="button"
                tabIndex={-1}
                className="btn-icon site-card-more"
                aria-expanded={!!menuOpen}
                {...hoverAttr(hover === 'more')}
              >
                <MoreIcon />
              </button>
            </Tooltip>
            {menuOpen ? (
              <DropdownMenu>
                <MenuItem label={t('详情与日志')} hover={menuHover === 'detail'} />
                <MenuItem label={t('编辑配置')} hover={menuHover === 'edit'} />
                {running ? (
                  <MenuItem
                    icon={<RefreshIcon size={13} />}
                    label={t('重启站点')}
                    hover={menuHover === 'restart'}
                  />
                ) : null}
                <MenuItem label={t('导出配置')} hover={menuHover === 'export'} />
                <MenuItem label={t('在 Finder 中显示')} hover={menuHover === 'reveal'} />
                <MenuDivider />
                <MenuItem
                  icon={<TrashIcon size={13} />}
                  label={t('删除站点')}
                  danger
                  hover={menuHover === 'delete'}
                />
              </DropdownMenu>
            ) : null}
          </div>
        </div>
        <PowerButton
          running={running}
          starting={starting}
          progress={powerFrom === undefined || powerFrom === running ? 1 : powerProgress}
          hover={hover === 'stop' || hover === 'start'}
          tooltip={tooltip === 'stop' || tooltip === 'start'}
        />
      </div>
    </div>
  );
};

const STOP_TINT = '#ff3b30';
const STOP_BG = `color-mix(in srgb, ${STOP_TINT} 10%, transparent)`;

/** One button with stacked play/stop icons that rotate-swap (`site-power-btn`). */
const PowerButton: React.FC<{
  running: boolean;
  starting: boolean;
  progress: number;
  hover: boolean;
  tooltip: boolean;
}> = ({ running, starting, progress, hover, tooltip }) => {
  const t = useT();
  const p = clamp01(progress);
  const moving = p < 1;
  const move = easeStandard(p);
  const fade = easeCss(segment(p, POWER_MS, 0, 260));
  const tint = easeCss(segment(p, POWER_MS, 0, 360));
  // 0 = play showing, 1 = stop showing.
  const pos = running ? move : 1 - move;
  const stopOpacity = running ? fade : 1 - fade;
  const toStop = running ? tint : 1 - tint;
  return (
    <Tooltip label={t(running ? '停止' : '启动')} visible={tooltip}>
      <button
        type="button"
        tabIndex={-1}
        className={`btn-icon site-power-btn ${running ? 'btn-action-stop' : 'btn-action-start'}`}
        data-running={running || undefined}
        aria-disabled={starting || undefined}
        style={
          moving
            ? {
                color: mixColor('var(--status-green)', STOP_TINT, toStop),
                background: mixColor('var(--status-green-bg)', STOP_BG, toStop),
              }
            : undefined
        }
        {...hoverAttr(hover)}
      >
        <span
          className="site-power-icon site-power-play"
          aria-hidden="true"
          style={
            moving
              ? {
                  opacity: 1 - stopOpacity,
                  transform: `rotate(${90 * pos}deg) scale(${1 - 0.6 * pos})`,
                }
              : undefined
          }
        >
          <PlayIcon />
        </span>
        <span
          className="site-power-icon site-power-stop"
          aria-hidden="true"
          style={
            moving
              ? {
                  opacity: stopOpacity,
                  transform: `rotate(${-90 * (1 - pos)}deg) scale(${0.4 + 0.6 * pos})`,
                }
              : undefined
          }
        >
          <StopIcon />
        </span>
      </button>
    </Tooltip>
  );
};
