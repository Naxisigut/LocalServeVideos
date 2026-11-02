export type SiteStatus = 'stopped' | 'starting' | 'running' | 'error';

export type Language = 'zh' | 'en';

export type Theme = 'light' | 'dark';

export interface ProxyRule {
  id: string;
  prefix: string;
  target: string;
  changeOrigin: boolean;
  rewritePath: boolean;
  enabled: boolean;
}

/** Video-side site view (subset aligned with LocalServeTauri contracts). */
export interface SiteView {
  id: string;
  name: string;
  rootDir: string;
  port: number;
  host: string;
  domains: string[];
  spaFallback: boolean;
  https: boolean;
  proxyRules: ProxyRule[];
  autoStart: boolean;
  appendCors: boolean;
  status: SiteStatus;
  statusMessage?: string;
  startedAt?: number;
}

export interface FileShareItemView {
  id: string;
  fileName: string;
  missing: boolean;
}

export type LogLevel = 'access' | 'proxy' | 'error' | 'info';

export interface LogEntry {
  id: string;
  /** Pre-formatted `HH:MM:SS` so renders never depend on the host timezone. */
  time: string;
  level: LogLevel;
  message: string;
}

export interface LicenseView {
  /** e.g. `USD 19.00`; parsed the same way as the Tauri pricing card. */
  priceLabel: string;
  activationLimit: number;
}

export interface TrialView {
  /** Remaining trial time; drives the label and the blue→red fill. */
  remainingMs: number;
}
