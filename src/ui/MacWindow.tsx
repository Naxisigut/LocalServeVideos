import React from 'react';
import './styles/global.css';
import './styles/video.css';
import { UiEnvProvider, type UiEnv } from './context';
import type { Theme } from './types';

/** Size of the real Tauri main window (`tauri.conf.json`). */
export const APP_WINDOW_WIDTH = 667;
export const APP_WINDOW_HEIGHT = 640;

type Props = {
  theme?: Theme;
  width?: number;
  height?: number;
  /** Greyed traffic lights, like an unfocused macOS window. */
  inactive?: boolean;
  env?: Partial<UiEnv>;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/**
 * One LocalServe window: theme scope, traffic lights (drawn by macOS over the
 * app's 36px titlebar via `titleBarStyle: Overlay`), and a shadowed frame.
 * Children are positioned against this box, like the webview viewport.
 */
export const MacWindow: React.FC<Props> = ({
  theme = 'light',
  width = APP_WINDOW_WIDTH,
  height = APP_WINDOW_HEIGHT,
  inactive,
  env,
  style,
  children,
}) => (
  <UiEnvProvider value={env ?? {}}>
    <div
      className={`ls-root ls-window ls-theme-${theme}`}
      style={{ width, height, flexShrink: 0, ...style }}
    >
      {children}
      <div className="ls-traffic-lights" {...(inactive ? { 'data-inactive': '' } : {})}>
        <span />
        <span />
        <span />
      </div>
    </div>
  </UiEnvProvider>
);
