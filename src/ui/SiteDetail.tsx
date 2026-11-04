import React from 'react';
import { useT, useUiEnv } from './context';
import {
  AlertIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  ExportIcon,
  ExternalLinkIcon,
  TrashIcon,
} from './icons';
import { ModalLayer, Tooltip, hoverAttr } from './primitives';
import { siteFailure } from './SiteCard';
import type { LogEntry, LogLevel, SiteStatus, SiteView } from './types';

const STATUS_TEXT: Record<SiteStatus, string> = {
  running: '运行中',
  stopped: '已停止',
  error: '已停止',
  starting: '启动中',
};

export type LogSource = 'site' | 'shared';
export type SiteDetailControl = 'clear' | 'export';

const LEVEL_LABEL: Record<LogLevel, string> = {
  access: '访问',
  proxy: '代理',
  error: '错误',
  info: '信息',
};

type Filter = 'all' | LogLevel;

type Props = {
  site: SiteView;
  logs: LogEntry[];
  filter?: Filter;
  search?: string;
  urlsOpen?: boolean;
  autoScroll?: boolean;
  logSource?: LogSource;
  /** The failure was already reported by a toast, so no diagnostic bar. */
  failureSeen?: boolean;
  hover?: SiteDetailControl;
  tooltip?: SiteDetailControl;
  enter?: number;
};

/** Mirrors `siteUrls` in the app: local, LAN (host 0.0.0.0), custom domain. */
const siteUrls = (site: SiteView, lanIp: string | null) => {
  const list = [{ label: '本机', url: `http://127.0.0.1:${site.port}` }];
  if (site.host === '0.0.0.0' && lanIp) {
    list.push({ label: '局域网', url: `http://${lanIp}:${site.port}` });
  }
  if (site.domains[0]) list.push({ label: '自定义域名', url: `http://${site.domains[0]}` });
  return list;
};

export const SiteDetail: React.FC<Props> = ({
  site,
  logs,
  filter = 'all',
  search = '',
  urlsOpen = false,
  autoScroll = true,
  logSource = 'site',
  failureSeen,
  hover,
  tooltip,
  enter,
}) => {
  const t = useT();
  const { localLanIp } = useUiEnv();
  const running = site.status === 'running';
  const failure = siteFailure(site, failureSeen);
  const urls = siteUrls(site, localLanIp);
  const q = search.trim().toLowerCase();
  const filtered = logs.filter(
    (l) => (filter === 'all' || l.level === filter) && (!q || l.message.toLowerCase().includes(q)),
  );

  return (
    <ModalLayer enter={enter} className="modal-detail">
      <div className="drawer-header">
        <div className="drawer-title">{site.name}</div>
        <button type="button" tabIndex={-1} className="btn-icon">
          <CloseIcon />
        </button>
      </div>

      <div className="modal-body modal-body-stretch">
        <div className="stat-section">
          <div className="stat-cards">
            <Stat label={t('状态')} value={t(STATUS_TEXT[site.status])} tone={running ? 'green' : 'gray'} />
            <Stat label={t('独立端口')} value={String(site.port)} />
            <Stat label={t('自定义域名')} value={site.domains[0] || t('未配置')} />
            <Stat label={t('代理')} value={t('{count} 条', { count: site.proxyRules.length })} />
          </div>
          {failure ? (
            <div className="diag-bar">
              <AlertIcon size={14} />
              <div>{t(failure)}</div>
            </div>
          ) : null}
        </div>

        <div className="addr-section">
          <div className="addr-section-header" aria-expanded={urlsOpen}>
            <div className="addr-section-title">{t('访问链接')}</div>
            <span className="badge">{urls.length}</span>
            <ChevronRightIcon className={`fs-chevron${urlsOpen ? ' open' : ''}`} />
          </div>
          {urlsOpen ? (
            <div className="addr-section-body">
              {urls.map((u) => (
                <div className="addr-detail-row" key={u.url}>
                  <span className="addr-label">{t(u.label)}</span>
                  <span className="addr-url">{u.url}</span>
                  <div className="addr-actions">
                    <button type="button" tabIndex={-1} className="btn-icon-sm">
                      <CopyIcon size={12} />
                    </button>
                    <button type="button" tabIndex={-1} className="btn-icon-sm" disabled={!running}>
                      <ExternalLinkIcon size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="log-section">
          <div className="log-toolbar">
            <div className="log-tabs" role="tablist">
              {(['site', 'shared'] as const).map((source) => (
                <button
                  key={source}
                  type="button"
                  tabIndex={-1}
                  role="tab"
                  aria-selected={logSource === source}
                  className={`tab${logSource === source ? ' active' : ''}`}
                >
                  {source === 'site' ? t('站点日志') : t('共享端口 80 日志')}
                </button>
              ))}
            </div>
          </div>
          <div className="log-toolbar">
            <div className="log-tabs">
              {(['all', 'access', 'proxy', 'error'] as Filter[]).map((f) => (
                <button key={f} type="button" tabIndex={-1} className={`tab${filter === f ? ' active' : ''}`}>
                  {f === 'all' ? t('全部') : t(LEVEL_LABEL[f])}
                </button>
              ))}
            </div>
            <input
              type="text"
              className="mono log-search"
              placeholder={t('搜索日志')}
              value={search}
              onChange={() => undefined}
            />
            <button
              type="button"
              tabIndex={-1}
              className={`tab${autoScroll ? ' active' : ''}`}
              aria-pressed={autoScroll}
            >
              {t('自动滚动')}
            </button>
            <Tooltip label={t('清空日志')} visible={tooltip === 'clear'}>
              <button
                type="button"
                tabIndex={-1}
                className="btn-icon-sm"
                {...hoverAttr(hover === 'clear')}
              >
                <TrashIcon size={12} />
              </button>
            </Tooltip>
            <Tooltip label={t('导出日志')} visible={tooltip === 'export'}>
              <button
                type="button"
                tabIndex={-1}
                className="btn-icon-sm"
                {...hoverAttr(hover === 'export')}
              >
                <ExportIcon size={13} />
              </button>
            </Tooltip>
          </div>
          {/* Bottom-anchored list stands in for the app's auto-scroll. */}
          <div
            className="log-list"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: autoScroll ? 'flex-end' : undefined,
            }}
          >
            {filtered.length === 0 ? (
              <div className="log-empty">{t('暂无日志')}</div>
            ) : (
              filtered.map((l) => (
                <div className="log-row" key={l.id} style={{ flexShrink: 0 }}>
                  <span className="log-ts">{l.time}</span>
                  <span className={`log-level ${l.level}`}>{t(LEVEL_LABEL[l.level])}</span>
                  <span className="log-msg">{l.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ModalLayer>
  );
};

const Stat: React.FC<{ label: string; value: string; tone?: 'green' | 'gray' }> = ({
  label,
  value,
  tone,
}) => (
  <div className="stat-card">
    <span className="stat-label">{label}</span>
    <span className={`stat-value${tone ? ' ' + tone : ''}`} title={value}>
      {value}
    </span>
  </div>
);
