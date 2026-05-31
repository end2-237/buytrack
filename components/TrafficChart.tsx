'use client';

import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TIMELINE_24H, TIMELINE_7D } from '@/lib/data';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass rounded-xl p-3"
      style={{ border: '1px solid rgba(0,212,255,0.25)', minWidth: 130 }}
    >
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2" style={{ fontSize: 12, marginBottom: 2 }}>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name === 'download' ? '↓' : '↑'}</span>
          <span style={{ color: p.color, fontWeight: 700 }}>{p.value} MB/s</span>
        </div>
      ))}
    </div>
  );
};

export default function TrafficChart() {
  const [range, setRange] = useState<'24h' | '7j'>('24h');
  const data = range === '24h' ? TIMELINE_24H : TIMELINE_7D;

  return (
    <div
      className="glass rounded-2xl p-5 fade-in-up"
      style={{ animationDelay: '200ms', border: '1px solid rgba(0,212,255,0.1)', minWidth: 0 }}
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Trafic Réseau</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>Débit en temps réel</div>
        </div>
        <div className="flex gap-1 rounded-xl p-1 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['24h', '7j'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="rounded-lg px-3 py-1 transition-all duration-200"
              style={{
                fontSize: 11, fontWeight: 600,
                background: range === r ? 'rgba(0,212,255,0.15)' : 'transparent',
                color: range === r ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: range === r ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 200, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="gDown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7b2fff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7b2fff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#6b8fa8', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#6b8fa8', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="download" stroke="#00d4ff" strokeWidth={2} fill="url(#gDown)" dot={false} activeDot={{ r: 4, fill: '#00d4ff', strokeWidth: 0 }} />
            <Area type="monotone" dataKey="upload" stroke="#7b2fff" strokeWidth={2} fill="url(#gUp)" dot={false} activeDot={{ r: 4, fill: '#7b2fff', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-5 mt-3">
        {[{ label: 'Téléchargement', color: '#00d4ff', s: '↓' }, { label: 'Envoi', color: '#7b2fff', s: '↑' }].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-4 h-0.5 rounded-full" style={{ background: item.color }} />
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.s} {item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
