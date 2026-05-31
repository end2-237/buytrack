'use client';

import { useEffect, useState } from 'react';

export default function LiveTicker() {
  const [dl, setDl] = useState(142.3);
  const [ul, setUl] = useState(28.7);
  const [ping, setPing] = useState(12);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDl(v => Math.max(10, v + (Math.random() - 0.5) * 30));
      setUl(v => Math.max(5, v + (Math.random() - 0.5) * 10));
      setPing(v => Math.max(5, Math.min(80, v + Math.floor((Math.random() - 0.5) * 8))));
      setTick(t => t + 1);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="glass rounded-2xl p-5 fade-in-up relative overflow-hidden"
      style={{ animationDelay: '100ms', border: '1px solid rgba(0,255,136,0.12)' }}
    >
      <div className="scan-line" />

      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'blink 1s step-end infinite' }}
        />
        <span style={{ fontSize: 11, color: '#00ff88', letterSpacing: 2, fontWeight: 600 }}>
          LIVE · RÉSEAU
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div style={{ fontSize: 22, fontWeight: 800, color: '#00d4ff', fontVariantNumeric: 'tabular-nums' }}>
            {dl.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 2, letterSpacing: 1 }}>
            Mbps ↓
          </div>
        </div>
        <div className="text-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#7b2fff', fontVariantNumeric: 'tabular-nums' }}>
            {ul.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 2, letterSpacing: 1 }}>
            Mbps ↑
          </div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: 22, fontWeight: 800, color: '#00ff88', fontVariantNumeric: 'tabular-nums' }}>
            {ping}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 2, letterSpacing: 1 }}>
            ms PING
          </div>
        </div>
      </div>

      {/* Mini sparkline bars */}
      <div className="flex gap-0.5 mt-4 items-end" style={{ height: 24 }}>
        {Array.from({ length: 24 }, (_, i) => {
          const age = 23 - i;
          const h = Math.random() * 80 + 10;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: age === 0
                  ? '#00ff88'
                  : `rgba(0,212,255,${0.1 + (i / 23) * 0.4})`,
                transition: 'height 0.3s ease',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
