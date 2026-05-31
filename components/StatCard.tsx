'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  color: string;
  trend?: number;
  delay?: number;
}

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="fade-in-up rounded-xl relative overflow-hidden"
      style={{
        animationDelay: `${delay}ms`,
        padding: 24,
        border: `1px solid ${color}26`,
        background: `linear-gradient(135deg, ${color}07 0%, var(--surface) 100%)`,
        borderTop: `1px solid ${color}40`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 1, background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
      />

      {/* Icon row */}
      <div className="flex items-start justify-between" style={{ marginBottom: 16 }}>
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 32,
            height: 32,
            background: `${color}18`,
            border: `1px solid ${color}28`,
            color,
          }}
        >
          <Icon size={15} />
        </div>
        {trend !== undefined && (
          <div
            className="flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{
              fontSize: 10,
              fontWeight: 700,
              background: trend >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              color: trend >= 0 ? 'var(--green)' : 'var(--red)',
              border: `1px solid ${trend >= 0 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            }}
          >
            {trend >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: 'var(--text-1)',
          letterSpacing: '-0.5px',
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </div>

      {/* Label */}
      <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</div>

      {/* Sub */}
      {sub && (
        <div style={{ fontSize: 11, color, marginTop: 3, fontWeight: 500 }}>{sub}</div>
      )}
    </div>
  );
}
