import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import appIcon from '../../assets/brand/app-icon.png';
import { DEMO_HOME_DIR, DEMO_LAN_IP, acmeSite, demoFiles, demoTrial, docsSite } from '../demo/acme';
import { AppWindow } from '../ui/AppWindow';
import { MacWindow } from '../ui/MacWindow';
import type { Language, Theme } from '../ui/types';
import { AcmePage, PhoneFrame } from './promo/mocks';
import { DISPLAY_FONT } from './promo/shared';
import { Backdrop } from './Stage';

export type YoutubeThumbnailProps = {
  theme: Theme;
  language: Language;
};

const twoSites = [acmeSite, docsSite];

/** 1280×720 YouTube custom thumbnail: promise on the left, product on the right. */
export const YoutubeThumbnail: React.FC<YoutubeThumbnailProps> = ({ theme, language }) => (
  <Backdrop theme={theme}>
    <AbsoluteFill
      style={{
        fontFamily: DISPLAY_FONT,
        color: '#111',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 48,
          top: 78,
          width: 520,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Img src={appIcon} style={{ width: 72, height: 72 }} />
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              color: '#4b5563',
            }}
          >
            LocalServe
          </div>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: -2.4,
            lineHeight: 0.95,
          }}
        >
          ALL YOUR
          <br />
          APPS
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: -2.4,
            lineHeight: 0.95,
            color: '#4f46e5',
          }}
        >
          ONE HOME
        </div>
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          {['macOS', 'No CLI', '7-day trial'].map((label) => (
            <span
              key={label}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.82)',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
                fontSize: 18,
                fontWeight: 600,
                color: '#1f2937',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 780,
          top: 368,
          translate: '-50% -50%',
          scale: '0.62',
          filter: 'drop-shadow(0 28px 60px rgba(20,24,40,0.22))',
        }}
      >
        <MacWindow theme={theme} env={{ language, localLanIp: DEMO_LAN_IP, homeDir: DEMO_HOME_DIR }}>
          <AppWindow sites={twoSites} files={demoFiles.slice(0, 3)} trial={demoTrial} />
        </MacWindow>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1096,
          top: 392,
          translate: '-50% -50%',
          scale: '0.5',
          rotate: '-7deg',
          filter: 'drop-shadow(0 28px 50px rgba(0,0,0,0.28))',
        }}
      >
        <PhoneFrame>
          <AcmePage view="overview" mobile />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  </Backdrop>
);
