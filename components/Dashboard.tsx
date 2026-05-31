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
    <div className="flex flex-col gap-5">
      <div className="fade-in-up">
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
          Bonsoir <span className="gradient-text">👋</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
          Vue d&apos;ensemble de votre réseau · Mis à jour il y a 2s
        </div>
      </div>

      {/* Stat cards — 4 colonnes fixes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Total consommé" value={formatBytes(totalData)} sub="Ce mois-ci" icon="⬡" color="#00d4ff" trend={8} delay={0} />
        <StatCard label="Téléchargement" value={formatBytes(TOTAL_DOWNLOAD)} sub="↓ Entrant" icon="↓" color="#7b2fff" trend={12} delay={80} />
        <StatCard label="Envoi" value={formatBytes(TOTAL_UPLOAD)} sub="↑ Sortant" icon="↑" color="#00ff88" trend={-3} delay={160} />
        <StatCard label="Appareils actifs" value={`${ACTIVE_DEVICES}/${DEVICES.length}`} sub="Connectés" icon="◈" color="#ff6b35" delay={240} />
      </div>

      {/* Live + Chart — ratio 1:2.5 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 12, minWidth: 0 }}>
        <LiveTicker />
        <TrafficChart />
      </div>

      {/* Apps list + Donut — ratio 3:2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12, minWidth: 0 }}>
        <AppUsageList apps={MY_APPS} title="Mon iPhone — Top Applications" />
        <DonutChart />
      </div>
    </div>
  );
}
