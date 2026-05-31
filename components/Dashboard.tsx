'use client';

import { useEffect, useState } from 'react';
import { Activity, ArrowDown, ArrowUp, Cpu, Radio } from 'lucide-react';
import StatCard from './StatCard';
import TrafficChart from './TrafficChart';
import RealApps from './RealApps';
import DonutChart from './DonutChart';
import LiveTicker from './LiveTicker';
import { DEVICES, formatBytes } from '@/lib/data';

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
      {/* Header */}
      <div className="fade-in-up flex items-start justify-between">
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: 'var(--text-1)' }}>
            Vue d&apos;ensemble
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>
            {isReal
              ? `Interface active : ${realStats?.iface} · Donnees reelles · mise a jour toutes les 2s`
              : "Vue d'ensemble de votre reseau · Donnees simulees"}
          </div>
        </div>
        {isReal && (
          <div
            className="rounded-lg px-3 py-1.5 flex items-center gap-2"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: 6,
                height: 6,
                background: 'var(--green)',
                animation: 'blink 1s step-end infinite',
              }}
            />
            <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600, letterSpacing: '0.06em' }}>
              DONNEES REELLES
            </span>
          </div>
        )}
      </div>

      {/* Stat cards — 4 cols */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <StatCard
          label="Total consomme"
          value={formatBytes(isReal ? total : 114300)}
          sub={isReal ? 'Depuis demarrage' : 'Ce mois-ci (simule)'}
          icon={Activity}
          color="#00d4ff"
          delay={0}
        />
        <StatCard
          label="Telechargement"
          value={formatBytes(isReal ? dlMB : 101000)}
          sub="Entrant"
          icon={ArrowDown}
          color="#7c3aed"
          trend={isReal ? undefined : 12}
          delay={80}
        />
        <StatCard
          label="Envoi"
          value={formatBytes(isReal ? ulMB : 13300)}
          sub="Sortant"
          icon={ArrowUp}
          color="#10b981"
          trend={isReal ? undefined : -3}
          delay={160}
        />
        <StatCard
          label="Appareils actifs"
          value={isReal ? '1/1' : `4/${DEVICES.length}`}
          sub={isReal ? 'Ce PC uniquement' : 'Connectes (simule)'}
          icon={isReal ? Cpu : Radio}
          color="#f59e0b"
          delay={240}
        />
      </div>

      {/* Live ticker + traffic chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, minWidth: 0 }}>
        <LiveTicker />
        <TrafficChart />
      </div>

      {/* Real apps + donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, minWidth: 0 }}>
        <RealApps />
        <DonutChart />
      </div>
    </div>
  );
}
