'use client';

import { useState } from 'react';

type Alert = {
  id: string;
  type: 'warning' | 'info' | 'critical' | 'success';
  title: string;
  message: string;
  time: string;
  device: string;
  read: boolean;
};

const ALERTS: Alert[] = [
  { id: '1', type: 'critical', title: 'Consommation élevée', message: 'TikTok a consommé 2.3 GB ce mois — 34% de plus qu\'habituellement.', time: 'Il y a 2h', device: 'iPhone 15 Pro', read: false },
  { id: '2', type: 'warning', title: 'Limite mensuelle', message: 'Vous avez atteint 80% de votre quota mensuel de 50 GB.', time: 'Il y a 5h', device: 'Tous les appareils', read: false },
  { id: '3', type: 'info', title: 'Nouvel appareil détecté', message: 'Un nouvel appareil (Galaxy S24) vient de se connecter à votre réseau.', time: 'Hier 22:14', device: 'Réseau', read: false },
  { id: '4', type: 'warning', title: 'Netflix — qualité élevée', message: 'Netflix diffuse en 4K sur Samsung TV — 9.8 GB/h de consommation.', time: 'Hier 20:30', device: 'Samsung TV 4K', read: true },
  { id: '5', type: 'success', title: 'Optimisation réussie', message: 'WhatsApp a été optimisé automatiquement. Économie de 320 MB ce mois.', time: 'Il y a 2j', device: 'iPhone 15 Pro', read: true },
  { id: '6', type: 'info', title: 'Rapport hebdomadaire', message: 'Votre rapport de la semaine est disponible. Consommation totale: 48.2 GB.', time: 'Il y a 3j', device: 'Tous les appareils', read: true },
];

const COLORS = {
  critical: '#ff3b3b',
  warning: '#ffb800',
  info: '#00d4ff',
  success: '#00ff88',
};

const ICONS = {
  critical: '⚠',
  warning: '◎',
  info: 'ℹ',
  success: '✓',
};

export default function AlertsView() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = alerts.filter(a => !a.read).length;
  const displayed = filter === 'unread' ? alerts.filter(a => !a.read) : alerts;

  const markAll = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  const markOne = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));

  return (
    <div className="flex flex-col gap-6">
      <div className="fade-in-up flex items-start justify-between">
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>Alertes</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {unreadCount} non lue{unreadCount > 1 ? 's' : ''} · {alerts.length} au total
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAll}
            className="rounded-xl px-4 py-2 transition-all"
            style={{
              fontSize: 12, fontWeight: 500,
              background: 'rgba(0,212,255,0.1)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
          >
            Tout marquer lu
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 fade-in-up" style={{ animationDelay: '100ms' }}>
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-xl px-4 py-2 transition-all"
            style={{
              fontSize: 12, fontWeight: 500,
              background: filter === f ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
              color: filter === f ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              border: filter === f ? '1px solid rgba(0,212,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {f === 'all' ? 'Toutes' : `Non lues (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Threshold settings */}
      <div
        className="glass rounded-2xl p-5 fade-in-up"
        style={{ animationDelay: '150ms', border: '1px solid rgba(255,184,0,0.12)' }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>⚙ Seuils d&apos;alerte</div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Quota mensuel (GB)', value: '50', color: '#ffb800' },
            { label: 'Alerte à (%)', value: '80', color: '#ffb800' },
            { label: 'Vitesse min. (Mbps)', value: '10', color: '#00d4ff' },
            { label: 'Ping max. (ms)', value: '50', color: '#00ff88' },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</span>
              <div
                className="rounded-lg px-3 py-1"
                style={{
                  fontSize: 13, fontWeight: 700, color: s.color,
                  background: `${s.color}15`, border: `1px solid ${s.color}25`,
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert list */}
      <div className="flex flex-col gap-3">
        {displayed.map((alert, i) => {
          const color = COLORS[alert.type];
          return (
            <div
              key={alert.id}
              className="glass rounded-2xl p-4 fade-in-up cursor-pointer transition-all hover:scale-[1.005]"
              style={{
                animationDelay: `${200 + i * 60}ms`,
                border: `1px solid ${alert.read ? 'rgba(255,255,255,0.05)' : color + '25'}`,
                background: alert.read ? 'var(--glass-bg)' : `${color}05`,
                opacity: alert.read ? 0.7 : 1,
              }}
              onClick={() => markOne(alert.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: 36, height: 36,
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    color, fontSize: 16,
                    boxShadow: alert.read ? 'none' : `0 0 12px ${color}30`,
                  }}
                >
                  {ICONS[alert.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {alert.title}
                    </span>
                    {!alert.read && (
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                    {alert.message}
                  </div>
                  <div className="flex gap-3 mt-2">
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{alert.time}</span>
                    <span style={{ fontSize: 10, color }}>◈ {alert.device}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
