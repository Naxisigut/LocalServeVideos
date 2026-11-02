import React from 'react';
import { AbsoluteFill } from 'remotion';
import '../ui/styles/global.css';
import { AppShell } from '../ui/AppShell';
import { SiteCardSmoke } from '../ui/SiteCardSmoke';
import { acmeSite } from '../demo/acme';

export const UiSmoke: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: '#0b0f14',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
      }}
    >
      <div style={{ width: 720, maxWidth: '100%' }}>
        <AppShell>
          <SiteCardSmoke site={acmeSite} />
        </AppShell>
      </div>
    </AbsoluteFill>
  );
};
