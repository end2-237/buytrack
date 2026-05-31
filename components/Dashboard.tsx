'use client';

import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import TrafficChart from './TrafficChart';
import RealApps from './RealApps';
import DonutChart from './DonutChart';
import LiveTicker from './LiveTicker';
import { MY_APPS, DEVICES, formatBytes } from '@/lib/data';

export default function Dashboard() {
  const [realStats, setRealStats] = useState<{
    totalDownloadMB: number;
    totalUploadMB: number;
    iface: string;
  } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (!data.error) setRealStats(data);
      } catch {}
    }
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const dlMB = realStats?.totalDownloadMB ?? 0;
  const ulMB = realStats?.totalUploadMB ?? 0;
  const total = dlMB + ulMB;

  const isReal = realStats !== null;

  return (
    <div className="flex flex-col gap-5">
      <div className="fade-in-up flex items-start justify-between">
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
            Bonsoir <span className="gradient-text">👋</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
            {isReal
              ? `Interface active : ${realStats?.iface} · Données réelles · mise à jour toutes les 2s`
              : 'Vue d\'ensemble de votre réseau · Données simulées'
            }
          </div>
        </div>
        {isReal && (
          <div className="rounded-xl px-3 py-1.5 flex items-center gap-2" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88', animation: 'blink 1s step-end infinite' }} />
            <span style={{ fontSize: 11, color: '#00ff88', fontWeight: 600 }}>Linux · Données réelles</span>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard
          label="Total consommé"
          value={formatBytes(isReal ? total : 114300)}
          sub={isReal ? 'Depuis démarrage' : 'Ce mois-ci (simulé)'}
          icon="⬡" color="#00d4ff" delay={0}
        />
        <StatCard
          label="Téléchargement"
          value={formatBytes(isReal ? dlMB : 101000)}
          sub="↓ Entrant"
          icon="↓" color="#7b2fff" trend={isReal ? undefined : 12} delay={80}
        />
        <StatCard
          label="Envoi"
          value={formatBytes(isReal ? ulMB : 13300)}
          sub="↑ Sortant"
          icon="↑" color="#00ff88" trend={isReal ? undefined : -3} delay={160}
        />
        <StatCard
          label="Appareils actifs"
          value={isReal ? '1/1' : `4/${DEVICES.length}`}
          sub={isReal ? 'Ce PC uniquement' : 'Connectés (simulé)'}
          icon="◈" color="#ff6b35" delay={240}
        />
      </div>

      {/* Live + Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 12, minWidth: 0 }}>
        <LiveTicker />
        <TrafficChart />
      </div>

      {/* Apps réelles + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12, minWidth: 0 }}>
        <RealApps />
        <DonutChart />
      </div>
    </div>
  );
}
