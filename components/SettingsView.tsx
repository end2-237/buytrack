'use client';

import { useState } from 'react';
import { User, Bell, RefreshCw, Moon, Star } from 'lucide-react';

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!value)}
    className="rounded-full transition-all duration-300 relative flex-shrink-0"
    style={{
      width: 44,
      height: 24,
      background: value
        ? 'linear-gradient(90deg, var(--cyan), var(--purple))'
        : 'rgba(255,255,255,0.08)',
      border: `1px solid ${value ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
    }}
  >
    <div
      className="absolute top-0.5 rounded-full transition-all duration-300"
      style={{
        width: 18,
        height: 18,
        background: '#fff',
        left: value ? 22 : 2,
      }}
    />
  </button>
);

export default function SettingsView() {
  const [notifs, setNotifs] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [quota, setQuota] = useState('50');

  return (
    <div className="flex flex-col gap-5">
      <div className="fade-in-up">
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: 'var(--text-1)' }}>
          Parametres
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
          Configuration de BuyTrack
        </div>
      </div>

      {/* Profile */}
      <div
        className="rounded-xl fade-in-up"
        style={{
          padding: 24,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          animationDelay: '100ms',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-2)',
            marginBottom: 16,
            letterSpacing: '0.06em',
          }}
        >
          PROFIL
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 52,
              height: 52,
              background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
              color: '#fff',
            }}
          >
            <User size={22} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>
              Mon compte
            </div>
            <div style={{ fontSize: 12, color: 'var(--cyan)', marginTop: 2 }}>
              emansoga@gmail.com
            </div>
            <div
              className="inline-flex items-center gap-1 rounded px-2 py-0.5 mt-2"
              style={{
                fontSize: 10,
                fontWeight: 600,
                background: 'rgba(0,212,255,0.1)',
                color: 'var(--cyan)',
                border: '1px solid rgba(0,212,255,0.2)',
              }}
            >
              <Star size={9} />
              <span>Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div
        className="rounded-xl fade-in-up"
        style={{
          padding: 24,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          animationDelay: '200ms',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-2)',
            marginBottom: 16,
            letterSpacing: '0.06em',
          }}
        >
          PREFERENCES
        </div>
        <div className="flex flex-col gap-5">
          {[
            {
              icon: Bell,
              label: 'Notifications',
              sub: 'Alertes de consommation en temps reel',
              value: notifs,
              onChange: setNotifs,
            },
            {
              icon: RefreshCw,
              label: 'Actualisation auto',
              sub: 'Mise a jour des donnees toutes les 5s',
              value: autoRefresh,
              onChange: setAutoRefresh,
            },
            {
              icon: Moon,
              label: 'Mode sombre',
              sub: 'Interface sombre optimisee',
              value: darkMode,
              onChange: setDarkMode,
            },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: 32,
                      height: 32,
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-2)',
                    }}
                  >
                    <Icon size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>
                      {item.sub}
                    </div>
                  </div>
                </div>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quota */}
      <div
        className="rounded-xl fade-in-up"
        style={{
          padding: 24,
          background: 'var(--surface)',
          border: '1px solid rgba(245,158,11,0.15)',
          animationDelay: '300ms',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-2)',
            marginBottom: 16,
            letterSpacing: '0.06em',
          }}
        >
          QUOTA MENSUEL
        </div>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={quota}
            onChange={e => setQuota(e.target.value)}
            className="rounded-lg px-4 py-2 text-center"
            style={{
              width: 100,
              background: 'var(--surface-2)',
              border: '1px solid rgba(245,158,11,0.25)',
              color: 'var(--amber)',
              fontSize: 18,
              fontWeight: 700,
              outline: 'none',
            }}
          />
          <span style={{ fontSize: 14, color: 'var(--text-2)' }}>GB / mois</span>
        </div>
        <div
          className="rounded-full overflow-hidden"
          style={{ height: 4, background: 'rgba(255,255,255,0.05)', marginTop: 16 }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: '83%',
              background: 'linear-gradient(90deg, var(--green), var(--amber))',
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 6 }}>
          41.5 GB utilises sur {quota} GB (83%)
        </div>
      </div>

      {/* Version */}
      <div
        className="rounded-xl fade-in-up text-center"
        style={{
          padding: 24,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          animationDelay: '400ms',
        }}
      >
        <div className="gradient-text font-bold" style={{ fontSize: 16 }}>BuyTrack</div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>
          Version 1.0.0 · Premium · Net Monitor
        </div>
      </div>
    </div>
  );
}
