'use client';

import { useEffect, useState } from 'react';
import { saveHistory, loadHistory, saveSession, loadSession, HistoryPoint } from '@/lib/storage';

type Stats = {
  dlMbps: number;
  ulMbps: number;
  ping: number;
  iface: string;
  totalDownloadMB: number;
  totalUploadMB: number;
};

function formatMB(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

export default function LiveTicker() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [session, setSession] = useState(loadSession());
  const [error, setError] = useState(false);

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.error) throw new Error();
      setStats(data);
      setError(false);

      const timeLabel = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      setHistory(prev => {
        const next = [...prev, { time: timeLabel, download: data.dlMbps, upload: data.ulMbps }];
        const trimmed = next.slice(-48);
        saveHistory(trimmed);
        return trimmed;
      });

      const s = { dl: data.totalDownloadMB, ul: data.totalUploadMB };
      setSession(s);
      saveSession(s.dl, s.ul);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    const stored = loadHistory();
    if (stored.length > 0) setHistory(stored);

    const storedSession = loadSession();
    if (storedSession.dl > 0 || storedSession.ul > 0) setSession(storedSession);

    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dl = stats?.dlMbps ?? 0;
  const ul = stats?.ulMbps ?? 0;
  const ping = stats?.ping ?? 0;

  const sparkMax = Math.max(1, ...history.map(h => h.download));

  return (
    <div
      className="rounded-xl flex flex-col"
      style={{
        padding: 24,
        background: 'var(--surface)',
        border: `1px solid ${error ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
        minWidth: 0,
        gap: 16,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="rounded-full flex-shrink-0"
            style={{
              width: 7,
              height: 7,
              background: error ? 'var(--red)' : 'var(--green)',
              animation: 'blink 1.2s step-end infinite',
            }}
          />
          <span
            style={{
              fontSize: 10,
              letterSpacing: '0.12em',
              fontWeight: 700,
              color: error ? 'var(--red)' : 'var(--green)',
            }}
          >
            {error ? 'HORS LIGNE' : 'LIVE'}
          </span>
        </div>
        {stats?.iface && (
          <span
            className="rounded"
            style={{
              fontSize: 9,
              color: 'var(--text-2)',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              padding: '2px 6px',
              letterSpacing: '0.06em',
            }}
          >
            {stats.iface}
          </span>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3" style={{ gap: 8 }}>
        {[
          { label: 'Mbps', sub: 'Download', value: dl.toFixed(1), color: 'var(--cyan)' },
          { label: 'Mbps', sub: 'Upload', value: ul.toFixed(1), color: 'var(--purple)' },
          { label: 'ms', sub: 'Ping', value: ping > 0 ? String(ping) : '—', color: 'var(--green)' },
        ].map(m => (
          <div
            key={m.sub}
            className="flex flex-col items-center justify-center rounded-lg"
            style={{
              padding: '10px 4px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: m.color,
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
            >
              {m.value}
            </span>
            <span style={{ fontSize: 8, color: 'var(--text-2)', marginTop: 4, letterSpacing: '0.08em' }}>
              {m.label}
            </span>
            <span style={{ fontSize: 8, color: 'var(--text-3)', marginTop: 1, letterSpacing: '0.06em' }}>
              {m.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div className="flex items-end" style={{ height: 32, gap: 2 }}>
        {(history.length > 0 ? history : Array(20).fill({ download: 0 })).map((pt, i) => {
          const pct = (pt.download / sparkMax) * 100;
          const isLast = i === history.length - 1;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all duration-300"
              style={{
                height: `${Math.max(6, pct)}%`,
                background: isLast ? 'var(--cyan)' : `rgba(0,212,255,${0.08 + (i / Math.max(history.length, 20)) * 0.4})`,
              }}
            />
          );
        })}
      </div>

      {/* Session */}
      <div className="flex justify-between" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: 'var(--text-2)', letterSpacing: '0.08em' }}>SESSION DL</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)', marginTop: 2 }}>
            {formatMB(session.dl)}
          </div>
        </div>
        <div className="text-right">
          <div style={{ fontSize: 9, color: 'var(--text-2)', letterSpacing: '0.08em' }}>SESSION UL</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)', marginTop: 2 }}>
            {formatMB(session.ul)}
          </div>
        </div>
      </div>
    </div>
  );
}
