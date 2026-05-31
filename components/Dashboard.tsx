'use client';

import StatCard from './StatCard';
import TrafficChart from './TrafficChart';
import AppUsageList from './AppUsageList';
import DonutChart from './DonutChart';
import LiveTicker from './LiveTicker';
import {
  TOTAL_DOWNLOAD, TOTAL_UPLOAD, ACTIVE_DEVICES,
  MY_APPS, DEVICES, formatBytes,
} from '@/lib/data';

export default function Dashboard() {
  const totalData = TOTAL_DOWNLOAD + TOTAL_UPLOAD;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="fade-in-up">
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>
          Bonsoir <span className="gradient-text">👋</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Vue d&apos;ensemble de votre réseau · Mis à jour il y a 2s
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total consommé"
          value={formatBytes(totalData)}
          sub="Ce mois-ci"
          icon="⬡"
          color="#00d4ff"
          trend={8}
          delay={0}
        />
        <StatCard
          label="Téléchargement"
          value={formatBytes(TOTAL_DOWNLOAD)}
          sub="↓ Entrant"
          icon="↓"
          color="#7b2fff"
          trend={12}
          delay={100}
        />
        <StatCard
          label="Envoi"
          value={formatBytes(TOTAL_UPLOAD)}
          sub="↑ Sortant"
          icon="↑"
          color="#00ff88"
          trend={-3}
          delay={200}
        />
        <StatCard
          label="Appareils actifs"
          value={`${ACTIVE_DEVICES}/${DEVICES.length}`}
          sub="Connectés au réseau"
          icon="◈"
          color="#ff6b35"
          delay={300}
        />
      </div>

      {/* Live + Chart */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <LiveTicker />
        <TrafficChart />
      </div>

      {/* Apps + Donut */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <AppUsageList apps={MY_APPS} title="Mon iPhone — Top Applications" />
        <DonutChart />
      </div>
    </div>
  );
}
