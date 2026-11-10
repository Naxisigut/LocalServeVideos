import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import type { Language, Theme } from '../ui/types';
import { BuildSiteScene } from './promo/BuildSiteScene';
import { DomainScene, EndCardScene, FilesScene, PhoneScene } from './promo/FeatureScenes';
import { AppsHookScene } from './promo/HookScenes';
import { PowerIntroScene } from './promo/PowerIntroScene';
import { ProxyScene } from './promo/ProxyScene';
import { Caption, SectionTag } from './promo/shared';

export type PromoSampleProps = {
  theme: Theme;
  language: Language;
};

export const PROMO_SAMPLE_SECONDS = 86;

/** Full promo storyboard v6 (86s) as a rough cut; no VO or music yet. */
export const PromoSample: React.FC<PromoSampleProps> = ({ theme, language }) => {
  const { fps } = useVideoConfig();
  const ui = { theme, language };
  // S3 and S7 carry their own headlines, so 14–17s and 36–39s have no caption.
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
    { from: 39, to: 41.8, text: 'When your local site calls a remote server directly,' },
    { from: 41.8, to: 44.3, text: 'it usually gets blocked by CORS.' },
    { from: 44.3, to: 51, text: 'Add a proxy rule in LocalServe, and it goes through.' },
    { from: 51, to: 55, text: "You can give each site a memorable domain name." },
    { from: 55, to: 59, text: 'LocalServe manages hosts for you.' },
    { from: 59, to: 63.5, text: 'You can also open your sites on any device by scanning the QR code,' },
    { from: 63.5, to: 67, text: "as long as it's on the same Wi‑Fi." },
    { from: 67, to: 71, text: 'Same goes for file sharing.' },
    { from: 71, to: 75, text: 'Pick. Scan. Done. No cables, no cloud.' },
    { from: 75, to: 80, text: 'Try it free for seven days — no account needed.' },
    { from: 80, to: 83, text: "Then buy once, and it's yours forever." },
    { from: 83, to: 86, text: 'LocalServe. All your little apps, one home.' },
  ];
  const sections: { from: number; to: number; title: string }[] = [
    { from: 39, to: 51, title: 'API proxy' },
    { from: 51, to: 59, title: 'Custom domains' },
    { from: 59, to: 67, title: 'Open on your phone' },
    { from: 67, to: 75, title: 'File sharing' },
  ];
  const at = (seconds: number) => Math.round(seconds * fps);

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence name="S1–S3 Apps scatter → one home" durationInFrames={at(17)}>
        <AppsHookScene />
      </Sequence>
      <Sequence name="S4–S6 Build site → opens" from={at(17)} durationInFrames={at(19)}>
        <BuildSiteScene {...ui} />
      </Sequence>
      <Sequence name="S7 Power features intro" from={at(36)} durationInFrames={at(3)}>
        <PowerIntroScene />
      </Sequence>
      <Sequence name="S8 Proxy: direct vs LocalServe" from={at(39)} durationInFrames={at(12)}>
        <ProxyScene />
      </Sequence>
      <Sequence name="S9 Domain" from={at(51)} durationInFrames={at(8)}>
        <DomainScene {...ui} />
      </Sequence>
      <Sequence name="S10–S11 QR → Phone" from={at(59)} durationInFrames={at(8)}>
        <PhoneScene {...ui} />
      </Sequence>
      <Sequence name="S12 File share" from={at(67)} durationInFrames={at(8)}>
        <FilesScene {...ui} />
      </Sequence>
      <Sequence name="S13 End card" from={at(75)} durationInFrames={at(11)}>
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
