'use client';

import { useEffect, useState } from 'react';

export default function LiveTicker() {
  const [dl, setDl] = useState(142.3);
  const [ul, setUl] = useState(28.7);
  const [ping, setPing] = useState(12);
  const [bars, setBars] = useState(() => Array.from({ length: 20 }, () => Math.random() * 80 + 10));

  useEffect(() => {
    const interval = setInterval(() => {
      setDl(v => Math.max(10, v + (Math.random() - 0.5) * 30));
      setUl(v => Math.max(5, v + (Math.random() - 0.5) * 10));
      setPing(v => Math.max(5, Math.min(80, v + Math.floor((Math.random() - 0.5) * 8))));
      setBars(prev => [...prev.slice(1), Math.random() * 80 + 10]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="glass rounded-2xl p-5 fade-in-up relative overflow-hidden flex flex-col"
      style={{ animationDelay: '100ms', border: '1px solid rgba(0,255,136,0.15)', minWidth: 0 }}
    >
      <div className="scan-line" />

      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'blink 1s step-end infinite' }}
        />
        <span style={{ fontSize: 10, color: '#00ff88', letterSpacing: 2, fontWeight: 700 }}>LIVE · RÉSEAU</span>
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1">
        <div className="flex flex-col items-center justify-center rounded-xl py-3" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#00d4ff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {dl.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 4, letterSpacing: 1 }}>Mbps ↓</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl py-3" style={{ background: 'rgba(123,47,255,0.05)', border: '1px solid rgba(123,47,255,0.1)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#7b2fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {ul.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 4, letterSpacing: 1 }}>Mbps ↑</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl py-3" style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#00ff88', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {ping}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 4, letterSpacing: 1 }}>ms PING</div>
        </div>
      </div>

      <div className="flex gap-0.5 mt-4 items-end" style={{ height: 28 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background: i === bars.length - 1
                ? '#00ff88'
                : `rgba(0,212,255,${0.08 + (i / bars.length) * 0.45})`,
              transition: 'height 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
