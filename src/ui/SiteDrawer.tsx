import React from 'react';
import { useT } from './context';
import {
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
  HelpCircleIcon,
  PlusIcon,
} from './icons';
import { FakeInput, ModalLayer, Toggle, Tooltip, hoverAttr } from './primitives';

export type ProxyDraft = {
  prefix: string;
  target: string;
  changeOrigin: boolean | number;
  rewritePath: boolean | number;
};

export type SiteDraft = {
  name: string;
  rootDir: string;
  port: string;
  /** "Enable LAN access" (host 0.0.0.0). Number = animated 0–1. */
  lan: boolean | number;
  domainEnabled: boolean | number;
  domain: string;
  proxyRules: ProxyDraft[];
  spaFallback: boolean | number;
  appendCors: boolean | number;
  autoStart: boolean | number;
};

export type DrawerField =
  | 'name'
  | 'port'
  | 'domain'
  | `proxy-prefix-${number}`
  | `proxy-target-${number}`;

export type DrawerHover =
  | 'close'
  | 'picker'
  | 'basic'
  | 'proxy'
  | 'advanced'
  | 'add-rule'
  | 'cancel'
  | 'save'
  | 'save-start';

type Props = {
  mode?: 'new' | 'edit';
  draft: SiteDraft;
  sections?: { basic?: boolean; proxy?: boolean; advanced?: boolean };
  /** Directory check result: `ok`, an app error message, or hidden. */
  dirCheck?: 'ok' | '目录不存在或不是文件夹' | '未找到 index.html' | null;
  focus?: DrawerField;
  caret?: boolean;
  hover?: DrawerHover;
  /** Help tooltip next to a field label. */
  helpTooltip?: 'port' | 'lan' | 'domain';
  /** Site was running when opened → single "Save & apply" primary. */
  runningOnOpen?: boolean;
  enter?: number;
};

export const emptySiteDraft: SiteDraft = {
  name: '',
  rootDir: '',
  port: '',
  lan: false,
  domainEnabled: false,
  domain: '',
  proxyRules: [],
  spaFallback: true,
  appendCors: false,
  autoStart: false,
};

/** Real inputs are `width: 100%` and add no intrinsic width to the table. */
const PROXY_INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  contain: 'inline-size',
  padding: '0 7px',
  fontSize: 'var(--fs-xs)',
};

const on = (value: boolean | number) => (typeof value === 'number' ? value >= 0.5 : value);

export const SiteDrawer: React.FC<Props> = ({
  mode = 'new',
  draft,
  sections = { basic: true },
  dirCheck = null,
  focus,
  caret,
  hover,
  helpTooltip,
  runningOnOpen,
  enter,
}) => {
  const t = useT();
  const field = (name: DrawerField) => ({ focused: focus === name, caret });
  const lanOn = on(draft.lan);

  return (
    <ModalLayer enter={enter} className="modal-edit">
      <div className="drawer-header">
        <div className="drawer-title">{mode === 'edit' ? t('编辑站点') : t('新增站点')}</div>
        <button type="button" tabIndex={-1} className="btn-icon" {...hoverAttr(hover === 'close')}>
          <CloseIcon />
        </button>
      </div>

      <div className="drawer-body">
        <FormSection title={t('基础信息')} open={!!sections.basic} hover={hover === 'basic'}>
          <div className="basic-field-list">
            <div className="basic-field-row">
              <label>{t('名称')}</label>
              <div className="basic-field-value basic-field-value-inline">
                <FakeInput
                  value={draft.name}
                  placeholder={t('如：my-project')}
                  align="right"
                  style={{ width: 'var(--basic-control-width)', maxWidth: '100%' }}
                  {...field('name')}
                />
              </div>
            </div>
            <div className="basic-field-row">
              <label>{t('目录')}</label>
              <div className="basic-field-value basic-field-value-inline">
                {dirCheck === 'ok' ? (
                  <span className="field-hint ok">
                    <CheckIcon />
                  </span>
                ) : dirCheck ? (
                  <span className="field-hint err">{t(dirCheck)}</span>
                ) : null}
                <button
                  type="button"
                  tabIndex={-1}
                  className={`btn-path-picker mono${draft.rootDir ? '' : ' is-empty'}`}
                  {...hoverAttr(hover === 'picker')}
                >
                  {draft.rootDir || t('点击选择文件夹')}
                </button>
              </div>
            </div>
            <div className="basic-field-row">
              <label>
                {t('独立端口')}
                <FieldLabelHelp
                  label={t('IP 访问使用，推荐 1024–65535')}
                  visible={helpTooltip === 'port'}
                />
              </label>
              <div className="basic-field-value basic-field-value-inline">
                <FakeInput
                  value={draft.port}
                  placeholder={t('填写端口')}
                  style={{ width: 'auto', flex: '0 1 5rem', maxWidth: '100%' }}
                  {...field('port')}
                />
              </div>
            </div>
            <div className="basic-field-row">
              <label>
                {t('启用局域网访问')}
                <FieldLabelHelp
                  label={t(lanOn ? '局域网内设备可通过本机 IP 访问' : '仅本机可通过 127.0.0.1 访问')}
                  visible={helpTooltip === 'lan'}
                />
              </label>
              <div className="basic-field-value basic-field-value-inline">
                <Toggle checked={draft.lan} />
              </div>
            </div>
            <div className="basic-field-row">
              <label>
                {t('启用自定义域名')}
                <FieldLabelHelp label={t('保存时需管理员授权')} visible={helpTooltip === 'domain'} />
              </label>
              <div className="basic-field-value basic-field-value-inline">
                <Toggle checked={draft.domainEnabled} />
              </div>
            </div>
            {on(draft.domainEnabled) ? (
              <div className="basic-field-row">
                <label>{t('自定义域名')}</label>
                <div className="basic-field-value basic-field-value-inline">
                  <FakeInput
                    value={draft.domain}
                    placeholder={t('推荐ls后缀，如：app.ls')}
                    mono
                    align="right"
                    style={{ width: 'var(--basic-control-width)', maxWidth: '100%' }}
                    {...field('domain')}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </FormSection>

        <FormSection
          title={t('代理规则')}
          badge={
            draft.proxyRules.length > 0
              ? t('{count} 条', { count: draft.proxyRules.length })
              : undefined
          }
          open={!!sections.proxy}
          hover={hover === 'proxy'}
        >
          {draft.proxyRules.length > 0 ? (
            <table className="proxy-table">
              <thead>
                <tr>
                  <th>{t('路径前缀')}</th>
                  <th>{t('目标地址')}</th>
                  <th className="col-tog">{t('来源替换')}</th>
                  <th className="col-tog">{t('路径重写')}</th>
                  <th className="col-del" />
                </tr>
              </thead>
              <tbody>
                {draft.proxyRules.map((rule, i) => (
                  <tr key={i}>
                    <td>
                      <FakeInput
                        value={rule.prefix}
                        placeholder="/api"
                        mono
                        height={26}
                        style={PROXY_INPUT_STYLE}
                        {...field(`proxy-prefix-${i}`)}
                      />
                    </td>
                    <td>
                      <FakeInput
                        value={rule.target}
                        placeholder="http://host:port"
                        mono
                        height={26}
                        style={PROXY_INPUT_STYLE}
                        {...field(`proxy-target-${i}`)}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Toggle checked={rule.changeOrigin} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Toggle checked={rule.rewritePath} />
                    </td>
                    <td className="col-del">
                      <button type="button" tabIndex={-1} className="btn-icon proxy-del-btn">
                        <CloseIcon size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          <button
            type="button"
            tabIndex={-1}
            className="btn-add-row"
            {...hoverAttr(hover === 'add-rule')}
          >
            <PlusIcon size={11} /> {t('添加代理规则')}
          </button>
        </FormSection>

        <FormSection
          title={t('高级选项')}
          open={!!sections.advanced}
          hover={hover === 'advanced'}
          last
        >
          <div className="switch-list">
            <SwitchRow
              name="SPA history fallback"
              desc={t('未匹配到文件的路由回退到 index.html，适用于单页应用')}
              checked={draft.spaFallback}
            />
            <SwitchRow
              name={t('附加 CORS 响应头')}
              desc={t('为静态资源附加 Access-Control 头（默认关闭，首选同源反代）')}
              checked={draft.appendCors}
            />
            <SwitchRow
              name={t('应用启动时自动运行')}
              desc={t('每次打开 LocalServe 时自动启动此站点')}
              checked={draft.autoStart}
            />
          </div>
        </FormSection>
      </div>

      <div className="drawer-footer">
        <button type="button" tabIndex={-1} className="btn-footer" {...hoverAttr(hover === 'cancel')}>
          {t('取消')}
        </button>
        <div className="footer-spacer" />
        {!runningOnOpen ? (
          <button type="button" tabIndex={-1} className="btn-footer" {...hoverAttr(hover === 'save')}>
            {t('保存')}
          </button>
        ) : null}
        <button
          type="button"
          tabIndex={-1}
          className="btn-footer-primary"
          {...hoverAttr(hover === 'save-start')}
        >
          {t(runningOnOpen ? '保存立即生效' : '保存并启动')}
        </button>
      </div>
    </ModalLayer>
  );
};

const FieldLabelHelp: React.FC<{ label: string; visible?: boolean }> = ({ label, visible }) => (
  <Tooltip label={label} wrap align="start" visible={visible}>
    <button type="button" tabIndex={-1} className="field-label-help">
      <HelpCircleIcon size={12} />
    </button>
  </Tooltip>
);

const FormSection: React.FC<{
  title: string;
  badge?: string;
  open: boolean;
  hover?: boolean;
  last?: boolean;
  children: React.ReactNode;
}> = ({ title, badge, open, hover, last, children }) => (
  <div className="form-section" style={last ? { borderBottom: 'none' } : undefined}>
    <div className="fs-header" aria-expanded={open} {...hoverAttr(hover)}>
      <div className="fs-title">{title}</div>
      {badge ? <span className="badge">{badge}</span> : null}
      <ChevronRightIcon className={`fs-chevron${open ? ' open' : ''}`} />
    </div>
    {open ? <div className="fs-body">{children}</div> : null}
  </div>
);

const SwitchRow: React.FC<{ name: string; desc: string; checked: boolean | number }> = ({
  name,
  desc,
  checked,
}) => (
  <div className="switch-row">
    <div className="switch-label">
      <div className="switch-name">{name}</div>
      <div className="switch-desc">{desc}</div>
    </div>
    <Toggle checked={checked} />
  </div>
);
