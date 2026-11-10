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

const RECIPE_ORANGE = '#ea580c';
const SERIF_FONT = "'New York', 'Iowan Old Style', Georgia, 'Times New Roman', serif";

/** Plated lasagna slice on a wooden table, drawn with CSS. */
const LasagnaPhoto: React.FC = () => (
  <div
    style={{
      position: 'relative',
      width: 430,
      height: 360,
      flexShrink: 0,
      borderRadius: 18,
      overflow: 'hidden',
      background:
        'repeating-linear-gradient(8deg, rgba(0,0,0,0.06) 0 3px, transparent 3px 22px), linear-gradient(160deg, #a86b3c 0%, #7a4524 100%)',
      boxShadow: '0 18px 40px rgba(120,53,15,0.25)',
    }}
  >
    <div style={{ position: 'absolute', left: -40, top: -50, width: 180, height: 120, borderRadius: 16, background: 'linear-gradient(135deg, #f5efe4, #e7dcc8)', rotate: '-14deg', boxShadow: '0 8px 18px rgba(0,0,0,0.2)' }} />
    <div style={{ position: 'absolute', left: 40, top: 30, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle at 50% 45%, #ffffff 0 52%, #eef0f2 53% 60%, #ffffff 61% 100%)', boxShadow: '0 14px 30px rgba(0,0,0,0.3)' }} />
    <div
      style={{
        position: 'absolute',
        left: 110,
        top: 120,
        width: 210,
        height: 150,
        borderRadius: '10px 14px 8px 8px',
        background:
          'linear-gradient(180deg, #f2b84b 0 14%, #c2410c 14% 26%, #f7dc8f 26% 34%, #f0c46a 34% 44%, #b91c1c 44% 58%, #fde7a8 58% 66%, #f0c46a 66% 76%, #9a3412 76% 90%, #e9b45c 90% 100%)',
        boxShadow: '6px 10px 18px rgba(0,0,0,0.25)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -6,
          right: -8,
          top: -14,
          height: 30,
          borderRadius: '40% 60% 45% 55% / 70% 70% 30% 30%',
          background:
            'radial-gradient(circle at 22% 50%, #b45309 0 6px, transparent 7px), radial-gradient(circle at 58% 40%, #b45309 0 5px, transparent 6px), radial-gradient(circle at 80% 60%, #92400e 0 4px, transparent 5px), linear-gradient(180deg, #fcd34d, #f59e0b)',
        }}
      />
    </div>
    {[
      { left: 150, top: 92, rotate: -30 },
      { left: 182, top: 86, rotate: 20 },
      { left: 166, top: 100, rotate: 80 },
    ].map((leaf) => (
      <div key={leaf.rotate} style={{ position: 'absolute', left: leaf.left, top: leaf.top, width: 34, height: 18, borderRadius: '50% 50% 50% 50% / 100% 100% 0 0', background: 'linear-gradient(180deg, #4d9a3a, #2f6b22)', rotate: `${leaf.rotate}deg` }} />
    ))}
    <div style={{ position: 'absolute', right: 14, bottom: 14, padding: '6px 12px', borderRadius: 999, background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 14, fontWeight: 600 }}>
      📷 Photo by Mom
    </div>
  </div>
);

/** The demo "Recipe Box" family cookbook site, on Grandma's lasagna. */
export const RecipePage: React.FC = () => {
  const meta = [
    ['Prep', '30 min'],
    ['Cook', '1 hr 15 min'],
    ['Serves', '8'],
  ];
  const ingredients = ['12 lasagna noodles', '1 lb Italian sausage', '24 oz marinara sauce', '15 oz ricotta cheese', '2 cups mozzarella, shredded'];
  const steps = [
    'Brown the sausage with onion and garlic, then stir in the marinara and simmer 20 min.',
    'Mix ricotta, one egg, parsley and half the parmesan in a bowl.',
    'Layer sauce, noodles, ricotta and mozzarella — three times. Finish with cheese.',
  ];
  return (
    <div style={{ height: '100%', background: '#fffaf5', color: '#1f1a17', fontFamily: DISPLAY_FONT }}>
      <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 40px', background: '#7c2d12', color: '#fde7d4', fontSize: 15, fontWeight: 500 }}>
        Family cookbook · 128 recipes · New: Aunt May&apos;s fall soups →
      </div>
      <div style={{ height: 76, display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', background: '#fff', borderBottom: '1px solid #f1e4d8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, background: RECIPE_ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6zM2 11h20M9 7c0-1.5 1-1.5 1-3M14 7c0-1.5 1-1.5 1-3" />
            </svg>
          </span>
          <span style={{ fontFamily: SERIF_FONT, fontSize: 25, fontWeight: 700 }}>Recipe Box</span>
        </div>
        {['Recipes', 'Collections', 'Meal plan', 'Family'].map((item) => (
          <span key={item} style={{ fontSize: 17, fontWeight: item === 'Recipes' ? 600 : 400, color: item === 'Recipes' ? RECIPE_ORANGE : '#5b5048' }}>
            {item}
          </span>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ width: 210, height: 38, borderRadius: 999, background: '#f7efe7', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', fontSize: 15, color: '#9a8b7e' }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#9a8b7e" strokeWidth={2.4} strokeLinecap="round">
            <circle cx={11} cy={11} r={7} />
            <path d="M20 20l-4-4" />
          </svg>
          Search recipes…
        </div>
        <span style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #fdba74, #f97316)', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          S
        </span>
      </div>
      <div style={{ padding: '22px 40px 0' }}>
        <div style={{ fontSize: 14, color: '#9a8b7e' }}>Recipes › Italian › Mains</div>
        <div style={{ display: 'flex', gap: 40, marginTop: 16 }}>
          <LasagnaPhoto />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 6 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Family favorite', 'Freezer-friendly'].map((chip) => (
                <span key={chip} style={{ padding: '5px 12px', borderRadius: 999, background: '#ffedd5', color: '#9a3412', fontSize: 14, fontWeight: 600 }}>
                  {chip}
                </span>
              ))}
            </div>
            <div style={{ fontFamily: SERIF_FONT, fontSize: 50, fontWeight: 700, lineHeight: 1.05, letterSpacing: -0.5, marginTop: 16 }}>Grandma&apos;s lasagna</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, fontSize: 16, color: '#6b5e54' }}>
              <span style={{ color: '#f59e0b', fontSize: 20, letterSpacing: 2 }}>★★★★★</span>
              <b style={{ color: '#1f1a17' }}>4.9</b> · 38 family reviews
            </div>
            <div style={{ fontSize: 18, lineHeight: 1.5, color: '#5b5048', marginTop: 14 }}>
              The Sunday dinner classic — slow-simmered sausage ragù, creamy ricotta and a bubbling mozzarella top.
            </div>
            <div style={{ display: 'flex', marginTop: 20, borderRadius: 14, background: '#fff', boxShadow: '0 0 0 1px #f1e4d8' }}>
              {meta.map(([k, v], i) => (
                <div key={k} style={{ flex: 1, padding: '12px 18px', borderLeft: i ? '1px solid #f1e4d8' : 'none' }}>
                  <div style={{ fontSize: 13, color: '#9a8b7e', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{k}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <span style={{ padding: '12px 24px', borderRadius: 12, background: RECIPE_ORANGE, color: '#fff', fontSize: 17, fontWeight: 700, boxShadow: '0 8px 18px rgba(234,88,12,0.3)' }}>♥ Save recipe</span>
              <span style={{ padding: '12px 24px', borderRadius: 12, background: '#fff', boxShadow: '0 0 0 1px #e9d8c8', fontSize: 17, fontWeight: 600, color: '#5b5048' }}>Print</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 40, marginTop: 30 }}>
          <div style={{ width: 430 }}>
            <div style={{ fontFamily: SERIF_FONT, fontSize: 26, fontWeight: 700 }}>Ingredients</div>
            {ingredients.map((item, i) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1e4d8', fontSize: 17, color: '#3d342e' }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${i < 2 ? RECIPE_ORANGE : '#e0cdbc'}`, background: i < 2 ? RECIPE_ORANGE : 'transparent', color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i < 2 ? '✓' : ''}
                </span>
                <span style={{ textDecoration: i < 2 ? 'line-through' : 'none', color: i < 2 ? '#a8998c' : undefined }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SERIF_FONT, fontSize: 26, fontWeight: 700 }}>Steps</div>
            {steps.map((step, i) => (
              <div key={step} style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 17, lineHeight: 1.45, color: '#3d342e' }}>
                <span style={{ width: 30, height: 30, flexShrink: 0, borderRadius: '50%', background: '#ffedd5', color: '#9a3412', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
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
