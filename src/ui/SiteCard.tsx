import React from 'react';
import { compactHomePath, useT, useUiEnv } from './context';
import {
  AlertIcon,
  ExternalLinkIcon,
  FolderIcon,
  MoreIcon,
  PlayIcon,
  QrCodeIcon,
  RefreshIcon,
  StopIcon,
  TrashIcon,
} from './icons';
import { DropdownMenu, MenuDivider, MenuItem, Tooltip, hoverAttr } from './primitives';
import type { SiteStatus, SiteView } from './types';

const STATUS_TEXT: Record<SiteStatus, string> = {
  running: '运行中',
  stopped: '已停止',
  error: '异常',
  starting: '启动中',
};

export type SiteCardControl = 'card' | 'open' | 'qr' | 'more' | 'stop' | 'start';

export type SiteMenuItem = 'detail' | 'edit' | 'restart' | 'export' | 'reveal' | 'delete';

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
};

export const SiteCard: React.FC<Props> = ({
  site,
  hover,
  tooltip,
  menuOpen,
  menuHover,
  portReveal,
}) => {
  const t = useT();
  const { homeDir, localLanIp } = useUiEnv();
  const running = site.status === 'running';
  const reveal = portReveal ?? (running ? 1 : 0);
  const lanAvailable = site.host === '0.0.0.0' && !!localLanIp;
  const qrDisabled = !running || !lanAvailable;
  const qrLabel = lanAvailable ? t('扫码访问') : t('局域网地址不可用');
  const browserUrl = site.domains[0]
    ? `http://${site.domains[0]}`
    : `http://127.0.0.1:${site.port}`;

  return (
    <div className="site-card" data-status={site.status} {...hoverAttr(hover === 'card')}>
      <div className="site-card-left">
        <div className="site-card-title-row">
          <span className="site-name">{site.name}</span>
          <span className={`status-badge status-${site.status}`}>
            <span className="status-dot" />
            {t(STATUS_TEXT[site.status])}
          </span>
        </div>

        <div className="path-row">
          <span className="path-icon" aria-hidden="true">
            <FolderIcon />
          </span>
          <span className="path-text">{compactHomePath(site.rootDir, homeDir)}</span>
        </div>

        {site.status === 'error' && site.statusMessage ? (
          <span className="error-hint">
            <AlertIcon /> {t(site.statusMessage)}
          </span>
        ) : null}
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
        {running ? (
          <Tooltip label={t('停止')} visible={tooltip === 'stop'}>
            <button
              type="button"
              tabIndex={-1}
              className="btn-icon btn-action-stop"
              {...hoverAttr(hover === 'stop')}
            >
              <StopIcon />
            </button>
          </Tooltip>
        ) : (
          <Tooltip
            label={t(site.status === 'starting' ? '启动中' : '启动')}
            visible={tooltip === 'start'}
          >
            <button
              type="button"
              tabIndex={-1}
              className="btn-icon btn-action-start"
              disabled={site.status === 'starting'}
              {...hoverAttr(hover === 'start')}
            >
              <PlayIcon />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
