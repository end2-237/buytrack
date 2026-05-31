'use client';

import { useEffect, useState } from 'react';
import { AppUsage } from '@/lib/data';
import AppUsageList from './AppUsageList';

export default function RealApps() {
  const [apps, setApps] = useState<AppUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReal, setIsReal] = useState(false);

  async function fetchProcesses() {
    try {
      const res = await fetch('/api/processes');
      const data = await res.json();
      if (data.processes?.length > 0) {
        setApps(data.processes);
        setIsReal(true);
      }
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    fetchProcesses();
    const interval = setInterval(fetchProcesses, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full shimmer" style={{ background: 'rgba(0,212,255,0.2)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Lecture des processus réseau...</span>
        </div>
      </div>
    );
  }

  if (!isReal || apps.length === 0) {
    return (
      <div
        className="glass rounded-2xl p-5"
        style={{ border: '1px solid rgba(255,184,0,0.15)', background: 'rgba(255,184,0,0.03)' }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: '#ffb800', marginBottom: 6 }}>
          ⚠ Données réelles non disponibles
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          L&apos;API <code style={{ color: '#00d4ff', background: 'rgba(0,212,255,0.1)', padding: '1px 4px', borderRadius: 3 }}>/proc/[pid]/net/dev</code> nécessite que le serveur tourne sur Linux avec les permissions suffisantes.
          <br /><br />
          Lance l&apos;app localement sur ton PC avec <code style={{ color: '#00ff88', background: 'rgba(0,255,136,0.1)', padding: '1px 4px', borderRadius: 3 }}>npm run dev</code> pour voir les vraies données.
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="absolute -top-2 -right-2 rounded-full px-2 py-0.5 z-10"
        style={{ fontSize: 9, fontWeight: 700, background: 'rgba(0,255,136,0.15)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.25)' }}
      >
        DONNÉES RÉELLES
      </div>
      <AppUsageList apps={apps} title="Processus réseau — Ce PC" />
    </div>
  );
}
