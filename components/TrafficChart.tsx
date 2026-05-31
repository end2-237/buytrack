'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TIMELINE_7D } from '@/lib/data';
import { loadHistory, saveHistory } from '@/lib/storage';

type Point = { time: string; download: number; upload: number };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      padding: '10px 14px',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-active)',
      borderRadius: 8,
      minWidth: 130,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-2)', marginBottom: 8, letterSpacing: '0.04em' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2" style={{ fontSize: 12, marginBottom: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--text-2)' }}>{p.name === 'download' ? 'Download' : 'Upload'}</span>
          <span style={{ color: p.color, fontWeight: 700, marginLeft: 'auto', paddingLeft: 8 }}>{p.value} Mbps</span>
        </div>
      ))}
    </div>
  );
};

export default function TrafficChart() {
  const [range, setRange] = useState<'live' | '7j'>('live');
  const [liveHistory, setLiveHistory] = useState<Point[]>([]);
  const [isReal, setIsReal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Charge l'historique persisté
    const stored = loadHistory();
    if (stored.length > 0) {
      setLiveHistory(stored);
      setIsReal(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function fetchHistory() {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) return;
        const data = await res.json();
        if (data.error) return;
        if (data.history?.length > 0) {
          setLiveHistory(data.history);
          saveHistory(data.history);
          setIsReal(true);
        }
      } catch {}
    }
    fetchHistory();
    const interval = setInterval(fetchHistory, 2000);
    return () => clearInterval(interval);
  }, [mounted]);

  const data = range === 'live'
    ? (liveHistory.length > 0 ? liveHistory : [{ time: '--', download: 0, upload: 0 }])
    : TIMELINE_7D;

  return (
    <div
      className="rounded-xl fade-in-up"
      style={{
        padding: 24,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        minWidth: 0,
        animationDelay: '200ms',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Trafic réseau</span>
            {isReal && range === 'live' && (
              <span className="rounded px-2 py-0.5" style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                background: 'rgba(16,185,129,0.1)', color: 'var(--green)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
                RÉEL
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>
            {range === 'live' ? 'Mise à jour toutes les 2s' : '7 derniers jours'}
          </div>
        </div>
        <div className="flex gap-1 rounded-lg p-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          {(['live', '7j'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="rounded-md px-3 py-1 transition-all"
              style={{
                fontSize: 11, fontWeight: 600,
                background: range === r ? 'rgba(0,212,255,0.12)' : 'transparent',
                color: range === r ? 'var(--cyan)' : 'var(--text-2)',
                border: range === r ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
              }}
            >
              {r === 'live' ? 'Live' : '7j'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart — only render after mount to avoid SSR width=-1 */}
      <div style={{ height: 200, width: '100%' }}>
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gDl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gUl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--purple)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--purple)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: 'var(--text-2)', fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: 'var(--text-2)', fontSize: 9 }} axisLine={false} tickLine={false} width={38} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="download" stroke="var(--cyan)" strokeWidth={1.5} fill="url(#gDl)" dot={false} activeDot={{ r: 3, fill: 'var(--cyan)', strokeWidth: 0 }} />
              <Area type="monotone" dataKey="upload" stroke="var(--purple)" strokeWidth={1.5} fill="url(#gUl)" dot={false} activeDot={{ r: 3, fill: 'var(--purple)', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="shimmer rounded-lg" style={{ height: '100%', background: 'var(--surface-2)' }} />
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-5" style={{ marginTop: 14 }}>
        {[
          { label: 'Download', color: 'var(--cyan)' },
          { label: 'Upload', color: 'var(--purple)' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div style={{ width: 16, height: 2, borderRadius: 1, background: item.color }} />
            <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
