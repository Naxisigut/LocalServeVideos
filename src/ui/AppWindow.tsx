import React from 'react';
import { useT, useUiEnv } from './context';
import { FileSharePanel } from './FileSharePanel';
import {
  CheckIcon,
  ExportIcon,
  FileIcon,
  FolderIcon,
  GearIcon,
  ImportIcon,
  LanguageIcon,
  MoreCircleIcon,
  PlayAllIcon,
  PlusCircleIcon,
  PlusIcon,
  ServerIcon,
  StopIcon,
} from './icons';
import type { FileShareRetryProps } from './FileShareRetryButton';
import { LicenseGate, TrialLicenseButton } from './License';
import { cumulativeShifts, slotTranslate, type Presence } from './motion';
import { DropdownMenu, MenuItem, Toast, Tooltip, hoverAttr } from './primitives';
import { SiteCard, type SiteCardControl, type SiteMenuItem } from './SiteCard';
import type { SiteBadgeKind } from './SiteStatusBadge';
import type { FileShareItemView, LicenseView, SiteView, TrialView } from './types';

export type TitlebarHover = 'trial' | 'language' | 'settings' | 'new';
export type SitesHeadHover = 'add-site' | 'more' | 'start-all' | 'stop-all' | 'import' | 'export';

/** `.site-list` gap. */
const SITE_GAP = 14;

export type SiteCardState = {
  hover?: SiteCardControl;
  tooltip?: Exclude<SiteCardControl, 'card'>;
  menuOpen?: boolean;
  menuHover?: SiteMenuItem;
  portReveal?: number;
  failureSeen?: boolean;
  badgeFrom?: SiteBadgeKind | null;
  badgeProgress?: number;
  powerFrom?: boolean;
  powerProgress?: number;
  /** Joining/leaving motion. Leaving sites stay in `sites` until it ends. */
  presence?: Presence;
};

export type ToastState = { text: string; enter?: number };

type Props = {
  sites: SiteView[];
  files: FileShareItemView[];
  /** Trial pill in the titlebar; omit when licensed. */
  trial?: TrialView;
  /** Trial ended: the workspace is replaced by the purchase card. */
  locked?: { license: LicenseView; time?: number };
  version?: string;

  titlebarHover?: TitlebarHover;
  addMenuOpen?: boolean;
  addMenuHover?: 'file' | 'site';
  languageMenuOpen?: boolean;

  sitesHeadHover?: SitesHeadHover;
  sitesHeadTooltip?: SitesHeadHover;
  /** 0–1 reveal of the sites action bar (filter, start/stop all, import/export). */
  actionBar?: number;

  siteStates?: Record<string, SiteCardState>;
  fileHoverId?: string;
  /** File sharing failed: header retry capsule (also disables file QR codes while not `success`). */
  fileRetry?: FileShareRetryProps;
  filePresence?: Record<string, Presence>;

  /** Dialog layer (SiteDrawer, QrPopup, SiteDetail, Settings, License…). */
  overlay?: React.ReactNode;
  toasts?: ToastState[];
};

export const AppWindow: React.FC<Props> = ({
  sites,
  files,
  trial,
  locked,
  version = '0.1.0',
  titlebarHover,
  addMenuOpen,
  addMenuHover,
  languageMenuOpen,
  sitesHeadHover,
  sitesHeadTooltip,
  actionBar = 0,
  siteStates = {},
  fileHoverId,
  fileRetry,
  filePresence,
  overlay,
  toasts = [],
}) => {
  const t = useT();
  const running = sites.filter((s) => s.status === 'running').length;
  const bar = Math.min(1, Math.max(0, actionBar));
  const siteShifts = cumulativeShifts(sites.map((site) => siteStates[site.id]?.presence));

  return (
    <div className="app">
      <div className="titlebar">
        <div className="titlebar-drag" />
        <span className="titlebar-label">LocalServe</span>
        <div className="titlebar-actions">
          {trial ? <TrialLicenseButton trial={trial} hover={titlebarHover === 'trial'} /> : null}
          <LanguageMenu open={languageMenuOpen} hover={titlebarHover === 'language'} />
          <button
            type="button"
            tabIndex={-1}
            className="btn-icon"
            {...hoverAttr(titlebarHover === 'settings')}
          >
            <GearIcon />
          </button>
          {!locked ? (
            <div className="toolbar-menu">
              <button
                type="button"
                tabIndex={-1}
                className="btn btn-primary titlebar-add-btn"
                {...hoverAttr(titlebarHover === 'new')}
              >
                {t('新增')}
              </button>
              {addMenuOpen ? (
                <DropdownMenu>
                  <MenuItem
                    icon={<FileIcon size={13} />}
                    label={t('新增文件')}
                    hover={addMenuHover === 'file'}
                  />
                  <MenuItem
                    icon={<FolderIcon size={13} />}
                    label={t('新增站点')}
                    hover={addMenuHover === 'site'}
                  />
                </DropdownMenu>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {locked ? (
        <LicenseGate license={locked.license} time={locked.time} />
      ) : (
        <>
          <div className="content-area">
            <FileSharePanel
              items={files}
              hoverItemId={fileHoverId}
              running={!fileRetry || fileRetry.state === 'success'}
              retry={fileRetry}
              presence={filePresence}
            />

            <section className="sites-section">
              <div className="section-head">
                <div className="section-head-left">
                  <div className="section-head-title-line">
                    <span className="section-title">{t('站点')}</span>
                    <span className="section-title-count">{sites.length}</span>
                  </div>
                </div>
                <div className="section-head-actions">
                  <div className="action-bar-menu">
                    <div className="action-bar-anchor">
                      <HeadButton
                        id="add-site"
                        label={t('新增站点')}
                        hover={sitesHeadHover}
                        tooltip={sitesHeadTooltip}
                      >
                        <PlusCircleIcon />
                      </HeadButton>
                      <div
                        className={`site-card-action-bar${bar > 0 ? ' is-open' : ''}`}
                        style={
                          bar > 0 && bar < 1
                            ? {
                                maxWidth: `calc(${bar} * var(--action-bar-open-max, calc(var(--site-action-size) * var(--action-bar-slots, 6))))`,
                                opacity: bar,
                              }
                            : bar >= 1 && sitesHeadTooltip
                              ? { overflow: 'visible' }
                              : undefined
                        }
                      >
                        <div className="site-card-action-bar-inner">
                          <div className="site-filter">
                            <div className="site-filter-prefix">
                              <button type="button" tabIndex={-1} className="site-filter-status-trigger">
                                {t('全部')}
                              </button>
                            </div>
                            <input
                              type="text"
                              className="site-filter-input"
                              placeholder={t('关键字')}
                              value=""
                              onChange={() => undefined}
                              tabIndex={-1}
                            />
                          </div>
                          <HeadButton id="start-all" label={t('全部启动')} hover={sitesHeadHover} tooltip={sitesHeadTooltip}>
                            <PlayAllIcon />
                          </HeadButton>
                          <HeadButton id="stop-all" label={t('全部停止')} hover={sitesHeadHover} tooltip={sitesHeadTooltip}>
                            <StopIcon />
                          </HeadButton>
                          <HeadButton id="import" label={t('导入配置')} hover={sitesHeadHover} tooltip={sitesHeadTooltip}>
                            <ImportIcon />
                          </HeadButton>
                          <HeadButton id="export" label={t('导出全部配置')} hover={sitesHeadHover} tooltip={sitesHeadTooltip}>
                            <ExportIcon />
                          </HeadButton>
                        </div>
                      </div>
                      <HeadButton
                        id="more"
                        label={bar > 0 ? t('收起') : t('更多操作')}
                        hover={sitesHeadHover}
                        tooltip={sitesHeadTooltip}
                        active={bar > 0}
                      >
                        <MoreCircleIcon />
                      </HeadButton>
                    </div>
                  </div>
                </div>
              </div>

              {sites.length === 0 ? (
                <div className="empty-state empty-state-inline">
                  <div className="empty-icon">
                    <ServerIcon />
                  </div>
                  <div>
                    <p className="empty-title">{t('还没有任何站点')}</p>
                    <p className="empty-desc">{t('添加本地文件夹，一键发布为可访问的本地站点')}</p>
                  </div>
                  <button type="button" tabIndex={-1} className="btn btn-primary">
                    <PlusIcon /> {t('新增站点')}
                  </button>
                </div>
              ) : (
                <div className="site-list">
                  {sites.map((site, index) => (
                    <SiteCard
                      key={site.id}
                      site={site}
                      {...siteStates[site.id]}
                      style={slotTranslate(siteShifts[index], 'y', SITE_GAP)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="statusbar">
            <div className="statusbar-item">
              {t('{files} 个文件 · {sites} 个站点 · {running} 运行中', {
                files: files.length,
                sites: sites.length,
                running,
              })}
            </div>
            <div style={{ flex: 1 }} />
            <div className="statusbar-item">v{version}</div>
          </div>
        </>
      )}

      {overlay}

      {toasts.map((toast, i) => (
        <Toast key={i} text={t(toast.text)} index={i} enter={toast.enter} />
      ))}
    </div>
  );
};

const HeadButton: React.FC<{
  id: SitesHeadHover;
  label: string;
  hover?: SitesHeadHover;
  tooltip?: SitesHeadHover;
  active?: boolean;
  children: React.ReactNode;
}> = ({ id, label, hover, tooltip, active, children }) => {
  const isEdge = id === 'add-site' || id === 'more';
  return (
    <Tooltip label={label} placement="below" visible={tooltip === id}>
      <button
        type="button"
        tabIndex={-1}
        className={`btn-icon${isEdge ? ' section-head-icon-btn' : ''}${
          id === 'more' ? ' action-bar-more' : ''
        }${active ? ' is-active' : ''}`}
        aria-expanded={id === 'more' ? !!active : undefined}
        {...hoverAttr(hover === id)}
      >
        {children}
      </button>
    </Tooltip>
  );
};

const LanguageMenu: React.FC<{ open?: boolean; hover?: boolean }> = ({ open, hover }) => {
  const { language: current } = useUiEnv();
  return (
    <div className="language-select language-select-compact">
      <button
        type="button"
        tabIndex={-1}
        className="btn-icon"
        aria-expanded={!!open}
        {...hoverAttr(hover)}
      >
        <LanguageIcon size={14} />
      </button>
      {open ? (
        <DropdownMenu>
          {(['zh', 'en'] as const).map((option) => (
            <button key={option} type="button" tabIndex={-1} className="site-menu-item">
              <span className="site-menu-item-icon">
                {current === option ? <CheckIcon size={12} /> : null}
              </span>
              {option === 'zh' ? '中文' : 'English'}
            </button>
          ))}
        </DropdownMenu>
      ) : null}
    </div>
  );
};
