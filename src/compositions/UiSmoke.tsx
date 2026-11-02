import React from 'react';
import { DEMO_HOME_DIR, DEMO_LAN_IP, demoFiles, demoSites, demoTrial } from '../demo/acme';
import { AppWindow } from '../ui/AppWindow';
import { MacWindow } from '../ui/MacWindow';
import type { Language, Theme } from '../ui/types';
import { Stage } from './Stage';

export type UiSmokeProps = {
  theme: Theme;
  language: Language;
};

export const UiSmoke: React.FC<UiSmokeProps> = ({ theme, language }) => (
  <Stage theme={theme}>
    <MacWindow theme={theme} env={{ language, localLanIp: DEMO_LAN_IP, homeDir: DEMO_HOME_DIR }}>
      <AppWindow sites={demoSites} files={demoFiles} trial={demoTrial} />
    </MacWindow>
  </Stage>
);
