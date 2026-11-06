import React from 'react';
import { Composition, Folder, Still } from 'remotion';
import { PromoSample } from './compositions/PromoSample';
import { UiGallery } from './compositions/UiGallery';
import { UiMotionDemo } from './compositions/UiMotionDemo';
import { UiSmoke } from './compositions/UiSmoke';
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="UiSmoke"
        component={UiSmoke}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ theme: 'light' as const, language: 'en' as const }}
      />
      <Composition
        id="UiMotionDemo"
        component={UiMotionDemo}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ theme: 'light' as const, language: 'en' as const }}
      />
      <Composition
        id="PromoSample"
        component={PromoSample}
        durationInFrames={2850}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ theme: 'light' as const, language: 'en' as const }}
      />
      <Folder name="UI-Gallery">
        <Still id="Ui-Main" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'main' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-Main-Dark" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'main' as const, theme: 'dark' as const, language: 'en' as const }} />
        <Still id="Ui-Main-Zh" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'main' as const, theme: 'light' as const, language: 'zh' as const }} />
        <Still id="Ui-Empty" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'empty' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-Errors" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'errors' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-FileError" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'file-error' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-AddMenu" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'add-menu' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-SiteMenu" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'site-menu' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-ActionBar" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'action-bar' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-NewSite" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'new-site' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-NewSiteFilled" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'new-site-filled' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-Proxy" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'proxy' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-Advanced" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'advanced' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-Qr" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'qr' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-Detail" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'detail' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-Settings" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'settings' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-Pricing" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'pricing' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-TrialEnded" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'trial-ended' as const, theme: 'light' as const, language: 'en' as const }} />
        <Still id="Ui-Tray" component={UiGallery} width={1920} height={1080} defaultProps={{ screen: 'tray' as const, theme: 'dark' as const, language: 'en' as const }} />
      </Folder>
    </>
  );
};
