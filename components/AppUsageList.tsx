'use client';

import { useState } from 'react';
import { AppUsage, formatBytes } from '@/lib/data';

interface AppUsageListProps {
  apps: AppUsage[];
  title?: string;
}

export default function AppUsageList({ apps, title = 'Top Applications' }: AppUsageListProps) {
  const [sortBy, setSortBy] = useState<'download' | 'upload' | 'sessions'>('download');

  const maxVal = Math.max(...apps.map(a => a[sortBy]));
  const sorted = [...apps].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div
      className="glass rounded-2xl p-5 fade-in-up"
      style={{ animationDelay: '300ms', border: '1px solid rgba(0,212,255,0.1)', minWidth: 0 }}
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{apps.length} apps actives</div>
        </div>
        <div className="flex gap-1 rounded-xl p-1 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['download', 'upload', 'sessions'] as const).map(k => (
            <button
              key={k}
              onClick={() => setSortBy(k)}
              className="rounded-lg px-2 py-1 transition-all"
              style={{
                fontSize: 10, fontWeight: 600,
                background: sortBy === k ? 'rgba(0,212,255,0.15)' : 'transparent',
                color: sortBy === k ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: sortBy === k ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {k === 'download' ? '↓ DL' : k === 'upload' ? '↑ UL' : 'Sessions'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {sorted.map((app) => {
          const pct = (app[sortBy] / maxVal) * 100;
          return (
            <div
              key={app.id}
              className="rounded-xl p-3 transition-all duration-200 hover:scale-[1.005] cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-lg font-bold flex-shrink-0"
                  style={{ width: 30, height: 30, background: `${app.color}18`, border: `1px solid ${app.color}30`, color: app.color, fontSize: 11 }}
                >
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{app.name}</span>
                    <span className="rounded-full px-1.5" style={{ fontSize: 9, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{app.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <span style={{ fontSize: 10, color: '#00d4ff' }}>↓ {formatBytes(app.download)}</span>
                    <span style={{ fontSize: 10, color: '#7b2fff' }}>↑ {formatBytes(app.upload)}</span>
                  </div>
                  <div className="rounded-full mt-1.5 overflow-hidden" style={{ height: 2, background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${app.color}, ${app.color}70)`, boxShadow: `0 0 4px ${app.color}50`, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span style={{ fontSize: 12, fontWeight: 700, color: app.color }}>
                    {sortBy === 'sessions' ? app.sessions : formatBytes(app[sortBy])}
                  </span>
                  <div
                    className="rounded-full px-1.5 py-0.5"
                    style={{ fontSize: 9, fontWeight: 700, background: app.trend >= 0 ? 'rgba(0,255,136,0.1)' : 'rgba(255,59,59,0.1)', color: app.trend >= 0 ? '#00ff88' : '#ff3b3b' }}
                  >
                    {app.trend >= 0 ? '↑' : '↓'}{Math.abs(app.trend)}%
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
