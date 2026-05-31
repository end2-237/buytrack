'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MY_APPS, formatBytes } from '@/lib/data';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass rounded-xl p-3" style={{ border: '1px solid rgba(0,212,255,0.2)' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: d.color }}>{d.name}</div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
        {formatBytes(d.download)}
      </div>
    </div>
  );
};

export default function DonutChart() {
  const top5 = [...MY_APPS].sort((a, b) => b.download - a.download).slice(0, 5);
  const total = top5.reduce((s, a) => s + a.download, 0);

  return (
    <div
      className="glass rounded-2xl p-6 fade-in-up"
      style={{ animationDelay: '400ms', border: '1px solid rgba(0,212,255,0.1)' }}
    >
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Répartition</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
        Top 5 apps par téléchargement
      </div>

      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={top5}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="download"
            >
              {top5.map((app) => (
                <Cell
                  key={app.id}
                  fill={app.color}
                  stroke="transparent"
                  style={{ filter: `drop-shadow(0 0 6px ${app.color}60)` }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {top5.map(app => (
          <div key={app.id} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: app.color }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{app.name}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: app.color }}>
              {((app.download / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
