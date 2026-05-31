'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MY_APPS, formatBytes } from '@/lib/data';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      padding: '10px 14px',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-active)',
      borderRadius: 8,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: d.color }}>{d.name}</div>
      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3 }}>{formatBytes(d.download)}</div>
    </div>
  );
};

export default function DonutChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const top5 = [...MY_APPS].sort((a, b) => b.download - a.download).slice(0, 5);
  const total = top5.reduce((s, a) => s + a.download, 0);

  return (
    <div
      className="rounded-xl fade-in-up"
      style={{
        padding: 24,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        minWidth: 0,
        animationDelay: '400ms',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>
        Répartition
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 16 }}>
        Top 5 — téléchargement
      </div>

      <div style={{ height: 170 }}>
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={top5}
                cx="50%" cy="50%"
                innerRadius={52} outerRadius={76}
                paddingAngle={3}
                dataKey="download"
                strokeWidth={0}
              >
                {top5.map(app => (
                  <Cell key={app.id} fill={app.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="shimmer rounded-full mx-auto" style={{ width: 152, height: 152, background: 'var(--surface-2)' }} />
        )}
      </div>

      <div className="flex flex-col" style={{ gap: 8, marginTop: 12 }}>
        {top5.map(app => (
          <div key={app.id} className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: app.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {app.name}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: app.color, flexShrink: 0 }}>
              {((app.download / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
