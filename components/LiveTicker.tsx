'use client';

import { useEffect, useState } from 'react';

type Stats = {
  dlMbps: number;
  ulMbps: number;
  ping: number;
  iface: string;
  totalDownloadMB: number;
  totalUploadMB: number;
};

export default function LiveTicker() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bars, setBars] = useState<number[]>(Array(20).fill(5));
  const [error, setError] = useState(false);

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.error) throw new Error();
      setStats(data);
      setError(false);
      setBars(prev => [...prev.slice(1), Math.min(100, data.dlMbps * 2 + 5)]);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const dl = stats?.dlMbps ?? 0;
  const ul = stats?.ulMbps ?? 0;
  const ping = stats?.ping ?? 0;

  return (
    <div
      className="glass rounded-2xl p-5 fade-in-up relative overflow-hidden flex flex-col"
      style={{ animationDelay: '100ms', border: `1px solid ${error ? 'rgba(255,59,59,0.2)' : 'rgba(0,255,136,0.15)'}`, minWidth: 0 }}
    >
      <div className="scan-line" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: error ? '#ff3b3b' : '#00ff88',
              boxShadow: `0 0 8px ${error ? '#ff3b3b' : '#00ff88'}`,
              animation: 'blink 1s step-end infinite',
            }}
          />
          <span style={{ fontSize: 10, color: error ? '#ff3b3b' : '#00ff88', letterSpacing: 2, fontWeight: 700 }}>
            {error ? 'HORS LIGNE' : 'LIVE · RÉEL'}
          </span>
        </div>
        {stats?.iface && (
          <span style={{ fontSize: 9, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>
            {stats.iface}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1">
        <div className="flex flex-col items-center justify-center rounded-xl py-3" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#00d4ff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {dl.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 4, letterSpacing: 1 }}>Mbps ↓</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl py-3" style={{ background: 'rgba(123,47,255,0.05)', border: '1px solid rgba(123,47,255,0.1)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#7b2fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {ul.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 4, letterSpacing: 1 }}>Mbps ↑</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl py-3" style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#00ff88', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {ping > 0 ? ping : '—'}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 4, letterSpacing: 1 }}>ms PING</div>
        </div>
      </div>

      <div className="flex gap-0.5 mt-4 items-end" style={{ height: 28 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${Math.max(4, h)}%`,
              background: i === bars.length - 1 ? '#00ff88' : `rgba(0,212,255,${0.08 + (i / bars.length) * 0.45})`,
              transition: 'height 0.5s ease',
            }}
          />
        ))}
      </div>

      {stats && (
        <div className="flex justify-between mt-2">
          <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>Session ↓ {stats.totalDownloadMB >= 1024 ? (stats.totalDownloadMB/1024).toFixed(1)+'GB' : stats.totalDownloadMB+'MB'}</span>
          <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>↑ {stats.totalUploadMB >= 1024 ? (stats.totalUploadMB/1024).toFixed(1)+'GB' : stats.totalUploadMB+'MB'}</span>
        </div>
      )}
    </div>
  );
}
