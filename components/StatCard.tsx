'use client';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  color: string;
  trend?: number;
  delay?: number;
}

export default function StatCard({ label, value, sub, icon, color, trend, delay = 0 }: StatCardProps) {
  return (
    <div
      className="glass rounded-2xl p-4 fade-in-up relative overflow-hidden"
      style={{
        animationDelay: `${delay}ms`,
        border: `1px solid ${color}25`,
        background: `linear-gradient(135deg, ${color}06 0%, rgba(5,12,20,0.9) 100%)`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }}
      />

      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 36, height: 36,
            background: `${color}15`,
            border: `1px solid ${color}30`,
            fontSize: 15,
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-0.5 rounded-full px-2 py-0.5"
            style={{
              fontSize: 11, fontWeight: 700,
              background: trend >= 0 ? 'rgba(0,255,136,0.12)' : 'rgba(255,59,59,0.12)',
              color: trend >= 0 ? '#00ff88' : '#ff3b3b',
              border: `1px solid ${trend >= 0 ? '#00ff8828' : '#ff3b3b28'}`,
            }}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: -1, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
      {sub && (
        <div style={{ fontSize: 11, color, marginTop: 2, fontWeight: 500 }}>{sub}</div>
      )}
    </div>
  );
}
