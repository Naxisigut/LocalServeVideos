import React, { createContext, useCallback, useContext } from 'react';
import { translate, type TranslationParams } from './i18n';
import type { Language } from './types';

export interface UiEnv {
  language: Language;
  /** LAN address shown in QR / detail links; null hides LAN entries like the app. */
  localLanIp: string | null;
  /** Used to compact absolute paths to `~/…` the same way the app does. */
  homeDir: string;
}

const defaultEnv: UiEnv = {
  language: 'en',
  localLanIp: '192.168.1.24',
  homeDir: '/Users/demo',
};

const UiEnvContext = createContext<UiEnv>(defaultEnv);

export const UiEnvProvider: React.FC<{
  value: Partial<UiEnv>;
  children: React.ReactNode;
}> = ({ value, children }) => {
  const parent = useContext(UiEnvContext);
  return (
    <UiEnvContext.Provider value={{ ...parent, ...value }}>
      {children}
    </UiEnvContext.Provider>
  );
};

export const useUiEnv = (): UiEnv => useContext(UiEnvContext);

export const useT = () => {
  const { language } = useUiEnv();
  return useCallback(
    (message: string, params?: TranslationParams) =>
      translate(language, message, params),
    [language],
  );
};

export const compactHomePath = (path: string, homeDir: string): string => {
  if (!homeDir) return path;
  if (path === homeDir) return '~';
  if (path.startsWith(homeDir + '/')) return '~' + path.slice(homeDir.length);
  return path;
};
