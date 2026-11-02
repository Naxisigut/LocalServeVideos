import type { SiteView } from '../ui/types';

export const ACME_LAN_URL = 'http://192.168.1.24:5173';

export const acmeSite: SiteView = {
  id: 'demo-acme',
  name: 'Acme Dashboard',
  rootDir: '~/Projects/acme/dist',
  port: 5173,
  host: '127.0.0.1',
  domains: [],
  spaFallback: true,
  https: false,
  proxyRules: [
    {
      id: 'rule-api',
      prefix: '/api',
      target: 'http://127.0.0.1:9083',
      changeOrigin: true,
      rewritePath: false,
      enabled: true,
    },
  ],
  autoStart: false,
  appendCors: false,
  status: 'running',
  startedAt: Date.now(),
};
