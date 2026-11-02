import type { SettingsState } from '../ui/Settings';
import type { SiteDraft } from '../ui/SiteDrawer';
import type {
  FileShareItemView,
  LicenseView,
  LogEntry,
  SiteView,
  TrialView,
} from '../ui/types';

export const DEMO_LAN_IP = '192.168.1.24';
export const DEMO_HOME_DIR = '/Users/demo';

export const ACME_LAN_URL = `http://${DEMO_LAN_IP}:5173`;

/** Frozen for Remotion frame determinism (avoid live clock). */
export const ACME_STARTED_AT = 1_700_000_000_000;

export const acmeSite: SiteView = {
  id: 'demo-acme',
  name: 'Acme Dashboard',
  rootDir: `${DEMO_HOME_DIR}/Projects/acme/dist`,
  port: 5173,
  host: '0.0.0.0',
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
  startedAt: ACME_STARTED_AT,
};

export const docsSite: SiteView = {
  id: 'demo-docs',
  name: 'Product Docs',
  rootDir: `${DEMO_HOME_DIR}/Projects/docs/build`,
  port: 4000,
  host: '127.0.0.1',
  domains: ['docs.ls'],
  spaFallback: false,
  https: false,
  proxyRules: [],
  autoStart: true,
  appendCors: false,
  status: 'running',
  startedAt: ACME_STARTED_AT,
};

export const landingSite: SiteView = {
  id: 'demo-landing',
  name: 'Landing Page',
  rootDir: `${DEMO_HOME_DIR}/Projects/landing/out`,
  port: 8080,
  host: '127.0.0.1',
  domains: [],
  spaFallback: true,
  https: false,
  proxyRules: [],
  autoStart: false,
  appendCors: false,
  status: 'stopped',
};

export const adminSite: SiteView = {
  id: 'demo-admin',
  name: 'Admin Console',
  rootDir: `${DEMO_HOME_DIR}/Projects/admin/dist`,
  port: 3000,
  host: '127.0.0.1',
  domains: [],
  spaFallback: true,
  https: false,
  proxyRules: [],
  autoStart: false,
  appendCors: false,
  status: 'error',
  statusMessage: '端口 3000 已被其他站点占用',
};

export const demoSites: SiteView[] = [acmeSite, docsSite, landingSite];

export const demoSitesWithError: SiteView[] = [acmeSite, docsSite, landingSite, adminSite];

export const demoFiles: FileShareItemView[] = [
  { id: 'f-1', fileName: 'Specs.pdf', missing: false },
  { id: 'f-2', fileName: 'Demo.mp4', missing: false },
  { id: 'f-3', fileName: 'Assets.zip', missing: false },
  { id: 'f-4', fileName: 'Mockup.png', missing: false },
  { id: 'f-5', fileName: 'Metrics.xlsx', missing: false },
];

export const acmeLogs: LogEntry[] = [
  { id: 'l1', time: '09:41:02', level: 'info', message: 'Listening on http://0.0.0.0:5173' },
  { id: 'l2', time: '09:41:05', level: 'access', message: 'GET / 200 3.1kB 4ms' },
  { id: 'l3', time: '09:41:05', level: 'access', message: 'GET /assets/index-3f2a.js 200 142kB 6ms' },
  { id: 'l4', time: '09:41:05', level: 'access', message: 'GET /assets/index-9c1d.css 200 18kB 2ms' },
  { id: 'l5', time: '09:41:06', level: 'proxy', message: 'GET /api/me → http://127.0.0.1:9083/api/me 200 12ms' },
  { id: 'l6', time: '09:41:06', level: 'proxy', message: 'GET /api/projects → http://127.0.0.1:9083/api/projects 200 21ms' },
  { id: 'l7', time: '09:41:09', level: 'access', message: 'GET /dashboard/settings 200 (SPA fallback) 3ms' },
  { id: 'l8', time: '09:41:12', level: 'access', message: 'GET /favicon.svg 200 1.2kB 1ms' },
  { id: 'l9', time: '09:41:15', level: 'proxy', message: 'POST /api/projects → http://127.0.0.1:9083/api/projects 201 34ms' },
  { id: 'l10', time: '09:41:18', level: 'error', message: 'GET /old-logo.png 404' },
  { id: 'l11', time: '09:41:21', level: 'access', message: 'GET / 200 3.1kB 3ms (192.168.1.31 · iPhone)' },
  { id: 'l12', time: '09:41:21', level: 'proxy', message: 'GET /api/me → http://127.0.0.1:9083/api/me 200 9ms' },
];

export const demoLicense: LicenseView = {
  priceLabel: 'USD 19.00',
  activationLimit: 3,
};

export const demoTrial: TrialView = {
  remainingMs: 6 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000,
};

export const demoSettings: SettingsState = {
  minimizeToTrayOnClose: true,
  launchAtLogin: false,
  restoreHostsOnQuit: true,
  managedDomains: ['docs.ls'],
  version: '0.1.0',
};

/** The Acme site as typed into the "New site" dialog. */
export const acmeDraft: SiteDraft = {
  name: 'Acme Dashboard',
  rootDir: '~/Projects/acme/dist',
  port: '5173',
  lan: true,
  domainEnabled: false,
  domain: '',
  proxyRules: [
    {
      prefix: '/api',
      target: 'http://127.0.0.1:9083',
      changeOrigin: true,
      rewritePath: false,
    },
  ],
  spaFallback: true,
  appendCors: false,
  autoStart: false,
};
