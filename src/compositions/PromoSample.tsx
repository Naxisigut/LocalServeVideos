import { Audio } from '@remotion/media';
import React from 'react';
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Language, Theme } from '../ui/types';
import { BuildSiteScene } from './promo/BuildSiteScene';
import { DomainScene, EndCardScene, FilesScene, PhoneScene } from './promo/FeatureScenes';
import { AppsHookScene } from './promo/HookScenes';
import { PowerIntroScene } from './promo/PowerIntroScene';
import { ProxyScene } from './promo/ProxyScene';
import { Caption, SectionTag } from './promo/shared';
import { PROMO_VO_CUES } from './promo/voiceover';

export type PromoSampleProps = {
  theme: Theme;
  language: Language;
};

export const PROMO_SAMPLE_SECONDS = 74;

/** Full promo storyboard v9 (74s) as a rough cut; placeholder VO + Pixabay BGM. */
export const PromoSample: React.FC<PromoSampleProps> = ({ theme, language }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const bgmVolume = 0.18;
  const ui = { theme, language };
  // S7 carries its own headline, so 33.5–36.5s has no caption.
  const captions = [
    { from: 0, to: 3.5, text: 'With AI, anyone can build little web apps' },
    { from: 3.5, to: 6, text: '— just for themselves.' },
    { from: 6, to: 8.3, text: "But they're scattered all over your Mac." },
    { from: 8.3, to: 11.9, text: 'Some pages just open and work.' },
    { from: 11.9, to: 14, text: 'Others only load through a local server.' },
    { from: 14.9, to: 17, text: 'What if they all had one home?' },
    { from: 17, to: 18.6, text: 'Meet LocalServe.' },
    { from: 18.6, to: 22.5, text: 'It turns any folder into a local site — no terminal, no cloud.' },
    { from: 22.5, to: 26.5, text: 'Pick the folder, choose a port…' },
    { from: 26.5, to: 29.5, text: "…and hit start. That's it." },
    { from: 29.5, to: 33.5, text: 'That blank page from before? Now it just works.' },
    { from: 36.5, to: 39.3, text: 'When your local site calls a remote server directly,' },
    { from: 39.3, to: 41.8, text: 'it usually gets blocked by CORS.' },
    { from: 41.8, to: 47, text: 'Add a proxy rule in LocalServe, and it goes through.' },
    { from: 47, to: 49.8, text: "You can give each site a memorable domain name." },
    { from: 49.8, to: 52.5, text: 'LocalServe manages hosts for you.' },
    { from: 52.5, to: 57, text: 'You can also open your sites on any device by scanning the QR code,' },
    { from: 57, to: 59.4, text: "as long as it's on the same Wi‑Fi." },
    { from: 59.4, to: 61.4, text: 'Same goes for file sharing.' },
    { from: 61.4, to: 64.8, text: 'Pick. Scan. Done. No cables, no cloud.' },
    { from: 64.8, to: 67.7, text: 'Try it free for seven days — no account needed.' },
    { from: 67.7, to: 70.3, text: "Then buy once, and it's yours forever." },
    { from: 70.3, to: 74, text: 'LocalServe. All your little apps, one home.' },
  ];
  const sections: { from: number; to: number; title: string }[] = [
    { from: 36.5, to: 47, title: 'API proxy' },
    { from: 47, to: 52.5, title: 'Custom domains' },
    { from: 52.5, to: 59.4, title: 'Open on your phone' },
    { from: 59.4, to: 64.8, title: 'File sharing' },
  ];
  const at = (seconds: number) => Math.round(seconds * fps);

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        translate: '-1px 0px',
        scale: 1.031
      }}
    >
      <Sequence name="S1–S3 Apps scatter → one home" durationInFrames={at(17)}>
        <AppsHookScene />
      </Sequence>
      <Sequence name="S4–S6 Build site → opens" from={at(17)} durationInFrames={at(16.5)}>
        <BuildSiteScene {...ui} />
      </Sequence>
      <Sequence name="S7 Power features intro" from={at(33.5)} durationInFrames={at(3)}>
        <PowerIntroScene />
      </Sequence>
      <Sequence name="S8 Proxy: direct vs LocalServe" from={at(36.5)} durationInFrames={at(10.5)}>
        <ProxyScene />
      </Sequence>
      <Sequence name="S9 Domain" from={at(47)} durationInFrames={at(5.5)}>
        <DomainScene {...ui} />
      </Sequence>
      <Sequence name="S10–S11 QR → Phone" from={at(52.5)} durationInFrames={at(6.9)}>
        <PhoneScene {...ui} />
      </Sequence>
      <Sequence name="S12 File share" from={at(59.4)} durationInFrames={at(5.4)}>
        <FilesScene {...ui} />
      </Sequence>
      <Sequence name="S13 End card" from={at(64.8)} durationInFrames={at(9.2)}>
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
      <Audio
        name="BGM"
        src={staticFile('music/product-tutorial-background.mp3')}
        volume={interpolate(frame, [0, 1 * fps, durationInFrames - 2 * fps, durationInFrames], [0, bgmVolume, bgmVolume, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
      />
      {PROMO_VO_CUES.map((cue) => (
        <Audio key={cue.id} name={`VO ${cue.id}`} from={at(cue.from)} src={staticFile(`voiceover/promo/${cue.id}.wav`)} />
      ))}
    </AbsoluteFill>
  );
};
