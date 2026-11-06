import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import type { Language, Theme } from '../ui/types';
import { BuildSiteScene } from './promo/BuildSiteScene';
import {
  DomainScene,
  EndCardScene,
  FilesScene,
  MenuBarScene,
  PhoneScene,
  ProxyScene,
  SpaScene,
} from './promo/FeatureScenes';
import { PainsScene, TerminalScene } from './promo/HookScenes';
import { Caption } from './promo/shared';

export type PromoSampleProps = {
  theme: Theme;
  language: Language;
};

/** Full promo storyboard S1–S14 (95s) as a rough cut; no VO or music yet. */
export const PromoSample: React.FC<PromoSampleProps> = ({ theme, language }) => {
  const { fps } = useVideoConfig();
  const ui = { theme, language };
  const captions = [
    { from: 0, to: 4, text: 'You built it. Now how do you actually run it?', dark: true },
    { from: 4, to: 9, text: 'Static servers, CORS, broken routes, hosts files, phone testing…', dark: true },
    { from: 9, to: 12, text: 'What if it was just… one app?', dark: true },
    { from: 12, to: 16, text: 'Meet LocalServe. It turns any folder into a local site.' },
    { from: 16, to: 24, text: 'Pick your build folder, choose a port…' },
    { from: 24, to: 28, text: "…and hit start. That's it." },
    { from: 28, to: 31, text: 'Deep links and refreshes just work —' },
    { from: 31, to: 34, text: 'SPA fallback is built in.' },
    { from: 34, to: 39, text: 'Got a backend? Add a proxy rule.' },
    { from: 39, to: 44, text: 'Same origin, no CORS headaches.' },
    { from: 44, to: 48, text: "Give every project a name you'll remember." },
    { from: 48, to: 52, text: 'LocalServe manages hosts for you.' },
    { from: 52, to: 59, text: 'Same Wi-Fi? Scan the code.' },
    { from: 59, to: 66, text: 'Your site — and your API — on any device in the room.' },
    { from: 66, to: 70, text: 'Need to send a file to your phone? Drop it in.' },
    { from: 70, to: 74, text: 'Scan. Done. No cables, no cloud.' },
    { from: 74, to: 79, text: 'Run all your projects side by side, with live logs.' },
    { from: 79, to: 84, text: 'Close the window — it keeps serving from your menu bar.' },
    { from: 84, to: 89, text: 'Try it free for seven days — no account needed.' },
    { from: 89, to: 92, text: "Then buy once, and it's yours forever." },
    { from: 92, to: 95, text: 'LocalServe. Your folder, live in seconds.' },
  ];

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence name="S1 Terminal" durationInFrames={4 * fps}>
        <TerminalScene />
      </Sequence>
      <Sequence name="S2–S3 Pains → Headline" from={4 * fps} durationInFrames={8 * fps}>
        <PainsScene />
      </Sequence>
      <Sequence name="S4–S6 Build site" from={12 * fps} durationInFrames={16 * fps}>
        <BuildSiteScene {...ui} />
      </Sequence>
      <Sequence name="S7 SPA fallback" from={28 * fps} durationInFrames={6 * fps}>
        <SpaScene />
      </Sequence>
      <Sequence name="S8 Proxy" from={34 * fps} durationInFrames={10 * fps}>
        <ProxyScene {...ui} />
      </Sequence>
      <Sequence name="S9 Domain" from={44 * fps} durationInFrames={8 * fps}>
        <DomainScene {...ui} />
      </Sequence>
      <Sequence name="S10–S11 QR → Phone" from={52 * fps} durationInFrames={14 * fps}>
        <PhoneScene {...ui} />
      </Sequence>
      <Sequence name="S12 File share" from={66 * fps} durationInFrames={8 * fps}>
        <FilesScene {...ui} />
      </Sequence>
      <Sequence name="S13 Sites + menu bar" from={74 * fps} durationInFrames={10 * fps}>
        <MenuBarScene {...ui} />
      </Sequence>
      <Sequence name="S14 End card" from={84 * fps} durationInFrames={11 * fps}>
        <EndCardScene {...ui} />
      </Sequence>
      {captions.map((c) => (
        <Sequence
          key={c.text}
          name={`Caption ${c.from}s`}
          from={c.from * fps}
          durationInFrames={(c.to - c.from) * fps}
          layout="none"
        >
          <Caption text={c.text} durationInFrames={(c.to - c.from) * fps} dark={c.dark} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
