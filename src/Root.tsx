import React from 'react';
import { Composition } from 'remotion';
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
      />
    </>
  );
};
