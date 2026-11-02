import React from 'react';
import { Img } from 'remotion';
import trayIcon from '../../assets/brand/tray.png';
import './styles/global.css';
import './styles/video.css';
import type { Language, SiteStatus, SiteView, Theme } from './types';

/** Same labels/emoji as `build_menu` in src-tauri/src/tray.rs. */
const TEXT = {
  empty: { zh: '暂无站点', en: 'No sites yet' },
  stop: { zh: '停止', en: 'Stop' },
  start: { zh: '启动', en: 'Start' },
  starting: { zh: '启动中', en: 'Starting' },
  open: { zh: '打开', en: 'Open' },
  startAll: { zh: '全部启动', en: 'Start all' },
  stopAll: { zh: '全部停止', en: 'Stop all' },
  main: { zh: '主窗口', en: 'Main window' },
  quit: { zh: '退出', en: 'Quit' },
} as const;

const STATUS_DOT: Record<SiteStatus, string> = {
  running: '🟢',
  error: '🔴',
  starting: '🔵',
  stopped: '⚪️',
};

export type TrayHover =
  | { kind: 'site'; id: string; sub?: 'action' | 'open' }
  | { kind: 'start-all' | 'stop-all' | 'main' | 'quit' };

type TrayMenuProps = {
  sites: SiteView[];
  language?: Language;
  hover?: TrayHover;
  /** macOS flips submenus left near the right screen edge. */
  submenuSide?: 'left' | 'right';
};

export const TrayMenu: React.FC<TrayMenuProps> = ({
  sites,
  language = 'en',
  hover,
  submenuSide = 'left',
}) => {
  const tx = (key: keyof typeof TEXT) => TEXT[key][language];
  const is = (kind: string) => hover?.kind === kind;
  const item = (active: boolean, disabled?: boolean) => ({
    ...(active ? { 'data-hover': '' } : {}),
    ...(disabled ? { 'data-disabled': '' } : {}),
  });
  return (
    <div className="ls-tray-menu">
      {sites.length === 0 ? (
        <div className="ls-tray-item" {...item(false, true)}>
          {tx('empty')}
        </div>
      ) : (
        sites.slice(0, 10).map((site) => {
          const open = hover?.kind === 'site' && hover.id === site.id;
          const sub = open && hover?.kind === 'site' ? hover.sub : undefined;
          const running = site.status === 'running';
          const actionLabel = running
            ? tx('stop')
            : site.status === 'starting'
              ? tx('starting')
              : tx('start');
          return (
            <div key={site.id} className="ls-tray-item" {...item(open)}>
              <span>{STATUS_DOT[site.status]}</span>
              <span>{site.name}</span>
              <span className="ls-tray-item-chevron">▶</span>
              {open ? (
                <div
                  className="ls-tray-menu ls-tray-submenu"
                  style={
                    submenuSide === 'left'
                      ? { left: 'auto', right: 'calc(100% + 4px)' }
                      : undefined
                  }
                >
                  <div
                    className="ls-tray-item"
                    {...item(sub === 'action', site.status === 'starting')}
                  >
                    {actionLabel}
                  </div>
                  <div className="ls-tray-item" {...item(sub === 'open', !running)}>
                    {tx('open')}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })
      )}
      <div className="ls-tray-separator" />
      <div className="ls-tray-item" {...item(is('start-all'))}>
        {tx('startAll')}
      </div>
      <div className="ls-tray-item" {...item(is('stop-all'))}>
        {tx('stopAll')}
      </div>
      <div className="ls-tray-item" {...item(is('main'))}>
        {tx('main')}
      </div>
      <div className="ls-tray-separator" />
      <div className="ls-tray-item" {...item(is('quit'))}>
        {tx('quit')}
      </div>
    </div>
  );
};

type MenuBarProps = {
  theme?: Theme;
  width: number;
  /** Frontmost app name + its menus on the left. */
  appName?: string;
  menus?: string[];
  /** Deterministic clock text, e.g. "Tue 9:41 AM". */
  clock?: string;
  trayActive?: boolean;
  /** Tray dropdown rendered under the LocalServe icon. */
  trayMenu?: React.ReactNode;
  /** Right-align the dropdown to the icon when it would overflow the screen. */
  trayMenuAlign?: 'left' | 'right';
};

/** macOS menu bar with the LocalServe tray icon among the status items. */
export const MacMenuBar: React.FC<MenuBarProps> = ({
  theme = 'dark',
  width,
  appName = 'Finder',
  menus = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'],
  clock = 'Tue 9:41 AM',
  trayActive,
  trayMenu,
  trayMenuAlign = 'right',
}) => (
  <div className={`ls-root ls-menubar ls-theme-${theme}`} style={{ width }}>
    <div className="ls-menubar-left">
      <AppleLogo />
      <span className="ls-menubar-app">{appName}</span>
      {menus.map((menu) => (
        <span key={menu}>{menu}</span>
      ))}
    </div>
    <div className="ls-menubar-right">
      <span className="ls-menubar-tray" {...(trayActive ? { 'data-active': '' } : {})}>
        <Img src={trayIcon} alt="" />
        {trayMenu ? (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 5px)',
              ...(trayMenuAlign === 'right' ? { right: 0 } : { left: 0 }),
            }}
          >
            {trayMenu}
          </div>
        ) : null}
      </span>
      <WifiIcon />
      <BatteryIcon />
      <span>{clock}</span>
    </div>
  </div>
);

const AppleLogo: React.FC = () => (
  <svg width="14" height="17" viewBox="0 0 170 200" fill="currentColor" aria-hidden>
    <path d="M150.4 172.4c-8.4 12.3-17.2 24.5-31 24.7-13.6.3-18-8-33.5-8-15.6 0-20.4 7.8-33.3 8.3-13.3.5-23.4-13.3-31.9-25.5C3.4 147-9.8 101.6 8 70.6c8.8-15.4 24.6-25.2 41.8-25.4 13-.3 25.4 8.8 33.4 8.8 8 0 23-10.9 38.8-9.3 6.6.3 25.1 2.7 37 20.1-1 .6-22.1 12.9-21.9 38.5.3 30.6 26.8 40.8 27.1 40.9-.2.7-4.2 14.5-13.8 28.2zM110.6 0c1.6 14.1-4.1 28.2-12.4 38.4-8.4 10.1-22.1 18-35.6 16.9-1.8-13.8 5-28.2 12.7-37.1C83.9 8.1 98.3.8 110.6 0z" />
  </svg>
);

const WifiIcon: React.FC = () => (
  <svg width="17" height="13" viewBox="0 0 17 13" fill="currentColor" aria-hidden>
    <path d="M8.5 2.3c2.6 0 5 1 6.8 2.7l1.2-1.2C14.4 1.8 11.6.6 8.5.6S2.6 1.8.5 3.8L1.7 5c1.8-1.7 4.2-2.7 6.8-2.7z" />
    <path d="M8.5 5.7c1.7 0 3.2.7 4.4 1.8l1.2-1.2c-1.5-1.4-3.4-2.3-5.6-2.3S4.4 4.9 2.9 6.3l1.2 1.2c1.2-1.1 2.7-1.8 4.4-1.8z" />
    <path d="M8.5 9c.8 0 1.5.3 2 .8l-2 2-2-2c.5-.5 1.2-.8 2-.8z" />
  </svg>
);

const BatteryIcon: React.FC = () => (
  <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden>
    <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.45" />
    <rect x="2" y="2" width="16" height="8" rx="1.6" fill="currentColor" />
    <path d="M24 4v4c.8-.3 1.3-1.1 1.3-2S24.8 4.3 24 4z" fill="currentColor" opacity="0.45" />
  </svg>
);
