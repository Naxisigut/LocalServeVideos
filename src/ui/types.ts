export type SiteStatus = 'stopped' | 'starting' | 'running' | 'error';

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
