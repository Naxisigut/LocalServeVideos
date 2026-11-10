import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import type { Language, Theme } from '../ui/types';
import { BuildSiteScene } from './promo/BuildSiteScene';
import { DomainScene, EndCardScene, FilesScene, PhoneScene } from './promo/FeatureScenes';
import { AppsHookScene } from './promo/HookScenes';
import { ProxyScene } from './promo/ProxyScene';
import { Caption, SectionTag } from './promo/shared';

export type PromoSampleProps = {
  theme: Theme;
  language: Language;
};

export const PROMO_SAMPLE_SECONDS = 83;

/** Full promo storyboard v5 (83s) as a rough cut; no VO or music yet. */
export const PromoSample: React.FC<PromoSampleProps> = ({ theme, language }) => {
  const { fps } = useVideoConfig();
  const ui = { theme, language };
  // S3 carries its own headline, so 14–17s has no caption.
  const captions = [
    { from: 0, to: 3.5, text: 'With AI, anyone can build little web apps' },
    { from: 3.5, to: 6, text: '— just for themselves.' },
    { from: 6, to: 8.3, text: "But they're scattered all over your Mac." },
    { from: 8.3, to: 12.2, text: 'Some pages just open and work.' },
    { from: 12.2, to: 14, text: 'Others only load through a local server.' },
    { from: 17, to: 19, text: 'Meet LocalServe.' },
    { from: 19, to: 21, text: 'Any folder, a local site. No terminal, no cloud.' },
    { from: 21, to: 29, text: 'Pick the folder, choose a port…' },
    { from: 29, to: 32, text: "…and hit start. That's it." },
    { from: 32, to: 36, text: 'That blank page from before? Now it just works.' },
    { from: 36, to: 39, text: 'Need more? Here are a few power features.' },
    { from: 39, to: 41.3, text: 'Call your API directly, and the browser blocks it.' },
    { from: 41.3, to: 48, text: 'Add a proxy rule — LocalServe passes it through.' },
    { from: 48, to: 52, text: "Give every app a name you'll remember." },
    { from: 52, to: 56, text: 'LocalServe manages hosts for you.' },
    { from: 56, to: 59, text: 'Take it to your phone. Scan the code.' },
    { from: 59, to: 64, text: 'Your app — and its API — on any device in the room.' },
    { from: 64, to: 68, text: 'Send files to your phone, too.' },
    { from: 68, to: 72, text: 'Drop them in. Scan. Done. No cables, no cloud.' },
    { from: 72, to: 77, text: 'Try it free for seven days — no account needed.' },
    { from: 77, to: 80, text: "Then buy once, and it's yours forever." },
    { from: 80, to: 83, text: 'LocalServe. All your little apps, one home.' },
  ];
  const sections: { from: number; to: number; title: string }[] = [
    { from: 36, to: 48, title: 'API proxy' },
    { from: 48, to: 56, title: 'Custom domains' },
    { from: 56, to: 64, title: 'Open on your phone' },
    { from: 64, to: 72, title: 'File sharing' },
  ];
  const at = (seconds: number) => Math.round(seconds * fps);

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence name="S1–S3 Apps scatter → one home" durationInFrames={at(17)}>
        <AppsHookScene />
      </Sequence>
      <Sequence name="S4–S7 Build site → opens" from={at(17)} durationInFrames={at(19)}>
        <BuildSiteScene {...ui} />
      </Sequence>
      <Sequence name="S8 Proxy: direct vs LocalServe" from={at(36)} durationInFrames={at(12)}>
        <ProxyScene />
      </Sequence>
      <Sequence name="S9 Domain" from={at(48)} durationInFrames={at(8)}>
        <DomainScene {...ui} />
      </Sequence>
      <Sequence name="S10–S11 QR → Phone" from={at(56)} durationInFrames={at(8)}>
        <PhoneScene {...ui} />
      </Sequence>
      <Sequence name="S12 File share" from={at(64)} durationInFrames={at(8)}>
        <FilesScene {...ui} />
      </Sequence>
      <Sequence name="S13 End card" from={at(72)} durationInFrames={at(11)}>
        <EndCardScene {...ui} />
      </Sequence>
      {sections.map((sec) => (
        <Sequence key={sec.title} name={`Section ${sec.title}`} from={at(sec.from)} durationInFrames={at(sec.to) - at(sec.from)} layout="none">
          <SectionTag title={sec.title} durationInFrames={at(sec.to) - at(sec.from)} />
        </Sequence>
      ))}
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
