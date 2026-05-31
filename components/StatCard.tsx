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
      className="glass rounded-2xl p-5 fade-in-up relative overflow-hidden"
      style={{
        animationDelay: `${delay}ms`,
        border: `1px solid ${color}20`,
        background: `linear-gradient(135deg, ${color}08, rgba(5,12,20,0.8))`,
      }}
    >
      {/* Subtle top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 40, height: 40,
            background: `${color}18`,
            border: `1px solid ${color}30`,
            fontSize: 18,
            boxShadow: `0 0 15px ${color}20`,
          }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{
              fontSize: 11,
              fontWeight: 600,
              background: trend >= 0 ? 'rgba(0,255,136,0.1)' : 'rgba(255,59,59,0.1)',
              color: trend >= 0 ? '#00ff88' : '#ff3b3b',
              border: `1px solid ${trend >= 0 ? '#00ff8830' : '#ff3b3b30'}`,
            }}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: -0.5 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
      {sub && (
        <div style={{ fontSize: 11, color, marginTop: 4, opacity: 0.8 }}>{sub}</div>
      )}
    </div>
  );
}
