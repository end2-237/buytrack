'use client';

import { useState } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, Monitor } from 'lucide-react';

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
  {
    id: '1',
    type: 'critical',
    title: 'Consommation elevee',
    message: 'TikTok a consomme 2.3 GB ce mois — 34% de plus qu\'habituellement.',
    time: 'Il y a 2h',
    device: 'iPhone 15 Pro',
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Limite mensuelle',
    message: 'Vous avez atteint 80% de votre quota mensuel de 50 GB.',
    time: 'Il y a 5h',
    device: 'Tous les appareils',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Nouvel appareil detecte',
    message: 'Un nouvel appareil (Galaxy S24) vient de se connecter a votre reseau.',
    time: 'Hier 22:14',
    device: 'Reseau',
    read: false,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Netflix — qualite elevee',
    message: 'Netflix diffuse en 4K sur Samsung TV — 9.8 GB/h de consommation.',
    time: 'Hier 20:30',
    device: 'Samsung TV 4K',
    read: true,
  },
  {
    id: '5',
    type: 'success',
    title: 'Optimisation reussie',
    message: 'WhatsApp a ete optimise automatiquement. Economie de 320 MB ce mois.',
    time: 'Il y a 2j',
    device: 'iPhone 15 Pro',
    read: true,
  },
  {
    id: '6',
    type: 'info',
    title: 'Rapport hebdomadaire',
    message: 'Votre rapport de la semaine est disponible. Consommation totale : 48.2 GB.',
    time: 'Il y a 3j',
    device: 'Tous les appareils',
    read: true,
  },
];

const COLORS: Record<Alert['type'], string> = {
  critical: '#ef4444',
  warning: '#f59e0b',
  info: '#00d4ff',
  success: '#10b981',
};

const ICONS: Record<Alert['type'], React.ComponentType<{ size?: number }>> = {
  critical: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

export default function AlertsView() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = alerts.filter(a => !a.read).length;
  const displayed = filter === 'unread' ? alerts.filter(a => !a.read) : alerts;

  const markAll = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  const markOne = (id: string) =>
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));

  return (
    <div className="flex flex-col gap-5">
      <div className="fade-in-up flex items-start justify-between">
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: 'var(--text-1)' }}>
            Alertes
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>
            {unreadCount} non lue{unreadCount !== 1 ? 's' : ''} · {alerts.length} au total
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAll}
            className="rounded-lg px-4 py-2 transition-all"
            style={{
              fontSize: 12,
              fontWeight: 500,
              background: 'rgba(0,212,255,0.08)',
              color: 'var(--cyan)',
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
            className="rounded-lg px-4 py-2 transition-all"
            style={{
              fontSize: 12,
              fontWeight: 500,
              background: filter === f ? 'rgba(0,212,255,0.12)' : 'var(--surface)',
              color: filter === f ? 'var(--cyan)' : 'var(--text-2)',
              border:
                filter === f
                  ? '1px solid rgba(0,212,255,0.25)'
                  : '1px solid var(--border)',
            }}
          >
            {f === 'all' ? 'Toutes' : `Non lues (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Threshold settings */}
      <div
        className="rounded-xl fade-in-up"
        style={{
          padding: 24,
          background: 'var(--surface)',
          border: '1px solid rgba(245,158,11,0.15)',
          animationDelay: '150ms',
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
          SEUILS D&apos;ALERTE
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Quota mensuel (GB)', value: '50', color: 'var(--amber)' },
            { label: 'Alerte a (%)', value: '80', color: 'var(--amber)' },
            { label: 'Vitesse min. (Mbps)', value: '10', color: 'var(--cyan)' },
            { label: 'Ping max. (ms)', value: '50', color: 'var(--green)' },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.label}</span>
              <div
                className="rounded-lg px-3 py-1"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: s.color,
                  background: `color-mix(in srgb, ${s.color} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${s.color} 25%, transparent)`,
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
          const AlertIcon = ICONS[alert.type];
          return (
            <div
              key={alert.id}
              className="rounded-xl fade-in-up transition-all cursor-pointer"
              style={{
                padding: 24,
                animationDelay: `${200 + i * 60}ms`,
                border: `1px solid ${alert.read ? 'var(--border)' : color + '25'}`,
                background: alert.read ? 'var(--surface)' : `var(--surface)`,
                opacity: alert.read ? 0.7 : 1,
              }}
              onClick={() => markOne(alert.id)}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    background: `${color}12`,
                    border: `1px solid ${color}25`,
                    color,
                  }}
                >
                  <AlertIcon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
                      {alert.title}
                    </span>
                    {!alert.read && (
                      <div
                        className="rounded-full"
                        style={{ width: 6, height: 6, background: color }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--text-2)',
                      marginTop: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    {alert.message}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{alert.time}</span>
                    <div className="flex items-center gap-1">
                      <Monitor size={9} color={color} />
                      <span style={{ fontSize: 10, color }}>{alert.device}</span>
                    </div>
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
