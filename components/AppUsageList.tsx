'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AppUsage, formatBytes } from '@/lib/data';

interface AppUsageListProps {
  apps: AppUsage[];
  title?: string;
}

const SORT_LABELS: Record<string, string> = {
  download: 'Telechargement',
  upload: 'Envoi',
  sessions: 'Sessions',
};

export default function AppUsageList({ apps, title = 'Top Applications' }: AppUsageListProps) {
  const [sortBy, setSortBy] = useState<'download' | 'upload' | 'sessions'>('download');

  const maxVal = Math.max(1, ...apps.map(a => a[sortBy]));
  const sorted = [...apps].sort((a, b) => b[sortBy] - a[sortBy]);

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
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-1)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>
            {apps.length} app{apps.length !== 1 ? 's' : ''} actives
          </div>
        </div>
        {/* Sort buttons */}
        <div
          className="flex gap-1 rounded-lg p-1 flex-shrink-0"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
          }}
        >
          {(['download', 'upload', 'sessions'] as const).map(k => (
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
              {SORT_LABELS[k]}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div
        className="flex items-center gap-3"
        style={{
          padding: '6px 16px',
          marginBottom: 4,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ width: 8, flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 10, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.06em' }}>
          APPLICATION
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ width: 80, textAlign: 'right', fontSize: 10, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.06em' }}>
          {SORT_LABELS[sortBy].toUpperCase()}
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
              style={{
                minHeight: 48,
                padding: '12px 16px',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'transparent';
              }}
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
                    letterSpacing: '0.04em',
                  }}
                >
                  {app.category}
                </span>
              </div>

              {/* Mini bar */}
              <div className="flex-1 min-w-0" style={{ maxWidth: 120 }}>
                <div
                  className="rounded-full overflow-hidden"
                  style={{ height: 3, background: 'var(--surface-2)' }}
                >
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

              {/* Value + trend */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0" style={{ width: 80 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: app.color,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {sortBy === 'sessions' ? app.sessions : formatBytes(app[sortBy])}
                </span>
                <div
                  className="flex items-center gap-0.5"
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: app.trend >= 0 ? 'var(--green)' : 'var(--red)',
                  }}
                >
                  {app.trend >= 0 ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                  <span>{Math.abs(app.trend)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
