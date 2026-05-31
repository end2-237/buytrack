'use client';

import { useEffect, useState } from 'react';
import { Unplug } from 'lucide-react';
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
      <div
        className="rounded-xl"
        style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Processus reseau</div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="shimmer rounded-lg"
              style={{ height: 48, background: 'var(--surface-2)' }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div
        className="rounded-xl flex flex-col items-center justify-center"
        style={{
          padding: 24,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          minHeight: 200,
          gap: 12,
        }}
      >
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 48,
            height: 48,
            background: 'rgba(100,116,139,0.1)',
            border: '1px solid var(--border)',
            color: 'var(--text-2)',
          }}
        >
          <Unplug size={20} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
          Aucun processus reseau detecte
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', textAlign: 'center', lineHeight: 1.6, maxWidth: 300 }}>
          Lance l&apos;application directement sur un PC Windows pour voir les processus avec connexions actives.
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl"
      style={{
        padding: 24,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
              Processus reseau
            </span>
            <span
              className="rounded px-2 py-0.5"
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.08em',
                background: 'rgba(16,185,129,0.1)',
                color: 'var(--green)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              WINDOWS LIVE
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>
            {apps.length} processus avec connexions TCP actives
          </div>
        </div>
        {/* Sort buttons */}
        <div
          className="flex gap-1 rounded-lg p-1 flex-shrink-0"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          {(['sessions', 'download', 'upload'] as const).map(k => (
            <button
              key={k}
              onClick={() => setSortBy(k)}
              className="rounded-md px-2 py-1 transition-all"
              style={{
                fontSize: 10,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: sortBy === k ? 'rgba(0,212,255,0.12)' : 'transparent',
                color: sortBy === k ? 'var(--cyan)' : 'var(--text-2)',
                border: sortBy === k ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
              }}
            >
              {k === 'sessions' ? 'Connexions' : k === 'download' ? 'DL' : 'UL'}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div
        className="flex items-center gap-3"
        style={{ padding: '6px 16px', marginBottom: 4, borderBottom: '1px solid var(--border)' }}
      >
        <div style={{ width: 8, flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 10, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.06em' }}>
          PROCESSUS
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ width: 80, textAlign: 'right', fontSize: 10, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.06em' }}>
          {sortBy === 'sessions' ? 'CONNEXIONS' : sortBy === 'download' ? 'DL (MB)' : 'UL (MB)'}
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col" style={{ gap: 2 }}>
        {sorted.map(app => {
          const pct = (app[sortBy] / maxVal) * 100;
          return (
            <div
              key={app.id}
              className="flex items-center gap-3 rounded-lg transition-colors"
              style={{ minHeight: 48, padding: '12px 16px', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              {/* Color dot */}
              <div
                className="rounded-full flex-shrink-0"
                style={{ width: 8, height: 8, background: app.color }}
              />

              {/* Name + category */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-1)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {app.name}
                </span>
                <span
                  className="rounded px-1.5 py-0.5 flex-shrink-0"
                  style={{
                    fontSize: 9,
                    color: 'var(--text-2)',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {app.category}
                </span>
              </div>

              {/* Mini bar */}
              <div className="flex-1 min-w-0" style={{ maxWidth: 100 }}>
                <div className="rounded-full overflow-hidden" style={{ height: 3, background: 'var(--surface-2)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${app.color}, ${app.color}80)`,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>

              {/* Value */}
              <div
                style={{
                  width: 80,
                  textAlign: 'right',
                  fontSize: 13,
                  fontWeight: 700,
                  color: app.color,
                  fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0,
                }}
              >
                {sortBy === 'sessions'
                  ? `${app.sessions}`
                  : sortBy === 'download'
                  ? `${app.download} MB`
                  : `${app.upload} MB`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div
        className="rounded-lg mt-4"
        style={{
          padding: '10px 14px',
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.15)',
        }}
      >
        <div style={{ fontSize: 10, color: 'var(--amber)', lineHeight: 1.5 }}>
          Connexions TCP actives (donnees reelles). Les MB/s par processus necessitent des droits Admin Windows.
        </div>
      </div>
    </div>
  );
}
