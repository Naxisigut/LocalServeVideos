import React from 'react';
import { useT, useUiEnv } from './context';
import { ChevronRightIcon, CloseIcon } from './icons';
import { ModalLayer, Toggle } from './primitives';

export type ThemePreference = 'system' | 'light' | 'dark';

const THEME_OPTIONS: readonly { value: ThemePreference; label: string }[] = [
  { value: 'system', label: '跟随系统' },
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
];

export type SettingsState = {
  theme?: ThemePreference;
  minimizeToTrayOnClose: boolean | number;
  launchAtLogin: boolean | number;
  restoreHostsOnQuit: boolean | number;
  managedDomains: string[];
  version: string;
  licensed?: boolean;
};

type Props = {
  settings: SettingsState;
  domainsOpen?: boolean;
  enter?: number;
};

export const Settings: React.FC<Props> = ({ settings, domainsOpen = false, enter }) => {
  const t = useT();
  const { language } = useUiEnv();
  return (
    <ModalLayer enter={enter}>
      <div className="drawer-header">
        <div className="drawer-title">{t('设置')}</div>
        <button type="button" tabIndex={-1} className="btn-icon">
          <CloseIcon />
        </button>
      </div>
      <div className="modal-body">
        <div className="settings-group">
          <div className="settings-group-title">{t('语言')}</div>
          <div className="settings-card">
            <Row name={t('显示语言')}>
              <label className="language-select">
                <select value={language} onChange={() => undefined}>
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </label>
            </Row>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group-title">{t('外观')}</div>
          <div className="settings-card">
            <Row name={t('主题')}>
              <label className="language-select">
                <select value={settings.theme ?? 'system'} onChange={() => undefined}>
                  {THEME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </select>
              </label>
            </Row>
          </div>
        </div>

        {settings.licensed ? (
          <div className="settings-group">
            <div className="settings-group-title">{t('许可证')}</div>
            <div className="settings-card">
              <Row name={t('激活状态')}>
                <span className="settings-row-value">{t('已激活')}</span>
              </Row>
            </div>
          </div>
        ) : null}

        <div className="settings-group">
          <div className="settings-group-title">{t('行为')}</div>
          <div className="settings-card">
            <Row name={t('关闭窗口时最小化到托盘')}>
              <Toggle checked={settings.minimizeToTrayOnClose} />
            </Row>
            <Row name={t('开机自启动')}>
              <Toggle checked={settings.launchAtLogin} />
            </Row>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group-title">{t('域名与hosts')}</div>
          <div className="settings-card">
            <Row name={t('退出应用时自动还原 hosts')} desc={t('关闭可避免频繁的管理员授权')}>
              <Toggle checked={settings.restoreHostsOnQuit} />
            </Row>
            <div className="settings-row settings-row-expandable">
              <button type="button" tabIndex={-1} className="settings-row-toggle" aria-expanded={domainsOpen}>
                <span className="settings-row-name">{t('托管块')}</span>
                <span className="settings-row-value">
                  {t('{count} 个域名', { count: settings.managedDomains.length })}
                </span>
                <ChevronRightIcon className={`fs-chevron${domainsOpen ? ' open' : ''}`} />
              </button>
              {domainsOpen ? (
                <div className="settings-domain-list">
                  {settings.managedDomains.length > 0 ? (
                    settings.managedDomains.map((domain) => (
                      <div className="settings-domain-item" key={domain}>
                        {domain}
                      </div>
                    ))
                  ) : (
                    <div className="settings-domain-empty">{t('暂无托管域名')}</div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group-title">{t('关于')}</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-label">
                <div className="settings-row-name">{t('当前版本')}</div>
              </div>
              <div className="settings-version-actions">
                <span className="settings-row-value">v{settings.version}</span>
                <button type="button" tabIndex={-1} className="btn-sm">
                  {t('检查更新')}
                </button>
              </div>
            </div>
            <Row name={t('使用说明')}>
              <button type="button" tabIndex={-1} className="btn-sm">
                {t('打开')}
              </button>
            </Row>
          </div>
        </div>
      </div>
    </ModalLayer>
  );
};

const Row: React.FC<{ name: string; desc?: string; children: React.ReactNode }> = ({
  name,
  desc,
  children,
}) => (
  <div className="settings-row">
    <div className="settings-row-label">
      <div className="settings-row-name">{name}</div>
      {desc ? <div className="settings-row-desc">{desc}</div> : null}
    </div>
    {children}
  </div>
);
