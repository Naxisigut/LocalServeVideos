import React from 'react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="app"
      style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}
    >
      <div className="titlebar">
        <div className="titlebar-drag" />
        <span className="titlebar-label">LocalServe</span>
        <div className="titlebar-actions" />
      </div>
      <div className="content-area">
        <section className="sites-section">
          <div className="section-head">
            <div className="section-head-left">
              <div className="section-head-title-line">
                <span className="section-title">Sites</span>
              </div>
            </div>
          </div>
          {children}
        </section>
      </div>
    </div>
  );
};
