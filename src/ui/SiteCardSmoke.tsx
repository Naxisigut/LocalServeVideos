import React from 'react';
import type { SiteView } from './types';
import {
  ExternalLinkIcon,
  FolderIcon,
  MoreIcon,
  QrCodeIcon,
  StopIcon,
} from './icons';

const STATUS_TEXT: Record<SiteView['status'], string> = {
  running: 'Running',
  stopped: 'Stopped',
  error: 'Error',
  starting: 'Starting',
};

/** Presentational site card for Remotion; buttons are inert. */
export const SiteCardSmoke: React.FC<{ site: SiteView }> = ({ site }) => {
  const running = site.status === 'running';

  return (
    <div className="site-card" data-status={site.status}>
      <div className="site-card-left">
        <div className="site-card-title-row">
          <span className="site-name" title={site.name}>
            {site.name}
          </span>
          <span className={`status-badge status-${site.status}`}>
            <span className="status-dot" />
            {STATUS_TEXT[site.status]}
          </span>
        </div>

        <div className="path-row">
          <span className="path-icon" aria-hidden="true">
            <FolderIcon />
          </span>
          <span className="path-text" title={site.rootDir}>
            {site.rootDir}
          </span>
        </div>
      </div>

      <div className="site-card-right">
        <div className="site-card-tools">
          <div
            className={`site-card-port-wrap${running ? ' is-visible' : ''}`}
            aria-hidden={!running}
          >
            <div className="site-card-port">
              <span>Port</span>
              <span className="site-card-port-value">{site.port}</span>
            </div>
          </div>
          <button type="button" className="btn-icon" aria-label="Open in browser" tabIndex={-1}>
            <ExternalLinkIcon />
          </button>
          <button type="button" className="btn-icon" aria-label="QR" tabIndex={-1}>
            <QrCodeIcon />
          </button>
          <div className="site-card-menu">
            <button
              type="button"
              className="btn-icon site-card-more"
              aria-label="More"
              tabIndex={-1}
            >
              <MoreIcon />
            </button>
          </div>
        </div>
        {running ? (
          <button
            type="button"
            className="btn-icon btn-action-stop"
            aria-label="Stop"
            tabIndex={-1}
          >
            <StopIcon />
          </button>
        ) : null}
      </div>
    </div>
  );
};
