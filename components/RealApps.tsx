'use client';

import { useEffect, useState } from 'react';
import { AppUsage } from '@/lib/data';

type Process = AppUsage & { sessions: number };

export default function RealApps() {
  const [apps, setApps] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'sessions' | 'download' | 'upload'>('sessions');

  async function fetchProcesses() {
    try {
      const res = await fetch('/api/processes');
      const data = await res.json();
      if (data.processes?.length > 0) setApps(data.processes);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    fetchProcesses();
    const interval = setInterval(fetchProcesses, 5000);
    return () => clearInterval(interval);
  }, []);

  const sorted = [...apps].sort((a, b) => b[sortBy] - a[sortBy]);
  const maxVal = Math.max(1, ...sorted.map(a => a[sortBy]));

  if (loading) {
    return (
      <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div style={{ fontSize: 15, fontWeight: 600 }}>Processus réseau</div>
        </div>
        <div className="flex flex-col gap-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="rounded-xl shimmer" style={{ height: 52, background: 'rgba(255,255,255,0.03)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(255,184,0,0.15)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#ffb800', marginBottom: 8 }}>⚠ Aucun processus réseau détecté</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Lance l&apos;app avec <code style={{ color: '#00ff88', background: 'rgba(0,255,136,0.1)', padding: '1px 6px', borderRadius: 4 }}>npm run dev</code> directement sur ton PC Windows pour voir tes apps actives.
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 fade-in-up" style={{ border: '1px solid rgba(0,212,255,0.1)', minWidth: 0 }}>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 15, fontWeight: 600 }}>Processus réseau</span>
            <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700, background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}>
              WINDOWS · RÉEL
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{apps.length} apps avec connexions actives</div>
        </div>
        <div className="flex gap-1 rounded-xl p-1 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['sessions', 'download', 'upload'] as const).map(k => (
            <button key={k} onClick={() => setSortBy(k)}
              className="rounded-lg px-2 py-1 transition-all"
              style={{ fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
                background: sortBy === k ? 'rgba(0,212,255,0.15)' : 'transparent',
                color: sortBy === k ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: sortBy === k ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
              }}
            >
              {k === 'sessions' ? '⚡ Conx' : k === 'download' ? '↓ DL' : '↑ UL'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {sorted.map(app => {
          const pct = (app[sortBy] / maxVal) * 100;
          return (
            <div key={app.id} className="rounded-xl p-3 transition-all hover:scale-[1.005] cursor-default"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-lg font-bold flex-shrink-0 text-sm"
                  style={{ width: 32, height: 32, background: `${app.color}18`, border: `1px solid ${app.color}30`, color: app.color }}>
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.name}</span>
                    <span className="rounded-full px-1.5 flex-shrink-0" style={{ fontSize: 9, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{app.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <span style={{ fontSize: 10, color: '#00ff88', fontWeight: 600 }}>{app.sessions} connexions TCP</span>
                  </div>
                  <div className="rounded-full mt-1.5 overflow-hidden" style={{ height: 2, background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${app.color}, ${app.color}70)`, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span style={{ fontSize: 12, fontWeight: 700, color: app.color }}>
                    {sortBy === 'sessions' ? `${app.sessions}` : sortBy === 'download' ? `${app.download} MB` : `${app.upload} MB`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(255,184,0,0.05)', border: '1px solid rgba(255,184,0,0.12)' }}>
        <div style={{ fontSize: 10, color: '#ffb800', lineHeight: 1.5 }}>
          ⚠ Connexions TCP actives (réelles). Les MB/s par process nécessitent des droits Admin Windows pour être exacts.
        </div>
      </div>
    </div>
  );
}
