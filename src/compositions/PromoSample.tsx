import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import type { Language, Theme } from '../ui/types';
import { BuildSiteScene } from './promo/BuildSiteScene';
import {
  DomainScene,
  EndCardScene,
  FilesScene,
  PhoneScene,
  ProxyScene,
  SpaScene,
} from './promo/FeatureScenes';
import { AppsHookScene } from './promo/HookScenes';
import { Caption } from './promo/shared';

export type PromoSampleProps = {
  theme: Theme;
  language: Language;
};

export const PROMO_SAMPLE_SECONDS = 87;

/** Full promo storyboard v3, S1–S13 (87s) as a rough cut; no VO or music yet. */
export const PromoSample: React.FC<PromoSampleProps> = ({ theme, language }) => {
  const { fps } = useVideoConfig();
  const ui = { theme, language };
  // S3 carries its own headline, so 11–14s has no caption.
  const captions = [
    { from: 0, to: 2.2, text: 'With AI, anyone can build little web apps' },
    { from: 2.2, to: 4, text: '— just for themselves.' },
    { from: 4, to: 7.2, text: "But they're scattered all over your Mac." },
    { from: 7.2, to: 9.3, text: 'Some open with a double-click —' },
    { from: 9.3, to: 11, text: 'others need a server just to load.' },
    { from: 14, to: 16, text: 'Meet LocalServe.' },
    { from: 16, to: 18, text: 'Any folder, a local site. No terminal, no cloud.' },
    { from: 18, to: 26, text: 'Pick the folder, choose a port…' },
    { from: 26, to: 30, text: "…and hit start. That's it." },
    { from: 30, to: 32, text: 'Remember the one that only showed a blank page?' },
    { from: 32, to: 36, text: 'Now it just works — deep links and refreshes too.' },
    { from: 36, to: 41, text: 'Need it to talk to an API? Add a proxy rule.' },
    { from: 41, to: 46, text: 'Same origin, no CORS headaches.' },
    { from: 46, to: 50, text: "Give every app a name you'll remember." },
    { from: 50, to: 54, text: 'LocalServe manages hosts for you.' },
    { from: 54, to: 61, text: 'Same Wi-Fi? Scan the code.' },
    { from: 61, to: 68, text: 'Your app — and its API — on any device in the room.' },
    { from: 68, to: 72, text: 'Need to send a file to your phone? Drop it in.' },
    { from: 72, to: 76, text: 'Scan. Done. No cables, no cloud.' },
    { from: 76, to: 81, text: 'Try it free for seven days — no account needed.' },
    { from: 81, to: 84, text: "Then buy once, and it's yours forever." },
    { from: 84, to: 87, text: 'LocalServe. All your little apps, one home.' },
  ];
  const at = (seconds: number) => Math.round(seconds * fps);

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence name="S1–S3 Apps scatter → one home" durationInFrames={at(14)}>
        <AppsHookScene />
      </Sequence>
      <Sequence name="S4–S6 Build site" from={at(14)} durationInFrames={at(16)}>
        <BuildSiteScene {...ui} />
      </Sequence>
      <Sequence name="S7 Blank page → served" from={at(30)} durationInFrames={at(6)}>
        <SpaScene />
      </Sequence>
      <Sequence name="S8 Proxy" from={at(36)} durationInFrames={at(10)}>
        <ProxyScene {...ui} />
      </Sequence>
      <Sequence name="S9 Domain" from={at(46)} durationInFrames={at(8)}>
        <DomainScene {...ui} />
      </Sequence>
      <Sequence name="S10–S11 QR → Phone" from={at(54)} durationInFrames={at(14)}>
        <PhoneScene {...ui} />
      </Sequence>
      <Sequence name="S12 File share" from={at(68)} durationInFrames={at(8)}>
        <FilesScene {...ui} />
      </Sequence>
      <Sequence name="S13 End card" from={at(76)} durationInFrames={at(11)}>
        <EndCardScene {...ui} />
      </Sequence>
      {captions.map((c) => (
        <Sequence
          key={c.text}
          name={`Caption ${c.from}s`}
          from={at(c.from)}
          durationInFrames={at(c.to) - at(c.from)}
          layout="none"
        >
          <Caption text={c.text} durationInFrames={at(c.to) - at(c.from)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
