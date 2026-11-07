import React from 'react';
import { DISPLAY_FONT, MONO_FONT } from './shared';

const ACCENT = '#4f46e5';

/** Desktop browser chrome with an address bar; `url` is shown verbatim. */
export const BrowserFrame: React.FC<{
  url: React.ReactNode;
  width: number;
  height: number;
  refreshSpin?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ url, width, height, refreshSpin = 0, style, children }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 14,
      overflow: 'hidden',
      background: '#fff',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.12), 0 30px 90px rgba(0,0,0,0.28)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: DISPLAY_FONT,
      ...style,
    }}
  >
    <div style={{ height: 54, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', background: '#f1f2f5', borderBottom: '1px solid #e2e4ea' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} style={{ width: 13, height: 13, borderRadius: '50%', background: c }} />
        ))}
      </div>
      <span style={{ fontSize: 22, color: '#777', rotate: `${refreshSpin * 360}deg`, display: 'inline-block' }}>↻</span>
      <div style={{ flex: 1, height: 34, borderRadius: 9, background: '#fff', border: '1px solid #e2e4ea', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 18, color: '#333', whiteSpace: 'pre' }}>
        {url}
      </div>
    </div>
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>
  </div>
);

/** iPhone-like frame; content area is 330×690. */
export const PhoneFrame: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({
  style,
  children,
}) => (
  <div style={{ width: 360, height: 740, borderRadius: 56, padding: 14, background: '#111', boxShadow: '0 0 0 2px #333, 0 40px 100px rgba(0,0,0,0.35)', ...style }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden', background: '#fff', fontFamily: DISPLAY_FONT }}>
      <div style={{ position: 'absolute', top: 10, left: '50%', translate: '-50% 0', width: 110, height: 32, borderRadius: 20, background: '#111', zIndex: 5 }} />
      {children}
    </div>
  </div>
);

const Stat: React.FC<{ label: string; value: string; delta: string }> = ({ label, value, delta }) => (
  <div style={{ flex: 1, padding: '18px 20px', borderRadius: 14, background: '#fff', boxShadow: '0 0 0 1px #e8e9ef' }}>
    <div style={{ fontSize: 15, color: '#777' }}>{label}</div>
    <div style={{ fontSize: 34, fontWeight: 700, color: '#111', marginTop: 4 }}>{value}</div>
    <div style={{ fontSize: 14, color: '#16a34a', marginTop: 2 }}>{delta}</div>
  </div>
);

const BARS = [42, 58, 50, 72, 64, 86, 78, 92, 70, 96, 88, 100];

/** The demo "Budget Tracker" web app served by LocalServe. */
export const AcmePage: React.FC<{ view: 'overview' | 'settings'; mobile?: boolean }> = ({
  view,
  mobile,
}) => {
  const stats = (
    <>
      <Stat label="Spent this month" value="$1,284" delta="-6.1% vs Oct" />
      <Stat label="Saved" value="$620" delta="+$140" />
      {mobile ? null : <Stat label="Budget left" value="$416" delta="9 days to go" />}
    </>
  );
  if (mobile) {
    return (
      <div style={{ height: '100%', background: '#f6f7fb', padding: '62px 18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700 }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: ACCENT }} /> Budget
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#111' }}>Overview</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{stats}</div>
        <div style={{ flex: 1, borderRadius: 14, background: '#fff', boxShadow: '0 0 0 1px #e8e9ef', padding: 16, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
          {BARS.map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 4, background: i === BARS.length - 1 ? ACCENT : '#c7c9f7' }} />
          ))}
        </div>
      </div>
    );
  }
  const nav = ['Overview', 'Transactions', 'Reports', 'Settings'];
  const active = view === 'overview' ? 'Overview' : 'Settings';
  return (
    <div style={{ height: '100%', display: 'flex', background: '#f6f7fb' }}>
      <div style={{ width: 230, background: '#fff', borderRight: '1px solid #e8e9ef', padding: '26px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: ACCENT }} /> Budget
        </div>
        {nav.map((item) => (
          <div key={item} style={{ padding: '10px 14px', borderRadius: 9, fontSize: 17, color: item === active ? ACCENT : '#555', background: item === active ? '#eef0ff' : 'transparent', fontWeight: item === active ? 600 : 400 }}>
            {item}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '30px 36px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#111' }}>{active}</div>
        {view === 'overview' ? (
          <>
            <div style={{ display: 'flex', gap: 18 }}>{stats}</div>
            <div style={{ flex: 1, borderRadius: 14, background: '#fff', boxShadow: '0 0 0 1px #e8e9ef', padding: 22, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              {BARS.map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 6, background: i === BARS.length - 1 ? ACCENT : '#c7c9f7' }} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ borderRadius: 14, background: '#fff', boxShadow: '0 0 0 1px #e8e9ef', padding: '8px 24px' }}>
            {[['Categories', 'Food · Rent · Fun · Travel'], ['Monthly budget', '$1,700'], ['Currency', 'USD'], ['Sync API', '/api']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid #f0f1f5', fontSize: 18 }}>
                <span style={{ color: '#555' }}>{k}</span>
                <span style={{ color: '#111', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/** One line in the app's log style, floating over the scene. */
export const LogPill: React.FC<{ level: 'access' | 'proxy'; text: string; style?: React.CSSProperties }> = ({
  level,
  text,
  style,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 12, background: 'rgba(17,17,17,0.86)', color: '#e6e9f2', fontFamily: MONO_FONT, fontSize: 18, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,0.25)', ...style }}>
    <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 14, fontWeight: 700, background: level === 'proxy' ? '#7c3aed' : '#16a34a', color: '#fff' }}>
      {level === 'proxy' ? 'PROXY' : 'ACCESS'}
    </span>
    {text}
  </div>
);
