import React from 'react';
import {
  ACME_LAN_URL,
  DEMO_HOME_DIR,
  DEMO_LAN_IP,
  acmeDraft,
  acmeLogs,
  acmeSite,
  demoFiles,
  demoLicense,
  demoSettings,
  demoSites,
  demoSitesWithError,
  demoTrial,
} from '../demo/acme';
import { AppWindow } from '../ui/AppWindow';
import { LicensePurchaseDialog } from '../ui/License';
import { MacWindow } from '../ui/MacWindow';
import { QrPopup } from '../ui/QrPopup';
import { Settings } from '../ui/Settings';
import { SiteDetail } from '../ui/SiteDetail';
import { SiteDrawer, emptySiteDraft } from '../ui/SiteDrawer';
import { MacMenuBar, TrayMenu } from '../ui/TrayMenu';
import type { Language, Theme } from '../ui/types';
import { Backdrop, Stage } from './Stage';

export type UiScreen =
  | 'main'
  | 'empty'
  | 'errors'
  | 'add-menu'
  | 'site-menu'
  | 'action-bar'
  | 'new-site'
  | 'new-site-filled'
  | 'proxy'
  | 'advanced'
  | 'qr'
  | 'detail'
  | 'settings'
  | 'pricing'
  | 'trial-ended'
  | 'tray';

export type UiGalleryProps = {
  screen: UiScreen;
  theme: Theme;
  language: Language;
};

export const UiGallery: React.FC<UiGalleryProps> = ({ screen, theme, language }) => {
  if (screen === 'tray') return <TrayScreen theme={theme} language={language} />;
  return (
    <Stage theme={theme}>
      <MacWindow
        theme={theme}
        env={{ language, localLanIp: DEMO_LAN_IP, homeDir: DEMO_HOME_DIR }}
      >
        <Screen screen={screen} />
      </MacWindow>
    </Stage>
  );
};

const Screen: React.FC<{ screen: UiScreen }> = ({ screen }) => {
  const base = { sites: demoSites, files: demoFiles, trial: demoTrial };
  switch (screen) {
    case 'main':
      return <AppWindow {...base} />;
    case 'empty':
      return <AppWindow sites={[]} files={[]} trial={demoTrial} />;
    case 'errors':
      return <AppWindow {...base} sites={demoSitesWithError} />;
    case 'add-menu':
      return <AppWindow {...base} titlebarHover="new" addMenuOpen addMenuHover="site" />;
    case 'site-menu':
      return (
        <AppWindow
          {...base}
          siteStates={{ [acmeSite.id]: { hover: 'more', menuOpen: true, menuHover: 'detail' } }}
        />
      );
    case 'action-bar':
      return (
        <AppWindow {...base} actionBar={1} sitesHeadHover="start-all" sitesHeadTooltip="start-all" />
      );
    case 'new-site':
      return <AppWindow {...base} overlay={<SiteDrawer draft={emptySiteDraft} />} />;
    case 'new-site-filled':
      return (
        <AppWindow
          {...base}
          overlay={<SiteDrawer draft={acmeDraft} dirCheck="ok" hover="save-start" />}
        />
      );
    case 'proxy':
      return (
        <AppWindow
          {...base}
          overlay={
            <SiteDrawer
              draft={acmeDraft}
              dirCheck="ok"
              sections={{ basic: false, proxy: true, advanced: false }}
            />
          }
        />
      );
    case 'advanced':
      return (
        <AppWindow
          {...base}
          overlay={
            <SiteDrawer
              mode="edit"
              runningOnOpen
              draft={acmeDraft}
              sections={{ basic: false, proxy: false, advanced: true }}
            />
          }
        />
      );
    case 'qr':
      return <AppWindow {...base} overlay={<QrPopup url={ACME_LAN_URL} />} />;
    case 'detail':
      return (
        <AppWindow {...base} overlay={<SiteDetail site={acmeSite} logs={acmeLogs} urlsOpen />} />
      );
    case 'settings':
      return <AppWindow {...base} overlay={<Settings settings={demoSettings} />} />;
    case 'pricing':
      return (
        <AppWindow
          {...base}
          titlebarHover="trial"
          overlay={<LicensePurchaseDialog license={demoLicense} time={1.5} />}
        />
      );
    case 'trial-ended':
      return (
        <AppWindow
          {...base}
          trial={{ remainingMs: 0 }}
          locked={{ license: demoLicense, time: 3 }}
        />
      );
    default:
      return <AppWindow {...base} />;
  }
};

const TrayScreen: React.FC<{ theme: Theme; language: Language }> = ({ theme, language }) => (
  <Backdrop theme={theme}>
    <div style={{ position: 'absolute', top: 0, left: 0, scale: '1.6', transformOrigin: '0 0' }}>
      <MacMenuBar
        theme={theme}
        width={1200}
        trayActive
        trayMenu={
          <TrayMenu
            sites={demoSites}
            language={language}
            hover={{ kind: 'site', id: acmeSite.id, sub: 'open' }}
          />
        }
      />
    </div>
  </Backdrop>
);
