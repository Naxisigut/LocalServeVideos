import React from 'react';
import { useT } from './context';
import { CloseIcon, CopyIcon, ExternalLinkIcon, LinkIcon, PhoneIcon } from './icons';
import { ModalLayer, Tooltip, hoverAttr } from './primitives';
import { QrCode } from './QrCode';

type Props = {
  url: string;
  enter?: number;
  hover?: 'close' | 'copy' | 'open' | 'url';
  tooltip?: 'copy' | 'open';
};

/** "LAN access" dialog with the app's rounded QR code and copy/open actions. */
export const QrPopup: React.FC<Props> = ({ url, enter, hover, tooltip }) => {
  const t = useT();
  const urlParts = url.match(/^(https?:\/\/)(\[[^\]]+\]|[^/:?#]+)(.*)$/);
  return (
    <ModalLayer enter={enter} centerClassName="qr-modal-center" className="qr-modal">
      <div className="qr-modal-header">
        <h2>{t('局域网访问')}</h2>
        <button
          type="button"
          tabIndex={-1}
          className="btn-icon qr-close"
          {...hoverAttr(hover === 'close')}
        >
          <CloseIcon size={12} />
        </button>
      </div>
      <div className="qr-modal-body">
        <div className="qr-code-card">
          <div className="qr-canvas-wrap">
            <QrCode text={url} />
          </div>
          <p className="qr-scan-hint">
            <PhoneIcon size={12} />
            <span>{t('手机与 Mac 连接同一 Wi-Fi 后扫码')}</span>
          </p>
        </div>
        <div className="qr-url-row">
          <span className="qr-url-icon" aria-hidden="true">
            <LinkIcon size={14} />
          </span>
          <button
            type="button"
            tabIndex={-1}
            className="qr-url-text"
            {...hoverAttr(hover === 'url')}
          >
            {urlParts ? (
              <>
                {urlParts[1]}
                <span className="qr-url-host">{urlParts[2]}</span>
                {urlParts[3]}
              </>
            ) : (
              url
            )}
          </button>
          <Tooltip label={t('复制地址')} visible={tooltip === 'copy'}>
            <button
              type="button"
              tabIndex={-1}
              className="btn-icon qr-url-copy"
              {...hoverAttr(hover === 'copy')}
            >
              <CopyIcon size={14} />
            </button>
          </Tooltip>
          <Tooltip label={t('浏览器打开')} visible={tooltip === 'open'}>
            <button
              type="button"
              tabIndex={-1}
              className="btn-icon qr-url-open"
              {...hoverAttr(hover === 'open')}
            >
              <ExternalLinkIcon size={14} />
            </button>
          </Tooltip>
        </div>
      </div>
    </ModalLayer>
  );
};
