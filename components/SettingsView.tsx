'use client';

import { useState } from 'react';

export default function SettingsView() {
  const [notifs, setNotifs] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [quota, setQuota] = useState('50');

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="rounded-full transition-all duration-300 relative"
      style={{
        width: 44, height: 24,
        background: value ? 'linear-gradient(90deg, #00d4ff, #7b2fff)' : 'rgba(255,255,255,0.1)',
        border: `1px solid ${value ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: value ? '0 0 12px rgba(0,212,255,0.3)' : 'none',
      }}
    >
      <div
        className="absolute top-0.5 rounded-full transition-all duration-300"
        style={{
          width: 18, height: 18,
          background: '#fff',
          left: value ? 22 : 2,
        }}
      />
    </button>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="fade-in-up">
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>Paramètres</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Configuration de BuyTrack
        </div>
      </div>

      {/* Profile */}
      <div
        className="glass rounded-2xl p-5 fade-in-up"
        style={{ animationDelay: '100ms', border: '1px solid rgba(0,212,255,0.1)' }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Profil</div>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-2xl text-xl"
            style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #00d4ff, #7b2fff)',
              boxShadow: '0 0 20px rgba(0,212,255,0.3)',
            }}
          >
            👤
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Mon compte</div>
            <div style={{ fontSize: 12, color: 'var(--accent-cyan)', marginTop: 2 }}>emansoga@gmail.com</div>
            <div
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 mt-2"
              style={{
                fontSize: 10, fontWeight: 600,
                background: 'rgba(0,212,255,0.1)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0,212,255,0.2)',
              }}
            >
              ★ Premium
            </div>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div
        className="glass rounded-2xl p-5 fade-in-up"
        style={{ animationDelay: '200ms', border: '1px solid rgba(0,212,255,0.1)' }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Préférences</div>
        <div className="flex flex-col gap-4">
          {[
            { label: 'Notifications', sub: 'Alertes de consommation en temps réel', value: notifs, onChange: setNotifs },
            { label: 'Actualisation auto', sub: 'Mise à jour des données toutes les 5s', value: autoRefresh, onChange: setAutoRefresh },
            { label: 'Mode sombre', sub: 'Interface sombre optimisée', value: darkMode, onChange: setDarkMode },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{item.sub}</div>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* Quota */}
      <div
        className="glass rounded-2xl p-5 fade-in-up"
        style={{ animationDelay: '300ms', border: '1px solid rgba(255,184,0,0.12)' }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Quota mensuel</div>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={quota}
            onChange={e => setQuota(e.target.value)}
            className="rounded-xl px-4 py-2 text-center"
            style={{
              width: 100,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,184,0,0.25)',
              color: '#ffb800',
              fontSize: 18,
              fontWeight: 700,
              outline: 'none',
            }}
          />
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>GB / mois</span>
        </div>
        <div className="mt-4 rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: '83%',
              background: 'linear-gradient(90deg, #00ff88, #ffb800)',
              boxShadow: '0 0 10px rgba(255,184,0,0.4)',
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
          41.5 GB utilisés sur {quota} GB (83%)
        </div>
      </div>

      {/* Version */}
      <div
        className="glass rounded-2xl p-4 fade-in-up text-center"
        style={{ animationDelay: '400ms', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="gradient-text font-bold text-lg">BuyTrack</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
          Version 1.0.0 · Premium · Net Monitor
        </div>
      </div>
    </div>
  );
}
